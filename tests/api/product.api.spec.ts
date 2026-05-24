import { expect, test } from '@playwright/test';
import { products } from '@/test-data/products';
import { attachApiEvidence, readApiResponse } from '@/tests/support/api/evidence';

test.describe('API sản phẩm @real', () => {
  products.forEach((product) => {
    test(`API-PROD: GET /products/${product.slug}.js trả về ${product.name}`, async ({
      request,
    }, testInfo) => {
      const response = await request.get(`/products/${product.slug}.js`);
      const body = await readApiResponse(response);

      await attachApiEvidence(testInfo, `product-${product.slug}`, {
        request: {
          method: 'GET',
          url: `/products/${product.slug}.js`,
        },
        response: {
          status: response.status(),
          body:
            typeof body === 'object' && body !== null
              ? {
                  title: 'title' in body ? body.title : undefined,
                  handle: 'handle' in body ? body.handle : undefined,
                  variantsCount:
                    'variants' in body && Array.isArray(body.variants)
                      ? body.variants.length
                      : undefined,
                }
              : body,
        },
        expected: {
          status: 200,
          title: product.name,
          handle: product.slug,
          variants: 'array',
        },
      });

      expect(response.status()).toBe(200);
      expect(body.title).toBe(product.name);
      expect(body.handle).toBe(product.slug);
      expect(body).toHaveProperty('variants');
      expect(Array.isArray(body.variants)).toBe(true);
    });
  });

  test('API-PROD-404: GET sản phẩm không tồn tại trả về 404', async ({ request }, testInfo) => {
    const response = await request.get('/products/not-exist-product.js');
    const body = await readApiResponse(response);

    await attachApiEvidence(testInfo, 'product-not-found', {
      request: {
        method: 'GET',
        url: '/products/not-exist-product.js',
      },
      response: {
        status: response.status(),
        body,
      },
      expected: {
        status: 404,
      },
    });

    expect(response.status()).toBe(404);
  });
});
