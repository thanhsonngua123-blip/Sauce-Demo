import type { Page } from '@playwright/test';

export async function cartFetch(page: Page, path: string, body?: Record<string, string>) {
  return page.evaluate(
    async ({ path, body }) => {
      const response = await fetch(path, {
        method: body ? 'POST' : 'GET',
        headers: body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : undefined,
        body: body ? new URLSearchParams(body) : undefined,
      });

      return {
        status: response.status,
        body: await response.json(),
      };
    },
    { path, body }
  );
}
