# Architecture

## Overview

```
┌─────────────────┐        REST / JSON         ┌──────────────────────┐
│  Next.js (3000) │  ───────────────────────▶  │  Spring Boot (8080)  │
│  storefront +   │      JWT Bearer auth        │  controllers→services │
│  admin dashboard│  ◀───────────────────────  │  →repositories (JPA)  │
└─────────────────┘                             └──────────┬───────────┘
                                                           │ JDBC
                                                ┌──────────▼───────────┐
                                                │  PostgreSQL (5432)   │
                                                │  Flyway migrations   │
                                                └──────────────────────┘
```

## Backend layering

`controller` (HTTP, validation, auth) → `service` (business logic, `@Transactional`)
→ `repository` (Spring Data JPA) → `entity` (mirrors the SQL schema).

- **Security**: stateless JWT. `JwtAuthenticationFilter` validates the bearer token and
  populates the `SecurityContext`. `SecurityConfig` defines public vs. authenticated vs.
  admin routes; method-level `@PreAuthorize("hasAuthority('…')")` enforces RBAC on admin
  endpoints. Passwords hashed with BCrypt. Refresh tokens are persisted and revocable.
- **Validation**: Jakarta Bean Validation on request DTOs; `GlobalExceptionHandler`
  returns a consistent error envelope and maps domain errors via `ApiException`.
- **Migrations**: Flyway runs `V1__schema.sql` (tables + indexes) then `V2__seed.sql`
  (reference data). `DataInitializer` seeds the admin/customer users so passwords are
  hashed by the app's encoder. JPA is `ddl-auto: validate` — the schema is owned by Flyway.

## Payment abstraction

`PaymentGateway` is the seam between the app and any provider:

```
PaymentService ──▶ PaymentGateway (interface)
                     ├── MockPaymentGateway   (default, no credentials)
                     ├── KnetPaymentGateway   (implement)
                     ├── MyFatoorahGateway    (implement)
                     └── StripePaymentGateway (implement)
```

To integrate a real provider:
1. Implement `PaymentGateway` (`provider()`, `createPayment()`, `handleWebhook()`).
   Verify the webhook signature inside `handleWebhook` and return `signatureValid`.
2. Register it as a Spring bean. `PaymentService.resolveConfiguredProvider()` selects
   which provider to use for `KNET/CARD/APPLE_PAY`.
3. The webhook endpoint (`POST /api/payments/webhook?provider=…`) and payment-status
   tracking (`payments` table + `orders.payment_status`) are already wired.

`COD` (cash on delivery) skips the online session and stays `PENDING` until delivered.

## Frontend

- **Next.js App Router** with a storefront and an `/admin` dashboard. `StoreChrome`
  hides the storefront header/footer on admin routes.
- **State**: `zustand` stores for cart and wishlist, persisted to `localStorage`.
- **Data**: ships with mock data (`src/data`) so it runs without a backend. The
  `src/lib/api.ts` client targets `NEXT_PUBLIC_API_URL` when set.
- **Design system**: Tailwind tokens in `tailwind.config.ts` (white-dominant palette,
  16px card radius, soft shadows, premium easing). Framer Motion for fade-up, scroll
  reveal, card hover, the slide-out cart, and search modal. Count-up stats and Recharts
  in the dashboard.
- **Responsive**: 12-col content max 1280px; sticky header (transparent→glass on scroll);
  mobile bottom navigation; thumb-friendly controls.

## Performance & SEO

- Pagination on product/order lists; DB indexes on hot columns (slug, status, category,
  brand, price, order status/date).
- Per-page `metadata` (title templates, OpenGraph), `generateStaticParams` for product
  detail pages, lazy image fallbacks, skeleton/shimmer utilities.

## Security checklist

- JWT auth, BCrypt hashing, RBAC via authorities, CORS allow-list, stateless sessions,
  bean validation, parameterized JPA queries (no string SQL), webhook signature
  verification hook, secrets via env (`APP_JWT_SECRET`).
- Hardening TODO for production: rate limiting (e.g. Bucket4j/gateway), refresh-token
  rotation cleanup job, secure file-upload scanning, HTTPS termination, CSP headers.
