// pages/give/give.js
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
    give_user: '',
    course: '',
    send_user: '',
    msg: '',
    user: '',
    ordersn: '',
    showLoad: true,
    isGive: true
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
      ordersn: options.ordersn || ''
    })
  },

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    let ordersn = that.data.ordersn
    ajax.post(api.getMccardHome, {}, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          user: data.obj.user
        })
      }
    })
    ajax.post(api.getGiveOrderDetail, {
      'ordersn': ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let created_at = data.obj.order_result.created_at
        that.setData({
          give_user: data.obj.give_user,
          course: data.obj.result,
          send_user: data.obj.send_user,
        })
        that.getCountDown(parseInt(created_at) + 900)
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
   * 领取课程
   */
  receive: function() {
    let that = this
    let ordersn = this.data.ordersn
    ajax.post(api.saveGiveOrderGiveUser, {
      'ordersn': ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        wx.showToast({
          title: '领取成功',
          icon: 'none'
        })
        that.setData({
          isGive: false
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
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
    let ordersn = this.data.ordersn
    let user_name = this.data.user.miniprogram.nickname
    if (res.from == 'button') {
      return {
        title: user_name + '赠送你一节课',
        path: '/pages/give/give?ordersn=' + ordersn + '&user_name=' + user_name,
        imageUrl: ''
      }
    }
  }
})