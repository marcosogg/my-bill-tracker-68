import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "@/hooks/useAddBill";

interface CategoryLocationFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function CategoryLocationFields({ form }: CategoryLocationFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                <SelectItem value="Internet">Internet</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Gas">Gas</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location_person"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location/Person</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select location/person" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Marcos - Ireland">Marcos - Ireland</SelectItem>
                <SelectItem value="Marcos - Brazil">Marcos - Brazil</SelectItem>
                <SelectItem value="Marilia - Brazil">Marilia - Brazil</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}