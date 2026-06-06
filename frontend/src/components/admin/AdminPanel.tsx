import { Construction } from "lucide-react";

/** Lightweight panel for admin sections scaffolded but not yet fully built out. */
export function AdminPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted">{description}</p>
      </div>
      {children ?? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line bg-paper py-24 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist">
            <Construction className="h-5 w-5 text-muted" />
          </div>
          <p className="text-sm font-medium">Scaffolded module</p>
          <p className="max-w-sm text-sm text-muted">
            UI shell and API endpoints exist — wire this view to the backend endpoints documented in
            <code className="mx-1 rounded bg-mist px-1.5 py-0.5">docs/API.md</code>.
          </p>
        </div>
      )}
    </div>
  );
}
