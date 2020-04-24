const app = getApp()
import {
  config,
  api,
  ajax,
  util,
  wxPromise
} from '../../utils/myapp.js'

Page({
  data: {
    areaIndex: 0,
    areaList: [], // 市区
    regionIndex: 0,
    region: [], // 区域
    themeIndex: 0,
    themeList: [], // 主题
    cover: false, //遮罩
    type: '', // 动画类型
    showLoad: true, // 加载显示
    advList: [], // 轮播
    storeList: [], //店面
    area_ids: [],
    theme_id: 0,
    limit: 10,
    page: 1,
    lastPage: false, // 是否最后一页
    isShare: false
  },

  /**
   * 联系店面
   */
  onPhone: function (e) {
    let tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: String(tel)
    })
  },

  /**
   * 跳转页面
   */
  jumpPage: function (e) {
    var url = e.currentTarget.dataset.url || ''
    var index = config.BASE.tabPages.indexOf('/' + url)

    if (url.indexOf('http') != -1) {
      // 跳转第三方web端链接
      wx.navigateTo({
        url: '/pages/outreach/outreach?url=' + url
      })
      return
    }

    if (index != -1) {
      wx.switchTab({
        url: '/' + url
      })
    } else if (url) {
      wx.navigateTo({
        url: '/' + url
      })
    }
  },


  onLoad: function () {
    this.animation = wx.createAnimation()
    this.getData({
      showTab: app.showTab
    })
  },

  /**
   * 打开城市、主题
   */
  openAnimation: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let region = that.data.region
    let area_ids = []
    for (let item of region) {
      item.id != 0 && area_ids.push(item.id)
    }
    that.setData({
      cover: true,
      type: type,
      area_ids: area_ids
    })
    // this.getData()
    this.translate()
  },

  /**
   * 打开城市、主题动画
   */
  translate: function () {
    this.animation.translateY(-400).step();
    this.setData({
      animation: this.animation.export()
    })
  },

  /***
   * 关闭城市、主题动画
   */
  closeAnimation: function () {
    let that = this
    that.animation.translateY(400).step();
    that.setData({
      animation: that.animation.export()
    })
    setTimeout(function () {
      that.close()
    }, 200)
  },

  /**
   * 关闭城市、主题
   */
  close: function () {
    this.setData({
      cover: false,
      type: 'screen'
    })
  },

  /**
   * 选择确定按钮
   */
  choice: function (e) {
    this.getData()
  },

  /**
   * 选择城市
   */
  choiceCity: function (e) {
    let index = e.currentTarget.dataset.index
    let areaList = this.data.areaList
    let region = [{
      id: 0,
      name: '全城'
    }]
    let area_ids = []
    region = region.concat(areaList[index].children)
    for (let item of region) {
      item.id != 0 && area_ids.push(item.id)
    }
    this.setData({
      areaIndex: index,
      region: region,
      regionIndex: 0,
      lastPage: false,
      page: 1,
      theme_id: 0,
      themeIndex: 0,
      storeList: [],
      area_ids: area_ids
    })
  },

  /**
   * 选择区域
   */
  choiceArea: function (e) {
    let index = e.currentTarget.dataset.index
    let region = this.data.region
    let area_ids = []
    if (region[index].id == 0) {
      for (let item of region) {
        item.id != 0 && area_ids.push(item.id)
      }
    } else {
      area_ids = [region[index].id]
    }
    this.setData({
      regionIndex: index,
      area_ids: area_ids,
      lastPage: false,
      page: 1,
      theme_id: 0,
      themeIndex: 0,
      storeList: [],
    })
  },

  /**
   * 选择门店主题
   */
  choiceTheme: function (e) {
    let index = e.currentTarget.dataset.index
    let themeList = this.data.themeList
    this.setData({
      themeIndex: index,
      theme_id: themeList[index].id,
      lastPage: false,
      page: 1,
      storeList: [],
    })
  },

  /***
   * 收藏
   */
  collection: function (e) {
    let that = this
    let store_id = e.currentTarget.dataset.store_id
    let status = true
    let is_favorite = e.currentTarget.dataset.status
    if (is_favorite) {
      status = false
    }
    let storeList = that.data.storeList
    ajax.post(api.saveStoreFavorite, {
      'store_id': store_id,
      'status': status,
    }, ({
      data
    }) => {
      if (data.code == 200) {
        for (var index in storeList) {
          if (storeList[index].id == store_id) {
            storeList[index].is_favorite = !storeList[index].is_favorite
            // 默认地址置顶
            if (index != 0) {
              storeList.unshift(storeList.splice(index, 1)[0])
            }
          }
        }
        that.setData({
          storeList: storeList
        })
        wx.showToast({
          title: status ? '已收藏并置顶' : '已取消置顶',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   *  初始化数据
   */
  getData: function () {
    let that = this
    let themeList = that.data.themeList
    let themeIndex = that.data.themeIndex
    let area_ids = that.data.area_ids
    let theme_id = that.data.theme_id
    let limit = that.data.limit
    let page = that.data.page
    let lastPage = that.data.lastPage
    let storeList = that.data.storeList
    if (lastPage) {
      return
    }
    ajax.post(api.getStoreList, {
      'area_ids': area_ids,
      'theme_id': theme_id,
      'limit': limit,
      'page': page
    }, ({
      data
    }) => {
      if (data.code == 200) {
        page++
        let list = data.obj.store
        storeList = storeList.concat(list)
        that.setData({
          advList: data.obj.adv,
          storeList: storeList,
          lastPage: (list.length < limit) ? true : false,
          page: page,
          showLoad: false,
          showTab: false,
          cover: false
        })
        app.showTab = false
        wx.showTabBar({})
      }
    }, 'noauth')
  },

  /**
   *  获取门店区域列表
   */
  getStoreAreaList: function () {
    let that = this
    let region = [{
      id: 0,
      name: '全城'
    }]
    ajax.post(api.getStoreAreaList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        region = region.concat(list[0].children)
        let area_ids = []
        for (let item of list[0].children) {
          item.id != 0 && area_ids.push(item.id)
        }
        that.setData({
          area_ids: area_ids,
          areaList: list,
          region: region
        })
        that.getData()
      }
    }, 'noauth')
  },

  /**
   *  获取门店主题列表
   */
  getStoreThemeList: function () {
    let that = this
    let themeList = [{
      id: 0,
      name: '全部'
    }]
    ajax.post(api.getStoreThemeList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        themeList = themeList.concat(list)
        that.setData({
          themeList: themeList
        })
      }
    }, 'noauth')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getStoreAreaList()
    this.getStoreThemeList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    that.share = that.selectComponent("#share")
    that.share.showTips()
    return {
      title: 'MORANGE',
      path: '/pages/index/index',
      imageUrl: ''
    }
  }

})