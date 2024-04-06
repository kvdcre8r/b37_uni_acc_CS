const {createUserService, createUserCart} = require('./service/userService.js');
const {createProductService} = require('./service/productService.js')

const seedDb = async () => {
  //SEED USERS
  const [TED, BARNEY, MARSHALL] = await Promise.all([
    createUserService({name:'TED', email:'TMOSBY@KVD.IO', password: '1234567', is_admin: false}),
    createUserService({name:'BARNEY', email:'BSTINSON@KVD.IO', password: '1234567', is_admin: false}),
    createUserService({name:'MARSHALL', email:'MERIKSEN@KVD.IO', password: '1234567', is_admin: false})
  ])

  //SEED PRODUCTS
  const [NUN_CHUCKS,CHARIZARD_CARD,SUPER_MARIO_BROS] = await Promise.all([
    createProductService({name:'NUN_CHUCKS', is_available:true, qty:10}),
    createProductService({name:'CHARIZARD_CARD', is_available:true, qty:10}),
    createProductService({name:'SUPER_MARIO_BROS', is_available:true, qty:3}),
  ])

  //SEED CARTS
  const [TED_CART, BARNEY_CART, MARSHALL_CART] = await Promise.all([
    createUserCart({user_id: TED.id}),
    createUserCart({user_id: BARNEY.id}),
    createUserCart({user_id: MARSHALL.id}),
  ])

  //SEED CART_PRODUCTS
  console.log({cartId: TED_CART.id, productId: NUN_CHUCKS.id});
  // 468116b4-81c2-41d6-96f7-ae0f4e32842e dba7dd48-0275-46bd-9547-bd2aac3d9888

}

module.exports = seedDb;