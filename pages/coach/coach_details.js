// pages/coach/coach_details.js

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
    cover: false,
    star: 4,
    storyHeight: '90',
    weekList: [],
    weekIndex: 0,
    weekText: {
      '0': '今天',
      '1': '明天',
      '2': '后天',
      '3': '周',
      '4': '周',
      '5': '周',
    },
    dataId: 1,
    coach_id: 0,
    coach: '',
    list: [],
    showLoad: true,
    nowtime: '',
    user_course: '',
    menuFix: false,
    weekFix: false,
    place: {
      posterHeight: 0,
      tabHeight: 0,
      coachHeight: 0,
      courseHeight: 0,
      evaluateHeight: 0,
    },
    clientWidth: 0, // 屏幕宽、高
    clientHeight: 0, // 屏幕宽、高
    show_type: '',
    videoUrl: '',
    commentList: [],
    lastPage: false, // 是否最后一页
    page: 1,
    limit: 10,
    openFollow: false,
    is_attention: false,
    screenWidth: app.globalData.screenWidth,
    sliceImage: {},
    sliceHeight: 0
  },

  /**
   * 
   * @param {打开 关闭 提示窗} e 
   */
  openTips: function () {
    this.setData({
      openFollow: !this.data.openFollow
    })
  },

  /**
   * 
   * @param {关注 取消教练} e 
   * 
   */
  attention: function () {
    let that = this
    let type = that.data.is_attention ? 'no' : 'yes'
    ajax.post(api.attentionCoach, {
      'type': type,
      'coach_id': that.data.coach_id
    }, ({
      data
    }) => {
      if (data.code == 200) {
        wx.showToast({
          title: data.msg,
          icon:'none'
        })
        that.setData({
          is_attention: type == 'yes' ? true : false,
          openFollow:false
        })
      }
    }, 'auth', true)
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
   * 预览图片
   */
  previewImage: function (e) {
    let url = e.currentTarget.dataset.url
    let imglist = this.data.coach.slide_imgs
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
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

  /***
   * 打开故事
   */
  openStory: function () {
    this.setData({
      storyHeight: 'auto',
    })
  },


  /***
   * 选择时间
   */
  selectDate: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      weekIndex: index
    })
  },

  /***
   * 滑动选择
   */
  binSwiper: function (e) {
    this.setData({
      weekIndex: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.animation = wx.createAnimation()
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
      coach_id: options.coach_id || '',
      weekList: weekList,
      nowtime: Math.round(new Date().getTime() / 1000)
    })
    this.getData()
  },

  /**
   * 获取当前星期
   */
  getWeek: function (date) {
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
   * 加载图片
   */
  slideLode: function (e) {
    
    let width=e.detail.width,    //获取图片真实宽度
         height=e.detail.height,
         ratio=width/height;    //图片的真实宽高比例
         let viewWidth=this.data.screenWidth,           //设置图片显示宽度，左右留有16rpx边距
         viewHeight=this.data.screenWidth/ratio;    //计算的高度值
         let image=this.data.sliceImage; 
        image={
          width:viewWidth,
          height:viewHeight
        }
      this.setData({
        sliceImage:image,
        sliceHeight: viewHeight
      })
  },

  /**
   * 初始化数据
   */
  getData: function () {
    let that = this
    let coach_id = that.data.coach_id
    ajax.post(api.getCoachDetail, {
      'coach_id': coach_id
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
        wx.setNavigationBarTitle({
          title: data.obj.coach.name
        })
        that.setData({
          show_type: data.obj.coach.show_type,
          videoUrl: data.obj.coach.video,
          coach: data.obj.coach,
          list: list,
          user_course: data.obj.user_course,
          is_attention: data.obj.is_attention,
          showLoad: false
        }, () => {
          that.getCoachCourseCommentList()
        })

        //获取tab的距离顶部高度
        // setTimeout(function () {
        //   const query = wx.createSelectorQuery()
        //   query.select('#posterHeight').boundingClientRect(function (res) {
        //     that.data.place.posterHeight = res.height
        //   })
        //   query.select('#tabHeight').boundingClientRect(function (res) {
        //     that.data.place.tabHeight = res.height
        //   })
        //   query.select('#coachHeight').boundingClientRect(function (res) {
        //     that.data.place.coachHeight = res.height
        //   })
        //   query.select('#courseHeight').boundingClientRect(function (res) {
        //     that.data.place.courseHeight = res.height
        //   })
        //   query.select('#evaluateHeight').boundingClientRect(function (res) {
        //     that.data.place.evaluateHeight = res.height
        //   })
        //   query.exec()
        // }, 10)
      }
    })
  },

  /**
   * 
   * @param {获取评价列表} arr 
   */
  getCoachCourseCommentList: function () {
    let that = this
    let lastPage = that.data.lastPage
    let page = that.data.page
    let limit = that.data.limit
    let commentList = that.data.commentList
    let coach_id = that.data.coach_id
    if (lastPage) {
      return
    }
    ajax.post(api.getCoachCourseCommentList, {
      'coach_id': coach_id,
      'limit': limit,
      'page': page
    }, ({
      data
    }) => {
      if (data.code == 200) {
        page++
        var arr = data.obj.list
        commentList = commentList.concat(arr)
        that.setData({
          lastPage: (arr.length < limit) ? true : false,
          commentList: commentList,
          page: page
        })
      }
    }, 'auth', true)
  },

  /**
   * 预约人数百分比（剩余）
   */
  countPercent: function (arr) {
    for (let item of arr) {
      let num = parseInt(item.total_stock) - parseInt(item.rest_stock)
      item.percent = ((parseInt(item.total_stock) - num) / parseInt(item.total_stock)) * 100
    }
    return arr
  },

  /**
   * tab 选择
   */
  switchTab: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let place = that.data.place
    if (id == 1) {
      wx.pageScrollTo({
        scrollTop: place.posterHeight,
        duration: 300
      })
    }

    if (id == 2) {
      wx.pageScrollTo({
        scrollTop: place.posterHeight + place.coachHeight + 15,
        duration: 300
      })
    }
    if (id == 3) {
      let courseTop = place.posterHeight + place.coachHeight + place.courseHeight + place.tabHeight + 30
      wx.pageScrollTo({
        scrollTop: courseTop,
        duration: 300
      })
    }
    if (id == 4) {
      let courseTop = place.posterHeight + place.coachHeight + place.courseHeight + place.tabHeight + place.evaluateHeight
      wx.pageScrollTo({
        scrollTop: courseTop,
        duration: 300
      })
    }
  },

  /**
   * 页面滚动事件
   */
  onPageScroll: function (e) {
    let that = this
    if (e.scrollTop <= 0) {
      return
    }
    let tabTop = that.data.place.posterHeight
    let rankTop = that.data.place.posterHeight + that.data.place.coachHeight
    let courseTop = that.data.place.posterHeight + that.data.place.coachHeight + that.data.place.courseHeight + that.data.place.tabHeight
    let evaluateTop = that.data.place.posterHeight + that.data.place.coachHeight + that.data.place.courseHeight + that.data.place.evaluateHeight
    //tab的吸顶效果
    if (!that.data.menuFix && e.scrollTop > tabTop) {
      that.setData({
        menuFix: true
      })
    }
    if (that.data.menuFix && e.scrollTop < tabTop) {
      that.setData({
        menuFix: false,
        dataId: 1
      })
    }
    if (that.data.dataId == 1 && e.scrollTop > rankTop) {
      that.setData({
        dataId: 2
      })
    }
    if (that.data.dataId == 2 && e.scrollTop < rankTop) {
      that.setData({
        dataId: 1
      })
    }
    if (that.data.dataId == 2 && e.scrollTop > courseTop) {
      that.setData({
        weekFix: true,
        dataId: 3
      })
    }
    if (that.data.weekFix && e.scrollTop < courseTop) {
      that.setData({
        weekFix: false,
        dataId: 2
      })
    }
    if (that.data.weekFix && e.scrollTop > evaluateTop) {
      that.setData({
        weekFix: false,
        dataId: 4
      })
    }
    if (that.data.dataId == 4 && e.scrollTop < evaluateTop) {
      that.setData({
        weekFix: true,
        dataId: 3
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let clientHeight = 0
    let clientWidth = 0
    let ratio = 0
    wx.getSystemInfo({
      success: function (res) {
        clientHeight = res.windowHeight
        clientWidth = res.windowWidth
        ratio = 750 / clientWidth
      }
    })
    this.setData({
      clientWidth: clientWidth * ratio,
      clientHeight: clientHeight * ratio
    })
  },

  /**
   * 打开评论动画
   */
  onShowComment: function () {
    this.animation.translateY(-500).step();
    this.setData({
      cover: true,
      animation: this.animation.export()
    })
  },

  /***
   * 关闭评论动画
   */
  onHideComment: function () {
    let that = this
    that.animation.translateY(500).step();
    that.setData({
      animation: that.animation.export()
    })
    setTimeout(function () {
      that.setData({cover: false})
    }, 200)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
    this.getCoachCourseCommentList()
  },


})