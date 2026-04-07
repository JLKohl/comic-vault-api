jest.mock('../../src/controllers/characterController', () => ({
	getAllCharacters: jest.fn(),
	getCharacterById: jest.fn(),
	createCharacter: jest.fn(),
	updateCharacter: jest.fn(),
	deleteCharacter: jest.fn(),
}));

jest.mock('../../src/validation/characterValidation', () => ({
	validators: {
		getById: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
}));

jest.mock('../../src/middleware/authMiddleware', () => ({
	ensureAuthenticated: jest.fn(),
}));

const getRouteHandlers = (router, method, path) => {
	const layer = router.stack.find(
		(entry) =>
			entry.route &&
			entry.route.path === path &&
			entry.route.methods[method.toLowerCase()]
	);

	return layer.route.stack.map((stackLayer) => stackLayer.handle);
};

const loadRouter = () => {
	jest.resetModules();

	const characterController = require('../../src/controllers/characterController');
	const { validators } = require('../../src/validation/characterValidation');
	const {
		ensureAuthenticated,
	} = require('../../src/middleware/authMiddleware');

	Object.values(characterController).forEach((fn) => fn.mockClear());
	Object.values(validators).forEach((fn) => fn.mockClear());
	ensureAuthenticated.mockClear();

	const router = require('../../src/routes/characterRoutes');

	return { router, characterController, validators, ensureAuthenticated };
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('characterRoutes', () => {
	it('should register GET / with getAllCharacters controller', () => {
		const { router, characterController } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/');

		expect(handlers).toEqual([characterController.getAllCharacters]);
	});

	it('should register GET /:id with getById validator and getCharacterById controller', () => {
		const { router, characterController, validators } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/:id');

		expect(handlers).toEqual([
			validators.getById,
			characterController.getCharacterById,
		]);
	});

	it('should register POST / with auth, create validator, and createCharacter controller', () => {
		const { router, characterController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'post', '/');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.create,
			characterController.createCharacter,
		]);
	});

	it('should register PUT /:id with auth, update validator, and updateCharacter controller', () => {
		const { router, characterController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'put', '/:id');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.update,
			characterController.updateCharacter,
		]);
	});

	it('should register DELETE /:id with auth, delete validator, and deleteCharacter controller', () => {
		const { router, characterController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'delete', '/:id');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.delete,
			characterController.deleteCharacter,
		]);
	});
});
