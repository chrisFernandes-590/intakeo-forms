import { createServer } from "../src/server.js";
import {
  BadRequestError,
  UnauthorizedError,
} from "../src/common/errors/index.js";
import { loadConfig } from "../src/config/env.js";
import { Hono } from "hono";
import { errorHandler } from "../src/plugins/error-handler.js";

async function runVerification() {
  console.log("🧪 Starting API Verification Tests...\n");

  // 1. Test Env Loading
  console.log("1. Testing Environment Validation...");
  const config = loadConfig();
  console.log(
    `   ✅ Config loaded successfully (Port: ${config.PORT}, Env: ${config.NODE_ENV})`,
  );

  // 2. Test Server Creation
  console.log("\n2. Testing Server Creation & Global Middleware...");
  const app = createServer({ config });
  console.log("   ✅ Server initialized successfully");

  // 3. Test Root Route & Success Response Format
  console.log("\n3. Testing GET / (Root Endpoint)...");
  const rootRes = await app.request("/");
  const rootData = await rootRes.json();
  console.log(`   Response status: ${rootRes.status}`);
  console.log(`   Response payload:`, JSON.stringify(rootData, null, 2));
  if (rootRes.status !== 200 || !rootData.success) {
    throw new Error("Root endpoint failed");
  }
  console.log("   ✅ GET / passed standard response format");

  // 4. Test Health Check Endpoint
  console.log("\n4. Testing GET /health...");
  const healthRes = await app.request("/health");
  const healthData = await healthRes.json();
  console.log(`   Response status: ${healthRes.status}`);
  console.log(`   Response payload:`, JSON.stringify(healthData, null, 2));
  if (healthRes.status !== 200 || healthData.data?.status !== "healthy") {
    throw new Error("Health check endpoint failed");
  }
  console.log("   ✅ GET /health passed");

  // 5. Test 404 Not Found Handler
  console.log("\n5. Testing 404 Handler on Non-Existent Route...");
  const notFoundRes = await app.request("/api/v1/not-found-endpoint");
  const notFoundData = await notFoundRes.json();
  console.log(`   Response status: ${notFoundRes.status}`);
  console.log(`   Response payload:`, JSON.stringify(notFoundData, null, 2));
  if (
    notFoundRes.status !== 404 ||
    notFoundData.success !== false ||
    notFoundData.error?.code !== "NOT_FOUND"
  ) {
    throw new Error("404 Not Found handler failed");
  }
  console.log("   ✅ 404 Not Found handler passed");

  // 6. Test AppError / Error Handler with custom Hono test app
  console.log("\n6. Testing AppError (Operational Error) Handling...");
  const testApp = new Hono();
  testApp.get("/test/operational-error", () => {
    throw new BadRequestError("Invalid input provided", {
      field: "email",
      reason: "malformed",
    });
  });
  testApp.get("/test/unauthorized-error", () => {
    throw new UnauthorizedError("Authentication token missing");
  });
  testApp.onError(errorHandler);

  const errRes1 = await testApp.request("/test/operational-error");
  const errData1 = await errRes1.json();
  console.log(`   BadRequest status: ${errRes1.status}`);
  console.log(`   BadRequest payload:`, JSON.stringify(errData1, null, 2));
  if (
    errRes1.status !== 400 ||
    errData1.success !== false ||
    errData1.error?.code !== "BAD_REQUEST"
  ) {
    throw new Error("BadRequestError handler failed");
  }

  const errRes2 = await testApp.request("/test/unauthorized-error");
  const errData2 = await errRes2.json();
  console.log(`   Unauthorized status: ${errRes2.status}`);
  console.log(`   Unauthorized payload:`, JSON.stringify(errData2, null, 2));
  if (
    errRes2.status !== 401 ||
    errData2.success !== false ||
    errData2.error?.code !== "UNAUTHORIZED"
  ) {
    throw new Error("UnauthorizedError handler failed");
  }
  console.log("   ✅ AppError handlers passed");

  console.log("\n✨ All API Verification Tests Passed Successfully!\n");
}

runVerification().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
