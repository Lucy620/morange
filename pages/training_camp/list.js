// pages/training_camp/list.js
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
    showLoad: true, // 加载显示
    areaIndex: 0,
    areaList: [],
    tagIndex: 0,
    tagList: [],
    list: [],
    cover: false, //遮罩
    type: '',
    tagNumber: 0,
    tags: [],
    isShare: false
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
   * 打开城市、标签
   */
  openAnimation: function(e) {
    this.setData({
      cover: true,
      type: e.currentTarget.dataset.type
    })
    this.translate()
  },

  /**
   * 打开城市、标签动画
   */
  translate: function() {
    this.animation.translateX(750).step();
    this.setData({
      animation: this.animation.export()
    })
  },

  /***
   * 关闭城市、标签动画
   */
  closeAnimation: function() {
    let that = this
    that.animation.translateX(-750).step();
    that.setData({
      animation: that.animation.export()
    })
    setTimeout(function() {
      that.close()
    }, 200)
  },

  /**
   * 关闭城市、标签
   */
  close: function() {
    this.setData({
      cover: false,
      type: 'area'
    })
  },

  /**
   * 选择城市
   */
  choiceCity: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      areaIndex: index
    })
    this.getCourseCamp()
  },


  /**
   * 选择标签
   */
  choiceTag: function(e) {
    let index = e.currentTarget.dataset.index
    let tagList = this.data.tagList
    let tagNumber = 0

    //选择其他标签
    for (let i in tagList) {
      if (i == index && tagList[i].id != 0) {
        tagList[i].select = !tagList[i].select
      }
      if (tagList[i].id == 0) {
        tagList[i].select = false
      }
    }

    // 取消所有选择全部标签
    if (this.cancelAll(tagList)) {
      for (let item of tagList) {
        if (item.id == 0) {
          item.select = true
        } else {
          item.select = false
        }
      }
    }

    // 选择全部标签
    if (tagList[index].id == 0) {
      for (let item of tagList) {
        if (item.id == 0) {
          item.select = true
        } else {
          item.select = false
        }
      }
    }

    // 已选数量
    for (let item of tagList) {
      if (item.select && item.id != 0) {
        tagNumber++
      }
    }

    this.setData({
      tagList: tagList,
      tagNumber: tagNumber
    })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.animation = wx.createAnimation()
  },

  /**
   *  获取区域列表
   */
  getStoreAreaList: function() {
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
   * 确认选择
   */
  confirmSelect: function() {
    let that = this
    that.closeAnimation()
    let tagList = that.data.tagList
    var temp = []
    for (let item of tagList) {
      if (item.id != 0 && item.select) {
        temp.push(item.name)
      }
    }
    that.setData({
      tags: temp
    })
    that.getCourseCamp()
  },

  /**
   * 清空选择
   */
  onEmpty: function() {
    let that = this
    let tagList = that.data.tagList
    for (let item of tagList) {
      if (item.id == 0) {
        item.select = true
      } else {
        item.select = false
      }
    }
    that.setData({
      tagList: tagList
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
              tagList: temp
            })
          }
        }

        that.setData({
          list: data.obj.list,
          showLoad: false
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
      title: '训练营',
      path: '/pages/training_camp/list',
      imageUrl: ''
    }
  }
})