const { Product } = require('../models/productsModel');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const productExists = catchAsync( async (req, res, next) => {

    const { id } = req.params;

    const product = await Product.findOne({ where: { id } });

    if (!product) {
         return next(new AppError(' Product does not exist with given Id', 404));
    }
    

    req.product = product;

    next();

});

module.exports = { productExists };
