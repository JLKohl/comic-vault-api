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
	return require('../../src/routes/index');
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('indexRoutes', () => {
	it('should register GET / route', () => {
		const router = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/');

		expect(handlers).toHaveLength(1);
		expect(typeof handlers[0]).toBe('function');
	});

	it('should render index view on GET /', () => {
		const router = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/');
		const routeHandler = handlers[0];

		const req = {};
		const res = {
			render: jest.fn(),
		};

		routeHandler(req, res);

		expect(res.render).toHaveBeenCalledWith('index');
	});
});
