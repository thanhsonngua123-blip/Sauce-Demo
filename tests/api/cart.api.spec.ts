import { expect, test } from '@playwright/test';
import { attachApiEvidence, readApiResponse } from '@/tests/support/api/evidence';

test.describe('API giỏ hàng @real', () => {
  test('API-CART-001: GET /cart.js trả về JSON giỏ hàng', async ({ request }, testInfo) => {
    const response = await request.get('/cart.js');
    const body = await readApiResponse(response);

    await attachApiEvidence(testInfo, 'cart-get', {
      request: {
        method: 'GET',
        url: '/cart.js',
      },
      response: {
        status: response.status(),
        body:
          typeof body === 'object' && body !== null
            ? {
                item_count: 'item_count' in body ? body.item_count : undefined,
                itemsCount: 'items' in body && Array.isArray(body.items) ? body.items.length : undefined,
              }
            : body,
      },
      expected: {
        status: 200,
        items: 'array',
        item_count: 'number',
      },
    });

    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);

    expect(body).toHaveProperty('item_count');
    expect(typeof body.item_count).toBe('number');
  });
});
