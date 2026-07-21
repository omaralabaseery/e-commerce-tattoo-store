-- Editable store settings (key/value), managed from the admin dashboard.
CREATE TABLE store_settings (
    key        VARCHAR(64) PRIMARY KEY,
    value      TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
