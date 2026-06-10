"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import { IconBell, IconPlus, IconUserCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuickInputDrawer } from "@/components/layout/QuickInputDrawer";
import { motion } from "motion/react";
import { NotificationSheet } from "@/components/layout/NotificationSheet";

export function Sidebar() {
  const pathname = usePathname();
  const desktopItems = NAV_ITEMS.filter((item) => item.desktop);

  return (
    <div className="flex flex-col h-full bg-card/50">
      {/* Logo Area */}
      <div className="h-16 border-b flex items-center justify-center px-6">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo-light.svg"
            alt="OtoNotif Logo"
            width={40}
            height={40}
            className="h-10 w-auto dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            alt="OtoNotif Logo"
            width={40}
            height={40}
            className="h-10 w-auto hidden dark:block"
          />
        </Link>
      </div>

      {/* Quick Action */}
      <div className="p-6 pb-2">
        <QuickInputDrawer>
          <Button className="w-full gap-2" size="lg">
            <IconPlus className="h-5 w-5" />
            Input Cepat
          </Button>
        </QuickInputDrawer>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {desktopItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <motion.div
                animate={{ scale: isActive ? 1.2 : 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <item.icon className="h-5 w-5" />
              </motion.div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2">
        <NotificationSheet>
          <Button
            variant="ghost"
            className="flex items-center gap-3 px-3 py-2.5 w-full justify-start text-sm font-medium h-auto"
          >
            <div className="relative">
              <IconBell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full p-0"
              />
            </div>
            <span>Notifikasi</span>
          </Button>
        </NotificationSheet>
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
            pathname === "/profile"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <motion.div
            animate={{ scale: pathname === "/profile" ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <IconUserCircle className="h-5 w-5" />
          </motion.div>
          <span>Profil</span>
        </Link>
      </div>
    </div>
  );
}
