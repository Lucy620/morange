// pages/recharge/recharge.js
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
    show: false,
    user: '',
    showLoad: true,
    list: [],
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type || 'normal'
    })
  },

  /**
   *  初始化数据
   */
  getData: function() {
    let that = this
    let type = that.data.type
    ajax.post(api.getMccardHome, {}, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          user: data.obj.user,
        })
      }
    })
    ajax.post(api.getChargeList, {
      'type': type
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          list: data.obj.list,
          tips_text: data.obj.tips_text,
          nowtime: Math.round(new Date().getTime() / 1000),
          showLoad: false
        })
      }
    })
  },

  /**
   * 创建秒杀充值
   */
  createSnatchCharge: function (e) {
    let that = this
    let nowtime = that.data.nowtime
    let charge_id = e.currentTarget.dataset.id
    let start_at = e.currentTarget.dataset.start_at
    let end_at = e.currentTarget.dataset.end_at
    let stock = e.currentTarget.dataset.stock
    if (nowtime < start_at) {
      wx.showToast({
        title: '活动于' + util.formatTime(start_at, '{y}-{m}-{d} {h}:{i}') + '开启',
        icon: 'none',
      })
      return
    }
    if (stock == 0) {
      wx.showToast({
        title: '已售罄',
        icon: 'none',
      })
      return
    }
    if (nowtime > end_at) {
      wx.showToast({
        title: '活动已结束',
        icon: 'none',
      })
      return
    }
    ajax.post(api.createChargeOrder, {
      'charge_id': charge_id
    }, ({
      data
    }) => {
        if (data.code == 200) {
          that.wxPay(data.obj.order_result.ordersn)
        }
      })
  },

  /**
   * 创建充值
   */
  createCharge: function(e) {
    let that = this
    let charge_id = e.currentTarget.dataset.id
    ajax.post(api.createChargeOrder, {
      'charge_id': charge_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.wxPay(data.obj.order_result.ordersn)
      }
    })
  },

  /**
   * 微信支付
   */
  wxPay(ordersn) {
    let that = this
    //发起微信支付
    ajax.post(api.wxMpPay, {
        "ordersn": ordersn
      },
      ({
        data
      }) => {
        if (data.code == 200) {
          //调起微信支付
          wx.requestPayment({
            'timeStamp': data.obj.config.timeStamp,
            'nonceStr': data.obj.config.nonceStr,
            'package': data.obj.config.package,
            'signType': 'MD5',
            'paySign': data.obj.config.paySign,
            'success': function(res) {
              that.setData({
                show: true
              })
            },
            'fail': function(res) {
              wx.showModal({
                content: '离支付成功只差一步,怎么能轻易放弃？',
                cancelText: '放弃支付',
                confirmText: '继续支付',
                success: function(res) {
                  if (res.confirm) {
                    that.wxPay(ordersn)
                  } else if (res.cancel) {

                  }
                },
              })
            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: data.msg
          })
        }
      }
    )
  },

  /**
   * 返回
   */
  goBack: function() {
    if (this.data.type == 'normal') {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.switchTab({
        url: '/pages/user/user',
      })
    }
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
    let pages = getCurrentPages()
    let beforePage = pages[pages.length - 2]
    if (this.data.show && beforePage && beforePage.route == 'pages/confirm_order/confirm_order') {
      beforePage.getData()
    }
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