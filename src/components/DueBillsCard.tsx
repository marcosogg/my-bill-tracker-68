import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarCheck, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/currencyUtils";

type Bill = {
  id: string;
  provider: string;
  category: string;
  estimated_amount: number;
  due_date: string;
  currency: string;
};

const DueBillsCard = () => {
  const navigate = useNavigate();
  const currentDate = new Date("2025-01-03T13:31:07Z");

  const { data: bills, isLoading } = useQuery({
    queryKey: ["due-bills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("id, provider, category, estimated_amount, due_date, currency")
        .eq("recurring", false)
        .gte("due_date", currentDate.toISOString())
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Bill[];
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5" />
          Due Bills
        </CardTitle>
        <CardDescription>Your upcoming one-time bills</CardDescription>
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
                    Due: {format(new Date(bill.due_date), "dd/MM/yyyy")}
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
            No upcoming bills found
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DueBillsCard;
