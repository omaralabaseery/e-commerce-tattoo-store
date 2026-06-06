export const metadata = { title: "Profile Settings" };

export default function SettingsPage() {
  return (
    <div className="container-site max-w-xl py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Profile Settings</h1>
      <form className="mt-8 space-y-4">
        {[
          { label: "Full name", value: "Sample Customer" },
          { label: "Email", value: "customer@example.com" },
          { label: "Phone", value: "+965 9911 1111" },
        ].map((f) => (
          <label key={f.label} className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">{f.label}</span>
            <input
              defaultValue={f.value}
              className="h-11 rounded-xl border border-line px-3 outline-none transition-colors focus:border-ink"
            />
          </label>
        ))}
        <button type="button" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
