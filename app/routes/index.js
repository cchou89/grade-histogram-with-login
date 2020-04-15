var express = require('express');
var router = express.Router();
var query = require('../public/javascripts/query');
var db= require('../models/db');
var crypto = require('crypto-js/md5');
var jwt = require('jsonwebtoken');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , session: req.session});
});

router.post('/login', async function(request, response){
    var username = request.body.username;
    var password = request.body.password;

  //verify username and password
    await query(
        db,
        "SELECT * FROM `users` where username = '" + username + "'"
    )
        .catch(console.log)
        .then(function(result) {
          //set user session
          var hashedPass = crypto(password);
          if(hashedPass.toString() === result[0].password){
              request.session.username = result[0].username;
              //move to user page
              response.redirect('/users');
          }else{
              response.redirect('/');
          }})
        .catch(function(error){
          console.log('you know nothing');
          response.redirect('/');
      });
});

router.get('/logout', function(request, response){
    if(request.sesson.user && request.cookies.session_id){
        response.clearCookie('user_sid');
        response.redirect('../');
    }else{
        response.redirect('/login');
    }
});

module.exports = router;
