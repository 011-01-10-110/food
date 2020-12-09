// pages/category/category.js
// 引入db类
let DB = require('../../utils/db');
const to = require('../../utils/to');
let db = new DB();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false, // 是否显示编辑
    isAdd: false, // 是否显示删除
    typeName: '', // input中的值
    typelist: [], // type列表
    editId: '' // 修改项_id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getTypes()
  },

  /**
   * 显示添加
   */
  showAdd() {
    if (this.data.typeName !== '') {
      this.reset()
    }
    this.setData({
      isAdd: true
    })
  },

  /**
   * 显示修改
   */
  showEdit(e) {
    this.reset()
    // console.log(e.currentTarget.dataset.name);
    this.setData({
      isEdit: true,
      typeName: e.currentTarget.dataset.name,
      editId: e.currentTarget.id
    })
  },

  /**
   * input改变值
   */
  setinput(e) {
    // console.log(e);
    this.setData({
      typeName: e.detail.value
    })
  },

  /**
   * 添加type
   */
  async addType() {

    let [err, res] = await to(db.dbadd({
      _collection: 'types',
      data: {
        name: this.data.typeName,
        addtime: new Date().getTime()
      }
    }));
    if (!err) {
      // console.log(res);
      this.getTypes()
      wx.showToast({
        title: '添加成功',
        icon: 'none',
        duration: 1500,
      });
      // 清空状态
      this.reset();
    } else {
      wx.showToast({
        title: '添加失败',
        icon: 'none',
        duration: 1500,
      });
    }
  },

  /**
   * 修改type
   */
  async typeEdit() {
    let [err, res] = await to(db.dbUpdate({
      _collection: 'types',
      _id: this.data.editId,
      data: {
        name: this.data.typeName,
        addtime: new Date().getTime()
      }
    }));
    if (!err) {
      // console.log(res);
      this.getTypes()
      // 清空状态
      this.reset()
    }
  },

  /**
   * 查询types
   */
  async getTypes() {
    // 获取typelist
    let [err, res] = await to(db.dbGet({
      _collection: 'types'
    }));
    if (!err) {
      // console.log(res);
      this.setData({
        typelist: res.data
      })
    }
  },

  /**
   * 删除
   */
  async typedel(e) {
    wx.showModal({
      title: '提示',
      content: '您确定删除吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: async (result) => {
        if (result.confirm) {
          let id = e.currentTarget.id;
          // console.log(id);
          let [err, res] = await to(db.dbRemove({
            _collection: 'types',
            _id: id
          }));
          if (!err) {
            console.log(res);
            this.getTypes()
          }
        }
      }
    });

  },

  /**
   * 清空状态
   */
  reset() {
    this.setData({
      isEdit: false,
      isAdd: false,
      typeName: ''
    })
  }

})