import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: T[keyof T] | null | undefined, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  rowClassName?: string;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  selectedRowId,
  sortBy,
  sortOrder,
  onSort,
  rowClassName
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (onSort) onSort(key);
  };

  const getCellValue = (row: T, key: keyof T | string): string => {
    if (key in row) {
      const value = row[key as keyof T];
      return value !== null && value !== undefined ? String(value) : "";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-[#0F121D]/50 border border-white/5">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-6 py-4",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.className
                )}
                style={{ width: col.width }}
              >
                <div
                  className={cn(
                    "flex items-center gap-2",
                    col.sortable && "cursor-pointer hover:text-white"
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  {col.header}
                  {col.sortable && sortBy === col.key && (
                    sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-white/40">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "group cursor-pointer transition-colors hover:bg-white/[0.02]",
                  selectedRowId === row.id && "bg-white/[0.04]",
                  rowClassName
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      "px-6 py-4",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right"
                    )}
                  >
                    {col.render
                      ? col.render(
                          col.key in row 
                            ? row[col.key as keyof T] 
                            : null, 
                          row
                        )
                      : getCellValue(row, col.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}