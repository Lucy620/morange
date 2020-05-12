// pages/league/details.js
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
    list: '',
    showLoad: true,
    team_id: 0,
    storyHeight: '70',
    isShare: false,
    queue_order: 0,
    show_type: '',
    videoUrl: '',
    showTitle: false
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



  /***
   * 打开故事
   */
  openStory: function() {
    this.setData({
      storyHeight: 'auto',
    })
  },


  /**
   * 查看位置
   */
  seeMap: function(e) {
    let latitude = e.currentTarget.dataset.latitude
    let longitude = e.currentTarget.dataset.longitude
    let name = e.currentTarget.dataset.name
    let address = e.currentTarget.dataset.address
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: name,
      address: address
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
      team_id: options.team_id || 0,
      nowtime: Math.round(new Date().getTime() / 1000)
    })
    this.getData()
  },

  /**
   *  初始化数据
   */
  getData: function() {
    let that = this
    let team_id = that.data.team_id
    ajax.post(api.getCourseTeamDetail, {
      'team_id': team_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let obj = data.obj.result
        let start_at = parseInt(obj.start_at) - 3600
        wx.setNavigationBarTitle({
          title: obj.course.name
        })
        WxParse.wxParse('introduce', 'html', obj.course.introduce, that, 5)
        WxParse.wxParse('note', 'html', obj.course.note, that, 5)
        WxParse.wxParse('step', 'html', obj.course.step, that, 5)
        that.setData({
          list: obj,
          nowtime: Math.round(new Date().getTime() / 1000),
          queue_order: data.obj.queue_order,
          start_at: start_at,
          show_type: obj.course.show_type,
          videoUrl: obj.course.video,
          showLoad: false
        })
      }
    }, 'noauth')
  },

  /**
   * 确认订单
   */
  confirmOrder: function(e) {
    let list = this.data.list
    let order_type = e.currentTarget.dataset.order_type
    let nowtime = this.data.nowtime
    let start_at = this.data.start_at
    let amount = 1
    let cart = {
      id: list.id,
      type: list.course.type,
      amount: amount,
      order_type: order_type
    }
    if (list.rest_stock == 0 && order_type == 'give') {
      wx.showModal({
        content: '满员课程不能赠课好友',
      })
      return
    }
    if (nowtime > start_at && order_type == 'give') {
      wx.showModal({
        content: '距开课1小时，不能赠课好友',
      })
      return
    }
    app.shoppingList = cart
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order?type=' + order_type
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
   * 页面滚动事件的处理函数
   */
  onPageScroll: function(e) {
    const showTitle = this.data.showTitle
    let value = e.scrollTop
    if(value > 138 && !showTitle){
        this.setData({showTitle: true})
    }else if(value < 138 && showTitle){
      this.setData({showTitle: false})
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    let course = that.data.list.course
    that.share = that.selectComponent("#share")
    that.share.showTips()
    return {
      title: course.name,
      path: '/pages/league/details?team_id=' + that.data.team_id,
      imageUrl: ''
    }
  }
})