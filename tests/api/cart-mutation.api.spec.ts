import { test, expect } from '@playwright/test';
import { cartFetch, mockCartApi } from '@/tests/support/mocks';

const greyJacketVariantId = '611945025';

test.describe('Cart mutation API', () => {
  test.beforeEach(async ({ page }) => {
    await mockCartApi(page);
    await page.goto('/products/grey-jacket');
  });

  test('API-CART-002: POST /cart/add.js thêm Grey jacket vào cart', async ({ page }) => {
    const addResponse = await cartFetch(page, '/cart/add.js', {
      id: greyJacketVariantId,
      quantity: '1',
    });

    expect(addResponse.status).toBe(200);
    expect(addResponse.body.product_title).toBe('Grey jacket');
    expect(addResponse.body.quantity).toBe(1);

    const cartResponse = await cartFetch(page, '/cart.js');

    expect(cartResponse.status).toBe(200);
    expect(cartResponse.body.item_count).toBe(1);
    expect(cartResponse.body.items[0].product_title).toBe('Grey jacket');
  });

  test('API-CART-003: POST /cart/change.js remove item khỏi cart', async ({ page }) => {
    await cartFetch(page, '/cart/add.js', {
      id: greyJacketVariantId,
      quantity: '1',
    });

    const removeResponse = await cartFetch(page, '/cart/change.js', {
      line: '1',
      quantity: '0',
    });

    expect(removeResponse.status).toBe(200);
    expect(removeResponse.body.item_count).toBe(0);
    expect(removeResponse.body.items).toEqual([]);
  });
});
