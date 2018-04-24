let axios = require('axios');

const bottoken = "596747985:AAFIX5UzClfopoT2PFwdP8FbPyJL2oGn03s";
const telegramBaseUrl = 'https://api.telegram.org/bot' + bottoken;
const sendMessage = '/sendMessage';
const setWebhook = '/setWebhook';

const webhook = 'https://mobipromo.io/telegram/robot';

axios.defaults.timeout = 5000;

/**
 * 设置webhook
 */
(function(url){
    axios.get(telegramBaseUrl + setWebhook,{
        params: {
            url: url
        }
    })
    .then(function(res){
        console.log('set webhook success');
    })
    .catch(function(err){
        console.log('set webhook fail');
    });
})(webhook);

let replyrobot = function(chatid, msg, callback) {
    axios.post(telegramBaseUrl + sendMessage ,{
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