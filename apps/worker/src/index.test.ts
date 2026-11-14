import { describe, expect, it } from "vitest";
import { sampleQueue, sampleWorker } from "./index.js";

describe("apps/worker", () => {
  it("initializes BullMQ queue and worker instances", () => {
    expect(sampleQueue.name).toBe("form-submissions");
    expect(sampleWorker.name).toBe("form-submissions");
  });
});
