var express = require('express');
var router = express.Router();
var verifyToken = require('../public/javascripts/verifyToken');

/* GET users listing. */
router.get('/', verifyToken, function(request, response) {
  console.log(request.session);
  console.log(request.cookies);
  response.render('users/index', { title: 'Express', message: 'this works'});
});


router.get('/:username', verifyToken, function(req, res) {
  res.send('respond with a resource');
});



module.exports = router;
