"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useVehicleStore } from "@/lib/store/use-vehicle-store";

export default function Home() {
  const { data: session, isPending: sessionLoading } = useSession();
  const { _hydrated, isDemo } = useVehicleStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hydrated || sessionLoading) return;
    router.replace(session || isDemo ? "/dashboard" : "/login");
  }, [_hydrated, sessionLoading, session, isDemo, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Memuat...</div>
    </div>
  );
}
