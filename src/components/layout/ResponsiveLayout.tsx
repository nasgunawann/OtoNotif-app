"use client"

import { BottomNav } from "@/components/layout/BottomNav"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r bg-card/50">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
        <div className="md:hidden">
          <Topbar />
        </div>

        {/* Scrollable Container (Full Width) */}
        <div className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
          <main className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
