import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
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

export const BillsTable = ({ bills, sortField, sortOrder, onSort }: BillsTableProps) => {
  const navigate = useNavigate();

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
          );
        })}
      </TableBody>
    </Table>
  );
};