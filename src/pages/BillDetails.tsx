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
import { BillStatusDisplay } from "@/components/bills/BillStatusDisplay";
import { BillDetailsGrid } from "@/components/bills/BillDetailsGrid";
import { BillRecurringInfo } from "@/components/bills/BillRecurringInfo";
import { BillNotes } from "@/components/bills/BillNotes";
import { BillAttachment } from "@/components/bills/BillAttachment";

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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{bill.provider}</CardTitle>
            <CardDescription>Bill Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <BillDetailsGrid bill={bill} />
            <Separator />
            <BillRecurringInfo bill={bill} />
            {bill.notes && (
              <>
                <Separator />
                <BillNotes notes={bill.notes} />
              </>
            )}
            {bill.attachment && (
              <>
                <Separator />
                <BillAttachment billId={bill.id} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillDetails;