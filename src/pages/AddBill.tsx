import { AddBillForm } from "@/components/bills/AddBillForm";

export default function AddBill() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Bill</h1>
        </div>
        <AddBillForm />
      </div>
    </div>
  );
}