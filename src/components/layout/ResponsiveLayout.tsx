"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/layout/BottomNav"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DemoBanner } from "@/components/layout/DemoBanner"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"

const authPaths = ["/login", "/register"]

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const { initializeUserName } = useVehicleStore()
  const pathname = usePathname()
  const isAuth = authPaths.includes(pathname)

  useEffect(() => {
    initializeUserName()
  }, [initializeUserName])

  if (isAuth) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r bg-card/50">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
        <DemoBanner />
        <div className="md:hidden">
          <Topbar />
        </div>

        {/* Scrollable Container */}
        <ScrollArea className="flex-1 w-full min-h-0">
          <main className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
            {children}
          </main>
        </ScrollArea>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
