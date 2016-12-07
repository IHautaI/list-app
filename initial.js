var express = require('express');
var fs = require('fs');
var compression = require('compression');

var app = express();

app.use(compression());
app.use("/public", express.static('public'));

var bodyParser = require('body-parser');

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var data_dir = "./data/"

var listRender = function(res, name){ return function(err, data) {
  if (err) throw err;

  var arr = data.toString()
    .split('\n')
    .filter(function(x){return x != ""});

    res.render('list', {list: arr, name: name});
};};


var addEntry = function(req, res) {
  fs.stat(data_dir + req.body.name, function(err, stats){
    if (err) throw err;
    if(stats.isFile()){
      fs.appendFile(data_dir + req.body.name, req.body.item + "\n", 'utf8', function(err){
        if (err) throw err;
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(304);
    }
  });
};


var dropEntry = function(req, res) {

  fs.stat(data_dir + req.body.name, function(err, stats){
    if (err) throw err;

    if(stats.isFile()){
      fs.readFile(data_dir + req.body.name, function(err, data) {
        if (err) throw err;

        var list = data.toString()
          .split("\n")
          .filter(function(x){return x != ""});

        var idx = list.indexOf(req.body.item);

        if(idx != -1){
          list = list.slice(0, idx)
            .concat(list.slice(idx + 1, list.length));

          fs.writeFile(data_dir + req.body.name, list.join("\n") + "\n", function(err) {
            if (err) throw err;
            res.sendStatus(200);
          });
        } else {
          res.sendStatus(304);
        }
      });
    } else {
      res.sendStatus(304);
    }
  });
};


var showList = function(req, res) {
  fs.readFile(data_dir + req.params.name, listRender(res, req.params.name));
};


var showMain = function(req, res){
  fs.readdir(data_dir, function(err, files){
    res.render("main", {files: files});
  });
};


var addList = function(req, res){
  fs.writeFile(data_dir + req.body.name, "", function(err){
    if(err) throw err;
    res.redirect("/list/" + req.body.name);
  });
};


var dropList = function(req, res){
  // first check the file exists in the correct directory
  // then delete
  fs.stat(data_dir + req.body.name, function(err, stats){
    if (err) throw err;
    if(stats.isFile()){
      fs.unlink(data_dir + req.body.name, function(err){
        if (err) throw err;
        res.redirect("/");
      });
    }
  });

};


app.get('/', showMain);

app.post("/add", addList);
app.post("/drop", dropList);

app.get("/list/:name", showList);

app.post('/list/add', addEntry);
app.post('/list/drop', dropEntry);

app.listen(8080);
