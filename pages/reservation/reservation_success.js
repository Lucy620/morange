// pages/private_education/reservation_success.js
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
    payData: '',
    isGive: false,
    isShare: false,
    showWeChat: false,
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios
  },

  /**
   * 邀请好友
   */
  onGive: function() {
    this.setData({
      isGive: true
    })
  },

  /**
   * 取消邀请
   */
  closeGuve: function(e) {
    this.setData({
      isGive: e.detail.isGive
    })
  },

  /**
   * 加好友
   */
  addFriends: function() {
    this.setData({
      showWeChat: true
    })
  },

  /**
   * 复制
   */
  copy: function(e) {
    var that = this
    wx.setClipboardData({
      data: e.currentTarget.dataset.weixin,
      success: function(res) {
        wx.showToast({
          title: '微信号复制成功',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ordersn: options.ordersn || ''
    })
    this.getData()
  },

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    let nowtime = Math.round(new Date().getTime() / 1000)
    let ordersn = that.data.ordersn
    ajax.post(api.userRefundOrderDetail, {
      'ordersn': ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let payData = data.obj.result
        let start_at = parseInt(payData.data.start_at) - 1800
        let time = start_at - parseInt(nowtime)
        that.setData({
          payData: payData,
          time: time,
          min: 30 * 60,
          showLoad: false
        })
      }
    })
  },


  /**
   * 查看位置
   */
  seeMap: function(e) {
    let latitude = e.currentTarget.dataset.latitude
    let longitude = e.currentTarget.dataset.longitude
    let name = e.currentTarget.dataset.name
    let address = e.currentTarget.dataset.address
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: name,
      address: address
    })
  },

  /**
   * 返回继续
   **/
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },


  /**
   * 跳转页面
   */
  jumpPage: function(e) {
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
  onShareAppMessage: function() {
    let that = this
    let course_id = that.data.payData.course.id
    that.give = that.selectComponent("#give")
    that.give.closeGuve()
    that.share = that.selectComponent("#share")
    that.share.showTips()
    return {
      title: 'MORANGE',
      path: '/pages/league/details?team_id=' + course_id,
      imageUrl: ''
    }
  }
})