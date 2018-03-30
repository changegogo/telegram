var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { // 用户名
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: { // 密码
    type: String,
    required: true
  },
  avatar: { // 头像
    type: String,
    default: ''
  },
  address: { // 地址
    type: String,
    default: ''
  },
  createtime: { // 创建时间
    type: Date,
    "default": Date.now
  }
});

UserSchema.methods.find_by_name = function(cb) {
  return this.model('User').find({
    username: this.username
  }, cb);
};

UserSchema.methods.is_exist = function(cb) {
  var query;
  query = {
    username: this.username,
    password: this.password
  };
  return this.model('User').findOne(query, cb);
};

UserSchema.statics.delete_by_name = function(name, cb_succ, cb_fail) {};

var UserModel = mongoose.model('User', UserSchema);

var MongooseDao = require('../lib/dao');

 
var MeetingDao = new MongooseDao(UserModel);
 
module.exports = MeetingDao;