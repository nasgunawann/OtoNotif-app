# OtoNotif — Project Handout

## Overview

Aplikasi tracking kesehatan kendaraan bermotor (motor/mobil). Users can monitor odometer, fuel consumption, component wear (oli, ban, V-belt, etc.), maintenance history, and get notifications when parts need replacement.

Bahasa Indonesia UI. Personal project by NanasGunung.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.4 (Turbopack, `output: "standalone"`) |
| Language | TypeScript (strict mode) |
| UI Library | React 19.2.4 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (radix-nova style) + Radix UI |
| Icons | Tabler Icons (`@tabler/icons-react`) |
| Animation | Motion (motion/react) |
| ORM | Drizzle ORM 0.45 |
| Database | SQLite via better-sqlite3 (dev), Postgres-ready via Drizzle dialect switch |
| State (client) | Zustand 5 |
| Forms | react-hook-form + @hookform/resolvers + zod |
| Toast | sonner |
| Theme | next-themes |
| Fonts | Inter (variable), Geist Sans/Mono |
| Package Mgr | pnpm (v11.5+), keep using pnpm, NOT npm |
| Container | Docker (multi-stage, node:20-alpine, standalone output) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              — root layout (fonts, theme, toaster)
│   ├── page.tsx                — dashboard (odometer, fuel, komponen, biaya)
│   ├── globals.css             — Tailwind v4 CSS
│   ├── vehicles/
│   │   ├── page.tsx            — list kendaraan + add form
│   │   └── [id]/page.tsx       — detail kendaraan + action buttons
│   ├── maintenance/page.tsx    — due/safe komponen
│   ├── history/page.tsx        — grouped by month (BBM + servis)
│   ├── profile/page.tsx        — user profile + theme toggle
│   └── api/
│       ├── vehicles/route.ts         — GET list, POST create
│       ├── vehicles/[id]/route.ts    — GET/PATCH/DELETE
│       ├── odometer/route.ts         — GET (by vehicleId), POST
│       ├── fuel/route.ts             — GET (by vehicleId), POST
│       ├── components/route.ts       — GET (by vehicleId), POST
│       ├── maintenance/route.ts      — GET (by vehicleId), POST
│       ├── notifications/route.ts    — GET (computed from DB)
│       ├── health/route.ts           — GET (by vehicleId, computed)
│       └── seed/route.ts             — POST (dev, optional)
├── components/
│   ├── ui/                     — shadcn components (19 files)
│   │   ├── button.tsx, card.tsx, dialog.tsx, drawer.tsx
│   │   ├── dropdown-menu.tsx, scroll-area.tsx, sheet.tsx
│   │   ├── input.tsx, label.tsx, select.tsx, textarea.tsx
│   │   ├── form.tsx, badge.tsx, separator.tsx, tabs.tsx
│   │   ├── table.tsx, avatar.tsx, skeleton.tsx, progress.tsx
│   │   └── sonner.tsx
│   ├── forms/                  — functional form components
│   │   ├── FormDialog.tsx      — responsive wrapper (Dialog desktop, Drawer mobile)
│   │   ├── OdometerForm.tsx    — update odometer reading
│   │   ├── FuelForm.tsx        — log fuel fill-up with BBM type select
│   │   ├── ServiceForm.tsx     — log maintenance with component selector
│   │   └── VehicleForm.tsx     — add new vehicle
│   ├── layout/
│   │   ├── ResponsiveLayout.tsx — Shell: Sidebar (desktop) + Topbar (mobile) + ScrollArea
│   │   ├── Sidebar.tsx         — desktop nav + notif sheet + quick input
│   │   ├── Topbar.tsx          — mobile top bar with back button + notif
│   │   ├── BottomNav.tsx       — mobile bottom nav + FAB
│   │   ├── QuickInputDrawer.tsx — responsive FAB (Dialog desktop, Drawer mobile)
│   │   └── NotificationSheet.tsx — notification slide-over
│   ├── ThemeToggle.tsx         — light/dark/system toggle
│   └── theme-provider.tsx      — next-themes wrapper
├── db/
│   ├── schema.ts               — Drizzle schema (5 tables)
│   ├── index.ts                — better-sqlite3 client singleton
│   └── migrate.ts              — migration runner (legacy, not primary)
├── hooks/
│   └── use-media-query.ts      — responsive breakpoint hook
├── lib/
│   ├── types.ts                — all TypeScript interfaces
│   ├── utils.ts                — cn() helper
│   ├── navigation.ts           — NAV_ITEMS config + getPageTitle
│   ├── services/
│   │   └── api.ts              — typed API client functions
│   └── store/
│       └── use-vehicle-store.ts — Zustand store
└── scripts/
    └── seed.ts                 — DB seed script (pnpm db:seed)
```

## Database Schema (Drizzle ORM)

5 tables in `src/db/schema.ts`:

**vehicles** — id, name, type (motor|mobil), image, engine, fuelCapacity, isPrimary, timestamps

**odometer_readings** — id, vehicleId, reading (int km), date, notes

**fuel_logs** — id, vehicleId, date, liters, amount (Rp), fuelType, odoReading

**components** — id, vehicleId, name, intervalKm, lastReplacedOdo (where it was last replaced), notes

**maintenance_records** — id, vehicleId, componentId (nullable), date, description, cost, odoReading, notes

Migration to Postgres: change `dialect` in `drizzle.config.ts` and update `DATABASE_URL` env.

## API Routes

All in `src/app/api/*`, use `Response.json()` pattern, params via `await params` (Next.js 16 Promise pattern).

Key computed endpoints:
- `/api/health?vehicleId=` — returns `VehicleHealth` with per-component usage %, remainingKm, status
- `/api/notifications` — returns danger/warning items based on component wear thresholds (>85% = danger, >70% = warning)

## Component Usage Rules

**ALWAYS use shadcn components instead of raw HTML:**
- `<Button>` not `<button>`
- `<Badge>` not `<span>` with bg classes for status/dot indicators
- `<ScrollArea>` not `<div class="overflow-y-auto">`
- `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>` not raw `<div>` wrappers
- `<Label>` not `<span>` for form labels
- `<Input>`, `<Select>`, `<Textarea>` for form inputs
- `<Avatar>` for user images
- `<Separator>` for visual dividers
- `<Tabs>` for tabbed navigation
- `<Table>` for data tables
- `<Progress>` for progress bars (though the dashboard uses custom animated ones)
- `<Skeleton>` for loading states
- `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` for forms

Exception: raw `<h1>`, `<h2>`, `<h3>` for page titles (outside Card context) is acceptable. Raw `<p>` for descriptive text outside Card is acceptable.

## State Management Pattern

1. Pages fetch data via Zustand store actions on mount (`useEffect`)
2. Store actions call `api.ts` service functions (which call fetch to `/api/*`)
3. Mutations (create) update local store state optimistically after successful API call
4. Forms use `react-hook-form` + `zod` validation, submit via store actions
5. Success/error feedback via `toast()` from sonner

## Form Dialog Pattern

`FormDialog` component auto-detects desktop vs mobile and renders:
- Desktop (≥768px): Dialog
- Mobile (<768px): Drawer

Use it like:
```tsx
<FormDialog title="..." trigger={<Button>...</Button>} open={open} onOpenChange={setOpen}>
  <SomeForm onSuccess={() => setOpen(false)} />
</FormDialog>
```

## Key Design Decisions

1. **Forms use Dialog on desktop, Drawer on mobile** — never Drawer on desktop
2. **Input/select elements: `h-10` (40px) minimum** for mobile touch targets
3. **Submit buttons: `size="lg" h-12 text-base`** for easy tapping
4. **All pages** refactored from hardcoded mock data → real API data
5. **Notifications computed server-side** based on component intervals vs actual odometer readings
6. **Docker volume `otonotif-data`** mounts to `/app/data` for SQLite persistence
7. **Seed data available** via `pnpm db:seed` or POST `/api/seed`

## Log Komit Terbaru

```
81f0264 refactor: replace raw HTML with shadcn components (Button, Badge, ScrollArea)
0f421ea fix: increase input sizes for better mobile touch targets, use Dialog on desktop for QuickInputDrawer
f7c60d9 feat: add functional forms for odometer, fuel, service, and vehicle creation; add SQLite Docker volume
be4a0c2 feat: refactor all pages to use real data from API instead of hardcoded mock data
5cc9b37 feat: add API service layer and Zustand store for client-side state management
8d51bba feat: add REST API routes for vehicles, odometer, fuel, components, maintenance, health, and notifications
b1464da feat: add drizzle schema (5 tables), sqlite client, and TypeScript types
f33e95b chore: add drizzle ORM, better-sqlite3, zod, zustand deps and shadcn UI components
173ada3 chore: swap DM_Sans to Inter, add sonner dep and pnpm config
```

## Known Issues / TODOs

- [ ] Profile page still has hardcoded user name ("Nanas Gunung") — needs auth
- [ ] "Ganti Kendaraan Utama" button on dashboard not functional
- [ ] "Lihat Semua" button on vehicle detail component list not wired
- [ ] Vehicle cards on list page don't show actual odometer
- [ ] No delete/edit for records (vehicles, fuel logs, etc.)
- [ ] No loading states for form submissions (isSubmitting used but no spinner)
- [ ] Dashboard fuel level is still mock (3.2L hardcoded)
- [ ] Monthly cost on dashboard is still mock (Rp 450.000)
- [ ] Odometer "minggu ini" delta is still mock (+120 km)
- [ ] Type badge on vehicle cards uses `Badge` component correctly
- [ ] Some `<p>` inside `<Card>` still not converted to `<CardDescription>` (minor)

## Perintah Berguna

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm db:seed      # seed database
pnpm dlx drizzle-kit push   # sync schema to DB
pnpm dlx drizzle-kit generate  # generate migration SQL
```

## Catatan untuk Agent Berikutnya

1. **Always use pnpm** for package management (NOT npm)
2. **Use shadcn components** for all UI — never raw HTML elements where a shadcn equivalent exists
3. **FormDialog** is the standard wrapper for form modals (auto Dialog/Drawer based on screen)
4. **Next.js 16** — route handler params are Promises (need `await params`)
5. **Tailwind v4** — uses modern `@import` in globals.css, not `@tailwind` directives
6. All files use 2-space indentation
7. The project uses `"radix-nova"` shadcn style — component patterns follow that style
