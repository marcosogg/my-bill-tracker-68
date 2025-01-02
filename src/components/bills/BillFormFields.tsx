import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/hooks/useAddBill";
import { BasicInfoFields } from "./form-fields/BasicInfoFields";
import { DueDateField } from "./form-fields/DueDateField";
import { CategoryLocationFields } from "./form-fields/CategoryLocationFields";
import { PaymentMethodField } from "./form-fields/PaymentMethodField";
import { RecurringBillFields } from "./form-fields/RecurringBillFields";
import { NotesAndAttachmentFields } from "./form-fields/NotesAndAttachmentFields";

interface BillFormFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function BillFormFields({ form }: BillFormFieldsProps) {
  return (
    <>
      <BasicInfoFields form={form} />
      <DueDateField form={form} />
      <CategoryLocationFields form={form} />
      <PaymentMethodField form={form} />
      <RecurringBillFields form={form} />
      <NotesAndAttachmentFields form={form} />
    </>
  );
}