const { Product } = require('./productsModel');
const { User } = require('./userModel');
const { Order } = require('./ordersModel');
const { Cart } = require('./cartModel');
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
  // order-->cart
  Order.hasOne(Cart);
  Cart.belongsTo(Order);
  
  //cart-->productCart
  Cart.hasMany(ProductCart);
  ProductCart.belongsTo(Cart);
};

module.exports = { initModels };
