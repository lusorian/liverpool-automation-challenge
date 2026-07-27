import { expect, test } from '@playwright/test';
import { LiverpoolSearchPage } from '../../src/pages/liverpoolSearchPage';
import { Product } from '../../src/types/product';
import {
  extractProductsFromResponse,
  formatProductForLog,
  productsMatchByNameAndPrice
} from '../../src/utils/productParser';

const SEARCH_TERM = process.env.SEARCH_TERM ?? 'playstation 5';

test.describe('Liverpool challenge flow', () => {
  test('E2E + response interception + cross validation', async ({ page }) => {
    const uiPage = new LiverpoolSearchPage(page);
    const interceptedProducts: Product[] = [];

    page.on('response', async (response) => {
      const requestType = response.request().resourceType();
      if (requestType !== 'xhr' && requestType !== 'fetch') {
        return;
      }

      const contentType = response.headers()['content-type'] ?? '';
      if (!contentType.includes('application/json')) {
        return;
      }

      if (response.status() !== 200) {
        return;
      }

      if (!response.url().includes('liverpool.com.mx')) {
        return;
      }

      try {
        const payload = await response.json();
        const extracted = extractProductsFromResponse(payload, SEARCH_TERM);
        if (extracted.length > 0) {
          interceptedProducts.push(...extracted);
        }
      } catch {
        // Ignore responses that are not valid JSON payloads.
      }
    });

    await test.step('Navigate and search for product', async () => {
      await uiPage.gotoHome();
      await uiPage.search(SEARCH_TERM);
    });

    await test.step('Apply color filter White', async () => {
      await uiPage.filterByWhiteColor();
    });

    await test.step('Sort by lowest price', async () => {
      await uiPage.sortByLowestPrice();
    });

    const topFiveUiProducts = await test.step('Extract and print top 5 UI products', async () => {
      const products = await uiPage.getTopProducts(5);
      expect(products.length).toBeGreaterThanOrEqual(5);

      console.log('\n=== Top 5 UI products ===');
      products.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${formatProductForLog(product)}`);
      });

      return products.slice(0, 5);
    });

    await test.step('Validate UI products against intercepted API response', async () => {
      expect(interceptedProducts.length).toBeGreaterThan(0);

      const matches: Product[] = [];
      const discrepancies: string[] = [];

      for (const uiProduct of topFiveUiProducts) {
        const matchingApiProduct = interceptedProducts.find((apiProduct) =>
          productsMatchByNameAndPrice(uiProduct, apiProduct)
        );

        if (matchingApiProduct) {
          matches.push(uiProduct);
        } else {
          const sameNameCandidate = interceptedProducts.find((apiProduct) =>
            apiProduct.name.toLowerCase().includes(uiProduct.name.toLowerCase()) ||
            uiProduct.name.toLowerCase().includes(apiProduct.name.toLowerCase())
          );

          if (sameNameCandidate) {
            discrepancies.push(
              `Name match, price mismatch -> UI: ${formatProductForLog(uiProduct)} | API: ${formatProductForLog(sameNameCandidate)}`
            );
          } else {
            discrepancies.push(`Not found in API response -> UI: ${formatProductForLog(uiProduct)}`);
          }
        }
      }

      console.log('\n=== API extracted product sample ===');
      interceptedProducts.slice(0, 10).forEach((product, index) => {
        console.log(`${index + 1}. ${formatProductForLog(product)}`);
      });

      if (discrepancies.length > 0) {
        console.log('\n=== Discrepancies ===');
        discrepancies.forEach((message) => console.log(`- ${message}`));
      }

      expect(matches.length).toBeGreaterThanOrEqual(3);
    });
  });
});
