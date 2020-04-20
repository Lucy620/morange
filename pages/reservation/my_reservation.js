// pages/my_ reservation/my_reservation.js
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
    month_list: [],
    reserve_list: [],
    user: '',
    total_day: [],
    total_course: []
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
   * 初始化数据
   */
  getData: function() {
    let that = this
    let month_list = that.data.month_list
    ajax.post(api.getUserReserve, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let total_day = data.obj.user.total_day.toString()
        let total_course = data.obj.user.total_course.toString()
        let total_calories = data.obj.user.total_calories.toString()
        let day_calories = data.obj.user.day_calories.toString()
        let day = total_day.split("")
        let course = total_course.split("")
        let calories = total_calories.split("")
        let calories_day = day_calories.split("")
        that.setData({
          month_list: data.obj.month_list,
          reserve_list: data.obj.reserve_list,
          user: data.obj.user,
          total_day: day,
          total_course: course,
          total_calories: calories,
          day_calories: calories_day,
          showLoad: false,
          showTab: false
        })
        wx.showTabBar({})
      }
    }, 'noauth')
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      showTab: app.showTab
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


})