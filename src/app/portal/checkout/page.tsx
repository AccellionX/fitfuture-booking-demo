"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { CheckoutForm } from "@/components/shared/checkout-form";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loading";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { LocationId } from "@/lib/types";

function CheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const classId = params.get("classId");
  const childId = params.get("childId");
  const packageId = params.get("packageId");
  const locationId = params.get("locationId") as LocationId | null;
  const renewId = params.get("renewId");

  const createBooking = useAppStore((s) => s.createBooking);
  const enrolProgramme = useAppStore((s) => s.enrolProgramme);
  const renewEnrolment = useAppStore((s) => s.renewEnrolment);
  const session = useAppStore((s) => s.classes.find((c) => c.id === classId));
  const child = useAppStore((s) => s.children.find((c) => c.id === childId));
  const pkg = useAppStore((s) => s.packages.find((p) => p.id === packageId));
  const enrolment = useAppStore((s) => s.enrolments.find((e) => e.id === renewId));
  const renewPkg = useAppStore((s) =>
    s.packages.find((p) => p.id === enrolment?.packageId)
  );

  const [success, setSuccess] = useState<{
    title: string;
    message: string;
    href: string;
  } | null>(null);

  if (success) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-[var(--success)]" />
        <h1 className="mt-4 font-display text-4xl text-white">{success.title}</h1>
        <p className="mt-2 text-sm text-white/55">{success.message}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href={success.href}>
            <Button>Continue</Button>
          </Link>
          <Link href="/portal">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (renewId && enrolment && renewPkg) {
    return (
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">Renewal</p>
          <CardTitle className="mt-2">{renewPkg.name}</CardTitle>
          <p className="mt-2 text-sm text-white/55">
            Extend this 6-week programme for another cycle. Simulated payment only.
          </p>
          <p className="mt-4 font-display text-4xl text-white">
            {formatCurrency(renewPkg.price)}
          </p>
        </Card>
        <CheckoutForm
          amount={renewPkg.price}
          description={`Renew ${renewPkg.name}`}
          onPay={async () => {
            const result = renewEnrolment(renewId);
            if (!result.ok) throw new Error(result.error);
            toast.success("Programme renewed");
            setSuccess({
              title: "Renewed",
              message: `${renewPkg.name} is active for another ${renewPkg.weeks} weeks.`,
              href: "/portal/programmes",
            });
          }}
        />
      </div>
    );
  }

  if (packageId && pkg && child && locationId) {
    return (
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
            Programme enrolment
          </p>
          <CardTitle className="mt-2">{pkg.name}</CardTitle>
          <p className="mt-2 text-sm text-white/55">
            {child.firstName} · {locationId.replace("-", " ")} · {pkg.weeks} weeks ·{" "}
            {pkg.sessionsPerWeek}x weekly
          </p>
          <p className="mt-4 font-display text-4xl text-white">{formatCurrency(pkg.price)}</p>
        </Card>
        <CheckoutForm
          amount={pkg.price}
          description={`${pkg.name} — ${child.firstName}`}
          onPay={async (last4) => {
            const result = enrolProgramme({
              packageId,
              childId: child.id,
              locationId,
              cardLast4: last4,
            });
            if (!result.ok) throw new Error(result.error);
            toast.success("Enrolled successfully");
            setSuccess({
              title: "You're in",
              message: `${child.firstName} is enrolled in ${pkg.name}.`,
              href: "/portal/programmes",
            });
          }}
        />
      </div>
    );
  }

  if (classId && session && child) {
    return (
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
            Session checkout
          </p>
          <CardTitle className="mt-2">{session.title}</CardTitle>
          <p className="mt-2 text-sm text-white/55">
            {child.firstName} · {formatDate(session.date)} · {formatTime(session.startTime)}
          </p>
          <p className="mt-4 font-display text-4xl text-white">
            {formatCurrency(session.price)}
          </p>
          <Button
            variant="ghost"
            className="mt-4 px-0"
            onClick={() => router.push(`/portal/book/${session.id}`)}
          >
            ← Change child
          </Button>
        </Card>
        <CheckoutForm
          amount={session.price}
          description={`${session.title} — ${child.firstName}`}
          onPay={async (last4) => {
            const result = createBooking({
              classId: session.id,
              childId: child.id,
              cardLast4: last4,
            });
            if (!result.ok) throw new Error(result.error);
            toast.success("Booking confirmed");
            setSuccess({
              title: "Booked",
              message: `Confirmation sent for ${child.firstName}'s session on ${formatDate(session.date)}.`,
              href: "/portal/history",
            });
          }}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardTitle>Checkout unavailable</CardTitle>
      <p className="mt-2 text-sm text-white/50">Missing booking details. Start from classes or programmes.</p>
      <div className="mt-4 flex gap-2">
        <Link href="/portal/classes">
          <Button>Classes</Button>
        </Link>
        <Link href="/portal/programmes">
          <Button variant="outline">Programmes</Button>
        </Link>
      </div>
    </Card>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading checkout…" />}>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Secure demo payment
          </p>
          <h1 className="font-display text-4xl text-white">Checkout</h1>
        </div>
        <CheckoutInner />
      </div>
    </Suspense>
  );
}
