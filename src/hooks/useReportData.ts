import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bill } from "@/components/bills/BillsTable";
import { fetchExchangeRate, CURRENCY_SYMBOLS } from "@/utils/currencyUtils";

interface CurrencyTotal {
  currency: string;
  total: number;
  eurEquivalent: number;
  count: number;
}

interface ReportData {
  currencyTotals: CurrencyTotal[];
  totalEurEquivalent: number;
  billsByCurrency: Record<string, Bill[]>;
}

export function useReportData() {
  return useQuery<ReportData>({
    queryKey: ["reportData"],
    queryFn: async () => {
      // Fetch bills from database
      const { data: bills, error } = await supabase
        .from("bills")
        .select("*")
        .order("due_date", { ascending: false });

      if (error) throw error;

      const billsByCurrency: Record<string, Bill[]> = {};
      const totals: Record<string, CurrencyTotal> = {};

      // Get exchange rates for all currencies
      const uniqueCurrencies = [...new Set(bills.map((bill: Bill) => bill.currency))];
      const exchangeRates: Record<string, number> = {};

      for (const currency of uniqueCurrencies) {
        if (currency !== 'EUR') {
          try {
            exchangeRates[currency] = await fetchExchangeRate(currency, 'EUR');
          } catch (error) {
            console.error(`Failed to fetch exchange rate for ${currency}:`, error);
            // Use stored exchange rate as fallback
            exchangeRates[currency] = 1;
          }
        }
      }

      bills.forEach((bill: Bill) => {
        // Group bills by currency
        if (!billsByCurrency[bill.currency]) {
          billsByCurrency[bill.currency] = [];
        }
        billsByCurrency[bill.currency].push(bill);

        // Calculate totals
        if (!totals[bill.currency]) {
          totals[bill.currency] = {
            currency: bill.currency,
            total: 0,
            eurEquivalent: 0,
            count: 0,
          };
        }

        totals[bill.currency].total += bill.amount;

        // Calculate EUR equivalent using current or stored exchange rate
        const exchangeRate = bill.currency === "EUR" 
          ? 1 
          : bill.exchange_rate || exchangeRates[bill.currency];
          
        totals[bill.currency].eurEquivalent += bill.amount * exchangeRate;
        totals[bill.currency].count += 1;

        // Update bill's exchange rate in database if it's different
        if (bill.currency !== "EUR" && 
            (!bill.exchange_rate || Math.abs(bill.exchange_rate - exchangeRates[bill.currency]) > 0.0001)) {
          supabase
            .from("bills")
            .update({ exchange_rate: exchangeRates[bill.currency] })
            .eq("id", bill.id)
            .then(() => {
              console.log(`Updated exchange rate for bill ${bill.id}`);
            })
            .catch((error) => {
              console.error(`Failed to update exchange rate for bill ${bill.id}:`, error);
            });
        }
      });

      const currencyTotals = Object.values(totals);
      const totalEurEquivalent = currencyTotals.reduce(
        (sum, { eurEquivalent }) => sum + eurEquivalent,
        0
      );

      return {
        currencyTotals,
        totalEurEquivalent,
        billsByCurrency,
      };
    },
  });
}
