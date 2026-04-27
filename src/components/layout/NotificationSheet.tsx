"use client"

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

const notifications = [
  {
    id: 1,
    title: "Jadwal Ganti Oli Mesin",
    description: "Supra Bapak sudah mendekati batas (200 km lagi).",
    time: "10 menit lalu",
    type: "warning",
    icon: IconTool,
  },
  {
    id: 2,
    title: "Odometer Belum Update",
    description: "Sudah 2 minggu Anda tidak memperbarui angka odometer Civic Turbo.",
    time: "2 jam lalu",
    type: "danger",
    icon: IconAlertCircle,
  },
  {
    id: 3,
    title: "Bensin Berhasil Dicatat",
    description: "Log pengisian Pertamax senilai Rp 300rb telah disimpan.",
    time: "Yesterday",
    type: "success",
    icon: IconDroplet,
  },
]

export function NotificationSheet({ children }: { children: React.ReactNode }) {
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

        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex gap-4">
                    <div className={`mt-1 h-9 w-9 shrink-0 flex items-center justify-center rounded-full 
                      ${n.type === 'warning' ? 'bg-orange-500/10' :
                        n.type === 'danger' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                      <n.icon className={`h-5 w-5 
                        ${n.type === 'warning' ? 'text-orange-500' :
                          n.type === 'danger' ? 'text-red-500' : 'text-green-500'}`} />
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
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <IconCircleCheck className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-sm font-medium text-muted-foreground">Tidak ada notifikasi baru</p>
              <p className="text-xs text-muted-foreground/60">Semua kendaraan dalam kondisi aman.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t mt-auto">
          <Button variant="outline" className="w-full text-xs" size="sm">
            Tandai Semua Sudah Dibaca
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
