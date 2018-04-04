var schedule = require('node-schedule');
//var rule = new schedule.RecurrenceRule();
//rule.second = [0];
//2018/04/03 20:21:00
var date = new Date(2018, 3, 3, 20, 47, 0);
var text = '内容';
var j = schedule.scheduleJob(date, function(value){
  console.log('执行任务', value);
}.bind(null, text));
