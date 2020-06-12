// pages/coach/curriculum.js
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
    dataId: 2,
    date: '',
    selectDate: '',
    courseList: '',
    spell_team:'',
    month: '',
    last_out: '',
    last_schedule: '',
    showLoad: true,
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios
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


  /***
   * 底部选择
   */
  switchTab: function(e) {
    this.setData({
      dataId: e.currentTarget.dataset.id
    })
  },

  /**
   * 日期选择某一天
   */
  select(e) {
    let date = new Date(e.detail)
    let time = date.getTime() / 1000
    this.setData({
      selectDate: time
    })
    this.getCoachCourseList()
  },


  /***
   * 选择年月
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.defaultValue
    })
    this.getCoachCourseList()
  },

  /***
   * 初始化日期
   */
  toggleType() {
    this.selectComponent('#Calendar').toggleType()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options-->',options)
    let date = new Date
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = (month < 10 ? "0" + month : month)
    let mydate = (year.toString() + '-' + month.toString())
    this.setData({
      dataId: options.dataId || 1,
      date: mydate
    })
  },

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    let date = that.data.date
    ajax.post(api.getCoachHome, {
      'date': date
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          list: data.obj,
          last_out: data.obj.last_out,
          last_schedule: data.obj.last_schedule,
          month: data.obj.month,
          showLoad: false
        })
      }
    })
  },

  /**
   * 获取排课
   */
  getCoachCourseList: function() {
    let that = this
    let selectDate = that.data.selectDate
    ajax.post(api.getCoachCourseList, {
      'time': selectDate

    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          courseList: data.obj.list,
          spell_team: data.obj.spell_team
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