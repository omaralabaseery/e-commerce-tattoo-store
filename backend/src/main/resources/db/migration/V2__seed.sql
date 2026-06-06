-- =====================================================================
-- Seed reference data. (Users are seeded by DataInitializer so passwords
-- get hashed with the application's BCrypt encoder.)
-- =====================================================================

INSERT INTO roles (name) VALUES
    ('SUPER_ADMIN'), ('ADMIN'), ('INVENTORY_MANAGER'),
    ('ORDER_MANAGER'), ('SUPPORT_AGENT'), ('CUSTOMER');

INSERT INTO permissions (name) VALUES
    ('PRODUCT_MANAGE'), ('CATEGORY_MANAGE'), ('ORDER_MANAGE'),
    ('INVENTORY_MANAGE'), ('CUSTOMER_MANAGE'), ('PAYMENT_MANAGE'),
    ('COUPON_MANAGE'), ('REPORT_VIEW'), ('SETTINGS_MANAGE'), ('ADMIN_USER_MANAGE');

-- SUPER_ADMIN gets everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'SUPER_ADMIN';

-- ADMIN gets everything except admin-user management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'ADMIN' AND p.name <> 'ADMIN_USER_MANAGE';

-- INVENTORY_MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'INVENTORY_MANAGER' AND p.name IN ('PRODUCT_MANAGE','INVENTORY_MANAGE','REPORT_VIEW');

-- ORDER_MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'ORDER_MANAGER' AND p.name IN ('ORDER_MANAGE','PAYMENT_MANAGE','CUSTOMER_MANAGE','REPORT_VIEW');

-- SUPPORT_AGENT
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'SUPPORT_AGENT' AND p.name IN ('ORDER_MANAGE','CUSTOMER_MANAGE');

-- ---------- Categories ----------
INSERT INTO categories (name, slug, parent_id, image_url, status) VALUES
    ('Tattoo Machines',  'tattoo-machines',  NULL, '/images/categories/machines.jpg',  'ACTIVE'),
    ('Tattoo Ink',       'tattoo-ink',        NULL, '/images/categories/ink.jpg',       'ACTIVE'),
    ('Needles',          'tattoo-needles',    NULL, '/images/categories/needles.jpg',   'ACTIVE'),
    ('Cartridges',       'tattoo-cartridges', NULL, '/images/categories/cartridges.jpg','ACTIVE'),
    ('Power Supplies',   'power-supplies',    NULL, '/images/categories/power.jpg',     'ACTIVE'),
    ('Grips',            'grips',             NULL, '/images/categories/grips.jpg',     'ACTIVE'),
    ('Aftercare',        'aftercare',         NULL, '/images/categories/aftercare.jpg', 'ACTIVE'),
    ('Accessories',      'accessories',       NULL, '/images/categories/accessories.jpg','ACTIVE'),
    ('Bundles & Kits',   'bundles-kits',      NULL, '/images/categories/kits.jpg',      'ACTIVE');

-- ---------- Brands ----------
INSERT INTO brands (name, logo_url, status) VALUES
    ('Cheyenne', NULL, 'ACTIVE'),
    ('FK Irons', NULL, 'ACTIVE'),
    ('Eternal Ink', NULL, 'ACTIVE'),
    ('Dynamic', NULL, 'ACTIVE'),
    ('Kwadron', NULL, 'ACTIVE'),
    ('Critical', NULL, 'ACTIVE');

-- ---------- Products ----------
INSERT INTO products
    (name, slug, sku, description, short_description, category_id, brand_id,
     price, discount_price, stock_quantity, low_stock_limit, rating, status, is_featured)
VALUES
    ('Cheyenne Hawk Pen', 'cheyenne-hawk-pen', 'MCH-001',
     'Precision rotary pen machine trusted by professionals worldwide. Ergonomic, lightweight, and whisper-quiet.',
     'Professional rotary pen machine', 1, 1, 185.000, 169.000, 24, 5, 4.9, 'ACTIVE', true),
    ('FK Irons Spektra Flux', 'fk-irons-spektra-flux', 'MCH-002',
     'Wireless rotary machine with PowerBolt battery. Balanced, durable, and customizable give.',
     'Wireless rotary machine', 1, 2, 320.000, NULL, 12, 5, 4.8, 'ACTIVE', true),
    ('Eternal Ink — Black Onyx 4oz', 'eternal-ink-black-onyx', 'INK-001',
     'Industry-standard outlining black. Vegan, smooth, and consistent across skin tones.',
     'Premium outlining black ink', 2, 3, 22.000, 18.500, 80, 10, 4.9, 'ACTIVE', true),
    ('Dynamic Color Set — 12 Bottles', 'dynamic-color-set-12', 'INK-002',
     'A vivid 12-bottle color set for versatile work. Pre-dispersed and ready to use.',
     '12-bottle vivid color set', 2, 4, 95.000, 84.000, 30, 5, 4.7, 'ACTIVE', false),
    ('Kwadron Cartridges — 20pk (3RL)', 'kwadron-cartridges-3rl', 'CRT-001',
     'Medical-grade 3RL cartridges with membrane safety. Sterile, single-use.',
     'Sterile 3RL cartridges, 20pk', 4, 5, 28.000, NULL, 120, 20, 4.8, 'ACTIVE', true),
    ('Critical Power Supply CX-2', 'critical-power-cx2', 'PWR-001',
     'Dual-machine digital power supply with precise voltage control and a bright OLED display.',
     'Dual digital power supply', 5, 6, 240.000, 219.000, 18, 5, 4.9, 'ACTIVE', false),
    ('Disposable Grips — 25mm (10pk)', 'disposable-grips-25mm', 'GRP-001',
     'Comfortable disposable cartridge grips. Ergonomic, hygienic, single-use.',
     'Disposable cartridge grips, 10pk', 6, 6, 19.000, NULL, 60, 10, 4.6, 'ACTIVE', false),
    ('Aftercare Healing Balm 50ml', 'aftercare-healing-balm', 'AFT-001',
     'Vegan healing balm that soothes and protects fresh tattoos. Fragrance-free.',
     'Soothing vegan aftercare balm', 7, 3, 14.500, 11.900, 200, 20, 4.8, 'ACTIVE', true),
    ('Starter Artist Kit', 'starter-artist-kit', 'KIT-001',
     'Everything an apprentice needs to start: machine, power supply, cartridges, grips and aftercare.',
     'Complete beginner tattoo kit', 9, 2, 410.000, 369.000, 10, 3, 4.7, 'ACTIVE', true),
    ('Stainless Ink Cap Holder', 'stainless-ink-cap-holder', 'ACC-001',
     'Autoclavable stainless steel ink cap holder for a clean, organized workstation.',
     'Autoclavable ink cap holder', 8, 6, 24.000, NULL, 45, 10, 4.5, 'ACTIVE', false);

-- product images (placeholder paths; frontend ships fallbacks)
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, '/images/products/' || slug || '.jpg', 0 FROM products;

-- a few attributes
INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES
    (1, 'Stroke', '3.5mm'), (1, 'Weight', '120g'), (1, 'Type', 'Rotary Pen'),
    (3, 'Volume', '4oz'), (3, 'Vegan', 'Yes'),
    (5, 'Configuration', '3RL'), (5, 'Quantity', '20 pieces'), (5, 'Sterile', 'Yes, EO gas');

-- sample coupon
INSERT INTO coupons (code, type, value, min_order_amount, max_discount, usage_limit, status)
VALUES ('WELCOME10', 'PERCENTAGE', 10.000, 30.000, 20.000, 1000, 'ACTIVE');
