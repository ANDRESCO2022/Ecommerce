const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// require('crypto').randomBytes(64).toString('hex')

// Models
const { User } = require('../models/userModel');



// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });


const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password} = req.body;

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

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name } = req.body;

  await user.update({ name });

  res.status(200).json({ status: 'success' });
});
const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});
const GetAllOrdersByUser = catchAsync(async (req, res, next) => {
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
const GetAllProductsMe = catchAsync(async (req, res, next) => {
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

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});
const GetOrderById = catchAsync(async (req, res, next) => {
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
  GetOrderById,
  GetAllOrdersByUser,
  GetAllProductsMe,
  createUser,
  updateUser,
  deleteUser,
  login,
  checkToken,
};
