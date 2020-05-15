// pages/cash_coupon/cash_coupon.js
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
    showBack: false,
    list: [],
    code: '',
    showExplain: false
  },

  /**
   * 查看范围
   */
  openExplain: function(e) {
    let title = e.currentTarget.dataset.name
    let notice = e.currentTarget.dataset.notice
    this.setData({
      title: title,
      notice: notice,
      showExplain: true
    })
  },

  /**
   * 关闭说明
   */
  closeTips: function() {
    this.setData({
      showExplain: false
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

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    ajax.post(api.userCouponList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          list: data.obj.list,
          showLoad: false
        })
      }
    })
  },

  /***
   * 兑换码
   */
  binKeyValue: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  /**
   * 兑换
   */
  exchange: function() {
    let that = this
    let code = that.data.code
    if (util.isEmpty(code)) {
      wx.showToast({
        title: '请输入兑换码',
        icon: 'none'
      })
      return
    }
    ajax.post(api.receiveUserCoupon, {
      'code': code
    }, ({
      data
    }) => {
      if (data.code == 200) {
        var msg = data.obj.type == "money" ? "现金红包兑换成功，请查看魔橙卡余额" : "代金券兑换成功"
        that.setData({
          code: ''
        })
        wx.showModal({
          title: '恭喜你',
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: '#ff6e0d',
          content: msg,
          success(res) {
            that.getData()
          }
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
   * 获取URL参数
   */
  getUrlParams(url, key) {
    var value = '', pair = ''
    if (url.indexOf("?") == -1) {
      return value
    }
    url = url.split("?");
    var arr = url[1].split("&");
    for (var i = 0; i < arr.length; i++) {
      pair = arr[i].split("=");
      if (pair[0] == key) { value = pair[1]; }
    }
    return value
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.q) {
      var code = this.getUrlParams(decodeURIComponent(options.q), 'code')
      if (code) {
        this.setData({
          code: code
        })
        this.checkCouponCode()
      }
    }
    var pages = getCurrentPages()
    this.setData({
      showBack: pages.length == 1 ? true : false
    })
  },

  /**
   * 检验代金券兑换码
   */
  checkCouponCode: function () {
    var that = this
    let code = that.data.code
    ajax.post(api.checkCouponCode, {
      'code': code
    }, ({
      data
    }) => {
        if (data.code == 200) {
          var coupon = data.obj.coupon
          wx.showModal({
            title: '恭喜你',
            cancelColor: '#999999',
            confirmText: '立即领取',
            confirmColor: '#ff6e0d',
            content: "获得1张" + coupon.name,
            success(res) {
              if (res.confirm) {
                that.exchange()
              }
            }
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