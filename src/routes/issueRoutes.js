const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { validators } = require('../validation/issueValidation');
const { ensureAuthenticated } = require('../middleware/authMiddleware');


router.get(
  '/',
  /* #swagger.tags = ['Issue']
     #swagger.path = '/api/issues'
  */
  issueController.getAllIssues
);

router.get(
  '/:id',
  /* #swagger.tags = ['Issue']
    #swagger.path = '/api/issues/{id}'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Issue ID',
      required: true,
      type: 'string'
    }
  */
  validators.getById,
  issueController.getIssueById
);

router.post(
  '/',
  /* #swagger.tags = ['Issue']
     #swagger.path = '/api/issues'
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "Issue #1" },
                issueNumber: { type: "number", example: 1 },
                description: { type: "string", example: "First issue description" },
                releaseDate: { type: "string", example: "2026-04-01" }
              },
              required: ["title", "issueNumber"]
            }
          }
        }
     }
  */
  ensureAuthenticated,
  validators.create,
  issueController.createIssue
);

router.put(
  '/:id',
  /* #swagger.tags = ['Issue']
     #swagger.path = '/api/issues/{id}'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'Issue ID',
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
                title: { type: "string", example: "Updated Issue Title" },
                issueNumber: { type: "number", example: 2 },
                description: { type: "string", example: "Updated description" },
                releaseDate: { type: "string", example: "2026-05-01" }
              }
            }
          }
        }
     }
  */
  ensureAuthenticated,
  validators.update,
  issueController.updateIssue
);

router.delete(
  '/:id',
  /* #swagger.tags = ['Issue']
     #swagger.path = '/api/issues/{id}'
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'Issue ID',
        required: true,
        type: 'string'
     }
  */
  ensureAuthenticated,
  validators.delete,
  issueController.deleteIssue
);

module.exports = router;