# Tattoo Store — E-commerce Platform

A premium, minimalist e-commerce platform specialized in professional tattoo supplies
(machines, ink, needles, cartridges, power supplies, grips, aftercare, kits).

> Design philosophy: clean, white, luxurious, fast — inspired by Apple / Stripe / Linear.
> Black & white palette, subtle floating animations, world-class UX.

## Tech Stack

| Layer        | Technology                                                        |
|--------------|-------------------------------------------------------------------|
| Frontend     | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion |
| Backend      | Spring Boot 3 · Java 17 · Spring Security · JWT · RBAC            |
| Database     | PostgreSQL 16 · Flyway migrations                                 |
| Payments     | Pluggable gateway abstraction (KNET / MyFatoorah / Stripe ready) + Cash on Delivery |
| Auth         | JWT access + refresh tokens, role-based access control            |
| Docs         | OpenAPI / Swagger UI                                              |

## Monorepo Layout

```
tattoo-store/
├── backend/            Spring Boot REST API
│   ├── src/main/java/com/tattoostore/
│   │   ├── config/         Security, CORS, OpenAPI
│   │   ├── security/       JWT filter, token service, user details
│   │   ├── entity/         JPA entities (mirrors DB schema)
│   │   ├── repository/     Spring Data JPA repositories
│   │   ├── service/        Business logic
│   │   ├── controller/     REST controllers (public + /admin)
│   │   ├── dto/            Request/response DTOs
│   │   ├── payment/        Payment gateway abstraction
│   │   └── exception/      Global error handling
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/   Flyway: V1__schema.sql, V2__seed.sql
├── frontend/           Next.js storefront + admin dashboard
│   └── src/
│       ├── app/            App Router pages (storefront + /admin)
│       ├── components/     UI components & sections
│       ├── lib/            API client, utils
│       └── data/           Mock data (until backend is wired)
├── docs/               API.md, ARCHITECTURE.md
└── docker-compose.yml  Postgres + backend + frontend
```

## Quick Start

### 1. Database + everything via Docker
```bash
docker compose up --build
```
- Frontend → http://localhost:3000
- Backend  → http://localhost:8080
- Swagger  → http://localhost:8080/swagger-ui.html
- Postgres → localhost:5432 (db: `tattoo_store`, user: `tattoo`, pass: `tattoo`)

### 2. Run locally (dev)

**Backend** (requires JDK 17+ and Maven 3.9+, or just use Docker above)
```bash
cd backend
mvn spring-boot:run           # needs a running Postgres (e.g. `docker compose up db`)
```

**Frontend**
```bash
cd frontend
npm install
npm run dev                   # http://localhost:3000
```
The frontend ships with mock data so it runs standalone. Set
`NEXT_PUBLIC_API_URL=http://localhost:8080` in `frontend/.env.local` to hit the real API.

## Default Seeded Accounts

| Role        | Email                  | Password    |
|-------------|------------------------|-------------|
| Super Admin | admin@tattoostore.com  | Admin@12345 |
| Customer    | customer@example.com   | Customer@12345 |

## Payments

The backend uses a `PaymentGateway` interface with a `MockPaymentGateway` implementation
out of the box. To go live, implement the interface for your provider
(KNET / MyFatoorah / Stripe) and register it — webhook handling and payment-status
tracking are already wired. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Safety & Compliance

Because this store sells regulated tattoo supplies (needles, inks, cartridges), the
storefront includes a Tattoo Safety Guide, Aftercare Guide, hygiene policy, product
usage disclaimers, and age-restriction notices. See the content pages under
`frontend/src/app/(content)`.
