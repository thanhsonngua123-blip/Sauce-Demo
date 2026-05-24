import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const storageStatePath =
  process.env.PLAYWRIGHT_STORAGE_STATE ?? 'playwright/.auth/shopify.json';

export function ensureStorageFile() {
  const dir = path.dirname(storageStatePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  if (!existsSync(storageStatePath)) {
    writeFileSync(storageStatePath, JSON.stringify({ cookies: [], origins: [] }));
  }
}

export function hasValidCloudflareSession() {
  if (!existsSync(storageStatePath)) return false;

  try {
    const state = JSON.parse(readFileSync(storageStatePath, 'utf-8')) as {
      cookies?: Array<{ name?: string; expires?: number }>;
    };

    return (state.cookies ?? []).some(
      (cookie) =>
        cookie.name === 'cf_clearance' &&
        (!cookie.expires || cookie.expires * 1000 > Date.now() + 60_000)
    );
  } catch {
    return false;
  }
}
