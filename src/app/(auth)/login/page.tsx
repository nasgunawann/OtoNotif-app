"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { IconBrandGoogle } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Mode demo aktif.");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Gagal masuk ke mode demo");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn.email({ email, password });
    if (error) {
      toast.error(error.message || "Email atau password salah");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-screen max-h-screen overflow-hidden p-6 sm:p-8 bg-background relative select-none">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Centered Content Container */}
      <div className="w-full max-w-sm mx-auto my-auto flex flex-col justify-center space-y-4">
        {/* Mobile Centered Logo (Hidden on Desktop) */}
        <div className="flex items-center justify-center lg:hidden w-full pb-2">
          <Image
            src="/logo-light.svg"
            alt="OtoNotif Logo"
            width={180}
            height={48}
            className="h-12 w-auto dark:hidden"
            priority
          />
          <Image
            src="/logo-dark.svg"
            alt="OtoNotif Logo"
            width={180}
            height={48}
            className="h-12 w-auto hidden dark:block"
            priority
          />
        </div>

        {/* Desktop Centered Title (Hidden on Mobile) */}
        <div className="hidden lg:block text-center space-y-1">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Masuk ke OtoNotif
          </h2>
          <p className="text-xs text-muted-foreground">
            Pantau kesehatan kendaraan Anda secara real-time
          </p>
        </div>

        {/* Google Sign In */}
        <Button
          variant="outline"
          className="w-full h-11 gap-2 text-sm font-semibold rounded-xl"
          onClick={handleGoogle}
        >
          <IconBrandGoogle className="h-4 w-4" />
          Masuk dengan Google
        </Button>

        {/* Separator atau */}
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            atau
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 text-sm rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 text-sm rounded-xl"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold rounded-xl mt-1.5"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        {/* Separator Belum punya akun */}
        <div className="flex items-center gap-3 py-0.5">
          <Separator className="flex-1" />
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            Belum punya akun?
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Switch flow to Register & Demo */}
        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full h-11 text-sm font-semibold rounded-xl"
            asChild
          >
            <Link href="/register">Daftar Akun Baru</Link>
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl"
            onClick={handleDemo}
            disabled={demoLoading}
          >
            {demoLoading ? "Menyiapkan Demo..." : "Jelajahi Demo"}
          </Button>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="w-full text-center text-[10px] text-muted-foreground py-2 block lg:hidden">
        &copy; {new Date().getFullYear()} OtoNotif.
      </div>
    </div>
  );
}
