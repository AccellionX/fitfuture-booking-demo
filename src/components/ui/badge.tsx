import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "accent" | "info" | "warn" | "success" | "danger" | "mute";
}) {
  const tones = {
    default: "bg-white/8 text-white/80 border-white/10",
    accent: "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/25",
    info: "bg-[rgba(90,209,232,0.12)] text-[var(--info)] border-[var(--info)]/25",
    warn: "bg-[rgba(255,138,76,0.12)] text-[var(--warn)] border-[var(--warn)]/25",
    success: "bg-[rgba(109,255,154,0.12)] text-[var(--success)] border-[var(--success)]/25",
    danger: "bg-[rgba(255,93,108,0.12)] text-[var(--danger)] border-[var(--danger)]/25",
    mute: "bg-white/5 text-white/50 border-white/8",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
