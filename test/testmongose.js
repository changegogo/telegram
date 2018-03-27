var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  telphone:  String, // 手机号
  sharecount: {type: Number, default: 0}, // 分享人数
  imtoken: {type: String, default: ''}, // 以太坊地址
  playercode: {type: String, default: ''}, // 用户码
  invitcount: {type: Number, default: 0}, // 邀请人数
  bindip: {type: String, default: ''}, // 注册ip
  totalcancount: {type: Number, default: 0}, // 累计赚取CAN数
  ispickup: {type: Boolean, default: false}, // 是否有提币操作，默认为false
  createtime: { type: Date, default: Date.now } //创建时间
});

var Player = mongoose.model('Player', playerSchema);
mongoose.connect("mongodb://localhost:27017/coin", function(err) {
    if(!err){
      var doc = new Player({telphone: "15383830596"});
      doc.save(function(err, doc){
          console.log(doc);
      })
      console.log('连接成功');
    }
});


setTimeout(function(){
    mongoose.disconnect(function(){
        console.log("断开连接");
    })
}, 2000);