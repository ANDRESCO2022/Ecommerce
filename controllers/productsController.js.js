const { Op } = require('sequelize');

// Models
const { Product } = require('../models/productsModel');
// Utils
const { catchAsync } = require('../utils/catchAsync');

const {Category}= require('../models/categoriesModels');
const { user } = require('pg/lib/defaults');



const createProduct = catchAsync(async (req, res, next) => {
  const { title, description,price, quantity, categoryId } = req.body;
  const { sessionUser } = req;
 


  const newProduct = await Product.create({
    title,
    description,
    price,
    quantity,
    categoryId,
    userId: sessionUser.id,
  }); 

  res.status(201).json({ newProduct });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, price, quantity} = req.body;

  await product.update({ title, description, price, quantity });

  res.status(200).json({ status: 'success' });
});
const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
  });
});


const getProductsAvailable = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({
    where: {  status: 'active' },
    include: [
      {
        model: Category,
        attributes: ['name'],
        include: [{ model: user, attributes: ['name'] }],
      },
    ],
  });

  res.status(200).json({ products });
});
const getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const products = await Product.findOne({
    where: { id },
    // include: [
    //   {
    //     model: Meal,
    //     attributes: ['name', 'price'],
    //     include: [{ model: Restaurant, attributes: ['name'] }],
    //   },
    // ],
  });

  res.status(200).json({
    products
  });
});







module.exports = {
  createProduct,
  getProductsAvailable,
  getProductById,
  updateProduct,
  deleteProduct,
};
