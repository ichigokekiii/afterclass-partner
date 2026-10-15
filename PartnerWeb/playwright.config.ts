import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName: "chromium",
    channel: "chrome",
    trace: "on-first-retry",
  },
  webServer: {
    command: "TZ=Asia/Manila npx next start -p 3100 -H 127.0.0.1",
    url: "http://127.0.0.1:3100/blocked",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
