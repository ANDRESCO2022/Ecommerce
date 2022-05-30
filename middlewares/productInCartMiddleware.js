const { ProductInCart } = require('../models/productCartModels');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const productInCartExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const productInCarts = await ProductInCart.findOne({ where: { id, status: 'active' } });

  if (!productInCarts) {
    return next(new AppError('Comment not found with given id', 404));
  }

  req.productInCarts = productInCarts;

  next();
});

module.exports = {productInCartExists}
