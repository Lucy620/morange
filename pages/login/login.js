var app = getApp()
import { config, api, ajax, util, wxPromise } from '../../utils/myapp.js'

Page({
  data: {
    name: config.BASE.name,
    logo: config.BASE.logo,
    phoneModel: '',
    channel: ''
  },

  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({ // 获取手机品牌
      success: function (res) {
        that.setData({
          phoneModel: res.brand + ',' + res.model
        })
      }
    })
  },

  /**
   * 跳转页面
   */
  jumpPage: function() {
    var index = config.BASE.tabPages.indexOf(app.redirectUrl)
    if (index != -1) {
      wx.switchTab({
        url: app.redirectUrl
      })
    } else if (index !=1 || !app.redirectUrl || app.redirectUrl == '/pages/login/login') {
      wx.switchTab({
        url: '/pages/course/course'
      })
    } else {
      wx.redirectTo({
        url: app.redirectUrl
      })
    }
  },

  onShow: function() {
  },

  // 拒绝授权
  refuseAuth: function (e) {
    var pages = getCurrentPages()
    if (pages.length == 1) {
      this.jumpPage()
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  getUserInfo: function(e) {
    var that = this
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showToast({
        icon: 'none',
        title: '拒绝授权将无法体验完整功能，建议打开用户信息授权',
        duration: 3000
      })
    } else {
      ajax.get(api.miniProgramInitUser, {
        iv: e.detail.iv,
        encrypted_data: e.detail.encryptedData,
        openid: app.globalData.openid,
        phone_model: that.data.phoneModel,
        channel: that.data.channel
      }, (res) => {
        if (res.data.code == 200) {
          ajax.setMinisession(res.data.obj.session);
          wx.showToast({
            icon: 'none',
            title: '授权成功'
          })
          setTimeout(function(){
            that.jumpPage()
          }, 1000)
        } else {
          ajax.cleanLogin();
          wx.showToast({
            icon: 'none',
            title: res.data.msg
          })
        }
      })
    }
  }

})