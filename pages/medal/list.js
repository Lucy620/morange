// pages/medal/list.js
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
    scrollTop: 0,
    other_num: 0,
    course_num: 0,
    showLoad: true
  },

  /**
   * 滚动顶部触发
   */
  upper: function(e) {
    this.setData({
      dataId: 1
    })
  },

  /**
   * 滚动低部触发
   */
  lower: function(e) {
    this.setData({
      dataId: 2
    })
  },

  /**
   * 滚动条位置
   */
  switchTab: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let query = wx.createSelectorQuery()
    if (id == 2) {
      query.select('#other').boundingClientRect(function(rect) {
        that.setData({
          scrollTop: rect.top,
        })
      }).exec()
    } else {
      query.select('#course').boundingClientRect(function(rect) {
        that.setData({
          scrollTop: 0,
        })
      }).exec()
    }
    that.setData({
      dataId: id
    })

  },

  /**
   *  初始化数据
   */
  getData: function() {
    let that = this
    ajax.post(api.getMedalList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          list: data.obj.list,
          other_num: data.obj.other_num,
          course_num: data.obj.course_num,
          showLoad: false
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


})