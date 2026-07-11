-- Wholesale (trade) price, managed and visible from the admin dashboard only.
ALTER TABLE products ADD COLUMN wholesale_price NUMERIC(12,3);
