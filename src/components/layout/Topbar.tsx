"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconBell, IconUserCircle, IconChevronLeft } from "@tabler/icons-react"
import { NotificationSheet } from "@/components/layout/NotificationSheet"
import { useRouter } from "next/navigation"
import { getPageTitle } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSession } from "@/lib/auth-client"

export function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const getTitle = () => getPageTitle(pathname)

  const isHome = pathname === "/dashboard"
  const title = getTitle()
  const navPaths = ["/dashboard", "/vehicles", "/maintenance", "/history"]
  const showBackButton = !navPaths.includes(pathname || "")

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-1">
            <IconChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <div className="font-bold text-lg text-primary flex items-center gap-2">
          {isHome ? (
            <Link href="/dashboard" className="flex items-center">
              <Image src="/logo-light.svg" alt="OtoNotif Logo" width={32} height={32} className="h-8 w-auto dark:hidden" />
              <Image src="/logo-dark.svg" alt="OtoNotif Logo" width={32} height={32} className="h-8 w-auto hidden dark:block" />
            </Link>
          ) : (
            title
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <NotificationSheet>
          <Button variant="ghost" size="icon" className="relative">
            <IconBell className="h-5 w-5" />
            <Badge variant="destructive" className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full p-0" />
          </Button>
        </NotificationSheet>

        <Link href="/profile" className="text-muted-foreground hover:text-foreground p-1 flex items-center justify-center shrink-0">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="h-6 w-6 rounded-full object-cover border border-border/80"
            />
          ) : (
            <IconUserCircle className="h-6 w-6" />
          )}
        </Link>
      </div>
    </header>
  )
}
