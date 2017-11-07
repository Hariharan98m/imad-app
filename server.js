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

app.post('/signup', function(req, res){
    //make a request
    pool.query(`INSERT INTO "user_table" ("username", "password", "mobile")
VALUES ($1, $2, $3);`,[req.body.username, req.body.password, req.body.mobile],function(err,result){
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


app.post('/login',function(req,res){
    console.log(req.body.username);
    pool.query(`SELECT "password" FROM "user_table" WHERE "username" = $1;`
        ,[req.body.username], function(err,result){
            if(err){
                console.log(err.toString());
                res.status(500).send({error: err.toString()});
            }
            else{
                if(result.rows.length===0)
                    res.status(500).send({error:"No rows"});
                else{   console.log(password);
                        if(result.rows[0].password===req.body.password){
                            console.log(password);
                            res.send({"message":"Match Sucess"});
                        }
                        else
                            res.status(407).send({"message":"Match failed"});
                    }
                }
            });
});

app.post('/select_friends',function(req,res){
    //{"args":{"columns":["*"],"table":"confirm_invitees_friend_data","where":{"your_id":27}},"type":"select"}
    //if(req.body.args.table!=="profile_image")
        pool.query(`SELECT "*" FROM confirm_invitees_friend_data WHERE "your_id" = $1;`
            ,[req.body.args.where.your_id], function(err,result){
                if(err){
                    console.log(err.toString());
                    res.status(500).send({error: err.toString()});
                }
                else{
                    console.log(result.rows);
                    res.send(result.rows);
                    }
                });
});


app.post('/update_profile', function(req, res){
    //make a request
    pool.query(`UPDATE "user_table" set 
    "prof_name" = $1,
    "work" = $2,
    "city" = $3,
    "music_style" = $4,
    "description" = $5,
    "passion_with_music" = $6
    WHERE "id" = $7;`,[req.body.args.objects[0].prof_name, req.body.args.objects[0].work, req.body.args.objects[0].city, req.body.args.objects[0].music_style, req.body.args.objects[0].description, req.body.args.objects[0].passion_with_music, req.body.args.objects[0].id],function(err,result){
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

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


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



app.post('/select_game',function(req,res){
    var sample= [];
    pool.query(`SELECT "yname","ymob","game", "place", "flat", "flong", "ylat", "ylong" FROM "find_game" 
        WHERE "fname" = $1;`
        ,[req.body.name],function(err,result){
            if(err){
                res.status(500).send({error: err.toString()});
            }
            else{
                if(result.rows.length===0)
                    res.status(500).send({error:"No rows"});
                else{
                    for(var i=0; i< result.rows.length; i++){
                        console.log('\n'+JSON.stringify(result.rows[i])+'\n');
                        if(getDistanceFromLatLonInKm(result.rows[i].ylat, result.rows[i].ylong, result.rows[i].flat, result.rows[i].flong)<=100){
                        console.log('Distance= '+getDistanceFromLatLonInKm(result.rows[i].ylat, result.rows[i].ylong, result.rows[i].flat, result.rows[i].flong).toString());
                            sample.push(result.rows[i]);
                        }
                        
                    
                    }
                    if(sample.length===0)
                        res.status(500).send({error:"No rows"});
                    else
                        res.send(sample);
                }
            }
    });
});

app.post('/select_game_starter',function(req,res){
    var sample= [];
    pool.query(`SELECT "ylat","ylong","fname", "fmob", "game", "place", "flat", "flong" FROM "find_game" 
        WHERE "yname" = $1;`
        ,[req.body.name],function(err,result){
            if(err){
                res.status(500).send({error: err.toString()});
            }
            else{
                if(result.rows.length===0)
                    res.status(500).send({error:"No rows"});
                else{
                    for(var i=0; i< result.rows.length; i++){
                        console.log('\n'+JSON.stringify(result.rows[i])+'\n');
                        if(getDistanceFromLatLonInKm(result.rows[i].ylat, result.rows[i].ylong, result.rows[i].flat, result.rows[i].flong)<=100){
                        console.log('Distance= '+getDistanceFromLatLonInKm(result.rows[i].ylat, result.rows[i].ylong, result.rows[i].flat, result.rows[i].flong).toString());
                            sample.push(result.rows[i]);
                        }
                    }
                    if(sample.length===0)
                        res.status(500).send({error:"No rows"});
                    else
                        res.send(sample[0]);
                }
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
