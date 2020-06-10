// pages/Invitation/Invitation.js
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
    complete: '',
    wait: '',
    showLoad: true,
    user: '',
    waitList: [],
    completeList: []

  },

  /**
   * 联系客服
   */
  onPhone: function(e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
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

  },

  /***
   * 初始化数据
   */
  getData: function() {
    let that = this
    ajax.post(api.getMccardHome, {

    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          user: data.obj.user,
        })
      }
    })
    ajax.post(api.myInviteHome, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let complete_price = data.obj.complete_price.toString()
        let complete = complete_price.split("")
        let wait_price = data.obj.wait_price.toString()
        let wait = wait_price.split("")
        that.setData({
          complete: complete,
          wait: wait,
          waitList: data.obj.wait_list,
          completeList: data.obj.complete_list,
          showLoad: false
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
  onShareAppMessage: function() {
    let user = this.data.user
    return {
      title: user.miniprogram.nickname + '邀请你健身',
      path: '/pages/invitation/coupon?send_user_id=' + user.id,
      imageUrl: ''
    }
  }
})