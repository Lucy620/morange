// pages/user/user.js
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
    authUser: false, // 未授权
    privilegeList: [{
      'main_img': 'https://boringcdn.nanningboring.com/molicheng/privilege-icon.png',
      'privilege_tips_title': '解锁勋章成就',
      'privilege_tips': '挑战100节BP，解锁『 BP MONSTER 』勋章，赢取专属战袍，冲击名人堂！还有更多其他挑战...',
    }, {
      'main_img': 'https://boringcdn.nanningboring.com/molicheng/privilege-icon4.png',
      'privilege_tips_title': '预约专享95折',
      'privilege_tips': '课程，自助健身享受折扣优惠；课程，自助健身享受折扣优惠；(但不享折扣)',
    }, {
      'main_img': 'https://boringcdn.nanningboring.com/molicheng/privilege-icon2.png',
      'privilege_tips_title': '魔力星排名',
      'privilege_tips': '加入魔力橙全球榜，给你的锻炼更多动力，每次课程结束后，更有专属你的排名海报',
    }, {
      'main_img': 'https://boringcdn.nanningboring.com/molicheng/privilege-icon3.png',
      'privilege_tips_title': '满员等候特权',
      'privilege_tips': '满员课程，魔橙卡预支付等候，自动补排空位，若未排上自动退款',
    }],
    showPrivilege: false, // 特权
    isShow: false
  },

  /**
   * 登录
   */
  goLogin: function () {
    var that = this
    ajax.cleanLogin()
    ajax.doLogin().then((res) => {
      app.loginPromise = ''
      that.getData()
    })
  },

  /**
   * 跳转页面
   */
  jumpPage: function (e) {
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

  /***
   * 勋章列表
   */
  openMedalList: function () {
    let user = this.data.user
    if (user.type == 'vip') {
      wx.navigateTo({
        url: '/pages/medal/list',
      })
    } else {
      wx.navigateTo({
        url: '/pages/recharge/recharge?type=normal',
      })
    }
  },


  /**
   * 查看特权
   */
  openPrivilege: function () {
    this.setData({
      showPrivilege: true
    })
  },

  /**
   * 关闭特权
   */
  closePrivilege: function () {
    this.setData({
      showPrivilege: false
    })
  },

  /**
   * 显示金额
   */
  displayAmount: function () {
    this.setData({
      isShow: !this.data.isShow
    })
  },

  /**
   * 获取用户信息
   */
  onGotUserInfo: function (e) {
    var that = this
    let authUser = this.data.authUser
    if (authUser) {
      wx.getUserInfo({
        success: function (res) {
          app.updateUserInfo(res.userInfo, that)
        }
      })
    } else {
      if (e.detail.errMsg == "getUserInfo:ok") {
        app.updateUserInfo(e.detail.userInfo, that)
      }
    }
  },


  /**
   * 
   * @param {数组排序} arr 
   */
  arrSort: function (arr) {
    return function (a, b) {
      var value1 = a[arr]
      var value2 = b[arr]
      return value1 - value2
    }
  },


  /**
   *  初始化数据
   */
  getData: function () {
    let that = this
    ajax.post(api.getMccardHome, {

    }, ({
      data
    }) => {
      if (data.code == 200) {
        let user = data.obj.user
        let integral = data.obj.integral
        let integralItem = ''
        let speed = ''
        let scalableName = ''
        let tipsText = ''
        // 最大等级
        if (user.total_integral >= integral[integral.length - 1].integral) {
          integralItem = integral[integral.length - 1]
          tipsText = '已是最高级'
          speed = 100
        } else {
          // 排序数组
          integral = integral.sort(that.arrSort('integral'))
          for (let idx in integral) {
            // 当前等级
            if (user.total_integral < integral[idx].integral) {
              integralItem = integral[idx]
              if (!integral[parseInt(idx) + 1]) tipsText = '已是最高级'
              scalableName = integral[parseInt(idx) + 1] ? integral[parseInt(idx) + 1].name : integral[idx].name
              speed = (parseInt(user.total_integral) / parseInt(integral[idx].integral)) * 100
              break
            }
          }
        }
        that.setData({
          user: user,
          medal: data.obj.medal,
          showLoad: false,
          integralItem: integralItem,
          scalableName: scalableName,
          integral: integral,
          speed: speed,
          tipsText: tipsText,
          showTab: false
        })
        app.showTab = false
      }
    }, 'noauth')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      showTab: app.showTab
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
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 3
        })
      }
    var that = this
    that.getData()
    var authUser = false
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          authUser = true
        }
        that.setData({
          authUser: authUser
        })
      }
    })
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


})