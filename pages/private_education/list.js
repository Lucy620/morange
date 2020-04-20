// pages/private_education/list.js
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
    coverList: [],
    courseNumber: 0,
    areaIndex: 0,
    areaList: [],
    regionIndex: 0,
    region: [],
    storeList: [],
    advList: [],
    storeNumber: 0,
    cover: false, //遮罩
    type: '',
    list: [],
    isShare: false
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.animation = wx.createAnimation()
    this.getStoreAreaList()
    this.getCoursePrivateCourseList()
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


  /**
   * 选择课程
   */
  choiceCourse: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let coverList = that.data.coverList
    let obj = that.choiceData(coverList, index)
    that.setData({
      coverList: obj.arr,
      courseNumber: obj.number
    })
  },

  /**
   * 打开城市、课程
   */
  openAnimation: function(e) {
    this.setData({
      cover: true,
      type: e.currentTarget.dataset.type
    })
    this.translate()
  },

  /**
   * 打开城市、课程动画
   */
  translate: function() {
    this.animation.translateX(750).step();
    this.setData({
      animation: this.animation.export()
    })
  },

  /***
   * 关闭城市、课程动画
   */
  closeAnimation: function() {
    var that = this
    that.animation.translateX(-750).step();
    that.setData({
      animation: that.animation.export()
    })
    setTimeout(function() {
      that.close()
    }, 200)
  },

  /**
   * 关闭城市、课程
   */
  close: function() {
    this.setData({
      cover: false,
      type: 'screen'
    })
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
          coverList: temp,
          advList: data.obj.adv,
        })
      }
    })
  },

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
          storeList: storeList
        })
        that.getCoursePrivateList()
      }
    })
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
   * 获取筛选条件
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

    // 显示全部门店课程
    if (isAll) {
      for (let item of arr) {
        item.id != 0 && arr_ids.push(item.id)
      }
    }

    return arr_ids
  },

  /**
   * 获取私教列表
   */
  getCoursePrivateList: function() {
    let that = this
    let store_ids = that.getScreenData(that.data.storeList)
    let course_ids = that.getScreenData(that.data.coverList)
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
          list: list,
          first: data.obj.first,
          showLoad: false
        })
      }
    })
    that.closeAnimation()
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
   * 清空
   */
  onEmpty: function(e) {
    let type = e.currentTarget.dataset.type
    let that = this
    let storeList = that.data.storeList
    let coverList = that.data.coverList
    let region = that.data.region
    let storeNumber = this.data.storeNumber
    let regionIndex = this.data.regionIndex
    let courseNumber = this.data.courseNumber
    if (type == 'store') {
      storeNumber = 0
      regionIndex = 0
      storeList = that.onEmptyDefault(storeList)
      region = that.onEmptyDefault(region)
    }
    if (type == 'course') {
      courseNumber = 0
      coverList = that.onEmptyDefault(coverList)
    }
    that.setData({
      storeList: storeList,
      region: region,
      coverList: coverList,
      regionIndex: regionIndex,
      storeNumber: storeNumber,
      courseNumber: courseNumber,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

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
      title: '私教',
      path: '/pages/private_education/list',
      imageUrl: ''
    }
  }
})