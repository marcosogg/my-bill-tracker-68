import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CATEGORIES = [
  "All",
  "Electricity",
  "Water",
  "Internet",
  "Rent",
  "Gas",
  "Credit Card",
  "Other",
];

export const LOCATIONS = [
  "All",
  "Marcos - Ireland",
  "Marcos - Brazil",
  "Marilia - Brazil",
];

export const PAID_STATUS = ["All", "Paid", "Unpaid", "Overdue"];

type BillsFilterProps = {
  location: string;
  category: string;
  paidStatus: string;
  onLocationChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPaidStatusChange: (value: string) => void;
};

export const BillsFilter = ({
  location,
  category,
  paidStatus,
  onLocationChange,
  onCategoryChange,
  onPaidStatusChange,
}: BillsFilterProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Select value={location} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {LOCATIONS.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={paidStatus} onValueChange={onPaidStatusChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {PAID_STATUS.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};