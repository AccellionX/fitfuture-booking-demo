"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProgrammesSection() {
  const packages = useAppStore((s) => s.packages);

  return (
    <section id="programmes" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            The Training
          </p>
          <h2 className="mt-3 font-display text-4xl text-white sm:text-6xl">
            Training with purpose.
          </h2>
          <p className="mt-4 text-base text-white/60 sm:text-lg">
            Every session is part of a structured programme — not random
            workouts. Choose a 6-week track built for long-term development.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {packages.map((pkg, i) => (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--bg-elevated)] p-6 sm:p-8"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-2xl transition group-hover:bg-[var(--accent)]/20" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="accent">{pkg.weeks}-week</Badge>
                  <Badge tone="mute">
                    Ages {pkg.ageMin}–{pkg.ageMax}
                  </Badge>
                  <Badge tone="info">
                    {pkg.sessionsPerWeek}x / week
                  </Badge>
                </div>
                <h3 className="mt-4 font-display text-3xl text-white sm:text-4xl">
                  {pkg.name}
                </h3>
                <p className="mt-3 max-w-lg text-sm text-white/55">{pkg.description}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {pkg.highlights.map((h) => (
                    <li key={h} className="text-sm text-white/75 before:mr-2 before:text-[var(--accent)] before:content-['▸']">
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                      From
                    </p>
                    <p className="font-display text-3xl text-white">
                      {formatCurrency(pkg.price)}
                    </p>
                  </div>
                  <Link href="/portal/programmes">
                    <Button variant="secondary">Enrol</Button>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
