# Sauce Demo Playwright Tests

Project này dùng Playwright + TypeScript để test website demo `https://sauce-demo.myshopify.com`.

## Yêu Cầu

- Node.js đã cài sẵn
- npm

## Cài Đặt

```bash
npm install
npx playwright install
```

## Chạy Test

Chạy toàn bộ test:

```bash
npm test
```

Chạy smoke test:

```bash
npm run test:smoke
```

Chạy API test:

```bash
npm run test:api
```

Chạy real contract test dễ flaky:

```bash
npm run test:real
```

Chạy UI test:

```bash
npm run test:ui-only
```

Chạy có giao diện browser:

```bash
npm run test:headed
```

Mở Playwright UI mode:

```bash
npm run test:ui
```

## Kiểm Tra TypeScript

```bash
npm run typecheck
```

Chạy cả typecheck và test:

```bash
npm run check
```

## Xem Report

Sau khi chạy test, mở HTML report:

```bash
npm run report
```

## Cấu Trúc Chính

- `tests/smoke/`: smoke tests cho các trang chính
- `tests/ui/`: UI tests theo từng chức năng
- `tests/api/`: API tests
- `tests/real/`: real contract tests, không chạy trong `npm test` mặc định
- `tests/support/`: mock/stub helpers dùng chung cho tests
- `pages/`: Page Object Models
- `fixtures/`: Playwright fixtures dùng chung
- `test-data/`: routes và dữ liệu sản phẩm
- `playwright.config.ts`: cấu hình Playwright

## Lưu Ý

- Một số test dùng mock/stub để tránh Cloudflare hoặc Shopify checkout làm test flaky.
- `npm test` loại trừ test có tag `@real`; dùng `npm run test:real` khi muốn kiểm tra real flow nhạy cảm.
- Các test không thực hiện thanh toán thật và không tạo tài khoản thành công thật.
- Project hiện chạy local là chính, chưa cần GitHub Actions/CI.
