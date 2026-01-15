const db = require('../../shared/config/database');
const { categories } = require('../../db/schema');
const { eq } = require('drizzle-orm');

const createCategory = async (categoryBody) => {
    const [category] = await db.insert(categories).values(categoryBody).returning();
    return category;
};

const getCategories = () => {
    return db.select().from(categories);
};

const getCategoryById = async (id) => {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
};

const updateCategoryById = async (id, updateBody) => {
    const [category] = await db.update(categories).set(updateBody).where(eq(categories.id, id)).returning();
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
