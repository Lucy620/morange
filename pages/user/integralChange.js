// pages/user/integralChange.js
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
    date: '',
    page: 1,
    limit: 10,
    list: []
  },

  /**
   * 选择日期
   */
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      page: 1,
      lastPage: false,
      list: [],
    }, () => {
      this.getData()
    })
  },

  /**
   *  初始化数据
   */
  getData: function () {
    let that = this
    let page = that.data.page
    let limit = that.data.limit
    var lastPage = that.data.lastPage
    let list = that.data.list
    var date = that.data.date
    if (lastPage) {
      return
    }
    ajax.post(api.getUserIntegralLog, {
      'page': page,
      'limit': limit,
      'date': date
    }, ({
      data
    }) => {
      if (data.code == 200) {
        page++
        let arr = data.obj.list
        list = list.concat(arr)
        that.setData({
          lastPage: (arr.length < limit) ? true : false,
          list: list,
          page: page,
          total: data.obj.total,
          showLoad: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = (month < 10 ? "0" + month : month)
    let mydate = (year.toString() + '-' + month.toString())
    this.setData({
      date: mydate
    }, () => {
      this.getData()
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})