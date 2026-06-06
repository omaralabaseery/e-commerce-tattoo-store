import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/96500000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-lift transition-transform duration-300 ease-premium hover:scale-110 md:bottom-6"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
