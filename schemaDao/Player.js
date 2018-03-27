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
  identitycode:{ // 身份识别码
      type: String,
      required: true,
      index: {
          unique: true
      }
  },
  sharecount: {type: Number, default: 0}, // 分享人数
  invitcount: {type: Number, default: 0}, // 邀请人数
  bindip: {type: String, default: ''}, // 注册ip
  totalcancount: {type: Number, default: 0}, // 累计赚取CAN数
  ispickup: {type: Boolean, default: false}, // 是否有提币操作，默认为false
  createtime: { type: Date, default: Date.now } //创建时间
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

