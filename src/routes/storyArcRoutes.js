const express = require('express');
const router = express.Router();
const storyArcController = require('../controllers/storyArcController');

// GET all story arcs
router.get('/', storyArcController.getAllStoryArcs);

// GET a specific story arc by ID
router.get('/:id', storyArcController.getStoryArcById);

// POST a new story arc
router.post('/', storyArcController.createStoryArc);

// PUT/PATCH to update a story arc
router.put('/:id', storyArcController.updateStoryArc);

// DELETE a story arc
router.delete('/:id', storyArcController.deleteStoryArc);

module.exports = router;