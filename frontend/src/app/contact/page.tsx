import { PageShell } from "@/components/content/PageShell";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
export const metadata = { title: "Contact Us" };

export default function Page() {
  return (
    <PageShell title="Contact Us" intro="We're here to help — reach out any time.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-line p-4 text-ink">
          <Mail className="h-5 w-5" /> support@tattoostore.com
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-line p-4 text-ink">
          <Phone className="h-5 w-5" /> +965 0000 0000
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-line p-4 text-ink">
          <MessageCircle className="h-5 w-5" /> WhatsApp support
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-line p-4 text-ink">
          <MapPin className="h-5 w-5" /> Kuwait City, Kuwait
        </div>
      </div>
      <form className="mt-6 space-y-4">
        <input placeholder="Your name" className="h-11 w-full rounded-xl border border-line px-3 outline-none focus:border-ink" />
        <input placeholder="Email" className="h-11 w-full rounded-xl border border-line px-3 outline-none focus:border-ink" />
        <textarea placeholder="Message" rows={4} className="w-full rounded-xl border border-line p-3 outline-none focus:border-ink" />
        <button type="button" className="btn-primary">Send Message</button>
      </form>
    </PageShell>
  );
}
