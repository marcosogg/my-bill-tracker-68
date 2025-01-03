// Fixer.io API configuration
const FIXER_API_KEY = '3d5bee25ccd3658c9af8a40595fd10f7';
const API_BASE_URL = 'http://data.fixer.io/api';

// Cache exchange rates for 1 hour
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
let ratesCache: {
  timestamp: number;
  rates: Record<string, number>;
} | null = null;

interface FixerResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
  error?: {
    code: number;
    type: string;
    info: string;
  };
}

async function getRates(): Promise<Record<string, number>> {
  const now = Date.now();
  
  // Return cached rates if they're still valid
  if (ratesCache && (now - ratesCache.timestamp) < CACHE_DURATION) {
    return ratesCache.rates;
  }

  try {
    // Note: Fixer.io free plan only supports EUR as base currency
    const response = await fetch(`${API_BASE_URL}/latest?access_key=${FIXER_API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data: FixerResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.info || 'Failed to fetch exchange rates');
    }
    
    // Cache the new rates
    ratesCache = {
      timestamp: now,
      rates: data.rates,
    };
    
    return ratesCache.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return cached rates if available, even if expired
    if (ratesCache) {
      return ratesCache.rates;
    }
    throw error;
  }
}

export async function fetchExchangeRate(fromCurrency: string, toCurrency: string = 'EUR'): Promise<number> {
  // If converting between same currencies, return 1
  if (fromCurrency === toCurrency) {
    return 1;
  }

  try {
    const rates = await getRates();
    
    // Since Fixer.io free plan only provides EUR as base, we need to handle conversions differently
    if (fromCurrency === 'EUR') {
      // Direct conversion from EUR to target currency
      return rates[toCurrency];
    } else if (toCurrency === 'EUR') {
      // Inverse rate when converting to EUR
      return 1 / rates[fromCurrency];
    } else {
      // Cross rate calculation through EUR
      // First convert to EUR, then to target currency
      const eurRate = 1 / rates[fromCurrency]; // Convert to EUR
      return eurRate * rates[toCurrency]; // Convert from EUR to target
    }
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    throw new Error(`Failed to get exchange rate from ${fromCurrency} to ${toCurrency}`);
  }
}

export function clearRatesCache() {
  ratesCache = null;
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  BRL: 'R$',
  USD: '$',
  GBP: '£',
};

export const CURRENCY_OPTIONS = [
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'Brazilian Real (BRL)', value: 'BRL' },
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'British Pound (GBP)', value: 'GBP' },
] as const;

export const DEFAULT_CURRENCY = 'EUR';

export function validateCurrency(currency: string | undefined | null): string {
  if (!currency) {
    return DEFAULT_CURRENCY;
  }
  
  const isValidCurrency = CURRENCY_OPTIONS.some(option => option.value === currency);
  return isValidCurrency ? currency : DEFAULT_CURRENCY;
}

export function formatCurrency(
  amount: number,
  currency: string,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSymbol?: boolean;
  } = {}
): string {
  const validCurrency = validateCurrency(currency);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: validCurrency,
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(amount);
}

export function formatCurrencyWithRate(
  amount: number,
  fromCurrency: string,
  toCurrency: string = 'EUR',
  exchangeRate?: number
): string {
  const symbol = CURRENCY_SYMBOLS[fromCurrency];
  const targetSymbol = CURRENCY_SYMBOLS[toCurrency];
  const originalAmount = `${symbol}${amount.toFixed(2)}`;
  
  if (!exchangeRate || fromCurrency === toCurrency) {
    return originalAmount;
  }
  
  const convertedAmount = amount * exchangeRate;
  const rateInfo = `1 ${fromCurrency} = ${exchangeRate.toFixed(3)} ${toCurrency}`;
  const currentDate = new Date().toISOString().split('T')[0];
  return `${originalAmount} ≈ ${targetSymbol}${convertedAmount.toFixed(2)} (${rateInfo} as of ${currentDate})`;
}
