"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;
    router.replace(session ? "/dashboard" : "/login");
  }, [sessionLoading, session, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Memuat...</div>
    </div>
  );
}
