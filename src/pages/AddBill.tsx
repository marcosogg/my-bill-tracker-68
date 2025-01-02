import { PageLayout } from "@/components/layout/PageLayout";
import { AddBillHeader } from "@/components/bills/AddBillHeader";
import { AddBillForm } from "@/components/bills/AddBillForm";

export default function AddBill() {
  return (
    <PageLayout maxWidth="2xl">
      <AddBillHeader />
      <AddBillForm />
    </PageLayout>
  );
}