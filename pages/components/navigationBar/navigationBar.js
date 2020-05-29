// pages/components/navigationBar/navigationBar.js
const app = getApp()
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    hasBack: {
      type: Boolean,
      value: false
    },
    background: {
      type: String,
      value: '#000'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 0, // 状态栏高度
    navbarHeight: 0, // 顶部导航栏高度
    navbarBtn: { // 胶囊位置信息
      height: 0,
      width: 0,
      top: 0,
      bottom: 0,
      right: 0
    }
  },
  ready: function () {
    this.attached();
  },


  /**
   * 组件的方法列表
   */
  methods: {
    //自定义导航上内边距自适应
    attached: function attached() {
      var _this = this;
      var isSupport = !!wx.getMenuButtonBoundingClientRect;
      var rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      wx.getSystemInfo({
        success: function success(res) {
          var ios = !!(res.system.toLowerCase().search('ios') + 1);
          _this.setData({
            ios: ios,
            screenWidth: res.windowWidth,
            statusBarHeight: res.statusBarHeight,
            innerWidth: isSupport ? 'width:' + rect.left + 'px' : '',
            innerPaddingRight: isSupport ? 'padding-right:' + (res.windowWidth - rect.left) + 'px' : '',
            leftWidth: isSupport ? 'width:' + (res.windowWidth - rect.left) + 'px' : ''
          });
        }
      });

      //获取胶囊按钮信息
      let statusBarHeight = app.globalData.systeminfo.statusBarHeight // 状态栏高度
      let headerPosi = app.globalData.headerBtnPosi // 胶囊位置信息

      /**
       * wx.getMenuButtonBoundingClientRect() 坐标信息以屏幕左上角为原点
       * 菜单按键宽度： 87
       * 菜单按键高度： 32
       * 菜单按键左边界坐标： 278
       * 菜单按键上边界坐标： 26
       * 菜单按键右边界坐标： 365
       * 菜单按键下边界坐标： 58
       */
      let btnPosi = { // 胶囊实际位置，坐标信息不是左上角原点
        height: headerPosi.height,
        width: headerPosi.width,
        top: headerPosi.top - statusBarHeight, // 胶囊top - 状态栏高度
        bottom: headerPosi.bottom - headerPosi.height - statusBarHeight, // 胶囊bottom - 胶囊height - 状态栏height （胶囊实际bottom 为距离导航栏底部的长度）
        right: app.globalData.systeminfo.screenWidth - headerPosi.right // 屏幕宽度 - 胶囊right
      }
      let haveBack;
      if (getCurrentPages().length === 1) { // 当只有一个页面时，并且是从分享页进入
        haveBack = false;
      } else {
        haveBack = true;
      }
      this.setData({
        statusBarHeight: statusBarHeight,
        navbarHeight: headerPosi.bottom + btnPosi.bottom, // 胶囊bottom + 胶囊实际bottom
        navbarBtn: btnPosi
      })
    },
    back: function () {
      wx.navigateBack({ changed: true })
    },
    goHome: function () {      
      wx.switchTab({
        url: '/pages/course/course',
      })
    }

  }
})
