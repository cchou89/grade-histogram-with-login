var express = require('express');
var router = express.Router();
var query = require('../public/javascripts/query');
var db= require('../models/db');
var crypto = require('crypto')
    .createHash('md5');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async function(request, response){
  var username = request.body.username;
  var password = request.body.password;
  password = crypto.update(password).digest('hex');

  const results = await query(db, "SELECT * FROM `users` where username = '" + username + "' AND '" + password + "'").catch(console.log)
                                .then(function(result){
                                  if(result){
                                    console.log(result);
                                    response.json({result});
                                  }
  });
});

module.exports = router;
