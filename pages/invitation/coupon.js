// pages/Invitation/coupon.js
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
    send_user_id: 0,
    is_get: '',
    coupon: '',
    is_new: 'false',
    send_user: '',
    user: '',
    isReceive: false,
    inviteCoupon: {},
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      send_user_id: options.send_user_id || ''
    })
  },

  /***
   * 初始化数据
   */
  getData: function() {
    let that = this
    let send_user_id = that.data.send_user_id
    ajax.post(api.receiveInviteNewCoupon, {
      'send_user_id': send_user_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let coupon = data.obj.result
        let total_price = parseInt(coupon.price) * parseInt(coupon.amount)
        that.setData({
          is_get: data.obj.is_get,
          coupon: data.obj.result,
          is_new: data.obj.is_new,
          send_user: data.obj.send_user,
          user: data.obj.user,
          total_price: total_price,
          inviteCoupon: data.obj.coupon,
          showLoad: false
        })
      }
    })
  },

  /**
   * 领取代金券
   */
  saveCoupon: function() {
    let that = this
    let send_user_id = that.data.send_user_id
    ajax.post(api.saveInviteNewCoupon, {
      'send_user_id': send_user_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        wx.showToast({
          title: '领取成功',
          icon: 'none'
        })
        that.setData({
          isReceive: true
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
    })
  },

  onShowNotice: function () {
    this.setData({showNotice: true})
  },
  onHideNotice: function () {
    this.setData({showNotice: false})
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
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let user = this.data.user
    if (res.from == 'button') {
      return {
        title: user.miniprogram.nickname + '邀请你健身',
        path: '/pages/invitation/coupon?send_user_id=' + user.id,
        imageUrl: ''
      }
    }
  }
})