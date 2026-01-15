const httpStatus = require('http-status');
const catchAsync = require('../../shared/utils/catchAsync');
const productService = require('./product.service');
const pick = require('../../shared/utils/pick');

const createProduct = catchAsync(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(httpStatus.status.CREATED).send(product);
});

const getProducts = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset']);
    const result = await productService.getProducts(filter);
    res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.params.productId);
    res.send(product);
});

const updateProduct = catchAsync(async (req, res) => {
    const product = await productService.updateProductById(req.params.productId, req.body);
    res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
    await productService.deleteProductById(req.params.productId);
    res.status(httpStatus.status.NO_CONTENT).send();
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
