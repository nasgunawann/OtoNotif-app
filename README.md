# OtoNotif

Pantau kesehatan kendaraan — catat odometer, BBM, servis, dan jadwal perawatan.

Built with [Next.js 16](https://nextjs.org), [Drizzle ORM](https://orm.drizzle.team), [SQLite](https://sqlite.org), [Docker](https://docker.com).

---

## Fitur

- Dashboard kondisi kendaraan (komponen, BBM, biaya bulanan)
- Catat pengisian BBM, odometer, riwayat servis
- Monitoring komponen berdasarkan interval jarak tempuh
- Notifikasi komponen yang perlu diganti
- Multi-kendaraan dengan pilih kendaraan utama
- Tema terang/gelap
- **Responsive**: mobile-first + sidebar desktop

---

## Development

### Prasyarat

- Node.js 20+
- pnpm 9+

### Setup

```bash
# Install dependencies
pnpm install

# Generate migration SQL dari schema
pnpm db:generate

# Push schema ke database SQLite lokal
pnpm db:push

# Jalankan dev server
pnpm dev
```

Buka http://localhost:3000.

### Seeding data dummy

```bash
curl -X POST http://localhost:3000/api/seed
```

### Lint & Build

```bash
pnpm lint        # ESLint check
pnpm build       # Production build
```

---

## Arsitektur

```
src/
├── app/              # Next.js App Router (pages + API routes)
│   ├── api/          # REST API endpoints
│   ├── history/      # Riwayat BBM & servis
│   ├── maintenance/  # Jadwal perawatan komponen
│   ├── profile/      # Profil pengguna
│   └── vehicles/     # Manajemen kendaraan
├── components/       # UI components (shadcn/ui)
│   ├── forms/        # Form untuk odometer, BBM, servis, kendaraan
│   └── layout/       # Sidebar, Topbar, Drawer, dll
├── db/               # Database layer
│   ├── schema.ts     # Drizzle schema definitions
│   ├── migrations/   # Generated SQL migrations
│   ├── index.ts      # Database connection (better-sqlite3)
│   └── migrate.ts    # Migration runner
├── hooks/            # Custom React hooks
├── lib/              # Utilities, tipe, store, API client
│   ├── services/     # API client wrapper
│   ├── store/        # Zustand state management
│   └── types.ts      # TypeScript types
└── instrumentation.ts # Auto-run migrasi saat startup
```

---

## Deployment

### Docker

```bash
# Build image
docker build -t otonotif-app -f dockerfile .

# Jalankan dengan compose
docker compose up -d
```

### CI/CD Pipeline

Push ke `main` → GitHub Actions otomatis:

1. **Lint** — `pnpm lint`
2. **Build & Push** — Build Docker image, push ke Docker Hub (`:latest`)
3. **Deploy** — SSH ke VPS → `docker compose pull && up -d --force-recreate`

### VPS Requirements

- Docker + Docker Compose
- Network `proxy-net` (untuk Nginx Proxy Manager)
- Volume `otonotif-data` untuk persist SQLite

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `file:./otonotif.db` | Path SQLite database |
| `PORT` | `3000` | Port aplikasi |
| `HOSTNAME` | `0.0.0.0` | Bind address (Docker) |

---

## Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (Turbopack, App Router, standalone output) |
| **Database** | SQLite via better-sqlite3 + Drizzle ORM |
| **UI** | shadcn/ui, Tailwind CSS, Motion (Framer Motion) |
| **State** | Zustand |
| **Forms** | react-hook-form + zod |
| **Icons** | Tabler Icons |
| **Infra** | Docker, GitHub Actions, Lightsail VPS |

---

Proyek ini adalah portfolio pribadi. Dibuat oleh [@nasgunawann](https://github.com/nasgunawann).
