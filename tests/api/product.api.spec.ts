import { test, expect } from '@playwright/test';
import { products } from '@/test-data/products';

test.describe('Product API', () => {
  products.forEach((product) => {
    test(`API-PROD: GET /products/${product.slug}.js trả về ${product.name}`, async ({
      request,
    }) => {
      const response = await request.get(`/products/${product.slug}.js`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body.title).toBe(product.name);
      expect(body.handle).toBe(product.slug);
      expect(body).toHaveProperty('variants');
      expect(Array.isArray(body.variants)).toBe(true);
    });
  });

  test('API-PROD-404: GET product không tồn tại trả về 404', async ({ request }) => {
    const response = await request.get('/products/not-exist-product.js');

    expect(response.status()).toBe(404);
  });
});
