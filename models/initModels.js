const { Product } = require('./productsModel');
const { User } = require('./userModel');
const { Order } = require('./ordersModel');
const { Cart } = require('./cartModel');
const {ProductImg } = require('./productsImgModel');
const {Category } = require('./categories');
const {ProductCart } = require('./productsCartModel');


const initModels = () => {
 ///user-->order
  User.hasMany(Order);
  Order.belongsTo(User);
//USER-->product
  User.hasMany(Product);
  Product.belongsTo(User);
  //user-->cart
  User.hasOne(Cart);
  Cart.belongsTo(User);
   // product--> productCart
  Product.hasOne(ProductCart);
  ProductCart.belongsTo(Product);
  //PRODUCT--IMG
  Product.hasMany(ProductImg);
  ProductImg.belongsTo(Product);

  //product--category
  Category.hasOne(Product);
  Product.belongsTo(Category);
  // order-->cart
  Cart.hasOne(Order);
  Order.belongsTo(Cart);
  
  //cart-->productCart
  Cart.hasMany(ProductCart);
  ProductCart.belongsTo(Cart);

  Product.hasOne(ProductCart)
  ProductCart.belongsTo(Product)
};

module.exports = { initModels };
