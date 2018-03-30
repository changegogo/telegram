let axios = require('axios');
let url = 'https://api.telegram.org/bot588581588:AAHcWKRK5ufqyhjgGfgylyuK_RnwlDkhNbI/sendMessage';

axios.defaults.timeout = 2000;


/**
 * 设置webhook
 */
/*(function(url){
    axios.get("https://api.telegram.org/bot588581588:AAHcWKRK5ufqyhjgGfgylyuK_RnwlDkhNbI/setWebhook",{
        params: {
            url: url
        }
    })
    .then(function(res){
        console.log(res);
    })
    .catch(function(err){
        console.log("set webhook fail");
    });
})('https://host/robot');*/

let replyrobot = function(chatid, msg, callback) {
    axios.post(url,{
        chat_id: chatid,
        text: msg
    }).then(function(res){
        console.log('Message posted');
        callback('ok');
    })
    .catch(function(err){
        console.log('Error :', err);
        callback('error');
    })
}

module.exports = replyrobot;