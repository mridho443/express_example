const Joi = require('joi');

const createCategory = {
    body: Joi.object().keys({
        name: Joi.string().required(),
    }),
};

const getCategory = {
    params: Joi.object().keys({
        categoryId: Joi.number().integer().required(),
    }),
};

const updateCategory = {
    params: Joi.object().keys({
        categoryId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
        })
        .min(1),
};

const deleteCategory = {
    params: Joi.object().keys({
        categoryId: Joi.number().integer().required(),
    }),
};

module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
};
