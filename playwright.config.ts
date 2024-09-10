import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";

require("dotenv").config();

export default defineConfig<TestOptions>({
  timeout: 30000,
  retries: 1,
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
      },
    ],
    // ["allure-playwright"],
    ['html']
  ],

  use: {
    baseURL: "http://localhost:4200/",
    globalsQaURL: "https://globalsqa.com/demo-site/draganddrop",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: {
      mode: "off",
      size: { width: 1920, height: 1080 },
    },
  },

  projects: [
    {
      name: "dev",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:4200/",
      },
    },
    {
      name: "chromium",
    },

    {
      name: "firefox",
      use: {
        browserName: "firefox",
      },
    },
    {
      name: "mobile",
      testMatch: "testMobile.spec.ts",
      use: {
        ...devices["iPhone 15"],
      },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/'
  }
});
