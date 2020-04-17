var express = require('express');
var router = express.Router();
var query = require('../public/javascripts/query');
var db= require('../models/db');
var crypto = require('crypto-js/md5');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CMPT Final Project' , session: req.session, error: null});
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
          response.redirect('/');
      });
});

router.get('/logout', function(request, response){
    if(request.session.username && request.cookies.session_id){
        response.clearCookie('session_id');
        response.redirect('../');
    }else{
        response.redirect('/login');
    }
});

router.get('/flash', function(req, res){
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.flash('info', 'Please Login')
    res.redirect('/');
});

module.exports = router;
