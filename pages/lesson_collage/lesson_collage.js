// pages/lesson_collage/lesson_collage.js
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
    storeList: [],
    storeIndex: -1,
    courseList: [],
    courseIndex: 0,
    coachList: [],
    coachIndex: 0,
    showLoad: true,
    date: '',
    time: '',
    start: '',
    coach_id: 0
  },


  /**
   * 选择日期
   */
  bindDateChange: function(e) {
    let date = e.detail.value
    date = date.replace(/\-/g, "/")
    this.setData({
      date: new Date(date).getTime() / 1000
    })
  },

  /**
   * 选择时间
   */
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },

  /**
   * 选择门店
   */
  bindPickerChange: function(e) {
    this.setData({
      storeIndex: e.detail.value
    })
  },

  /**
   * 选择教练
   */
  choiceCoach: function(e) {
    let index = e.currentTarget.dataset.index
    let coachList = this.data.coachList
    this.setData({
      coachIndex: index,
      coach_id: coachList[index].user_id
    })
    this.getCourse()
  },

  /**
   * 选择课程
   */
  choiceCourse: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      courseIndex: index
    })
  },

  /**
   * 清空
   */
  onEmpty: function() {
    this.setData({
      courseIndex: 0,
      coachIndex: 0,
      storeIndex: -1
    })
    this.onLoad()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000 + 86400
    this.formatDate(timeStamp)
  },

  /**
   * 第二天凌晨 日期
   */
  formatDate: function(now) {
    let date = new Date(now * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    month = (month < 10 ? "0" + month : month)
    minute = (minute < 10 ? "0" + minute : minute)
    hour = (hour < 10 ? "0" + hour : hour)
    let mydate = (year.toString() + '/' + month.toString() + '/' + day.toString())
    let time = (hour.toString() + ':' + minute.toString())
    let start = (year.toString() + '-' + month.toString() + '-' + day.toString())
    this.setData({
      time: time,
      date: new Date(mydate).getTime() / 1000,
      start: start,
    })
  },



  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    ajax.post(api.getSpellCoachSelectNew, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let coach = data.obj.coach
        that.setData({
          storeList: data.obj.store,
          coachList: coach
        })
        that.getCourse(coach[0].user_id)
      }
    }, 'auth', true)


  },

  /***
   * 获取课程
   */
  getCourse: function(user_id) {
    let that = this
    let coach_id = that.data.coach_id
    ajax.post(api.getSpellCourseSelectNew, {
      'coach_id': coach_id > 0 ? coach_id : user_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          courseList: data.obj.course,
          showLoad: false
        })
      }
    })

  },

  /**
   * 日期转换
   */
  transformTime: function(now) {
    let date = new Date(now * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    month = (month < 10 ? "0" + month : month)
    let mydate = (year.toString() + '/' + month.toString() + '/' + day.toString())
    return mydate
  },

  /**
   * 确认创建
   */
  confirm: function() {
    let that = this
    let storeList = that.data.storeList
    let courseList = that.data.courseList
    let coachList = that.data.coachList
    let coachIndex = that.data.coachIndex
    let storeIndex = that.data.storeIndex
    let courseIndex = that.data.courseIndex
    let date = that.data.date
    let time = that.data.time
    let tempData = new Date(date)
    let timeStamp = that.transformTime(tempData) + ' ' + time
    if (storeIndex == -1) {
      wx.showToast({
        title: '请选择门店',
        icon: 'none'
      })
      return
    }
    let course_json = {
      'store_id': storeList[storeIndex].id,
      'course_id': courseList[courseIndex].id,
      'coach_id': coachList[coachIndex].user_id,
      'start_at': new Date(timeStamp).getTime() / 1000
    }
    ajax.post(api.createSpellCourse, {
      'course_json': course_json
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let obj = data.obj.course_team
        let cart = {
          id: obj.id,
          type: 'team',
          amount: 1,
          order_type: 'buy'
        }
        app.shoppingList = cart
        wx.navigateTo({
          url: '/pages/confirm_order/confirm_order?type=' + 'buy'
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
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
      title: '拼课',
      path: '/pages/lesson_collage/lesson_collage',
      imageUrl: ''
    }
  }


})