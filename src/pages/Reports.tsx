import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StandardPageLayout, PageHeader } from "@/components/layouts/PageLayout";
import { useReportData } from "@/hooks/useReportData";
import { CURRENCY_OPTIONS, formatCurrency, formatCurrencyWithRate } from "@/utils/currencyUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillsTable } from "@/components/bills/BillsTable";

const Reports = () => {
  const { data: reportData, isLoading } = useReportData();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("all");

  if (isLoading) {
    return (
      <StandardPageLayout>
        <PageHeader title="Reports" />
        <div className="grid gap-6 md:gap-8">
          <Card>
            <CardContent>
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            </CardContent>
          </Card>
        </div>
      </StandardPageLayout>
    );
  }

  if (!reportData) return null;

  const { currencyTotals, totalEurEquivalent, billsByCurrency } = reportData;

  return (
    <StandardPageLayout>
      <PageHeader title="Reports" />
      <div className="grid gap-6 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Currency Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter by currency:</span>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    {CURRENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Currency Totals */}
              <div className="space-y-2">
                {currencyTotals
                  .filter(
                    (total) =>
                      selectedCurrency === "all" ||
                      total.currency === selectedCurrency
                  )
                  .map((total) => (
                    <div
                      key={total.currency}
                      className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                    >
                      <div>
                        <span className="font-medium">
                          {total.currency} Total ({total.count} bills)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(total.total, total.currency)}
                        </div>
                        {total.currency !== "EUR" && (
                          <div className="text-sm text-muted-foreground">
                            {formatCurrencyWithRate(
                              total.total,
                              total.currency,
                              "EUR",
                              total.eurEquivalent / total.total
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                {/* Total in EUR */}
                {selectedCurrency === "all" && (
                  <div className="flex justify-between items-center p-2 rounded-lg bg-primary/10 mt-4">
                    <span className="font-semibold">Total (EUR Equivalent)</span>
                    <span className="font-semibold">
                      {formatCurrency(totalEurEquivalent, "EUR")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bills List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Bills</TabsTrigger>
            {Object.keys(billsByCurrency).map((currency) => (
              <TabsTrigger key={currency} value={currency}>
                {currency}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardContent>
                <BillsTable
                  bills={Object.values(billsByCurrency).flat()}
                  showActions={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {Object.entries(billsByCurrency).map(([currency, bills]) => (
            <TabsContent key={currency} value={currency}>
              <Card>
                <CardContent>
                  <BillsTable bills={bills} showActions={false} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </StandardPageLayout>
  );
};

export default Reports;
