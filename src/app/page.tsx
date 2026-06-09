"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconActivity,
  IconCar,
  IconDroplet,
  IconGauge,
  IconChevronRight,
  IconMotorbike,
  IconReceipt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useVehicleStore } from "@/lib/store/use-vehicle-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function Home() {
  const {
    vehicles,
    vehicleHealth,
    fetchVehicles,
    fetchVehicleHealth,
    setPrimaryVehicle,
    loading,
    userName,
  } = useVehicleStore();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const primaryVehicle = vehicles.find((v) => v.isPrimary) || vehicles[0];
  const isFetched = vehicles.length > 0;

  useEffect(() => {
    if (primaryVehicle) {
      fetchVehicleHealth(primaryVehicle.id);
    }
  }, [primaryVehicle, fetchVehicleHealth]);

  if (loading && !isFetched) {
    return (
      <div className="space-y-6 pb-20 md:pb-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (!isFetched) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeUp}
        className="space-y-6 pb-20 md:pb-6"
      >
        <Card className="p-12 text-center">
          <IconCar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-bold mb-2">Belum Ada Kendaraan</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tambahkan kendaraan pertama Anda untuk mulai memantau.
          </p>
          <Button asChild>
            <Link href="/vehicles">Tambah Kendaraan</Link>
          </Button>
        </Card>
      </motion.div>
    );
  }

  const fuel = vehicleHealth?.fuel || null;

  const components = vehicleHealth?.components || [];

  const formatCompactCurrency = (value: number) => {
    if (value >= 1_000_000) {
      const formatted = (value / 1_000_000).toFixed(1).replace(".", ",");
      return `Rp ${formatted.endsWith(",0") ? formatted.slice(0, -2) : formatted} jt`;
    }
    if (value >= 1_000) {
      return `Rp ${(value / 1_000).toLocaleString("id-ID")} rb`;
    }
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  const dangerComponents = components.filter((c) => c.status === "danger");
  const warningComponents = components.filter((c) => c.status === "warning");

  let healthSummary = "Semua komponen aman";
  let healthStatus: "safe" | "warning" | "danger" = "safe";

  if (dangerComponents.length > 0) {
    healthSummary = `${dangerComponents.length} Kritis`;
    healthStatus = "danger";
  } else if (warningComponents.length > 0) {
    healthSummary = `${warningComponents.length} Peringatan`;
    healthStatus = "warning";
  }

  const sortedComponents = [...components].sort((a, b) => {
    const order = { danger: 0, warning: 1, safe: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-4 md:space-y-6 pb-20 md:pb-6"
    >
      {/* Desktop Greeting & Status */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beranda</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            Halo, {userName}! Cek kondisi kendaraan utamamu.
            <span
              className={cn(
                "text-xs px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1",
                healthStatus === "danger"
                  ? "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse"
                  : healthStatus === "warning"
                    ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    : "bg-green-500/10 text-green-500 border border-green-500/20",
              )}
            >
              {healthStatus === "danger"
                ? `${dangerComponents.length} komponen butuh penggantian segera!`
                : healthStatus === "warning"
                  ? `${warningComponents.length} komponen mendekati batas pemakaian`
                  : "Semua komponen dalam kondisi aman"}
            </span>
          </p>
        </div>
      </div>

      {/* Mobile Greeting & Status (Compact 1-line layout) */}
      <div className="md:hidden flex items-center justify-between border-b pb-2 border-border/50">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-extrabold text-foreground">
            Halo, {userName}
          </span>
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              healthStatus === "danger"
                ? "bg-red-500 animate-pulse"
                : healthStatus === "warning"
                  ? "bg-orange-500"
                  : "bg-green-500",
            )}
          />
        </div>
        <span
          className={cn(
            "text-[9px] px-2 py-0.5 rounded-full font-extrabold border",
            healthStatus === "danger"
              ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse"
              : healthStatus === "warning"
                ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                : "bg-green-500/10 text-green-500 border-green-500/20",
          )}
        >
          {healthSummary}
        </span>
      </div>

      {/* Top Active Vehicle Selector Card */}
      <Card className="relative overflow-hidden border-none bg-linear-to-br from-primary/5 via-background to-background shadow-md ring-1 ring-primary/10">
        <CardContent className="p-3.5 md:p-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 relative z-10">
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold tracking-tight truncate">
                {primaryVehicle.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground font-medium truncate">
                  Utama • Aktif
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0 relative z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 md:h-8 px-2 md:px-3 text-[10px] md:text-xs font-bold rounded-full"
                >
                  Ganti
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {vehicles.map((v) => (
                  <DropdownMenuItem
                    key={v.id}
                    onClick={async () => {
                      try {
                        await setPrimaryVehicle(v.id);
                        toast.success(`Kendaraan utama diganti ke ${v.name}`);
                      } catch {
                        toast.error("Gagal mengganti kendaraan utama");
                      }
                    }}
                    disabled={v.id === primaryVehicle.id}
                  >
                    {v.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href={`/vehicles/${primaryVehicle.id}`}>
              <Button
                variant="secondary"
                size="sm"
                className="h-7 md:h-8 px-2 md:px-3 text-[10px] md:text-xs font-bold rounded-full gap-1"
              >
                Detail <IconChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardContent>

        {/* Ambient Vehicle Photo Background */}
        {primaryVehicle.image ? (
          <div className="absolute right-0 top-0 bottom-0 w-2/3 z-0 pointer-events-none select-none overflow-hidden">
            <Image
              src={primaryVehicle.image}
              alt=""
              fill
              className="object-cover object-right opacity-12 dark:opacity-18 grayscale contrast-125 transition-all duration-500"
            />
            {/* Gradient mask to blend image into the card background */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          </div>
        ) : (
          <div className="absolute right-4 bottom-[-20%] text-primary/5 dark:text-primary/10 pointer-events-none select-none z-0">
            {primaryVehicle.type === "motor" ? (
              <IconMotorbike className="h-28 w-28" />
            ) : (
              <IconCar className="h-28 w-28" />
            )}
          </div>
        )}
      </Card>

      {/* 3-Column Metrics Grid (Now 3 columns on both Mobile & Desktop) */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* Odometer */}
        <Card className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 dark:border-amber-500/20 overflow-hidden relative group shadow-sm">
          <CardHeader className="p-2 md:p-4 pb-1 md:pb-2">
            <div className="flex items-center gap-1 md:gap-2 text-amber-700 dark:text-amber-400">
              <IconGauge className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] truncate">
                Odometer
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-2 md:p-4 pt-0">
            <div className="text-[13px] sm:text-sm md:text-2xl font-extrabold tracking-tight text-amber-950 dark:text-amber-200 truncate">
              {vehicleHealth?.latestOdo
                ? `${vehicleHealth.latestOdo.toLocaleString()} km`
                : "—"}
            </div>
            <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-amber-800/70 dark:text-amber-400/70 font-semibold mt-0.5 md:mt-1.5">
              <span className="font-extrabold">
                +
                {vehicleHealth?.weeklyOdoDelta
                  ? vehicleHealth.weeklyOdoDelta.toLocaleString("id-ID")
                  : "0"}
              </span>{" "}
              km
            </div>
          </CardContent>
        </Card>

        {/* Fuel Level */}
        <Card className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 dark:border-blue-500/20 overflow-hidden relative group shadow-sm">
          <CardHeader className="p-2 md:p-4 pb-1 md:pb-2">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 md:gap-2 text-blue-700 dark:text-blue-400 min-w-0">
                <IconDroplet className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] truncate">
                  BBM
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] font-bold text-blue-800/70 dark:text-blue-400/70 font-mono hidden md:inline">
                {fuel?.avg ? `${fuel.avg}` : "—"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-2 md:p-4 pt-0 space-y-1 md:space-y-2">
            <div className="text-[13px] sm:text-sm md:text-2xl font-extrabold tracking-tight text-blue-950 dark:text-blue-200 truncate">
              {fuel ? `${fuel.current}L` : "—"}{" "}
              <span className="text-[9px] md:text-xs font-medium text-blue-700/60 dark:text-blue-300/60 tracking-normal">
                /{fuel?.max}L
              </span>
            </div>
            {fuel && (
              <div className="relative h-1 md:h-2 w-full bg-blue-500/20 dark:bg-blue-500/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fuel.percent}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-600 to-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Cost */}
        <Card className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 dark:border-emerald-500/20 overflow-hidden relative group shadow-sm">
          <CardHeader className="p-2 md:p-4 pb-1 md:pb-2">
            <div className="flex items-center gap-1 md:gap-2 text-emerald-700 dark:text-emerald-400">
              <IconActivity className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] truncate">
                Pengeluaran
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-2 md:p-4 pt-0">
            <div className="text-[13px] sm:text-sm md:text-2xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-200 truncate">
              {vehicleHealth?.monthlyCost !== undefined
                ? formatCompactCurrency(vehicleHealth.monthlyCost)
                : "Rp 0"}
            </div>
            <p className="text-[9px] md:text-[10px] text-emerald-700/80 dark:text-emerald-400/80 font-bold uppercase mt-0.5 md:mt-1.5">
              Bulan Ini
            </p>
            {vehicleHealth && (vehicleHealth.monthlyCost ?? 0) > 0 && (vehicleHealth.latestOdo ?? 0) > 0 && (
              <p className="text-[8px] md:text-[9px] text-emerald-600/60 dark:text-emerald-300/60 font-medium mt-0.5">
                Rp {Math.round((vehicleHealth.monthlyCost ?? 0) / Math.max(1, vehicleHealth.latestOdo ?? 1)).toLocaleString("id-ID")}/km
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tax Status Card */}
      <Card className="relative overflow-hidden border-none bg-card/50 shadow-sm">
        <CardContent className="p-3 md:p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "p-2 rounded-full shrink-0",
              vehicleHealth?.taxStatus?.status === "danger"
                ? "bg-red-500/10"
                : vehicleHealth?.taxStatus?.status === "warning"
                  ? "bg-orange-500/10"
                  : "bg-green-500/10",
            )}>
              <IconReceipt className={cn(
                "h-4 w-4 md:h-5 md:w-5",
                vehicleHealth?.taxStatus?.status === "danger"
                  ? "text-red-500"
                  : vehicleHealth?.taxStatus?.status === "warning"
                    ? "text-orange-500"
                    : "text-green-500",
              )} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Pajak Kendaraan
              </p>
              <p className="text-xs md:text-sm font-extrabold truncate mt-0.5">
                {vehicleHealth?.taxStatus?.status === "none" || !vehicleHealth?.taxStatus?.dueDate
                  ? "Belum diatur"
                  : vehicleHealth.taxStatus.status === "danger"
                    ? `Overdue ${Math.abs(vehicleHealth.taxStatus.daysRemaining ?? 0)} hari`
                    : vehicleHealth.taxStatus.status === "warning"
                      ? `Jatuh tempo H-${vehicleHealth.taxStatus.daysRemaining}`
                      : `Lunas — ${vehicleHealth.taxStatus.dueDate}`}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className={cn(
              "text-[10px] md:text-xs font-extrabold",
              vehicleHealth?.taxStatus?.status === "danger"
                ? "text-red-500"
                : vehicleHealth?.taxStatus?.status === "warning"
                  ? "text-orange-500"
                  : "text-green-500",
            )}>
              {vehicleHealth?.taxStatus?.status === "none" || !vehicleHealth?.taxStatus?.dueDate
                ? "—"
                : vehicleHealth.taxStatus.status === "danger"
                  ? "SEGERA BAYAR"
                  : vehicleHealth.taxStatus.status === "warning"
                    ? "SEGERA"
                    : "AMAN"}
            </p>
            {vehicleHealth?.taxStatus != null && vehicleHealth.taxStatus.amount > 0 && (
              <p className="text-[9px] md:text-[10px] text-muted-foreground font-medium mt-0.5">
                {formatCompactCurrency(vehicleHealth.taxStatus.amount)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Layout: Component Monitoring & Recent Activity (Side-by-side on Widescreen) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Component Monitoring (Sorted dynamically by health status) */}
        <Card className="border-none bg-card/50 shadow-md lg:col-span-2">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-sm md:text-base font-bold tracking-tight flex items-center gap-2">
              <IconActivity className="h-4 w-4 text-primary" /> Pemantauan
              Komponen
            </CardTitle>
            <CardDescription className="text-[10px] md:text-xs">
              Kondisi komponen kendaraan berdasarkan jarak tempuh saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              {sortedComponents.length === 0 && (
                <div className="col-span-2 p-8 text-center text-sm text-muted-foreground">
                  Belum ada komponen yang dipantau.
                </div>
              )}
              {sortedComponents.map(
                ({
                  component,
                  currentOdo,
                  remainingKm,
                  usagePercent,
                  status,
                }) => (
                  <div
                    key={component.id}
                    className={cn(
                      "group p-3 md:p-4 rounded-xl border transition-all duration-300 relative overflow-hidden",
                      status === "danger"
                        ? "bg-red-500/5 border-red-500/20 hover:border-red-500/30"
                        : status === "warning"
                          ? "bg-orange-500/5 border-orange-500/20 hover:border-orange-500/30"
                          : "bg-background/40 border-border/50 hover:border-primary/20",
                    )}
                  >
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs md:text-sm font-bold tracking-tight">
                            {component.name}
                          </p>
                          {status !== "safe" && (
                            <span
                              className={cn(
                                "text-[7px] md:text-[8px] font-extrabold uppercase px-1 md:px-1.5 py-0.5 rounded-md",
                                status === "danger"
                                  ? "bg-red-500 text-red-50 animate-pulse"
                                  : "bg-orange-500 text-orange-50",
                              )}
                            >
                              {status === "danger" ? "Ganti" : "Cek"}
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] md:text-[10px] text-muted-foreground font-medium mt-0.5 md:mt-1">
                          Sisa{" "}
                          <span
                            className={cn(
                              "font-bold",
                              status !== "safe"
                                ? "text-orange-500 font-extrabold"
                                : "text-foreground",
                            )}
                          >
                            {remainingKm} km
                          </span>{" "}
                          lagi
                        </p>
                      </div>
                      <div className="text-[9px] md:text-[10px] font-mono font-bold text-muted-foreground bg-muted/60 px-1.5 md:px-2 py-0.5 rounded-md">
                        {currentOdo} / {component.intervalKm} km
                      </div>
                    </div>

                    <div className="h-1 md:h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${usagePercent}%` }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          status === "danger"
                            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                            : status === "warning"
                              ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                              : "bg-green-500",
                        )}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity / Fuel Log */}
        <Card className="bg-card/50 border-none ring-1 ring-border/50 overflow-hidden shadow-sm lg:col-span-1">
          <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
            <CardTitle className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <IconDroplet className="h-3.5 w-3.5 text-blue-500 shrink-0" />{" "}
              Catatan BBM Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            {vehicleHealth?.latestFuelLog ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b pb-3 border-border/40">
                  <div>
                    <div className="text-xs md:text-sm font-bold text-foreground">
                      {vehicleHealth.latestFuelLog.fuelType} (
                      {vehicleHealth.latestFuelLog.liters}L)
                    </div>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-medium mt-0.5">
                      Odo:{" "}
                      {vehicleHealth.latestFuelLog.odoReading?.toLocaleString()}{" "}
                      km
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs md:text-sm font-extrabold text-foreground">
                      Rp{" "}
                      {vehicleHealth.latestFuelLog.amount.toLocaleString(
                        "id-ID",
                      )}
                    </div>
                    <p className="text-[8px] text-muted-foreground font-medium mt-0.5 italic">
                      {vehicleHealth.latestFuelLog.date}
                    </p>
                  </div>
                </div>
                {/* Additional quick stats / status info inside fuel card to make it look even more balanced on desktop */}
                <div className="text-[9px] md:text-[10px] text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Konsumsi rata-rata:</span>
                    <span className="font-bold text-foreground">
                      {fuel?.avg || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jarak tempuh minggu ini:</span>
                    <span className="font-bold text-foreground">
                      +
                      {vehicleHealth?.weeklyOdoDelta
                        ? vehicleHealth.weeklyOdoDelta.toLocaleString("id-ID")
                        : "0"}{" "}
                      km
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-1">
                <p className="text-xs text-muted-foreground italic">
                  Belum ada catatan pengisian BBM.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
