// pages/redirect/redirect.js
var app = getApp()
import { config, api, ajax, util, wxPromise } from '../../utils/myapp.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    title: '',
    poster: '',
    article_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var article_id = options.article_id || 0
    var title = options.title || ''
    var poster = options.poster || ''
    // 跳转第三方web端链接
    var url = options.url || ''
    if (article_id > 0) {
      url = "https://ml.gxsolution.cn/article?article_id=" + article_id
    }
    this.setData({
      url: url,
      title: title,
      poster: poster,
      article_id: article_id
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
  onShow: function() {},

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
   * 转发
   */
  onShareAppMessage: function (options) {
    var that = this
    var title = that.data.title
    var poster = that.data.poster // 文章海报
    var article_id = that.data.article_id // 文章ID
    var path = '/pages/redirect/redirect?article_id=' + article_id + '&poster=' + poster + '&title=' + title;
    var obj = {path: path}
    if (title) {
      obj.title = title
    }
    if (poster) {
      obj.imageUrl = poster
    }
    return obj
  }
})