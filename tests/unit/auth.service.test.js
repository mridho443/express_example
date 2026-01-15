const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');

jest.mock('../../src/shared/config/database', () => ({}));
jest.mock('../../src/features/auth/auth.repository');
jest.mock('../../src/shared/config', () => ({
    jwt: {
        secret: 'test-secret-key-for-testing-purposes-only',
        accessExpirationMinutes: 30,
    },
    database: {
        url: 'postgresql://test:test@localhost:5432/test',
    },
}));

const authService = require('../../src/features/auth/auth.service');
const authRepository = require('../../src/features/auth/auth.repository');
const ApiError = require('../../src/shared/utils/ApiError');

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        const newUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        test('should create a new user and return user without password', async () => {
            const mockCreatedUser = {
                id: 1,
                name: newUser.name,
                email: newUser.email,
                password: 'hashedPassword',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            authRepository.getUserByEmail.mockResolvedValue(null);
            authRepository.createUser.mockResolvedValue(mockCreatedUser);

            const result = await authService.register(newUser);

            expect(authRepository.getUserByEmail).toHaveBeenCalledWith(newUser.email);
            expect(authRepository.createUser).toHaveBeenCalled();
            expect(result).not.toHaveProperty('password');
            expect(result.email).toBe(newUser.email);
            expect(result.name).toBe(newUser.name);
        });

        test('should throw error if email is already taken', async () => {
            authRepository.getUserByEmail.mockResolvedValue({ id: 1, email: newUser.email });

            await expect(authService.register(newUser)).rejects.toThrow(ApiError);
            await expect(authService.register(newUser)).rejects.toMatchObject({
                statusCode: httpStatus.status.BAD_REQUEST,
                message: 'Email already taken',
            });
        });

        test('should hash the password before saving', async () => {
            authRepository.getUserByEmail.mockResolvedValue(null);
            authRepository.createUser.mockImplementation((userData) => ({
                id: 1,
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await authService.register(newUser);

            const createUserCall = authRepository.createUser.mock.calls[0][0];
            expect(createUserCall.password).not.toBe(newUser.password);
            expect(await bcrypt.compare(newUser.password, createUserCall.password)).toBe(true);
        });
    });

    describe('loginUserWithEmailAndPassword', () => {
        const email = 'test@example.com';
        const password = 'password123';

        test('should return user without password if credentials are correct', async () => {
            const hashedPassword = await bcrypt.hash(password, 8);
            const mockUser = {
                id: 1,
                name: 'Test User',
                email,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            authRepository.getUserByEmail.mockResolvedValue(mockUser);

            const result = await authService.loginUserWithEmailAndPassword(email, password);

            expect(result).not.toHaveProperty('password');
            expect(result.email).toBe(email);
        });

        test('should throw error if user not found', async () => {
            authRepository.getUserByEmail.mockResolvedValue(null);

            await expect(authService.loginUserWithEmailAndPassword(email, password)).rejects.toThrow(
                ApiError
            );
            await expect(
                authService.loginUserWithEmailAndPassword(email, password)
            ).rejects.toMatchObject({
                statusCode: httpStatus.status.UNAUTHORIZED,
                message: 'Incorrect email or password',
            });
        });

        test('should throw error if password is incorrect', async () => {
            const mockUser = {
                id: 1,
                email,
                password: await bcrypt.hash('differentPassword', 8),
            };

            authRepository.getUserByEmail.mockResolvedValue(mockUser);

            await expect(
                authService.loginUserWithEmailAndPassword(email, password)
            ).rejects.toMatchObject({
                statusCode: httpStatus.status.UNAUTHORIZED,
                message: 'Incorrect email or password',
            });
        });
    });

    describe('generateTokens', () => {
        test('should generate valid access token', () => {
            const userId = 1;
            const tokens = authService.generateTokens(userId);

            expect(tokens).toHaveProperty('access');
            expect(tokens.access).toHaveProperty('token');
            expect(tokens.access).toHaveProperty('expires');
            expect(typeof tokens.access.token).toBe('string');
            expect(tokens.access.expires instanceof Date).toBe(true);
        });
    });

    describe('sanitizeUser', () => {
        test('should remove password from user object', () => {
            const user = {
                id: 1,
                name: 'Test',
                email: 'test@example.com',
                password: 'hashedPassword',
            };

            const result = authService.sanitizeUser(user);

            expect(result).not.toHaveProperty('password');
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('email');
        });

        test('should return null if user is null', () => {
            expect(authService.sanitizeUser(null)).toBeNull();
        });
    });
});
