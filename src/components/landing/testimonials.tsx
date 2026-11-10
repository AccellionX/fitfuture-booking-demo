"use client";

import { motion } from "framer-motion";

const quotes = [
  {
    name: "Nadia K.",
    role: "Parent · Sports City",
    quote:
      "Booking used to mean WhatsApp threads and forgotten renewals. This portal makes sessions, progress and payments feel effortless.",
  },
  {
    name: "Ravi & Meera",
    role: "Parents · Al Safa",
    quote:
      "Our son tracks his own lifts now. The 6-week programme structure finally matches how FFTA actually coaches.",
  },
  {
    name: "Helen M.",
    role: "Parent · Al Quoz",
    quote:
      "I can see attendance, upcoming sessions and renewal reminders in one place. Admin load for the academy would drop overnight.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Loved by FFTA families
        </p>
        <h2 className="mt-3 font-display text-4xl text-white sm:text-6xl">
          Designed for parents. Built for coaches.
        </h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.blockquote
              key={q.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(184,255,60,0.08),transparent_40%),#101214] p-7"
            >
              <p className="text-base leading-relaxed text-white/80">“{q.quote}”</p>
              <footer className="mt-6">
                <p className="font-semibold text-white">{q.name}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-white/40">
                  {q.role}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
