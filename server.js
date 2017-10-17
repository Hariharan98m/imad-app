var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));


var bodyParser=require('body-parser');
app.use(bodyParser.json());

var Pool=require('pg').Pool;
var config={
   user:'hariharanm2016',
   database:'hariharanm2016',
   host:'db.imad.hasura-app.io',
   port:'5432',
   password:process.env.DB_PASSWORD
};
var pool=new Pool(config);

app.get('/test-db',function(req,res){
    //make a request
    var name='hari2';
    pool.query("INSERT INTO 'user' ('name', 'mob', 'game', 'place', 'lat', 'long') VALUES ($1, '', NULL, NULL, '12.3', '16.5');",[name],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else
        {
            res.send('Success');
        }
    });
    //respond with data
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
