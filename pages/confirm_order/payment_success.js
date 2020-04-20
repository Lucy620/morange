// pages/confirm_order/payment_success.js
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
    msg: '',
    showLoad: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let give_expired = options.give_expired || 0
    let ordersn = options.ordersn || ''
    let user_name = options.user_name || ''
    this.setData({
      user_name: user_name,
      ordersn: ordersn
    })
    this.countDownFun(give_expired)
  },


  countDownFun: function(give_expired) {
    var that = this
    let time = parseInt(give_expired) * 60
    setInterval(function() {
      time = time - 1
      let minute = parseInt(time / 60)
      let second = parseInt(time % 60)
      let msg = minute + '分' + second + '秒'
      that.setData({
        msg: msg,
        showLoad: false
      })
    }, 1000)
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
    let ordersn = this.data.ordersn
    let user_name = this.data.user_name
    if (res.from == 'button') {
      return {
        title: user_name + '赠送您一节课',
        path: '/pages/give/give?ordersn=' + ordersn + '&user_name=' + user_name,
        imageUrl: ''
      }
    }
  }
})