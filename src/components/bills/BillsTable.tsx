import { format } from "date-fns";
import { ArrowUpDown, Pencil, Trash, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { BillStatus } from "./BillStatus";

export type Bill = {
  id: string;
  provider: string;
  due_date: string;
  amount: number;
  currency: string;
  exchange_rate: number | null;
  category: string;
  location_person: string;
  payment_status?: 'paid' | 'unpaid';
  paid_date?: string | null;
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  BRL: 'R$'
};

const formatAmount = (amount: number, currency: string, exchange_rate: number | null) => {
  const formatted = `${CURRENCY_SYMBOLS[currency]}${amount.toFixed(2)}`;
  if (currency !== 'EUR' && exchange_rate) {
    const eurAmount = amount * exchange_rate;
    return `${formatted} (€${eurAmount.toFixed(2)})`;
  }
  return formatted;
};

export type SortField = "due_date" | "amount" | "provider" | "currency";
export type SortOrder = "asc" | "desc";

type BillsTableProps = {
  bills: Bill[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  refetchBills: () => void;
};

export const BillsTable = ({ bills, sortField, sortOrder, onSort, refetchBills }: BillsTableProps) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  const handleMarkAsPaid = async (bill: Bill, paidDate: Date) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({
          payment_status: 'paid',
          paid_date: paidDate.toISOString()
        })
        .eq("id", bill.id);

      if (error) throw error;

      toast.success("Bill marked as paid");
      refetchBills();
    } catch (error) {
      toast.error("Failed to mark bill as paid");
      console.error("Error marking bill as paid:", error);
    }
  };

  const handleUnmarkAsPaid = async (bill: Bill) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({
          payment_status: 'unpaid',
          paid_date: null
        })
        .eq("id", bill.id);

      if (error) throw error;

      toast.success("Bill marked as unpaid");
      refetchBills();
    } catch (error) {
      toast.error("Failed to mark bill as unpaid");
      console.error("Error marking bill as unpaid:", error);
    }
  };

  const handleDelete = async (billId: string) => {
    try {
      const { error } = await supabase
        .from("bills")
        .delete()
        .eq("id", billId);

      if (error) throw error;

      toast.success("Bill deleted successfully");
      refetchBills();
      navigate("/bills");
    } catch (error) {
      toast.error("Failed to delete bill");
      console.error("Error deleting bill:", error);
    }
  };

  const handleRowClick = (e: React.MouseEvent, billId: string) => {
    if ((e.target as HTMLElement).closest('.action-button')) {
      e.stopPropagation();
      return;
    }
    navigate(`/bills/${billId}`);
  };

  return (
    <>
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
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("currency")}
                className="flex items-center gap-2"
              >
                Currency
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
          {bills.map((bill) => (
            <TableRow
              key={bill.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={(e) => handleRowClick(e, bill.id)}
            >
              <TableCell>{bill.provider}</TableCell>
              <TableCell>
                {format(new Date(bill.due_date), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{formatAmount(bill.amount, bill.currency, bill.exchange_rate)}</TableCell>
              <TableCell>{bill.currency}</TableCell>
              <TableCell>{bill.category}</TableCell>
              <TableCell>{bill.location_person}</TableCell>
              <TableCell>
                <BillStatus 
                  dueDate={bill.due_date}
                  paymentStatus={bill.payment_status}
                  paidDate={bill.paid_date}
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {bill.payment_status === 'paid' ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnmarkAsPaid(bill);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBill(bill);
                        setShowDateDialog(true);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="action-button"
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
                        className="action-button"
                      >
                        <Trash className="h-4 w-4" />
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
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Date</DialogTitle>
            <DialogDescription>
              Choose the date when this bill was paid.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedBill) {
                  handleMarkAsPaid(selectedBill, selectedDate);
                  setShowDateDialog(false);
                  setSelectedBill(null);
                }
              }}
            >
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
