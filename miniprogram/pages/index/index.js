// 引入数据库类
let DB = require('../../utils/db');
let db = new DB();
// 引入to
let to = require('../../utils/to');
Page({
    data: {
        types: [], // 菜系
        recipes: [], // 菜单列表
        page: 0 // 热门第一页
    },
    /**
     * 初始化
     */
    onLoad(options) {
        wx.showLoading({
            title: '载入中',
            mask: true
        });

        // 获取类型
        this.gettype()
        // 获取菜谱
        this.getrecipes()
        setTimeout(() => {
            wx.hideLoading();
        }, 500);
    },

    /**
     * 触底
     */
    onReachBottom() {
        this.data.page += 1;
        this.getrecipes()
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        wx.showLoading({
            title: '刷新中',
            mask: true
        });

        this.data.recipes = [];
        this.data.page = 0;
        // 获取类型
        this.gettype()
        // 获取菜谱
        this.getrecipes()
        setTimeout(() => {
            wx.hideLoading();
        }, 500);
        wx.stopPullDownRefresh()
    },
    /**
     * 获取类型
     */
    async gettype() {
        // 获取类型
        let [typeErr, {
            data: types
        }] = await to(db.dbGetLimit({
            _collection: 'types',
            limit: 2
        }));
        if (!typeErr) {
            // console.log(types);
            // 添加菜单的图片
            types = types.map((item, index) => {
                item.src = '../../imgs/index_0' + (7 + index * 2) + '.jpg';
                return item
            })
            this.setData({
                types
            })
        }
    },

    /**
     * 获取菜谱
     */
    async getrecipes() {
        // 获取菜谱列表
        let [recerr, recipes] = await to(db.dbGetLimit({
            _collection: 'menus',
            page: this.data.page,
            // limit: 2,
            data: 'views',
            order: 'desc'
        }));
        if (!recerr) {
            // console.log(recipes);
            if (recipes.data.length == 0) {
                wx.showToast({
                    title: '到底了',
                    icon: 'none',
                    duration: 1500,
                    mask: false
                });
                return;
            }
            this.setData({
                recipes: this.data.recipes.concat(recipes.data)
            })
        } else {
            console.log(recerr);
        }
    },

    /**
     * 去type列表
     */
    totype(e) {
        let type = e.currentTarget.dataset.type;
        // console.log(type);
        wx.navigateTo({
            url: '/pages/type/type?type=' + type
        });
    },
    /**
     * 去列表
     */
    tolist(e) {
        let id = e.currentTarget.id;
        wx.navigateTo({
            url: '/pages/list/list?_id=' + id
        });
    },
    /**
     * 去详情
     */
    toDetail(e) {
        let id = e.currentTarget.id;
        wx.navigateTo({
            url: '/pages/detail/detail?_id=' + id
        });
    },
    /**
     * 去关注
     */
    tolikes(e) {
        wx.navigateTo({
            url: '/pages/list/list'
        });
    }
})