const { Order } = require('../models/ordersModel');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({ where: { id } });
  if (!order) {
    return next(new AppError('Order does not exist with given Id', 404));
  }

  req.order =order;
  next();
});

module.exports ={orderExists}