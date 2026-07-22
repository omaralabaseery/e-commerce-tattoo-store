"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { LANGS, getClientLang, setClientLang, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLang(getClientLang());
    setMounted(true);
  }, []);

  function choose(next: Lang) {
    setOpen(false);
    if (next === lang) return;
    setClientLang(next);
    setLang(next);
    // re-render the server components (catalog + <html dir>) with the new language
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1 rounded-full px-2 transition-colors hover:bg-mist"
      >
        <Globe className="h-5 w-5" />
        {mounted && <span className="text-xs font-medium uppercase">{lang}</span>}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-36 rounded-card border border-line bg-paper p-1.5 shadow-lift">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => choose(l.code)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-mist",
                  l.code === lang && "font-medium"
                )}
              >
                {l.label}
                {l.code === lang && <span className="text-xs text-muted">●</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
