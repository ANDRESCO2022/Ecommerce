// Models
const { Cart } = require('../models/cartModel');
const {Product} = require('../models/productsModel');
const {ProductInCart }= require('../models/productCartModels')

// Utils
const { catchAsync } = require('../utils/catchAsync');

const addPoductToCart= catchAsync(async (req, res, next) => {
  const { quantity,productId } = req.body;
  const { sessionUser } = req;
  

  
  const newCart = await Cart.create({   
    userId: sessionUser.id,
  });
  const carts = await Cart.findOne({ where: { id: newCart.id} });

  const newProductInCart = await ProductInCart.create({
    cartId:carts.id,
    quantity,
    productId
  })

  res.status(201).json({ newProductInCart });
});

const updateProductToCart = catchAsync(async (req, res, next) => {
  const {newQuantity,productId}=req.body
  const { sessionUser } = req;
    
   const carts = await Cart.findAll({
     where: { userId: sessionUser.id, status: 'active' },
    });
    const quantities = Product.quantity
    
    if (newQuantity <= quantities){
     
     
    (quantities)-(newQuantity)
 
 
    }

  //  else if (newQuantity === 0) {
  //    // removed 

  //  }
  //  else {"don't preoduct exist  in stock"}
   

    await carts.update({carts });

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
