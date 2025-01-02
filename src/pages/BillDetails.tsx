import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileIcon, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

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

  const handleDownload = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({
          title: "Error",
          description: "You must be logged in to download attachments",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-attachment?billId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download attachment');
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'attachment';

      // Create a blob from the response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download attachment",
        variant: "destructive",
      });
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
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Attachment
                  </Button>
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