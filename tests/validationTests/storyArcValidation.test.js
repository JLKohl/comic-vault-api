const { validators } = require('../../src/validation/storyArcValidation');

const mockResponse = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const runValidator = async (validatorChain, { params = {}, body = {} } = {}) => {
	const req = { params, body };
	const res = mockResponse();
	const next = jest.fn();

	for (const chain of validatorChain.slice(0, -1)) {
		await chain.run(req);
	}

	const resultHandler = validatorChain[validatorChain.length - 1];
	resultHandler(req, res, next);

	return { req, res, next };
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('Story arc validation middleware', () => {
	describe('create validator', () => {
		it('should pass when payload is valid', async () => {
			const validBody = {
				title: 'Crisis on Infinite Earths',
				description: 'A multiverse-shaking crossover event.',
				mainCharacters: ['Superman', 'Batman', 'Wonder Woman'],
				startIssue: 1,
				endIssue: 12,
				status: 'Completed',
			};

			const { res, next } = await runValidator(validators.create, { body: validBody });

			expect(next).toHaveBeenCalled();
			expect(res.status).not.toHaveBeenCalled();
			expect(res.json).not.toHaveBeenCalled();
		});

		it('should fail when title is missing', async () => {
			const { res, next } = await runValidator(validators.create, {
				body: { description: 'No title provided' },
			});

			expect(next).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);

			const errorPayload = res.json.mock.calls[0][0];
			const messages = errorPayload.errors.map((error) => error.msg);
			expect(messages).toEqual(
				expect.arrayContaining(['Title must be a string'])
			);
		});

		it('should fail when mainCharacters contains non-string values', async () => {
			const { res, next } = await runValidator(validators.create, {
				body: {
					title: 'Broken Roster Arc',
					description: 'Contains invalid character value.',
					mainCharacters: ['Flash', 99],
				},
			});

			expect(next).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);

			const errorPayload = res.json.mock.calls[0][0];
			const messages = errorPayload.errors.map((error) => error.msg);
			expect(messages).toEqual(
				expect.arrayContaining(['All mainCharacters must be strings'])
			);
		});
	});

	describe('update validator', () => {
		it('should fail when id is invalid', async () => {
			const { res, next } = await runValidator(validators.update, {
				params: { id: 'bad-id' },
				body: { title: 'Updated Story Arc' },
			});

			expect(next).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);

			const errorPayload = res.json.mock.calls[0][0];
			const messages = errorPayload.errors.map((error) => error.msg);
			expect(messages).toEqual(
				expect.arrayContaining(['Invalid story arc ID'])
			);
		});

		it('should pass when id and body are valid', async () => {
			const { res, next } = await runValidator(validators.update, {
				params: { id: '507f1f77bcf86cd799439011' },
				body: {
					title: 'Updated Arc Title',
					endIssue: 20,
					status: 'Ongoing',
					mainCharacters: ['Green Lantern'],
				},
			});

			expect(next).toHaveBeenCalled();
			expect(res.status).not.toHaveBeenCalled();
			expect(res.json).not.toHaveBeenCalled();
		});
	});

	describe('id-only validators', () => {
		it('getById should fail when id is invalid', async () => {
			const { res, next } = await runValidator(validators.getById, {
				params: { id: 'invalid-id' },
			});

			expect(next).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);

			const errorPayload = res.json.mock.calls[0][0];
			const messages = errorPayload.errors.map((error) => error.msg);
			expect(messages).toEqual(
				expect.arrayContaining(['Invalid story arc ID'])
			);
		});

		it('delete should pass when id is a valid Mongo ID', async () => {
			const { res, next } = await runValidator(validators.delete, {
				params: { id: '507f1f77bcf86cd799439011' },
			});

			expect(next).toHaveBeenCalled();
			expect(res.status).not.toHaveBeenCalled();
			expect(res.json).not.toHaveBeenCalled();
		});
	});
});
