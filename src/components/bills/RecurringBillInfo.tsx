type RecurringBillInfoProps = {
  recurring: boolean | null;
  estimatedAmount: number | null;
};

export const RecurringBillInfo = ({ recurring, estimatedAmount }: RecurringBillInfoProps) => {
  if (!recurring) return null;

  return (
    <div>
      <p className="text-sm text-muted-foreground">Recurring Bill</p>
      <p>Yes</p>
      {estimatedAmount && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">Estimated Amount</p>
          <p>${estimatedAmount.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};