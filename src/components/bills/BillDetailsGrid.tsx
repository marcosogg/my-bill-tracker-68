import { format } from "date-fns";
import { BillStatusDisplay } from "./BillStatusDisplay";

type Bill = {
  due_date: string;
  amount: number;
  category: string;
  payment_method: string;
  location_person: string;
};

type Props = {
  bill: Bill;
};

export const BillDetailsGrid = ({ bill }: Props) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Due Date</p>
          <p className="text-lg">
            {format(new Date(bill.due_date), "MMMM d, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-lg">${bill.amount.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Category</p>
          <p>{bill.category}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Payment Method</p>
          <p>{bill.payment_method}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Location/Person</p>
          <p>{bill.location_person}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <BillStatusDisplay dueDate={bill.due_date} />
        </div>
      </div>
    </>
  );
};