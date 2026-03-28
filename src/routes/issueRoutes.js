const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// #swagger.tags = ['Issues']

// GET all issues
// #swagger.description = 'Retrieve all comic book issues from the vault.'
router.get('/', issueController.getAllIssues);

// GET a single issue by ID
// #swagger.description = 'Get details of a specific issue using its unique ID.'
router.get('/:id', issueController.getIssueById);

// POST a new issue
// #swagger.description = 'Add a new comic book issue to the database.'
/* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Issue Information',
    schema: { $ref: '#/definitions/Issue' }
} */
router.post('/', ensureAuthenticated, issueController.createIssue);

// PUT (Update) an existing issue
// #swagger.description = 'Update the details of an existing issue.'
router.put('/:id', ensureAuthenticated, issueController.updateIssue);

// DELETE an issue
// #swagger.description = 'Remove an issue from the vault permanently.'
router.delete('/:id', ensureAuthenticated, issueController.deleteIssue);

module.exports = router;