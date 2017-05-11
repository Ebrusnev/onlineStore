var express = require('express');
var ejs = require('ejs');
var _ = require('underscore');
var mongo = require('mongodb');
var cookieParser = require('cookie-parser');
var MongoClient = mongo.MongoClient;
var app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());

MongoClient.connect('mongodb://localhost:27017/onlineStore', function(err, db) {



}
 //------------------------listening server--------------------\\
app.listen(3034, function() {
	console.log('Server is listenin on port 4044!');
});