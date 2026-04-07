const createExpressMock = () => {
	const app = {
		use: jest.fn(),
		set: jest.fn(),
		get: jest.fn(),
		listen: jest.fn((port, callback) => {
			if (typeof callback === 'function') callback();
		}),
	};

	const express = jest.fn(() => app);
	express.json = jest.fn(() => 'jsonMiddleware');
	express.static = jest.fn(() => 'staticMiddleware');

	return { express, app };
};

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

const loadServer = async ({
	mongoUri = 'mongodb://localhost:27017/comic-vault-test',
	port,
	mockSwaggerReadFailure = false,
} = {}) => {
	jest.resetModules();
	jest.clearAllMocks();

	process.env.MONGO_URI = mongoUri;

	if (port === undefined) {
		process.env.PORT = '';
	} else {
		process.env.PORT = String(port);
	}

	const { express, app } = createExpressMock();
	const connectMock = jest.fn().mockResolvedValue({});
	const sessionMock = jest.fn(() => 'sessionMiddleware');
	const passportInitialize = jest.fn(() => 'passportInitializeMiddleware');
	const passportSession = jest.fn(() => 'passportSessionMiddleware');
	const passportMock = {
		initialize: passportInitialize,
		session: passportSession,
	};
	const flashFactory = jest.fn(() => {
		return (req, res, next) => next();
	});
	const corsFactory = jest.fn(() => 'corsMiddleware');
	const swaggerServe = 'swaggerServeMiddleware';
	const swaggerSetupMiddleware = 'swaggerSetupMiddleware';
	const swaggerSetup = jest.fn(() => swaggerSetupMiddleware);
	const ensureAuthenticated = jest.fn((req, res, next) => next());
	const authRoutes = { route: 'authRoutes' };
	const characterRoutes = { route: 'characterRoutes' };
	const storyArcRoutes = { route: 'storyArcRoutes' };
	const issueRoutes = { route: 'issueRoutes' };
	const placesRoutes = { route: 'placesRoutes' };

	jest.doMock('dotenv', () => ({ config: jest.fn() }));
	jest.doMock('express', () => express);
	jest.doMock('mongoose', () => ({ connect: connectMock }));
	jest.doMock('express-session', () => sessionMock);
	jest.doMock('passport', () => passportMock);
	jest.doMock('connect-flash', () => flashFactory);
	jest.doMock('cors', () => corsFactory);
	jest.doMock('swagger-ui-express', () => ({
		serve: swaggerServe,
		setup: swaggerSetup,
	}));

	jest.doMock('../src/middleware/passport', () => ({}));
	jest.doMock('../src/routes/authRoutes', () => authRoutes);
	jest.doMock('../src/routes/characterRoutes', () => characterRoutes);
	jest.doMock('../src/routes/storyArcRoutes', () => storyArcRoutes);
	jest.doMock('../src/routes/issueRoutes', () => issueRoutes);
	jest.doMock('../src/routes/placesRoutes', () => placesRoutes);
	jest.doMock('../src/middleware/authMiddleware', () => ({
		ensureAuthenticated,
	}));

	if (mockSwaggerReadFailure) {
		jest.doMock('../swagger-output.json', () => {
			throw new Error('missing swagger spec');
		});
	}

	const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
	const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

	require('../server');
	await flushPromises();

	return {
		app,
		connectMock,
		sessionMock,
		swaggerSetup,
		ensureAuthenticated,
		authRoutes,
		characterRoutes,
		storyArcRoutes,
		issueRoutes,
		placesRoutes,
		logSpy,
		errorSpy,
	};
};

afterEach(() => {
	delete process.env.MONGO_URI;
	delete process.env.PORT;
	jest.restoreAllMocks();
});

describe('server bootstrap', () => {
	it('should throw an error when MONGO_URI is not defined', () => {
		jest.resetModules();
		process.env.MONGO_URI = '';

		const { express } = createExpressMock();
		jest.doMock('dotenv', () => ({ config: jest.fn() }));
		jest.doMock('express', () => express);
		jest.doMock('mongoose', () => ({ connect: jest.fn() }));
		jest.doMock('express-session', () => jest.fn(() => 'sessionMiddleware'));
		jest.doMock('passport', () => ({
			initialize: jest.fn(() => 'passportInitializeMiddleware'),
			session: jest.fn(() => 'passportSessionMiddleware'),
		}));
		jest.doMock('connect-flash', () => jest.fn(() => (req, res, next) => next()));
		jest.doMock('cors', () => jest.fn(() => 'corsMiddleware'));
		jest.doMock('swagger-ui-express', () => ({
			serve: 'swaggerServeMiddleware',
			setup: jest.fn(() => 'swaggerSetupMiddleware'),
		}));
		jest.doMock('../src/middleware/passport', () => ({}));
		jest.doMock('../src/routes/authRoutes', () => ({}));
		jest.doMock('../src/routes/characterRoutes', () => ({}));
		jest.doMock('../src/routes/storyArcRoutes', () => ({}));
		jest.doMock('../src/routes/issueRoutes', () => ({}));
		jest.doMock('../src/routes/placesRoutes', () => ({}));
		jest.doMock('../src/middleware/authMiddleware', () => ({
			ensureAuthenticated: jest.fn((req, res, next) => next()),
		}));

		expect(() => {
			require('../server');
		}).toThrow('MONGO_URI is not defined in environment variables');
	});

	it('should connect to MongoDB and start listening on configured port', async () => {
		const { app, connectMock } = await loadServer({
			mongoUri: 'mongodb://localhost:27017/comic-vault-test',
			port: 4567,
		});

		expect(connectMock).toHaveBeenCalledWith(
			'mongodb://localhost:27017/comic-vault-test'
		);
		expect(app.listen).toHaveBeenCalledWith('4567', expect.any(Function));
	});

	it('should default to port 3000 when PORT is not set', async () => {
		const { app } = await loadServer();

		expect(app.listen).toHaveBeenCalledWith(3000, expect.any(Function));
	});
});

describe('server routes and middleware', () => {
	it('should register root route and render index view with user', async () => {
		const { app } = await loadServer();
		const rootRouteCall = app.get.mock.calls.find((call) => call[0] === '/');

		expect(rootRouteCall).toBeDefined();
		expect(typeof rootRouteCall[1]).toBe('function');

		const handler = rootRouteCall[1];
		const req = { user: { id: 'abc123' } };
		const res = { render: jest.fn() };

		handler(req, res);

		expect(res.render).toHaveBeenCalledWith('index', { user: req.user });
	});

	it('should register API route modules on expected paths', async () => {
		const {
			app,
			authRoutes,
			characterRoutes,
			issueRoutes,
			storyArcRoutes,
			placesRoutes,
		} = await loadServer();

		expect(app.use).toHaveBeenCalledWith('/auth', authRoutes);
		expect(app.use).toHaveBeenCalledWith('/api/characters', characterRoutes);
		expect(app.use).toHaveBeenCalledWith('/api/issues', issueRoutes);
		expect(app.use).toHaveBeenCalledWith('/api/story-arc', storyArcRoutes);
		expect(app.use).toHaveBeenCalledWith('/api/places', placesRoutes);
	});

	it('should protect /api-docs with ensureAuthenticated and swagger middleware', async () => {
		const { app, ensureAuthenticated } = await loadServer();

		expect(app.use).toHaveBeenCalledWith(
			'/api-docs',
			ensureAuthenticated,
			'swaggerServeMiddleware',
			'swaggerSetupMiddleware'
		);
	});
});

describe('swagger configuration', () => {
	it('should fallback to default swagger spec when swagger-output.json is unavailable', async () => {
		const { swaggerSetup } = await loadServer({ mockSwaggerReadFailure: true });

		expect(swaggerSetup).toHaveBeenCalledWith(
			expect.objectContaining({
				openapi: '3.0.0',
				info: expect.objectContaining({
					title: 'Comic Vault API',
					version: '1.0.0',
					description: 'Swagger docs not generated yet.',
				}),
			})
		);
	});
});
