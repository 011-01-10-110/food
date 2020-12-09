// 引入to
let to = require('./to');
/**
 * @description 图片上传
 * @param {Object} data cloudPath图片上传地址目录，默认为img文件夹, filePath图片临时地址
 * @return {Promise} 返回promise对象，包含云存储文件ID
 */
function uploadImg({
    cloudPath = 'img/',
    filePath
}) {
    let exec = '.' + filePath.split('.').pop();
    return wx.cloud.uploadFile({
        cloudPath: cloudPath + new Date().getTime() + exec,
        filePath
    })
}

/**
 * @description 批量上传
 * @param {files<Array>} files 临时文件数组 
 * @return {Promise} 返回云文件ID数组
 */
async function batchUpload(files) {
    // 遍历临时文件地址获取存储云文件ID
    files = await files.map(async (item) => {
        // console.log(item);
        // 获取上传文件ID
        let [err, res] = await to(uploadImg({
            filePath: item
        }));
        // 无错误加入数组
        if (!err) {
            // files.push(res.fileID)
            return res.fileID;
        }
    });
    return Promise.all(files);
}

module.exports = {
    uploadImg,
    batchUpload
}