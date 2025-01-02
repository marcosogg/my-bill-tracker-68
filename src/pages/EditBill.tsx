import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { EditBillForm } from "../components/bills/EditBillForm";
import { StandardPageLayout, PageHeader } from "../components/layouts/PageLayout";

const EditBill = () => {
  const { id } = useParams<{ id: string }>();

  const { data: bill, isLoading } = useQuery({
    queryKey: ["bill", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Bill not found");
      return data;
    },
  });

  if (isLoading) {
    return (
      <StandardPageLayout>
        <PageHeader title="Edit Bill" />
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </StandardPageLayout>
    );
  }

  if (!bill) {
    return (
      <StandardPageLayout>
        <PageHeader title="Edit Bill" />
        <div className="max-w-2xl mx-auto">
          <p className="text-center py-8 text-muted-foreground">Bill not found</p>
        </div>
      </StandardPageLayout>
    );
  }

  return (
    <StandardPageLayout>
      <PageHeader title={`Edit Bill - ${bill.provider}`} />
      
      <div className="max-w-2xl mx-auto">
        <EditBillForm bill={bill} />
      </div>
    </StandardPageLayout>
  );
};

export default EditBill;