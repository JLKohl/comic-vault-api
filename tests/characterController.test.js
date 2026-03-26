// Mock the characters model
jest.mock('../src/models/characters');

const Character = require('../src/models/characters');
const controller = require('../src/controllers/characterController');

// Helpers to mock Express req/res
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (data = {}) => ({
    params: data.params || {},
    body: data.body || {}
});

beforeEach(() => {
    jest.clearAllMocks();
});

// getAllCharacters
describe('getAllCharacters', () => {
    it('should return all characters', async () => {
        const mockData = [{ name: 'Bobby' }];

        Character.find.mockResolvedValue(mockData);

        const req = mockRequest();
        const res = mockResponse();

        await controller.getAllCharacters(req, res);

        expect(Character.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle errors', async () => {
        Character.find.mockRejectedValue(new Error('DB error'));

        const req = mockRequest();
        const res = mockResponse();

        await controller.getAllCharacters(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
});

// getCharacterById
describe('getCharacterById', () => {
    it('should return a character', async () => {
        const mockCharacter = { id: '1', name: 'Hank' };

        Character.findById.mockResolvedValue(mockCharacter);

        const req = mockRequest({ params: { id: '1' } });
        const res = mockResponse();

        await controller.getCharacterById(req, res);

        expect(Character.findById).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCharacter);
    });

    it('should return 404 if character not found', async () => {
        Character.findById.mockResolvedValue(null);

        const req = mockRequest({ params: { id: '1' } });
        const res = mockResponse();

        await controller.getCharacterById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Character not found' });
    });

    it('should handle errors', async () => {
        Character.findById.mockRejectedValue(new Error('DB error'));

        const req = mockRequest({ params: { id: '1' } });
        const res = mockResponse();

        await controller.getCharacterById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
});

// createCharacter
describe('createCharacter', () => {
  it('should create a new character', async () => {
    const mockSave = jest.fn().mockResolvedValue({ name: 'Naruto' });

    Character.mockImplementation(() => ({
      save: mockSave
    }));

    const req = mockRequest({ body: { name: 'Naruto' } });
    const res = mockResponse();

    await controller.createCharacter(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ name: 'Naruto' });
  });

  it('should handle validation errors', async () => {
    const mockSave = jest.fn().mockRejectedValue(new Error('Invalid data'));

    Character.mockImplementation(() => ({
      save: mockSave
    }));

    const req = mockRequest({ body: {} });
    const res = mockResponse();

    await controller.createCharacter(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation Error',
      error: 'Invalid data'
    });
  });
});

// updateCharacter
describe('updateCharacter', () => {
  it('should update a character', async () => {
    const updatedCharacter = { name: 'Updated Name' };

    Character.findByIdAndUpdate.mockResolvedValue(updatedCharacter);

    const req = mockRequest({
      params: { id: '1' },
      body: { name: 'Updated Name' }
    });
    const res = mockResponse();

    await controller.updateCharacter(req, res);

    expect(Character.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      { name: 'Updated Name' },
      { new: true, runValidators: true }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedCharacter);
  });

  it('should return 404 if character not found', async () => {
    Character.findByIdAndUpdate.mockResolvedValue(null);

    const req = mockRequest({ params: { id: '1' }, body: {} });
    const res = mockResponse();

    await controller.updateCharacter(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Character not found' });
  });

  it('should handle update errors', async () => {
    Character.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

    const req = mockRequest({ params: { id: '1' }, body: {} });
    const res = mockResponse();

    await controller.updateCharacter(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Update failed',
      error: 'Update failed'
    });
  });
});

// deleteCharacter
describe('deleteCharacter', () => {
  it('should delete a character', async () => {
    Character.findByIdAndDelete.mockResolvedValue({});

    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();

    await controller.deleteCharacter(req, res);

    expect(Character.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Character deleted successfully'
    });
  });

  it('should return 404 if character not found', async () => {
    Character.findByIdAndDelete.mockResolvedValue(null);

    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();

    await controller.deleteCharacter(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Character not found' });
  });

  it('should handle errors', async () => {
    Character.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();

    await controller.deleteCharacter(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
  });
});
