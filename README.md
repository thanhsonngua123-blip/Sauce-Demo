# Sauce Demo Test Automation

Project test tự động cho storefront:

```text
https://sauce-demo.myshopify.com
```

Project đang dùng Playwright TypeScript. UI/API chạy bằng Chromium/Chrome để nhanh hơn. Các flow thật trong `tests/real` chạy bằng Camoufox thông qua runner TypeScript và một số script Python nhỏ để mở Camoufox/lưu session.

## Yêu cầu

- Node.js
- npm
- Python
- Camoufox cho test real

Cài Camoufox:

```bash
pip install camoufox
python -m camoufox fetch
```

Cài dependency Node và browser Playwright:

```bash
npm install
npx playwright install
```

## Cấu trúc project

```text
tests/ui/        UI tests chạy bằng Chromium/Chrome
tests/api/       API tests chạy bằng Chromium/Chrome
tests/real/      Real E2E flows chạy bằng Camoufox
tests/smoke/     Smoke tests cơ bản
tests/support/   Helper cho API evidence và account records
pages/           Page Object Models
fixtures/        Playwright fixtures và tích hợp Camoufox
config/          Cấu hình env, browser, storage
test-data/       Routes và dữ liệu sản phẩm
scripts/         Script Camoufox/auth/test runner
```

## Script chính

Chạy API mặc định, bỏ qua `@mutation`:

```bash
npm test
```

Chạy UI tests:

```bash
npm run test:ui
```

Chạy API tests, bỏ qua `@mutation`:

```bash
npm run test:api
```

Chạy API tests có tag `@real` bằng Chromium:

```bash
npm run test:api:real
```

Chạy API mutation tests:

```bash
npm run test:api:mutation
```

Chạy real flows bằng Camoufox:

```bash
npm run test:real
```

Liệt kê real tests:

```bash
npm run test:real:list
```

Lưu hoặc refresh session Cloudflare/hCaptcha bằng Camoufox:

```bash
npm run auth:save:camoufox
```

Kiểm tra Camoufox:

```bash
npm run camoufox:check
```

Typecheck, lint và check tổng:

```bash
npm run typecheck
npm run lint
npm run check
```

Mở Playwright HTML report:

```bash
npm run report
```

## Chạy riêng từng test

Chạy riêng một file UI:

```bash
npx playwright test tests/ui/search.spec.ts --project=chromium
```

Chạy riêng một file API:

```bash
npx playwright test tests/api/cart.api.spec.ts --project=chromium
```

Chạy riêng một file real bằng Camoufox:

```bash
npm run test:real -- tests/real/login-real.spec.ts
```

Chạy một test theo title:

```bash
npx playwright test tests/ui/search.spec.ts --grep "SEARCH-006" --project=chromium
```

Chạy real test theo title:

```bash
npm run test:real -- tests/real/search-flow-real.spec.ts --grep "REAL-SEARCH-001"
```

## Quy ước test

Tag đang dùng:

- `@real`: test chạm vào storefront thật.
- `@mutation`: test làm thay đổi state như cart/register.
- `@e2e`: flow nhiều bước theo hành vi người dùng.

Phân tách hiện tại:

- UI: kiểm tra giao diện, page state, navigation, form, search, product.
- API: kiểm tra endpoint Shopify như `/cart.js`, `/products/*.js`.
- Real: flow thật cần Camoufox, ví dụ login, register, search, cart, checkout.

## Camoufox và auth

Real tests yêu cầu session Cloudflare hợp lệ trong:

```text
playwright/.auth/shopify.json
```

Nếu chạy real test mà báo thiếu `cf_clearance`, chạy:

```bash
npm run auth:save:camoufox
```

Sau đó giải Cloudflare/hCaptcha nếu trình duyệt hiển thị, rồi chạy lại test.

Real runner nằm ở:

```text
scripts/run-ts-camoufox-real.js
```

Runner này tự set:

- `PLAYWRIGHT_CAMOUFOX=1`
- `PLAYWRIGHT_SKIP_AUTH_SETUP=1`
- `CAMOUFOX_HEADLESS=0` cho real tests
- video/screenshot bật cho real tests nếu chưa override bằng env

## Login và register thật

Login real ưu tiên đọc tài khoản từ `.env`:

```text
SHOPIFY_TEST_EMAIL=customer@example.com
SHOPIFY_TEST_PASSWORD=password
```

Nếu không có `.env`, test login sẽ đọc account mới nhất từ:

```text
test-results/registered-accounts.jsonl
```

Register real ghi lại kết quả vào:

```text
test-results/registered-accounts.jsonl
test-results/registration-attempts.jsonl
```

- `registered-accounts.jsonl`: chỉ ghi account register thành công.
- `registration-attempts.jsonl`: ghi mọi lần thử register, gồm cả bị protected.

## API evidence

API tests attach evidence vào Playwright report. Evidence gồm method, URL, status, body rút gọn và expected data dùng để so sánh.

Chạy API rồi mở report:

```bash
npm run test:api
npm run report
```

Trong report, mở từng API test để xem attachment JSON.

## Browser và viewport

Viewport/window mặc định được cấu hình trong `config/browser.ts`:

```text
viewport: 1280x650
window:   1280x720
```

Có thể override bằng env:

```powershell
$env:PLAYWRIGHT_VIEWPORT_WIDTH="1280"
$env:PLAYWRIGHT_VIEWPORT_HEIGHT="650"
$env:PLAYWRIGHT_WINDOW_WIDTH="1280"
$env:PLAYWRIGHT_WINDOW_HEIGHT="720"
```

Video/screenshot:

```powershell
$env:PLAYWRIGHT_VIDEO="retain-on-failure"
$env:PLAYWRIGHT_SCREENSHOT="only-on-failure"
```
