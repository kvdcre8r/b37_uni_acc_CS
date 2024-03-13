const {createUserService} = require('./service/userService.js');
const {createProductService} = require('./service/productService.js')

const seedDb = async () => {
  //SEED USERS
  const [DN, DN2, DN3] = await Promise.all([
    createUserService({name:'DN', email:'DN@KVD.IO', password: 'DN1', is_admin: false}),
    createUserService({name:'DN2', email:'DN2@KVD.IO', password: 'DN2', is_admin: false}),
    createUserService({name:'DN3', email:'DN3@KVD.IO', password: 'DN3', is_admin: false})
  ])

  //SEED PRODUCTS
  const [NUN_CHUCKS,CHARIZARD_CARD,SUPER_MARIO_BROS] = await Promise.all([
    createProductService({name:'NUN_CHUCKS', is_available:true, qty:10}),
    createProductService({name:'CHARIZARD_CARD', is_available:true, qty:10}),
    createProductService({name:'SUPER_MARIO_BROS', is_available:true, qty:3}),
  ])

  //SEED CARTS

  //SEED CART_PRODUCTS
}

module.exports = seedDb;