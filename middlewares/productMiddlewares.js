const { Product } = require('../models/productsModel');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectProductOwner = catchAsync(async (req, res, next) => {
   const { sessionUser, user } = req;

   if (sessionUser.id !== user.id) {
     return next(new AppError('You do not own this account', 403));
   }

   next();
});
const productExists = catchAsync( async (req, res, next) => {

    const { id } = req.params;

    const product = await Product.findOne({ where: { id } });

    if (!product) {
         return next(new AppError(' Product does not exist with given Id', 404));
    }
    

    req.product = product;

    next();

});

module.exports = { productExists,protectProductOwner };
