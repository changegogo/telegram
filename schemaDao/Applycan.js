var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
var ApplycanSchema = new Schema({
  telphone: {
    type: String,
    required: true
  },
  imtoken: {
    type: String,
    required: true
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
  isdeal: { // 是否已转账,默认没有转账
    type: Boolean,
    default: false
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