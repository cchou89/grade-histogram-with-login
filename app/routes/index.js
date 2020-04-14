var express = require('express');
var router = express.Router();
var query = require('../public/javascripts/query');
var db= require('../models/db');
var crypto = require('crypto')
    .createHash('md5');
var jwt = require('jsonwebtoken');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async function(request, response){
    var accessToken;
    var username = request.body.username;
    var password = request.body.password;
    password = crypto.update(password).digest('hex');

  //verify username and password
  const results = await query(
      db,
      "SELECT * FROM `users` where username = '" + username + "' AND '" + password + "'"
  ).catch(console.log)
      .then(function(result){
          if(result){
              console.log(result);
              //generate token
              accessToken = jwt.sign(
                  {user: username},
                  'secretkey',
                  (err, token)=>{
                      response.json({
                          token
                      });
                  });
          }
  });
});

module.exports = router;
