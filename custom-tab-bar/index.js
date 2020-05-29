const app = getApp();
Component({
  data: {
    selected: 1,
    color: "#7A7E83",
    selectedColor: "#ff6700",
    list: [], //tabBar的数据
    touchStartTime: 0,
    touchEndTime: 0,
    lastTapTime: 0,
    lastTapTimeoutFunc: null,
  },
  lifetimes: {
    //组件的生命周期函数
    attached() {
      let query = this.createSelectorQuery();
      query.select('#tab-bar').boundingClientRect(function (rect) {
        app.globalData.barHeight = rect.height
      }).exec();
  
      this.setData({
        list: app.globalData.list
      })
    },
  },
  methods: {
    switchTab(e) {
      let that = this
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      that.setData({
        selected: data.index
      })
      if (that.data.selected == 1) {
        // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
        if (that.data.touchEndTime - that.data.touchStartTime < 350) {
          // 当前点击的时间
          var currentTime = Date.parse(new Date())
          var lastTapTime = that.data.lastTapTime
          // 更新最后一次点击时间
          that.data.lastTapTime = currentTime
          // 如果两次点击时间在200毫秒内，则认为是双击事件
          if (currentTime - lastTapTime < 200) {
            // 双击事件
            clearTimeout(that.data.lastTapTimeoutFunc);
            wx.startPullDownRefresh({
              complete: (res) => {},
            })
          } else {
            that.data.lastTapTimeoutFunc = setTimeout(function () {
              // 单击事件
            }, 200);
          }
        }
      }
    }
  }
})