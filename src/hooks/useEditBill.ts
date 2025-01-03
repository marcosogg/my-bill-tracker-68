import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDateForSupabase } from "@/utils/dateUtils";
import { FormValues, formSchema } from "@/hooks/useAddBill";
import { fetchExchangeRate } from "@/utils/currencyUtils";

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

      // Get current bill data to check if currency changed
      const { data: currentBill } = await supabase
        .from("bills")
        .select("currency")
        .eq("id", billId)
        .single();

      // Only fetch new exchange rate if currency changed
      let exchange_rate;
      if (currentBill && currentBill.currency !== values.currency) {
        exchange_rate = values.currency === "EUR" ? 1 : await fetchExchangeRate(values.currency);
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
          currency: values.currency,
          ...(exchange_rate !== undefined && { exchange_rate }),
        })
        .eq("id", billId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bill updated successfully");
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill", billId] });
      queryClient.invalidateQueries({ queryKey: ["reportData"] }); // Invalidate reports data
      navigate("/");
    },
    onError: (error) => {
      toast.error("Failed to update bill: " + error.message);
    },
  });
};
