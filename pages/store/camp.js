// pages/store/camp.js
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
    showLoad: false,
    area_id: 0,
    noData: false,
    list: [],
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      area_id: options.area_id || ''
    })
  },

  /**
   * 获取数据
   */
  getData: function() {
    let that = this
    let area_ids = [that.data.area_id]
    ajax.post(api.getCourseCampList, {
      'area_ids': area_ids,
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        if (list.length > 0) {
          that.setData({
            list: list,
            showLoad: false
          })
        } else {
          that.getRecommend()
        }

      }
    })
  },

  /***
   * 获取推荐
   */
  getRecommend: function() {
    let that = this
    ajax.post(api.getCourseCampListRecommend, {}, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          list: data.obj.list,
          noData:true,
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