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
    type: '',
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
    isClassEnd: false,
    openType: false,
    upTips:false,
    videoUrl:'',
    showVideo:false,
    lastPage: false, // 是否最后一页
    page: 1,
    limit: 10,
    list:[]
  },

  /**
   * 不接单
   */
  onReceipt: function () {
    this.setData({
      isReceipt: true,
      show: true
    })
  },

  /**
   *输入框值
   */
  binKeyVlaue: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 再想想
   */
  close: function () {
    this.setData({
      isReceipt: false,
      isClassEnd: false,
      show: false
    })
  },

  /**
   * 关闭扫码
   */
  closeTips: function () {
    this.setData({
      isCode: false,
      show: false
    })
  },

  /**
   * 确认结课
   */
  onClassEnd: function () {
    this.setData({
      show: true,
      isClassEnd: true
    })
  },

  /**
   * 训练营扫码签到
   */
  openCode: function (e) {
    let campData = e.currentTarget.dataset.date
    let qrcode = e.currentTarget.dataset.qrcode
    let end_at = e.currentTarget.dataset.end_at
    this.setData({
      isCode: true,
      show: true,
      campData: campData,
      qrcode: qrcode,
      end_at: end_at,
    })
  },

  /**
   * 查看学员
   */
  seeStudent: function () {
    this.setData({
      openStudent: true,
      show: true
    })
  },

  /**
   * 关闭查看
   */
  closeSee: function () {
    this.setData({
      show: false,
      openStudent: false
    })
  },


  /**
   * 查看位置
   */
  seeMap: function (e) {
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
  jumpPage: function (e) {
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
   * 选择上传类型
   */
  optUpType: function () {
    let that = this
    that.setData({
      openType: true
    })

    that.animation.translateY(-150).step()
    setTimeout(function () {
      that.setData({
        animation: that.animation.export()
      })
    }, 200)
  },

  /**
   * 关闭上传
   */
  closeOptType: function () {
    let that = this
    that.animation.translateY(150).step()
    that.setData({
      animation: that.animation.export()
    })
    setTimeout(function () {
      that.setData({
        openType: false
      })
    }, 200)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.animation = wx.createAnimation()
    that.setData({
      id: options.id || '',
      type: options.type || ''
    })
    if (options.type == 'income') {
      that.getCoachIncomeDetail()
    } else {
      that.getData()
      that.getCourseCommentList()
    }
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
   * 获取评论信息
   */
  binKeyVaule:function(e) {
    this.setData({
      content: e.detail.value
    })
  },


  /**
   * 
   * @param {获取留言板} e 
   */
  getCourseCommentList:function() {
    let that = this
    let lastPage = that.data.lastPage
    let page = that.data.page
    let limit = that.data.limit
    let list = that.data.list
    let course_children_id = that.data.id
    let table_relation = that.data.type
    if (lastPage) {
      return
    }
    ajax.post(api.getCourseCommentList, {
      'table_relation':table_relation,
      'course_children_id':course_children_id,
      'limit':limit,
      'page':page
    }, ({
      data
    }) => {
      if (data.code == 200) {
        page++
        var arr = data.obj.list
        list = list.concat(arr)
        that.setData({
          lastPage: (arr.length < limit) ? true : false,
          list: list,
          page: page
        })
      }
    },'auth',true)
  },

  /**
   * 
   * @param {发送留言} e 
   */
  sendComment:function() {
    let that = this
    let content = that.data.content
    let course_children_id = that.data.id
    let table_relation = that.data.type
    let list = that.data.list
    if (util.isEmpty(content)) {
      wx.showToast({
        title: '请输入评论内容',
        icon:'none'
      })
      return
    }
    ajax.post(api.createCourseComment, {
      'table_relation':table_relation,
      'course_children_id':course_children_id,
      'coach_id':that.data.course.coach_id,
      'type':'coach',
      'content':content
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
        list:[data.obj.comment,...list]
      })
        wx.showToast({
          title: '发送成功',
          icon:'none'
        })
      }else {
        wx.showToast({
          title: data.msg,
          icon:'none'
        })
      }
    })
  },

  /**
   * 查看课程
   */
  seeCourse: function (e) {
    let id = e.currentTarget.dataset.id
    let area_id = e.currentTarget.dataset.area_id
    let type = e.currentTarget.dataset.type
    let course = this.data.course
    if (type == 'team') {
      wx.navigateTo({
        url: '/pages/league/details?team_id=' + id
      })
    }
    if (type == 'private') {
      wx.navigateTo({
        url: '/pages/private_education/course?private_id=' + id
      })
    }
    if (type == 'camp') {
      wx.navigateTo({
        url: '/pages/training_camp/details?course_id=' + course.camp.course_id + '&area_id=' + area_id
      })
    }
  },


  /**
   * 初始化数据
   */
  getData: function () {
    let that = this
    let id = that.data.id
    let type = that.data.type
    ajax.post(api.getQrcodeSignDetail, {
      'id': id,
      'type': type
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let user = data.obj.user_course
        let number = 0
        for (let item of user) {
          number += parseInt(item.order.course_num)
        }
        that.setData({
          course: data.obj.result,
          images: data.obj.result.course_photo ? data.obj.result.course_photo : [],
          number: number,
          user: user,
          new_coach: data.obj.new_coach,
          new_course: data.obj.new_course,
          new_molic: data.obj.new_molic,
          showLoad: false
        })
      }
    })
  },

  /***
   * 教练拼课处理
   */
  receipt: function (e) {
    let that = this
    let id = that.data.id
    let remark = that.data.remark
    let temp = e.currentTarget.dataset.status
    let status = false
    if (temp == 'false') {
      if (util.isEmpty(remark)) {
        wx.showToast({
          title: '请输入理由',
          icon: 'none',
        })
        return
      }
    } else {
      status = true
    }
    ajax.post(api.coachSpellCourse, {
      'team_id': id,
      'status': status,
      'remark': remark,
    }, ({
      data
    }) => {
      if (data.code == 200) {
        that.setData({
          'course.spell_status': status ? 1 : 2,
          'course.is_enable': 1,
          isReceipt: false,
          show: false
        })
      }
    })

  },

  /**
   * 获取收入明细
   */
  getCoachIncomeDetail: function () {
    let that = this
    let id = that.data.id
    ajax.post(api.getCoachIncomeDetail, {
      'coach_income_id': id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let income_result = data.obj.income_result
        let total_income = parseFloat(income_result.base_income) + parseFloat(income_result.extra_income) + parseFloat(income_result.people_income)
        that.setData({
          course: data.obj.result,
          user: data.obj.user_course,
          income_result: data.obj.income_result,
          total_income: total_income,
          showLoad: false
        })
      }
    })
  },

  /**
   *打开视频全屏
   */
  openVideo:function(e) {
    let videoUrl = e.currentTarget.dataset.url
    this.setData({
      videoUrl:videoUrl,
      showVideo:true
    },()=>{
      let videoContext = wx.createVideoContext('myvideo', this)
      videoContext.requestFullScreen({
        direction: 90
      })
    })
  },

  /**
   * 退出视频 
   */
  bindfullscreenchange:function(e) {
    let direction = e.detail.direction
    let fullScreen = e.detail.fullScreen
    if (direction=='vertical' && !fullScreen) {
      this.setData({
        videoUrl:'',
        showVideo:false
      })
    }
    
  },


  /**
   * 选择视频上传
   */
  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album'],
      compressed: true,
      success: function (res) {
        let filePath = res.tempFilePath
        that.qiniuUp(filePath, 'video')
      },
      fail: function () {
        that.setData({
          openType: false
        })
      }
    })
  },

  /**
   * 预览图片
   */
  previewImage: function (e) {
    var url = e.currentTarget.dataset.url
    var imglist = e.currentTarget.dataset.imglist
    let arr = []
    for (let item of imglist) {
      if (item.type == 'img') {
        arr.push(item.url)
      }
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },

  /***
   * 上传图片
   */
  selectImg() {
    let that = this
    // 选择图片
    wx.chooseImage({
      sourceType: ['album'],
      count: 9,
      success: function (res) {
        let filePath = res.tempFilePaths[0]
        that.qiniuUp(filePath, 'img')
      },
      fail: function () {
        that.setData({
          openType: false
        })
      },
    })
  },

  /**
   * 交给七牛上传
   */
  qiniuUp: function (filePath, type) {
    let that = this
    that.animation.translateY(150).step()
    that.setData({
      animation: that.animation.export(),
      upTips: true,
      openType: false,
    })
    qiniuUploader.upload(filePath, (res) => {
      let error = res.error
      let imageURL = res.imageURL
      if (error || imageURL == "https://boringcdn.nanningboring.com/undefined") {
        let tips = type == 'img' ? '上传图片失败，请重新上传' : '上传视频失败，请重新上传'
        wx.showToast({
          title: tips,
          icon: 'none',
        })
      } else {
        let images = that.data.images
        images.push({
          type: type,
          url: imageURL
        })
        that.setData({
          images: images,
          upTips: false
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
  },

  /**
   * 保存图片
   */
  onSave: function () {
    let that = this
    let id = that.data.id
    let type = that.data.type
    let course_photo = that.data.images
    if (course_photo.length == 0) {
      wx.showToast({
        title: '请上传图片或视频',
        icon: 'none',
      })
      return
    }
    ajax.post(api.uploadCoursePhoto, {
      'id': id,
      'type': type,
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
   * 结课
   */
  coachClassEnd: function () {
    let that = this
    let id = that.data.id
    let type = that.data.type
    let course = that.data.course
    ajax.post(api.coachClassEnd, {
      'id': id,
      'type': type,
    }, ({
      data
    }) => {
      if (data.code == 200) {
        wx.showToast({
          title: '结算成功',
          icon: 'none'
        })
        that.setData({
          isClassEnd: false,
          show: false
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
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


})