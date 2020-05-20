// pages/private_education/refund_success.js

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
    order: '',
    ordersn: '',
    isGive: false,
    isShare: false,
    msg: '',
    showLoad: true,
    showWeChat: false,
    campItem: '',
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
   * 跳转页面
   */
  jumpPage: function(e) {
    let url = e.currentTarget.dataset.url || ''
    let index = config.BASE.tabPages.indexOf('/' + url)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ordersn: options.ordersn || '',
    })
  },

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    let ordersn = that.data.ordersn
    ajax.post(api.userRefundOrderDetail, {
      'ordersn': ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let timestamp = (parseInt(data.obj.time) * 60) + parseInt(data.obj.result.created_at)
        that.getCountDown(timestamp)
        let order = data.obj.result
        let nowtime = Math.round(new Date().getTime() / 1000)
        let start_at = parseInt(order.data.start_at) - 21600
        if (order.data.course.type == 'private') {
          start_at = parseInt(order.data.start_at) - 2592000
        }
        if (order.data.course.type == 'camp') {
          start_at = parseInt(order.data.start_at) - 604800
        }
        let signNum = 0
        let item = data.obj.item
        for (let item of item) {
          if (item.sign_at > 0) {
            signNum++
          }
        }
        that.setData({
          order: order,
          campItem: data.obj.item,
          signNum: signNum,
          nowtime: nowtime,
          user: data.obj.user,
          start_at: start_at
        })
      }
    })
  },

  /**
   * 倒计时
   */
  getCountDown: function(timestamp) {
    let that = this
    setInterval(function() {
      let countDownTime = ''
      let nowTime = new Date()
      let endTime = new Date(timestamp * 1000)
      let t = endTime.getTime() - nowTime.getTime()
      if (t > 0) {
        let hour = Math.floor(t / 1000 / 60 / 60 % 24)
        let min = Math.floor(t / 1000 / 60 % 60)
        let sec = Math.floor(t / 1000 % 60)
        if (hour < 10) {
          hour = "0" + hour
        }
        if (min < 10) {
          min = "0" + min
        }
        if (sec < 10) {
          sec = "0" + sec
        }
        min = parseInt(min) + (parseInt(hour) * 60)
        countDownTime = min + "分" + sec + "秒"
      } else {
        countDownTime = `00分00秒`
      }

      that.setData({
        msg: countDownTime,
        showLoad: false
      })
    }, 1000)

  },

  /**
   * 取消订单
   */
  /**
   * 提交申请
   */
  applyRefund: function() {
    let that = this
    let ordersn = that.data.ordersn
    ajax.post(api.refundOrder, {
      'ordersn': ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        wx.showToast({
          title: '取消成功',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 1,
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
      that.setData({
        show: false
      })
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
    let that = this
    if (res.from == 'button') {
      let type = res.target.dataset.type
      if (type == 'invite') {
        let course_id = that.data.order.data.id
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
      if (type == 'give') {
        let ordersn = this.data.ordersn
        let user_name = this.data.user.miniprogram.nickname
        return {
          title: user_name + '赠送您一节课',
          path: '/pages/give/give?ordersn=' + ordersn + '&user_name=' + user_name,
          imageUrl: ''
        }
      }
    }
  }
})