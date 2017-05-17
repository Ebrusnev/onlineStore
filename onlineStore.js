var express = require('express');
var ejs = require('ejs');
var _ = require('underscore');
var mongo = require('mongodb');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = mongo.MongoClient;
var app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded());

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
				return console.log("Error", err);
			}
			res.render('productPage.ejs', {item: doc[0]});
		})
	})

//---------------------Item adding to DB---------------------------\\

	app.post('/cart', function(req, res){
		var timeStamp = req.cookies.user;
		if (!timeStamp) {
			timeStamp = (new Date).getTime();
			res.cookie('user', timeStamp);
		}
		db.collection('carts')
		.insertOne({
			productID: req.body.id,
			user: timeStamp
		}, function(err){
			console.log("product added to the database", req.body.id)
			res.end();
		})
	})
	//--------------------------Cart Page-----------------------\\

	app.get('/cart/allProducts', function(req, res){
		db.collection('carts')
		.find({user: req.cookies.user})
		.project({productID: true})
		.toArray(function(err, user){
			if (err) {
				return console.log("Error", err);
			}
			console.log(user);
		})
	})

})


 //------------------------Server Listening--------------------\\

app.listen(5556, function() {
	console.log('Server is listenin on port 5556!');
});