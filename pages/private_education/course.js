// pages/private_education/course.js
const app = getApp()
import {
  config,
  api,
  ajax,
  util,
  wxPromise
} from '../../utils/myapp.js'
const WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoad: true,
    storyHeight: '70',
    private_id: 0,
    list: '',
    show_type: '',
    videoUrl: '',
    isShare: false
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
   * 预览图片
   */
  previewImage: function(e) {
    let url = e.currentTarget.dataset.url
    let imglist = this.data.list.course.slide_imgs
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },



  /**
   * 确认订单
   */
  confirmOrder: function(e) {
    let list = this.data.list
    let order_type = e.currentTarget.dataset.order_type
    let amount = 1
    let cart = {
      id: list.price[0].id,
      type: list.course.type,
      amount: amount,
      order_type: order_type
    }
    app.shoppingList = cart
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order?type=' + order_type
    })
  },

  /***
   * 打开故事
   */
  openStory: function() {
    this.setData({
      storyHeight: 'auto',
    })
  },
  /**
   * 点击a标签跳转链接
   */
  wxParseTagATap: function(e) {
    var url = e.currentTarget.dataset.src
    console.log(url)
    wx.navigateTo({
      url: '/' + url
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      private_id: options.private_id || 0
    })
  },


  /**
   *  获取门店区域列表
   */
  getData: function() {
    let that = this
    ajax.post(api.getCoursePrivateDetail, {
      'private_id': that.data.private_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let obj = data.obj.result
        wx.setNavigationBarTitle({
          title: obj.course.name
        })
        WxParse.wxParse('introduce', 'html', obj.course.introduce, that, 5)
        WxParse.wxParse('note', 'html', obj.course.note, that, 5)
        WxParse.wxParse('step', 'html', obj.course.step, that, 5)
        that.setData({
          list: obj,
          first: data.obj.first,
          show_type: obj.course.show_type,
          videoUrl: obj.course.video,
          showLoad: false,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    that.share = that.selectComponent("#share")
    that.share.showTips()
    return {
      title: that.data.list.course.name,
      path: '/pages/private_education/course?private_id=' + that.data.private_id,
      imageUrl: ''
    }
  }
})