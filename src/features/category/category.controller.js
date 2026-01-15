const httpStatus = require('http-status');
const catchAsync = require('../../shared/utils/catchAsync');
const categoryService = require('./category.service');

const createCategory = catchAsync(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(httpStatus.status.CREATED).send(category);
});

const getCategories = catchAsync(async (req, res) => {
    const categories = await categoryService.getCategories();
    res.send(categories);
});

const getCategory = catchAsync(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.categoryId);
    res.send(category);
});

const updateCategory = catchAsync(async (req, res) => {
    const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
    res.send(category);
});

const deleteCategory = catchAsync(async (req, res) => {
    await categoryService.deleteCategoryById(req.params.categoryId);
    res.status(httpStatus.status.NO_CONTENT).send();
});

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
