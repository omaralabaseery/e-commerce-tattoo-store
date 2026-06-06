# Tattoo Store — API Reference

Base URL (dev): `http://localhost:8080`
Interactive docs (Swagger UI): `http://localhost:8080/swagger-ui.html`

All request/response bodies are JSON. Authenticated endpoints expect:
```
Authorization: Bearer <accessToken>
```
Guest cart/checkout uses an `X-Session-Id` header (any stable client-generated id).

Money is `NUMERIC(12,3)` (3 decimals, KWD).

---

## Authentication — `/api/auth`

| Method | Path                     | Auth | Body |
|--------|--------------------------|------|------|
| POST   | `/register`              | —    | `{ name, email, phone?, password }` |
| POST   | `/login`                 | —    | `{ email, password }` |
| POST   | `/refresh-token`         | —    | `{ refreshToken }` |
| POST   | `/logout`                | —    | `{ refreshToken }` |
| POST   | `/forgot-password`       | —    | `{ email }` |
| POST   | `/reset-password`        | —    | `{ token, newPassword }` |

`login`/`register`/`refresh-token` return:
```json
{
  "accessToken": "...", "refreshToken": "...", "tokenType": "Bearer",
  "user": { "id": 1, "name": "...", "email": "...", "role": "CUSTOMER" }
}
```

## Products (public) — `/api/products`

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/products` | Query: `categoryId, brandId, minPrice, maxPrice, inStock, minRating, search, sort, page, size`. `sort` ∈ `featured\|price_asc\|price_desc\|newest\|rating`. Returns a paged `ProductSummary`. |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/new-arrivals` | Latest 8 |
| GET | `/api/products/{slugOrId}` | Full `ProductResponse` |

## Categories & Brands (public)
| GET | `/api/categories` |
| GET | `/api/brands` |

## Cart — `/api/cart` (guest via `X-Session-Id`, or authenticated)
| GET | `/api/cart` |
| POST | `/api/cart/items` — `{ productId, quantity }` |
| PUT | `/api/cart/items/{id}` — `{ quantity }` |
| DELETE | `/api/cart/items/{id}` |
| DELETE | `/api/cart/clear` |

## Wishlist / Addresses (authenticated)
| GET/POST/PUT/DELETE | `/api/addresses[/{id}]` |

## Orders — `/api/orders`
| POST | `/api/orders` | Guest allowed. `{ customerName, customerPhone, customerEmail?, addressId?, paymentMethod, couponCode?, notes?, items:[{productId, quantity}] }` |
| GET | `/api/orders/my-orders` | Auth. Paged. |
| GET | `/api/orders/{id}` | Auth (owner). |

Order/payment status values:
- `order_status`: `PENDING, CONFIRMED, PROCESSING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURNED`
- `payment_status`: `PENDING, PAID, FAILED, REFUNDED`
- `payment_method`: `KNET, CARD, APPLE_PAY, COD`

## Payments — `/api/payments`
| POST | `/api/payments/create` | `{ orderId, returnUrl? }` → `{ transactionId, redirectUrl, status }` |
| POST | `/api/payments/webhook?provider=MOCK` | Provider callback (signature verified by gateway) |
| GET | `/api/payments/{orderId}` | Payments for an order |

---

## Admin (role/permission protected) — `/api/admin`

| Method | Path | Permission |
|--------|------|------------|
| GET/POST/PUT/DELETE/PATCH | `/api/admin/products[...]` | `PRODUCT_MANAGE` |
| POST/PUT/DELETE | `/api/admin/categories[...]` | `CATEGORY_MANAGE` |
| GET | `/api/admin/orders` (`?status=`) | `ORDER_MANAGE` |
| GET | `/api/admin/orders/{id}` | `ORDER_MANAGE` |
| PATCH | `/api/admin/orders/{id}/status` — `{ status }` | `ORDER_MANAGE` |
| POST | `/api/admin/orders/{id}/cancel` | `ORDER_MANAGE` |
| POST | `/api/admin/orders/{id}/refund` | `ORDER_MANAGE` |
| GET | `/api/admin/reports/overview` | `REPORT_VIEW` |
| GET | `/api/admin/reports/sales?days=30` | `REPORT_VIEW` |
| GET | `/api/admin/reports/orders` | `REPORT_VIEW` |
| GET | `/api/admin/reports/inventory` | `REPORT_VIEW` |

### Roles → permissions
- `SUPER_ADMIN`: all
- `ADMIN`: all except `ADMIN_USER_MANAGE`
- `INVENTORY_MANAGER`: `PRODUCT_MANAGE, INVENTORY_MANAGE, REPORT_VIEW`
- `ORDER_MANAGER`: `ORDER_MANAGE, PAYMENT_MANAGE, CUSTOMER_MANAGE, REPORT_VIEW`
- `SUPPORT_AGENT`: `ORDER_MANAGE, CUSTOMER_MANAGE`
- `CUSTOMER`: storefront only

## Error format
```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "message": "…", "fields": { "email": "must be a valid email" } }
```
