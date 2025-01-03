import { Card, CardContent } from "../components/ui/card";
import { StandardPageLayout, PageHeader } from "../components/layouts/PageLayout";
import ExchangeRateCard from "../components/ExchangeRateCard";

const Settings = () => {
  return (
    <StandardPageLayout>
      <PageHeader title="Settings" />
      
      <div className="grid gap-6 md:gap-8">
        <ExchangeRateCard />
        
        <Card>
          <CardContent>
            <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
              More settings coming soon
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardPageLayout>
  );
};

export default Settings;