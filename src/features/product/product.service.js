const httpStatus = require('http-status');
const productRepository = require('./product.repository');
const categoryService = require('../category/category.service');
const ApiError = require('../../shared/utils/ApiError');

const createProduct = async (productBody) => {
    await categoryService.getCategoryById(productBody.categoryId);
    return productRepository.createProduct(productBody);
};

const getProducts = async () => {
    return productRepository.getProducts();
};

const getProductById = async (id) => {
    const product = await productRepository.getProductById(id);
    if (!product) {
        throw new ApiError(httpStatus.status.NOT_FOUND, 'Product not found');
    }
    return product;
};

const updateProductById = async (id, updateBody) => {
    const product = await getProductById(id);
    if (updateBody.categoryId) {
        await categoryService.getCategoryById(updateBody.categoryId);
    }
    Object.assign(product, updateBody);
    return productRepository.updateProductById(id, updateBody);
};

const deleteProductById = async (id) => {
    await getProductById(id);
    return productRepository.deleteProductById(id);
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById,
};
