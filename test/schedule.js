var schedule = require('node-schedule');

// function test1() {
//     var date = new Date(2018, 3, 2, 23, 23, 0);
//     var j = schedule.scheduleJob(date, function(){
//         console.log('定时任务运行');
//         console.log(123);
//     });
// }

// test1();

let startTime = new Date(Date.now() + 5000);
let endTime = new Date(startTime.getTime() + 5000);
var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
  console.log('Time for tea!');
});