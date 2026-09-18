import { Currency, CurrencyConfig } from '../types';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    rate: 1,
    label: 'NGN (₦) Naira'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 0.00067,
    label: 'USD ($) Dollar'
  },
  BDT: {
    code: 'BDT',
    symbol: '৳',
    rate: 0.080,
    label: 'BDT (৳) Taka'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rate: 0.00052,
    label: 'GBP (£) Pound'
  }
};

export function formatPrice(priceNGN: number, currency: Currency = 'NGN'): string {
  const config = CURRENCIES[currency] || CURRENCIES.NGN;
  const converted = priceNGN * config.rate;

  if (currency === 'USD' || currency === 'GBP') {
    return `${config.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // NGN or BDT usually whole numbers
  return `${config.symbol}${Math.round(converted).toLocaleString('en-US')}`;
}
