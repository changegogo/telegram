var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReplyruleSchema = new Schema({
  rulename: { // 规则名称
    type: String,
    default: ''
  },
  keywords: { // 关键词
    type: Array,
    required: true
  },
  replycontent: { // 回复内容
    type: String,
    required: true
  },
  status: { // 状态 0开启 1关闭
    type: Number,
    default: 0
  },
  createtime: { // 创建时间
    type: Date,
    "default": Date.now
  }
});

ReplyruleSchema.methods.find_by_name = function(cb) {
  return this.model('Replyrule').find({
    username: this.rulename
  }, cb);
};

ReplyruleSchema.statics.delete_by_name = function(name, cb_succ, cb_fail) {};

var ReplyruleModel = mongoose.model('Replyrule', ReplyruleSchema);

var MongooseDao = require('../lib/dao');

 
var MeetingDao = new MongooseDao(ReplyruleModel);
 
module.exports = MeetingDao;