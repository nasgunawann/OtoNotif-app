import {
  IconHome,
  IconCar,
  IconTool,
  IconHistory,
  IconUserCircle
} from "@tabler/icons-react"

export const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Beranda",
    icon: IconHome,
    mobile: true,
    desktop: true
  },
  {
    href: "/vehicles",
    label: "Kendaraan",
    icon: IconCar,
    mobile: true,
    desktop: true
  },
  {
    href: "/maintenance",
    label: "Perawatan",
    icon: IconTool,
    mobile: true,
    desktop: true
  },
  {
    href: "/history",
    label: "Riwayat",
    icon: IconHistory,
    mobile: true,
    desktop: true
  },
  {
    href: "/profile",
    label: "Profil",
    icon: IconUserCircle,
    mobile: false, // Profile usually has its own place in Topbar/BottomNav logic
    desktop: false
  },
] as const

export const getPageTitle = (pathname: string) => {
  const item = NAV_ITEMS.find(item => item.href === pathname)
  if (item) return item.label

  // Handle sub-pages or special cases
  if (pathname.startsWith('/vehicles/')) return "Detail Kendaraan"

  return "OtoNotif"
}
