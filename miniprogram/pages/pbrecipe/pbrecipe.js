// pages/pbrecipe/pbrecipe.js
// 引入上传图片函数
let {
  uploadImg,
  batchUpload
} = require('../../utils/upload');
// 引入to
let to = require('../../utils/to');
// 获取数据库实例
// const db = wx.cloud.database();
// 引入数据库操作类
let DB = require('../../utils/db');
let db = new DB();

// 引入app实例
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [], // 图片上传缩略图
    types: [], // 菜系
    userInfo: null, // 用户信息
  },
  /**
   * 初始化
   */
  async onLoad(options) {
    // 获取用户信息
    if (app.globalData.userInfo) {
      this.data.userInfo = app.globalData.userInfo
      // console.log(this.data.userInfo);
    } else {
      app.callbackUser = (res) => {
        this.data.userInfo = res.userInfo;
      }
    }

    // 获取菜系分类
    let [err, res] = await to(db.dbGet({
      _collection: 'types'
    }));
    if (!err) {
      // console.log(res);
      this.setData({
        types: res.data
      })
    }
  },
  /**
   * 图片选择
   */
  imgSelect(e) {
    // console.log(e);
    let files = e.detail.tempFilePaths.map(item => ({
      url: item
    }));
    // console.log(files);
    this.setData({
      files
    })
  },
  /**
   * 提交表单
   */
  async submit(e) {
    wx.showLoading({
      title: '上传中',
      mask: true
    });
    // 上传图片
    // 封装的批量上传获取数组
    let files = await batchUpload(this.data.files.map(item => item.url));
    // console.log(files);

    // 表单内容
    let data = e.detail.value;

    // 添加其他信息
    data = {
      ...data,
      //files: await Promise.all(files), // 将promise转化的数组存到data中
      files, // 图片云ID
      addtime: new Date().getTime(), // 存储时间戳
      avatarUrl: this.data.userInfo.avatarUrl, // 用户头像
      nickName: this.data.userInfo.nickName, // 用户昵称
      views: 0, // 访问量
      likes: 0 // 收藏量
    };
    // console.log(data);
    if(data.name == ''){
      wx.showToast({
        title: '菜名未填写',
        icon: 'none',
        duration: 1500
      });
      return ;
    }
    // 存储数据库
    let [err, res] = await to(db.dbadd({
      data
    }));
    if (!err) {
      // console.log(res);
      wx.hideLoading();
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1500
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
})