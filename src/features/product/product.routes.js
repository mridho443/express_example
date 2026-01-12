const express = require('express');
const validate = require('../../shared/middlewares/validate');
const productValidation = require('./product.validation');
const productController = require('./product.controller');
const auth = require('../../shared/middlewares/authMiddleware');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(productValidation.createProduct), productController.createProduct)
    .get(productController.getProducts);

router
    .route('/:productId')
    .get(validate(productValidation.getProduct), productController.getProduct)
    .patch(auth(), validate(productValidation.updateProduct), productController.updateProduct)
    .delete(auth(), validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;
