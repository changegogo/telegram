function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function SetLocalStorage(name, value){//name,value为键值对
    if (window.localStorage) {
        localStorage.setItem(name, value);
    } else {
        alert("不支持Web LocalStorage");
    }
}

function GetLocalStorage(name){//name
    var value = '';
    if (window.localStorage) {
        value = localStorage.getItem(name);
    } else {
        alert("不支持Web sessionStorage");
    }
    return value;
}

function RemoveLocalStorage(name){
    if (window.localStorage){
        localStorage.removeItem(name);
    } else {
        localStorage.removeItem(name);
    }

}
