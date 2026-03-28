const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// GET all characters
router.get('/', characterController.getAllCharacters);

// GET a specific character by ID
router.get('/:id', characterController.getCharacterById);

// POST a new character
router.post('/', ensureAuthenticated, characterController.createCharacter);

// PUT - update a character
router.put('/:id', ensureAuthenticated, characterController.updateCharacter);

// DELETE a character
router.delete('/:id', ensureAuthenticated, characterController.deleteCharacter);

module.exports = router;
