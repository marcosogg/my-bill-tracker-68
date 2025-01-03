import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StandardPageLayout, PageHeader } from "@/components/layouts/PageLayout";
import { format } from "date-fns";
import { BillStatus } from "@/components/bills/BillStatus";

type Payment = {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  paid_date: string;
};

const PaymentHistory = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("id, provider, amount, currency, paid_date")
        .eq("payment_status", "paid")
        .order("paid_date", { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
  });

  return (
    <StandardPageLayout>
      <PageHeader title="Payment History" />

      <div className="grid gap-6 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              A list of your past payments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading payments...</div>
            ) : payments && payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.provider}</TableCell>
                      <TableCell>{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.currency}</TableCell>
                      <TableCell>
                        {format(new Date(payment.paid_date!), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <BillStatus
                          dueDate={payment.paid_date!}
                          paymentStatus="paid"
                          paidDate={payment.paid_date}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No payment history found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StandardPageLayout>
  );
};

export default PaymentHistory;