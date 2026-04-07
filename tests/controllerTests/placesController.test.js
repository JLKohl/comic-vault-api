// Mock the places model
jest.mock('../../src/models/places');

const Place = require('../../src/models/places');
const controller = require('../../src/controllers/placesController');

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

// getAllPlaces
describe('getAllPlaces', () => {
	it('should return all places', async () => {
		const mockData = [{ name: 'Arlen Park' }];

		Place.find.mockResolvedValue(mockData);

		const req = mockRequest();
		const res = mockResponse();

		await controller.getAllPlaces(req, res);

		expect(Place.find).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockData);
	});

	it('should handle errors', async () => {
		Place.find.mockRejectedValue(new Error('DB error'));

		const req = mockRequest();
		const res = mockResponse();

		await controller.getAllPlaces(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
	});
});

// getPlaceById
describe('getPlaceById', () => {
	it('should return a place', async () => {
		const mockPlace = { id: '1', name: 'MegaloMart' };

		Place.findById.mockResolvedValue(mockPlace);

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.getPlaceById(req, res);

		expect(Place.findById).toHaveBeenCalledWith('1');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockPlace);
	});

	it('should return 404 if place not found', async () => {
		Place.findById.mockResolvedValue(null);

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.getPlaceById(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'Place not found' });
	});

	it('should handle errors', async () => {
		Place.findById.mockRejectedValue(new Error('DB error'));

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.getPlaceById(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
	});
});

// createPlace
describe('createPlace', () => {
	it('should create a new place', async () => {
		const mockSave = jest.fn().mockResolvedValue({ name: 'Tom Landry Middle School' });

		Place.mockImplementation(() => ({
			save: mockSave,
		}));

		const req = mockRequest({ body: { name: 'Tom Landry Middle School' } });
		const res = mockResponse();

		await controller.createPlace(req, res);

		expect(mockSave).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ name: 'Tom Landry Middle School' });
	});

	it('should handle validation errors', async () => {
		const mockSave = jest.fn().mockRejectedValue(new Error('Invalid data'));

		Place.mockImplementation(() => ({
			save: mockSave,
		}));

		const req = mockRequest({ body: {} });
		const res = mockResponse();

		await controller.createPlace(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Validation Error',
			error: 'Invalid data',
		});
	});
});

// updatePlace
describe('updatePlace', () => {
	it('should update a place', async () => {
		const updatedPlace = { name: 'Updated Place Name' };

		Place.findByIdAndUpdate.mockResolvedValue(updatedPlace);

		const req = mockRequest({
			params: { id: '1' },
			body: { name: 'Updated Place Name' },
		});
		const res = mockResponse();

		await controller.updatePlace(req, res);

		expect(Place.findByIdAndUpdate).toHaveBeenCalledWith(
			'1',
			{ name: 'Updated Place Name' },
			{ new: true, runValidators: true }
		);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(updatedPlace);
	});

	it('should return 404 if place not found', async () => {
		Place.findByIdAndUpdate.mockResolvedValue(null);

		const req = mockRequest({ params: { id: '1' }, body: {} });
		const res = mockResponse();

		await controller.updatePlace(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'Place not found' });
	});

	it('should handle update errors', async () => {
		Place.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

		const req = mockRequest({ params: { id: '1' }, body: {} });
		const res = mockResponse();

		await controller.updatePlace(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Update failed',
			error: 'Update failed',
		});
	});
});

// deletePlace
describe('deletePlace', () => {
	it('should delete a place', async () => {
		Place.findByIdAndDelete.mockResolvedValue({});

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.deletePlace(req, res);

		expect(Place.findByIdAndDelete).toHaveBeenCalledWith('1');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Place deleted successfully',
		});
	});

	it('should return 404 if place not found', async () => {
		Place.findByIdAndDelete.mockResolvedValue(null);

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.deletePlace(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: 'Place not found' });
	});

	it('should handle errors', async () => {
		Place.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

		const req = mockRequest({ params: { id: '1' } });
		const res = mockResponse();

		await controller.deletePlace(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
	});
});
