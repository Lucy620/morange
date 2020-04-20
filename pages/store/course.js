// pages/store/course.js

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
    weekText: {
      '0': '今天',
      '1': '明天',
      '2': '后天',
      '3': '周',
      '4': '周',
      '5': '周',
    },
    weekList: [],
    weekIndex: 0,
    store_id: 0,
    name: '',
    limit: 6,
    pageArr: [{
      'page': 2,
      'lastPage': false
    }, {
      'page': 2,
      'lastPage': false
    }, {
      'page': 2,
      'lastPage': false
    }, {
      'page': 2,
      'lastPage': false
    }, {
      'page': 2,
      'lastPage': false
    }, {
      'page': 2,
      'lastPage': false
    }],
    showLoad: true,
  },

  /**
   * 跳转页面
   */
  jumpPage: function(e) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let curDate = new Date()
    let weekList = []
    for (let i = 0; i <= 5; i++) {
      let date = new Date(curDate.getTime() + 24 * 60 * 60 * i * 1000)
      weekList.push({
        time: Math.round((new Date(curDate.getTime() + 24 * 60 * 60 * i * 1000)) / 1000),
        week: this.getWeek(date)
      })
    }
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      store_id: options.store_id || '',
      name: options.name,
      weekList: weekList,
      nowtime: Math.round(new Date().getTime() / 1000)
    })
  },

  /**
   * 获取当前星期
   */
  getWeek: function(date) {
    let week;
    if (date.getDay() == 0) week = "日"
    if (date.getDay() == 1) week = "一"
    if (date.getDay() == 2) week = "二"
    if (date.getDay() == 3) week = "三"
    if (date.getDay() == 4) week = "四"
    if (date.getDay() == 5) week = "五"
    if (date.getDay() == 6) week = "六"
    return week;
  },

  /***
    *  scroll-view 滚动底部触发
    */
  lower: function () {
    this.getCourseTeam()
  },

  /**
   * scroll-view 滚动顶部触发
   */
  upper: function () {
    let pageArr = this.data.pageArr
    for (let item of pageArr) {
      item.lastPage = false
    }
    this.setData({
      pageArr: pageArr
    })
    this.getData()
  },


  /**
   * 查看位置
   */
  seeMap: function(e) {
    let latitude = e.currentTarget.dataset.latitude
    let longitude = e.currentTarget.dataset.longitude
    let name = e.currentTarget.dataset.name
    let address = e.currentTarget.dataset.address
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: name,
      address: address
    })
  },

  /**
   * 选择星期
   */
  selectDate: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      weekIndex: index,
    })
  },

  /**
   * 滑动选择
   */
  binSwiper: function(e) {
    this.setData({
      weekIndex: e.detail.current,
    })
  },


  /***
   * 初始化数据
   */
  getData: function() {
    let that = this
    let store_ids = [that.data.store_id]
    let weekList = that.data.weekList
    let weekIndex = that.data.weekIndex
    ajax.post(api.getCourseTeamListAll, {
      'store_ids': store_ids,
      'time': weekList[weekIndex].time,
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        for (let i in list) {
          for (let item of list[i]) {
            item.team = that.countPercent(item.team)
          }
        }
        that.setData({
          courseList: list,
          showLoad: false
        })
      }
    })
  },


  /**
   * 预约人数百分比（剩余）
   */
  countPercent: function (arr) {
    for (let item of arr) {
      item.percent = (parseInt(item.rest_stock)) / parseInt(item.total_stock) * 100
    }
    return arr
  },


  /**
   * 获取单日团课
   */
  getCourseTeam: function() {
    let that = this
    let store_ids = [that.data.store_id]
    let weekList = that.data.weekList
    let weekIndex = that.data.weekIndex
    let limit = that.data.limit
    let pageArr = that.data.pageArr
    let courseList = that.data.courseList

    if (pageArr[weekIndex].lastPage) {
      return
    }

    ajax.post(api.getCourseTeamList, {
      'page': pageArr[weekIndex].page,
      'limit': limit,
      'store_ids': store_ids,
      'time': weekList[weekIndex].time,
    }, ({
      data
    }) => {
      if (data.code == 200) {
        pageArr[weekIndex].page++
        let list = data.obj.list
        for (let i in list) {
          for (let item of list[i]) {
            item.team = that.countPercent(item.team)
          }
        }
        courseList[weekIndex] = courseList[weekIndex].concat(list)
        if (list.length < limit) {
          pageArr[weekIndex].lastPage = true
        } else {
          pageArr[weekIndex].lastPage = false
        }
        that.setData({
          courseList: courseList,
          pageArr: pageArr
        })
      }
    })
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getCourseTeam()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})