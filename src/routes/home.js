const express = require('express');
const router = express.Router();
const characterRoutes = require('./characterRoutes');
const issueRoutes = require('./issueRoutes');

router.use('/characters', characterRoutes);
router.use('/issues', issueRoutes);

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
