const httpStatus = require('http-status');
const categoryRepository = require('./category.repository');
const ApiError = require('../../shared/utils/ApiError');

const createCategory = async (categoryBody) => {
    return categoryRepository.createCategory(categoryBody);
};

const getCategories = async () => {
    return categoryRepository.getCategories();
};

const getCategoryById = async (id) => {
    const category = await categoryRepository.getCategoryById(id);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    return category;
};

const updateCategoryById = async (id, updateBody) => {
    const category = await getCategoryById(id);
    Object.assign(category, updateBody);
    return categoryRepository.updateCategoryById(id, updateBody);
};

const deleteCategoryById = async (id) => {
    await getCategoryById(id);
    return categoryRepository.deleteCategoryById(id);
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
};
