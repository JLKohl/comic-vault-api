const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// GET all characters
router.get('/', 
    /* #swagger.tags = ['Characters']
    #swagger.path = '/api/characters'
    */
    characterController.getAllCharacters);

// GET a specific character by ID
router.get('/:id', 
    /* #swagger.tags = ['Characters']
    #swagger.path = '/api/characters'
    */
    characterController.getCharacterById);

// POST a new character
router.post('/', 
    /* #swagger.tags = ['Characters']
    #swagger.path = '/api/characters'
    */
    characterController.createCharacter);

// PUT/PATCH to update a character
router.put('/:id', 
    /* #swagger.tags = ['Characters']
    #swagger.path = '/api/characters'
    */
    characterController.updateCharacter);

// DELETE a character
router.delete('/:id', 
    /* #swagger.tags = ['Characters']
    #swagger.path = '/api/characters'
    */
    characterController.deleteCharacter);

module.exports = router;
