jest.mock('../../src/controllers/issueController', () => ({
	getAllIssues: jest.fn(),
	getIssueById: jest.fn(),
	createIssue: jest.fn(),
	updateIssue: jest.fn(),
	deleteIssue: jest.fn(),
}));

jest.mock('../../src/validation/issueValidation', () => ({
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

	const issueController = require('../../src/controllers/issueController');
	const { validators } = require('../../src/validation/issueValidation');
	const { ensureAuthenticated } = require('../../src/middleware/authMiddleware');

	Object.values(issueController).forEach((fn) => fn.mockClear());
	Object.values(validators).forEach((fn) => fn.mockClear());
	ensureAuthenticated.mockClear();

	const router = require('../../src/routes/issueRoutes');

	return { router, issueController, validators, ensureAuthenticated };
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('issueRoutes', () => {
	it('should register GET / with getAllIssues controller', () => {
		const { router, issueController } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/');

		expect(handlers).toEqual([issueController.getAllIssues]);
	});

	it('should register GET /:id with getById validator and getIssueById controller', () => {
		const { router, issueController, validators } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/:id');

		expect(handlers).toEqual([
			validators.getById,
			issueController.getIssueById,
		]);
	});

	it('should register POST / with auth, create validator, and createIssue controller', () => {
		const { router, issueController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'post', '/');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.create,
			issueController.createIssue,
		]);
	});

	it('should register PUT /:id with auth, update validator, and updateIssue controller', () => {
		const { router, issueController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'put', '/:id');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.update,
			issueController.updateIssue,
		]);
	});

	it('should register DELETE /:id with auth, delete validator, and deleteIssue controller', () => {
		const { router, issueController, validators, ensureAuthenticated } =
			loadRouter();
		const handlers = getRouteHandlers(router, 'delete', '/:id');

		expect(handlers).toEqual([
			ensureAuthenticated,
			validators.delete,
			issueController.deleteIssue,
		]);
	});
});
