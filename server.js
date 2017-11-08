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

app.post('/select_invites',function(req,res){
        pool.query(`SELECT * FROM send_an_invite_friend_data WHERE "your_id" = $1;`
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



app.post('/song_insert', function(req, res){
    //make a request
    //{"args":{"objects":[{"composer_name":"rahman","song_link":"https://www.dropbox.com/s/wmcd10icwz5qwjk/Enna%20Solla%20Pogirai%20//-%20MassTamilan.com.mp3?raw=1","song_name":"son2","user_id":27}],"table":"song"},"type":"insert"}
    pool.query(`INSERT INTO "song" ("user_id", "composer_name", "song_name", "song_link") VALUES ($1, $2, $3, $4);`,[req.body.args.objects[0].user_id, req.body.args.objects[0].composer_name, req.body.args.objects[0].song_name, req.body.args.objects[0].song_link],function(err,result){
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

//{"args":{"objects":[{"comment_text":"inser comment","song_id":3,"user_id":0,"user_name":"name"}],"table":"comments"},"type":"insert"}
app.post('/comment_insert', function(req, res){
    //make a request
    pool.query(`INSERT INTO "comments" ("user_id", "song_id", "comment", "username") VALUES ($1, $2, $3, $4);`,[req.body.args.objects[0].user_id, req.body.args.objects[0].song_id, req.body.args.objects[0].comment_text, req.body.args.objects[0].user_name],function(err,result){
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


//{"args":{"objects":[{"user_id":27,"profile_image_link":"https://www.dropbox.com/s/ekup56b1fnl4jbu/FB_IMG_1500895804626.jpg?raw=1"}],"table":"profile_image"},"type":"insert"}
app.post('/dp_insert', function(req, res){
    //make a request
    pool.query(`UPDATE "user_table" set profile_image_link= $1 where id= $2;`,[req.body.args.objects[0].profile_image_link, req.body.args.objects[0].user_id],function(err,result){
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


//{"args":{"objects":[{"confirm":false,"friend_id":0,"request":true,"user_id":27}],"table":"friend"},"type":"insert"}
app.post('/insert_confirm_req', function(req, res){
    //make a request
    pool.query(`INSERT INTO "friend" ("confirm", "friend_id", "request", "user_id") VALUES ($1, $2, $3, $4);`,[req.body.args.objects[0].confirm, req.body.args.objects[0].friend_id, req.body.args.objects[0].request, req.body.args.objects[0].user_id],function(err,result){
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

//{"args":{"objects":[{"confirm":false,"friend_id":0,"request":true,"user_id":27}],"table":"friend"},"type":"insert"}
app.post('/update_confirm_req', function(req, res){
    //make a request
    pool.query(`UPDATE "friend" set "confirm"= true where "friend_id"= $1 and "user_id"=$2;`,[req.body.args.objects[0].friend_id, req.body.args.objects[0].user_id],function(err,result){
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


//{"args":{"columns":["*"],"table":"comments","where":{"song_id":3}},"type":"select"}
app.post('/get_comments', function(req, res){
    pool.query(`SELECT * FROM "comments" WHERE "song_id" = $1;`
        ,[req.body.args.where.song_id], function(err,result){
            if(err){
                console.log(err.toString());
                res.status(500).send({error: err.toString()});
            }
            else{
                res.send(result.rows);
                }
            });
    
});




//{"args":{"columns":["*"],"table":"song_likes_comments_info","where":{"user_id":27}},"type":"select"}
app.post('/get_songs', function(req, res){
    //{"args":{"columns":["*"],"table":"profile_image","where":{"user_id":27}},"type":"select"}
    pool.query(`SELECT * FROM "song_likes_comments_info" WHERE "user_id" = $1;`
        ,[req.body.args.where.user_id], function(err,result){
            if(err){
                console.log(err.toString());
                res.status(500).send({error: err.toString()});
            }
            else{
                res.send(result.rows);
                }
            });
    
});

app.post('/prof_pic', function(req, res){
    //{"args":{"columns":["*"],"table":"profile_image","where":{"user_id":27}},"type":"select"}
    pool.query(`SELECT "profile_image_link" FROM "user_table" WHERE "id" = $1;`
        ,[req.body.args.where.user_id], function(err,result){
            if(err){
                console.log(err.toString());
                res.status(500).send({error: err.toString()});
            }
            else{
                res.send(result.rows);
                }
            });
    
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

app.post('/select_confirms',function(req,res){
        pool.query(`SELECT * FROM confirm_invitees_friend_data WHERE "your_id" = $1;`
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


app.post('/select_friends',function(req,res){
        pool.query(`SELECT * FROM your_friends_friend_data WHERE "your_id" = $1;`
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
