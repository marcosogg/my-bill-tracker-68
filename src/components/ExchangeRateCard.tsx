import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchExchangeRate, clearRatesCache } from '@/utils/currencyUtils';
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExchangeRateCard: React.FC = () => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getExchangeRate = async (clearCache: boolean = false) => {
    try {
      setLoading(true);
      if (clearCache) {
        clearRatesCache();
      }
      const rate = await fetchExchangeRate('BRL', 'EUR');
      setExchangeRate(rate);
      setError(null);
    } catch (err) {
      setError('Failed to fetch exchange rate');
      console.error('Exchange rate fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExchangeRate();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Current Exchange Rate</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => getExchangeRate(true)}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading exchange rates...</p>
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              1 EUR = {exchangeRate ? (1 / exchangeRate).toFixed(4) : '---'} BRL
            </p>
            <p className="text-sm text-muted-foreground">
              1 BRL = {exchangeRate ? exchangeRate.toFixed(4) : '---'} EUR
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Data provided by Fixer.io
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExchangeRateCard;
