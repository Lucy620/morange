// pages/store/private.js
const app = getApp()
import {
  config,
  api,
  ajax,
  util,
  wxPromise
} from '../../utils/myapp.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoad: true,
    store_id: 0,
    noData: false,
    list: [],
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios,
    images: {},
    imgHeights: []
  },

  /**
   * 跳转页面
   */
  jumpPage: function (e) {
    var url = e.currentTarget.dataset.url || ''
    var index = config.BASE.tabPages.indexOf('/' + url)
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

  imageLoad: function (e) {
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height; //图片的真实宽高比例
    var viewWidth = app.globalData.screenWidth, //设置图片显示宽度，左右留有16rpx边距
      viewHeight = viewWidth / ratio; //计算的高度值
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    imgHeights[e.target.dataset.index] = viewHeight
    this.setData({
      images: image
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      store_id: options.store_id || ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 获取数据
   */
  getData: function () {
    let that = this
    let store_ids = [that.data.store_id]
    ajax.post(api.getCoursePrivateList, {
      'store_ids': store_ids,
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let list = that.getArrMin(data.obj.list)
        list = that.countPercent(list)
        if (list.length > 0) {
          that.setData({
            list: list,
            first: data.obj.first,
            showLoad: false
          })
        } else {
          that.getRecommend()
        }
      }
    })
  },

  /**
   * 预约人数百分比（剩余）
   */
  countPercent: function (arr) {
    for (let item of arr) {
      item.percent = (parseInt(item.rest_stock)) / parseInt(item.total_stock) * 100
    }
    return arr
  },

  /**
   * 获取最小值
   */
  getArrMin: function (list) {
    for (let item of list) {
      let arr = []
      let temp = []
      for (let val of item.price) {
        arr.push(val.price)
        if (val.first_price > 0) {
          temp.push(val.first_price)
        }
      }
      item.minPrice = Math.min.apply(null, arr)
      item.first_price = Math.min.apply(null, temp)
    }
    return list
  },

  /***
   * 获取推荐
   */
  getRecommend: function () {
    let that = this
    ajax.post(api.getCoursePrivateListRecommend, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let list = that.getArrMin(data.obj.list)
        that.setData({
          list: list,
          noData: true,
          showLoad: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})