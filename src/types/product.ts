export interface Product {
  name: string;
  price: number;
  rawPriceText?: string;
  source: 'ui' | 'api';
}
