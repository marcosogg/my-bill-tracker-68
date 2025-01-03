import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY, validateCurrency } from '@/utils/currencyUtils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

const billFormSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  due_date: z.string().min(1, 'Due date is required'),
  category: z.string().min(1, 'Category is required'),
  location_person: z.string().min(1, 'Location/Person is required'),
  payment_method: z.string().min(1, 'Payment method is required'),
  notes: z.string().optional(),
  recurring: z.boolean().optional(),
});

type BillFormValues = z.infer<typeof billFormSchema>;

interface BillFormProps {
  initialData?: Partial<BillFormValues>;
  onSuccess?: () => void;
  mode: 'create' | 'edit';
  billId?: string;
}

export function BillForm({ initialData, onSuccess, mode, billId }: BillFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      provider: initialData?.provider || '',
      amount: initialData?.amount || 0,
      currency: validateCurrency(initialData?.currency) || DEFAULT_CURRENCY,
      due_date: initialData?.due_date || format(new Date(), 'yyyy-MM-dd'),
      category: initialData?.category || '',
      location_person: initialData?.location_person || '',
      payment_method: initialData?.payment_method || '',
      notes: initialData?.notes || '',
      recurring: initialData?.recurring || false,
    },
  });

  async function onSubmit(data: BillFormValues) {
    try {
      setIsLoading(true);
      
      // Ensure currency is valid
      const validatedCurrency = validateCurrency(data.currency);
      
      const billData = {
        amount: data.amount,
        category: data.category,
        currency: validatedCurrency,
        due_date: data.due_date,
        location_person: data.location_person,
        payment_method: data.payment_method,
        provider: data.provider,
        notes: data.notes || null,
        recurring: data.recurring || false,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('bills')
          .insert([billData]);

        if (error) throw error;
        toast.success('Bill created successfully');
      } else if (mode === 'edit' && billId) {
        const { error } = await supabase
          .from('bills')
          .update(billData)
          .eq('id', billId);

        if (error) throw error;
        toast.success('Bill updated successfully');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving bill:', error);
      toast.error('Failed to save bill');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    onClick={() => setShowCalendar(true)}
                    readOnly
                  />
                  {showCalendar && (
                    <div className="absolute z-10 mt-1">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => {
                          field.onChange(format(date!, 'yyyy-MM-dd'));
                          setShowCalendar(false);
                        }}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Bill' : 'Update Bill'}
        </Button>
      </form>
    </Form>
  );
}
