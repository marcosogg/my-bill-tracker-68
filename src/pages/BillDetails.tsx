import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "../integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { BillAttachment } from "../components/bills/BillAttachment";
import { BillStatus } from "../components/bills/BillStatus";
import { RecurringBillInfo } from "../components/bills/RecurringBillInfo";
import { StandardPageLayout, PageHeader } from "../components/layouts/PageLayout";

type Bill = {
  id: string;
  provider: string;
  due_date: string;
  amount: number;
  category: string;
  payment_method: string;
  location_person: string;
  notes: string | null;
  recurring: boolean | null;
  estimated_amount: number | null;
  attachment: string | null;
};

const BillDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: bill, isLoading } = useQuery({
    queryKey: ["bill", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Bill;
    },
  });

  if (isLoading) {
    return (
      <StandardPageLayout>
        <PageHeader title="Bill Details" />
        <div className="max-w-3xl mx-auto">
          <p className="text-center py-8">Loading bill details...</p>
        </div>
      </StandardPageLayout>
    );
  }

  if (!bill) {
    return (
      <StandardPageLayout>
        <PageHeader title="Bill Details" />
        <div className="max-w-3xl mx-auto">
          <p className="text-center py-8 text-muted-foreground">Bill not found</p>
        </div>
      </StandardPageLayout>
    );
  }

  return (
    <StandardPageLayout>
      <PageHeader title={bill.provider} />
      
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{bill.provider}</CardTitle>
            <CardDescription>Bill Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-lg">
                  {format(new Date(bill.due_date), "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-lg">${bill.amount.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{bill.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p>{bill.payment_method}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Location/Person</p>
                <p>{bill.location_person}</p>
              </div>
              <BillStatus dueDate={bill.due_date} />
            </div>

            <Separator />

            <RecurringBillInfo 
              recurring={bill.recurring} 
              estimatedAmount={bill.estimated_amount} 
            />

            {bill.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="whitespace-pre-wrap">{bill.notes}</p>
                </div>
              </>
            )}

            {bill.attachment && (
              <>
                <Separator />
                <BillAttachment 
                  attachment={bill.attachment} 
                  billId={bill.id} 
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </StandardPageLayout>
  );
};

export default BillDetails;