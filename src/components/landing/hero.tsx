"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2400&q=80"
          alt="Youth strength training atmosphere"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070809] via-[#070809]/72 to-[#070809]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070809] via-[#070809]/20 to-[#070809]/35" />
        <div className="absolute inset-0 grid-noise opacity-25" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            <MapPin className="h-3.5 w-3.5" />
            Dubai · Sports City · Al Safa · Al Quoz
          </p>
          <h1 className="font-display text-[clamp(3.4rem,12vw,7.5rem)] leading-[0.88] text-white">
            Fit Future
            <br />
            <span className="text-[var(--accent)]">Training Academy</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70 sm:text-xl">
            Structured strength training for ages 8–18 — book sessions, enrol in
            6-week programmes, and track progress in one premium parent portal.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/register">
              <Button size="lg" className="cta-glow w-full sm:w-auto">
                Start booking
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Try parent demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
