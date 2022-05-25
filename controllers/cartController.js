// Models
const { Cart } = require('../models/cartModel');

// Utils
const { catchAsync } = require('../utils/catchAsync');

const addPoductToCart= catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const { sessionUser } = req;

  const newComment = await Comment.create({
    text,
    postId,
    userId: sessionUser.id,
  });

  res.status(201).json({ newComment });
});

const updateProductToCart = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { comment } = req;

  await comment.update({ text });

  res.status(200).json({ status: 'success' });
});

const deleteProductToCart = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({ status: 'deleted' });

  res.status(200).json({ status: 'success' });
});
const purchaseProductToCart = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const { sessionUser } = req;

  const newComment = await Comment.create({
    text,
    postId,
    userId: sessionUser.id,
  });

  res.status(201).json({ newComment });
});

module.exports = {
  addPoductToCart,
  updateProductToCart,
  deleteProductToCart,
  purchaseProductToCart,
};
