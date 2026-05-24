import { spawn, spawnSync, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import {
  test as base,
  expect,
  type Browser,
  type BrowserContext,
  type Page,
} from '@playwright/test';
import { chromium, firefox } from 'playwright';

import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SearchPage } from '@/pages/SearchPage';
import { AboutPage } from '@/pages/AboutPage';
import { BlogPage } from '@/pages/BlogPage';
import { CheckoutPage } from '@/pages/CheckoutPage';

const useCamoufox = process.env.PLAYWRIGHT_CAMOUFOX === '1';
const camoufoxSlowMoMs = Number(process.env.CAMOUFOX_TS_SLOWMO_MS ?? 100);
const camoufoxCloseDelayMs = Number(process.env.CAMOUFOX_TS_CLOSE_DELAY_MS ?? 5_000);
const keepCamoufoxOpenUntilEnter = ['1', 'true', 'yes', 'on'].includes(
  (process.env.CAMOUFOX_TS_WAIT_FOR_ENTER ?? '0').toLowerCase()
);
const storageStatePath = process.env.PLAYWRIGHT_STORAGE_STATE ?? 'playwright/.auth/shopify.json';
const ansiEscapeChar = String.fromCharCode(27);
const websocketEndpointPattern = new RegExp(`ws://[^\\s${ansiEscapeChar}]+`);

const CF_TITLES = ['Just a moment', 'Attention Required!', 'Please waitâ€¦'];

function isCFChallengePage(title: string): boolean {
  return CF_TITLES.some((t) => title.includes(t));
}

async function waitForCloudflare(page: Page): Promise<void> {
  const title = await page.title().catch(() => '');
  if (!isCFChallengePage(title)) return;

  const resolved = await page
    .waitForFunction(
      (cfTitles: string[]) => !cfTitles.some((t) => document.title.includes(t)),
      CF_TITLES,
      { timeout: 25_000 }
    )
    .then(() => true)
    .catch(() => false);

  if (!resolved) {
    throw new Error(
      `Cloudflare challenge ("${title}") khÃ´ng tá»± giáº£i quyáº¿t sau 25 s.\n` +
        'Session cf_clearance Ä‘Ã£ háº¿t háº¡n hoáº·c chÆ°a cÃ³.\n' +
        'Cháº¡y: npm run auth:save:camoufox  â†’  rá»“i thá»­ láº¡i.'
    );
  }

  await page.waitForLoadState('load', { timeout: 15_000 }).catch(() => {});
}

async function launchCamoufoxServer(): Promise<{
  browser: Browser;
  process: ChildProcessWithoutNullStreams;
}> {
  const serverProcess = spawn('python', ['scripts/camoufox-playwright-server.py'], {
    cwd: process.cwd(),
    env: { ...process.env },
  });

  const endpoint = await new Promise<string>((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for Camoufox websocket endpoint.\n${output}`));
    }, 30_000);

    serverProcess.stdout.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      output += text;
      const match = output.match(websocketEndpointPattern);
      if (match) {
        clearTimeout(timeout);
        resolve(match[0]);
      }
    });

    serverProcess.stderr.on('data', (chunk: Buffer) => {
      output += chunk.toString();
    });

    serverProcess.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    serverProcess.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Camoufox server exited with code ${code}.\n${output}`));
    });
  });

  return {
    browser: await firefox.connect(endpoint, { slowMo: camoufoxSlowMoMs }),
    process: serverProcess,
  };
}

function killProcessTree(processToKill: ChildProcessWithoutNullStreams): void {
  if (processToKill.killed || processToKill.exitCode !== null) return;

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(processToKill.pid), '/t', '/f'], {
      stdio: 'ignore',
    });
    return;
  }

  processToKill.kill('SIGTERM');
}

type PageFixtures = {
  page: Page;
  context: BrowserContext;
  homePage: HomePage;
  catalogPage: CatalogPage;
  productPage: ProductPage;
  cartPage: CartPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  searchPage: SearchPage;
  aboutPage: AboutPage;
  blogPage: BlogPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures, { browser: Browser }>({
  context: async ({ context }, use) => {
    await context.addInitScript(() => {
      if (!Object.getOwnPropertyDescriptor(navigator, 'deviceMemory')) {
        Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
      }
      if (!Object.getOwnPropertyDescriptor(navigator, 'hardwareConcurrency')) {
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
      }
      Object.defineProperty(navigator, 'connection', {
        get: () => ({
          downlink: 10,
          effectiveType: '4g',
          onchange: null,
          rtt: 50,
          saveData: false,
        }),
      });
    });

    await use(context);

    if (useCamoufox) {
      mkdirSync(path.dirname(storageStatePath), { recursive: true });
      await context.storageState({ path: storageStatePath }).catch(() => {});
      await context.close().catch(() => {});
    }
  },

  browser: [
    async ({ browserName, launchOptions }, use) => {
      if (useCamoufox) {
        const server = await launchCamoufoxServer();
        try {
          await use(server.browser);
        } finally {
          if (keepCamoufoxOpenUntilEnter) {
            process.stdout.write(
              '[test:real:camoufox:ts] Tests finished. Press ENTER to close Camoufox...'
            );
            await new Promise<void>((resolve) => {
              process.stdin.resume();
              process.stdin.once('data', () => resolve());
            });
          } else {
            await new Promise((resolve) => setTimeout(resolve, camoufoxCloseDelayMs));
          }
          await server.browser.close().catch(() => {});
          killProcessTree(server.process);
        }
        return;
      }

      if (browserName !== 'chromium') {
        throw new Error('Custom chromium fixture currently supports only chromium.');
      }
      const browser = await chromium.launch(launchOptions);
      await use(browser);
      await browser.close();
    },
    { scope: 'worker' },
  ],

  page: async ({ page }, use) => {
    const _goto = page.goto.bind(page);
    page.goto = async (url: string, options?: Parameters<Page['goto']>[1]) => {
      const response = await _goto(url, options);
      await waitForCloudflare(page);
      return response;
    };

    const _reload = page.reload.bind(page);
    page.reload = async (options?: Parameters<Page['reload']>[0]) => {
      const response = await _reload({
        waitUntil: 'domcontentloaded',
        timeout: 15_000,
        ...options,
      }).catch(async (error) => {
        if (!String(error).includes('Timeout')) {
          throw error;
        }

        await page.waitForLoadState('domcontentloaded', { timeout: 5_000 }).catch(() => {});
        return null;
      });
      await waitForCloudflare(page);
      return response;
    };

    await use(page);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },
  blogPage: async ({ page }, use) => {
    await use(new BlogPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect };
