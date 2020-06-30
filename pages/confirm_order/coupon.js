// pages/confirm_order/coupon.js
const app = getApp()
import {
  config,
  api,
  ajax,
  util,
  wxPromise
} from '../../utils/myapp.js'
const WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon_list: [],
    id: 0,
    showExplain: false,
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios
  },


  /**
   * 查看范围
   */
  openExplain: function(e) {
    let title = e.currentTarget.dataset.name
    let notice = e.currentTarget.dataset.notice
    this.setData({
      title: title,
      notice: notice,
      showExplain: true
    })
  },

  /**
   * 关闭说明
   */
  closeTips: function() {
    this.setData({
      showExplain: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let coupon_list = app.couponList
    let id = options.id
    let utc = ''
    for (let item of coupon_list) {
      if (id == item.id) {
        item.select = true
      } else {
        item.select = false
      }
      item.day = (parseInt(item.use_end) - parseInt(item.use_start)) * 1000
      item.day = Math.ceil(item.day / (24 * 60 * 60 * 1000))
    }
    this.setData({
      coupon_list: coupon_list,
      id: options.id,
      pay_price: options.pay_price,
      price: options.price
    })
  },


  /***
   * 选择优惠券
   */
  selectCoupon: function(e) {
    let index = e.currentTarget.dataset.index
    let coupon_list = this.data.coupon_list
    let pay_price = this.data.pay_price
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    for (let i in coupon_list) {
      if (index == i) {
        coupon_list[i].select = !coupon_list[i].select
      } else {
        coupon_list[i].select = false
      }
    }
    let reduce_cost = coupon_list[index].select ? coupon_list[index].reduce_cost : 0
    let discount = coupon_list[index].discount
    let couponType = coupon_list[index].coupon_type
    let price = this.data.price
    prevPage.setData({
      user_coupon_id: coupon_list[index].select ? coupon_list[index].id : 0,
      reduce_cost: couponType == 'discount' ? parseFloat(price * (1 - discount)) : reduce_cost > pay_price ? pay_price : reduce_cost,
      pay_price: couponType == 'discount'? parseFloat(pay_price - price * (1 - discount)) :parseFloat(pay_price) - parseFloat(reduce_cost),
      coupon_type: coupon_list[index].select ? coupon_list[index].coupon_type : 'normal'
    })

    if (coupon_list[index].select) {
      wx.navigateBack({
        delta: 1
      })
    }
    this.setData({
      coupon_list: coupon_list
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})