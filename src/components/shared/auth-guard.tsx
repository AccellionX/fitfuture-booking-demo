"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import type { UserRole } from "@/lib/types";
import { PageLoader } from "@/components/ui/loading";
import { useCurrentUser } from "@/hooks/use-demo";

export function AuthGuard({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useAppStore((s) => s.hydrated);
  const user = useCurrentUser();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace(user.role === "admin" ? "/admin" : "/portal");
    }
  }, [hydrated, user, role, router]);

  if (!hydrated || !user || user.role !== role) {
    return <PageLoader label="Checking demo access…" />;
  }

  return <>{children}</>;
}
