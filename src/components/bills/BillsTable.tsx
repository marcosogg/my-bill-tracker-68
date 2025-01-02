import { format } from "date-fns";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Bill = {
  id: string;
  provider: string;
  due_date: string;
  amount: number;
  category: string;
  location_person: string;
};

export type SortField = "due_date" | "amount" | "provider";
export type SortOrder = "asc" | "desc";

type BillsTableProps = {
  bills: Bill[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  refetchBills: () => void;
};

export const getStatusColor = (status: string) => {
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

export const getPaidStatus = (dueDate: string) => {
  const due = new Date(dueDate);
  const today = new Date();
  return due < today ? "Overdue" : "Unpaid";
};

export const BillsTable = ({ bills, sortField, sortOrder, onSort, refetchBills }: BillsTableProps) => {
  const navigate = useNavigate();

  const handleDelete = async (billId: string) => {
    try {
      const { error } = await supabase
        .from("bills")
        .delete()
        .eq("id", billId);

      if (error) throw error;

      toast({
        title: "Bill deleted successfully",
        description: "The bill has been removed from your records.",
      });
      
      refetchBills();
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast({
        title: "Error deleting bill",
        description: "There was a problem deleting the bill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (e: React.MouseEvent, billId: string) => {
    // Only navigate if the click wasn't on a button
    if (!(e.target as HTMLElement).closest('button')) {
      navigate(`/bills/${billId}`);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Provider</TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => onSort("due_date")}
              className="flex items-center gap-2"
            >
              Due Date
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => onSort("amount")}
              className="flex items-center gap-2"
            >
              Amount
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Location/Person</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map((bill) => {
          const status = getPaidStatus(bill.due_date);
          return (
            <TableRow
              key={bill.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={(e) => handleRowClick(e, bill.id)}
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
              <TableCell className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/bills/${bill.id}/edit`);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Bill</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this bill? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(bill.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};