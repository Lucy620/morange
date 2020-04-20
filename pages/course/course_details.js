// pages/private_education/course_details.js
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
    user_course_id: '',
    courseData: '',
    show: false,
    number: 0,
    isGive: false,
    isShare: false,
    msg: '',
    user_name: '',
    nowtime: '',
    time: '',
    min: '',
    showWeChat: false
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
   * 邀请好友
   */
  onGive: function() {
    this.setData({
      isGive: true
    })
  },

  /**
   * 取消邀请
   */
  closeGuve: function(e) {
    this.setData({
      isGive: e.detail.isGive
    })
  },

  /**
   * 加好友
   */
  addFriends: function() {
    this.setData({
      showWeChat: true
    })
  },

  /**
   * 复制
   */
  copy: function(e) {
    var that = this
    wx.setClipboardData({
      data: e.currentTarget.dataset.weixin,
      success: function(res) {
        wx.showToast({
          title: '微信号复制成功',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      user_course_id: options.user_course_id || '',
      user_name: options.user_name || '',
    })
    this.getData()
  },

  /**
   * 取消 预约 退训 退营
   */
  apply: function() {
    let courseData = this.data.courseData
    let refundData = {
      ordersn: courseData.order.ordersn,
      start_at: courseData.start_at,
      end_at: courseData.end_at,
      name: courseData.data.course.name,
      pay_price: courseData.order.pay_price,
      coach_img: courseData.coach.headimgurl,
      coach_name: courseData.coach.name,
      pay_method: courseData.order.pay_method,
      type: courseData.data.course.type,
      orderType: courseData.order.type,
      is_spell: courseData.data.is_spell,
      spell_status: courseData.data.spell_status,
      order_status: courseData.order.status,
      course_num: courseData.data.course.type == 'team' ? courseData.order.course_num : '1'
    }
    app.refundData = refundData
    wx.navigateTo({
      url: '/pages/refund/help_refund',
    })
    this.setData({
      show: false
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
   * 申请退训
   */
  applyTrain: function() {
    this.setData({
      show: true
    })
  },

  /**
   * 关闭提示
   */
  closeTips: function() {
    this.setData({
      show: false
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
    let user_course_id = that.data.user_course_id
    ajax.post(api.getUserReserveDetail, {
      'user_course_id': user_course_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let obj = data.obj.result
        let ordersn = obj.ordersn
        let title = obj.data.course.name
        if (obj.data.course.type == 'camp') {
          title = obj.data.camp.course.name + obj.data.camp.name
        }
        let number = 0
        for (let index in obj.queue_order) {
          if (obj.queue_order[index].ordersn == ordersn) {
            number = parseInt(index) + 1
            break
          }
        }
        wx.setNavigationBarTitle({
          title: title
        })
        WxParse.wxParse('note', 'html', obj.data.course.note, that, 5)
        let nowtime = Math.round(new Date().getTime() / 1000)

        // 拼课倒计时
        let created_at = parseInt(obj.created_at) + 7200
        if (obj.data.spell_status == 1) {
          created_at = parseInt(obj.start_at) - 10800
        }
        that.getCountDown(created_at)
        
        // 显示可取消时间
        let start_at = parseInt(obj.start_at) - 21600
        
        // 显示入场密码
        let time = parseInt(obj.start_at) - parseInt(nowtime)
        that.setData({
          courseData: obj,
          number: number,
          time: time,
          nowtime: nowtime,
          start_at: start_at,
          min: 30 * 60,
        })
      }
    })
  },


  /**
   * 倒计时
   */
  getCountDown: function(timestamp) {
    let that = this
    setInterval(function() {
      let countDownTime = ''
      let nowTime = new Date()
      let endTime = new Date(timestamp * 1000)
      let t = endTime.getTime() - nowTime.getTime()
      if (t > 0) {
        let hour = Math.floor(t / 1000 / 60 / 60 % 24)
        let min = Math.floor(t / 1000 / 60 % 60)
        let sec = Math.floor(t / 1000 % 60)
        if (hour < 10) {
          hour = "0" + hour
        }
        if (min < 10) {
          min = "0" + min
        }
        if (sec < 10) {
          sec = "0" + sec
        }
        countDownTime = hour + '时' + min + "分" + sec + "秒"
      } else {
        countDownTime = `00时00分00秒`
      }

      that.setData({
        msg: countDownTime,
        showLoad: false
      })
    }, 1000)

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let that = this
    let courseData = that.data.courseData
    let user_name = that.data.user_name
    if (res.from == 'button' && courseData.data.is_spell == 1) {
      return {
        title: user_name + '邀请你拼课',
        path: '/pages/lesson_collage/share?team_id=' + courseData.data.id + '&send_user_id=' + courseData.user_id,
        imageUrl: ''
      }
    }
    if (res.from == 'button' && courseData.data.course.type == 'team') {
      let course_id = courseData.data.course.id
      that.give = that.selectComponent("#give")
      that.give.closeGuve()
      that.share = that.selectComponent("#share")
      that.share.showTips()
      return {
        title: 'MORANGE',
        path: '/pages/league/details?team_id=' + course_id,
        imageUrl: ''
      }
    }
  }
})