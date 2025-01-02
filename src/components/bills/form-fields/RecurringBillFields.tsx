import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormValues } from "@/hooks/useAddBill";

interface RecurringBillFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function RecurringBillFields({ form }: RecurringBillFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="recurring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Recurring Bill</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {form.watch("recurring") && (
        <FormField
          control={form.control}
          name="estimated_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter estimated amount"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseFloat(value) : undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}