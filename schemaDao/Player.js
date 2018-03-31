var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  telphone:  {// 手机号
    type: String,
    required: true,
    index: {
      unique: true
    }
  }, 
  imtoken: {// 以太坊地址
    type: String, 
    required: true,
    index: {
        unique: true
    }
  },
  identitycode: { // 身份识别码
      type: String,
      required: true,
      index: {
          unique: true
      }
  },
  invitcode: { // 邀请码
      type: String,
      default: ''
  },
  isusedinvit: { // 标识邀请码是否被使用，默认为未被使用
      type: Boolean,
      default: false
  },
  sharecount: {// 分享人数
    type: Number, 
    default: 0
  }, 
  invitcount: {// 邀请人数
    type: Number, 
    default: 0
  },
  invitedplayers: { // 当前账户邀请的账户列表
    type: Array,
    default: []
  },
  bindip: {// 注册ip
    type: String, 
    default: '',
    index: true
  }, 
  totalcancount: {// 累计赚取的CAN数
    type: Number, 
    default: 0
  }, 
  haspickupcount: {// 已经提取的CAN数
    type: Number, 
    default: 0
  }, 
  ispickup: {// 是否有提币操作，默认为false
    type: Boolean, 
    default: false
  }, 
  createtime: {//创建时间
    type: Date, 
    default: Date.now 
  } 
});

/**
 * 通过手机号查询
 */
playerSchema.methods.find_by_telphone = function(cb) {
    return this.model('Player').find({
        telphone: this.telphone
    }, cb);
  };
  
  playerSchema.methods.is_exist = function(cb) {
    var query;
    query = {
      telphone: this.telphone,
      imtoken: this.imtoken
    };
    return this.model('Player').findOne(query, cb);
  };
  
  playerSchema.statics.delete_by_telphone = function(telphone, cb_succ, cb_fail) {};
  
  var Player = mongoose.model('Player', playerSchema);
  
  var MongooseDao = require('../lib/dao');
  
   
  var PlayerDao = new MongooseDao(Player);
   
  module.exports = PlayerDao;

