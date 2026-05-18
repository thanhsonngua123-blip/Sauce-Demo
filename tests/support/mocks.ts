import type { Page } from '@playwright/test';

type MockCartItem = {
  name: string;
  price: string;
  quantity: number;
};

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

export async function mockCartFlow(page: Page) {
  let itemCount = 0;

  await page.route('**/cart/add.js', async (route) => {
    itemCount = 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        product_title: 'Grey jacket',
        quantity: 1,
      }),
    });
  });

  await page.route('**/cart.js', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        item_count: itemCount,
        items:
          itemCount > 0
            ? [
                {
                  product_title: 'Grey jacket',
                  quantity: itemCount,
                  price: 5500,
                },
              ]
            : [],
      }),
    });
  });

  await page.route(/.*\/cart\/change.*/, async (route) => {
    itemCount = 0;
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: emptyCartHtml(),
    });
  });

  await page.route('**/cart', async (route) => {
    if (route.request().method() === 'POST') {
      itemCount = Number(formValue(route.request().postData(), 'quantity') ?? itemCount);
    }

    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: itemCount > 0 ? cartWithGreyJacketHtml(itemCount) : emptyCartHtml(),
    });
  });

  await page.route('**/checkout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: '<h1>Checkout</h1>',
    });
  });
}

export async function mockCatalogPage(page: Page) {
  await page.route('**/collections/all', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: '<h1>Products</h1>',
    });
  });
}

export async function mockCartPageWithItems(page: Page, items: readonly MockCartItem[]) {
  await page.route('**/cart', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: cartWithItemsHtml(items),
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

function emptyCartHtml() {
  return `
    <h1>My Cart</h1>
    <p>It appears that your cart is currently empty! <a href="/collections/all">Continue Shopping</a>.</p>
  `;
}

function cartWithGreyJacketHtml(quantity: number) {
  return `
    <h1>My Cart</h1>
    <h3><a href="/collections/all/products/grey-jacket">Grey jacket - Grey jacket</a></h3>
    <span>£55.00</span>
    <form method="post" action="/cart">
      <input name="quantity" value="${quantity}" />
      <button type="submit">Update</button>
    </form>
    <a href="/cart/change?line=1&quantity=0">x</a>
    <h2>Total £${(quantity * 55).toFixed(2)}</h2>
    <button onclick="location.href='/checkout'">Check Out</button>
  `;
}

function cartWithItemsHtml(items: readonly MockCartItem[]) {
  const rows = items
    .map(
      (item) => `
        <h3><a href="/products/${item.name.toLowerCase().replace(/\s+/g, '-')}">${item.name}</a></h3>
        <span>${item.price}</span>
        <input value="${item.quantity}" />
      `
    )
    .join('');

  const total = items.reduce((sum, item) => sum + priceToNumber(item.price) * item.quantity, 0);

  return `
    <h1>My Cart</h1>
    ${rows}
    <h2>Total £${total.toFixed(2)}</h2>
  `;
}

function priceToNumber(price: string) {
  return Number(price.replace('£', ''));
}
