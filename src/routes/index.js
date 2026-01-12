const express = require('express');
const authRoute = require('../features/auth/auth.routes');
const categoryRoute = require('../features/category/category.routes');
const productRoute = require('../features/product/product.routes');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/categories',
        route: categoryRoute,
    },
    {
        path: '/products',
        route: productRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
