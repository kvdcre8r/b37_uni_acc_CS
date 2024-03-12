// imports for express and pg
const express = require("express");
const app = express();
const path = require("path");
const pg = require("pg");

// static routes
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_geek_supply_db"
);
app.use(express.json());
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

// app routes
app.get("/api/products", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * from products;
      `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

// init function
const init = async () => {
  await client.connect();
  const SQL = `
      DROP TABLE IF EXISTS products;
      CREATE TABLE products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        available BOOLEAN DEFAULT FALSE
      );
      INSERT INTO products(name, available) VALUES('computer mouse', true);
      INSERT INTO products(name, available) VALUES('scifi tumbler', true);
      INSERT INTO products(name) VALUES('2Tb usb drive');
    `;
  await client.query(SQL);
  console.log("data seeded");
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

// init function invocation
init();
