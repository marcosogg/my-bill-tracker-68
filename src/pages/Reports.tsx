import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StandardPageLayout, PageHeader } from "@/components/layouts/PageLayout";
import { useReportData, formatCurrency } from "@/hooks/useReportData";
import { CURRENCY_OPTIONS } from "@/utils/currencyUtils";
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
        {/* Total Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Total Spending Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total (EUR Equivalent)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalEurEquivalent, "EUR")}
                  </div>
                </CardContent>
              </Card>
              
              {currencyTotals.map((total) => (
                <Card key={total.currency}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total in {total.currency}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(total.total, total.currency)}
                    </div>
                    {total.currency !== "EUR" && (
                      <div className="text-sm text-muted-foreground">
                        ≈ {formatCurrency(total.eurEquivalent, "EUR")}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {total.count} bills
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Bills View */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Detailed View</CardTitle>
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
            >
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
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="space-y-4">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="chart">Chart View</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <BillsTable
                  bills={
                    selectedCurrency === "all"
                      ? Object.values(billsByCurrency).flat()
                      : billsByCurrency[selectedCurrency] || []
                  }
                  sortField="due_date"
                  sortOrder="desc"
                  onSort={() => {}}
                  refetchBills={() => {}}
                />
              </TabsContent>
              <TabsContent value="chart">
                <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                  Charts coming soon
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </StandardPageLayout>
  );
};

export default Reports;
