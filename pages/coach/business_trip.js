// pages/coach/business_trip.js
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
    start_at: '',
    end_at: '',
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
    let obj = this.getMonday()
    let start = new Date(obj.start)
    let end = new Date(obj.end)
    this.setData({
      start_at: start.getTime() / 1000 + 21600,
      end_at: end.getTime() / 1000
    })
  },


  /**
   * 获取每周一
   */

  getMonday: function() {
    let obj = {}
    let stamp = new Date()
    let num = 7 - stamp.getDay() + 1
    stamp.setDate(stamp.getDate() + num)
    let year = stamp.getFullYear()
    let month = stamp.getMonth() + 1
    let mlet = ''
    if (month < 10) {
      mlet = '0' + month
    } else {
      mlet = month + ''
    }
    let day = stamp.getDate()
    let dlet = ''
    if (day < 10) {
      dlet = '0' + day
    } else {
      dlet = day + ''
    }
    let date = year + "-" + mlet + '-' + dlet
    let n = 4
    let nextDate = this.getNextDate(date, n)
    return obj = {
      start: date,
      end: nextDate
    }
  },


  /**
   * 获取日期的后几天
   */
  getNextDate: function(date, day) {
    let dd = new Date(date)
    dd.setDate(dd.getDate() + day)
    let y = dd.getFullYear()
    let m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1
    let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()
    return y + "-" + m + "-" + d
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