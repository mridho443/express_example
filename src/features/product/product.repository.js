const db = require('../../shared/config/database');
const { products } = require('../../db/schema');
const { eq } = require('drizzle-orm');

const createProduct = async (productBody) => {
    const [product] = await db.insert(products).values(productBody).returning();
    return product;
};

const getProducts = async (options = {}) => {
    const { limit = 10, offset = 0 } = options;
    const results = await db.select().from(products).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: db.count() }).from(products);
    return {
        results,
        totalResults: Number(count),
        limit,
        offset,
    };
};

const getProductById = async (id) => {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
};

const updateProductById = async (id, updateBody) => {
    const [product] = await db.update(products).set({ ...updateBody, updatedAt: new Date() }).where(eq(products.id, id)).returning();
    return product;
};

const deleteProductById = async (id) => {
    const [product] = await db.delete(products).where(eq(products.id, id)).returning();
    return product;
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById,
};
