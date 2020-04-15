var express = require('express');
var router = express.Router();
var verifyToken = require('../public/javascripts/verifyToken');
var csv = require("csvtojson");
const fs = require('fs');



/* GET users listing. */
router.get('/', verifyToken, function(request, response) {
  console.log(request.session);
  console.log(request.cookies);
  response.render('users/index', {title: 'CMPT 470 Grade Compiler', session: request.session});
});

router.post('/compile', async function(request, response){
  console.log(request.files.csvfile);
  const csvFilePath=request.files.csvfile.tempFilePath;
  csv().fromFile(csvFilePath)
      .then()
});


router.get('/:username', verifyToken, function(req, res) {
  res.send('respond with a resource');
});



module.exports = router;
