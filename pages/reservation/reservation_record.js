// pages/my_ reservation/reservation_record.js
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
    date: '',
    list: [],
  },

  /**
   * 查看
   */
  see:function(e) {
    let id = e.currentTarget.dataset.id
    let ordersn = e.currentTarget.dataset.ordersn
    let type = e.currentTarget.dataset.type
    if (type == 'team') {
      wx.navigateTo({
        url: '/pages/sign/sign_success?ordersn=' + ordersn
      })
    }else {
      wx.navigateTo({
        url: '/pages/course/course_details?user_course_id=' + id
      })
    }
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

  /***
   * 选择日期
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
    this.getData()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    let myDate = new Date
    let year = myDate.getFullYear()
    let month = id == 0 ? myDate.getMonth() + 1 : myDate.getMonth()
    if (month == 0) {
      year = myDate.getFullYear() - 1
      month = 12
    }else {
      month = (month < 10 ? "0" + month : month)
    }
    let date = (year.toString() + '-' + month.toString())
    this.setData({
      date: date
    })
  },

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    let date = that.data.date
    ajax.post(api.getUserReserveLog, {
      'date': date
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          list: data.obj.list,
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


})