// pages/course/course.js
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
    cover: false, //遮罩
    type: 'screen', // 动画类型
    region: [], // 门店区域
    regionIndex: 0,
    areaList: [], // 门店城市
    areaIndex: 0,
    storeNumber: 0, // 已选门店数量
    advList: [], // 轮播
    storeList: [], // 店面
    storeIndex: 0,
    is_hide: false, //是否显示过期
    search_time: [], //时段
    searchTimeIndex: 0,
    courseTargetList: [], // 课程目的
    courseCategoryList: [], // 课程类型
    courseNumber: 0, // 已选课程数量
    course: [], // 筛选的课程
    target_ids: [], // 选择目的ID
    category_ids: [], // 选择类型ID
    search_time: '全部时段',
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
    nowtime: '',
    isShare: false,
    course_ids: [],
    curTab: 'general_course',

    priCourseList: [], //私教列表,
    priList: [],
    priStoreList: [],
    priCoverList: [],

    campList: [],  //训练营列表，
    campTagList: [],

    coachList: [],
    coach_id: 0,
    coachIndex: 0,
    coachCourseList: [],
    jointCover:false
  },

  /***
   *  scroll-view 滚动底部触发
   */
  lower: function() {
    this.getCourseTeam()
  },

  /**
   * scroll-view 滚动顶部触发
   */
  upper: function() {
    let pageArr = this.data.pageArr
    for (let item of pageArr) {
      item.lastPage = false
    }
    this.setData({
      pageArr: pageArr
    })

    this.getCourseTeamListAll()
  },

  /**
   * 
   * @param {触摸刷新} options 
   */
  listTouchStart:function(e) {
    console.log('触摸刷新')
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.animation = wx.createAnimation()
    this.jointAnimation = wx.createAnimation()
    let curDate = new Date()
    let weekList = []
    for (let i = 0; i <= 5; i++) {
      let date = new Date(curDate.getTime() + 24 * 60 * 60 * i * 1000)
      weekList.push({
        time: Math.round((new Date(curDate.getTime() + 24 * 60 * 60 * i * 1000)) / 1000),
        week: this.getWeek(date)
      })
    }
    this.setData({
      weekList: weekList,
      showTab: app.showTab
    })
    this.getStoreArea()
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

  /**
   * 跳转页面
   */
  jumpPage: function(e) {
    var url = e.currentTarget.dataset.url || ''
    var index = config.BASE.tabPages.indexOf('/' + url)

    if (url.indexOf('http') != -1) {
      // 跳转第三方web端链接
      wx.navigateTo({
        url: '/pages/outreach/outreach?url=' + url
      })
      return
    }

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
      weekIndex: index
    })
  },

  /**
   * 滑动选择
   */
  binSwiper: function(e) {
    this.setData({
      weekIndex: e.detail.current
    })
  },

  /**
   * 显示隐藏 结束时间段
   */
  hiddenEnd: function() {
    this.setData({
      is_hide: !this.data.is_hide
    })
  },

  /**
   * 打开城市、课程、时段
   *
   */
  openAnimation: function(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      cover: true,
      type: type
    })
    this.translate()
  },

  /**
   * 切换顶部tab
   *
   */
  onTabChange: function(e) {
    let that = this
    let tab = e.currentTarget.dataset.type
    that.setData({
      curTab: tab
    })
    switch(tab){
        case 'general_course': 
          //团课
        break
        case 'private_course': 
          //私教
          this.getStoreAreaList()
          this.getCoursePrivateCourseList()
        break

        case 'camp': 
          //训练营
          this.getCampStoreAreaList()
        break
        
        case 'joint_course': 
          this.getJointData()
        break
        default:
    }
  },


  /**
   * 打开城市、课程、时段动画
   */
  translate: function() {
    this.animation.translateY(-500).step();
    this.setData({
      animation: this.animation.export()
    })
  },

  /***
   * 关闭城市、课程、时段动画
   */
  closeAnimation: function() {
    let that = this
    that.animation.translateY(500).step();
    that.setData({
      animation: that.animation.export()
    })
    setTimeout(function() {
      that.close()
    }, 200)
  },

  /***
     * 关闭城市、课程、时段动画
     */
  closeJonitAnimation: function () {
    let that = this
    that.jointAnimation.translateY(500).step();
    that.setData({
      jonitAnimation: that.jonitAnimation.export()
    })
    setTimeout(function () {
      that.close()
    }, 200)
  },
  /**
   * 关闭城市、课程、时段
   */
  close: function() {
    this.setData({
      cover: false,
      type: 'screen'
    })
  },

  /***
   *选择筛选数据
   */
  choiceData: function(arr, index) {
    let obj = {
      arr: arr,
      index: index,
      number: 0

    }
    //选择其他课程
    for (let i in obj.arr) {
      if (i == obj.index && obj.arr[i].id != 0) {
        obj.arr[i].select = !obj.arr[i].select
      }
      if (obj.arr[i].id == 0) {
        obj.arr[i].select = false
      }
    }

    // 取消所以选择全部
    if (this.cancelAll(obj.arr)) {
      for (let item of obj.arr) {
        if (item.id == 0) {
          item.select = true
        } else {
          item.select = false
        }
      }
    }

    // 选择全部
    if (obj.arr[obj.index].id == 0) {
      for (let item of obj.arr) {
        if (item.id == 0) {
          item.select = true
        } else {
          item.select = false
        }
      }
    }
    // 已选数量
    for (let item of obj.arr) {
      if (item.select && item.id != 0) {
        obj.number++
      }
    }

    return obj

  },

  /**
   * 判断是取消所有
   */
  cancelAll: function(arr) {
    if (arr.length == 0) {
      return false
    }
    return arr.every(function(element) {
      if (element.select == false) {
        return true
      } else {
        return false
      }
    })
  },


  /***
   * 选择时间段
   */
  choiceTime: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      searchTimeIndex: index
    })
  },

  /**
   *清空，默认选中第一
   **/
  onEmptyDefault: function(arr) {
    for (let item of arr) {
      if (item.id == 0) {
        item.select = true
      } else {
        item.select = false
      }
    }
    return arr
  },

  /**
   * 筛选 全选，单选 课程 门店
   */
  screenArr: function(arr) {
    let ids = []
    let isAll = false
    // 显示选择门店课程
    for (let item of arr) {
      if (item.select && item.id != 0) {
        ids.push(item.id)
      }
      if (item.select && item.id == 0) {
        isAll = true
      }
    }

    // 显示全部门店课程
    if (isAll) {
      for (let item of arr) {
        item.id != 0 && ids.push(item.id)
      }
    }
    return ids
  },

  /**
   * 选择城市
   */
  choiceCity: function(e) {
    let index = e.currentTarget.dataset.index
    let areaList = this.data.areaList
    let region = [{
      id: 0,
      name: '全城'
    }]
    region = region.concat(areaList[index].children)
    let storeList = this.selectAllCity(areaList, index)
    this.setData({
      areaIndex: index,
      region: region,
      storeList: storeList,
      regionIndex: 0
    })
  },

  /**
   * 选择区域
   */
  choiceArea: function(e) {
    let index = e.currentTarget.dataset.index
    let region = this.data.region
    let areaList = this.data.areaList
    let areaIndex = this.data.areaIndex
    let storeList = []
    if (region[index].id == 0) {
      storeList = this.selectAllCity(areaList, areaIndex)
    } else {
      storeList = this.arrAddStatus(region[index].store)
    }
    this.setData({
      regionIndex: index,
      storeList: storeList
    })
  },

  /**
   * 选择门店
   */
  choiceStore: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let storeList = that.data.storeList
    let obj = that.choiceData(storeList, index)
    that.setData({
      storeList: obj.arr,
      storeNumber: obj.number
    })
  },

  /**
   * 选择科目目的
   */
  choiceTarget: function(e) {
    let index = e.currentTarget.dataset.index
    let courseTargetList = this.data.courseTargetList
    courseTargetList[index].select = !courseTargetList[index].select
    let target_ids = []
    for (let item of courseTargetList) {
      if (item.select) {
        target_ids.push(item.id)
      }
    }
    this.setData({
      target_ids: target_ids,
      courseTargetList: courseTargetList
    })
    this.getCourseTeamCourse()
  },

  /**
   * 选择科目类型
   */
  choiceCategory: function(e) {
    let index = e.currentTarget.dataset.index
    let courseCategoryList = this.data.courseCategoryList
    courseCategoryList[index].select = !courseCategoryList[index].select
    let category_ids = []
    for (let item of courseCategoryList) {
      if (item.select) {
        category_ids.push(item.id)
      }
    }
    this.setData({
      category_ids: category_ids,
      courseCategoryList: courseCategoryList
    })
    this.getCourseTeamCourse()
  },

  /**
   * 选择科目
   */
  choiceCourse: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let course = that.data.course
    let obj = that.choiceData(course, index)
    let temp = []
    for (let item of obj.arr) {
      if (item.select && item.id != 0) {
        temp.push(item.id)
      }
    }
    that.setData({
      course: obj.arr,
      course_ids: temp,
      courseNumber: obj.number
    })
  },

  /***
   *选择筛选数据
   */
  choiceData: function(arr, index) {
    let obj = {
      arr: arr,
      index: index,
      number: 0

    }
    //选择其他课程
    for (let i in obj.arr) {
      if (i == obj.index && obj.arr[i].id != 0) {
        obj.arr[i].select = !obj.arr[i].select
      }
      if (obj.arr[i].id == 0) {
        obj.arr[i].select = false
      }
    }

    // 取消所以选择全部
    if (this.cancelAll(obj.arr)) {
      for (let item of obj.arr) {
        if (item.id == 0) {
          item.select = true
        } else {
          item.select = false
        }
      }
    }

    // 选择全部
    if (obj.arr[obj.index].id == 0) {
      for (let item of obj.arr) {
        if (item.id == 0) {
          item.select = true
        } else {
          item.select = false
        }
      }
    }
    // 已选数量
    for (let item of obj.arr) {
      if (item.select && item.id != 0) {
        obj.number++
      }
    }
    return obj

  },

  /**
   * 门店数组加 true false
   */
  arrAddStatus: function(arr) {
    let storeList = [{
      id: 0,
      name: '全城',
      select: true
    }]
    for (let item of arr) {
      item.select = false
    }
    storeList = storeList.concat(arr)
    return storeList
  },

  /**
   * 选择全城
   */
  selectAllCity: function(arr, index) {
    let storeList = [{
      id: 0,
      name: '全城',
      select: true
    }]
    let temp = []
    for (let item of arr[index].children) {
      temp = temp.concat(item.store)
    }
    for (let item of temp) {
      item.select = false
    }
    storeList = storeList.concat(temp)
    return storeList
  },

  /**
   * 确认已选
   */
  confirmSelect: function(e) {
    let pageArr = this.data.pageArr
    for (let item of pageArr) {
      item.lastPage = false
    }
    this.setData({
      pageArr: pageArr,
      nowtime: Math.round(new Date().getTime() / 1000)
    })

    this.getCourseTeamListAll()
    this.closeAnimation()
  },

  /**
   * 清空
   */
  onEmpty: function(e) {
    let type = e.currentTarget.dataset.type
    let that = this
    let storeList = that.data.storeList
    let region = that.data.region
    let course = that.data.allCourse
    let courseTargetList = that.data.courseTargetList
    let courseCategoryList = that.data.courseCategoryList
    let searchTimeIndex = this.data.searchTimeIndex
    let storeNumber = this.data.storeNumber
    let regionIndex = this.data.regionIndex
    let courseNumber = this.data.courseNumber
    let course_ids = this.data.course_ids
    if (type == 'store') {
      storeNumber = 0
      regionIndex = 0
      storeList = that.onEmptyDefault(storeList)
      region = that.onEmptyDefault(region)
    }
    if (type == 'course') {
      courseNumber = 0
      course_ids = []
      course = that.onEmptyDefault(course)
      courseTargetList = that.onEmptyDefault(courseTargetList)
      courseCategoryList = that.onEmptyDefault(courseCategoryList)
    }
    if (type == 'time') {
      searchTimeIndex = 0
    }
    that.setData({
      storeList: storeList,
      course: course,
      region: region,
      courseTargetList: courseTargetList,
      courseCategoryList: courseCategoryList,
      regionIndex: regionIndex,
      searchTimeIndex: searchTimeIndex,
      storeNumber: storeNumber,
      courseNumber: courseNumber,
      course_ids: course_ids,
    })
  },

  /**
   *  获取门店区域列表
   */
  getStoreArea: function() {
    let that = this
    ajax.post(api.getStoreAreaList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        let region = [{
          id: 0,
          name: '全城'
        }]
        region = region.concat(list[0].children)
        let storeList = that.selectAllCity(list, 0)
        that.setData({
          areaList: list,
          region: region,
          storeList: storeList
        })
        that.getCourseCategoryList()
      }
    }, 'noauth')
  },

  /**
   * 获取目的 类型 科目
   */
  getCourseCategoryList: function() {
    let that = this
    ajax.post(api.getCourseCategoryList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let temp = [{
          id: 0,
          name: '全部',
          select: true
        }]
        that.setData({
          advList: data.obj.adv,
          courseTargetList: that.courseStatus(data.obj.target_result),
          courseCategoryList: that.courseStatus(data.obj.category_result),
          course: temp.concat(that.courseStatus(data.obj.course)),
          allCourse: temp.concat(that.courseStatus(data.obj.course)),
          searchTimeList: data.obj.search_time,
        })

        that.getCourseTeamListAll()
      }
    }, 'noauth')
  },

  /**
   * 获取筛选科目
   */
  getCourseTeamCourse: function() {
    let that = this
    let target_ids = that.data.target_ids
    let category_ids = that.data.category_ids
    ajax.post(api.getCourseTeamCourseList, {
      'target_ids': target_ids,
      'category_ids': category_ids
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        let temp = [{
          id: 0,
          name: '全部',
          select: true
        }]
        for (let item of list) {
          item.select = false
        }
        temp = temp.concat(list)
        that.setData({
          course: temp,
          courseNumber: 0
        })
      }
    }, 'noauth')
  },


  /**
   * 课目 数组加 true false
   */
  courseStatus: function(arr) {
    for (let item of arr) {
      item.select = false
    }
    return arr
  },

  /**
   * 获取全部团课
   */
  getCourseTeamListAll: function() {
    let that = this
    let is_hide = that.data.is_hide
    let weekList = that.data.weekList
    let weekIndex = that.data.weekIndex
    let store_ids = that.screenArr(that.data.storeList)
    let course_ids = that.data.course_ids
    let searchTimeList = that.data.searchTimeList
    let search_time = that.data.search_time
    let searchTimeIndex = that.data.searchTimeIndex
    if (searchTimeList.length > 0) {
      search_time = searchTimeList[searchTimeIndex]
    }
    ajax.post(api.getCourseTeamListAll, {
      'store_ids': store_ids,
      'course_ids': course_ids,
      'is_hide': is_hide,
      'time': weekList[weekIndex].time,
      'search_time': search_time,
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
          showLoad: false,
          showTab: false,
          nowtime: Math.round(new Date().getTime() / 1000)
        })
        app.showTab = false
        wx.showTabBar({})
      }
    }, 'noauth')
  },

  /**
   * 预约人数百分比（剩余）
   */
  countPercent: function(arr) {
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
    let is_hide = that.data.is_hide
    let weekList = that.data.weekList
    let weekIndex = that.data.weekIndex
    let limit = that.data.limit
    let pageArr = that.data.pageArr
    let courseList = that.data.courseList
    let store_ids = that.screenArr(that.data.storeList)
    let course_ids = that.data.course_ids
    let search_time = that.data.search_time
    let searchTimeList = that.data.searchTimeList
    let searchTimeIndex = that.data.searchTimeIndex
    if (searchTimeList.length > 0) {
      search_time = searchTimeList[searchTimeIndex]
    }
    if (pageArr[weekIndex].lastPage) {
      return
    }

    ajax.post(api.getCourseTeamList, {
      'page': pageArr[weekIndex].page,
      'limit': limit,
      'store_ids': store_ids,
      'course_ids': course_ids,
      'is_hide': is_hide,
      'time': weekList[weekIndex].time,
      'search_time': search_time,
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
    }, 'noauth')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    that.share = that.selectComponent("#share")
    that.share.showTips()
    return {
      title: 'MORANGE',
      path: '/pages/course/course',
      imageUrl: ''
    }
  },

  //私教

  /**
   *  获取门店列表
   */
  getStoreAreaList: function() {
    let that = this

    ajax.post(api.getStoreAreaList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        let region = [{
          id: 0,
          name: '全城'
        }]
        region = region.concat(list[0].children)
        let storeList = that.selectAllCity(list, 0)
        that.setData({
          areaList: list,
          region: region,
          priStoreList: storeList
        })
        that.getCoursePrivateList()
      }
    })
  },

  /**
   * 获取私教列表
   */
  getCoursePrivateList: function() {
    let that = this
    let store_ids = that.getScreenData(that.data.priStoreList)
    let course_ids = that.getScreenData(that.data.priCoverList)
    console.log('store_ids'+that.data.priStoreList,that.data.priCoverList)
    ajax.post(api.getCoursePrivateList, {
      'store_ids': store_ids,
      'course_ids': course_ids
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        list = that.countPercent(list)
        for (let item of list) {
          let arr = []
          let temp = []
          for (let val of item.price) {
            arr.push(val.price)
            if (val.first_price > 0) {
              temp.push(val.first_price)
            }
          }
          item.min_price = Math.min.apply('', arr)
          item.first_price = Math.min.apply('', temp)
        }
        that.setData({
          priList: list,
          first: data.obj.first,
          showLoad: false
        })
      }
    })
  },
  /**
   * 获取私教筛选条件
   */
  getScreenData: function(arr) {
    let that = this
    let isAll = false
    let arr_ids = []

    // 显示选择门店课程
    for (let item of arr) {
      if (item.select && item.id != 0) {
        arr_ids.push(item.id)
      }
      if (item.select && item.id == 0) {
        isAll = true
      }
    }
    console.log(arr_ids)
    // 显示全部门店课程
    if (isAll) {
      for (let item of arr) {
        item.id != 0 && arr_ids.push(item.id)
      }
    }
    return arr_ids
  },
  /**
   *  获取私教课科目列表
   */
  getCoursePrivateCourseList: function() {
    let that = this
    ajax.post(api.getCoursePrivateCourseList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        let temp = [{
          id: 0,
          name: '全部',
          select: true
        }]
        for (let item of list) {
          temp.push({
            id: item.id,
            name: item.name,
            select: false
          })
        }
        that.setData({
          priCoverList: temp,
        })
      }
    })
  },

  //训练营
  /**
   *  获取区域列表
   */
  getCampStoreAreaList: function() {
    let that = this
    ajax.post(api.getStoreAreaList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        that.setData({
          areaList: list
        })
        that.getCourseCamp('first')
      }
    })
  },
  /**
   *  获取训练营列表
   */
  getCourseCamp: function(type) {
    let that = this
    let areaList = that.data.areaList
    let areaIndex = that.data.areaIndex
    let area_ids = []
    let tags = that.data.tags
    for (let item of areaList[areaIndex].children) {
      area_ids.push(item.id)
    }

    ajax.post(api.getCourseCampList, {
      'area_ids': area_ids,
      'tags': tags
    }, ({
      data
    }) => {
      if (data.code == 200) {

        if (type == 'first') {
          let tags = data.obj.course_tags
          let temp = [{
            id: 0,
            name: '全部标签',
            select: true
          }]
          for (let index in tags) {
            temp.push({
              id: parseInt(index) + 1,
              name: tags[index],
              select: false
            })
            that.setData({
              campTagList: temp
            })
          }
        }

        that.setData({
          campList: data.obj.list,
          showLoad: false
        })
      }
    })
  },

  /*
  *拼课
  */
 /**
   * 初始化数据
   */
  getJointData: function() {
    let that = this
    ajax.post(api.getSpellCoachSelectNew, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let coach = data.obj.coach
        that.setData({
          jointStoreList: data.obj.store,
          coachList: coach
        })
      }
    }, 'auth', true)


  },

  // 选定教练
  choiceCoach: function(e) {
    let index = e.currentTarget.dataset.index
    let coachList = this.data.coachList
    this.setData({
      coachIndex: index,
      coach_id: coachList[index].user_id
    })
    this.getCourseOfCoach()
  },
  /***
   * 获取教练的课程
   */
  getCourseOfCoach: function (user_id) {
    let that = this
    let coach_id = that.data.coach_id
    ajax.post(api.getSpellCourseSelectNew, {
      'coach_id': coach_id > 0 ? coach_id : user_id
    }, ({
      data
    }) => {
        if (data.code == 200) {
          this.jointAnimation.translateY(-500).step();
          console.log(data.obj.course)
          that.setData({
            coachCourseList: data.obj.course,
            showLoad: false,
            jointAnimation: this.jointAnimation.export(),
            jointCover: true
          })
        }
      })

  },

})