const Character = require('../models/characters');

exports.getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find();
    res.status(200).json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character)
      return res.status(404).json({ message: 'Character not found' });
    res.status(200).json(character);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 1. CREATE a new character
exports.createCharacter = async (req, res) => {
  try {
    const newCharacter = new Character(req.body);
    const savedCharacter = await newCharacter.save();
    res.status(201).json(savedCharacter);
  } catch (err) {
    res.status(400).json({ message: 'Validation Error', error: err.message });
  }
};

// 2. UPDATE an existing character
exports.updateCharacter = async (req, res) => {
  try {
    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCharacter) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.status(200).json(updatedCharacter);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

// 3. DELETE a character
exports.deleteCharacter = async (req, res) => {
  try {
    const deletedCharacter = await Character.findByIdAndDelete(req.params.id);

    if (!deletedCharacter) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.status(200).json({ message: 'Character deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
