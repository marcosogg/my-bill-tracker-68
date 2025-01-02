import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  const getPaidStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    return due < today ? "Overdue" : "Unpaid";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-500";
      case "Unpaid":
        return "text-yellow-500";
      case "Overdue":
        return "text-red-500";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-muted-foreground">Bill not found</p>
        </div>
      </div>
    );
  }

  const status = getPaidStatus(bill.due_date);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{bill.provider}</CardTitle>
            <CardDescription>Bill Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{bill.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p>{bill.payment_method}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Location/Person</p>
                <p>{bill.location_person}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={getStatusColor(status)}>{status}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Recurring Bill</p>
              <p>{bill.recurring ? "Yes" : "No"}</p>
              {bill.recurring && bill.estimated_amount && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Estimated Amount
                  </p>
                  <p>${bill.estimated_amount.toFixed(2)}</p>
                </div>
              )}
            </div>

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
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Attachment</p>
                  <a
                    href={`${supabase.storage.from('bill-attachments').getPublicUrl(bill.attachment).data.publicUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <FileIcon className="h-4 w-4" />
                    View Attachment
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillDetails;