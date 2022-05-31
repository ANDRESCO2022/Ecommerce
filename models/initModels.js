const { Product } = require('./productsModel');
const { User } = require('./userModel');
const { Order } = require('./ordersModel');
const { Cart } = require('./cartModel');
const {ProductImg } = require('./productsImgModel');
const {Category } = require('./categoriesModels');
const {ProductInCart } = require('./productCartModels');


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
  //  // product--> productCart
  Product.hasOne(ProductInCart);
  ProductInCart.belongsTo(Product);
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
  Cart.hasMany(ProductInCart);
  ProductInCart.belongsTo(Cart);

  Product.hasOne(ProductInCart)
  ProductInCart.belongsTo(Product)
};

module.exports = { initModels };
