const Promise = require('promise');

var a = function() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            console.log('a')
            resolve('a')
        }, 1000)
    })
}

var b = function(data) {
    return new Promise(function(resolve, reject) {
        console.log('b')
        reject(data +'b')
    })
}

var c = function(data) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            console.log('c')
            resolve(data +'c')
        }, 500)
    })
}


//链式调用
a()
.then(function(data) {
    return b(data)
})
.then(function(data) {
    return c(data)
})
.then(function(data) {
    console.log(data)// abc
})
.catch(function(e) {
    console.log(e)
})