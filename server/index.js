// REST API //
var express = require('express')
var body_parser = require('body-parser')
var app = express()
app.use(body_parser.json())

// Mongo DB //
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//var url = 'mongodb://localhost:27017/castikoTest';
var url = 'mongodb://user:abcd1234@testcluster-shard-00-00-7f3ht.mongodb.net:27017,testcluster-shard-00-01-7f3ht.mongodb.net:27017,testcluster-shard-00-02-7f3ht.mongodb.net:27017/castikoTest?ssl=true&replicaSet=TestCluster-shard-0&authSource=admin';




////////////////////////////  MongoDB operations //////////////////////////////

// Mongo DB Get Data //
var dataQuery = function(db, collection, request, fields, callback){
	var remove_attribute = {'_id' : false};
    var cursor = db.collection(collection).find(request, fields);
    var jsonarray = new Array();
    cursor.each(function(err, doc){
        if(err){
            callback(err);
        }
        if(doc){
            jsonarray.push(doc);
        }
        else{
            callback(null, jsonarray);
        }
    });
};

// Insert Data into Mongo //
var insertDocument = function(db, collection, data, callback){
    db.collection(collection).insertOne(data, function(err, result){
        //assert.equal(err, null);
        callback(result);
    });
};

// Update a document
var updateDocument = function(db, collection, data, callback){
    db.collection(collection).update({user_name:data.user_name}, {"$set":{cards:data.cards}}, function(err, result){
        assert.equal(err, null);
        //console.log("\n updated document: data=> ", data, " and result=> ", result.result);
        callback(result);
    });
};






////////////////////////////  Rest operations //////////////////////////////

// REST End Points //
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Authentication Request //
app.get('/auth', function(req, res, next){
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        dataQuery(db, 'users', req.query, {}, function(err, jsonarray){
            if (err){
                throw err;
            }
            res.send(jsonarray);
            db.close();
        });
    });
});

// Users //
app.route('/users')
    .get(function(req, res, next){
    	MongoClient.connect(url, function(err, db){
            assert.equal(null, err);
            dataQuery(db, 'users', req.query, {password:0}, function(err, jsonarray){
                if (err){
                    throw err;
                }
                res.send(jsonarray);
                db.close();
            });
        });
    })
    .post(function(req, res, next){
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            insertDocument(db, 'users', req.body, function(new_user) {
                // Add a new user in cards db
                var empty_user = {
                    user_name:req.body.user_name,
                    cards:{
                        cards_left: shuffle(all_cards),
                        deck:{
                            hearts : [{
                              suit:'hearts',
                              value:"enter all cards "
                            }],
                            clubs : [{
                              suit:"clubs",
                              value:"enter all cards "
                            }],
                            diamonds : [{
                              uit:"diamonds",
                              value:"enter all cards "
                            }],
                            spades : [{
                              suit:"spades",
                              value:"enter all cards "
                            }],
                        }
                    }
                }
                //console.log("feeding input user ", empty_user);
                insertDocument(db, 'cards', empty_user, function(result){
                    res.send(new_user);
                    db.close();
                });
            });
        });
    })

// Card Data // 
app.route('/card_data')
    .get(function(req, res, next){
        MongoClient.connect(url, function(err, db){
            assert.equal(null, err);
            dataQuery(db, 'cards', req.query, {}, function(err, jsonarray){
                if (err){
                    throw err;
                }
                res.send(jsonarray);
                db.close();
            });
        });
    })
    .post(function(req, res, next){
        MongoClient.connect(url, function(err, db){
            assert.equal(null, err);
            updateDocument(db, 'cards', req.body, function(result){
                res.send(result);
                db.close();
            });
        });
    })




app.listen(3000, function(){
	console.log('listening on 3000');
});






////////////////////////////  create Cards //////////////////////////////

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

var all_cards = [];
var suits = ['hearts', 'clubs', 'diamonds', 'spades']
var count = 0;
for(var suit in suits){
    all_cards.push({suit:suits[suit], value:"jack"});
    all_cards.push({suit:suits[suit], value:"queen"});
    all_cards.push({suit:suits[suit], value:"king"});
    all_cards.push({suit:suits[suit], value:"ace"});
    for(var i=2; i<=10; i++){
        all_cards[count+i+2] = {suit:suits[suit], value:i.toString()};
    }
  count += 13;
}

// user detail initialization
var empty_user = {
    user_name:"",
    cards:{
        cards_left: shuffle(all_cards),
        deck:{
            hearts : [{
              suit:'hearts',
              value:"enter all cards "
            }],
            clubs : [{
              suit:"clubs",
              value:"enter all cards "
            }],
            diamonds : [{
              uit:"diamonds",
              value:"enter all cards "
            }],
            spades : [{
              suit:"spades",
              value:"enter all cards "
            }],
        }
    }
}
