// pages/user/integralDetail.js
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
    background: [
      'https://boringcdn.nanningboring.com/molic/bronze-bg.png',
      'https://boringcdn.nanningboring.com/molic/silver-bg.png',
      'https://boringcdn.nanningboring.com/molic/gold-bg.png',
      'https://boringcdn.nanningboring.com/molic/masonry-bg.png',
      'https://boringcdn.nanningboring.com/molic/the_king-bg.png'
    ], // 背景
    grade: 0, // 等级
    iconList: {
      '0': [{
          'name': '专属页面',
          'icon': 'https://boringcdn.nanningboring.com/molic/equity-icon1.png',
          'type': 'exclusive'
        },
        {
          'name': '更多权益',
          'icon': 'https://boringcdn.nanningboring.com/molic/equity-icon2.png',
          'type': 'more'
        }
      ], // 青铜
      '1': [{
          'name': '专属页面',
          'icon': 'https://boringcdn.nanningboring.com/molic/silver-icon1.png',
          'type': 'exclusive'
        },
        {
          'name': '更多权益',
          'icon': 'https://boringcdn.nanningboring.com/molic/silver-icon2.png',
          'type': 'more'
        }
      ], // 白银
      '2': [{
          'name': '专属页面',
          'icon': 'https://boringcdn.nanningboring.com/molic/gold-icon1.png',
          'type': 'exclusive'
        },
        {
          'name': '更多权益',
          'icon': 'https://boringcdn.nanningboring.com/molic/gold-icon2.png',
          'type': 'more'
        }
      ], // 黄金
      '3': [{
          'name': '专属页面',
          'icon': 'https://boringcdn.nanningboring.com/molic/masonry-icon1.png',
          'type': 'exclusive'
        },
        {
          'name': '更多权益',
          'icon': 'https://boringcdn.nanningboring.com/molic/masonry-icon2.png',
          'type': ''
        }
      ], // 砖石
      '4': [{
          'name': '专属页面',
          'icon': 'https://boringcdn.nanningboring.com/molic/the_king-icon1.png',
          'type': 'exclusive'
        },
        {
          'name': '更多权益',
          'icon': 'https://boringcdn.nanningboring.com/molic/the_king-icon2.png',
          'type': 'more'
        }
      ] // 王者
    }, // 权益图标
    showLoad: true
  },

  /**
   * 
   */
  openTips: function () {
    wx.showToast({
      title: '敬请期待~',
      icon: 'none'
    })
  },

  /**
   * 
   * @param {去完成} e 
   */
  goComplete: function (e) {
    let status = e.currentTarget.dataset.status
    let type = e.currentTarget.dataset.type
    console.log(!status, type)
    if (status == 'wait') {
      this.openTips()
      return
    } else if (!status && type == 'first_team' || type == 'every_train') {
      wx.switchTab({
        url: '/pages/course/course'
      })
    } else if (!status && type == 'first_private') {
      wx.navigateTo({
        url: '/pages/private_education/list'
      })
    } else if (!status && type == 'first_camp') {
      wx.navigateTo({
        url: '/pages/training_camp/list'
      })
    }

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
    ajax.post(api.getIntegralGradeList, {

    }, ({
      data
    }) => {
      if (data.code == 200) {
        let integral = data.obj.integral
        let grade_id = that.data.grade_id
        let task = data.obj.task
        let user = data.obj.user
        let integralItem = ''
        let speed = 0
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
          integral: integral,
          task: task,
          integralItem: integralItem,
          speed: speed,
          user: user,
          scalableName: scalableName,
          tipsText: tipsText,
          showLoad: false
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      grade_id: options.grade_id || '',
      grade: options.grade_id ? parseInt(options.grade_id) - 1 : ''
    }, () => {
      this.getData()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})