const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/EUR';

export async function fetchExchangeRate(fromCurrency: string, toCurrency: string = 'EUR'): Promise<number> {
  try {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    
    if (fromCurrency === 'EUR') {
      return data.rates[toCurrency];
    } else if (toCurrency === 'EUR') {
      // Inverse the rate when converting to EUR
      return 1 / data.rates[fromCurrency];
    } else {
      // Cross rate calculation
      const eurToFrom = data.rates[fromCurrency];
      const eurToTo = data.rates[toCurrency];
      return eurToTo / eurToFrom;
    }
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return 1; // Default to 1 if we can't fetch the rate
  }
}

export const CURRENCY_OPTIONS = [
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'Brazilian Real (BRL)', value: 'BRL' },
] as const;

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  BRL: 'R$',
};
