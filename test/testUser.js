require('../lib/db');

var User = require('../schemaDao/User');

User.create({"username":"sss12","password":"123"},function(err, user){
  console.log(err);
  console.log(user);
});

// User.delete({"username":"sss","password":"password"},function(err, user){
//   console.log(user);
// });