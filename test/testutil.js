var commonUtils = require('../utils/commonUtils');

// var s = '+YJqDG8+"\'/5kdCB3dG5L"E/5pg==';
// console.log(s);
// var en = commonUtils.URLencode(s);
// console.log(en);

// var de = commonUtils.URLdecode(en);
// console.log(de);

let invitcode = "OVbta2z4+m9imQT5ATMxnnnk2jIhuLHCLJwpsvZkl7w=can_robot";
let arr = commonUtils.aesinvitcode(invitcode);
console.log(arr);