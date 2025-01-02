import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { BillsFilter } from "../components/bills/BillsFilter";
import { BillsTable, type Bill, type SortField, type SortOrder } from "../components/bills/BillsTable";
import { StandardPageLayout, PageHeader } from "../components/layouts/PageLayout";

const AllBills = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("All");
  const [category, setCategory] = useState("All");
  const [paidStatus, setPaidStatus] = useState("All");
  const [sortField, setSortField] = useState<SortField>("due_date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { data: bills, isLoading, refetch } = useQuery({
    queryKey: ["bills", location, category, paidStatus, sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from("bills")
        .select("id, provider, due_date, amount, category, location_person");

      if (location !== "All") {
        query = query.eq("location_person", location);
      }

      if (category !== "All") {
        query = query.eq("category", category);
      }

      query = query.order(sortField, { ascending: sortOrder === "asc" });

      const { data, error } = await query;

      if (error) throw error;

      return (data as Bill[]).filter((bill) => {
        if (paidStatus === "All") return true;

        const dueDate = new Date(bill.due_date);
        const today = new Date();
        const isPastDue = dueDate < today;

        switch (paidStatus) {
          case "Paid":
            return !isPastDue;
          case "Unpaid":
            return !isPastDue;
          case "Overdue":
            return isPastDue;
          default:
            return true;
        }
      });
    },
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const headerActions = (
    <Button onClick={() => navigate("/add-bill")}>
      <Plus className="h-4 w-4 mr-2" />
      Add New Bill
    </Button>
  );

  return (
    <StandardPageLayout>
      <PageHeader 
        title="All Bills"
        actions={headerActions}
      />
      
      <div className="grid gap-6 md:gap-8">
        <Card>
          <CardContent>
            <BillsFilter
              location={location}
              category={category}
              paidStatus={paidStatus}
              onLocationChange={setLocation}
              onCategoryChange={setCategory}
              onPaidStatusChange={setPaidStatus}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading bills...</div>
            ) : bills && bills.length > 0 ? (
              <BillsTable
                bills={bills}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={toggleSort}
                refetchBills={refetch}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No bills found matching the selected criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StandardPageLayout>
  );
};

export default AllBills;