import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "@/hooks/useAddBill";

interface PaymentMethodFieldProps {
  form: UseFormReturn<FormValues>;
}

export function PaymentMethodField({ form }: PaymentMethodFieldProps) {
  return (
    <FormField
      control={form.control}
      name="payment_method"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payment Method</FormLabel>
          <FormControl>
            <Input placeholder="Enter payment method" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}