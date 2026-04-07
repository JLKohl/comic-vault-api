// Mock the story arc model
jest.mock('../src/models/storyArc');

const StoryArc = require('../src/models/storyArc');
const controller = require('../src/controllers/storyArcController');

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

// getAllStoryArcs
describe('getAllStoryArcs', () => {
  it('should return all story arcs', async () => {
    const mockData = [{ title: 'The Wind in the Willows' }];

    StoryArc.find.mockResolvedValue(mockData);

    const req = mockRequest();
    const res = mockResponse();

    await controller.getAllStoryArcs(req, res);

    expect(StoryArc.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should handle errors', async () => {
    StoryArc.find.mockRejectedValue(new Error('DB Error'));

    const req = mockRequest();
    const res = mockResponse();

    await controller.getAllStoryArcs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB Error' });
  });
});

// getStoryArcById
describe('getStoryArcById', () => {
  it('should return a story arc', async () => {
    const mockStoryArc = { id: '1', name: 'Time After Time' };

    StoryArc.findById.mockResolvedValue(mockStoryArc);

    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();

    await controller.getStoryArcById(req, res);

    expect(StoryArc.findById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStoryArc);
  });

  it('should return 404 if story arc not found', async () => {
    StoryArc.findById.mockResolvedValue(null);

    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();

    await controller.getStoryArcById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Story arc not found' });
  });

  it('should handle errors', async () => {
    StoryArc.findById.mockRejectedValue(new Error('DB error'));

    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();

    await controller.getStoryArcById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
  });
});

// createStoryArc
describe('createStoryArc', () => {
  it('should create a new story arc', async () => {
    const mockSave = jest.fn().mockResolvedValue({ title: 'Wanderlust' });

    StoryArc.mockImplementation(() => ({
      save: mockSave,
    }));

    const req = mockRequest({ body: { title: 'Wanderlust' } });
    const res = mockResponse();

    await controller.createStoryArc(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ title: 'Wanderlust' });
  });

  it('should handle validation errors', async () => {
    const mockSave = jest.fn().mockRejectedValue(new Error('Invalid data'));

    StoryArc.mockImplementation(() => ({
      save: mockSave,
    }));

    const req = mockRequest({ body: {} });
    const res = mockResponse();

    await controller.createStoryArc(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation Error',
      error: 'Invalid data',
    });
  });
});

// updateStoryArc
describe('updateStoryArc', () => {
  it('should update a story arc', async () => {
    const updatedStoryArc = { title: 'Not All Who Wander Are Lost' };

    StoryArc.findByIdAndUpdate.mockResolvedValue(updatedStoryArc);

    const req = mockRequest({
      params: { id: '1' },
      body: { title: 'Not All Who Wander Are Lost' },
    });
    const res = mockResponse();

    await controller.updateStoryArc(req, res);

    expect(StoryArc.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      { title: 'Not All Who Wander Are Lost' },
      { new: true, runValidators: true }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedStoryArc);
  });

  it('should return 404 if story arc not found', async () => {
    StoryArc.findByIdAndUpdate.mockResolvedValue(null);

    const req = mockRequest({ params: { id: '1' }, body: {} });
    const res = mockResponse();

    await controller.updateStoryArc(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Story arc not found' });
  });

  it('should handle update errors', async () => {
    StoryArc.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

    const req = mockRequest({ params: { id: '1' }, body: {} });
    const res = mockResponse();

    await controller.updateStoryArc(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Update failed',
      error: 'Update failed',
    });
  });
});

//deleteStoryArc
describe('deleteStoryArc', () => {
  it('should delete a story arc', async () => {
    StoryArc.findByIdAndDelete.mockResolvedValue({});

    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();

    await controller.deleteStoryArc(req, res);

    expect(StoryArc.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Story arc deleted successfully',
    });
  });

  it('should return 404 if story arc not found', async () => {
    StoryArc.findByIdAndDelete.mockResolvedValue(null);

    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();

    await controller.deleteStoryArc(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Story arc not found' });
  });

  it('should handle errors', async () => {
    StoryArc.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();

    await controller.deleteStoryArc(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
  });
});
