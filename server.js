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

app.post('/insert',function(req,res){
    //make a request
    pool.query(`INSERT INTO "user" ("name", "mob", "game", "place", "lat", "long")
VALUES ($1, $2, NULL, NULL, $3, $4);`,[req.body.name, req.body.mob, req.body.lat, req.body.long],function(err,result){
        if(err){
            res.status(500).send({error: err.toString()});
        }
        else
        {
            res.send({message: "Success"});
        }
    });
    //respond with data
});


app.post('/update',function(req,res){
    //make a request
    pool.query(`UPDATE "user" SET
        "game" = $1,
        "place" = $2,
        "lat" = $3,
        "long" = $4'
        WHERE "name" = 'cool';`
        ,[req.body.game, req.body.place, req.body.lat, req.body.long],function(err,result){
            if(err){
                res.status(500).send({error: err.toString()});
            }
            else{
                res.send({message: "Success"});
            }
    });
    //respond with data
});

app.get('/select_game',function(req,res){
    pool.query(`SELECT "fname","fmob","game", "place" FROM "find_game" 
        WHERE "yname" = '$1';`
        ,[req.body.name],function(err,result){
            if(err){
                res.status(500).send({error: err.toString()});
            }
            else{
                if(result.length.rows===0)
                    res.send({error:"No rows"});
                else
                    res.send(result.rows[0]);
            }
    });
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
