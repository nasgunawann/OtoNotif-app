"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_ITEMS } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { QuickInputDrawer } from "./QuickInputDrawer"
import { motion } from "motion/react"

export function BottomNav() {
  const pathname = usePathname()
  const mobileItems = NAV_ITEMS.filter(item => item.mobile)

  // Split items to insert the Plus button in the middle
  const firstHalf = mobileItems.slice(0, 2)
  const secondHalf = mobileItems.slice(2)

  return (
    <nav className="fixed bottom-0 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2 relative">
        {firstHalf.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors relative h-full",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <motion.div
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <item.icon className="h-5 w-5" />
              </motion.div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" 
                />
              )}
            </Link>
          )
        })}

        <div className="flex items-center justify-center -mt-8">
          <QuickInputDrawer />
        </div>

        {secondHalf.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors relative h-full",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <motion.div
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <item.icon className="h-5 w-5" />
              </motion.div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" 
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
