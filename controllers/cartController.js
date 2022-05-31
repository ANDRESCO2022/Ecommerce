// Models
const { Cart } = require('../models/cartModel');
const {Product} = require('../models/productsModel');
const {ProductInCart }= require('../models/productCartModels')
const { AppError } = require('../utils/appError');

// Utils
const { catchAsync } = require('../utils/catchAsync');

const addPoductToCart= catchAsync(async (req, res, next) => {
  const { quantity,productId } = req.body;
  const { sessionUser } = req;
 const {id }= req.params;

  const cart = await Cart.findOne({ 
    where: {  userId: sessionUser.id,status: 'active' }
   });    
  const productStock = await Product.findOne({ 
    where: {  id: productId}
   });    

  let productinfo = productStock.quantity

 
   const quantityStore = ()=>{     
     if (quantity <= productinfo) {
     let stock = productStock.quantity - quantity;
    let  productinfo = stock;
    productStock.update({ quantity:productinfo });
     } else {
      return next( new AppError('not stock  product',404))
     }
      
    };
    
     const quntityCart =()=> {


     }
    if (!cart){
      const newCart = await Cart.create({
        userId: sessionUser.id,   });
        const newProductInCart = await ProductInCart.create({
          cartId:newCart.id,
          quantity,
          productId
        })
        quantityStore()
      }else{ 
        const newProductInCart = await ProductInCart.create({
          cartId: cart.id,
          quantity,
          productId,
        });
        quantityStore()
      }
               
 res.status(201).json({ status: 'success' });
});

const updateProductToCart = catchAsync(async (req, res, next) => {
  const {newQuantity,productId} = req.body

    
    
  

  res.status(200).json({ status: 'success' });
});

const deleteProductToCart = catchAsync(async (req, res, next) => {
   const { id } = req.params;

  const productCart = await ProductInCart.findOne({ where: { id } });

  await productCart.update({ status: 'removed' });

  res.status(200).json({
    status: 'success',
  });
});


const purchaseProductToCart = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const { sessionUser } = req;

  const newComment = await Comment.create({
    text,
    postId,
    userId: sessionUser.id,
  });

  res.status(201).json({ newComment });
});

module.exports = {
  addPoductToCart,
  updateProductToCart,
  deleteProductToCart,
  purchaseProductToCart,
};
