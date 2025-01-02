import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse } from "date-fns";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormValues, formSchema } from "@/hooks/useAddBill";
import { useUpdateBill } from "@/hooks/useUpdateBill";
import { BillFormFields } from "./BillFormFields";

type EditBillFormProps = {
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
  };
};

export const EditBillForm = ({ bill }: EditBillFormProps) => {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recurring: false,
    },
  });

  const { mutate: updateBill, isPending: isUpdating } = useUpdateBill(bill.id);

  React.useEffect(() => {
    if (bill) {
      form.reset({
        provider: bill.provider,
        due_date: parse(bill.due_date, "yyyy-MM-dd", new Date()),
        amount: bill.amount,
        category: bill.category as any,
        payment_method: bill.payment_method,
        location_person: bill.location_person as any,
        notes: bill.notes || "",
        recurring: bill.recurring || false,
        estimated_amount: bill.estimated_amount || undefined,
      });
    }
  }, [bill, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => updateBill(data))} className="space-y-6">
        <BillFormFields form={form} />
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/bills")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Bill
          </Button>
        </div>
      </form>
    </Form>
  );
};