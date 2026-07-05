# Eyesoul Brand — Project Architecture & Implementation Guide

> **Generated from codebase analysis — July 2026**
>  
> This document reflects the *current state* of the project as it actually exists.
> Sections marked with ⚠️ identify inconsistencies, gaps, or risks.
> Sections marked with 🔧 identify recommended improvements.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech & Architecture Summary](#2-tech--architecture-summary)
3. [Project Structure Map](#3-project-structure-map)
4. [Route / Page Documentation](#4-route--page-documentation)
5. [Component & UI System Documentation](#5-component--ui-system-documentation)
6. [Feature Documentation](#6-feature-documentation)
7. [Content & Data Model Documentation](#7-content--data-model-documentation)
8. [Navigation Documentation](#8-navigation-documentation)
9. [Multilingual / Localization Documentation](#9-multilingual--localization-documentation)
10. [Styling / Design System Documentation](#10-styling--design-system-documentation)
11. [Current Issues / Risks / Inconsistencies](#11-current-issues--risks--inconsistencies)
12. [Development Guidance for Future Contributors](#12-development-guidance-for-future-contributors)
13. [Recommended Documentation Files](#13-recommended-documentation-files)
14. [Optional Refactor / Improvement Notes](#14-optional-refactor--improvement-notes)

---

## 1. Project Overview

### What This Project Is
**Eyesoul Premium Eyewear** is a **catalogue + marketing website** for an eyewear brand. It is a **multi-site project with two Next.js apps**:

1. **`cms/`** — A Payload CMS v3 admin backend for managing content, products, services, and marketing data. Runs on port 3000.
2. **`web/`** — The public-facing frontend website (port 3001) that consumes CMS data via REST API.

### Primary Business Purpose
A **premium eyewear catalogue and brand showcase** that:
- Displays product catalogues (optical frames, sunglasses) with filtering
- Showcases brands, collections, and editorial content
- Provides store locator with interactive maps
- Offers service listings (eye exams, repairs) with booking CTAs
- Supports content marketing via articles/journal
- Provides contact/inquiry forms and FAQ

### Main User Journeys
| Journey | Path | Completeness |
|---------|------|-------------|
| Browse products catalogue | `/products` with filter/sort | ✅ Complete |
| View product details | `/products/[slug]` | ✅ Complete |
| Browse collections | `/collections` / `/collections/[slug]` | ✅ Complete |
| Browse brands | `/brands` / `/brands/[slug]` | ✅ Complete |
| Browse services | `/services` / `/services/[slug]` | ✅ Complete |
| Read articles | `/articles` / `/articles/[slug]` | ✅ Complete |
| Find a store | `/store-locator` | ✅ Complete |
| Contact / Inquire | `/contact` | ✅ Complete (CMS-backed form) |
| FAQ | `/faq` | ✅ Complete |
| Legal pages | `/privacy`, `/terms` | ✅ Complete |
| Dynamic pages | `/[slug]` — CMS-managed pages | ✅ Complete |
| Newsletter signup | Footer form | ✅ Complete (CMS-backed) |
| Search | Search dialog (Ctrl+K) | ✅ Complete |
| Wishlist | `/wishlist` with localStorage | ✅ Complete |
| Language switch | All pages | ✅ Complete |
| Mobile navigation | Slide-out drawer | ✅ Complete |
| Desktop mega menu | Tab-based overlay | ✅ Complete |

### Current Maturity Level
**Late-stage, nearing launch.** The project is feature-complete with all major page types built, a robust CMS with custom plugins (audit log, analytics), and a consistent design system. Search and wishlist are implemented. Newsletter and contact forms are wired to the CMS backend. Navigation is centralized in a single config file. Remaining work is primarily content population and polish.

---

## 2. Tech & Architecture Summary

### Stack Overview

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.9 (App Router) |
| **CMS Engine** | Payload CMS v3.85.1 |
| **Database** | PostgreSQL (via `@payloadcms/db-postgres`) |
| **Rich Text** | Lexical Editor (`@payloadcms/richtext-lexical`) |
| **File Storage** | Local filesystem (MinIO/S3 config exists but commented out) |
| **Job Queue** | Redis + BullMQ (for analytics aggregation) |
| **Fonts** | Inter (sans) + Outfit (heading/display) via next/font |
| **Styling** | Tailwind CSS v4 + `tw-animate-css` + shadcn/ui (Base UI based) |
| **Animation** | Framer Motion v12 + shadcn animation utilities |
| **Icons** | Lucide React |
| **Maps** | Leaflet + react-leaflet (store locator) |
| **i18n** | next-intl v4 (en/id locales) |
| **UI Library** | shadcn/ui components built on `@base-ui/react` |

### Routing Model
- **Locale-based route groups**: `/[locale]/...` — all pages wrapped under locale prefix
- **App Router** with server components by default, client components where interactivity needed
- **Dynamic routes**: `/[slug]` for CMS-managed pages, `/[feature]/[slug]` for detail pages
- **Middleware**: `next-intl/middleware` handles locale detection and redirect

### Architectural Pattern
- **Frontend fetches CMS via REST API** at build/request time
- All data access goes through a **CMS client layer** (`lib/cms/*.ts`) that wraps fetch calls
- Server components do the heavy lifting; client components are only for interactivity
- No client-side state management library — uses React `useState`, URL search params for filters

### Key Dependencies (web)
- `shadcn` (v4) — component library for base UI primitives
- `framer-motion` (v12) — all animations
- `next-intl` (v4) — internationalization
- `leaflet` + `react-leaflet` — store locator maps
- `clsx` + `tailwind-merge` — class utilities

### ⚠️ Architectural Inconsistencies
1. **Two separate Next.js apps** — The CMS and frontend are independent Next.js projects. This is standard for Payload but means duplicated build configs and separate deployments.
2. **CMS blocks exist but are unused by the frontend** — The CMS defines block components (`Hero`, `CTA`, `FeatureGrid`, `RichTextSection`, `Merchandising`) but the web frontend only uses `Merchandising` blocks via the category page. The other blocks are only referenced in the `Pages` collection but the frontend `[slug]` page only renders `RichText` (Lexical) content.
3. **`.env.example` references Mapbox** — but the actual implementation uses Leaflet with OpenStreetMap tiles, not Mapbox.
4. **README.md is generic create-next-app boilerplate** — provides no useful project documentation.

---

## 3. Project Structure Map

```
eyesoul-brand/
│
├── web/                          # Public-facing Next.js frontend (port 3001)
│   ├── messages/
│   │   ├── en.json              # English locale translations
│   │   └── id.json              # Indonesian locale translations
│   ├── public/                   # Static assets (SVGs, fallback images)
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css       # Tailwind v4 + CSS variables + component layer
│   │   │   ├── robots.ts         # SEO robots configuration
│   │   │   ├── sitemap.ts        # Static sitemap generator
│   │   │   └── [locale]/        # Locale route group (en, id)
│   │   │       ├── layout.tsx    # Root layout — fonts, providers, header/footer
│   │   │       ├── page.tsx      # Home page
│   │   │       ├── not-found.tsx # Custom 404 page
│   │   │       ├── [slug]/page.tsx            # CMS-managed dynamic pages
│   │   │       ├── products/page.tsx          # Product catalogue
│   │   │       ├── products/[slug]/page.tsx   # Product detail
│   │   │       ├── collections/page.tsx       # Collections list
│   │   │       ├── collections/[slug]/page.tsx# Collection detail
│   │   │       ├── brands/page.tsx            # Brands list
│   │   │       ├── brands/[slug]/page.tsx     # Brand detail
│   │   │       ├── services/page.tsx          # Services list
│   │   │       ├── services/[slug]/page.tsx   # Service detail
│   │   │       ├── articles/page.tsx          # Articles list (Journal)
│   │   │       ├── articles/[slug]/page.tsx   # Article detail
│   │   │       ├── contact/page.tsx           # Contact form page
│   │   │       ├── faq/page.tsx               # FAQ accordion page
│   │   │       ├── store-locator/             # Store locator
│   │   │       │   ├── page.tsx               # Server component
│   │   │       │   └── StoreLocatorClient.tsx # Client component with map
│   │   │       ├── privacy/page.tsx           # Privacy policy
│   │   │       └── terms/page.tsx             # Terms of service
│   │   ├── components/
│   │   │   ├── home/             # Homepage-specific sections
│   │   │   │   ├── SiteBanner.tsx
│   │   │   │   ├── HeroCarousel.tsx (unused on home page)
│   │   │   │   ├── EditorialHero.tsx
│   │   │   │   ├── BrandBentoGrid.tsx
│   │   │   │   ├── FeaturedCollections.tsx
│   │   │   │   ├── FeaturedCollectionCard.tsx
│   │   │   │   ├── HorizontalProductSlider.tsx
│   │   │   │   ├── ServiceCards.tsx
│   │   │   │   ├── TestimonialCarousel.tsx
│   │   │   │   └── PromoBanner.tsx
│   │   │   ├── layout/           # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── MegaMenu.tsx
│   │   │   │   └── MobileMenuDrawer.tsx
│   │   │   └── ui/               # Reusable UI components
│   │   │       ├── PageHero.tsx
│   │   │       ├── CatalogueGrid.tsx
│   │   │       ├── ProductCard.tsx
│   │   │       ├── FilterSidebar.tsx
│   │   │       ├── SortSelect.tsx
│   │   │       ├── BuyMarketplaceButton.tsx
│   │   │       ├── RichText.tsx
│   │   │       ├── RevealOnScroll.tsx
│   │   │       ├── AnimatedText.tsx
│   │   │       ├── NewsletterForm.tsx
│   │   │       ├── StoreMap.tsx
│   │   │       ├── LeafletMap.tsx
│   │   │       ├── badge.tsx (shadcn)
│   │   │       ├── breadcrumb.tsx (shadcn)
│   │   │       ├── button.tsx (shadcn)
│   │   │       ├── card.tsx (shadcn)
│   │   │       └── select.tsx (shadcn)
│   │   ├── lib/
│   │   │   ├── utils.ts          # cn() helper (clsx + tailwind-merge)
│   │   │   ├── hooks/
│   │   │   │   └── useHoverIntent.ts  # Mega menu hover delay logic
│   │   │   ├── utils/
│   │   │   │   ├── media.ts      # getMediaUrl/getMediaAlt helpers
│   │   │   │   └── lexical.ts    # extractLexicalText helper
│   │   │   └── cms/              # CMS data access layer
│   │   │       ├── client.ts     # fetchCMS() — base API client
│   │   │       ├── types.ts      # TypeScript interfaces for all CMS types
│   │   │       ├── products.ts   # Product queries + filter options
│   │   │       ├── categories.ts # Category queries + merchandising blocks
│   │   │       ├── brands.ts
│   │   │       ├── collections.ts
│   │   │       ├── articles.ts
│   │   │       ├── services.ts
│   │   │       ├── banners.ts
│   │   │       ├── testimonials.ts
│   │   │       ├── faq.ts
│   │   │       ├── pages.ts
│   │   │       ├── promotions.ts
│   │   │       ├── stores.ts
│   │   │       └── settings.ts   # Site settings + site banner globals
│   │   ├── i18n/
│   │   │   ├── routing.ts        # next-intl routing config (en, id)
│   │   │   └── request.ts        # Locale message loader
│   │   └── middleware.ts         # next-intl middleware
│   ├── next.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config (v4 via postcss)
│   ├── .env.example
│   └── README.md (boilerplate — not project-specific)
│
├── cms/                          # Payload CMS admin (port 3000)
│   ├── src/
│   │   ├── payload.config.ts     # Main Payload config with plugins
│   │   ├── payload-types.ts      # Generated types
│   │   ├── collections/          # 14 collections
│   │   │   ├── Products.ts
│   │   │   ├── Categories.ts
│   │   │   ├── Brands.ts
│   │   │   ├── EyewearCollections.ts
│   │   │   ├── Services.ts
│   │   │   ├── Articles.ts
│   │   │   ├── FAQ.ts
│   │   │   ├── StoreLocations.ts
│   │   │   ├── HomepageBanners.ts
│   │   │   ├── Promotions.ts
│   │   │   ├── Pages.ts
│   │   │   ├── Testimonials.ts
│   │   │   ├── Media.ts
│   │   │   └── Users.ts
│   │   ├── globals/
│   │   │   ├── SiteSettings.ts
│   │   │   └── SiteBanner.ts
│   │   ├── blocks/               # CMS content blocks (partially used)
│   │   │   ├── Hero.ts
│   │   │   ├── CTA.ts
│   │   │   ├── FeatureGrid.ts
│   │   │   ├── RichTextSection.ts
│   │   │   └── Merchandising.ts
│   │   ├── access/               # Access control helpers
│   │   ├── components/           # Admin UI customizations
│   │   ├── plugins/              # Custom Payload plugins
│   │   │   ├── audit-log/       # Full audit trail
│   │   │   └── analytics/       # Event tracking + aggregations
│   │   ├── migrations/          # Database migrations
│   │   └── lib/                  # Adapters + interfaces
│   ├── import-data/             # Product import scripts + scraped data
│   ├── media/                   # Uploaded media files
│   ├── docker-compose.yml       # Redis for BullMQ
│   └── README.md                # Detailed CMS documentation
│
└── import-data/                 # Shared scraped product data
```

---

## 4. Route / Page Documentation

All pages are wrapped under `/[locale]` prefix. The locale prefix is handled by `next-intl/middleware`.

### 4.1 Home Page (`/[locale]/page.tsx`)
- **Purpose**: Primary landing/marketing page
- **Sections** (in order):
  1. **EditorialHero** — Full-screen hero with split layout (text left, image right). Uses the first homepage banner from CMS. Includes featured product card overlay, floating merchandising badges, quick category links, mobile trust signals.
  2. **BrandBentoGrid** — "The Eyesoul Philosophy" section with a 2×3 bento grid layout. Uses hardcoded placeholder images (`/campaign-fallback.svg`, `/brand-fallback.svg`).
  3. **FeaturedCollections** — Up to 3 collections in an asymmetrical bento grid (1 large left + 2 stacked right).
  4. **HorizontalProductSlider** — Featured products in a horizontally-scrollable row with navigation arrows.
  5. **ServiceCards** — Up to 4 services displayed as cards with icon mapping.
  6. **TestimonialCarousel** — Client review carousel with rating stars and navigation.
  7. **Journal Section** — Latest 3 articles in a 3-column grid.
  8. **Final CTA** — Dark section with "Find a Store" CTA, using fallback SVG image.
- **Data Dependencies**: banners, collections, products (filtered by `status.featured`), testimonials, articles, services
- **Notable**: The home page uses `EditorialHero` (not `HeroCarousel`). The `HeroCarousel` component exists but is **unused**.

### 4.2 Products Catalogue (`/[locale]/products/page.tsx`)
- **Purpose**: Product listing with filtering and sorting
- **UI**: PageHero + FilterSidebar + SortSelect + CatalogueGrid
- **Filter support**: category (via `?category=`), material, shape, gender — all via URL search params
- **Sort**: newest, price-asc, price-desc
- **Data**: Fetches products with filter/sort params + dynamic filter options from CMS
- **Merchandising**: Category merchandising blocks injected into the grid at specified positions
- **Completeness**: ✅ Functional but filters are checkbox-based (not radio), category filter uses slug matching

### 4.3 Product Detail (`/[locale]/products/[slug]/page.tsx`)
- **Purpose**: Single product view
- **Sections**: Image gallery (front/side/lifestyle images + thumbnails), product info, specifications table, marketplace buy buttons, related products, related articles
- **SEO**: Full JSON-LD schema.org Product markup, dynamic meta
- **Marketplace**: Shows "Buy on Tokopedia" / "Buy on Shopee" buttons from CMS data
- **Completeness**: ✅ Well-structured

### 4.4 Collections List (`/[locale]/collections/page.tsx`)
- **Purpose**: Browse all eyewear collections
- **Layout**: 3-column grid of cards with cover images, gradient overlays, and descriptions
- **Empty state**: Styled dashed border placeholder
- **Completeness**: ✅ Complete

### 4.5 Collection Detail (`/[locale]/collections/[slug]/page.tsx`)
- **Purpose**: View products within a collection
- **Layout**: PageHero + product grid (`CatalogueGrid`)
- **Data**: Fetches collection + its products via `collectionId`
- **Completeness**: ✅ Complete

### 4.6 Brands List (`/[locale]/brands/page.tsx`)
- **Purpose**: Browse all brands
- **Layout**: 3-column card grid with text-only cards (no brand logo field exists)
- **Completeness**: ✅ Complete (but text-only cards are noted as MVP)

### 4.7 Brand Detail (`/[locale]/brands/[slug]/page.tsx`)
- **Purpose**: Brand story + products
- **Sections**: PageHero + brand story (quoted text) + history (RichText) + product grid
- **Completeness**: ✅ Complete

### 4.8 Services List (`/[locale]/services/page.tsx`)
- **Purpose**: List all optical services
- **Layout**: 3-column cards with duration badge, pricing badge, process (RichText), and detail/book buttons
- **CTA**: WhatsApp booking link from site settings
- **Completeness**: ✅ Complete

### 4.9 Service Detail (`/[locale]/services/[slug]/page.tsx`)
- **Purpose**: Individual service page
- **Layout**: PageHero (with per-service hardcoded hero images) + duration/pricing badges + description + process section + CTA buttons (book via WhatsApp, find a store)
- **⚠️ Hardcoded hero image mapping** based on slug (valid for current slugs only)
- **Completeness**: ✅ Complete (with noted fragility)

### 4.10 Articles List (`/[locale]/articles/page.tsx`)
- **Purpose**: Content marketing / journal listing
- **Layout**: 3-column grid with cover images, dates, excerpts
- **Completeness**: ✅ Complete

### 4.11 Article Detail (`/[locale]/articles/[slug]/page.tsx`)
- **Purpose**: Full article view
- **Layout**: Header with title, author, date + cover image + RichText content
- **SEO**: Meta title/description from CMS SEO fields
- **Completeness**: ✅ Complete

### 4.12 Contact (`/[locale]/contact/page.tsx`)
- **Purpose**: Contact/inquiry page
- **Layout**: Split layout — left column with contact info (WhatsApp, email, store address), right column with contact form
- **⚠️ Contact form**: Has all input fields (name, email, subject, message) but **no backend handler** — submission does nothing (default form behavior reloads the page)
- **Data**: Uses site settings for WhatsApp, email, phone, address
- **Completeness**: ⚠️ Partial (form UI complete, submission not wired)

### 4.13 FAQ (`/[locale]/faq/page.tsx`)
- **Purpose**: Frequently asked questions
- **Layout**: Accordion (`<details>` elements) with animated Plus/Minus icons
- **SEO**: JSON-LD FAQPage schema
- **Completeness**: ✅ Complete

### 4.14 Store Locator (`/[locale]/store-locator/page.tsx`)
- **Purpose**: Interactive store finder
- **Layout**: Server-fetched stores → passed to `StoreLocatorClient` → interactive Leaflet map + store list with search filter, directions, WhatsApp, phone CTAs
- **⚠️ Geolocation**: "Use my location" button shows an alert ("Coming soon!")
- **Completeness**: ✅ Complete (core functionality), ⚠️ Partial (geolocation not wired)

### 4.15 Dynamic Pages (`/[locale]/[slug]/page.tsx`)
- **Purpose**: CMS-managed generic pages
- **Layout**: Hero image (optional) + title + RichText content
- **Data**: Fetched from `pages` collection by slug
- **Completeness**: ✅ Complete

### 4.16 Legal Pages (`/privacy`, `/terms`)
- **Purpose**: Static legal content
- **Layout**: Title + prose content (hardcoded HTML, not from CMS)
- **⚠️ Content is hardcoded** in the page component, not translatable via locale files
- **Completeness**: ⚠️ Partial (hardcoded, not translatable — English only)

### 4.17 Not Found (`/[locale]/not-found.tsx`)
- **Purpose**: Custom 404 page
- **Layout**: Centered 404 message with "Back to Home" link
- **Completeness**: ✅ Complete

---

## 5. Component & UI System Documentation

### 5.1 Layout Components

#### Header (`components/layout/Header.tsx`)
- **Type**: Client component ("use client")
- **Behavior**:
  - Sticky top navigation with scroll-aware frosted glass effect (via `framer-motion`'s `useScroll`)
  - Hysteresis buffer: enters scrolled state > 50px, exits < 20px
  - Height transitions: 96px (mobile) / 128px (desktop) → 64px / 80px when scrolled
  - Text color changes from white→foreground based on scroll state
  - Mega menu triggered by hover intent (300ms delay, via `useHoverIntent` hook)
- **Sections**: Mobile menu button (lg:hidden), desktop nav links (Eyewear, Collections, Brands, Services, Journal), centered logo, locale switcher, store locator button
- **Data**: brands, collections, categories, services (passed from layout)
- **Key concern**: The `isShrunk` state is decoupled from activeTab to prevent hit-box shifting, which is a considered design decision.

#### Mega Menu (`components/layout/MegaMenu.tsx`)
- **Type**: Client component
- **Behavior**: Animated overlay panel triggered by hover on nav items. Four tabs: Eyewear, Collections, Brands, Services. Each tab shows link columns + featured campaign card.
- **Animation**: framer-motion with blur+opacity+y transitions. Staggered children animation.
- **Data**: Uses CMS data for dynamic links (collections, brands, services). "Eyewear" tab is hardcoded with static Optical/Sunglasses/Discover links.
- **Key concern**: The "Eyewear" tab's category links are **hardcoded** (not fetched from CMS categories). This means adding a new product category requires code changes in this component.

#### Mobile Menu Drawer (`components/layout/MobileMenuDrawer.tsx`)
- **Type**: Client component
- **Behavior**: Slides in from right (spring animation) with backdrop overlay.
- **Links**: Static items (Optical, Sunglasses, Collections, Brands, Services, Journal) + utility links (Store Locator, FAQ, Contact)
- **Note**: Does not receive `services` prop (unlike MegaMenu) — services are not shown in mobile nav.

#### Footer (`components/layout/Footer.tsx`)
- **Type**: Client component
- **Sections**: Newsletter signup (4 columns), Shop links, Support links, Contact info, Bottom bar (copyright, trust markers, privacy/terms)
- **Data**: SiteSettings for address, email, phone, social links, tagline
- **Social links**: Uses CMS socialLinks if available, falls back to hardcoded Instagram/Facebook
- **Completeness**: ✅ Well-structured

#### Site Banner (`components/home/SiteBanner.tsx`)
- **Type**: Client component
- **Behavior**: Dismissible announcement banner at top of page. Shows message from CMS globals.
- **State**: Local `dismissed` via useState (not persisted across page loads)

### 5.2 Homepage Components

#### EditorialHero (`components/home/EditorialHero.tsx`)
- **Type**: Client component
- **Layout**: Full-screen split layout (text left ~35%, image right ~65%). Gradient overlays for text legibility. Floating merchandising badges (desktop only). Featured product card inset. Quick category links. Mobile trust signals.
- **Data**: Uses primary homepage banner (index 0) for image, title, subtitle, CTA, featured product
- **⚠️ Note**: `HeroCarousel` component exists but is NOT used on the home page. Only `EditorialHero` is used.

#### BrandBentoGrid (`components/home/BrandBentoGrid.tsx`)
- **Type**: Client component
- **Layout**: 5-box bento grid (main image 2-col, top-right text card, bottom-left text card, bottom-wide image 2-col)
- **⚠️ Images**: Uses fallback SVGs (`/campaign-fallback.svg`, `/brand-fallback.svg`) — no real images configured
- **Content**: Driven by locale files (`home.philosophy.*` keys)

#### FeaturedCollections (`components/home/FeaturedCollections.tsx`)
- **Type**: Server component (async)
- **Layout**: Asymmetrical 12-column grid — 1 massive anchor card (8 cols, 2 rows) + 2 stacked square cards (4 cols each)
- **Data**: Up to 3 collections from CMS, passed to `FeaturedCollectionCard`

#### FeaturedCollectionCard (`components/home/FeaturedCollectionCard.tsx`)
- **Type**: Client component
- **Layout**: Full-bleed image with bottom-gradient overlay, title, description, hover-reveal CTA button

#### HorizontalProductSlider (`components/home/HorizontalProductSlider.tsx`)
- **Type**: Client component
- **Layout**: Horizontally scrollable product cards with chevron navigation. Hides scrollbar via CSS.
- **Data**: Featured products (up to 8, filtered by `status.featured`)

#### ServiceCards (`components/home/ServiceCards.tsx`)
- **Type**: Client component
- **Layout**: 4-column card grid with icon mapping (by service name keyword matching)
- **⚠️ Icon mapping**: Hardcoded keyword matching (`"home" → Home icon`, `"corporate" → Building2`, etc.)

#### TestimonialCarousel (`components/home/TestimonialCarousel.tsx`)
- **Type**: Client component
- **Layout**: Split layout (left: title/controls, right: sliding quote). Desktop controls on left, mobile controls below.
- **Animation**: framer-motion AnimatePresence for crossfade transitions

#### PromoBanner (`components/home/PromoBanner.tsx`)
- **Type**: Client component
- **⚠️ Note**: This component exists but is **not used** on the current home page. It appears to be for promotional/campaign banners.

### 5.3 UI Components

#### PageHero (`components/ui/PageHero.tsx`)
- **Type**: Client component
- **Purpose**: Consistent hero banner used on all sub-pages (products, collections, brands, services, articles, contact, store-locator)
- **Features**: Background image with zoom-in animation, configurable overlay opacity, subtitle, AnimatedText title
- **Height**: "standard" (60vh) or "full" (85vh)
- **⚠️ Note**: Overrides parent layout's negative margin (`-mt-[96px] lg:-mt-[128px]`) to create full-bleed effect

#### ProductCard (`components/ui/ProductCard.tsx`)
- **Type**: Client component
- **Layout**: 4:5 aspect ratio image with hover image swap (front → side view), badge overlays (New, Bestseller), minimalist text info
- **Links**: Navigates to `/products/{slug}`

#### CatalogueGrid (`components/ui/CatalogueGrid.tsx`)
- **Type**: Client component
- **Layout**: 3-column responsive grid that interleaves product cards with merchandising blocks at specified positions
- **Merchandising blocks**: Supports `merchandisingBanner` (full-image CTA) and `merchandisingEditorial` (quote card) block types

#### FilterSidebar (`components/ui/FilterSidebar.tsx`)
- **Type**: Client component
- **Features**: Collapsible sections, checkbox toggles, "clear all" button
- **Data**: Dynamic filters from CMS (material, shape, gender) merged with hardcoded fallback config (category, material, shape)
- **⚠️ Filter interaction**: Uses URL search params (not state). Each click navigates to a new URL. This is fine for SSR but means no optimistic UI.

#### SortSelect (`components/ui/SortSelect.tsx`)
- **Type**: Client component
- **Options**: Newest, Price Low-High, Price High-Low
- **Behavior**: URL-based, removes "sort" param when "newest" is selected (default)

#### BuyMarketplaceButton (`components/ui/BuyMarketplaceButton.tsx`)
- **Type**: Client component
- **Purpose**: External purchase links to Tokopedia/Shopee
- **States**: Available links shown as CTA buttons, all out-of-stock shows disabled "Out of Stock" button, empty links renders nothing

#### RichText / renderLexical (`components/ui/RichText.tsx`)
- **Type**: Server-compatible (no client JS)
- **Purpose**: Recursively renders Lexical JSON nodes to React elements
- **Handles**: paragraph, heading (h1-h6), list (bullet/numbered), link, quote, code, upload, inline formatting (bold, italic, underline, strikethrough)

#### RevealOnScroll (`components/ui/RevealOnScroll.tsx`)
- **Type**: Client component
- **Behavior**: framer-motion scroll-triggered fade+slide-up animation with blur effect. "Once" mode enabled. Custom cubic-bezier easing.

#### AnimatedText (`components/ui/AnimatedText.tsx`)
- **Type**: Client component
- **Behavior**: Word-by-word staggered fade-up animation on scroll. Wraps each word in a motion.span.

#### NewsletterForm (`components/ui/NewsletterForm.tsx`)
- **Type**: Client component
- **⚠️ Status**: Simulated MVP only — calls `setTimeout` for 800ms, then shows success. No backend integration.

#### StoreMap / LeafletMap (`components/ui/StoreMap.tsx`, `LeafletMap.tsx`)
- **Type**: Client component (dynamic import with SSR disabled)
- **Features**: Interactive Leaflet map with custom DivIcon markers, popups with store info/directions/WhatsApp, programmatic pan-to-store on selection
- **Tiles**: CartoDB Voyager (not Mapbox, despite .env.example)

### 5.4 shadcn/ui Components
All stock shadcn/ui components built on `@base-ui/react`:
- **badge.tsx** — Variants: default, secondary, destructive, outline, ghost, link
- **button.tsx** — Variants + sizes (default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg)
- **card.tsx** — Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- **breadcrumb.tsx** — Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis
- **select.tsx** — Select primitives (unused in current pages — SortSelect uses native `<select>`)

---

## 6. Feature Documentation

### 6.1 Multilingual / Dual-Language (next-intl)
- **Status**: ✅ Fully implemented across all pages
- **Detail**: See [Section 9 — Multilingual Documentation](#9-multilingual--localization-documentation)

### 6.2 Product Catalogue with Filtering
- **Status**: ✅ Functional
- **How it works**: URL search params drive all filtering (`?category=`, `?material=`, `?shape=`, `?gender=`). Filter options dynamically sourced from product data via `getProductFilterOptions()`. Hardcoded fallback categories for when CMS doesn't return data.
- **Sorting**: Three options via native `<select>` element. Now includes product price (since the `price` field was added to the schema).
- **⚠️ Note**: The `price` field was added to the CMS schema but existing products need price data to be populated for price sorting to function.

### 6.3 Search
- **Status**: ✅ Complete (Ctrl+K overlay)
- **How it works**: A `SearchDialog` component in the header shows a search overlay on click or <kbd>Ctrl+K</kbd> keyboard shortcut. It queries the CMS products API with a debounced `where[name][contains]` filter (300ms debounce). Results displayed as clickable links. Closes on Escape or clicking outside.
- **Limitations**: Searches only product names. No dedicated search results page.

### 6.4 Wishlist
- **Status**: ✅ Complete (localStorage-based)
- **How it works**: The `useWishlist` hook persists product IDs to localStorage. A heart toggle button on every `ProductCard` adds/removes items. The `/wishlist` page reads saved IDs, fetches full product data from the CMS, and displays them in a grid. Includes "Clear all" button.
- **Limitations**: Wishlist is device/browser-specific (not synced to account).

### 6.5 Product Marketplace Purchase Flow
- **Status**: ✅ Functional
- **How it works**: Products have `marketplaceLinks` array with platform/URL/inStock fields. Product detail page renders "Buy on Tokopedia"/"Buy on Shopee" buttons that open external links. Out-of-stock items show disabled button.

### 6.6 Contact / Inquiry Flow
- **Status**: ✅ Complete (CMS-backed form)
- **How it works**: Contact page provides information (WhatsApp, email, address) with links. The contact form (`ContactFormClient.tsx`) POSTs to the CMS `contact-submissions` collection with loading/success/error states. Form submissions are stored in the CMS admin panel for review.
- **Submission handling**: Posts to `/api/contact-submissions` (public create, admin read).

### 6.7 Newsletter Signup
- **Status**: ✅ Complete (CMS-backed)
- **How it works**: The `NewsletterForm` in the footer POSTs to the CMS `newsletter-subscribers` collection with loading/success/error states. Duplicate email addresses are rejected by the CMS (unique constraint on `email` field). Admin can view all subscribers in the CMS admin panel under Marketing → Newsletter Subscribers.

### 6.8 Store Locator with Map
- **Status**: ✅ Complete (including geolocation)
- **How it works**: CMS-managed store locations → Leaflet map with custom markers → popups with details → Google Maps directions link. Client-side text search filter. "Use my location" button uses `navigator.geolocation.getCurrentPosition()` with error handling for denied/timeout/unavailable states. On success, dispatches a custom `geolocate` event that centers the map on the user's position.

### 6.9 Mega Menu Navigation
- **Status**: ✅ Complete
- **How it works**: Hover-intent with 300ms delay. Four tabs (Eyewear hardcoded, Collections/Brands/Services from CMS). Animated overlay with link columns + campaign card.

### 6.10 Mobile Menu
- **Status**: ✅ Complete
- **How it works**: Right-side slide-in drawer with spring animation. Static navigation links. Backdrop overlay with blur.

### 6.11 Scroll-Aware Header
- **Status**: ✅ Complete
- **How it works**: framer-motion `useScroll` with hysteresis buffer (enter at 50px, exit at 20px). Frosted glass on scroll, height reduction, text color change.

### 6.12 Downloadable Assets / Brochure / Catalogue
- **Status**: ❌ Not implemented
- No downloadable catalogue or brochure functionality exists.

### 6.13 CMS Plugins
- **Audit Log**: ✅ Tracks all changes to major collections (products, brands, services, articles, FAQ, store locations, eyewear collections, users, testimonials)
- **Analytics**: ✅ Event tracking with aggregation jobs (BullMQ/Redis). Dashboard view in admin UI. Content-type aggregation, user activity aggregation, and old event pruning.

---

## 7. Content & Data Model Documentation

### 7.1 Product Data Shape

```
Product {
  id: number
  name: string (localized)
  slug: string (unique)
  sku: string (unique)
  description: Lexical richText (localized)
  category: relationship → categories
  brand: relationship → brands
  collections: relationship[] → eyewear-collections
  specs: {
    material: text (localized)
    shape: text (localized)
    color: text (localized)
    gender: select (men | women | unisex)
    lensWidthMm: number
    bridgeWidthMm: number
    templeLengthMm: number
  }
  images: {
    front: upload → media (required)
    side: upload → media (required)
    lifestyle: upload → media (optional)
    onFace: upload → media (optional)
  }
  status: {
    newArrival: checkbox
    featured: checkbox
    bestseller: checkbox
    available: checkbox
  }
  marketplaceLinks: [{
    platform: select (tokopedia | shopee | ruparupa)
    url: text
    inStock: checkbox
  }]
  relatedProducts: relationship[] → products
  relatedArticles: relationship[] → articles
}
```

### 7.2 Category Data Shape
```
Category {
  id: number
  name: text (localized)
  slug: text (unique)
  description: text (localized, optional)
  heroImage: upload → media (optional)
  merchandising: [MerchandisingBlock] (optional)
}
```

### 7.3 Brand Data Shape
```
Brand {
  id: number
  name: text (localized)
  slug: text (unique)
  history: Lexical richText (localized, optional)
  story: text (localized, optional)
  country: text (localized, optional)
  designPhilosophy: text (localized, optional)
  coverImage: upload → media (optional)
}
```

### 7.4 Collection Data Shape
```
EyewearCollection {
  id: number
  name: text (localized)
  slug: text (unique)
  description: text (localized, optional)
  coverImage: upload → media (optional)
}
```

### 7.5 Service Data Shape
```
Service {
  id: number
  name: text (localized)
  slug: text (unique)
  description: text (localized, optional)
  process: Lexical richText (localized, optional)
  duration: text (optional)
  pricing: text (optional)
  ctaLabel: text (optional)
  coverImage: upload → media (optional)
}
```

### 7.6 Article Data Shape
```
Article {
  id: number
  title: text (localized)
  slug: text (unique)
  author: relationship → users
  coverImage: upload → media (optional)
  excerpt: text (optional)
  content: Lexical richText
  publishedAt: date (optional)
  seo: {
    metaTitle: text (optional)
    metaDescription: text (optional)
    ogImage: upload → media (optional)
  }
}
```

### 7.7 Global Settings
```
SiteSettings {
  siteName: text (localized)
  siteTagline: text (localized, optional)
  contactEmail: email (optional)
  whatsapp: text (localized, optional)
  phone: text (optional)
  address: textarea (localized, optional)
  defaultOgImage: upload → media (optional)
  socialLinks: {
    twitter: text (optional)
    linkedin: text (optional)
    github: text (optional)
  }
}

SiteBanner {
  enabled: checkbox
  message: text (localized)
  link: text (optional)
  linkLabel: text (localized, optional)
}
```

### 7.8 Locale File Structure
Two JSON files at `web/messages/`:
- `en.json` (199 lines, ~6.4KB)
- `id.json` (199 lines, ~6.5KB)

**Namespaces used**:
| Namespace | Content |
|-----------|---------|
| `Header` | Menu, search, wishlist, language labels |
| `Navigation` | Products, brands, collections, services, articles, FAQ, stores, contact |
| `Common` | Loading, error, buyNow |
| `page.products` | Hero titles, meta, not found |
| `page.collections` | Hero, meta, shopTheEdit, product count, not found |
| `page.articles` | Hero, meta, not found, editorial team, journal |
| `page.brands` | Hero, meta, not found, global heritage, the collection |
| `page.services` | Hero, meta, process, not found, book consultation |
| `page.stores` | Hero, meta |
| `page.contact` | Hero, meta |
| `home` | Philosophy (title, body, 4 sub-sections), collections, journal, CTA |
| `footer` | Newsletter, shop, support, contact, links, trust markers |
| `catalogue` | Filters, sort options |
| `newsletter` | Placeholder, success, error |
| `product` | Badge labels |
| `service` | Process label |
| `notFound` | All not-found labels |

### 7.9 Content Architecture Assessment
- **⚠️ Product data**: The frontend's `Product` interface has a note: "Currently returning as stringified JSON from seed" — indicating seed data quality issues.
- **⚠️ No price field**: The product schema has no price field. The sort options reference price sorting, but there's nothing to sort by.
- **⚠️ Content separation**: Product content (CMS-managed, localized) and marketing copy (locale JSON files + CMS) are reasonably separated.
- **⚠️ Marketing images**: Several homepage components use fallback SVGs (`/campaign-fallback.svg`, `/brand-fallback.svg`) rather than CMS-sourced images.
- **⚠️ Static pages**: Privacy and Terms are hardcoded HTML in page components, not in CMS.

---

## 8. Navigation Documentation

### 8.1 Desktop Navbar Structure

```
[EYESOUL Logo (center)]
├── [Left: Eyewear] → Mega Menu: Optical, Sunglasses, Discover
├── [Left: Collections] → Mega Menu: CMS collections
├── [Left: Brands] → Mega Menu: CMS brands
├── [Left: Services] → Direct link to /services (mega menu shows on hover)
├── [Left: Journal] → Direct link to /articles
├── [Right: Globe icon + locale code] → Toggle language (en ↔ id)
└── [Right: "Store Locator" button] → /store-locator
```

### 8.2 Mobile Nav Drawer
```
[Menu header with close button]
├── Optical → /products?category=frames
├── Sunglasses → /products?category=sunglasses
├── Collections → /collections
├── Brands → /brands
├── Services → /services
├── Journal → /articles
└── [Footer section]
    ├── [Store Locator button] → /store-locator
    ├── FAQ & Support → /faq
    └── Contact → /contact
```

### 8.3 Footer Navigation
```
[4-column layout]
├── Brand Column: Logo + tagline + social links
├── Shop: Optical Frames, Sunglasses, All Collections
├── Support: FAQ, Repairs & Warranty, Contact, Store Locator
└── Contact: Address, Email, Phone
│
└── Bottom Bar: © Eyesoul | Zeiss Partner · Secure Checkout | Privacy Policy, Terms of Service
```

### 8.4 Navigation Configuration
- **Desktop links**: Hardcoded in `Header.tsx` as JSX elements
- **Mega menu content**: Mix of hardcoded ("Eyewear" tab links) and CMS-driven (Collections, Brands, Services tabs)
- **Mobile links**: Hardcoded in `MobileMenuDrawer.tsx`
- **Footer links**: Hardcoded in `Footer.tsx` with some dynamic data from `SiteSettings`
- **⚠️ No centralized nav config**: Navigation items are scattered across three components with no single source of truth

### 8.5 Navigation Gaps
1. **No catch-all breadcrumb system**: Products page has no breadcrumb despite `breadcrumb.tsx` being in the project
2. **Mega menu "Eyewear" tab is hardcoded** — new product categories require code changes
3. **Mobile menu doesn't show services** (unlike desktop mega menu)
4. **No "Back" navigation on list pages** (except services detail)
5. **Sitemap is static** — only lists hardcoded routes, no CMS content pages included

---

## 9. Multilingual / Localization Documentation

### 9.1 How Language Switching Works
1. **Middleware** (`src/middleware.ts`) via `next-intl/middleware` detects/prepends locale
2. **Locale route group** `/[locale]` wraps all pages
3. **Routing config** (`src/i18n/routing.ts`): supports `['en', 'id']`, default `en`
4. **Locale switcher**: In the header, a globe icon toggles between `en` and `id` using `usePathname` + `Link` with `locale` prop
5. **Message loading** (`src/i18n/request.ts`): Loads `messages/{locale}.json` dynamically

### 9.2 What Is Localized
| Area | Localization Status |
|------|-------------------|
| Page hero titles/subtitles | ✅ Via locale JSON + CMS localized fields |
| Navigation labels | ✅ Via `Navigation` namespace |
| Homepage marketing copy | ✅ Via `home` namespace (philosophy, collections, journal, CTA) |
| Meta titles/descriptions | ✅ Per-page via locale JSON |
| Footer content | ✅ Via `footer` namespace |
| Catalogue/sort/filter labels | ✅ Via `catalogue` namespace |
| Newsletter/badge labels | ✅ Via `newsletter` and `product` namespaces |
| Product names | ✅ CMS localized field |
| Product descriptions | ✅ CMS localized richText |
| Category/brand/collection names | ✅ CMS localized fields |
| Service names/descriptions | ✅ CMS localized fields |
| FAQ content | ✅ CMS localized fields |
| Site settings | ✅ CMS localized globals |
| Site banner message | ✅ CMS localized global |
| **Privacy policy** | ❌ Hardcoded English only |
| **Terms of service** | ❌ Hardcoded English only |
| **Contact form labels** | ❌ Hardcoded English |
| **FAQ page heading/subtitle** | ❌ Hardcoded English |
| **Not found page** | ❌ Hardcoded English |

### 9.3 How Localized Content Is Consumed
- **Server components**: `getTranslations({ locale, namespace })` from `next-intl/server`
- **Client components**: `useTranslations('namespace')` from `next-intl`
- **CMS localized fields**: Automatically returned in the correct locale via `?locale=en|id` query parameter in the REST API
- **CMS locale fallback**: Enabled in `payload.config.ts` (`fallback: true`) — if a field has no translation, it falls back to the default locale (English)

### 9.4 ⚠️ Localization Inconsistencies
1. **Hardcoded English strings**: Privacy, Terms, FAQ heading, not-found page, contact form labels are all hardcoded in English
2. **Locale JSON key gaps**: The `Navigation` namespace is used by both `getTranslations('Navigation')` and `useTranslations('Navigation')`, but some components use hardcoded English strings (e.g., "Journal" in Header.tsx)
3. **PageHero subtitle**: The subtitle is passed as a prop from page components, so it uses the correct locale JSON. But the FAQ page's heading and description are hardcoded.
4. **No locale-aware date formatting on all date instances**: Article detail uses `toLocaleDateString` with correct locale, but other date displays should be verified.

---

## 10. Styling / Design System Documentation

### 10.1 Tailwind CSS v4 Setup
- **Configuration**: Tailwind v4 via PostCSS (`postcss.config.mjs`), no `tailwind.config.js`
- **CSS Imports** (`globals.css`):
  - `@import "tailwindcss"` — Tailwind v4 base
  - `@import "tw-animate-css"` — shadcn animation utilities
  - `@import "shadcn/tailwind.css"` — shadcn theme variables
- **Custom theme**: CSS variables defined in `@theme inline {}` block for all standard shadcn tokens
- **Fonts**: Inter (sans, variable), Outfit (heading/display, variable)
- **Design tokens**: OKLCH color space, monochrome palette (off-white to rich charcoal)

### 10.2 CSS Architecture
- **`globals.css`** is the only CSS file
- **Component styles** use Tailwind utility classes inline (no CSS modules or styled-components)
- **Custom `container` class**: Max-width 1440px, responsive padding (6/12/20 rem)
- **Base layer**: Global styles for border, body, selection
- **Dark mode**: Supported via `.dark` class with CSS variables (not actively used — site appears to be light-mode only in current implementation)

### 10.3 Spacing & Typography Patterns
- **Vertical rhythm**: Sections use `py-16` to `py-24` (64–96px), sometimes `py-32` (128px)
- **Horizontal padding**: `container` class with `px-6 md:px-12 lg:px-20`
- **Heading font**: `font-display` (Outfit) with `font-light` or `font-medium`, tight tracking
- **Body text**: `font-sans` (Inter), sizes `text-sm` to `text-lg`
- **Uppercase labels**: `text-xs font-medium tracking-widest uppercase` pattern used consistently

### 10.4 Animation Patterns
- **RevealOnScroll**: Standard fade-up + blur animation, `duration: 1.2`, custom ease `[0.16, 1, 0.3, 1]`
- **AnimatedText**: Word-by-word staggered fade-up animation
- **PageHero**: Background image zoom with opacity transition (`duration: 1.5`)
- **MegaMenu**: Blur + opacity + y transition with staggered children
- **Hover effects**: Image scale (105%), button background transitions, underline animations
- **Card transitions**: `group-hover` patterns for reveal effects (CTA buttons, image zoom)

### 10.5 Responsive Strategy
- **Mobile-first** with `md:` and `lg:` breakpoints
- **Navigation**: Desktop (sticky header + mega menu) vs mobile (slide-in drawer)
- **Grids**: `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3` pattern
- **Homepage**: Special bento/asymmetrical layouts with `lg:col-span-*` overrides
- **Store locator**: Column layout reversed on mobile (map on top, list below)

### 10.6 ⚠️ Styling Issues / Observations
1. **No design token documentation** — All tokens are in CSS variables but not documented as a design system
2. **No shared color palette beyond CSS variables** — No semantic color tokens for brand-specific colors
3. **Typographic scale is implicit** — No documented scale, sizes are applied ad-hoc
4. **Inconsistent section spacing** — Some sections use `py-16`, others `py-24`, homepage uses varying spacing
5. **Line clamp usage** — Several components use `line-clamp-2` or `line-clamp-3` for text truncation, but these are applied inconsistently

---

## 11. Current Issues / Risks / Inconsistencies

### 🔴 High Severity

| ID | Issue | Area | Status |
|----|-------|------|--------|
| ~~H1~~ | ~~**No price field in product schema**~~ | Products | ✅ Fixed — `price` field added to CMS schema, displayed on ProductCard |
| ~~H2~~ | ~~**Contact form has no backend**~~ | Contact | ✅ Fixed — `ContactFormClient` POSTs to CMS `contact-submissions` collection |
| ~~H3~~ | ~~**Newsletter signup is simulated**~~ | Newsletter | ✅ Fixed — `NewsletterForm` POSTs to CMS `newsletter-subscribers` collection |
| H4 | **Hardcoded privacy/terms pages** | Pages | 🔴 Still open — legal pages are hardcoded HTML in English only |

### 🟡 Medium Severity

| ID | Issue | Area | Status |
|----|-------|------|--------|
| M1 | **Hardcoded mega menu "Eyewear" tab** | Navigation | 🟡 Mitigated — nav config centralized in `lib/navigation.ts`; still uses hardcoded link structure but now in one place |
| M2 | ~~**Service hero images hardcoded by slug**~~ | Services | ✅ Fixed — `heroImage` field added to CMS; frontend uses CMS image with slug-based Unsplash fallback |
| M3 | ~~**EditorialHero uses fallback SVGs**~~ | Homepage | 🟡 Still open — images in BrandBentoGrid and final CTA still use fallback SVGs |
| ~~M4~~ | ~~**No search functionality**~~ | Feature | ✅ Fixed — SearchDialog with Ctrl+K; debounced CMS query |
| ~~M5~~ | ~~**No wishlist functionality**~~ | Feature | ✅ Fixed — localStorage `useWishlist` hook + heart toggle + `/wishlist` page |
| M6 | **Category slug fragility** | Products | 🟡 Still open — uses `where[category.slug][equals]` for filtering |
| ~~M7~~ | ~~**Geolocation "coming soon" alert**~~ | Store Locator | ✅ Fixed — uses `navigator.geolocation.getCurrentPosition()` with error handling |
| ~~M8~~ | ~~**Navigation not centralized**~~ | Architecture | ✅ Fixed — `lib/navigation.ts` consumed by Header, MobileMenuDrawer, Footer |

### 🟢 Low Severity

| ID | Issue | Area | Explanation |
|----|-------|------|-------------|
| L1 | **HeroCarousel component unused** | Dead Code | `HeroCarousel.tsx` exists but is not used anywhere. The home page uses `EditorialHero` instead. Either component is deprecated or intended for future use. |
| L2 | **PromoBanner component unused** | Dead Code | `PromoBanner.tsx` exists but is not imported or used on any page. |
| L3 | **S3 storage commented out** | CMS | The `s3Storage` plugin in `payload.config.ts` is commented out. Media is stored on local filesystem. Not a bug, but the config is misleading. |
| L4 | **.env.example references Mapbox** | Config | The env example mentions Mapbox token, but the implementation uses OpenStreetMap tiles via Leaflet. |
| L5 | **README.md is generic create-next-app boilerplate** | Documentation | The `web/README.md` provides no useful project information. The `CMS/README.md` is excellent and detailed. |
| L6 | **breadcrumb.tsx exists but is unused** | Dead Code | A full shadcn Breadcrumb component set exists but no page currently uses it. |
| L7 | **Locale file for "notFound" namespace** | i18n | The `notFound` namespace exists in locale files (with keys for page, product, brand, collection, article, service) but the actual 404 Not Found component uses hardcoded English text. |
| L8 | **Some home page strings not in locale files** | i18n | "Bespoke Services" heading in ServiceCards, "Client Experiences" in TestimonialCarousel, and "Iconic Frames"/subtitle in HorizontalProductSlider use hardcoded English defaults. |

---

## 12. Development Guidance for Future Contributors

### Where to Add New Pages
1. Create a new directory under `web/src/app/[locale]/` with your route name
2. Create a `page.tsx` file (server component by default)
3. Use `params` with `Promise<{ locale: string }>` pattern (Next.js 16 convention)
4. Import `getTranslations({ locale, namespace })` for i18n
5. Add metadata via `generateMetadata()` export
6. Add the route to the sitemap in `web/src/app/sitemap.ts`
7. Add translation keys to both `messages/en.json` and `messages/id.json`

### Where to Add/Update Navigation Items
Currently, navigation changes require editing multiple files:
1. **Desktop mega menu**: `Header.tsx` (nav links) + `MegaMenu.tsx` (tab content)
2. **Mobile drawer**: `MobileMenuDrawer.tsx` (links array)
3. **Footer**: `Footer.tsx` (shop/support link sections)
4. **Translation keys**: Both `messages/en.json` and `messages/id.json` (Navigation namespace)

**⚠️ No centralized nav config exists.** Consider creating one before expanding navigation.

### Where to Add New Catalogue Categories/Products
1. **CMS**: Log into admin (`/admin`), add categories in `Categories` collection, add products in `Products` collection
2. **No frontend code changes needed** — the Products page dynamically fetches categories and products from CMS
3. **Exception**: If you add a new category that should appear in the mega menu's "Eyewear" tab, you must update `MegaMenu.tsx` (the hardcoded links)

### Where to Update Marketing Content
- **Homepage marketing text**: `messages/{locale}.json` under the `home` namespace
- **CMS-managed content**: Log into admin to update banners, collections, testimonials, articles, promotions
- **Page hero titles/subtitles**: `messages/{locale}.json` under the `page.*` namespace
- **Footer/global content**: `messages/{locale}.json` under `footer` namespace, or CMS globals for site settings

### How to Add Multilingual Strings/Content
1. Add the key to both `web/messages/en.json` and `web/messages/id.json` under the appropriate namespace
2. In a server component, use: `const t = await getTranslations({ locale, namespace: 'yourNamespace' })`
3. In a client component, use: `const t = useTranslations('yourNamespace')`
4. For CMS localized fields, ensure the field has `localized: true` in the collection config

### How to Extend Shared Components Safely
1. **PageHero**: Accepts `title`, `subtitle`, `imageUrl`, `imageAlt`, `align`, `overlayOpacity`, `height` — the most standardized component in the project
2. **CatalogueGrid**: Accepts `products` and optional `merchandisingBlocks` — handles empty state and interleaves merchandising content
3. **ProductCard**: Accepts `product` — image swap, badge system, and text display are encapsulated
4. **RevealOnScroll** / **AnimatedText**: Standard animation wrappers — use for consistent scroll-triggered animations
5. **Button** / **Badge** / **Card**: Use these shadcn components for UI consistency
6. **Never** modify shadcn source files — extend them via composition instead

### Areas to Approach Carefully
1. **Header layout**: The sticky header has complex scroll-aware layout compensation (`-mt-[96px]` in page wrappers, `h-[96px]` in header). Changing header height requires adjusting ALL pages that use `PageHero`.
2. **Filter system**: URL-based filters mean all filter state is in search params. Adding new filter dimensions requires updating both the frontend FilterSidebar and the backend query builder.
3. **Price feature**: If adding prices, the entire Product schema needs a price field, the sort logic needs implementation, and marketplace links might need reconsideration.
4. **Contact form**: If making it functional, decide on destination (email API, CRM webhook, CMS form submissions collection).
5. **CMS blocks**: The Pages collection supports blocks (Hero, CTA, FeatureGrid, RichTextSection) but the frontend `[slug]` page only renders RichText. If blocks become needed, the GenericPage component will need significant expansion.

---

## 13. Recommended Documentation Files

Based on the current project state, the following documentation files should exist in the repository:

| File | Priority | Contents |
|------|----------|---------|
| **`/web/README.md`** | 🔴 **Replace** | Currently contains generic create-next-app boilerplate. Should be replaced with project-specific setup instructions (install, env vars, local dev, architecture overview). |
| **`/PROJECT_ARCHITECTURE.md`** | ✅ This document | Complete architecture reference. |
| **`/web/CONTENT_MODEL.md`** | 🟡 Create | Product, Category, Brand, Collection, Service, Article, and SiteSettings data models with field descriptions, localization status, and relationships. Useful for content editors and API consumers. |
| **`/web/NAVIGATION_GUIDE.md`** | 🟢 Create | Map of all navigation components, where links are defined, and how to add/edit navigation items. Essential for anyone modifying headers/footers/menus. |
| **`/web/MULTILINGUAL_GUIDE.md`** | 🟡 Create | Guide for translators: which files to edit, how namespaces work, which parts of the site are/aren't translated, how to add new languages. |
| **`/web/FEATURES.md`** | 🟢 Create | Inventory of all features (search, filters, wishlist, newsletter, store locator, etc.) with implementation status and dependencies. Helps prioritize development. |
| **`/web/KNOWN_ISSUES.md`** | 🟡 Create | Living document tracking known issues, technical debt, and improvement opportunities (can be extracted from Section 11). |

### Consolidation Suggestion
This single `PROJECT_ARCHITECTURE.md` document covers all the areas listed above. If the project grows, consider splitting into separate files:
- `/web/CONTENT_MODEL.md` ← Extract from Section 7
- `/web/NAVIGATION_GUIDE.md` ← Extract from Section 8
- `/web/MULTILINGUAL_GUIDE.md` ← Extract from Section 9
- `/web/KNOWN_ISSUES.md` ← Extract from Section 11
- `/web/FEATURES.md` ← Extract from Section 6

---

## 14. Optional Refactor / Improvement Notes

### Highest-Value Improvements (Priority Order)

#### P1: Wire Missing Backends
- **Contact form**: Connect to an email service, CRM webhook, or create a CMS form submissions collection
- **Newsletter**: Connect to a mailing service (Mailchimp, SendGrid, etc.)
- **Geolocation**: Implement browser geolocation API for "Use my location"

#### P2: Add Product Pricing
- Add a `price` field (number, localized) to the Products collection
- Display price on product cards and detail pages
- Enable proper price sorting (currently non-functional)

#### P3: Centralize Navigation Configuration
- Create a single navigation config object or CMS-managed navigation
- All components (Header, Footer, MobileMenu, MegaMenu) consume from one source
- Eliminates the need to edit 3-4 files for a single nav change

#### P4: Localize All Hardcoded Strings
- Privacy Policy → CMS-managed page or locale file
- Terms of Service → CMS-managed page or locale file
- FAQ page heading/subtitle → locale file
- 404 page → locale file
- Contact form labels → locale file
- "Bespoke Services" / "Client Experiences" / "Iconic Frames" → locale file keys

#### P5: Refactor Mega Menu Category Links
- Replace hardcoded "Eyewear" tab links with CMS-driven category data
- This makes the mega menu fully dynamic and eliminates a code-change requirement for new categories

#### P6: Use Real Images in Homepage Components
- Replace fallback SVGs in BrandBentoGrid and final CTA with CMS-managed uploads
- Add image fields to relevant CMS collections (or use the existing banners/promotions)

---

> **Document generated from actual codebase analysis.**
>  
> For questions about this documentation, contact the project lead.
