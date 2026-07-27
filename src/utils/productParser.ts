import { Product } from '../types/product';

const NAME_KEYS = ['displayname', 'productname', 'name', 'title', 'description'];
const PRICE_KEYS = ['saleprice', 'listprice', 'finalprice', 'price', 'bestprice', 'promo'];

function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const cleaned = value.replace(/[^\d.,]/g, '');
  if (!cleaned) {
    return null;
  }

  if (cleaned.includes(',') && cleaned.includes('.')) {
    return Number.parseFloat(cleaned.replace(/,/g, ''));
  }

  if (cleaned.includes(',') && !cleaned.includes('.')) {
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickStringField(record: Record<string, unknown>, keys: string[]): string | null {
  for (const [key, value] of Object.entries(record)) {
    if (typeof value !== 'string') {
      continue;
    }

    const normalizedKey = key.toLowerCase();
    if (keys.some((k) => normalizedKey.includes(k)) && value.trim().length > 3) {
      return value.trim();
    }
  }

  return null;
}

function pickPriceField(record: Record<string, unknown>): number | null {
  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = key.toLowerCase();

    if (!PRICE_KEYS.some((k) => normalizedKey.includes(k))) {
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      const nestedNumber = pickPriceField(value as Record<string, unknown>);
      if (nestedNumber !== null && nestedNumber > 0) {
        return nestedNumber;
      }
    }

    const parsed = toNumber(value);
    if (parsed !== null && parsed > 0) {
      return parsed;
    }
  }

  return null;
}

function walk(node: unknown, acc: Product[]): void {
  if (Array.isArray(node)) {
    for (const item of node) {
      walk(item, acc);
    }
    return;
  }

  if (!node || typeof node !== 'object') {
    return;
  }

  const record = node as Record<string, unknown>;
  const candidateName = pickStringField(record, NAME_KEYS);
  const candidatePrice = pickPriceField(record);

  if (candidateName && candidatePrice && candidateName.length >= 4) {
    acc.push({
      name: candidateName,
      price: candidatePrice,
      source: 'api'
    });
  }

  for (const value of Object.values(record)) {
    if (typeof value === 'object' && value !== null) {
      walk(value, acc);
    }
  }
}

export function extractProductsFromResponse(payload: unknown, searchTerm: string): Product[] {
  const all: Product[] = [];
  walk(payload, all);

  const normalizedSearchTerm = normalizeName(searchTerm);
  const termTokens = normalizedSearchTerm.split(' ').filter(Boolean);

  const filtered = all.filter((product) => {
    const normalizedProductName = normalizeName(product.name);
    if (normalizedProductName.includes(normalizedSearchTerm)) {
      return true;
    }

    return termTokens.every((token) => normalizedProductName.includes(token) || normalizedProductName.includes('ps5'));
  });

  const dedupeMap = new Map<string, Product>();
  for (const product of filtered) {
    const key = `${normalizeName(product.name)}::${Math.round(product.price * 100)}`;
    if (!dedupeMap.has(key)) {
      dedupeMap.set(key, product);
    }
  }

  return [...dedupeMap.values()];
}

export function productsMatchByNameAndPrice(uiProduct: Product, apiProduct: Product): boolean {
  const uiName = normalizeName(uiProduct.name);
  const apiName = normalizeName(apiProduct.name);
  const nameMatch = uiName.includes(apiName) || apiName.includes(uiName);
  const priceDelta = Math.abs(uiProduct.price - apiProduct.price);
  return nameMatch && priceDelta <= 1;
}

export function formatProductForLog(product: Product): string {
  return `${product.name} | $${product.price.toFixed(2)} | ${product.source}`;
}
