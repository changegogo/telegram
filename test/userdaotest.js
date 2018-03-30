require('../lib/db');

let User = require('../schemaDao/User');
let Player = require('../schemaDao/Player');
let mongoose = require('mongoose');


// User.create({
//     username: "dailiwang",
//     password: "123456"
// },function(err, user){
//     console.log(user);
// });

// User.pageByquery({
   
// }, function(err, users){
//     console.log(users);
// })

// Player.latest(2,{

// },function(err, user){
//     console.log(user);
//     Player.pageByLastId(mongoose.Types.ObjectId(user[user.length-1]._id), function(err, player){
//       // console.log(player);
//     })
// });

Player.find({
    _id: mongoose.Types.ObjectId('5abdaf500c1d3c054296778b')
},function(err, p){
    console.log(p);
})
