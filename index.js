var csv = require('csvtojson');
var mustache = require('mustache');
var fs = require('fs');

var inputFile = 'input.csv';
var templateFile = 'template.html';
var outputFile = 'output.html';

var template = fs.readFileSync(templateFile, 'utf8');

var results = [];

csv()
  .fromFile(__dirname + '/' + inputFile)
  .on('json', (data) => {
    try {
      results.push(data);
    } catch (e) {
      console.error(e.stack)
    }
  })
  .on('done', function (count) {
    var pass = 0;
    var fail = 0;
    var ignore = 0;
    var total = 0;

    for (var i = 0; i < results.length; i++) {
      var item = results[i];
      var result = item.Result.toLowerCase().trim();

      if (result === 'pass') {
        pass++;
        item.resultClass = "pass";
      }
      else if (result === 'fail') {
        fail++;
        item.resultClass = "fail";
      }
      else {
        ignore++;
        item.resultClass = "ignore";
      }

      total++;
    }
    var data = {
      pass: pass,
      fail: fail,
      ignore: ignore,
      total: total,      
      results: results,
    };
    var output = mustache.render(template, data);
    fs.writeFileSync(outputFile, output, 'utf8')
    console.log("done!");
  });