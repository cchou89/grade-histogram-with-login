var express = require('express');
var router = express.Router();
var verifyToken = require('../public/javascripts/verifyToken');
var csv = require("csvtojson");


/* GET users listing. */
router.get('/', verifyToken, function(request, response) {
  response.render('users/index', {
                                    title: 'CMPT 470 Grade Compiler',
                                    session: request.session,
                                    tableHeaders: null,
                                    json: null,
                                    gradeCounts: null,
                                    cutoffs: null,
                                    letterGrade: null});
});

router.post('/compile', async function(request, response){
  const csvFilePath=request.files.csvfile.tempFilePath;
  var gradeArray = request.body.grade;
  gradeArray = fixCutoffs(gradeArray);
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

  headers.push('Semester');
  var gradeCounts = cutOffs(jsonArray, gradeArray);
  console.log(jsonArray);
  response.render('users/index', {title: 'CMPT 470 Grade Compiler',
                                    session: request.session,
                                    tableHeaders: headers,
                                    json: jsonArray,
                                    gradeCounts: gradeCounts,
                                    cutoffs: gradeArray,
                                    letterGrade: letterGrades,
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

var letterGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

function fixCutoffs(cutoff){
    var copy = cutoff;
    var cutoff1= 0;
    var cutoff2 = 0;
    for (var i = 0; i < 10; i++) { //Iterate through list of lettergrades
        if(i ===0){
            cutoff1 = copy[i];
        }else{
            cutoff2 = copy[i];
            if(cutoff2 === cutoff1){
                copy[i] = cutoff2-1;
            }else if(cutoff2>cutoff1){
                cutoff2 = cutoff1-1;
                copy[i]= cutoff2;
            }else {
                cutoff1 = cutoff2;
            }
        }
    }
    return copy;
}

function cutOffs(jsonArray, gradeArray) {
    var histogramCounts= {
        'A+': 0,
        'A': 0,
        'A-': 0,
        'B+': 0,
        'B':  0,
        'B-': 0,
        'C+': 0,
        'C':  0,
        'C-': 0,
        'D': 0,
        'F': 0,
    };

    var letterGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

    for(var k= 0; k<jsonArray.length; k++){
        var max = 100;
        var min = 0;
        if(jsonArray[k].studentID !== 'total') {
            for (var i = 0; i < 11; i++) { //Iterate through list of lettergrades
                if (i === 0) {
                    min = gradeArray[i];
                } else if (i === 10) {
                    max = min;
                    min = 0;
                } else {
                    max = min;
                    min = gradeArray[i];
                }
                var semester = jsonArray[k].Semester;
                if ((semester < max) && (semester >= min)){
                    histogramCounts[letterGrades[i]]++;
                }
            }
        }
    }
    return histogramCounts;
}
