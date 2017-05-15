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
	console.log("Connected to the DataBase");

//---------------------Home page Render------------------------\\

	app.get('/', function(req, res){
		db.collection('products')
		.find()
		.toArray(function(err, docs){
			if (err) {
				return console.log("Error", err);
			}
			res.render('homePage.ejs', {products: docs})
		})
	})

//------------------Single Product Page Render -------------------------\\

	app.get('/item/:id', function(req, res){
		console.log('Single product page', req.params.id);
		db.collection('products')
		.find({_id: new mongo.ObjectID(req.params.id)})
		.toArray(function(err, doc){
			if (err) {
				console.log("Error", err);
			}
			res.render('productPage.ejs', {item: doc[0]});
		})
	})

//---------------------Cart Render---------------------------\\



})

 //------------------------Server Listening--------------------\\

app.listen(5556, function() {
	console.log('Server is listenin on port 5556!');
});