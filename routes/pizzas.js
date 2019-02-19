
var express = require("express");
var router  = express.Router();
var Pizzas = require("../models/pizza.js");
//var middleware = require("../middleware");

//List of pizzas page
router.get("/pizzas",function(req,res){
  //getting all the pizzas from the database.
  Pizzas.find({},function(err,allpizzas){
    if(err) {
      console.log(err);
    }
    else {
      res.render("pizzas",{pizzas:allpizzas,currentUser:req.user});
    }
  });

});

//Adding the new pizza
//Same route name but different method i,e this is a POST request.
router.post("/pizzas",isLoggedIn,function(req,res){
  //get data from the form
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id:req.user._id,
    username:req.user.username
  }
  var newPizza = {name:name,image:image,description:desc,author:author};

  //Create a new campground and store it into the database.
  Pizzas.create(newPizza,function(err,newlyCreated){
    if(err) {
      console.log(err);
    }
    else {
        res.redirect('/pizzas');
    }
  });
});
//Form request ot add  new pizza to the request list.

router.get("/pizzas/new",isLoggedIn,function(req,res){
  res.render("new");
});


router.get("/pizzas/:id", function (req,res){
  //Find the pizzas with provided ID
/*  Population is the process of automatically replacing the specified paths
   in the document with document(s) from other collection(s).*/
  Pizzas.findById(req.params.id).populate("comments").exec(function(err, foundPizzas){
    if(err) {
      console.log(err);
    }
    else {
      //console.log(foundPizzas);
      //rendering the tempalte with the requested pizzas
      res.render("show", {pizzas:foundPizzas});
    }
  });
});
//Pizzas edit route
router.get("/pizzas/:id/edits",checkArtOwnership,function(req, res){
    Pizzas.findById(req.params.id, function(err, foundPizzas){
        res.render("edit", {pizzas: foundPizzas});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/pizzas/:id",checkArtOwnership,function(req, res){
    // find and update the correct campground
    Pizzas.findByIdAndUpdate(req.params.id, req.body.pizzas, function(err, Pizzas){
       if(err){
           res.redirect("/pizzas");
       } else {
           //redirect somewhere(show page)
           res.redirect("/pizzas/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/pizzas/:id",checkArtOwnership,function(req, res){
   Pizzas.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/pizzas");
      } else {
          res.redirect("/pizzas");
      }
   });
});
//middleware to check if the user is logged in.
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash("error","You need to be loggged in to do that!");
  res.redirect('/login');
}
//middleware to check if the uploaded art belongs to the user who is currently signed in
function checkArtOwnership(req,res,next) {
  if(req.isAuthenticated()){
       Pizzas.findById(req.params.id, function(err, foundPizzas){
          if(err){
            req.flash("error","Something went wrong!");
              res.redirect("back");
          }  else {
              // does user own the campground?
           if(foundPizzas.author.id.equals(req.user._id)) {
               next();
           } else {
             req.flash("error","You don't have the permission to that!");
               res.redirect("back");
           }
          }
       });
   } else {
     req.flash("error","You need to be loggged in to do that!");
       res.redirect("back");
}
}
//exporting the router to the express app
module.exports = router;
