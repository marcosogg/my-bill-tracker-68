import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DeleteBillDialog } from "./DeleteBillDialog";

type BillActionsProps = {
  billId: string;
  onDelete: () => void;
};

export const BillActions = ({ billId, onDelete }: BillActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/bills/${billId}/edit`);
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <div onClick={(e) => e.stopPropagation()}>
        <DeleteBillDialog onDelete={onDelete} />
      </div>
    </div>
  );
};