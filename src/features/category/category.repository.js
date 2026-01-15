const db = require('../../shared/config/database');
const { categories } = require('../../db/schema');
const { eq } = require('drizzle-orm');

const createCategory = async (categoryBody) => {
    const [category] = await db.insert(categories).values(categoryBody).returning();
    return category;
};

const getCategories = async (options = {}) => {
    const { limit = 10, offset = 0 } = options;
    const results = await db.select().from(categories).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: db.count() }).from(categories);
    return {
        results,
        totalResults: Number(count),
        limit,
        offset,
    };
};

const getCategoryById = async (id) => {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
};

const updateCategoryById = async (id, updateBody) => {
    const [category] = await db.update(categories).set({ ...updateBody, updatedAt: new Date() }).where(eq(categories.id, id)).returning();
    return category;
};

const deleteCategoryById = async (id) => {
    const [category] = await db.delete(categories).where(eq(categories.id, id)).returning();
    return category;
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
};
