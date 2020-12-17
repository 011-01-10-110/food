// pages/my/my.js

let app = getApp();
//引入数据库类
let DB = require('../../utils/db');
let db = new DB();
// 引入to
let to = require('../../utils/to')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, //是否登录。 false 未登录  true，已经登录
    recipes: [],
    types: [],
    lists: [],
    userInfo: [], // 用户信息
    menu: 'recipe' // 菜单显示
  },

  /**
   * 初始化函数
   */
  onLoad(options) {
    // 获取登录信息
    // console.log(1);
    if (app.globalData.userInfo) {
      // console.log(app.globalData.userInfo);
      this.setData({
        userInfo: app.globalData.userInfo,
        isLogin: true
      })
    } else {
      app.callbackUser = (res) => {
        let userInfo = res.userInfo;
        this.setData({
          userInfo,
          isLogin: true
        })
      }
    }
    // // 获取菜单
    // this.getrecipes()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.showLoading({
      title: '刷新中',
      mask: true
    });
    this.getrecipes();
    this.getLikes();
    setTimeout(() => {
      wx.hideLoading();
    }, 500);
    wx.stopPullDownRefresh();
  },

  /**
   * 切前台
   */
  onShow() {
    // 获取菜单
    this.getrecipes()
  },
  /**
   * 获取菜单
   */
  async getrecipes() {
    let [recerr, recipes] = await to(db.dbGetLimit({
      _collection: 'menus',
      where: {
        _openid: wx.getStorageSync('_openid')
      }
    }));
    if (!recerr) {
      // console.log(recipes);
      this.setData({
        recipes: recipes.data
      })
    }
  },
  /**
   * 获取列表type
   */
  async getTypes() {
    // 获取类型
    let [typeErr, {
      data: types
    }] = await to(db.dbGetLimit({
      _collection: 'types'
    }));
    if (!typeErr) {
      // console.log(types);
      // 添加菜单的图片
      types = types.map((item, index) => {
        item.src = '../../static/type/type0' + (index + 1) + '.png';
        return item
      })
      this.setData({
        types
      })
    }
  },

  /**
   * 获取关注菜谱
   */
  async getLikes() {
    let [likeerr, likeres] = await to(db.dbGet({
      _collection: 'likes',
      where: {
        _openid: wx.getStorageSync('_openid')
      }
    }));
    if (!likeerr) {
      // console.log(likeres);
      let arr = likeres.data.map(item => item.menu_id)
      let [err, {
        data: lists
      }] = await to(db.dbGetIn({
        _collection: 'menus',
        arr
      }));
      if (!err) {
        // console.log(res);
        lists.map((item, index) => {
          if (item.views == 0) {
            item.star = 0
          } else if (item.views >= 1 && item.views <= 10) {
            item.star = 1
          } else if (item.views > 10 && item.views <= 20) {
            item.star = 2
          } else if (item.views > 20 && item.views <= 30) {
            item.star = 3
          } else if (item.views > 30 && item.views <= 40) {
            item.star = 4
          } else {
            item.star = 5
          }
        })
        lists = lists.sort((a, b) => b.views - a.views)
        this.setData({
          lists
        })
      }
    }

  },

  /**
   * 长按删除
   */
  _delStyle(e) {
    wx.showModal({
      title: "删除提示",
      content: "确定要删除么？",
      success: (res) => {
        if (res.confirm) {
          // 删除该项
          db.dbRemove({
            _collection: 'menus',
            _id: e.currentTarget.id
          }).then(res => {
            // 获取菜单
            this.getrecipes()
          })
          db.dbRemove({
            _collection: 'types',
            menu_id: e.currentTarget.id
          }).then(res => {
            console.log(res);
          })
        }
      }
    })
  },
  /**
   * 获取用户登录信息
   */
  getUserInfo(e) {
    // console.log(e);
    let userInfo = e.detail.userInfo;
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo,
      isLogin: true
    })
  },
  /**
   * 菜单切换
   */
  menuTab(e) {
    // console.log(e);
    let menu = e.target.dataset.title;
    if (menu == 'type') {
      // 获取分类
      this.getTypes()
    } else if (menu == 'like') {
      // 获取关注
      this.getLikes()
    }
    // console.log(menu);
    this.setData({
      menu
    })
  },
  /**
   * 添加菜品
   */
  addfood() {
    wx.navigateTo({
      url: '/pages/pbrecipe/pbrecipe'
    });
  },
  /**
   * 去列表
   */
  tolist(e) {
    console.log(e.currentTarget.id);
    wx.navigateTo({
      url: '/pages/list/list?_id=' + e.currentTarget.id
    });
  },
  /**
   * 去详情
   */
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?_id=' + e.currentTarget.id
    });
  }

})