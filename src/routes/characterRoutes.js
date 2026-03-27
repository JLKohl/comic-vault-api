const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// GET all characters
router.get('/', characterController.getAllCharacters);

// GET a specific character by ID
router.get('/:id', characterController.getCharacterById);

// POST a new character
router.post('/', characterController.createCharacter);

// PUT/PATCH to update a character
router.put('/:id', characterController.updateCharacter);

// DELETE a character
router.delete('/:id', characterController.deleteCharacter);

module.exports = router;
