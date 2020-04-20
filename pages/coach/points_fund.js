// pages/coach/points_fund.js
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
    dataId: 1,
    date: '',
    list: '',
    total_integra: '',
    showLoad: true
  },


  /**
   * 选择日期
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
    this.getDate()
  },
  /**
   * 选项tab栏
   */
  switchTab: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    that.setData({
      dataId: id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let date = new Date
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = (month < 10 ? "0" + month : month)
    let mydate = (year.toString() + '-' + month.toString())
    this.setData({
      date: mydate
    })
  },

  /**
   * 初始化数据
   */
  getDate: function() {
    let that = this
    let date = that.data.date
    ajax.post(api.coachIntegralList, {
      'date': date
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          list: data.obj.list,
          total_integra: data.obj.total_integra,
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
    this.getDate()
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