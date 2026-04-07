// Mock the issue model
jest.mock('../../src/models/issue');

const Issue = require('../../src/models/issue');
const controller = require('../../src/controllers/issueController');

// Helpers to mock Express req/res
const mockResponse = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

const mockRequest = (data = {}) => ({
	params: data.params || {},
	body: data.body || {},
});

beforeEach(() => {
	jest.clearAllMocks();
});

// getAllIssues
describe('getAllIssues', () => {
	it('should return all issues', async () => {
		const mockData = [{ issueNumber: 1, title: 'Hero Rising' }];

		Issue.find.mockResolvedValue(mockData);

		const req = mockRequest();
		const res = mockResponse();

		await controller.getAllIssues(req, res);

		expect(Issue.find).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockData);
	});

	it('should handle errors', async () => {
		Issue.find.mockRejectedValue(new Error('DB error'));

		const req = mockRequest();
		const res = mockResponse();

		await controller.getAllIssues(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Error fetching issues',
			error: 'DB error',
		});
	});
});

// getIssueById
describe('getIssueById', () => {
	it('should return an issue', async () => {
		const mockIssue = { id: '1', issueNumber: 12, title: 'Shadows Return' };

		Issue.findById.mockResolvedValue(mockIssue);

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.getIssueById(req, res);

		expect(Issue.findById).toHaveBeenCalledWith('1');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockIssue);
	});

	it('should return 404 if issue not found', async () => {
		Issue.findById.mockResolvedValue(null);

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.getIssueById(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'Issue not found' });
	});

	it('should handle errors', async () => {
		Issue.findById.mockRejectedValue(new Error('Cast error'));

		const req = mockRequest({ params: { id: 'bad-id' } });
		const res = mockResponse();

		await controller.getIssueById(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Invalid ID format',
			error: 'Cast error',
		});
	});
});

// createIssue
describe('createIssue', () => {
	it('should create a new issue', async () => {
		const mockSave = jest.fn().mockResolvedValue({
			issueNumber: 3,
			title: 'Broken Oath',
		});

		Issue.mockImplementation(() => ({
			save: mockSave,
		}));

		const req = mockRequest({ body: { issueNumber: 3, title: 'Broken Oath' } });
		const res = mockResponse();

		await controller.createIssue(req, res);

		expect(mockSave).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ issueNumber: 3, title: 'Broken Oath' });
	});

	it('should handle validation errors', async () => {
		const mockSave = jest.fn().mockRejectedValue(new Error('Invalid data'));

		Issue.mockImplementation(() => ({
			save: mockSave,
		}));

		const req = mockRequest({ body: {} });
		const res = mockResponse();

		await controller.createIssue(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Error creating issue',
			error: 'Invalid data',
		});
	});
});

// updateIssue
describe('updateIssue', () => {
	it('should update an issue', async () => {
		const updatedIssue = { issueNumber: 7, title: 'Daybreak' };

		Issue.findByIdAndUpdate.mockResolvedValue(updatedIssue);

		const req = mockRequest({
			params: { id: '1' },
			body: { issueNumber: 7, title: 'Daybreak' },
		});
		const res = mockResponse();

		await controller.updateIssue(req, res);

		expect(Issue.findByIdAndUpdate).toHaveBeenCalledWith(
			'1',
			{ issueNumber: 7, title: 'Daybreak' },
			{ new: true, runValidators: true }
		);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(updatedIssue);
	});

	it('should return 404 if issue not found', async () => {
		Issue.findByIdAndUpdate.mockResolvedValue(null);

		const req = mockRequest({ params: { id: '1' }, body: {} });
		const res = mockResponse();

		await controller.updateIssue(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'Issue not found' });
	});

	it('should handle update errors', async () => {
		Issue.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

		const req = mockRequest({ params: { id: '1' }, body: {} });
		const res = mockResponse();

		await controller.updateIssue(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Error updating issue',
			error: 'Update failed',
		});
	});
});

// deleteIssue
describe('deleteIssue', () => {
	it('should delete an issue', async () => {
		Issue.findByIdAndDelete.mockResolvedValue({});

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.deleteIssue(req, res);

		expect(Issue.findByIdAndDelete).toHaveBeenCalledWith('1');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Issue deleted successfully',
		});
	});

	it('should return 404 if issue not found', async () => {
		Issue.findByIdAndDelete.mockResolvedValue(null);

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.deleteIssue(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'Issue not found' });
	});

	it('should handle errors', async () => {
		Issue.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.deleteIssue(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Error deleting issue',
			error: 'DB error',
		});
	});
});
