import type { Browser } from "playwright";

const _browserStub: Browser | null = null;

export function getBrowserStub(): Browser | null {
  return _browserStub;
}

export function startRenderer(): void {
  console.log("ready");
}

startRenderer();
