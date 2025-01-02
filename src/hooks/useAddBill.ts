import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDateForSupabase } from "@/utils/dateUtils";
import { z } from "zod";

export const formSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  amount: z.string().min(1, "Amount is required").transform((val) => parseFloat(val)),
  category: z.enum([
    "Electricity",
    "Water",
    "Internet",
    "Rent",
    "Gas",
    "Credit Card",
    "Other",
  ]),
  payment_method: z.string().min(1, "Payment method is required"),
  location_person: z.enum([
    "Marcos - Ireland",
    "Marcos - Brazil",
    "Marilia - Brazil",
  ]),
  notes: z.string().optional(),
  recurring: z.boolean().default(false),
  estimated_amount: z.string()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .optional(),
  attachment: z.instanceof(File).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const useAddBill = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: FormValues) => {
      let attachmentPath = null;

      if (values.attachment) {
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

      const { error } = await supabase.from("bills").insert({
        provider: values.provider,
        due_date: formatDateForSupabase(values.due_date),
        amount: values.amount,
        category: values.category,
        payment_method: values.payment_method,
        location_person: values.location_person,
        notes: values.notes,
        recurring: values.recurring,
        estimated_amount: values.recurring ? values.estimated_amount : null,
        attachment: attachmentPath,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bill added successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Failed to add bill: " + error.message);
    },
  });
};