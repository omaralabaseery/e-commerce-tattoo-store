import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-mist text-ink",
  CONFIRMED: "bg-ink/10 text-ink",
  PROCESSING: "bg-ink/10 text-ink",
  OUT_FOR_DELIVERY: "bg-ink text-paper",
  DELIVERED: "bg-ink text-paper",
  CANCELLED: "bg-mist text-muted line-through",
  RETURNED: "bg-mist text-muted",
  PAID: "bg-ink text-paper",
  FAILED: "bg-mist text-muted line-through",
  REFUNDED: "bg-mist text-muted",
  ACTIVE: "bg-ink/10 text-ink",
  INACTIVE: "bg-mist text-muted",
};

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
