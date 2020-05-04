export default {
  BASE: {
    name: '魔力橙',
    logo: 'http://boringcdn.nanningboring.com/Flc0m7az2_GIAh9ai9bHYAgVHOXn',
    apiUrl: 'https://ml.gxsolution.cn/api/mall/', // 正式服务器
    apiTestUrl: 'http://125.94.90.22:8089/api/mall/', // 测试服务器
    wxPayUrl: 'https://ml.gxsolution.cn/wxMpPay', // 微信支付地址
    fundebugApikey: 'ff717789e60a82896db090dfd919f23fe4634bc69f9688f2df79e944fc26dce5',
    minisessionKey: 'minisession', // 小程序Storage缓存的minisessionKey
    tabPages: ['/pages/index/index', '/pages/course/course', '/pages/reservation/my_reservation', '/pages/user/user'] // tabBar菜单页面url
  },
  SYSTEM: {
    debug: true // 是否开启本地调试 上线false, 本地true
  },
  AJAX: {
    load: '正在加载...',
    loginExpire: '登录态过期',
    requestFail: '系统繁忙'
  },
  PACKAGES: {
    author: 'boring'
  }
}