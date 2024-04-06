// import for express
const express = require("express");
//creating an instance of express && calling it app;
const app = express();

//import path module, to join directories
const path = require("path");

//CLIENT
const client = require("./client.js");

//SCHEMA
const SCHEMA = require("./schema.js");

//SEED FC
const seedDb = require("./seedDb.js");

//SERVICES
const {
  fetchUsers,
  createUserService,
  authenticateUser,
  createUserCart,
  fetchCartByUserId,
  createCart,
  fetchUserByTokenId
} = require("./service/userService.js");
const {
  fetchProducts,
  fetchProductById,
  createCartProduct,
  validateProductAmount,
  addProductToCartProducts,
  removeProductFromCartProducts,
  updateCartProducts
} = require("./service/productService.js");

/*

headers: {
  Content-Type: application/json
  authorization: sometokenValue
  x-api-key: someapikey
}
*/

const isLoggedIn = async (req,res,next) => {
  try {
    req.user = await fetchUserByTokenId(req.headers.authorization);
    next()
  } catch (ex) {
    next(ex)
  }
}

app.use(express.json());
app.use(require("morgan")("dev"));
// static routes
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

// app routes
app.get("/api/products", async (req, res, next) => {
  try {
    const productResponse = await fetchProducts();
    res.send(productResponse);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await fetchProductById(id);
    res.send(product);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    const userReponse = await fetchUsers();
    res.send(userReponse);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users", async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body);
    res.send(newUser);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/login", async (req, res, next) => {
  try {
    res.send(await authenticateUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/cart/:cartId/product/:productId", isLoggedIn, async (req, res, next) => {
  try {
    const {cartId, productId} = req.params;
    const {qty} = req.body;
    if (await validateProductAmount({productId, qty}) === false) {
      res.send(new Error('NOT ENOUGH QUANTITIES'));
    }
    const updatedProd = await addProductToCartProducts({productId, qty}); // SHOULD 
    console.log({updatedProd}, 'THIS IS WHAT WE UPDATED')
    // perform an Update to product based off of the productId
    res.send(await createCartProduct({ cartId, productId, qty }));
     // result of calling should return the row we created
    // const cartId = req.params.cartId
  } catch (ex) {
    next(ex);
  }
})

app.put("/api/cart/:cartId/product/:productId", isLoggedIn, async (req,res,next)=> {
  try {
    const {cartId,productId} = req.params;
    const {qty} = req.body;
    res.send(await updateCartProducts({cartId,productId,qty}));
  }catch(e){
    next(e)
  }
})

// init function
const init = async () => {
  await client.connect();
  //Create TABLES
  await client.query(SCHEMA);

  //SEEDS USERS && PRODUCTS && SHOULD CART && CART_PRODUCT
  await seedDb();
  // console.log("data seeded");

  const users = await fetchUsers();
  // console.log({ users });
  const products = await fetchProducts();
  // console.log({ products });

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

// init function invocation
init();
