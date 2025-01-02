import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";

const BudgetManagement = () => {
  return (
    <PageLayout>
      <Card>
        <CardHeader>
          <CardTitle>Budget Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
            Coming soon
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default BudgetManagement;