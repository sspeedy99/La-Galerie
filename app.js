//Basic configurations of the express.
const express = require('express');
const app = express();
app.set("view engine", "ejs"); // Setting the default templates to .ejs
const port = 5000; //Starting app on port 5000.
//adding body parser to the express app
const bodyParser = require("body-parser");//to use req.body.varName
const mongoose = require('mongoose');// getting mongoose to add a connection between express and mongoDB
const Pizzas = require("./models/pizza.js");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require('./models/user');//getting models data
const passport = require('passport');//passportjs for user authentication
const LocalStrategy = require('passport-local');
const commentRoutes = require("./routes/comments");
const pizzaRoutes = require("./routes/pizzas");
const indexRoutes = require("./routes/index");//getting routes
const methodOverride = require('method-override');//for put method, to update the databases
const flash = require('connect-flash');//for flash message
mongoose.connect("mongodb://localhost/la_galarie", {useNewUrlParser : true}); //databse on locahost

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
 //Seeding the database
//seedDB();

//============Creating an express session==================
app.use(require("express-session")({
  secret:"This_is_Secret",
  resave:false,
  saveUninitialized:false
}));


//==========activating the user ============================
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//===============Passport configuration=====================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//===================Middleware for passing the values of all the variables to the other models ===============================================
app.use(function(req,res,next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user; //req.user will be empty if no user is current signed in and useranme if signed in
  next();
});
//=====================Connecting our express app to other routes =============================================
app.use(indexRoutes);
app.use(commentRoutes);
app.use(pizzaRoutes);

// Callback function on the server side to show the server is running.
app.listen(port,function(){
  console.log("Server is running on port 5050");
});
