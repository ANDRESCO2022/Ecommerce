const express = require('express');
const {
  userExists,
  protectToken,
  protectAccountOwner,
} = require('../middlewares/userMiddlewares');
// const {
//   createUserValidations,
//   checkValidations,
// } = require('../middlewares/validationsMiddlewares');

// Controller
const {
  createUser,
  updateUser,
  deleteUser,
  login,
  GetOrderById,
  GetAllOrdersUser,
  GetAllProductsMe,
  checkToken,
} = require('../controllers/usersController');

const router = express.Router();

router.post('/', createUser);

router.post('/login', login);

router.use(protectToken);

router.get('/me', GetAllProductsMe);

router.get('/check-token', checkToken);
router.get('/orders', GetAllOrdersUser);
router.get('/orders/:id', GetOrderById);
router
  .route('/:id')
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
