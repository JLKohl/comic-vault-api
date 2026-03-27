const express = require('express');
const router = express.Router();
const storyArcController = require('../controllers/storyArcController');


router.get('/', 
    /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/storyArc'
    */
    storyArcController.getAllStoryArcs);

router.get('/:id', 
    /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/storyArc'
    */
    storyArcController.getStoryArcById);

router.post('/', 
    /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/storyArc'
    */
    storyArcController.createStoryArc);

router.put('/:id', 
    /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/storyArc'
    */
    storyArcController.updateStoryArc);

router.delete('/:id', 
    /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/storyArc'
    */
    storyArcController.deleteStoryArc);

module.exports = router;