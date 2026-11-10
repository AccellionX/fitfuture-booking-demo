"use client";

import { motion } from "framer-motion";
import { Brain, ChartLine, HandHeart, Target } from "lucide-react";

const items = [
  {
    icon: HandHeart,
    title: "Expert coaching",
    copy: "Hands-on coaching focused on safety, technique and individual development.",
  },
  {
    icon: Target,
    title: "Structured training",
    copy: "Purposeful programmes designed to progress with each student.",
  },
  {
    icon: ChartLine,
    title: "Individual progress",
    copy: "Students track training and compete against themselves — not each other.",
  },
  {
    icon: Brain,
    title: "Education for life",
    copy: "Training, nutrition, recovery, mindset and healthy lifestyle education.",
  },
];

export function BenefitsSection() {
  return (
    <section id="why" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Why parents choose FFTA
            </p>
            <h2 className="mt-3 font-display text-4xl text-white sm:text-6xl">
              Building strong bodies.
              <span className="block text-white/45">Building stronger futures.</span>
            </h2>
          </div>
          <p className="text-base text-white/60 sm:text-lg">
            Our goal isn’t simply to tire children out for an hour. We teach young
            people how to move — and move well — with confidence, resilience and
            lasting habits.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-3xl border border-white/8 bg-white/[0.03] p-6"
            >
              <item.icon className="h-7 w-7 text-[var(--accent)]" />
              <h3 className="mt-5 font-display text-2xl text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/55">{item.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
