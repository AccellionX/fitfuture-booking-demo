"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import {
  DEMO_ADMIN_EMAIL,
  DEMO_PARENT_EMAIL,
  DEMO_PASSWORD,
  useAppStore,
} from "@/lib/store";

export default function LoginPage() {
  const login = useAppStore((s) => s.login);
  const loginAsDemo = useAppStore((s) => s.loginAsDemo);
  const [email, setEmail] = useState(DEMO_PARENT_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 450));
    const result = login(email, password);
    setLoading(false);
    if (!result.ok || !result.user) {
      setError(result.error || "Unable to sign in.");
      return;
    }
    toast.success(`Welcome back, ${result.user.name.split(" ")[0]}`);
    window.location.assign(result.user.role === "admin" ? "/admin" : "/portal");
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Parent & Admin Access
          </p>
          <h1 className="mt-3 font-display text-5xl text-white sm:text-7xl">
            Sign in to the booking demo.
          </h1>
          <p className="mt-4 max-w-md text-white/55">
            Use one-click demo access or the seeded credentials. No real accounts
            or charges — everything persists in localStorage.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button
              variant="secondary"
              onClick={() => {
                loginAsDemo("parent");
                toast.success("Signed in as demo parent");
                window.location.assign("/portal");
              }}
            >
              Enter as Parent
            </Button>
            <Button
              variant="soft"
              onClick={() => {
                loginAsDemo("admin");
                toast.success("Signed in as demo admin");
                window.location.assign("/admin");
              }}
            >
              Enter as Admin
            </Button>
          </div>
        </div>

        <Card className="w-full max-w-md">
          <h2 className="font-display text-3xl text-white">Sign in</h2>
          <p className="mt-1 text-sm text-white/50">
            Parent: {DEMO_PARENT_EMAIL} · Admin: {DEMO_ADMIN_EMAIL}
            <br />
            Password: {DEMO_PASSWORD}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-white/45">
            New here?{" "}
            <Link href="/register" className="text-[var(--accent)]">
              Create a parent account
            </Link>
          </p>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
