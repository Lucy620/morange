// pages/lesson_collage/share.js
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
    result: '',
    send_user: '',
    user: '',
    team_id: '',
    send_user_id: '',
    msg: ''
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
   * 初始化数据
   */
  getData: function() {
    let that = this
    let team_id = that.data.team_id
    let send_user_id = that.data.send_user_id
    ajax.post(api.inviteSpellCourse, {
      'team_id': team_id,
      'send_user_id': send_user_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let start_at = data.obj.result.start_at
        that.getCountDown(parseInt(start_at) - 10800)
        that.setData({
          result: data.obj.result,
          send_user: data.obj.send_user,
          user: data.obj.user,
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
        countDownTime = hour + "小时" + min + "分" + sec + "秒"
      } else {
        countDownTime = `00小时00分00秒`
      }

      that.setData({
        msg: countDownTime,
        showLoad: false
      })
    }, 1000)

  },

  /**
   * 确认拼课
   */
  confirm: function() {
    let obj = this.data.result
    let cart = {
      id: obj.id,
      type: 'team',
      amount: 1,
      order_type: 'buy'
    }
    app.shoppingList = cart
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order?type=' + 'buy'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      team_id: options.team_id || '',
      send_user_id: options.send_user_id || ''
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
    let team_id = this.data.team_id
    let send_user_id = this.data.send_user_id
    let user_name = this.data.send_user.miniprogram.nickname
    if (res.from == 'button') {
      return {
        title: user_name + '邀请你拼课',
        path: '/pages/lesson_collage/share?team_id=' + team_id + '&send_user_id=' + send_user_id,
        imageUrl: ''
      }
    }
  }
})