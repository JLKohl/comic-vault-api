jest.mock('../../src/controllers/placesController', () => ({
	getAllPlaces: jest.fn(),
	getPlaceById: jest.fn(),
	createPlace: jest.fn(),
	updatePlace: jest.fn(),
	deletePlace: jest.fn(),
}));

jest.mock('../../src/validation/placesValidation', () => ({
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

	const placesController = require('../../src/controllers/placesController');
	const { validators } = require('../../src/validation/placesValidation');
	const { ensureAuthenticated } = require('../../src/middleware/authMiddleware');

	Object.values(placesController).forEach((fn) => fn.mockClear());
	Object.values(validators).forEach((fn) => fn.mockClear());
	ensureAuthenticated.mockClear();

	const router = require('../../src/routes/placesRoutes');

	return { router, placesController, validators, ensureAuthenticated };
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('placesRoutes', () => {
	it('should register GET / with getAllPlaces controller', () => {
		const { router, placesController } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/');

		expect(handlers).toEqual([placesController.getAllPlaces]);
	});

	it('should register GET /:id with getById validator and getPlaceById controller', () => {
		const { router, placesController, validators } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/:id');

		expect(handlers).toEqual([
			validators.getById,
			placesController.getPlaceById,
		]);
	});

	it('should register POST / with auth, create validator, and createPlace controller', () => {
		const { router, placesController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'post', '/');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.create,
			placesController.createPlace,
		]);
	});

	it('should register PUT /:id with auth, update validator, and updatePlace controller', () => {
		const { router, placesController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'put', '/:id');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.update,
			placesController.updatePlace,
		]);
	});

	it('should register DELETE /:id with auth, delete validator, and deletePlace controller', () => {
		const { router, placesController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'delete', '/:id');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.delete,
			placesController.deletePlace,
		]);
	});
});
