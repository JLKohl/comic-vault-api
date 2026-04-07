jest.mock('../../src/controllers/storyArcController', () => ({
	getAllStoryArcs: jest.fn(),
	getStoryArcById: jest.fn(),
	createStoryArc: jest.fn(),
	updateStoryArc: jest.fn(),
	deleteStoryArc: jest.fn(),
}));

jest.mock('../../src/validation/storyArcValidation', () => ({
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

	const storyArcController = require('../../src/controllers/storyArcController');
	const { validators } = require('../../src/validation/storyArcValidation');
	const { ensureAuthenticated } = require('../../src/middleware/authMiddleware');

	Object.values(storyArcController).forEach((fn) => fn.mockClear());
	Object.values(validators).forEach((fn) => fn.mockClear());
	ensureAuthenticated.mockClear();

	const router = require('../../src/routes/storyArcRoutes');

	return { router, storyArcController, validators, ensureAuthenticated };
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('storyArcRoutes', () => {
	it('should register GET / with getAllStoryArcs controller', () => {
		const { router, storyArcController } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/');

		expect(handlers).toEqual([storyArcController.getAllStoryArcs]);
	});

	it('should register GET /:id with getById validator and getStoryArcById controller', () => {
		const { router, storyArcController, validators } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/:id');

		expect(handlers).toEqual([
			validators.getById,
			storyArcController.getStoryArcById,
		]);
	});

	it('should register POST / with auth, create validator, and createStoryArc controller', () => {
		const { router, storyArcController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'post', '/');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.create,
			storyArcController.createStoryArc,
		]);
	});

	it('should register PUT /:id with auth, update validator, and updateStoryArc controller', () => {
		const { router, storyArcController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'put', '/:id');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.update,
			storyArcController.updateStoryArc,
		]);
	});

	it('should register DELETE /:id with auth, delete validator, and deleteStoryArc controller', () => {
		const { router, storyArcController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'delete', '/:id');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.delete,
			storyArcController.deleteStoryArc,
		]);
	});
});
