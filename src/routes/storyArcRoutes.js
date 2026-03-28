const express = require('express');
const router = express.Router();
const storyArcController = require('../controllers/storyArcController');

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
    #swagger.path = '/api/story-arc'
    */
  storyArcController.getStoryArcById
);

router.post(
  '/',
  /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/story-arc'
    */
  storyArcController.createStoryArc
);

router.put(
  '/:id',
  /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/story-arc'
    */
  storyArcController.updateStoryArc
);

router.delete(
  '/:id',
  /* #swagger.tags = ['Story Arc']
    #swagger.path = '/api/story-arc'
    */
  storyArcController.deleteStoryArc
);

module.exports = router;
