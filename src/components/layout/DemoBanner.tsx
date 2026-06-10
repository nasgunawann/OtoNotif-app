"use client"

import Link from "next/link"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"

export function DemoBanner() {
  const isDemo = useVehicleStore((s) => s.isDemo)

  if (!isDemo) return null

  return (
    <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-3 py-2 text-center text-xs sm:text-sm">
      <span className="text-amber-800 dark:text-amber-200">
        Anda sedang di mode demo. Data disimpan di browser dan tidak akan tersimpan secara permanen.
      </span>
      <Link href="/login" className="font-semibold text-amber-900 dark:text-amber-100 underline ml-1.5 hover:text-amber-600">
        Login
      </Link>
      <span className="text-amber-700 dark:text-amber-300 mx-1">atau</span>
      <Link href="/register" className="font-semibold text-amber-900 dark:text-amber-100 underline hover:text-amber-600">
        Daftar
      </Link>
    </div>
  )
}
