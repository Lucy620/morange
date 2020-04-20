// pages/components/forwarding/forwarding.js
const app = getApp()
import {
  config,
  api,
  ajax,
  util,
  wxPromise
} from '../../../utils/myapp.js'
Component({
  //初始默认为当前日期
  properties: {
    isGive: {
      type: Boolean,
      value: false
    },
    course_id: {
      type: String,
      value: 0
    }
  },

  // 组件的初始数据
  data: {},
  ready: function() {},

  methods: {
    closeGuve: function() {
      this.triggerEvent('closeGuve', {
        isGive: false
      });
    },

    /**
     * 跳转页面
     */
    jumpPage: function(e) {
      let url = e.currentTarget.dataset.url || ''
      let index = config.BASE.tabPages.indexOf('/' + url)
      if (index != -1) {
        wx.switchTab({
          url: '/' + url
        })
      } else if (url) {
        wx.navigateTo({
          url: '/' + url
        })
      }
      this.setData({
        isGive: false
      })
    },
  }
})