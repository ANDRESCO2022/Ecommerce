const { Op } = require('sequelize');

// Models
const {   Product } = require('../models/productsModel');
// Utils
const { catchAsync } = require('../utils/catchAsync');



const createProduct = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
  });

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name } = req.body;

  await user.update({ name });

  res.status(200).json({ status: 'success' });
});
const deleteProduct = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});


const getProductsAvailable = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const orders = await Order.findAll({
    where: { userId: sessionUser.id, status: 'active' },
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
        include: [{ model: Restaurant, attributes: ['name'] }],
      },
    ],
  });

  res.status(200).json({ orders });
});
const getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id },
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
        include: [{ model: Restaurant, attributes: ['name'] }],
      },
    ],
  });

  res.status(200).json({
    order,
  });
});






module.exports = {
  createProduct,
  getProductsAvailable,
  getProductById,
  updateProduct,
  deleteProduct,
};
