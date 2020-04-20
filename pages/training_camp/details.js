// pages/training_camp/details.js
const app = getApp()
import {
  config,
  api,
  ajax,
  util,
  wxPromise
} from '../../utils/myapp.js'
const WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoad: true, // 加载显示
    imgUrls: [],
    cityList: [],
    cityLindex: 0,
    dataId: 1,
    course_id: 0,
    area_id: 0,
    isShare: false,
    reserve: '',
    scroll: false,
    show_type: '',
    videoUrl: '',
    place: {
      posterHeight: 0,
      camphHeight: 0,
      courseHeight: 0,
    }
  },

  /**
   * 预览图片
   */
  previewImage: function(e) {
    let url = e.currentTarget.dataset.url
    let imglist = this.data.list.slide_imgs
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },


  /**
   * 确认订单
   */
  confirmOrder: function(e) {
    let list = this.data.list
    let order_type = e.currentTarget.dataset.order_type
    let id = e.currentTarget.dataset.id
    let amount = 1
    let cart = {
      id: id,
      type: list.type,
      amount: amount,
      order_type: order_type
    }
    app.shoppingList = cart
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order?type=' + order_type
    })
  },



  /**
   *选择城市
   */
  bindPickerChange: function(e) {
    let that = this
    let cityLindex = e.detail.value
    that.setData({
      cityLindex: e.detail.value
    })
    let course_id = that.data.course_id
    let area_id = that.data.area_id
    let cityList = that.data.cityList
    let area_ids = []
    for (let item of cityList[cityLindex].children) {
      area_ids.push(item.id)
    }
    ajax.post(api.getCourseCampList, {
      'area_ids': area_ids,
      'course_id': course_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let arr = data.obj.list[0].camp
        let camp = []
        if (arr.length > 0) {
          camp = arr
        }
        that.setData({
          'list.camp': camp
        })
      }
    })
  },

  onPageScroll: function(e) {
    let that = this
    //tab的吸顶效果
    if (e.scrollTop <= 0) {
      return
    }
    let tabTop = that.data.place.posterHeight
    let camphHeight = that.data.place.posterHeight + that.data.place.camphHeight
    if (!that.data.scroll && e.scrollTop > tabTop) {
      that.setData({
        scroll: true
      })
    }
    if (that.data.scroll && e.scrollTop < tabTop) {
      that.setData({
        scroll: false,
        dataId: 1
      })
    }
    if (that.data.dataId == 1 && e.scrollTop > camphHeight) {
      that.setData({
        dataId: 2
      })
    }
    if (that.data.dataId == 2 && e.scrollTop < camphHeight) {
      that.setData({
        dataId: 1
      })
    }

  },


  /**
   * tab 选择 滚动条位置
   */
  switchTab: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let place = that.data.place
    let courseHeight = that.data.place.posterHeight + that.data.place.camphHeight
    if (id == 1) {
      wx.pageScrollTo({
        scrollTop: place.posterHeight,
        duration: 300
      })
    }
    if (id == 2) {
      wx.pageScrollTo({
        scrollTop: courseHeight + 50,
        duration: 300
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      course_id: options.course_id || 0,
      area_id: options.area_id || 0,
    })
    let that = this
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
   * 点击a标签跳转链接
   */
  wxParseTagATap: function(e) {
    var url = e.currentTarget.dataset.src
    console.log(url)
    wx.navigateTo({
      url: '/' + url
    })
  },

  /**
   *  获取区域列表
   */
  getStoreAreaList: function() {
    let that = this
    let area_id = that.data.area_id
    ajax.post(api.getStoreAreaList, {}, ({
      data
    }) => {
      if (data.code == 200) {
        let list = data.obj.list
        let index = -1
        if (area_id > 0) {
          for (let i in list) {
            if (area_id == list[i].id) {
              index = i
            }
          }
        }

        that.setData({
          cityList: list,
          cityLindex: index
        })
        that.getData()
      }
    })
  },

  /**
   * 初始化数据
   * 
   */
  getData: function() {
    let that = this
    let course_id = that.data.course_id
    ajax.post(api.getCourseCampDetail, {
      'course_id': course_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let obj = data.obj.result
        wx.setNavigationBarTitle({
          title: obj.name
        })
        WxParse.wxParse('introduce', 'html', obj.introduce, that, 5)
        WxParse.wxParse('note', 'html', obj.note, that, 5)
        WxParse.wxParse('step', 'html', obj.step, that, 5)
        that.setData({
          list: obj,
          show_type: obj.show_type,
          videoUrl: obj.video,
          reserve: data.obj.reserve,
          showLoad: false
        })
        //获取tab的距离顶部高度
        setTimeout(function() {
          const query = wx.createSelectorQuery()
          query.select('#posterHeight').boundingClientRect(function(res) {
            that.data.place.posterHeight = res.height
          }).exec()
          query.select('#camphHeight').boundingClientRect(function(res) {
            that.data.place.camphHeight = res.height
          }).exec()
        }, 1)
      }
    })
  },

  /**
   * 新的一期提醒
   */
  reserveCourse: function() {
    let that = this
    let course_id = that.data.course_id
    let reserve = that.data.reserve
    let status = true
    if (reserve) {
      status = false
    }
    ajax.post(api.reserveCourse, {
      'course_id': course_id,
      'status': status
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          reserve: status
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
    this.getStoreAreaList()
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
      title: that.data.list.name,
      path: '/pages/training_camp/details?course_id=' + that.data.course_id + '&area_id=' + that.data.area_id,
      imageUrl: ''
    }
  }
})