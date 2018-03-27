require('../lib/db');

var Player = require('../schemaDao/Player');

// Player.create({"telphone":"15383830596","imtoken":"asdecsdcswex","invitcode": "12345678"},function(err, player){
//   console.log(err);
//   console.log(player);
// });

var query = {
  "$or":[{telphone: '153838305900'},{invitcode: '123456780'}]
};
Player.count(query, function(err, count){
  if(!err){
      console.log(count);
  }
})