jest.mock('passport', () => ({
	authenticate: jest.fn(),
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

	const passport = require('passport');
	passport.authenticate.mockReset();

	const authenticateMiddleware = jest.fn((req, res, next) => {
		if (next) next();
	});

	passport.authenticate.mockReturnValue(authenticateMiddleware);

	const router = require('../../src/routes/authRoutes');

	return { router, passport, authenticateMiddleware };
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('authRoutes', () => {
	it('should configure google login route with profile and email scopes', () => {
		const { passport } = loadRouter();

		expect(passport.authenticate).toHaveBeenNthCalledWith(1, 'google', {
			scope: ['profile', 'email'],
		});
	});

	it('should configure google callback route with failure redirect', () => {
		const { passport } = loadRouter();

		expect(passport.authenticate).toHaveBeenNthCalledWith(2, 'google', {
			failureRedirect: '/',
		});
	});

	it('should redirect to /api-docs on successful google callback', () => {
		const { router } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/google/callback');
		const successHandler = handlers[1];

		const req = {};
		const res = { redirect: jest.fn() };

		successHandler(req, res);

		expect(res.redirect).toHaveBeenCalledWith('/api-docs');
	});

	it('should clear session cookie and redirect on logout', () => {
		const { router } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/logout');
		const logoutHandler = handlers[0];

		const req = {
			logout: jest.fn((callback) => callback()),
			session: {
				destroy: jest.fn((callback) => callback()),
			},
		};

		const res = {
			clearCookie: jest.fn(),
			redirect: jest.fn(),
		};

		const next = jest.fn();

		logoutHandler(req, res, next);

		expect(req.logout).toHaveBeenCalled();
		expect(req.session.destroy).toHaveBeenCalled();
		expect(res.clearCookie).toHaveBeenCalledWith('connect.sid');
		expect(res.redirect).toHaveBeenCalledWith('/');
		expect(next).not.toHaveBeenCalled();
	});

	it('should call next with error when logout fails', () => {
		const { router } = loadRouter();
		const handlers = getRouteHandlers(router, 'get', '/logout');
		const logoutHandler = handlers[0];

		const error = new Error('Logout failed');
		const req = {
			logout: jest.fn((callback) => callback(error)),
			session: {
				destroy: jest.fn(),
			},
		};

		const res = {
			clearCookie: jest.fn(),
			redirect: jest.fn(),
		};

		const next = jest.fn();

		logoutHandler(req, res, next);

		expect(next).toHaveBeenCalledWith(error);
		expect(req.session.destroy).not.toHaveBeenCalled();
		expect(res.clearCookie).not.toHaveBeenCalled();
		expect(res.redirect).not.toHaveBeenCalled();
	});
});
