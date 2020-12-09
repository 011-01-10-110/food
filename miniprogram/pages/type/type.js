// pages/type/type.js
const DB = require('../../utils/db');
let db = new DB();
const to = require('../../utils/to');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: []
  },

  /**
   * 初始化
   */
  async onLoad(options) {
    // console.log(options.type);
    let [err, res] = await to(db.dbGetLimit({
      _collection: 'types'
    }));
    if (!err) {
      // console.log(res);
      res.data.map((item, index) => {
        item.src = "../../static/type/type0" + (index + 1) + ".png"
      })
      this.setData({
        types: res.data
      })
    }

  },

  /**
   * 去列表
   */
  tolist(e){
    wx.navigateTo({
      url: '/pages/list/list?_id=' + e.currentTarget.id
    });
  }


})