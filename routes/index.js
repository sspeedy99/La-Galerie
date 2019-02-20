const express = require('express');
const router = express.Router();
const passport = require('passport');
var User = require('../models/user');


router.get("/",function(req,res){
  res.render("landing");
});


//==============Returning the landing page=================================

router.get('/register',function(req,res){
  res.render("register");
});

router.post('/register',function(req,res){
  req.body.username
  req.body.password
  /*creating the new user object, we pass only the username, we don't pass the password
  we stored the hashed password in our databse */
 User.register( new User({username:req.body.username}), req.body.password, function(err,user){
    if(err) {
      req.flash("error",err.message);
       return res.render("register");
    } else {
      //Here pbkdf2 hashing algorithm is used by passport-local-mongoose
      passport.authenticate("local")(req,res,function(){
         // hashing and storing the password into the databse.
         req.flash("success","Welcome to La Galarie " + user.username);
      res.redirect("/pizzas");
      });
    }
  });
});
//============auth routes ==========================
router.get("/login",function(req,res){
  res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect: "/pizzas",
    failureRedirect: "/login"}),function(req,res){
});
//=================logout route=======================================
router.get("/logout",function(req,res){
  req.logout();
  req.flash("success","Logged Out!");
  res.redirect('/pizzas');
});
//middleware to check if the user is currently logged out===============================
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
module.exports = router;
