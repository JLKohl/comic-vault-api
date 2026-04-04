const express = require('express');
const router = express.Router();
const storyArcController = require('../controllers/storyArcController');
const { validators } = require('../validation/storyArcValidation');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get(
  '/',
  /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/story-arc'
    */
    storyArcController.getAllStoryArcs
);

router.get(
  '/:id',
  /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/story-arc/{id}'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Story Arc ID',
      required: true,
      type: 'string'
     }
    */
    validators.getById,
    storyArcController.getStoryArcById
);

router.post(
  '/',
  /* #swagger.tags = ['Story Arc']
     #swagger.path = '/api/story-arc'
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "The Dark Saga" },
                description: { type: "string", example: "A long and epic arc..." },
                mainCharacters: {
                  type: "array",
                  items: { type: "string" },
                  example: ["Hero", "Villain"]
                },
                startIssue: { type: "number", example: 1 },
                endIssue: { type: "number", example: 10 },
                status: {
                  type: "string",
                  example: "Ongoing"
                }
              },
              required: ["title", "description"]
            }
          }
        }
     }
  */
    ensureAuthenticated,
    validators.create,
    storyArcController.createStoryArc
);

router.put(
  '/:id',
  /* #swagger.tags = ['Story Arc']
     #swagger.path = '/api/story-arc/{id}'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'Story Arc ID',
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
                title: { type: "string", example: "Updated Saga Title" },
                description: { type: "string", example: "Updated description..." },
                mainCharacters: {
                  type: "array",
                  items: { type: "string" },
                  example: ["Hero", "New Villain"]
                },
                startIssue: { type: "number", example: 2 },
                endIssue: { type: "number", example: 12 },
                status: {
                  type: "string",
                  example: "Completed"
                }
              }
            }
          }
        }
     }
  */
    ensureAuthenticated,
    validators.update,
    storyArcController.updateStoryArc
);

router.delete(
  '/:id',
  /* #swagger.tags = ['Story Arc']
     #swagger.path = '/api/story-arc/{id}'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'Story Arc ID',
        required: true,
        type: 'string'
     }
  */
    ensureAuthenticated,
    validators.delete,
    storyArcController.deleteStoryArc
);

module.exports = router;
