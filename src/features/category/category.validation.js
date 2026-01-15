const Joi = require('joi');

const getCategories = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0),
    }),
};

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
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
};
