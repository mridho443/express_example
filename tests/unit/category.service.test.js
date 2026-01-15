const httpStatus = require('http-status');

// Mock dependencies
jest.mock('../../src/features/category/category.repository');

const categoryService = require('../../src/features/category/category.service');
const categoryRepository = require('../../src/features/category/category.repository');
const ApiError = require('../../src/shared/utils/ApiError');

describe('Category Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createCategory', () => {
        test('should create and return a new category', async () => {
            const categoryData = { name: 'Electronics' };
            const mockCategory = {
                id: 1,
                name: 'Electronics',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            categoryRepository.createCategory.mockResolvedValue(mockCategory);

            const result = await categoryService.createCategory(categoryData);

            expect(categoryRepository.createCategory).toHaveBeenCalledWith(categoryData);
            expect(result).toEqual(mockCategory);
        });
    });

    describe('getCategories', () => {
        test('should return all categories', async () => {
            const mockCategories = [
                { id: 1, name: 'Electronics' },
                { id: 2, name: 'Books' },
            ];

            categoryRepository.getCategories.mockResolvedValue(mockCategories);

            const result = await categoryService.getCategories();

            expect(result).toEqual(mockCategories);
            expect(categoryRepository.getCategories).toHaveBeenCalled();
        });

        test('should return empty array when no categories exist', async () => {
            categoryRepository.getCategories.mockResolvedValue([]);

            const result = await categoryService.getCategories();

            expect(result).toEqual([]);
        });
    });

    describe('getCategoryById', () => {
        test('should return category if found', async () => {
            const mockCategory = { id: 1, name: 'Electronics' };
            categoryRepository.getCategoryById.mockResolvedValue(mockCategory);

            const result = await categoryService.getCategoryById(1);

            expect(result).toEqual(mockCategory);
            expect(categoryRepository.getCategoryById).toHaveBeenCalledWith(1);
        });

        test('should throw ApiError if category not found', async () => {
            categoryRepository.getCategoryById.mockResolvedValue(null);

            await expect(categoryService.getCategoryById(999)).rejects.toThrow(ApiError);
            await expect(categoryService.getCategoryById(999)).rejects.toMatchObject({
                statusCode: httpStatus.status.NOT_FOUND,
                message: 'Category not found',
            });
        });
    });

    describe('updateCategoryById', () => {
        test('should update and return category', async () => {
            const existingCategory = { id: 1, name: 'Electronics' };
            const updateData = { name: 'Updated Electronics' };
            const updatedCategory = { ...existingCategory, ...updateData };

            categoryRepository.getCategoryById.mockResolvedValue(existingCategory);
            categoryRepository.updateCategoryById.mockResolvedValue(updatedCategory);

            const result = await categoryService.updateCategoryById(1, updateData);

            expect(categoryRepository.updateCategoryById).toHaveBeenCalledWith(1, updateData);
            expect(result).toEqual(updatedCategory);
        });

        test('should throw error if category not found', async () => {
            categoryRepository.getCategoryById.mockResolvedValue(null);

            await expect(categoryService.updateCategoryById(999, { name: 'Test' })).rejects.toThrow(
                ApiError
            );
        });
    });

    describe('deleteCategoryById', () => {
        test('should delete category and return deleted category', async () => {
            const mockCategory = { id: 1, name: 'Electronics' };

            categoryRepository.getCategoryById.mockResolvedValue(mockCategory);
            categoryRepository.deleteCategoryById.mockResolvedValue(mockCategory);

            const result = await categoryService.deleteCategoryById(1);

            expect(categoryRepository.deleteCategoryById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockCategory);
        });

        test('should throw error if category not found', async () => {
            categoryRepository.getCategoryById.mockResolvedValue(null);

            await expect(categoryService.deleteCategoryById(999)).rejects.toThrow(ApiError);
        });
    });
});
