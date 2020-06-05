// pages/private_education/help_refund.js
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
    refundData: '',
    show: false,
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios
  },

  /**
   * 确认取消
   */
  confirm: function() {
    this.setData({
      show: true
    })
  },

  /**
   * 再想想
   */
  close: function() {
    this.setData({
      show: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let refundData = app.refundData
    let nowtime = Math.round(new Date().getTime() / 1000)
    let start_at = parseInt(refundData.start_at) - 21600
    if (refundData.type == 'private') {
      start_at = parseInt(refundData.start_at) - 2592000
    }
    if (refundData.type == 'camp') {
      start_at = parseInt(refundData.start_at) - 604800
    }
    this.setData({
      refundData: app.refundData,
      start_at: start_at,
      nowtime: nowtime,
    })
  },

  /**
   * 提交申请
   */
  applyRefund: function() {
    let that = this
    let refundData = that.data.refundData
    ajax.post(api.refundOrder, {
      'ordersn': refundData.ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        if (refundData.orderType == 'give') {
          wx.showModal({
            content: '取消成功',
            success: function(res) {
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        } else {
          wx.showToast({
            title: '取消成功',
            icon: 'none'
          })
          wx.navigateTo({
            url: '/pages/refund/refund_success?ordersn=' + refundData.ordersn,
          })
        }

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


})