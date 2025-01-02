import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { Plus, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Bill = {
  id: string;
  provider: string;
  due_date: string;
  amount: number;
  category: string;
  location_person: string;
};

type SortField = "due_date" | "amount" | "provider";
type SortOrder = "asc" | "desc";

const CATEGORIES = [
  "All",
  "Electricity",
  "Water",
  "Internet",
  "Rent",
  "Gas",
  "Credit Card",
  "Other",
];

const LOCATIONS = [
  "All",
  "Marcos - Ireland",
  "Marcos - Brazil",
  "Marilia - Brazil",
];

const PAID_STATUS = ["All", "Paid", "Unpaid", "Overdue"];

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

      // Add sorting
      query = query.order(sortField, { ascending: sortOrder === "asc" });

      const { data, error } = await query;

      if (error) throw error;

      // Filter by paid status on the client side since it's calculated
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

  const getPaidStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    return due < today ? "Overdue" : "Unpaid";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-500";
      case "Unpaid":
        return "text-yellow-500";
      case "Overdue":
        return "text-red-500";
      default:
        return "";
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

        <div className="flex flex-wrap gap-4">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={paidStatus} onValueChange={setPaidStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PAID_STATUS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading bills...</div>
        ) : bills && bills.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("due_date")}
                    className="flex items-center gap-2"
                  >
                    Due Date
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("amount")}
                    className="flex items-center gap-2"
                  >
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location/Person</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => {
                const status = getPaidStatus(bill.due_date);
                return (
                  <TableRow
                    key={bill.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/bills/${bill.id}`)}
                  >
                    <TableCell>{bill.provider}</TableCell>
                    <TableCell>
                      {format(new Date(bill.due_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>${bill.amount.toFixed(2)}</TableCell>
                    <TableCell>{bill.category}</TableCell>
                    <TableCell>{bill.location_person}</TableCell>
                    <TableCell className={getStatusColor(status)}>
                      {status}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
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