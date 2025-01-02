import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BudgetManagement = () => {
  return (
    <div className="container mx-auto p-8">
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
    </div>
  );
};

export default BudgetManagement;