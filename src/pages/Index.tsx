import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import RecurringBillsCard from "../components/RecurringBillsCard";
import { StandardPageLayout, PageHeader } from "../components/layouts/PageLayout";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const headerActions = (
    <>
      <Button
        onClick={() => navigate("/add-bill")}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Bill
      </Button>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );

  return (
    <StandardPageLayout>
      <PageHeader 
        title="My Bill Tracker"
        actions={headerActions}
      />
      
      <div className="grid gap-6 md:gap-8">
        <RecurringBillsCard />
      </div>
    </StandardPageLayout>
  );
};

export default Index;
