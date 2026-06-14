import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen max-h-screen flex lg:grid lg:grid-cols-12 bg-background overflow-hidden">
      {/* Left panel: Branding (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between bg-zinc-950 p-10 text-white overflow-hidden select-none">
        {/* Background Gradients and Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center">
          <Image
            src="/logo-dark.svg"
            alt="OtoNotif Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>

        {/* Middle content: Mock UI + Feature lists */}
        <div className="relative z-10 my-auto py-8 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              Pantau Kesehatan Kendaraan Anda.
            </h1>
            <p className="text-zinc-400 text-base max-w-sm">
              Asisten digital personal untuk melacak odometer, konsumsi BBM,
              servis berkala, dan pajak kendaraan.
            </p>
          </div>

          {/* Premium Mock Widget */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm space-y-4 shadow-xl max-w-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <p className="text-xs text-zinc-500 font-medium">
                  KENDARAAN UTAMA
                </p>
                <p className="text-sm font-semibold text-zinc-200">
                  Yamaha NMAX 155
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20">
                Butuh Perhatian
              </span>
            </div>

            <div className="space-y-3">
              {/* Component 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Oli Mesin</span>
                  <span className="text-emerald-400 font-medium">85%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>

              {/* Component 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Ban Belakang</span>
                  <span className="text-amber-400 font-medium">45%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>

              {/* Component 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">V-Belt</span>
                  <span className="text-rose-400 font-medium">12%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: "12%" }}
                  />
                </div>
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  ⚠️ Perlu diganti segera (sisa 120 km)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer note */}
        <div className="relative z-10 text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} OtoNotif.
        </div>
      </div>

      {/* Right panel: Form Content */}
      <div className="flex-1 flex flex-col h-full lg:col-span-7 bg-background overflow-hidden">
        {children}
      </div>
    </div>
  );
}
