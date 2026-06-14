"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen max-h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] bg-background">
      {/* ==================== DESKTOP LEFT PANEL: BRANDING ==================== */}
      <div className="hidden lg:flex relative flex-col justify-between bg-zinc-950 p-10 text-white overflow-hidden select-none">
        {/* Background Gradients and Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Image
            src="/logo-dark.svg"
            alt="OtoNotif Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>

        {/* Heading */}
        <div className="relative z-10 space-y-2 max-w-sm mt-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            Pantau Kesehatan Kendaraan Anda.
          </h1>
          <p className="text-zinc-400 text-sm">
            Asisten digital personal untuk melacak odometer, konsumsi BBM,
            servis berkala, dan pajak kendaraan.
          </p>
        </div>

        {/* Smartphone Mockup — immersive hero, absolutely positioned to avoid pushing siblings */}
        <div className="relative z-10 flex-1">
          <Image
            src="/mockup.png"
            alt="OtoNotif App Showcase"
            width={1280}
            height={1840}
            className="absolute left-1/2 top-0 -translate-x-1/2 w-auto h-[100vh] object-contain select-none pointer-events-none drop-shadow-2xl"
            priority
          />
        </div>

        {/* Bottom footer note */}
        <div className="relative z-10 text-[10px] text-zinc-500">
          &copy; {new Date().getFullYear()} OtoNotif.
        </div>
      </div>

      {/* ==================== RIGHT PANEL: MAIN FORM CONTENT (Responsive) ==================== */}
      <div className="col-span-1 flex flex-col h-screen relative p-6 sm:p-12 bg-background text-foreground justify-center overflow-y-auto">
        {/* Mobile Header Logo (Visible only on mobile) */}
        <div className="lg:hidden flex items-center justify-between mb-6 w-full shrink-0">
          <div>
            <Image
              src="/logo-dark.svg"
              alt="OtoNotif Logo"
              width={96}
              height={32}
              className="h-8 w-auto dark:block hidden"
              priority
            />
            <Image
              src="/logo-light.svg"
              alt="OtoNotif Logo"
              width={96}
              height={32}
              className="h-8 w-auto dark:hidden block"
              priority
            />
          </div>
          <ThemeToggle />
        </div>

        {/* Theme Toggle - Desktop (Top Right) */}
        <div className="hidden lg:block absolute top-8 right-8 z-20">
          <ThemeToggle />
        </div>

        {/* Centered Children Form */}
        <div className="w-full max-w-sm mx-auto my-auto py-4">
          {/* Card wrapper: visible on mobile, transparent on desktop for cleaner look */}
          <div className="bg-card border border-border/60 dark:border-border/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden lg:bg-transparent lg:border-0 lg:shadow-none lg:p-0 lg:rounded-none lg:overflow-visible">
            {/* Background Glow — mobile only */}
            <div className="lg:hidden absolute -top-20 -right-20 w-40 h-40 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="lg:hidden absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
