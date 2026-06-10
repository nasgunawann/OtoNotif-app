"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IconBell, IconTool, IconDroplet, IconAlertCircle, IconCircleCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useVehicleStore } from "@/lib/store/use-vehicle-store"

type Notification = {
  id: string
  title: string
  description: string
  time: string
  type: "warning" | "danger" | "success"
}

const iconMap = {
  danger: IconAlertCircle,
  warning: IconTool,
  success: IconDroplet,
}

const colorMap = {
  warning: { bg: "bg-orange-500/10", text: "text-orange-500" },
  danger: { bg: "bg-red-500/10", text: "text-red-500" },
  success: { bg: "bg-green-500/10", text: "text-green-500" },
}

export function NotificationSheet({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { fetchNotificationsSilent, _hydrated } = useVehicleStore()

  useEffect(() => {
    if (!_hydrated) return
    fetchNotificationsSilent().then(setNotifications).catch(() => {})
  }, [_hydrated, fetchNotificationsSilent])

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[400px] p-0 flex flex-col">
        <SheetHeader className="p-6 border-b text-left">
          <SheetTitle className="flex items-center gap-2">
            <IconBell className="h-5 w-5" />
            Notifikasi
          </SheetTitle>
          <SheetDescription>
            Tetap pantau kondisi kesehatan kendaraan Anda.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((n) => {
                const Icon = iconMap[n.type] || iconMap.warning
                const colors = colorMap[n.type] || colorMap.warning
                return (
                  <div key={n.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex gap-4">
                      <div className={`mt-1 h-9 w-9 shrink-0 flex items-center justify-center rounded-full ${colors.bg}`}>
                        <Icon className={`h-5 w-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold leading-none">{n.title}</p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {n.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12">
              <IconCircleCheck className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-sm font-medium text-muted-foreground">Tidak ada notifikasi baru</p>
              <p className="text-xs text-muted-foreground/60">Semua kendaraan dalam kondisi aman.</p>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t mt-auto">
          <Button variant="outline" className="w-full text-xs" size="sm">
            Tandai Semua Sudah Dibaca
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
