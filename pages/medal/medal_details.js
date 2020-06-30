// pages/medal/medal.js
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
    medal: '',
    user_amount: 0,
    status: 'false',
    time: '',
    speed: 0,
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios
  },

  /**
   *  初始化数据
   */
  getData: function() {
    let that = this
    let medal_id = that.data.medal_id
    ajax.post(api.getMedalDetail, {
      'medal_id': medal_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let user_amount = data.obj.user_amount
        let medal = data.obj.result
        wx.setNavigationBarTitle({
          title: medal.name
        })
        let speed = parseInt(user_amount) / parseInt(medal.amount) * 100
        that.setData({
          medal: medal,
          user_amount: user_amount,
          status: data.obj.status,
          unlock: data.obj.unlock,
          time: data.obj.time,
          speed: speed > 100 ? 100 : speed,
          user_list: data.obj.user_list,
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
      medal_id: options.medal_id || '',
      status: options.status || 'false'
    })
  },

  /**
   * 查看我的勋章
   */
  back: function() {
    wx.navigateBack({
      delta: 1,
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