import { format } from "date-fns";

type Props = {
  dueDate: string;
};

export const BillStatusDisplay = ({ dueDate }: Props) => {
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

  const status = getPaidStatus(dueDate);

  return <span className={getStatusColor(status)}>{status}</span>;
};