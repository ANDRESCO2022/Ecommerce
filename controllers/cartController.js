// Models
const { Cart } = require('../models/cartModel');
const { Product } = require('../models/productsModel');
const { Order } = require('../models/ordersModel');
const { ProductInCart } = require('../models/productCartModels');

// Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const getUserCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
    include: [{ model: ProductInCart, include: [{ model: Product }] }],
  });
  res.status(200).json({ status: 'success', cart });
});

const addPoductToCart = catchAsync(async (req, res, next) => {
  const { quantity, productId } = req.body;
  const { sessionUser } = req;
  const { id } = req.params;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });
  const productStock = await Product.findOne({
    where: { id: productId },
  });
  if (!productStock) {
    return next(new AppError('Invalid product', 404));
  } else if (quantity > productStock.quantity) {
    return next(
      new AppError(
        `this product only has ${productStock.quantity} items available`,
        400
      )
    );
  }

  if (!cart) {
    const newCart = await Cart.create({
      userId: sessionUser.id,
    });
    await ProductInCart.create({
      cartId: newCart.id,
      quantity,
      productId,
    });
  } else {
    const productsCart = await ProductInCart.findOne({
      where: { cartId: cart.id, productId, status: 'active' },
    });
    

    if (productsCart && productsCart.status === 'active') {
      return next(
        new AppError('you already have  that  product in your  cart', 400)
      );
    } else if (productsCart && productsCart.status === 'removed') {
      await productsCart.update({ quantity: quantity, status: 'active' });
    } else if(!productsCart){
      await ProductInCart.create({
        cartId: cart.id,
        quantity,
        productId,
      });
    }
  }

  res.status(201).json({ status: 'success' });
});

const updateProductToCart = catchAsync(async (req, res, next) => {
  const { newQuantity, productId } = req.body;
  const { sessionUser } = req;
  const cart = await Cart.findOne({
    where: { status: 'active', userId: sessionUser.id },
  });

  if (!cart) {
    return next(new AppError('Must create a cart first', 400));
  }
  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId },
    include: [{ model: Product }],
  });

  if (!productInCart) {
    return next(new AppError('This product does not exist in your cart', 404));
  }

  if (newQuantity < 0 || newQuantity > productInCart.product.quantity) {
    return next(
      new AppError(
        `Invalid selected quantity, this product only has ${productInCart.product.quantity} items available`,
        400
      )
    );
  }
  if (newQuantity === 0) {
    await productInCart.update({ quantity: 0, status: 'removed' });
  } else if (newQuantity > 0) {
    await productInCart.update({ quantity: newQuantity });
  }
  res.status(200).json({ status: 'success' });
});

const deleteProductToCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const productDisable = await ProductInCart.findOne({ where: { productId } });
  if (!productDisable) {
    return next(new AppError(' does not exist product in your cart', 404));
  } else {
    await productDisable.update({ quantity: 0, status: 'removed' });
  }

  res.status(200).json({
    status: 'success',
  });
});

const purchaseProductToCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const cart = await Cart.findOne({
    where: { status: 'active', userId: sessionUser.id },
  });
  const productToBuy = await ProductInCart.findAll({
    where: { status: 'active', cartId: cart.id },
  });

  let totalOrderPurchased = 0;

  const productFound = productToBuy.map(async product => {
    const productPurchased = product.quantity;
    const productIdPurchased = product.productId;
    const productStock = await Product.findOne({
      where: { id: productIdPurchased },
    });
    if (productStock.quantity >= productPurchased) {
      let stock = productStock.quantity - productPurchased;
      let productinfo = stock;
      await productStock.update({ quantity: productinfo });
    }

    let totalOrder = productPurchased * parseInt(productStock.price);
    totalOrderPurchased += totalOrder;

    await product.update({ status: 'purchased' });
  });

  await Promise.all(productFound);

  const newOrder = await Order.create({
    cartId: cart.id,
    totalPrice: totalOrderPurchased,
    userId: sessionUser.id,
  });

  await cart.update({ status: 'purchased' });

  res.status(201).json({ status: 'success', newOrder });
});

module.exports = {
  addPoductToCart,
  updateProductToCart,
  deleteProductToCart,
  purchaseProductToCart,
  getUserCart,
};
