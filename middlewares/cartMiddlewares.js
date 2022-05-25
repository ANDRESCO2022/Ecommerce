const { Cart } = require('../models/cartModel');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');


const cartExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const cart = await Cart.findOne({ where: { id,status:'active' } });
  if (!cart) {
    return next(new AppError('Cart  does not exist with given Id', 404));
  }

  req.cart = cart;
  next();
});

module.exports = {cartExists}