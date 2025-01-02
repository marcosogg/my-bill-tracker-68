import { format } from "date-fns";

type BillStatusProps = {
  dueDate: string;
  paymentStatus?: 'paid' | 'unpaid';
  paidDate?: string | null;
};

export const BillStatus = ({ dueDate, paymentStatus = 'unpaid', paidDate }: BillStatusProps) => {
  const getStatus = () => {
    if (paymentStatus === 'paid') return "Paid";
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

  const status = getStatus();

  return (
    <div>
      <p className="text-sm text-muted-foreground">Status</p>
      <p className={getStatusColor(status)}>
        {status}
        {paidDate && (
          <span className="ml-2 text-sm text-muted-foreground">
            on {format(new Date(paidDate), 'MMM d, yyyy')}
          </span>
        )}
      </p>
    </div>
  );
};
