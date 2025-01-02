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

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

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
  payment_status?: 'paid' | 'unpaid';
  paid_date?: string | null;
};

const BillDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleMarkAsPaid = async (paidDate: Date) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({
          payment_status: 'paid',
          paid_date: paidDate.toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Bill marked as paid");
      refetch();
    } catch (error) {
      toast.error("Failed to mark bill as paid");
      console.error("Error marking bill as paid:", error);
    }
  };

  const handleUnmarkAsPaid = async () => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({
          payment_status: 'unpaid',
          paid_date: null
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Bill marked as unpaid");
      refetch();
    } catch (error) {
      toast.error("Failed to mark bill as unpaid");
      console.error("Error marking bill as unpaid:", error);
    }
  };

  const { data: bill, isLoading, refetch } = useQuery({
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
                  {format(new Date(bill.due_date), "dd/MM/yyyy")}
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
              <BillStatus 
                dueDate={bill.due_date}
                paymentStatus={bill.payment_status}
                paidDate={bill.paid_date}
              />
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

            <Separator />

            <div className="flex justify-end">
              {bill.payment_status === 'paid' ? (
                <Button
                  variant="outline"
                  onClick={handleUnmarkAsPaid}
                >
                  Mark as Unpaid
                </Button>
              ) : (
                <Button
                  onClick={() => setShowDateDialog(true)}
                >
                  Mark as Paid
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Date</DialogTitle>
            <DialogDescription>
              Choose the date when this bill was paid.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleMarkAsPaid(selectedDate);
                setShowDateDialog(false);
              }}
            >
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StandardPageLayout>
  );
};

export default BillDetails;
