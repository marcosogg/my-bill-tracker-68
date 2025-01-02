import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDateForSupabase } from "@/utils/dateUtils";
import { FormValues, formSchema } from "@/hooks/useAddBill";

export const useEditBill = (billId: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: FormValues) => {
      let attachmentPath = values.attachment ? null : undefined; // If no new file, keep existing

      if (values.attachment instanceof File) {
        const fileExt = values.attachment.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${(await supabase.auth.getUser()).data.user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("bill-attachments")
          .upload(filePath, values.attachment);

        if (uploadError) {
          throw new Error("Failed to upload attachment");
        }

        attachmentPath = filePath;
      }

      const { error } = await supabase
        .from("bills")
        .update({
          provider: values.provider,
          due_date: formatDateForSupabase(values.due_date),
          amount: values.amount,
          category: values.category,
          payment_method: values.payment_method,
          location_person: values.location_person,
          notes: values.notes,
          recurring: values.recurring,
          estimated_amount: values.recurring ? values.estimated_amount : null,
          ...(attachmentPath !== undefined && { attachment: attachmentPath }),
        })
        .eq("id", billId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bill updated successfully");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill", billId] });
      navigate("/");
    },
    onError: (error) => {
      toast.error("Failed to update bill: " + error.message);
    },
  });
};