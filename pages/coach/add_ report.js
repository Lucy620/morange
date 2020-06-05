// pages/coach/add_ report.js
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
    showLoad: true, // 加载显示
    index: -1,
    array: [],
    date: '',
    start: '00:00',
    end: '00:00',
    nowtime: '',
    remark: '',
    type: ''
  },


  /**
   * 选择日期
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 选择开始时间
   */
  bindTimeStart: function(e) {
    this.setData({
      start: e.detail.value
    })
  },

  /**
   * 选择结束时间
   */
  bindTimeEnd: function(e) {
    this.setData({
      end: e.detail.value
    })
  },

  /**
   * 事由
   */
  binKeyValue: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 事项
   */
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 确定提交
   */
  confirm: function() {
    let that = this
    let index = that.data.index
    let array = that.data.array
    let date = that.data.date
    date = date.replace(/\-/g, "/")
    let start = that.data.start
    let end = that.data.end
    let remark = that.data.remark
    let type = that.data.type
    if (index == -1) {
      wx.showToast({
        title: '请选择事项',
        icon: 'none'
      })
      return
    }
    if (util.isEmpty(remark)) {
      wx.showToast({
        title: '请输入事由',
        icon: 'none'
      })
      return
    }
    if (util.isEmpty(date)) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      return
    }
    if (start == '00:00' || end == '00:00') {
      wx.showToast({
        title: '请选择时间',
        icon: 'none'
      })
      return
    }
    let report_json = {
      matter: array[index],
      remark: remark,
      start_at: new Date(date + ' ' + start) / 1000,
      end_at: new Date(date + ' ' + end) / 1000,
    }
    ajax.post(api.coachCreateReport, {
      'report_json': report_json,
      'type': type,
    }, ({
      data
    }) => {
      if (data.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    ajax.post(api.coachReportMatterList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          array: data.obj.matter,
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
      nowtime: Math.round(new Date().getTime() / 1000)
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