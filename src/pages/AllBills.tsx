import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BillsFilter } from "@/components/bills/BillsFilter";
import { BillsTable, type Bill, type SortField, type SortOrder } from "@/components/bills/BillsTable";

const AllBills = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("All");
  const [category, setCategory] = useState("All");
  const [paidStatus, setPaidStatus] = useState("All");
  const [sortField, setSortField] = useState<SortField>("due_date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { data: bills, isLoading } = useQuery({
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">All Bills</h1>
          <Button onClick={() => navigate("/add-bill")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Bill
          </Button>
        </div>

        <BillsFilter
          location={location}
          category={category}
          paidStatus={paidStatus}
          onLocationChange={setLocation}
          onCategoryChange={setCategory}
          onPaidStatusChange={setPaidStatus}
        />

        {isLoading ? (
          <div className="text-center py-8">Loading bills...</div>
        ) : bills && bills.length > 0 ? (
          <BillsTable
            bills={bills}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={toggleSort}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No bills found matching the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBills;