import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-black/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="font-display text-3xl text-white">FFTA</div>
          <p className="mt-3 max-w-sm text-sm text-white/50">
            Fit Future Training Academy booking concept for Dubai — Sports City,
            Al Safa / Jumeirah & Al Quoz.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
            Explore
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/65">
            <Link href="/#programmes">Programmes</Link>
            <Link href="/portal/classes">Browse classes</Link>
            <Link href="/login">Parent / Admin demo</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
            Disclaimer
          </p>
          <p className="mt-3 text-sm text-white/50">
            This is an independent founder presentation demo inspired by FFTA.
            It is not affiliated with or endorsed by Fit Future Training Academy.
            Inspired by{" "}
            <a
              href="https://www.fitfutureacademy.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline underline-offset-2"
            >
              fitfutureacademy.com
            </a>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-white/6 py-4 text-center text-xs text-white/35">
        © {new Date().getFullYear()} FFTA Booking Demo · Simulated payments only
      </div>
    </footer>
  );
}
