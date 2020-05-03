import config from 'utils/config'
import api from 'api/api'
const ald = require('utils/ald-stat.js')
var fundebug = require('utils/fundebug.1.3.1.min.js') 
!config.SYSTEM.debug && fundebug.init({
  apikey: config.BASE.fundebugApikey,
  setUserInfo: true,
  setSystemInfo: true,
  filters: [{
    req: {
      url: /log\.aldwx\.com/,
      method: /^GET$/
    }
  }]
})
App({
  globalData: {
    fundebug: fundebug,
    minisession: '',
    openid: '',
    cities: []
  },
  shoppingList: '', // 购物清单(下单)
  couponList: '', // 代金券(下单)
  refundData: '', // 退款数据
  showModel: false, // 防止出现多个弹窗
  isLogin: false, // 防止多次登录
  redirectUrl: '', // 重定向地址
  loginPromise: '', // 缓存登录流程，防止多次执行
  showTab: true, // 显示隐藏 loading

  /**
   * 小程序初始化完成时（全局只触发一次）
   */
  onLaunch: function(options) {
    wx.hideTabBar({})
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    try {
      this.globalData.minisession = wx.getStorageSync(config.BASE.minisessionKey)
      this.globalData.openid = wx.getStorageSync('openid')
    } catch (e) {
      console.log(e)
      fundebug.notifyError(e)
    }
  },

  onShow: function() {
    var that = this
    // 检验用户授权获取信息
    wx.getUserInfo({
      success: function(res) {
        that.updateUserInfo(res.userInfo)
      }
    })
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: function(userInfo, page) {
    console.log(page)
    let that = this
    let user = wx.getStorageSync('userInfo') || ''
    if (JSON.stringify(userInfo) != user && that.globalData.minisession) {
      wx.request({
        url: api.updateAvatarAndNickname,
        data: {
          'headimgurl': userInfo.avatarUrl,
          'nickname': userInfo.nickName
        },
        method: 'POST',
        header: {
          'Minisession': that.globalData.minisession
        },
        success: function(res) {
          if (res.data.code == 200) {
            page && page.setData({
              'user.miniprogram.headimgurl': userInfo.avatarUrl
            })
            wx.setStorageSync('userInfo', JSON.stringify(userInfo))
          }
        }
      })
    }
  }

})