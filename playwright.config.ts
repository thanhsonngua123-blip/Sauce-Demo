import { defineConfig } from '@playwright/test';
import {
  browserLaunchArgs,
  screenshotMode,
  spoofedUserAgent,
  videoMode,
  viewport,
} from './config/browser';
import { loadDotenv } from './config/env';
import { storageStatePath } from './config/storage';

loadDotenv();

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  timeout: 30_000,
  retries: 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: 'https://sauce-demo.myshopify.com',
    trace: 'on-first-retry',
    screenshot: screenshotMode,
    video: videoMode,
    storageState: storageStatePath,
    viewport,
    locale: 'en-US',
    launchOptions: { args: browserLaunchArgs },
  },

  projects: [
    {
      name: 'chromium',
      testIgnore: ['**/tests/real/**'],
      use: {
        userAgent: spoofedUserAgent,
        viewport,
        launchOptions: { args: browserLaunchArgs },
      },
    },
    {
      name: 'real',
      testMatch: ['**/tests/real/**'],
      timeout: 90_000,
      use: {
        channel: (process.env.PLAYWRIGHT_CHANNEL as 'chrome' | 'chromium') ?? 'chrome',
        viewport,
        navigationTimeout: 30_000,
        launchOptions: {
          headless: false,
          args: browserLaunchArgs,
        },
      },
    },
  ],
});
