// pages/ranking/ranking.js
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
    after_user: '',
    before_user: '',
    list: '',
    user: '',
    isShare: false,
    type: 'rank_month',
    showLoad: true,
    user_info: ''
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
   * tab 栏
   */
  switchTab: function(e) {
    var that = this
    var type = e.currentTarget.dataset.type
    that.setData({
      type: type
    })
    that.getData()
  },

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    let type = that.data.type
    ajax.post(api.molicUserCourseRankList, {
      'type': type
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          after_user: data.obj.after_user,
          before_user: data.obj.before_user,
          list: data.obj.list,
          user: data.obj.user,
          nowtime: Math.round(new Date().getTime()),
          showLoad: false
        })
      }
    }, 'auth', true)
  },


  /**
   * 获取用户信息
   */
  getUser: function() {
    let that = this
    ajax.post(api.getMccardHome, {}, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          user_info: data.obj.user
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUser()
    this.getData()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    that.share = that.selectComponent("#share")
    that.share.showTips()
    return {
      title: 'Morange 魔力星球排名',
      path: '/pages/ranking/ranking',
      imageUrl: ''
    }
  }
})