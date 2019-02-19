const express = require('express');
const router = express.Router();
const Pizzas = require("../models/pizza.js");
var Comment = require("../models/comment.js");
//=====================================================
// COMMENTS ROUTE
//====================================================

router.get("/pizzas/:id/comments/new",isLoggedIn,function(req,res){
  //Find campground by id
  Pizzas.findById(req.params.id,function(err,pizzas){
    if(err) {
      console.log(err);
    } else {
        res.render("new_comment_form",{pizzas:pizzas});
    }
  });


});
//===========Adding a new comment ===========================
router.post("/pizzas/:id/comments",isLoggedIn,function(req,res){
  //lookup campground
  Pizzas.findById(req.params.id,function(err,pizzas){
    if(err) {
      console.log(err);
      res.redirect('/pizzas');
    } else {
      Comment.create(req.body.comment,function(err,comment){
        if(err) {
          req.flash("error","Something went wrong!");
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          pizzas.comments.push(comment);
          pizzas.save();
          req.flash("success","Added a comment!");
          res.redirect('/pizzas/'+ pizzas._id);

        }
      });
    }
  });
  //create new comments
  //connect new comments//redirect to pizza show Page
});

router.get("/pizzas/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
  Comment.findById(req.params.comment_id,function(err,foundComment){
    if(err) {
      res.redirect('back');
    } else {
        res.render("comment_edit",{pizzas_id:req.params.id,comment:foundComment});
    }
  });

});

//UPDATE

router.put("/pizzas/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/pizzas/" + req.params.id);
    }
  });
});

//DELETE COMMENT
router.delete("/pizzas/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
     if(err){
         res.redirect("back");
     } else {
       req.flash("success","Comments deleted!");
         res.redirect("/pizzas/"+req.params.id);
     }
  });
});
//middleware to check if the user is logged in or not
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash("error","You need to be loggged in to do that!");
  res.redirect('/login');
}
//middleware to check if the comment is own by the current logged in user
 function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment){
            if(err){
               res.redirect("/pizzas");
           } else {
                 //does user own comment?
               if(foundComment.author.id.equals(req.user._id)) {
                 next();
               } else {
                 req.flash("error","You don't have the permission to do that");
                res.redirect("back");
               }
           }
        });
    } else {
      req.flash("error","You need to be loggged in to do that!");
        res.redirect("back");
    }
}
//exporting the route to expressjs
module.exports = router;
