// pages/store/store_details.js
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
    store_id: 0,
    storeData: '',
    show_type: '',
    videoUrl: '',
    isShare: false,
    curImg: 0,
    images:[],
    imgHeights: [],
    showTitle: false,
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios,
  },
  
  /**
   * 联系店面
   */
  onPhone: function (e) {
    let tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: String(tel)
    })
  },

  onPageScroll: function(e) {
    let showTitle = this.data.showTitle
    let imgHeights =  this.data.imgHeights
    let curImg =  this.data.curImg
    let statusBarHeight = this.data.statusBarHeight + 44
    let height = imgHeights[curImg] - statusBarHeight
    if(!showTitle && e.scrollTop > height){
      this.setData({showTitle: true}) 
    }else if (showTitle && e.scrollTop < height) {
      this.setData({showTitle: false})
    }
  },

  imageLoad: function (e) {
    let width = e.detail.width, //获取图片真实宽度
      height = e.detail.height,
      ratio = width / height; //图片的真实宽高比例
    let viewWidth = app.globalData.screenWidth, //设置图片显示宽度，左右留有16rpx边距
      viewHeight = viewWidth / ratio; //计算的高度值
    let image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }

    let hetights = this.data.imgHeights;
    hetights[e.target.dataset.index] = viewHeight
    this.setData({
      images: image,
      imgHeights: hetights
    })
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

  onSwiperChange: function(e){
      console.log(e.detail)
  },

  /**
   * 预览图片
   */
  previewImage: function(e) {
    let url = e.currentTarget.dataset.url
    let imglist = this.data.storeData.slide_imgs
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      store_id: options.store_id || 0
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
   * 初始化数据
   */
  getData: function() {
    let that = this
    let store_id = that.data.store_id
    ajax.post(api.getStoreDetail, {
      'store_id': store_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let obj = data.obj.result
        wx.setNavigationBarTitle({
          title: obj.name
        })
        WxParse.wxParse('site_introduction', 'html', obj.site_introduction, that, 5)
        WxParse.wxParse('note', 'html', obj.note, that, 5)
        WxParse.wxParse('step', 'html', obj.step, that, 5)
        that.setData({
          storeData: obj,
          show_type: obj.show_type,
          videoUrl: obj.video,
          showLoad: false
        })
      }
    }, 'noauth')
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
      title: 'Morange 魔力星球排名',
      path: '/pages/ranking/ranking',
      imageUrl: ''
    }
  }
})