import { test, expect } from '@playwright/test';

test.describe('Cart API', () => {
  test('API-CART-001: GET /cart.js trả về cart JSON', async ({ request }) => {
    const response = await request.get('/cart.js');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);

    expect(body).toHaveProperty('item_count');
    expect(typeof body.item_count).toBe('number');
  });
});
