import { createServer } from "../src/server.js";
import { loadConfig } from "../src/config/env.js";

async function runAuthVerification() {
  console.log("🔐 Starting Neon Auth Verification Tests...\n");

  // 1. Load config and initialize app
  const config = loadConfig();
  console.log(`1. Neon Auth configured at: ${config.NEON_AUTH_BASE_URL}`);

  const app = createServer({ config });

  // 2. Prepare test user
  const uniqueId = Math.random().toString(36).substring(2, 10);
  const testUser = {
    email: `neon.test.${uniqueId}@example.com`,
    password: `P@ssword_${uniqueId}!2026`,
    name: `Neon Test User ${uniqueId}`,
  };

  console.log(
    `2. Signing up real user via POST /auth/sign-up: ${testUser.email}`,
  );

  // 3. Send signup request to the Hono API
  const signUpResponse = await app.request("/auth/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:4000",
    },
    body: JSON.stringify(testUser),
  });

  const signUpBody = await signUpResponse.json();
  const setCookieHeader = signUpResponse.headers.get("set-cookie");

  console.log(`   - HTTP Status: ${signUpResponse.status}`);
  console.log(`   - Success: ${signUpBody.success}`);
  console.log(`   - Message: ${signUpBody.message}`);
  console.log(`   - User ID: ${signUpBody.data?.user?.id}`);
  console.log(`   - User Email: ${signUpBody.data?.user?.email}`);
  console.log(`   - User Name: ${signUpBody.data?.user?.name}`);
  console.log(
    `   - Session Cookie received: ${setCookieHeader ? "Yes" : "No"}`,
  );

  if (
    signUpResponse.status !== 201 ||
    !signUpBody.success ||
    !signUpBody.data?.user?.id
  ) {
    throw new Error(
      `Sign-up failed with status ${signUpResponse.status}: ${JSON.stringify(signUpBody)}`,
    );
  }

  const registeredUserId = signUpBody.data.user.id;

  if (!setCookieHeader) {
    throw new Error("Expected Set-Cookie header in sign-up response");
  }

  // Extract cookie value for request
  const cookieValue = setCookieHeader.split(";")[0];

  // 4. Test reading current user back via GET /auth/me with session cookie
  console.log(
    "\n3. Reading current user back via GET /auth/me (Session cookie)...",
  );
  const meCookieResponse = await app.request("/auth/me", {
    method: "GET",
    headers: {
      Cookie: cookieValue,
      Origin: "http://localhost:4000",
    },
  });

  const meCookieBody = await meCookieResponse.json();
  console.log(`   - HTTP Status: ${meCookieResponse.status}`);
  console.log(`   - Success: ${meCookieBody.success}`);
  console.log(`   - Current User ID: ${meCookieBody.data?.user?.id}`);
  console.log(`   - Current User Email: ${meCookieBody.data?.user?.email}`);
  console.log(`   - Current User Name: ${meCookieBody.data?.user?.name}`);
  console.log(`   - Active Session ID: ${meCookieBody.data?.session?.id}`);

  if (
    meCookieResponse.status !== 200 ||
    !meCookieBody.success ||
    meCookieBody.data?.user?.id !== registeredUserId ||
    meCookieBody.data?.user?.email !== testUser.email
  ) {
    throw new Error(
      `Failed to read user back via session cookie: ${JSON.stringify(meCookieBody)}`,
    );
  }

  // 5. Test sign-in with the newly created credentials
  console.log("\n4. Testing POST /auth/sign-in with created credentials...");
  const signInResponse = await app.request("/auth/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:4000",
    },
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  });

  const signInBody = await signInResponse.json();
  const signInCookie = signInResponse.headers.get("set-cookie");

  console.log(`   - HTTP Status: ${signInResponse.status}`);
  console.log(`   - Success: ${signInBody.success}`);
  console.log(`   - Verified User ID: ${signInBody.data?.user?.id}`);

  if (
    signInResponse.status !== 200 ||
    !signInBody.success ||
    signInBody.data?.user?.id !== registeredUserId
  ) {
    throw new Error(
      `Sign-in failed with status ${signInResponse.status}: ${JSON.stringify(signInBody)}`,
    );
  }

  // 6. Test reading current user back with the signIn cookie
  if (signInCookie) {
    console.log("\n5. Reading user back after sign-in via GET /auth/me...");
    const meAfterSignIn = await app.request("/auth/me", {
      method: "GET",
      headers: {
        Cookie: signInCookie.split(";")[0],
        Origin: "http://localhost:4000",
      },
    });

    const meAfterSignInBody = await meAfterSignIn.json();
    console.log(`   - HTTP Status: ${meAfterSignIn.status}`);
    console.log(
      `   - Verified User Email: ${meAfterSignInBody.data?.user?.email}`,
    );

    if (
      meAfterSignIn.status !== 200 ||
      meAfterSignInBody.data?.user?.id !== registeredUserId
    ) {
      throw new Error(`Failed to verify session after sign-in`);
    }
  }

  console.log(
    "\n🎉 Verification Succeeded: User was signed up, authenticated, and read back via Neon's managed Better Auth!\n",
  );
}

runAuthVerification().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
