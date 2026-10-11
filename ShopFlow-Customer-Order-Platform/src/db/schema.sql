CREATE TABLE IF NOT EXISTS products (
 id BIGSERIAL PRIMARY KEY, sku VARCHAR(64) NOT NULL UNIQUE, name VARCHAR(200) NOT NULL,
 description TEXT NOT NULL DEFAULT '', price_cents INTEGER NOT NULL CHECK(price_cents>=0),
 stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK(stock_quantity>=0),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS orders (
 id BIGSERIAL PRIMARY KEY, customer_name VARCHAR(160) NOT NULL, customer_email VARCHAR(254) NOT NULL,
 status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','shipped','delivered','cancelled')),
 total_cents INTEGER NOT NULL CHECK(total_cents>=0), idempotency_key VARCHAR(128) UNIQUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS order_items (
 id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 product_id BIGINT NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL CHECK(quantity>0),
 unit_price_cents INTEGER NOT NULL CHECK(unit_price_cents>=0), UNIQUE(order_id,product_id)
);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
INSERT INTO products(sku,name,description,price_cents,stock_quantity) VALUES
('KB-001','Mechanical Keyboard','Hot-swappable mechanical keyboard',7999,40),
('MS-001','Wireless Mouse','Ergonomic wireless mouse',2999,75),
('HD-001','USB-C Hub','Seven-port USB-C hub',4599,25),
('MN-001','24-inch Monitor','1080p IPS monitor',12999,18)
ON CONFLICT(sku) DO NOTHING;
