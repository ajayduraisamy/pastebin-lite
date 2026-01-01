import { headers } from "next/headers";

export function now(): number {
  if (process.env.TEST_MODE === "1") {
    const h = headers();
    const testNow = h.get("x-test-now-ms");
    if (testNow) return Number(testNow);
  }
  return Date.now();
}
