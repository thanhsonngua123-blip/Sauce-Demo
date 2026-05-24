const viewportWidth = numberFromEnv('PLAYWRIGHT_VIEWPORT_WIDTH', 1280);
const viewportHeight = numberFromEnv('PLAYWRIGHT_VIEWPORT_HEIGHT', 650);
const windowWidth = numberFromEnv('PLAYWRIGHT_WINDOW_WIDTH', 1280);
const windowHeight = numberFromEnv('PLAYWRIGHT_WINDOW_HEIGHT', 720);

export const viewport = { width: viewportWidth, height: viewportHeight };

export const browserLaunchArgs = [
  '--disable-blink-features=AutomationControlled',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  `--window-size=${windowWidth},${windowHeight}`,
];

export const spoofedUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export const videoMode =
  (process.env.PLAYWRIGHT_VIDEO as 'on' | 'off' | 'retain-on-failure' | 'on-first-retry') ??
  'retain-on-failure';

export const screenshotMode =
  (process.env.PLAYWRIGHT_SCREENSHOT as 'on' | 'off' | 'only-on-failure') ?? 'only-on-failure';

function numberFromEnv(name: string, defaultValue: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : defaultValue;
}
