import { 
  fetchExchangeRate,
  validateCurrency,
  formatCurrency,
  CURRENCY_SYMBOLS,
  CURRENCY_OPTIONS,
  DEFAULT_CURRENCY
} from '../currencyUtils';

// Mock the global fetch function
global.fetch = jest.fn();

describe('Currency Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock response for fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({
        rates: {
          EUR: 1,
          BRL: 5.30,
          USD: 1.10
        }
      })
    });
  });

  describe('fetchExchangeRate', () => {
    it('should return 1 when converting EUR to EUR', async () => {
      const rate = await fetchExchangeRate('EUR', 'EUR');
      expect(rate).toBe(1);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch and calculate correct rate from EUR to BRL', async () => {
      const rate = await fetchExchangeRate('EUR', 'BRL');
      expect(rate).toBe(5.30);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should fetch and calculate correct rate from BRL to EUR', async () => {
      const rate = await fetchExchangeRate('BRL', 'EUR');
      expect(rate).toBeCloseTo(0.1886792, 6); // 1/5.30
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      const rate = await fetchExchangeRate('BRL', 'EUR');
      expect(rate).toBe(1); // Default fallback value
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should calculate cross rates correctly', async () => {
      const rate = await fetchExchangeRate('USD', 'BRL');
      expect(rate).toBeCloseTo(4.818182, 6); // 5.30/1.10
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateCurrency', () => {
    it('should return DEFAULT_CURRENCY for null or undefined input', () => {
      expect(validateCurrency(null)).toBe(DEFAULT_CURRENCY);
      expect(validateCurrency(undefined)).toBe(DEFAULT_CURRENCY);
    });

    it('should return the input currency if valid', () => {
      expect(validateCurrency('EUR')).toBe('EUR');
      expect(validateCurrency('BRL')).toBe('BRL');
    });

    it('should return DEFAULT_CURRENCY for invalid currency', () => {
      expect(validateCurrency('INVALID')).toBe(DEFAULT_CURRENCY);
      expect(validateCurrency('')).toBe(DEFAULT_CURRENCY);
    });
  });

  describe('formatCurrency', () => {
    it('should format EUR correctly', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(1234.5678, 'EUR')).toBe('€1,234.57'); // Tests rounding
    });

    it('should format BRL correctly', () => {
      expect(formatCurrency(1234.56, 'BRL')).toBe('R$1,234.56');
      expect(formatCurrency(1234.5678, 'BRL')).toBe('R$1,234.57'); // Tests rounding
    });

    it('should handle custom fraction digits', () => {
      expect(formatCurrency(1234.5678, 'EUR', { minimumFractionDigits: 2, maximumFractionDigits: 3 }))
        .toBe('€1,234.568');
      expect(formatCurrency(1234.5, 'EUR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        .toBe('€1,234.50');
    });

    it('should handle zero and negative values', () => {
      expect(formatCurrency(0, 'EUR')).toBe('€0.00');
      expect(formatCurrency(-1234.56, 'EUR')).toBe('-€1,234.56');
    });

    it('should handle very large and very small numbers', () => {
      expect(formatCurrency(1000000.00, 'EUR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        .toBe('€1,000,000.00');
      expect(formatCurrency(0.001, 'EUR', { minimumFractionDigits: 2, maximumFractionDigits: 3 }))
        .toBe('€0.001');
    });

    it('should use DEFAULT_CURRENCY for invalid currency input', () => {
      expect(formatCurrency(1234.56, 'INVALID')).toBe('€1,234.56');
      expect(formatCurrency(1234.56, '')).toBe('€1,234.56');
    });
  });

  describe('Currency Constants', () => {
    it('should have correct currency symbols', () => {
      expect(CURRENCY_SYMBOLS).toEqual({
        EUR: '€',
        BRL: 'R$',
      });
    });

    it('should have correct currency options', () => {
      expect(CURRENCY_OPTIONS).toEqual([
        { label: 'Euro (EUR)', value: 'EUR' },
        { label: 'Brazilian Real (BRL)', value: 'BRL' },
      ]);
    });

    it('should have EUR as default currency', () => {
      expect(DEFAULT_CURRENCY).toBe('EUR');
    });
  });
});
