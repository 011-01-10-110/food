// pages/list/list.js
let DB = require('../../utils/db');
let db = new DB();
let to = require('../../utils/to')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    _id: ''
  },
  /**
   * 初始化
   */
  onLoad(options) {
    // console.log(options._id);
    if (options._id !== undefined) {
      this.data._id = options._id;
      // 获取列表
      this.getlist({
        id: options._id
      });
      // console.log(options.id);
    } else if (options.keyword !== undefined) {
      // console.log(options.keyword);
      this.getlist({
        keyword: options.keyword
      });
    } else {
      this.getLikes()
    }

    // 如果没数据
    setTimeout(() => {
      if (this.data.lists.length == 0) {
        this.nolists()
      }
    }, 1000);
  },

  /**
   * 获取列表
   */
  async getlist({
    id = '',
    keyword = ''
  }) {

    if (id !== '') {
      db.dbGet({_collection:'types',where:{
        _id: id
      }}).then(res=>{
        let name = res.data[0].name;
        wx.setNavigationBarTitle({
          title: name
        });
      })
      // 查询列表
      let [err, {
        data: lists
      }] = await to(db.dbGet({
        _collection: 'menus',
        where: {
          recipeTypeid: id
        }
      }));

      if (!err) {
        // 添加星级
        lists = this.addStar(lists);
        lists = lists.sort((a, b) => b.views - a.views)
        this.setData({
          lists
        })
      }
    } else {
      wx.setNavigationBarTitle({
        title: '搜索结果'
      });
      // 关键词查询列表
      let [err, {
        data: lists
      }] = await to(db.dbGet({
        _collection: 'menus',
        where: {
          name: new RegExp(keyword)
        }
      }));

      if (!err) {
        // 添加星级
        // console.log(lists);
        lists = this.addStar(lists);
        lists = lists.sort((a, b) => b.views - a.views)
        this.setData({
          lists
        })
      } else {
        console.log(err);
      }
    }
  },

  /**
   * 获取关注
   */
  async getLikes() {
    wx.setNavigationBarTitle({
      title: '关注列表'
    });
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
        lists = this.addStar(lists)
        lists = lists.sort((a, b) => b.views - a.views)
        this.setData({
          lists
        })
      }
    }

  },


  // 添加星级
  addStar(lists) {
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
    return lists
  },
  /**
   * 去详情
   */
  toDetail(e) {
    // console.log(e.currentTarget.id);
    wx.navigateTo({
      url: '/pages/detail/detail?_id=' + e.currentTarget.id
    });
  },
  /**
   * 无数据处理
   */
  nolists() {
    wx.showModal({
      title: '提示',
      content: '暂无数据，可联系客服添加该菜系食品',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        wx.navigateBack();
      }
    });
  }

})