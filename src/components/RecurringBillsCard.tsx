import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CURRENCY_SYMBOLS, formatCurrency } from "@/utils/currencyUtils";

type Bill = {
  id: string;
  provider: string;
  category: string;
  estimated_amount: number;
  due_date: string;
  currency: string;
};

const RecurringBillsCard = () => {
  const navigate = useNavigate();

  const { data: bills, isLoading } = useQuery({
    queryKey: ["recurring-bills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("id, provider, category, estimated_amount, due_date, currency")
        .eq("recurring", true)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Bill[];
    },
  });

  const calculateNextDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    
    // If the due date has passed, add months until it's in the future
    while (date < today) {
      date.setMonth(date.getMonth() + 1);
    }
    
    return format(date, "dd/MM/yyyy");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Recurring Bills
        </CardTitle>
        <CardDescription>Your upcoming recurring bills</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading bills...</p>
        ) : bills && bills.length > 0 ? (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                onClick={() => navigate(`/bills/${bill.id}`)}
              >
                <div className="space-y-1">
                  <p className="font-medium">{bill.provider}</p>
                  <p className="text-sm text-muted-foreground">
                    {bill.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Next due: {calculateNextDueDate(bill.due_date)}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-lg font-semibold">
                  {formatCurrency(bill.estimated_amount, bill.currency)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">
            No recurring bills found
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecurringBillsCard;
