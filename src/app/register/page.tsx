"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";

export default function RegisterPage() {
  const register = useAppStore((s) => s.register);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 500));
    const result = register(form);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || "Could not create account.");
      return;
    }
    toast.success("Account created — add a child to start booking");
    window.location.assign("/portal/children");
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <Card>
          <h1 className="font-display text-4xl text-white">Create parent account</h1>
          <p className="mt-2 text-sm text-white/50">
            Demo registration only. Password is stored locally in your browser.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {(
              [
                ["name", "Full name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["password", "Password", "password"],
              ] as const
            ).map(([key, label, type]) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            {error && (
              <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-white/45">
            Already have access?{" "}
            <Link href="/login" className="text-[var(--accent)]">
              Sign in
            </Link>
          </p>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
