// pages/coach/member_sign.js
const app = getApp()
import {
  config,
  api,
  ajax,
  util,
  wxPromise
} from '../../utils/myapp.js'
const qiniuUploader = require('../../utils/qiniuUploader.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoad: true,
    id: 0,
    ordersn: '',
    course: '',
    user: '',
    openStudent: false,
    uptoken: '',
    images: [],
    new_coach: 0,
    new_course: 0,
    new_molic: 0,
    show: false,
    isReceipt: false,
    isCode: false,
    campData: '',
    qrcode: '',
    end_at: '',
    isClassEnd: false
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      id: options.id || '',
      ordersn: options.ordersn || ''
    })
    that.getData()
    ajax.post(api.getQiNiuToken, {}, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          uptoken: data.obj.token
        })
      }
    })
  },


  /**
   * 查看课程
   */
  seeCourse: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/private_education/course?private_id=' + id
    })
  },


  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    let id = that.data.id
    let ordersn = that.data.ordersn
    ajax.post(api.getQrcodeSignPrivateDetail, {
      'id': id,
      'ordersn': ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          course: data.obj.result,
          images: data.obj.result.course_photo ? data.obj.result.course_photo : [],
          user: data.obj.user,
          showLoad: false
        })
      }
    })
  },


  /**
   * 预览图片
   */
  previewImage: function(e) {
    var url = e.currentTarget.dataset.url
    var imglist = e.currentTarget.dataset.imglist
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },

  /***
   * 上传图片
   */
  selectImg() {
    let that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: function(res) {
        let filePath = res.tempFilePaths[0];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          console.log(filePath, res)
          let error = res.error
          let imageURL = res.imageURL
          if (error || imageURL == "https://boringcdn.nanningboring.com/undefined") {
            wx.showToast({
              title: '上传图片失败，请重新上传',
              icon: 'none',
            })
          } else {
            let images = that.data.images
            images.push(res.imageURL)
            that.setData({
              images: images
            })
          }


        }, (error) => {
          console.log('error: ' + error)
        }, {
          region: 'UPZ0',
          domain: 'https://boringcdn.nanningboring.com',
          shouldUseQiniuFileName: true,
          uptoken: that.data.uptoken,
        }, (res) => {
          console.log('上传进度成功')
        });
      }
    })
  },

  /**
   * 保存图片
   */
  onSave: function() {
    let that = this
    let id = that.data.id
    let ordersn = that.data.ordersn
    let course_photo = that.data.images
    if (course_photo.length == 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none',
      })
      return
    }
    ajax.post(api.uploadCoursePhoto, {
      'id': id,
      'ordersn': ordersn,
      'course_photo': course_photo
    }, ({
      data
    }) => {
      if (data.code == 200) {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
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


})