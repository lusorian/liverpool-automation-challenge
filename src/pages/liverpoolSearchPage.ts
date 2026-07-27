import { expect, Locator, Page } from '@playwright/test';
import { Product } from '../types/product';

export class LiverpoolSearchPage {
  constructor(private readonly page: Page) {}

  async gotoHome(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.dismissCommonPopups();
  }

  async search(term: string): Promise<void> {
    const searchInputCandidates = [
      this.page.getByRole('searchbox').first(),
      this.page.locator('input[type="search"]').first(),
      this.page.locator('input[placeholder*="Buscar" i]').first(),
      this.page.locator('input[name*="search" i]').first()
    ];

    const input = await this.firstVisible(searchInputCandidates);
    await input.click();
    await input.fill(term);
    await input.press('Enter');

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  async filterByWhiteColor(): Promise<void> {
    await this.clickIfVisible([
      this.page.getByRole('button', { name: /filtros|filters/i }).first(),
      this.page.getByRole('button', { name: /color/i }).first(),
      this.page.getByText(/color/i).first()
    ]);

    await this.clickIfVisible([
      this.page.getByRole('checkbox', { name: /white|blanco/i }).first(),
      this.page.getByRole('button', { name: /white|blanco/i }).first(),
      this.page.getByText(/white|blanco/i).first()
    ]);

    await this.clickIfVisible([
      this.page.getByRole('button', { name: /aplicar|apply|ver resultados/i }).first()
    ]);

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  async sortByLowestPrice(): Promise<void> {
    const sortTriggers = [
      this.page.getByRole('button', { name: /ordenar|sort/i }).first(),
      this.page.getByRole('combobox').first(),
      this.page.getByText(/relevancia|ordenar por|sort by/i).first()
    ];

    await this.clickIfVisible(sortTriggers);

    await this.clickIfVisible([
      this.page.getByRole('option', { name: /menor precio|lowest|low to high/i }).first(),
      this.page.getByRole('button', { name: /menor precio|lowest|low to high/i }).first(),
      this.page.getByText(/menor precio|lowest|low to high/i).first()
    ]);

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async getTopProducts(limit = 5): Promise<Product[]> {
    const cardSelectors = [
      '[data-testid*="product"]',
      '.m-product__card',
      '.o-listing__products li',
      'li:has([class*="price"])'
    ];

    let cards: Locator | null = null;
    for (const selector of cardSelectors) {
      const candidate = this.page.locator(selector);
      if ((await candidate.count()) >= limit) {
        cards = candidate;
        break;
      }
    }

    cards = cards ?? this.page.locator('.m-product__card, [data-testid*="product"], li').filter({ hasText: /playstation|ps5/i });

    await expect(cards.first()).toBeVisible({ timeout: 20_000 });

    const products: Product[] = [];
    const total = Math.min(limit, await cards.count());

    for (let index = 0; index < total; index++) {
      const card = cards.nth(index);

      const nameLocator = card.locator([
        '[data-testid*="product-name"]',
        '.a-product__information--title',
        '.card-title',
        'h3',
        'h2',
        'a[title]'
      ].join(', ')).first();

      const priceLocator = card.locator([
        '[data-testid*="price"]',
        '.a-product__paragraphDiscountPrice',
        '.a-price',
        '.m-price__discount',
        '[class*="price"]'
      ].join(', ')).first();

      const name = (await nameLocator.textContent())?.trim() ?? 'N/A';
      const rawPriceText = (await priceLocator.textContent())?.trim() ?? '';
      const price = this.parsePrice(rawPriceText);

      if (name !== 'N/A' && price > 0) {
        products.push({
          name,
          price,
          rawPriceText,
          source: 'ui'
        });
      }
    }

    return products;
  }

  private parsePrice(raw: string): number {
    const cleaned = raw.replace(/[^\d.,]/g, '');
    if (!cleaned) {
      return 0;
    }

    if (cleaned.includes(',') && cleaned.includes('.')) {
      return Number.parseFloat(cleaned.replace(/,/g, ''));
    }

    if (cleaned.includes(',') && !cleaned.includes('.')) {
      return Number.parseFloat(cleaned.replace(',', '.'));
    }

    return Number.parseFloat(cleaned);
  }

  private async dismissCommonPopups(): Promise<void> {
    await this.clickIfVisible([
      this.page.getByRole('button', { name: /aceptar|accept|entendido|ok/i }).first(),
      this.page.locator('[aria-label*="close" i], [data-testid*="close" i]').first()
    ], 2000);
  }

  private async firstVisible(candidates: Locator[], timeout = 10_000): Promise<Locator> {
    const end = Date.now() + timeout;

    while (Date.now() < end) {
      for (const candidate of candidates) {
        if (await candidate.isVisible().catch(() => false)) {
          return candidate;
        }
      }
      await this.page.waitForTimeout(250);
    }

    throw new Error('No visible locator matched the expected UI element.');
  }

  private async clickIfVisible(candidates: Locator[], timeout = 10_000): Promise<boolean> {
    const end = Date.now() + timeout;

    while (Date.now() < end) {
      for (const candidate of candidates) {
        const visible = await candidate.isVisible().catch(() => false);
        if (visible) {
          await candidate.click({ timeout: 3_000 }).catch(async () => {
            await candidate.first().click({ force: true, timeout: 3_000 });
          });
          return true;
        }
      }

      await this.page.waitForTimeout(200);
    }

    return false;
  }
}
