var commonUtils = require('../utils/commonUtils');

var s = '+YJqDG8+"\'/5kdCB3dG5L"E/5pg==';
console.log(s);
var en = commonUtils.URLencode(s);
console.log(en);

var de = commonUtils.URLdecode(en);
console.log(de);