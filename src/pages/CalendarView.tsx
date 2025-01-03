import { useQuery } from "@tanstack/react-query";
import { StandardPageLayout, PageHeader } from "../components/layouts/PageLayout";
import { Calendar } from "../components/ui/calendar";
import { Card, CardContent } from "../components/ui/card";
import { supabase } from "../integrations/supabase/client";
import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { Bill } from "../components/bills/BillsTable";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [month, setMonth] = useState<Date>(new Date());

  const navigate = useNavigate();

  const { data: bills, isLoading } = useQuery({
    queryKey: ["bills", format(month, "yyyy-MM")],
    queryFn: async () => {
      const firstDayOfMonth = format(month, "yyyy-MM-01");
      const lastDayOfMonth = format(
        new Date(month.getFullYear(), month.getMonth() + 1, 0),
        "yyyy-MM-dd"
      );
      const { data, error } = await supabase
        .from("bills")
        .select("id, provider, due_date, amount, currency, category, payment_status")
        .gte("due_date", firstDayOfMonth)
        .lte("due_date", lastDayOfMonth)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Bill[];
    },
  });

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setShowDateDialog(true);
  };

  const handleMonthChange = (date: Date) => {
    setMonth(date);
  };

  const billsOnSelectedDate = bills
    ? bills.filter((bill) =>
        isSameDay(new Date(bill.due_date), selectedDate)
      )
    : [];

  const getDotColor = (date: Date) => {
    const billsOnDate = bills
      ? bills.filter((bill) => isSameDay(new Date(bill.due_date), date))
      : [];

    if (billsOnDate.some((bill) => bill.payment_status === "unpaid")) {
      return "red";
    }

    return "green";
  };

  return (
    <StandardPageLayout>
      <PageHeader title="Calendar View" />

      <div className="grid gap-6 md:gap-8">
        <Card>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              onMonthChange={handleMonthChange}
              className="border rounded-md"
              defaultMonth={month}
              showOutsideDays
              modifiers={{
                highlighted: bills
                  ? bills.map((bill) => new Date(bill.due_date))
                  : [],
              }}
              modifiersStyles={{
                highlighted: {
                  backgroundImage: "none",
                },
              }}
              components={{
                Day: ({ date, ...props }) => {
                  const dotColor = getDotColor(date);
                  return (
                    <div className="relative" {...props}>
                      <Button
                        variant="ghost"
                        className="h-9 w-9 p-0 font-normal"
                        onClick={() => handleDateChange(date)}
                      >
                        {format(date, "d")}
                      </Button>
                      {bills?.some((bill) =>
                        isSameDay(new Date(bill.due_date), date)
                      ) && (
                        <span
                          className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${
                            dotColor === "red"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        ></span>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>

        <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Bills Due on {format(selectedDate, "dd/MM/yyyy")}
              </DialogTitle>
              <DialogDescription>
                List of bills due on the selected date.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {billsOnSelectedDate.length > 0 ? (
                billsOnSelectedDate.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => {
                      setShowDateDialog(false);
                      navigate(`/bills/${bill.id}`);
                    }}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{bill.provider}</p>
                      <p className="text-sm text-muted-foreground">
                        {bill.category}
                      </p>
                    </div>
                    <div className="text-lg font-semibold">
                      {bill.currency} {bill.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No bills due on this date.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDateDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </StandardPageLayout>
  );
};

export default CalendarView;