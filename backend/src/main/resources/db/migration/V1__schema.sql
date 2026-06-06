-- =====================================================================
-- Tattoo Store — initial schema
-- =====================================================================

-- ---------- Roles & permissions ----------
CREATE TABLE roles (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE permissions (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE role_permissions (
    role_id       BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ---------- Users ----------
CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,
    email         VARCHAR(180) NOT NULL UNIQUE,
    phone         VARCHAR(30),
    password_hash VARCHAR(255) NOT NULL,
    role_id       BIGINT NOT NULL REFERENCES roles(id),
    status        VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role_id);

-- ---------- Catalog: categories & brands ----------
CREATE TABLE categories (
    id        BIGSERIAL PRIMARY KEY,
    name      VARCHAR(150) NOT NULL,
    slug      VARCHAR(170) NOT NULL UNIQUE,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    status    VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug   ON categories(slug);

CREATE TABLE brands (
    id       BIGSERIAL PRIMARY KEY,
    name     VARCHAR(150) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    status   VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

-- ---------- Products ----------
CREATE TABLE products (
    id                BIGSERIAL PRIMARY KEY,
    name              VARCHAR(200) NOT NULL,
    slug              VARCHAR(220) NOT NULL UNIQUE,
    sku               VARCHAR(80) NOT NULL UNIQUE,
    description       TEXT,
    short_description VARCHAR(500),
    category_id       BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    brand_id          BIGINT REFERENCES brands(id) ON DELETE SET NULL,
    price             NUMERIC(12,3) NOT NULL,
    discount_price    NUMERIC(12,3),
    stock_quantity    INT NOT NULL DEFAULT 0,
    low_stock_limit   INT NOT NULL DEFAULT 5,
    rating            NUMERIC(2,1) NOT NULL DEFAULT 0,
    status            VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    is_featured       BOOLEAN NOT NULL DEFAULT false,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand    ON products(brand_id);
CREATE INDEX idx_products_status   ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price    ON products(price);

CREATE TABLE product_images (
    id         BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url  VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_product_images_product ON product_images(product_id);

CREATE TABLE product_attributes (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_name  VARCHAR(120) NOT NULL,
    attribute_value VARCHAR(300) NOT NULL
);
CREATE INDEX idx_product_attributes_product ON product_attributes(product_id);

-- ---------- Cart ----------
CREATE TABLE carts (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_carts_user    ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);

CREATE TABLE cart_items (
    id         BIGSERIAL PRIMARY KEY,
    cart_id    BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity   INT NOT NULL DEFAULT 1,
    price      NUMERIC(12,3) NOT NULL,
    UNIQUE (cart_id, product_id)
);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- ---------- Wishlist ----------
CREATE TABLE wishlist (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);

-- ---------- Addresses ----------
CREATE TABLE addresses (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name  VARCHAR(150) NOT NULL,
    phone      VARCHAR(30) NOT NULL,
    country    VARCHAR(80) NOT NULL DEFAULT 'Kuwait',
    city       VARCHAR(120),
    area       VARCHAR(120),
    block      VARCHAR(60),
    street     VARCHAR(120),
    building   VARCHAR(60),
    floor      VARCHAR(30),
    apartment  VARCHAR(30),
    notes      VARCHAR(300),
    is_default BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ---------- Coupons ----------
CREATE TABLE coupons (
    id               BIGSERIAL PRIMARY KEY,
    code             VARCHAR(60) NOT NULL UNIQUE,
    type             VARCHAR(20) NOT NULL,             -- PERCENTAGE | FIXED
    value            NUMERIC(12,3) NOT NULL,
    min_order_amount NUMERIC(12,3) NOT NULL DEFAULT 0,
    max_discount     NUMERIC(12,3),
    usage_limit      INT,
    used_count       INT NOT NULL DEFAULT 0,
    start_date       TIMESTAMPTZ,
    end_date         TIMESTAMPTZ,
    status           VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

-- ---------- Orders ----------
CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    order_number    VARCHAR(40) NOT NULL UNIQUE,
    user_id         BIGINT REFERENCES users(id) ON DELETE SET NULL,
    customer_name   VARCHAR(150) NOT NULL,
    customer_phone  VARCHAR(30) NOT NULL,
    customer_email  VARCHAR(180),
    address_id      BIGINT REFERENCES addresses(id) ON DELETE SET NULL,
    subtotal        NUMERIC(12,3) NOT NULL,
    discount_amount NUMERIC(12,3) NOT NULL DEFAULT 0,
    delivery_fee    NUMERIC(12,3) NOT NULL DEFAULT 0,
    total_amount    NUMERIC(12,3) NOT NULL,
    coupon_code     VARCHAR(60),
    payment_method  VARCHAR(30) NOT NULL,             -- KNET | CARD | APPLE_PAY | COD
    payment_status  VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    order_status    VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    notes           VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user    ON orders(user_id);
CREATE INDEX idx_orders_status  ON orders(order_status);
CREATE INDEX idx_orders_created ON orders(created_at);

CREATE TABLE order_items (
    id           BIGSERIAL PRIMARY KEY,
    order_id     BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id   BIGINT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    sku          VARCHAR(80),
    quantity     INT NOT NULL,
    unit_price   NUMERIC(12,3) NOT NULL,
    total_price  NUMERIC(12,3) NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ---------- Payments ----------
CREATE TABLE payments (
    id             BIGSERIAL PRIMARY KEY,
    order_id       BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(30) NOT NULL,
    transaction_id VARCHAR(120),
    amount         NUMERIC(12,3) NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    response_data  TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_txn   ON payments(transaction_id);

-- ---------- Inventory ----------
CREATE TABLE inventory_transactions (
    id           BIGSERIAL PRIMARY KEY,
    product_id   BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type         VARCHAR(20) NOT NULL,                -- STOCK_IN | STOCK_OUT | DAMAGED | RETURNED | ADJUSTMENT
    quantity     INT NOT NULL,
    reason       VARCHAR(300),
    reference_id BIGINT,
    created_by   BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inventory_product ON inventory_transactions(product_id);

-- ---------- Reviews ----------
CREATE TABLE reviews (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating     INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    VARCHAR(1000),
    status     VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- ---------- Admin audit log ----------
CREATE TABLE admin_logs (
    id          BIGSERIAL PRIMARY KEY,
    admin_id    BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(120) NOT NULL,
    entity_type VARCHAR(80),
    entity_id   BIGINT,
    details     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Refresh tokens ----------
CREATE TABLE refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
