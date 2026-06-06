import { statusStyles } from "@/data/adminMock";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
        statusStyles[status] ?? "bg-mist text-ink"
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
