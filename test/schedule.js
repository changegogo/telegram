var schedule = require('node-schedule');


// var j = schedule.scheduleJob({hour: '11', minute: '6', second: ['40', '50']}, function(obj){
//   console.log(obj);
//   console.log('Time for tea!');
// }.bind(null, {name:'dailiwang', age: 23}));

let obj = {
  hour: []
}
obj.hour = obj.hour.concat([1,2,4,5]);
console.log(obj);