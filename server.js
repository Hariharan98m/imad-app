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
   idleTimeoutMillis: 1000, 
   ssl : true,
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


app.post('/update_lat_long',function(req,res){
    //make a request
    pool.query(`UPDATE "user" SET
        "lat" = $1,
        "long" = $2
        WHERE "name" = $3;`
        ,[req.body.lat, req.body.long, req.body.name],function(err,result){
            if(err){
                res.status(500).send({error: err.toString()});
            }
            else{
                res.send({message: "Success"});
            }
    });
    //respond with data
});


app.post('/update_game_place',function(req,res){
    //make a request
    pool.query(`UPDATE "user" SET
        "game" = $1,
        "place" = $2
        WHERE "name" = $3;`
        ,[req.body.game, req.body.place, req.body.name],function(err,result){
            if(err){
                res.status(500).send({error: err.toString()});
            }
            else{
                res.send({message: "Success"});
            }
    });
    //respond with data
});


app.post('/select_game',function(req,res){
    var sample= new Array(10);
    pool.query(`SELECT "yname","ymob","game", "place", "flat", "flong", "ylat", "ylong" FROM "find_game" 
        WHERE "fname" = $1;`
        ,[req.body.name],function(err,result){
            if(err){
                res.status(500).send({error: err.toString()});
            }
            else{
                if(result.length.rows===0)
                    res.send({error:"No rows"});
                else{
                    for(var i=0; i< result.rows.length; i++)
                        if(getDistanceFromLatiLonInKm(result.rows[i].ylat, result.rows[i].ylong, result.rows[i].flat, result.rows[i].flong)<=0.200)
                            sample.push(result.rows[i]);
                        
                    res.send(sample);
                }
            }
    });
});


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


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
