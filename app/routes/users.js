var express = require('express');
var router = express.Router();
var verifyToken = require('../public/javascripts/verifyToken');
var csv = require("csvtojson");
const fs = require('fs');



/* GET users listing. */
router.get('/', verifyToken, function(request, response) {
  console.log(request.session);
  console.log(request.cookies);
  response.render('users/index', {
                                  title: 'CMPT 470 Grade Compiler',
                                  session: request.session,
                                  tableHeaders: null,
                                  json: null});
});

router.post('/compile', async function(request, response){
  console.log(request.files.csvfile);
  const csvFilePath=request.files.csvfile.tempFilePath;
  var jsonArray = await csv().fromFile(csvFilePath);
  var headers = getHeaders(jsonArray);
  var totals = jsonArray.filter(studentRec => studentRec.studentID === 'total');
  jsonArray.forEach(function(record) {
      var semesterGrade = 0;
      if(record.studentID !== 'total'){
          headers.forEach(function (item) {
              if (item !== 'studentID') {
                  var gradeItem = parseFloat(record[item]);
                  var totalScore = parseFloat(totals[0][item]);
                  gradeItem /= 100;
                  gradeItem *= totalScore;
                  semesterGrade += gradeItem;
              }
          });
          record.Semester = semesterGrade;
      }else{
          record.Semester = 100;
      }
  });
  response.render('users/index', {title: 'CMPT 470 Grade Compiler',
                                    session: request.session,
                                    tableHeaders: headers,
                                    json: jsonArray
                                    });

});


router.get('/:username', verifyToken, function(req, res) {
  res.send('respond with a resource');
});

function getHeaders(jsonArray) {
    var headers = [];
    for (x in jsonArray[0]) {
        headers.push(x);
    }
    return headers;
}

module.exports = router;
