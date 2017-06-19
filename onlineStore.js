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

//---------------------Item adding cart to DB---------------------------\\

	app.post('/cart', function(req, res){
		var timeStamp = req.cookies.user;
		if (!timeStamp) {
			timeStamp = new Date().getTime();
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

//------------------------------Item removing from the cart----------------------------\\

/*	app.post('/remove', function(req, res){
		db.collection('carts')
		.find({_id: new mongo.ObjectID(req.body.id)})
		.toArray(function(err, removes){
			if (err) {
				console.log("Error", err);
			}
			console.log('removing: ', removes.productID);
		})
	})
*/

	//--------------------------Cart Page render-----------------------\\

	app.get('/cart/yourCart', function(req, res){
		var ids = [];
		db.collection('carts')
		.find({user: req.cookies.user})
		.toArray(function(err, carts){
			if (err) {
				return console.log("Error", err);
			}
			carts.forEach(function(elm){
				ids.push(new mongo.ObjectID(elm.productID));
			})
			db.collection('products')
			.find({_id: {$in: ids}})
			.toArray(function(err, prods){
				if (err) {
					return console.log("Error", err);
				}
				res.render('cart.ejs', {prods: prods});
			})
		})
	})



//--------------------------Checking Out----------------------\\

	app.post('/checkOut', function(req, res){
		var toOrder = [];
		db.collection('carts')
		.find({user: req.cookies.user})
		.toArray(function(err, orders){
			if (err) {
				return console.log("Error", err);
			}
			orders.forEach(function(elm){
				toOrder.push(new mongo.ObjectID(elm.productID));
			})
			console.log(toOrder);
			db.collection('orders')
				.insertOne({
				items: toOrder,
				user: req.body.name,
				shiped: false,
				delivered: false
			}, function(err){
				db.collection('carts')
				.removeMany({user: req.cookies.user}, function(err){
					res.redirect('/');
				})
			})
		})
	})


}) //db brakets

 //------------------------Server Listening--------------------\\

app.listen(5556, function() {
	console.log('Server is listenin on port 5556!');
});