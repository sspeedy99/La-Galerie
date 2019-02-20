var mongoose = require("mongoose");
var Pizza = require('./models/pizza');
var Comment = require("./models/comment");

var data = [
  {
    name:"Bicycle",
    image: "https://farm2.staticflickr.com/1213/5110249320_d868dbcfe2.jpg",
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name:"Mosaic",
    image: "https://farm9.staticflickr.com/8536/10168346495_47878cd6c9.jpg",
    description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];
function seedDB() {
  //Clear the data base.
  Pizza.remove({},function(err){
  /* if(err) {
      console.log(err);
    } else {
      console.log("removed !");
      data.forEach(function(seed){
        Pizza.create(seed, function(err,pizzas){
          if(err){
            console.log(err);
          }
          else {
            console.log("created!");
            Comment.create(
              {
                text:"This place is great, but I wish there was internet",
                author: "Homer"
              }, function(err,comment){
                if(err){
                  console.log(err);
                } else {
                  pizzas.comments.push(comment);
                  pizzas.save();
                  console.log("Created a new comment!");
                }
            });
          }
        });
      });
    }*/
  });

}


module.exports = seedDB;
