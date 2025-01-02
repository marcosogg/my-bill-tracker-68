import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import RecurringBillsCard from "@/components/RecurringBillsCard";
import { PageLayout } from "@/components/layout/PageLayout";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <PageLayout maxWidth="7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Bill Tracker</h1>
        <div className="flex gap-4">
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
        </div>
      </div>
      <div className="grid gap-8">
        <RecurringBillsCard />
      </div>
    </PageLayout>
  );
};

export default Index;