import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { formSchema, type FormValues } from "@/hooks/useAddBill";
import { useEditBill } from "@/hooks/useEditBill";
import { BillFormFields } from "./BillFormFields";

interface EditBillFormProps {
  bill: {
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
}

export function EditBillForm({ bill }: EditBillFormProps) {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: bill.provider,
      due_date: new Date(bill.due_date),
      amount: bill.amount.toString(),
      category: bill.category as FormValues["category"],
      payment_method: bill.payment_method,
      location_person: bill.location_person as FormValues["location_person"],
      notes: bill.notes || "",
      recurring: bill.recurring || false,
      estimated_amount: bill.estimated_amount?.toString() || "",
    },
  });

  const { mutate: updateBill, isPending } = useEditBill(bill.id);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updateBill(data))}
        className="space-y-6"
      >
        <BillFormFields form={form} />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update Bill
          </Button>
        </div>
      </form>
    </Form>
  );
}