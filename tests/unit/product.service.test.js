const httpStatus = require('http-status');

// Mock dependencies
jest.mock('../../src/features/product/product.repository');
jest.mock('../../src/features/category/category.service');

const productService = require('../../src/features/product/product.service');
const productRepository = require('../../src/features/product/product.repository');
const categoryService = require('../../src/features/category/category.service');
const ApiError = require('../../src/shared/utils/ApiError');

describe('Product Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        const productData = {
            name: 'Laptop',
            description: 'A powerful laptop',
            price: 1000,
            categoryId: 1,
        };

        test('should create and return a new product', async () => {
            const mockProduct = {
                id: 1,
                ...productData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            categoryService.getCategoryById.mockResolvedValue({ id: 1, name: 'Electronics' });
            productRepository.createProduct.mockResolvedValue(mockProduct);

            const result = await productService.createProduct(productData);

            expect(categoryService.getCategoryById).toHaveBeenCalledWith(productData.categoryId);
            expect(productRepository.createProduct).toHaveBeenCalledWith(productData);
            expect(result).toEqual(mockProduct);
        });

        test('should throw error if category does not exist', async () => {
            categoryService.getCategoryById.mockRejectedValue(
                new ApiError(httpStatus.status.NOT_FOUND, 'Category not found')
            );

            await expect(productService.createProduct(productData)).rejects.toThrow(ApiError);
            expect(productRepository.createProduct).not.toHaveBeenCalled();
        });
    });

    describe('getProducts', () => {
        test('should return all products', async () => {
            const mockProducts = [
                { id: 1, name: 'Laptop', price: 1000 },
                { id: 2, name: 'Phone', price: 500 },
            ];

            productRepository.getProducts.mockResolvedValue(mockProducts);

            const result = await productService.getProducts();

            expect(result).toEqual(mockProducts);
        });

        test('should return empty array when no products exist', async () => {
            productRepository.getProducts.mockResolvedValue([]);

            const result = await productService.getProducts();

            expect(result).toEqual([]);
        });
    });

    describe('getProductById', () => {
        test('should return product if found', async () => {
            const mockProduct = { id: 1, name: 'Laptop', price: 1000 };
            productRepository.getProductById.mockResolvedValue(mockProduct);

            const result = await productService.getProductById(1);

            expect(result).toEqual(mockProduct);
        });

        test('should throw ApiError if product not found', async () => {
            productRepository.getProductById.mockResolvedValue(null);

            await expect(productService.getProductById(999)).rejects.toThrow(ApiError);
            await expect(productService.getProductById(999)).rejects.toMatchObject({
                statusCode: httpStatus.status.NOT_FOUND,
                message: 'Product not found',
            });
        });
    });

    describe('updateProductById', () => {
        test('should update and return product', async () => {
            const existingProduct = { id: 1, name: 'Laptop', price: 1000, categoryId: 1 };
            const updateData = { name: 'Updated Laptop', price: 1200 };
            const updatedProduct = { ...existingProduct, ...updateData };

            productRepository.getProductById.mockResolvedValue(existingProduct);
            productRepository.updateProductById.mockResolvedValue(updatedProduct);

            const result = await productService.updateProductById(1, updateData);

            expect(productRepository.updateProductById).toHaveBeenCalledWith(1, updateData);
            expect(result).toEqual(updatedProduct);
        });

        test('should validate category if categoryId is in update', async () => {
            const existingProduct = { id: 1, name: 'Laptop', categoryId: 1 };
            const updateData = { categoryId: 2 };

            productRepository.getProductById.mockResolvedValue(existingProduct);
            categoryService.getCategoryById.mockResolvedValue({ id: 2, name: 'New Category' });
            productRepository.updateProductById.mockResolvedValue({ ...existingProduct, ...updateData });

            await productService.updateProductById(1, updateData);

            expect(categoryService.getCategoryById).toHaveBeenCalledWith(2);
        });

        test('should throw error if product not found', async () => {
            productRepository.getProductById.mockResolvedValue(null);

            await expect(productService.updateProductById(999, { name: 'Test' })).rejects.toThrow(
                ApiError
            );
        });
    });

    describe('deleteProductById', () => {
        test('should delete product and return deleted product', async () => {
            const mockProduct = { id: 1, name: 'Laptop' };

            productRepository.getProductById.mockResolvedValue(mockProduct);
            productRepository.deleteProductById.mockResolvedValue(mockProduct);

            const result = await productService.deleteProductById(1);

            expect(productRepository.deleteProductById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockProduct);
        });

        test('should throw error if product not found', async () => {
            productRepository.getProductById.mockResolvedValue(null);

            await expect(productService.deleteProductById(999)).rejects.toThrow(ApiError);
        });
    });
});
