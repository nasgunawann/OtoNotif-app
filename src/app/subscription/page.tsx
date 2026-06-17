"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconCheck, IconCrown, IconSparkles, IconAlertCircle } from "@tabler/icons-react"
import { motion } from "motion/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setIsSubscribed(true)
      toast.success("Selamat! Anda berhasil berlangganan OtoNotif Plus (POC Mode)")
    }, 1500)
  }

  const handleCancelSubscribe = () => {
    setIsSubscribed(false)
    toast.info("Berlangganan dinonaktifkan")
  }

  const features = [
    { title: "Batas Jumlah Kendaraan", desc: "Banyak kendaraan terdaftar di satu akun.", free: "Maks 2 Kendaraan", plus: "Tanpa Batas" },
    { title: "Riwayat Ekspor Data", desc: "Ekspor riwayat servis & konsumsi BBM ke file Excel/CSV.", free: false, plus: true },
    { title: "Analitik Konsumsi BBM", desc: "Grafik mendalam performa dan efisiensi bahan bakar.", free: false, plus: true },
  ]

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeUp}
      className="space-y-6 pb-20 md:pb-0 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <IconArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OtoNotif Plus</h1>
          <p className="text-sm text-muted-foreground">Tingkatkan efisiensi perawatan kendaraan Anda.</p>
        </div>
      </div>

      {isSubscribed && (
        <Card className="border-green-500/20 bg-green-500/[0.03] dark:bg-green-500/[0.01]">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <IconCrown className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-500">Status Langganan Aktif</p>
                <p className="text-xs text-muted-foreground">Anda menggunakan paket OtoNotif Plus (POC Mode).</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleCancelSubscribe} className="text-xs text-red-500 border-red-500/20 hover:bg-red-500/10">
              Batalkan POC
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Free Plan */}
        <Card className="flex flex-col justify-between border-border relative overflow-hidden">
          <div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">OtoNotif Free</CardTitle>
              <CardDescription>Untuk melacak kendaraan pribadi Anda sehari-hari.</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tracking-tight">Rp0</span>
                <span className="text-sm text-muted-foreground">/ selamanya</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-t pt-4 space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    {f.free ? (
                      <IconCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <IconAlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={cn(!f.free && "text-muted-foreground line-through")}>{f.title}</span>
                      {typeof f.free === "string" && (
                        <span className="block text-xs font-medium text-amber-500 mt-0.5">{f.free}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
          <CardFooter className="pt-4 border-t">
            <Button variant="outline" className="w-full" disabled>
              Paket Saat Ini
            </Button>
          </CardFooter>
        </Card>

        {/* Plus Plan */}
        <Card className="flex flex-col justify-between border-primary/40 bg-primary/[0.01] relative overflow-hidden ring-1 ring-primary/20">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg flex items-center gap-1">
            <IconSparkles className="h-3 w-3 fill-primary-foreground" /> REKOMENDASI
          </div>
          <div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl flex items-center gap-1.5 text-primary">
                  OtoNotif Plus <IconCrown className="h-5 w-5 fill-primary text-primary" />
                </CardTitle>
              </div>
              <CardDescription>Solusi terbaik untuk pengawasan kendaraan tanpa batas.</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tracking-tight text-primary">Rp19.000</span>
                <span className="text-sm text-muted-foreground">/ bulan</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-t pt-4 space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <IconCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">{f.title}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                      {typeof f.plus === "string" && (
                        <span className="inline-block text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded mt-1">{f.plus}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
          <CardFooter className="pt-4 border-t bg-primary/[0.02]">
            <Button
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
              onClick={handleSubscribe}
              disabled={loading || isSubscribed}
            >
              {loading ? "Memproses..." : isSubscribed ? "Plus Aktif (POC)" : "Upgrade ke Plus"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  )
}
