// pages/freshmen/freshmen_course.js
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
    courseList:[], //课程
    lastPage: false, // 是否最后一页
    


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.animation = wx.createAnimation()
    this.getData({
      showTab: app.showTab
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})