const express = require('express');

// Middlewares
const { productExists } = require('../middlewares/productMiddlewares')
const { protectToken } = require('../middlewares/userMiddlewares');

const { 
  createProductValidations,
  checkValidations
} = require('../middlewares/validationsMiddlewares')
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

// // Utils
// const { upload } = require('../utils/multer');

const router = express.Router();

router.get('/', getProductsAvailable);
router.get('/:id', getProductById);


router.use(protectToken);

// router
//   .route('/')
//   .get(getAllPosts)
//   .post(upload.array('postImgs', 3), createPost);

router.post(
  '/',
  checkValidations,
 createProductValidations,
  createProduct
);
router.post('/categories', createCategory);
router.get('/categories', getAllCategories);

router.patch('/categories/:id', updateCategory);



router
  .use('/:id', productExists)
  .route('/:id')
    .patch(updateProduct)
  .delete(deleteProduct);

module.exports = { productRouter: router };
