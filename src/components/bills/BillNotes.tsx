type Props = {
  notes: string;
};

export const BillNotes = ({ notes }: Props) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground">Notes</p>
      <p className="whitespace-pre-wrap">{notes}</p>
    </div>
  );
};