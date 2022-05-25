const express = require('express');

// Middlewares
const { productExists } = require('../middlewares/productMiddlewares')
const { protectToken } = require('../middlewares/userMiddlewares');

// Controller
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

router.use(protectToken);

// router
//   .route('/')
//   .get(getAllPosts)
//   .post(upload.array('postImgs', 3), createPost);

router.post('/', createProduct);
router.get('/', getProductsAvailable);



router
  .use('/:id', productExists)
  .route('/:id')
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = { productRouter: router };
