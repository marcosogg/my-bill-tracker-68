import { AddBillForm } from "../components/bills/AddBillForm";
import { StandardPageLayout, PageHeader } from "../components/layouts/PageLayout";
import { Card, CardContent } from "../components/ui/card";

export default function AddBill() {
  return (
    <StandardPageLayout>
      <PageHeader 
        title="Add New Bill"
      />
      
      <div className="grid gap-6 md:gap-8">
        <Card>
          <CardContent>
            <AddBillForm />
          </CardContent>
        </Card>
      </div>
    </StandardPageLayout>
  );
}