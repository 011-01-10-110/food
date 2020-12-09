// pages/detail/detail.js
let DB = require('../../utils/db');
let db = new DB();
let to = require('../../utils/to');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    food: null, // 详情内容
    islike: true
  },
  /**
   * 初始化
   */
  async onLoad(options) {
    // console.log(options._id);
    // 查询详情
    let [err, {
      data
    }] = await to(db.dbGet({
      _collection: 'menus',
      where: {
        _id: options._id
      }
    }));
    if (!err) {
      // console.log(data);
      data[0].recipesMake = data[0].recipesMake.replace(/\n/g, '<br />')
      data[0].views += 1;
      this.setData({
        food: data[0]
      })
      wx.setNavigationBarTitle({
        title: this.data.food.name,
      });
    }

    // 更新浏览量
    let [viewErr, viewres] = await to(db.dbUpdate({
      _collection: 'menus',
      data: {
        views: data[0].views
      },
      _id: options._id
    }));
    if (!viewErr) {
      // console.log(viewres);
    }

    // 查询是否关注
    this.isLikes()
  },
  /**
   * 添加取消关注
   */
  async addlike() {
    // console.log(this.data.food._id);
    await this.setData({
      islike: !this.data.islike
    })
    // 判断关注
    if (this.data.islike) {
      // 添加关注
      let [err, res] = await to(db.dbadd({
        _collection: 'likes',
        data: {
          menu_id: this.data.food._id
        }
      }));
      if (!err) {
        // console.log(res);
        wx.showToast({
          title: '已关注',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
      // 更新原菜谱的关注数
      db.dbUpdate({
        _collection: 'menus',
        _id: this.data.food._id,
        data: {
          likes: this.data.food.likes + 1
        }
      }).then(res => {
        // 成功更改当前页的关注数
        this.setData({
          'food.likes': this.data.food.likes + 1
        })
      }).catch(err => {
        console.log(err);
      })
    } else {
      // 取消关注
      let [err, res] = await to(db.dbBatchDel({
        _collection: 'likes',
        data: {
          menu_id: this.data.food._id
        }
      }));
      if (!err) {
        // console.log(res);
        wx.showToast({
          title: '取消关注',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      } else {
        console.log(err);
      }

      // 更新原菜谱的关注数
      db.dbUpdate({
        _collection: 'menus',
        _id: this.data.food._id,
        data: {
          likes: this.data.food.likes - 1
        }
      }).then(res => {
        // 成功更改当前页的关注数
        this.setData({
          'food.likes': this.data.food.likes - 1
        })
      }).catch(err => {
        console.log(err);
      })
    }
  },
  /**
   * 查询关注
   */
  async isLikes() {
    let [err, res] = await to(db.dbGet({
      _collection: 'likes',
      where: {
        _openid: wx.getStorageSync('_openid')
      }
    }));
    if (!err) {
      // console.log(res);
      let data = res.data.map(item => item.menu_id);
      if (data.indexOf(this.data.food._id) !== -1) {
        this.setData({
          islike: true
        })
      } else {
        this.setData({
          islike: false
        })
      }
    }
  }

})