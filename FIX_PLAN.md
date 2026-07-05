# Eyesoul Brand — Fix Plan

> **Status: ✅ COMPLETED — July 2026**
> 
> All 7 phases have been implemented. See `PROJECT_ARCHITECTURE.md` Section 11 for remaining open issues.
> Build verification: `npm run lint` → 0 errors, `npm run build` → ✓ passes.

---

## Execution Summary

Each phase has:
- **Scope** — what files/areas are affected
- **Pre-flight** — what to check *before* starting
- **Steps** — concrete code changes
- **Verification** — how to confirm it worked without breaking anything
- **Rollback** — how to revert if something goes wrong

---

## Phase 1: Dead Code Removal & Housekeeping

**Goal**: Clean up unused components, unused imports, and lint warnings. Zero behavioral change.

### Scope
| Step | File | Change |
|------|------|--------|
| 1.1 | `src/components/home/HeroCarousel.tsx` | Delete file (unused — `EditorialHero` is the active hero) |
| 1.2 | `src/components/home/PromoBanner.tsx` | Delete file (unused — no page imports it) |
| 1.3 | `src/components/layout/Footer.tsx` | Remove unused `Button` import (line 6) |
| 1.4 | `src/components/layout/MobileMenuDrawer.tsx` | Remove unused props: `brands`, `collections`, `categories`, and the `Brand`/`EyewearCollection`/`Category` type imports |
| 1.5 | `src/components/home/ServiceCards.tsx` | Remove unused `index` param from `getServiceIcon` signature |
| 1.6 | `src/lib/cms/stores.ts` | Prefix `error` with underscore (`_error`) in catch clause |
| 1.7 | `src/app/[locale]/layout.tsx` | Remove `getServices` fetch + `services` prop from Header (currently unused by Header) |

### Pre-flight
- [ ] Confirm `HeroCarousel` is **not** imported anywhere: `grep -r "HeroCarousel" src/`
- [ ] Confirm `PromoBanner` is **not** imported anywhere: `grep -r "PromoBanner" src/`
- [ ] Confirm Header `services` prop isn't used internally
- [ ] Run `npm run lint` and note the 26 warnings as baseline

### Verification
```bash
npm run lint         # Expect 0 errors, warnings should drop from 26 to ~18
npm run build        # Must pass with zero errors
```

### Rollback
Restore deleted files from git: `git checkout -- src/components/home/HeroCarousel.tsx src/components/home/PromoBanner.tsx`

---

## Phase 2: Hardcoded English → Localized Content

**Goal**: Move all hardcoded English strings into locale JSON files. No UI changes, just plumbing.

### Scope
| Step | File | Change |
|------|------|--------|
| 2.1 | `messages/en.json` + `messages/id.json` | Add new keys under existing namespaces for all hardcoded strings |
| 2.2 | `src/app/[locale]/faq/page.tsx` | Replace hardcoded heading + subtitle with `getTranslations({ namespace: 'page.faq' })` |
| 2.3 | `src/app/[locale]/not-found.tsx` | Replace "The page you're looking for..." and "Back to Home" with locale keys |
| 2.4 | `src/app/[locale]/contact/page.tsx` | Replace hardcoded form labels, heading, paragraph with locale keys |
| 2.5 | `src/app/[locale]/privacy/page.tsx` | **Option A**: Move content to CMS `pages` collection, or **Option B**: Add locale JSON keys for each section |
| 2.6 | `src/app/[locale]/terms/page.tsx` | Same as 2.5 |
| 2.7 | `src/components/home/ServiceCards.tsx` | Replace "Bespoke Services" hardcoded string with locale key |
| 2.8 | `src/components/home/TestimonialCarousel.tsx` | Replace "Client Experiences" → locale key |
| 2.9 | `src/components/home/HorizontalProductSlider.tsx` | Replace default `title`/`subtitle` props with locale key usage |
| 2.10 | `src/components/layout/Header.tsx` | Replace hardcoded "Eyewear" and "Journal" strings with `t()` calls |
| 2.11 | `src/components/layout/MobileMenuDrawer.tsx` | Replace hardcoded "Optical", "Sunglasses", "Journal" with `t()` calls |
| 2.12 | `src/components/layout/MegaMenu.tsx` | Replace hardcoded tab section titles ("Optical", "Sunglasses", "Discover", etc.) with locale keys |

### New locale keys needed
```
page.faq.hero.title
page.faq.hero.subtitle
page.notFound.title
page.notFound.body
page.notFound.backToHome
page.contact.form.heading
page.contact.form.firstName
page.contact.form.lastName
page.contact.form.email
page.contact.form.subject
page.contact.form.message
page.contact.form.submit
page.contact.form.subjectOptions.general
page.contact.form.subjectOptions.order
page.contact.form.subjectOptions.exam
page.contact.form.subjectOptions.repairs
home.services.title
home.testimonials.title
home.featuredProducts.title
home.featuredProducts.subtitle
navigation.eyewear
navigation.journal
navigation.optical
navigation.sunglasses
navigation.discover
megaMenu.optical.*
megaMenu.sunglasses.*
megaMenu.discover.*
```

### Pre-flight
- [ ] Audit all hardcoded English strings (reference Section 9.4 of architecture doc)
- [ ] Ensure both locale files (`en.json`, `id.json`) stay in sync — same keys, translated values

### Verification
```bash
npm run build        # Must pass
# Manual: Visit each modified page in both EN and ID locales, confirm text appears translated
```

### Rollback
Revert locale file changes and component changes separately. Each step is small.

---

## Phase 3: Wire Backend Features

**Goal**: Turn simulated/fake features into real working functionality.

### 3A — Newsletter Form

| Step | File | Change |
|------|------|--------|
| 3A.1 | CMS | Create a `NewsletterSubscribers` collection (`email: text required unique`, `subscribedAt: date`, `source: text`) |
| 3A.2 | CMS | Set `access.read: isAdmin`, `access.create: isPublic` (so the form can POST) |
| 3A.3 | `web/src/components/ui/NewsletterForm.tsx` | Replace `setTimeout` mock with `POST /api/newsletter-subscribers` fetch |
| 3A.4 | `web/src/lib/cms/types.ts` | Add `NewsletterSubscriber` interface (optional — only if used on frontend) |

### 3B — Contact Form

| Step | File | Change |
|------|------|--------|
| 3B.1 | CMS | Create `ContactSubmissions` collection (`firstName`, `lastName`, `email`, `subject`, `message`, `createdAt`) |
| 3B.2 | CMS | Set `access` same as newsletter — public create, admin read |
| 3B.3 | `web/src/app/[locale]/contact/page.tsx` | Convert the form from static HTML to a client component with `useState` / form handling |
| 3B.4 | Same file | Add `POST /api/contact-submissions` on submit, with loading/success/error states |
| 3B.5 | Same file | Localize all form labels (already covered in Phase 2) |
| 3B.6 | Same file | Add `name` attributes to form inputs so Payload can parse them |

**Design decision**: Option A (above) stores submissions in Payload. Option B uses a third-party service (Formspree, Web3Forms, etc.). Option A is recommended because Payload is already running and it keeps data in-house.

### 3C — Store Locator Geolocation

| Step | File | Change |
|------|------|--------|
| 3C.1 | `StoreLocatorClient.tsx` | Replace `alert("Geolocation feature coming soon!")` with `navigator.geolocation.getCurrentPosition()` |
| 3C.2 | Same file | On success, center map on user's location (use `setActiveStoreId(null)` + programmatic map pan) |
| 3C.3 | Same file | Add `useGeolocation` state: `"idle" | "loading" | "denied" | "unavailable"` |
| 3C.4 | Same file | Handle errors: permission denied, timeout, unavailable |

### Verification (Phase 3)
```bash
npm run build
# Manual:
# - Submit newsletter → check CMS admin for new entry
# - Submit contact form → check CMS admin for new entry
# - Click "Use my location" → browser prompt → map centers on your location
```

### Rollback
Revert individual file changes. CMS collections can be removed via Payload admin.

---

## Phase 4: Centralized Navigation

**Goal**: Single source of truth for all navigation items.

### Approach
Create a `NAV_ITEMS` config object that all navigation components consume.

| Step | File | Change |
|------|------|--------|
| 4.1 | `web/src/lib/navigation.ts` (new) | Create centralized nav config with sections, labels, hrefs, and visibility flags |
| 4.2 | `web/src/components/layout/Header.tsx` | Import nav config for desktop nav links instead of hardcoded `<div>`/`<Link>` elements |
| 4.3 | `web/src/components/layout/MegaMenu.tsx` | Replace hardcoded "Eyewear" tab links with nav config + CMS-driven category fetch |
| 4.4 | `web/src/components/layout/MobileMenuDrawer.tsx` | Replace hardcoded `links` array with nav config import |
| 4.5 | `web/src/components/layout/Footer.tsx` | Replace hardcoded Shop/Support link arrays with nav config |

### Nav Config Shape
```typescript
// lib/navigation.ts
export interface NavItem {
  labelKey: string;        // locale key in Navigation namespace
  href: string;
  children?: NavItem[];    // for mega menu sub-links
  isCmsDriven?: boolean;   // true = fetch from CMS (categories, collections)
  cmsSlug?: string;        // when isCmsDriven, which CMS slug to query
  visibility: 'all' | 'desktop' | 'mobile' | 'footer';
}

export const MAIN_NAV: NavSection[] = [
  {
    id: 'eyewear',
    labelKey: 'navigation.eyewear',
    cmsDriven: true,       // fetch categories from CMS
    cmsCollection: 'categories',
    visibility: 'all',
  },
  {
    id: 'collections',
    labelKey: 'navigation.collections',
    href: '/collections',
    cmsDriven: true,       // fetch collections from CMS for mega menu
    cmsCollection: 'eyewear-collections',
    visibility: 'all',
  },
  // ... etc
];
```

### Verification
```bash
npm run build
# Manual: Visit every nav component in desktop + mobile + footer, confirm links match original behavior
```

### Rollback
Comment out the import and revert to hardcoded links. One commit per component for easy revert.

---

## Phase 5: CMS-Driven Mega Menu & Service Images

**Goal**: Remove remaining hardcoded content from MegaMenu and ServiceDetail.

### 5A — Mega Menu Eyewear Tab

| Step | File | Change |
|------|------|--------|
| 5A.1 | `MegaMenu.tsx` | In the `eyewear` tab, replace hardcoded columns with dynamic CMS category data |
| 5A.2 | Same file | Fetch categories grouped by type (frames, sunglasses) or use `category.name` as column titles |
| 5A.3 | Same file | Remove hardcoded campaign card for "Eyewear" tab (or make it use a CMS `homepage-banners` entry) |

### 5B — Service Detail Hero Images

| Step | File | Change |
|------|------|--------|
| 5B.1 | `cms/src/collections/Services.ts` | Add a `heroImage: upload → media` field (optional, existing `coverImage` could be reused) |
| 5B.2 | `web/src/app/[locale]/services/[slug]/page.tsx` | Replace hardcoded `heroImages` map with `getMediaUrl(service.coverImage)` or new heroImage field |
| 5B.3 | Same file | Add a fallback: if no image, use a default gradient or omit the hero image entirely |

### Verification
```bash
npm run build
# Manual:
# - Add a new category in CMS → see it appear in Mega Menu Eyewear tab
# - Add/edit a service with cover image → see correct hero image on service detail page
```

### Rollback
Revert MegaMenu changes. Keep service image fallback by preserving the old mapping behind a `||` fallback.

---

## Phase 6: Product Schema Enhancement

**Goal**: Add price field and make price sorting functional.

### Scope
| Step | File | Change |
|------|------|--------|
| 6.1 | `cms/src/collections/Products.ts` | Add `price` field: `type: 'number', required: false, localized: false` |
| 6.2 | Same file | Run `payload generate:types` to regenerate `payload-types.ts` |
| 6.3 | `cms` | Create a data migration or manual script to backfill prices (if available from marketplace data) |
| 6.4 | `web/src/lib/cms/types.ts` | Add `price?: number` to Product interface |
| 6.5 | `web/src/lib/cms/products.ts` | Verify `getProducts()` passes `sort` param to CMS API correctly — Payload should handle `sort=price` |
| 6.6 | `web/src/components/ui/ProductCard.tsx` | Add price display below product name (format with `Intl.NumberFormat` for locale) |
| 6.7 | `web/src/components/ui/ProductCard.tsx` | Add condition: only show price if `product.price` exists |

### Price Formatting
```typescript
// In ProductCard.tsx
{product.price && (
  <p className="text-sm font-medium">
    {new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: 'IDR',
    }).format(product.price)}
  </p>
)}
```

### Verification
```bash
npm run build
# Manual:
# - Add price to a product in CMS
# - Confirm price appears on product card
# - Confirm sort by price works on catalogue page
```

### Rollback
Revert `Products.ts` field addition via migration rollback. Revert frontend changes.

---

## Phase 7: Search & Wishlist (Optional / Future)

**Goal**: Implement basic search and wishlist features.

### 7A — Search

| Step | File | Change |
|------|------|--------|
| 7A.1 | CMS | Ensure products have proper search fields (name, description, specs are all text) |
| 7A.2 | `web/src/lib/cms/products.ts` | Add `search?: string` option to `getProducts()` — `where[name][contains]=${query}` |
| 7A.3 | `web/src/components/ui/SearchDialog.tsx` (new) | Create search dialog/overlay component with input + results dropdown |
| 7A.4 | `web/src/components/layout/Header.tsx` | Add search trigger button → opens SearchDialog |
| 7A.5 | `messages/en.json` + `id.json` | Add search-related translation keys |

### 7B — Wishlist

| Step | File | Change |
|------|------|--------|
| 7B.1 | `web/src/lib/hooks/useWishlist.ts` (new) | Create hook using `localStorage` for persistence (MVP approach) |
| 7B.2 | `web/src/components/ui/ProductCard.tsx` | Add wishlist toggle button (heart icon) |
| 7B.3 | `web/src/app/[locale]/wishlist/page.tsx` (new) | Create wishlist page showing saved products |
| 7B.4 | `messages/en.json` + `id.json` | Add wishlist translation keys |

### Verification
```bash
npm run build
# Manual:
# - Search for product by name → results appear
# - Add item to wishlist → appears on wishlist page
# - Refresh page → wishlist persists
```

---

## Summary of Priority & Effort

| Phase | Priority | Effort | Risk | Dependencies |
|-------|----------|--------|------|-------------|
| **1: Dead Code** | 🔴 Immediate | Small (30 min) | None — pure deletion | None |
| **2: Localize Hardcoded** | 🔴 High | Medium (2-3 hrs) | Low — only locale plumbing | Phase 1 (clean slate) |
| **3: Wire Backends** | 🔴 High | Medium (3-4 hrs) | Low — new CMS collections + fetch calls | None |
| **4: Nav Centralization** | 🟡 Medium | Large (4-6 hrs) | Medium — touches all nav components | Phase 1, Phase 2 |
| **5: CMS-Driven Content** | 🟡 Medium | Medium (2 hrs) | Low — replaces hardcoded data with CMS fields | Phase 4 (nav config) |
| **6: Product Pricing** | 🟡 Medium | Medium (2-3 hrs) | Low — new field + display | Phase 1 |
| **7: Search/Wishlist** | 🟢 Low | Large (6-8 hrs) | Medium — new features | Phase 1, Phase 6 |

---

## Verification Protocol (Every Phase)

After each phase, run this exact sequence:

```bash
# 1. Lint
cd web && npm run lint

# 2. TypeScript check
npx tsc --noEmit

# 3. Build
npm run build

# 4. Quick manual smoke test
# - Home page loads (both EN and ID)
# - Products page loads + filter works
# - One detail page per content type loads
# - Language switch works
# - Mobile menu opens/closes
```

If any step fails, stop, fix, and re-verify before proceeding to the next phase.

---

## Critical Regression Prevention Rules

1. **Never change a working API response shape** — Adding fields is safe; removing or renaming fields breaks the frontend
2. **Never delete a CMS collection without checking all frontend fetch calls** — Search for the collection slug in `web/src/lib/cms/*.ts`
3. **Never change the Header height** — The `-mt-[96px]` / `-mt-[128px]` negative margins in every page depend on exact header height. If the height changes, all pages break
4. **Never remove a translation key without checking all usages** — `grep -r "t('" src/` for client components and `getTranslations` for server components
5. **Always test both locales** after any string change — EN and ID must stay in sync
