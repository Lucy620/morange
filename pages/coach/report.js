// pages/coach/report.js
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
    type: '',
    showLoad: true,
    limit: 10,
    page: 1,
    lastPage: false, // 是否最后一页
    list: [],
    end_at:''
  },

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    let type = that.data.type
    let limit = that.data.limit
    let page = that.data.page
    let lastPage = that.data.lastPage
    let list = that.data.list
    if (lastPage) {
      return
    }
    ajax.post(api.coachReportList, {
      'type': type,
      'limit': limit,
      'page': page
    }, ({
      data
    }) => {
      if (data.code == 200) {
        page++
        let temp = data.obj.list
        list = list.concat(temp)
        that.setData({
          list: list,
          lastPage: (list.length < limit) ? true : false,
          page: page,
          showLoad: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type || '',
      start_at: options.start_at || ''
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
    this.getData()
  },

})