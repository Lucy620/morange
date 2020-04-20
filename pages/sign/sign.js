// pages/sign/sign.js
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
    msg: '',
    user_course_id: '',
    coach: '',
    user: '',
    showCode:false
  },

  /***
   * 打开客服码
   */
  openCode:function() {
    this.setData({
      showCode:true
    })
  },

  /***
   * 关闭客服码
   */
  closeCode:function() {
    this.setData({
      showCode: false
    })
  },


  /**
 * 预览图片
 */
  previewImage: function () {
    var url = 'https://boringcdn.nanningboring.com/molicheng/code.jpg'
    var imglist = ['https://boringcdn.nanningboring.com/molicheng/code.jpg']
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    ajax.post(api.scanQrcodeSign, {
      'table_relation': options.table_relation,
      'course_children_id': options.course_children_id,
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          coach: data.obj.coach,
          user: data.obj.user,
          user_course_id: data.obj.user_course_id,
          showLoad: false
        })
      } else {
        that.setData({
          msg: data.msg,
          showLoad: false
        })
      }
    })
  },


  /**
   * 跳转页面
   */
  jumpPage: function (e) {
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

  }
})