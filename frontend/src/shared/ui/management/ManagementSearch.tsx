import { Search } from "lucide-react";
import Input from "../Input";

interface ManagementSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ManagementSearch({
  value,
  onChange,
  placeholder,
}: ManagementSearchProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search..."}
        className="pl-10"
      />
    </div>
  );
}