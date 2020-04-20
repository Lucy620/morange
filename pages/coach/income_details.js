// pages/coach/income_details.js
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
    total_income: 0,
    date: '',
    showLoad: true
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
  getData: function() {
    let that = this
    let date = that.data.date
    ajax.post(api.coachIncomeList, {
      'date': date
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        for (let item of list) {
          item.total_income = parseFloat(item.base_income) + parseFloat(item.extra_income) + parseFloat(item.people_income)
          
        }
        that.setData({
          list: list,
          total_income: data.obj.total_income,
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