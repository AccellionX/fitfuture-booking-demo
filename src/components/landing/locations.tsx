"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useAppStore } from "@/lib/store";

const images: Record<string, string> = {
  "sports-city":
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  "al-safa":
    "https://images.unsplash.com/photo-1571902943202-507c97bf2412?auto=format&fit=crop&w=1200&q=80",
  "al-quoz":
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
};

export function LocationsSection() {
  const locations = useAppStore((s) => s.locations);

  return (
    <section id="locations" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Across Dubai
          </p>
          <h2 className="mt-3 font-display text-4xl text-white sm:text-6xl">
            Train with FFTA across Dubai.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {locations.map((loc, i) => (
            <motion.article
              key={loc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[var(--bg-elevated)]"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={images[loc.id]}
                  alt={loc.name}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101214] to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-3xl text-white">{loc.name}</h3>
                <p className="mt-2 flex items-start gap-2 text-sm text-white/55">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <span>
                    {loc.address}
                    <br />
                    <span className="text-white/40">{loc.mapHint}</span>
                  </span>
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
