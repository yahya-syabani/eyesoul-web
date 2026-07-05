# Eyesoul Premium Eyewear — Web Frontend

A bilingual (EN/ID), performance-optimized catalogue + marketing website for Eyesoul Premium Eyewear, built on Next.js 16 (App Router) with data sourced from a Payload CMS v3 backend.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local to point to your CMS instance

# 3. Start the CMS (required for data)
# See ../cms/README.md for CMS setup

# 4. Start development server
npm run dev
# → http://localhost:3001
```

## Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `NEXT_PUBLIC_CMS_URL` | `http://localhost:3000` | Yes | Payload CMS REST API base URL |
| `FRONTEND_URL` | `http://localhost:3001` | For deployment | Canonical site URL (sitemap, meta) |

## Project Structure

```
src/
├── app/[locale]/        # All pages under locale route group
│   ├── layout.tsx       # Root layout (fonts, header, footer, providers)
│   ├── page.tsx         # Homepage
│   ├── products/        # Product catalogue & detail
│   ├── collections/     # Collections list & detail
│   ├── brands/          # Brands list & detail
│   ├── services/        # Services list & detail
│   ├── articles/        # Journal articles list & detail
│   ├── contact/         # Contact/inquiry page
│   ├── faq/             # FAQ accordion
│   ├── store-locator/   # Interactive store finder
│   ├── [slug]/          # CMS-managed generic pages
│   ├── privacy/         # Privacy policy (static)
│   └── terms/           # Terms of service (static)
├── components/
│   ├── home/            # Homepage-specific section components
│   ├── layout/          # Header, Footer, MegaMenu, MobileMenu
│   └── ui/              # Reusable UI primitives
├── lib/cms/             # CMS data access layer (fetch wrappers)
├── lib/hooks/           # Custom React hooks
├── lib/utils/           # Utility functions (media, lexical)
└── i18n/                # next-intl routing & message loading
messages/
├── en.json              # English translations
└── id.json              # Indonesian translations
```

## Key Technical Decisions

- **Server-first**: Pages fetch data from CMS at request time; client components only for interactivity
- **URL-driven filters**: Product catalogue filtering uses URL search params (SSR-friendly)
- **Localized CMS**: All content types have `localized: true` fields; CMS handles locale fallback
- **Design system**: Tailwind v4 with shadcn/ui (Base UI) primitives + framer-motion animations

## Known Gaps

See [`PROJECT_ARCHITECTURE.md`](../PROJECT_ARCHITECTURE.md) Section 11 for complete issue inventory.
Key items: Contact form has no backend, newsletter is simulated, no search/wishlist, no price field in product schema.

## Documentation

- **[PROJECT_ARCHITECTURE.md](../PROJECT_ARCHITECTURE.md)** — Complete architecture, component, and feature documentation

## Related

- `../cms/` — Payload CMS backend (database, admin panel, API)
