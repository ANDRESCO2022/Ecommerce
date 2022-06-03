const express = require('express');

// Middlewares
const { protectToken } = require('../middlewares/userMiddlewares');

const {
  createProductValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');
// Controller
const {
  getAllCategories,
  createCategory,
  updateCategory,
} = require('../controllers/categoriesController');
const {
  createProduct,
  getProductsAvailable,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productsController.js');

const {
  protectProductOwner,
  productExists
} = require('../middlewares/productMiddlewares');

const router = express.Router();

router.get('/', getProductsAvailable);
router.get('/:id', productExists, getProductById);

router.use(protectToken);

router.post('/', checkValidations, createProductValidations, createProduct);
router.post('/categories', createCategory);
router.get('/categories', getAllCategories);

router.patch('/categories/:id', updateCategory);

router
  .use('/:id', productExists)
  .route('/:id')
  .patch(protectProductOwner, updateProduct)
  .delete(protectProductOwner, deleteProduct);

module.exports = { productRouter: router };
