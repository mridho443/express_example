const Joi = require('joi');

const createProduct = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().optional(),
        price: Joi.number().min(0).required(),
        categoryId: Joi.number().integer().required(),
    }),
};

const getProduct = {
    params: Joi.object().keys({
        productId: Joi.number().integer().required(),
    }),
};

const updateProduct = {
    params: Joi.object().keys({
        productId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            description: Joi.string(),
            price: Joi.number().min(0),
            categoryId: Joi.number().integer(),
        })
        .min(1),
};

const deleteProduct = {
    params: Joi.object().keys({
        productId: Joi.number().integer().required(),
    }),
};

module.exports = {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
};
