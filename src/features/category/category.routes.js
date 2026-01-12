const express = require('express');
const validate = require('../../shared/middlewares/validate');
const categoryValidation = require('./category.validation');
const categoryController = require('./category.controller');
const auth = require('../../shared/middlewares/authMiddleware');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(categoryValidation.createCategory), categoryController.createCategory)
    .get(categoryController.getCategories);

router
    .route('/:categoryId')
    .get(validate(categoryValidation.getCategory), categoryController.getCategory)
    .patch(auth(), validate(categoryValidation.updateCategory), categoryController.updateCategory)
    .delete(auth(), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;
