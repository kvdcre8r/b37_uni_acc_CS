// import for express
const express = require("express");
//creating an instance of express && calling it app;
const app = express();

//import path module, to join directories
const path = require("path");

//CLIENT
const client = require('./client.js')

//SCHEMA
const SCHEMA = require('./schema.js')

//SEED FC
const seedDb = require('./seedDb.js');






//SERVICES
const {fetchUsers} = require('./service/userService.js');
const {fetchProducts} = require('./service/productService.js');

app.use(express.json());
app.use(require('morgan')('dev'));
// static routes
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

// app routes
app.get("/api/products", async (req, res, next) => {
  try {
    
    const productResponse = await fetchProducts();
    res.send(productResponse.rows);
  } catch (ex) {
    next(ex);
  }
});


app.get('/api/users', async (req, res,next) => {
  try{
      const userReponse = await fetchUsers();
      res.send(userReponse.rows);
  }catch (e) {
    next(ex)
  }
})


// init function
const init = async () => {
  await client.connect();
  //Create TABLES
  await client.query(SCHEMA);

  //SEEDS USERS && PRODUCTS && SHOULD CART && CART_PRODUCT
  await seedDb();
  console.log("data seeded");

  const users = await fetchUsers();
  console.log({users})
  const products = await fetchProducts();
  console.log({products})

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

// init function invocation
init();
