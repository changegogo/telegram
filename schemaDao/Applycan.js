var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
var ApplycanSchema = new Schema({
  telphone: {
    type: String,
    required: true,
    index: true
  },
  imtoken: {
    type: String,
    required: true,
    index: true
  },
  ip: { // 当前IP
    type: String,
    default: ''
  },
  cancount: { // 申请提币数量
    type: Number,
    required: true,
    default: 0
  },
  createtime: { // 创建时间
    type: Date,
    default: Date.now()
  },
  isdeal: { // 是否未处理、同意、拒绝 0 1 2
    type: Number,
    default: 0 // 默认为未处理状态
  }
});

// 
ApplycanSchema.methods.find_by_telphone = function(cb) {
  return this.model('ApplycanSchema').find({
    telphone: this.telphone
  }, cb);
};

ApplycanSchema.methods.is_exist = function(cb) {
  var query;
  query = {
    telphone: this.telphone,
    imtoken: this.imtoken
  };
  return this.model('ApplycanSchema').findOne(query, cb);
};

ApplycanSchema.statics.delete_by_telphone = function(telphone, cb_succ, cb_fail) {};

var Applycan = mongoose.model('Applycan', ApplycanSchema);

var MongooseDao = require('../lib/dao');

 
var ApplycanDao = new MongooseDao(Applycan);
 
module.exports = ApplycanDao;