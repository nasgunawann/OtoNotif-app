"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconBell, IconUserCircle, IconChevronLeft } from "@tabler/icons-react"
import { NotificationSheet } from "@/components/layout/NotificationSheet"
import { useRouter } from "next/navigation"
import { getPageTitle } from "@/lib/navigation"

export function Topbar() {
  const pathname = usePathname()
  const router = useRouter()

  // Map pathname to Title
  const getTitle = () => {
    return getPageTitle(pathname)
  }

  const isHome = pathname === "/"
  const title = getTitle()

  // Define paths that are in the main navigation (no back button needed)
  const navPaths = ["/", "/vehicles", "/maintenance", "/history"]
  const showBackButton = !navPaths.includes(pathname || "")

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>
        )}
        <div className="font-bold text-lg text-primary flex items-center gap-2">
          {isHome ? "OtoNotif" : title}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <NotificationSheet>
          <button className="text-muted-foreground hover:text-foreground relative p-2">
            <IconBell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </NotificationSheet>

        <Link href="/profile" className="text-muted-foreground hover:text-foreground p-2">
          <IconUserCircle className="h-6 w-6" />
        </Link>
      </div>
    </header>
  )
}
