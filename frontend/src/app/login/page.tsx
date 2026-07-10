"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { apiEnabled } from "@/lib/api";
import { useAuth, isAdminRole } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuth((s) => s.login);
  const register = useAuth((s) => s.register);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!apiEnabled) {
      setError("The store API is not configured yet. Please try again later.");
      return;
    }

    setLoading(true);
    try {
      const user =
        mode === "login"
          ? await login(email, password)
          : await register({ name, email, phone: phone || undefined, password });

      // only same-site relative paths — never external URLs from the query string
      const redirect = searchParams.get("redirect");
      const safeRedirect =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : null;
      if (safeRedirect) router.push(safeRedirect);
      else if (isAdminRole(user.role)) router.push("/admin");
      else router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-site flex justify-center py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 flex rounded-full border border-line p-1">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={cn(
                "flex-1 rounded-full py-2.5 text-sm font-medium capitalize transition-colors",
                mode === m ? "bg-ink text-paper" : "text-muted"
              )}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <Input
              label="Full name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {mode === "register" && (
            <Input
              label="Phone"
              type="tel"
              placeholder="+965 …"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          )}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          {error && (
            <p className="rounded-xl border border-line bg-mist px-3 py-2.5 text-sm text-ink">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
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
