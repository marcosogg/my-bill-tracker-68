type Bill = {
  recurring: boolean | null;
  estimated_amount: number | null;
};

type Props = {
  bill: Bill;
};

export const BillRecurringInfo = ({ bill }: Props) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground">Recurring Bill</p>
      <p>{bill.recurring ? "Yes" : "No"}</p>
      {bill.recurring && bill.estimated_amount && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">Estimated Amount</p>
          <p>${bill.estimated_amount.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};