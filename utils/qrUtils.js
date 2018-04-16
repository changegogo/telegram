var qrUtils = {};  
var fs = require('fs');  
var qr = require('qr-image');  
var images = require("images");  
const path = require('path');
/** 
 * 根据地址生成二维码 
 * 参数 url(string) 地址 
 * 参数 callback(Function) 
 */  
qrUtils.createQr = function(url,imgName, callback){  
  
    var qr_png = qr.image(url, { type: 'png',size : 6 });
    //let savePath = __dirname + '../public/poster/' + imgName;
    let savePath =path.join(__dirname, '../public/poster/') + imgName;
    var qr_pipe = qr_png.pipe(fs.createWriteStream(savePath));  
    qr_pipe.on('error', function(err){  
        console.log(err);  
        callback(err,null);  
        return;  
    })  
    qr_pipe.on('data', function(){
        console.log(123);
    })
    qr_pipe.on('finish', function(){  
        callback(null,savePath);  
    })  
};  
/** 
 * 给图片添加水印 
 * 参数 sourceImg(string) 原图片路径 
 * 参数 waterImg(string) 水印图片路径 
 * 参数 callback(Function) 
 */  
qrUtils.addWater = function(sourceImg, waterImg, callback){ 
    images(sourceImg)                     //Load image from file   
                                            //加载图像文件  
        .size(750)                          //Geometric scaling the image to 400 pixels width  
                                            //等比缩放图像到400像素宽  
        .draw(images(waterImg), 213, 908)   //Drawn logo at coordinates (70,260)//为了遮住不该看的东西..  
                                            //在(10,10)处绘制Logo  
        .save(waterImg, {               //Save the image to a file,whih quality 50  
            quality : 50                    //保存图片到文件,图片质量为50  
        });  
        let name = waterImg.split('/').pop();
    callback(name);
};  
  
module.exports = qrUtils;  