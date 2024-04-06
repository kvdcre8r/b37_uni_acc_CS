const SCHEMA = `
DROP TABLE IF EXISTS cart_products;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
CREATE TABLE products(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50),
  is_available BOOLEAN DEFAULT FALSE,
  qty INTEGER DEFAULT 0
);
CREATE TABLE users(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255), 
  is_admin BOOLEAN DEFAULT FALSE
);
CREATE TABLE carts(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  CONSTRAINT unique_user_cart UNIQUE (user_id) -- Unique constraint for user_id in carts
);
CREATE TABLE cart_products(
  cart_id UUID REFERENCES carts(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  qty INTEGER NOT NULL,
  CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id) -- Unique constraint for cart_id and product_id in cart_products
);
`;

module.exports = SCHEMA;