const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/', 
    /* #swagger.tags = ['Issues']
    #swagger.path = '/api/issues'
    */
    issueController.getAllIssues);

// GET a single issue by ID
router.get('/:id', 
    /* #swagger.tags = ['Issues']
    #swagger.path = '/api/issues'
    */
    issueController.getIssueById);

// POST a new issue
router.post('/', 
    /* #swagger.tags = ['Issues']
    #swagger.path = '/api/issues'
    */
    ensureAuthenticated, issueController.createIssue);

// PUT (Update) an existing issue
router.put('/:id',
    /* #swagger.tags = ['Issues']
    #swagger.path = '/api/issues'
    */
    ensureAuthenticated, issueController.updateIssue);

// DELETE an issue
router.delete('/:id', 
    /* #swagger.tags = ['Issues']
    #swagger.path = '/api/issues'
    */
    ensureAuthenticated, issueController.deleteIssue);

module.exports = router;