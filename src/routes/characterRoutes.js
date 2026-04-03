const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const { validators } = require('../validation/characterValidation');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get(
  '/',
  /* #swagger.tags = ['Character']
     #swagger.path = '/api/characters'
  */
  characterController.getAllCharacters
);

router.get(
  '/:id',
  /* #swagger.tags = ['Character']
     #swagger.path = '/api/characters/{id}'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'Character ID',
        required: true,
        type: 'string'
     }
  */
  validators.getById,
  characterController.getCharacterById
);

router.post(
  '/',
  /* #swagger.tags = ['Character']
     #swagger.path = '/api/characters'
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Spider-Man" },
                alias: { type: "string", example: "Peter Parker" },
                abilities: {
                  type: "array",
                  items: { type: "string" },
                  example: ["Wall-crawling", "Spider sense"]
                }
              },
              required: ["name"]
            }
          }
        }
     }
  */
  ensureAuthenticated,
  validators.create,
  characterController.createCharacter
);

router.put(
  '/:id',
  /* #swagger.tags = ['Character']
     #swagger.path = '/api/characters/{id}'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'Character ID',
        required: true,
        type: 'string'
     }
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Updated Name" },
                alias: { type: "string", example: "Updated Alias" },
                abilities: {
                  type: "array",
                  items: { type: "string" },
                  example: ["New Power"]
                }
              }
            }
          }
        }
     }
  */
  ensureAuthenticated,
  validators.update,
  characterController.updateCharacter
);

router.delete(
  '/:id',
  /* #swagger.tags = ['Character']
     #swagger.path = '/api/characters/{id}'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'Character ID',
        required: true,
        type: 'string'
     }
  */
  ensureAuthenticated,
  validators.delete,
  characterController.deleteCharacter
);

module.exports = router;