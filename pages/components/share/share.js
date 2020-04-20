// pages/components/forwarding/forwarding.js
Component({
  //初始默认为当前日期
  properties: {
    isShare: {
      type: Boolean,
      value: false
    }
  },

  // 组件的初始数据
  data: {},
  ready: function() {},

  methods: {
    know: function() {
      this.setData({
        isShare: false
      })
    },
    showTips: function() {
      let show = wx.getStorageSync('isShare')
      let isShare = true
      if (show == 'false') {
        isShare = false
      }
      this.setData({
        isShare: isShare
      })
    },
    noTips: function () {
      this.setData({
        isShare: false
      })
      wx.setStorageSync('isShare', 'false')
    },
  }
})