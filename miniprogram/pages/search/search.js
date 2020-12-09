// pages/search/search.js
let DB = require('../../utils/db');
let db = new DB;
let to = require('../../utils/to');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotlist: [],
    localkey: [],
    keyword: ''
  },

  /**
   * 初始化
   */
  onLoad(options) {
    this.gethotlist();
    this.locallist()
  },

  /**
   * 显示
   */
  onShow() {
    this.locallist()
  },

  /**
   * 获取热搜
   */
  async gethotlist() {
    let [err, res] = await to(db.dbGetLimit({
      _collection: 'menus',
      limit: 6,
      data: 'views',
      order: 'desc'
    }));
    if (!err) {
      // console.log(res);
      this.setData({
        hotlist: res.data
      })
    }
  },

  /**
   * 获取本地搜索词
   */
  locallist() {
    let localkey = wx.getStorageSync('keyword');
    if (localkey == '') {
      wx.setStorageSync('keyword', []);
    }
    this.setData({
      localkey
    })
  },

  /**
   * 添加本地key
   */
  addlocalkey(keyword) {
    let data = wx.getStorageSync('keyword');
    if (data.indexOf(keyword) == -1) {
      if (data.length >= 10) {
        data.shift();
        data.push(keyword)
        wx.setStorageSync('keyword', data);
      } else {
        data.push(keyword)
        wx.setStorageSync('keyword', data);
      }
    }
  },

  /**
   * 去列表
   */
  tolist(e) {
    let keyword;
    if (e.type !== 'search') {
      keyword = e.currentTarget.dataset.name;
    } else {
      keyword = e.keyword;
    }
    this.addlocalkey(keyword);
    wx.navigateTo({
      url: '/pages/list/list?keyword=' + keyword
    });
  },

  /**
   * input输入
   */
  keywordinp(e) {
    let keyword = e.detail.value;
    this.setData({
      keyword
    })
  },

  /**
   * 点击搜索
   */
  search() {
    let keyword = this.data.keyword;
    this.tolist({
      type: 'search',
      keyword
    })
    this.setData({
      keyword: ''
    })
  }



})