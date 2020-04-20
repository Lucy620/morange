var app = getApp();
import config from './config';
var wxPromise = require('./wxPromise');
var util = require('./util');
var api = require('../api/api');

/**
 * http statusCode不等于200时，返回错误信息
 */
function _errMsg(code, url, data) {
  var errTip = code + '：' + url + '; ';
  return (typeof(data) == 'string') ? (errTip + data.substr(0, 300)) : errTip;
}

/**
 * 设置openid（不为空则直接授权，为空wx.login）
 */
function _setOpenid(openid) {
  try {
    openid = openid ? openid : ''
    app.globalData.openid = openid
    wx.setStorageSync('openid', openid)
  } catch (e) {
    console.log(e)
    app.globalData.fundebug.notifyError(e)
  }
}

/**
 * 设置minisession（为空则wx.login,授权，不为空跳过）
 */
function _setMinisession(session) {
  try {
    session = session ? session : ''
    app.globalData.minisession = session
    wx.setStorageSync(config.BASE.minisessionKey, session)
  } catch (e) {
    console.log(e)
    app.globalData.fundebug.notifyError(e)
  }
}

/**
 * 清空登录状态
 */
function _cleanLogin() {
  app.loginPromise = ''
  _setOpenid();
  _setMinisession();
}

/**
 * 小程序静默登录
 */
function _doLogin(url, load) {
  // 防止并发业务接口多次进入登录逻辑
  if (app.loginPromise) {
    return Promise.race([app.loginPromise])
  }
  app.loginPromise = new Promise((resolve, reject) => {
    if (!app.globalData.openid && !app.globalData.minisession) {
      // 获取第三方登录态
      wx.login({
        success: function (res) {
          app.isLogin = false // 可重新授权
          if (!res.code) {
            reject(res.errMsg)
            return
          }
          wx.request({
            url: api.miniProgramLogin,
            data: {
              code: res.code
            },
            method: 'GET',
            success: function (res) {
              if (res.statusCode != 200) {
                reject(_errMsg(res.statusCode, url, res.data))
                return
              }
              var code = res.data.code
              if (code == 200 || code == 403) {
                (code == 200) && _setMinisession(res.data.obj.session);
                (code == 403) && _setOpenid(res.data.obj.openid);
                resolve()
              } else {
                reject('api.miniProgramLogin 请求出错' + res.errMsg)
              }
            },
            fail(err) {
              reject(err)
            }
          })
        },
        fail: function (err) {
          reject(err)
        }
      })
    } else {
      resolve('success')
    }
  }).then(() => new Promise((resolve, reject) => {
    // 检查用户是否登录
    if (url != api.miniProgramInitUser && !app.globalData.minisession) {
      load || wx.hideLoading()
      // session_key是否过期
      wx.checkSession({
        success() {
          app.loginPromise = ''
        },
        fail() {
          // session_key失效，重新执行登录流程
          _cleanLogin()
        }
      })
      // 当前页面url
      app.redirectUrl = util.getUrl()
      wx.redirectTo({
        url: "/pages/login/login"
      })
      return
    }
    resolve()
  }))
  return app.loginPromise
}

/**
 * _request请求
 */
function _request(method, url, data, success, type, load) {
  load || wx.showLoading({
    title: config.AJAX.load,
    mask: true
  })
  let pro = ''
  // 不执行授权操作
  if (type == 'noauth') {
    pro = wxPromise.request({
      url: url,
      header: {
        'Minisession': app.globalData.minisession
      },
      method: method,
      data: data
    })
  } else {
    pro = _doLogin(url, load).then((res) => {
      return wxPromise.request({
        url: url,
        header: {
          'Minisession': app.globalData.minisession
        },
        method: method,
        data: data
      })
    })
  }

  pro.then((res) => new Promise((resolve, reject) => {
    if (res.statusCode != 200) {
      reject(_errMsg(res.statusCode, url, res.data))
      return
    }
    // 登录态过期，重新执行登录流程
    load || wx.hideLoading()
    if (res.data.code == 403) {
      _cleanLogin()
      if (!app.isLogin) {
        app.isLogin = true
        var currentpages = getCurrentPages()
        var index = currentpages.length - 1
        currentpages[index].onLoad(currentpages[index].options)
        currentpages[index].onShow()
      }
      return
    }
    success(res)
  })).catch(function (err) {
    load || wx.hideLoading()
    if (!app.showModel) {
      app.showModel = true
      wx.navigateTo({
        url: '/pages/error/error',
      })
    }
    console.log(err)
    app.globalData.fundebug.notifyError(err)
  })
}

/**
 * 封装GET请求
 */
function _get(url, data, success, type, load) {
  _request('GET', url, data, success, type, load)
}

/**
 * 封装POST请求
 */
function _post(url, data, success, type, load) {
  _request('POST', url, data, success, type, load)
}

module.exports = {
  doLogin: _doLogin,
  cleanLogin: _cleanLogin,
  setOpenid: _setOpenid,
  setMinisession: _setMinisession,
  get: _get,
  post: _post
}
