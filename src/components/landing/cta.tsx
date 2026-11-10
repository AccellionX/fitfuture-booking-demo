"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-[var(--accent)]/20 bg-[var(--accent)] px-6 py-12 text-[var(--accent-ink)] sm:px-12 sm:py-16"
        >
          <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl sm:text-6xl">
              Let them experience FFTA for themselves.
            </h2>
            <p className="mt-4 text-base text-black/70 sm:text-lg">
              Open the parent portal, add a child profile, book a class or enrol
              in a 6-week programme — all with simulated checkout.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button className="w-full bg-[#070809] text-white hover:bg-black sm:w-auto">
                  Create parent account
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full border-black/20 text-[var(--accent-ink)] hover:bg-black/5 sm:w-auto"
                >
                  Use demo access
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
