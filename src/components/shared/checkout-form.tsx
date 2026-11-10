"use client";

import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm({
  amount,
  description,
  onPay,
}: {
  amount: number;
  description: string;
  onPay: (last4: string) => Promise<void> | void;
}) {
  const [name, setName] = useState("Aisha Rahman");
  const [number, setNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const digits = number.replace(/\s/g, "");
    if (digits.length < 12) {
      setError("Enter a valid demo card number.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    try {
      await onPay(digits.slice(-4));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-[#0f1216] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/40">Demo checkout</p>
          <p className="font-display text-3xl text-white">{formatCurrency(amount)}</p>
          <p className="text-sm text-white/50">{description}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-3 text-[var(--accent)]">
          <CreditCard className="h-6 w-6" />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-2 text-xs text-[var(--accent)]">
        Stripe-style simulation — use any card. No real charges.
      </div>

      <div>
        <Label htmlFor="card-name">Name on card</Label>
        <Input id="card-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="card-number">Card number</Label>
        <Input
          id="card-number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="expiry">Expiry</Label>
          <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="cvc">CVC</Label>
          <Input id="cvc" value={cvc} onChange={(e) => setCvc(e.target.value)} required />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        <Lock className="h-4 w-4" />
        {loading ? "Processing…" : `Pay ${formatCurrency(amount)}`}
      </Button>
    </form>
  );
}
