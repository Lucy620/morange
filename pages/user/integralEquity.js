// pages/user/integralEquity.js
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
    equity: 0,
    showLoad:true
  },

  /**
   * 滑动选择
   */
  binSwiper: function (e) {
    let that = this
    let integral = that.data.integral
    let privilege = ''
    let grade_id = parseInt(e.detail.current) + 1
    for (let item of integral) {
      if (item.grade_id == grade_id) {
        privilege = item.privilege
      }
    }
    that.setData({
      privilege: privilege,
      equity: e.detail.current
    })
  },


  /**
   *  初始化数据
   */
  getData: function () {
    let that = this
    ajax.post(api.getIntegralGradeList, {

    }, ({
      data
    }) => {
      if (data.code == 200) {
        let integral = data.obj.integral
        let privilege = ''
        let grade_id = that.data.grade_id
        for (let item of integral) {
          if (item.grade_id == grade_id) {
            privilege = item.privilege
          }
        }
        that.setData({
          integral: integral,
          privilege: privilege,
          showLoad: false,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      grade_id: options.grade_id || '',
      userType: options.userType || '',
      equity: parseInt(options.grade_id) - 1,
      user_integral: options.user_integral,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})