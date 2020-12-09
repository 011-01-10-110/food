/**
 * @description 封装promise的返回，便于await接收
 * @param {Promise} promise  
 * @return {Promise} 返回一个promise对象，await接收为数组[err,res]
 */
function to(promise) {
    return promise.then(res => [null, res]).catch(err => [undefined, err])
}
module.exports = to