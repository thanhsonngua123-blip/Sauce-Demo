import { test as base, expect } from '@playwright/test';

import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SearchPage } from '@/pages/SearchPage';
import { AboutPage } from '@/pages/AboutPage';

type PageFixtures = {
  homePage: HomePage;
  catalogPage: CatalogPage;
  productPage: ProductPage;
  cartPage: CartPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  searchPage: SearchPage;
  aboutPage: AboutPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },

  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },
});

export { expect };
