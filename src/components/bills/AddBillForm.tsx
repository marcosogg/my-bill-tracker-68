import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAddBill, formSchema, type FormValues } from "@/hooks/useAddBill";
import { BillFormFields } from "@/components/bills/BillFormFields";

export function AddBillForm() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recurring: false,
      notes: "",
    },
  });

  const { mutate: createBill, isPending } = useAddBill();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => createBill(data))}
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
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Bill
          </Button>
        </div>
      </form>
    </Form>
  );
}