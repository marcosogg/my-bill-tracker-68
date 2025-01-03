import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bill } from "@/components/bills/BillsTable";
import { CURRENCY_SYMBOLS } from "@/utils/currencyUtils";

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
      const { data: bills, error } = await supabase
        .from("bills")
        .select("*")
        .order("due_date", { ascending: false });

      if (error) throw error;

      const billsByCurrency: Record<string, Bill[]> = {};
      const totals: Record<string, CurrencyTotal> = {};

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
        totals[bill.currency].eurEquivalent += bill.currency === "EUR" 
          ? bill.amount 
          : (bill.amount * (bill.exchange_rate || 1));
        totals[bill.currency].count += 1;
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

export function formatCurrency(amount: number, currency: string): string {
  return `${CURRENCY_SYMBOLS[currency]}${amount.toFixed(2)}`;
}
