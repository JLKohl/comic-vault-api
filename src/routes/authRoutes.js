const express = require('express');
const passport = require('passport');
const router = express.Router();

//sending to google for login 
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {

        res.redirect('/api-docs'); //directs to swagger when logged in
    }
);

router.get('/logout', (req, res, next) => {

    req.logout(function(err) {
      if (err) { return next(err); }
  
      req.session.destroy(() => {
  
        res.clearCookie('connect.sid');
  
        res.redirect('/');
  
      });
  
    });
  
  });

module.exports = router;