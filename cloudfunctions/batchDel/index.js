// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 在服务器端，获取数据库引用
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // 接收参数
  var data = event.data;
  var _collection = event._collection;
  return db.collection(_collection).where(data).remove()
}