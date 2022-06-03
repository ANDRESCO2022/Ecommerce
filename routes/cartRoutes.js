const express = require('express');

// Middlewares
 const { cartExists } = require('../middlewares/cartMiddlewares')
 const {productInCartExists} = require('../middlewares/productInCartMiddleware')
 const { protectToken } = require('../middlewares/userMiddlewares')
 const {
   createProductInCartValidations,
   checkValidations,
 } = require('../middlewares/validationsMiddlewares');

// Controller

const {
addPoductToCart,
updateProductToCart,
deleteProductToCart,
purchaseProductToCart
} = require('../controllers/cartController')



const router = express.Router();

router.use(protectToken);



router.post(
    '/add-product',
    createProductInCartValidations,
    checkValidations,
    addPoductToCart);
 router.patch('/update-cart',updateProductToCart)
 router.post('/purchase',purchaseProductToCart); 
 
 router.delete('/:productId',deleteProductToCart);

  

module.exports = { cartRouter: router };
