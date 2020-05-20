// pages/sign/sign_success.js
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
    star:0,
    order: '',
    ordersn: '',
    isGive: false,
    isShare: false,
    showLoad: true,
    showWeChat: false,   
    lastPage: false, // 是否最后一页
    page: 1,
    limit: 10,
    list:[],
    statusBarHeight: app.globalData.statusBarHeight,
    ios: app.globalData.ios,
    scroll: false
  },

  /**
   * 选择星级
   */
  optStar:function(e){
    this.setData({
      star:e.currentTarget.dataset.star
    })
  },

  /**
   * 邀请好友
   */
  onGive: function() {
    this.setData({
      isGive: true
    })
  },

  /**
   * 取消邀请
   */
  closeGuve: function(e) {
    this.setData({
      isGive: e.detail.isGive
    })
  },

  /**
   * 加好友
   */
  addFriends: function() {
    this.setData({
      showWeChat: true
    })
  },

  /**
   * 复制
   */
  copy: function(e) {
    var that = this
    wx.setClipboardData({
      data: e.currentTarget.dataset.weixin,
      success: function(res) {
        wx.showToast({
          title: '微信号复制成功',
          icon: 'none'
        })
      }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ordersn: options.ordersn || '',
    })
  },

  /**
   * 初始化数据
   */
  getData: function() {
    let that = this
    let ordersn = that.data.ordersn
    ajax.post(api.userRefundOrderDetail, {
      'ordersn': ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        let order = data.obj.result
        let nowtime = Math.round(new Date().getTime() / 1000)
        that.setData({
          order: order,
          user: data.obj.user,
          nowtime: nowtime,
          showLoad: false
        },()=>{
          that.getCourseCommentList()
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
    let order = that.data.order
    if (lastPage) {
      return
    }
    ajax.post(api.getCourseCommentList, {
      'table_relation':order.table_relation,
      'course_children_id':order.course_children_id,
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
    let order = that.data.order
    let list = that.data.list
    if (that.data.star == 0) {
      wx.showToast({
        title: '请选择星级',
        icon:'none'
      })
      return
    }
    if (util.isEmpty(content)) {
      wx.showToast({
        title: '请输入评论内容',
        icon:'none'
      })
      return
    }
    ajax.post(api.createCourseComment, {
      'table_relation':order.table_relation,
      'course_children_id':order.course_children_id,
      'star':that.data.star,
      'coach_id':order.user_course[0].coach_id,
      'type':'user',
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
   * 取消订单
   */
  applyRefund: function() {
    let that = this
    let ordersn = that.data.ordersn
    ajax.post(api.refundOrder, {
      'ordersn': ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        wx.showToast({
          title: '取消成功',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 1,
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
      that.setData({
        show: false
      })
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

  },

  /**
   * 页面滚动事件的处理函数
   */
  onPageScroll: function(e) {
    if (e.scrollTop >= this.data.statusBarHeight && !this.data.scroll) {
      this.setData({scroll: true})
    }else if(e.scrollTop <= this.data.statusBarHeight && this.data.scroll){
      this.setData({scroll: false})
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let that = this
    if (res.from == 'button') {
      let type = res.target.dataset.type
      if (type == 'invite') {
        let course_id = that.data.order.data.id
        that.give = that.selectComponent("#give")
        that.give.closeGuve()
        that.share = that.selectComponent("#share")
        that.share.showTips()
        return {
          title: 'MORANGE',
          path: '/pages/league/details?team_id=' + course_id,
          imageUrl: ''
        }
      }
      if (type == 'give') {
        let ordersn = this.data.ordersn
        let user_name = this.data.user.miniprogram.nickname
        return {
          title: user_name + '赠送您一节课',
          path: '/pages/give/give?ordersn=' + ordersn + '&user_name=' + user_name,
          imageUrl: ''
        }
      }
    }
  }
})