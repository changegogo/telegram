var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  dayOfWeek: { // 周
    type: Array,
    default: []
  },
  year: { // 年
    type: Array,
    default: []
  },
  month: { // 月
    type: Array,
    default: []
  },
  day: { // 日
    type: Array,
    default: []
  },
  hour: { // 时
    type: Array,
    default: []
  },
  minute: { // 分
    type: Array,
    default: []
  },
  second: { // 秒
    type: Array,
    default: []
  },
  tasktype: { // 任务类型 0定时任务 1重复任务 2即时任务
    type: Number,
    required: true
  },
  tasktext: { // 任务发送的内容
    type: String,
    default: ''
  },
  taskstatus: { // 任务状态 false关闭 true开启
    type: Boolean,
    default: true // 默认开启
  },
  taskresults: { // 任务的执行结果
    type: Array,
    default: []
  },
  createtime: { // 创建时间
    type: Date,
    default: Date.now
  }
});

var TaskModel = mongoose.model('Task', TaskSchema);

var MongooseDao = require('../lib/dao');

 
var MeetingDao = new MongooseDao(TaskModel);
 
module.exports = MeetingDao;