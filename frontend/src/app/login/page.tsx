"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="container-site flex justify-center py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 flex rounded-full border border-line p-1">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded-full py-2.5 text-sm font-medium capitalize transition-colors",
                mode === m ? "bg-ink text-paper" : "text-muted"
              )}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <form className="space-y-4">
          {mode === "register" && (
            <Input label="Full name" type="text" placeholder="Your name" />
          )}
          <Input label="Email" type="email" placeholder="you@example.com" />
          {mode === "register" && <Input label="Phone" type="tel" placeholder="+965 …" />}
          <Input label="Password" type="password" placeholder="••••••••" />

          <button type="button" className="btn-primary w-full">
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {mode === "login" && (
          <Link href="#" className="mt-4 block text-center text-sm text-muted hover:text-ink">
            Forgot your password?
          </Link>
        )}

        <p className="mt-8 text-center text-xs text-muted">
          You can also continue as a guest and check out without an account.
        </p>
      </div>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <input
        {...props}
        className="h-11 rounded-xl border border-line px-3 outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}
