require('../lib/db');

var Player = require('../schemaDao/Player');

// Player.create({"telphone":"15383830596","imtoken":"asdecsdcswex","invitcode": "12345678"},function(err, player){
//   console.log(err);
//   console.log(player);
// });

// var query = {
//   "$or":[{telphone: '153838305900'},{invitcode: '123456780'}]
// };
// Player.count(query, function(err, count){
//   if(!err){
//       console.log(count);
//   }
// })

var query = {//identitycode
  "invitcode": "a209b216db38cd5ec11a1b3ea71e5385can_robot"
}

Player.findOne(query, function(err, player){
  console.log(player);
});

Player.updateOne(query,{"$inc": {"invitcount":1}},function(err, player){
  console.log(player);
});


