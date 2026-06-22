import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../utils/cn";
import { SortOrder } from "../../constants/sort.const";

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
  sortOrder?: SortOrder;
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
  rowClassName,
}: TableProps<T>) {
  const getCellValue = (row: T, key: keyof T | string): string => {
    if (key in row) {
      const value = row[key as keyof T];
      return value !== null && value !== undefined ? String(value) : "";
    }

    return "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-[#0F121D]/50">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-6 py-4",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.className,
                )}
                style={{ width: col.width }}
              >
                <div
                  className={cn(
                    "flex items-center gap-2",
                    col.align === "right" && "justify-end",
                    col.align === "center" && "justify-center",
                    col.sortable && "cursor-pointer hover:text-white",
                  )}
                  onClick={() => col.sortable && onSort?.(String(col.key))}
                >
                  {col.header}

                  {col.sortable &&
                    sortBy === col.key &&
                    (sortOrder === SortOrder.ASC ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-white/40"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "group transition-colors",
                  onRowClick && "cursor-pointer hover:bg-white/[0.02]",
                  selectedRowId === row.id && "bg-white/[0.04]",
                  rowClassName,
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      "px-6 py-4",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                    )}
                  >
                    {col.render
                      ? col.render(
                          col.key in row ? row[col.key as keyof T] : null,
                          row,
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