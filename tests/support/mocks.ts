import type { Page } from '@playwright/test';

function formValue(body: string | null, key: string) {
  return new URLSearchParams(body ?? '').get(key);
}

function cartItems(itemCount: number) {
  return itemCount === 0 ? [] : [{ product_title: 'Grey jacket', quantity: itemCount }];
}

export async function mockCartApi(page: Page) {
  let itemCount = 0;

  await page.route('**/cart/add.js', async (route) => {
    itemCount = Number(formValue(route.request().postData(), 'quantity') ?? 1);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        product_title: 'Grey jacket',
        quantity: itemCount,
      }),
    });
  });

  await page.route('**/cart/change.js', async (route) => {
    itemCount = Number(formValue(route.request().postData(), 'quantity') ?? 0);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        item_count: itemCount,
        items: cartItems(itemCount),
      }),
    });
  });

  await page.route('**/cart.js', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        item_count: itemCount,
        items: cartItems(itemCount),
      }),
    });
  });
}

export async function mockSearchResults(page: Page, query: string, body: string) {
  await page.route(`**/search?q=${query}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body,
    });
  });
}

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
