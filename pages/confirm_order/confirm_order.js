// pages/private_education/confirm_order.js
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
    title: "dd",
    tip: {
      title: '提示',
      content: '',
      confirmFun: () => {},
      cancelFun: () => {}
    },
    ordersn: '',
    showModalTips: false,
    showLoad: true,
    discount: 0,
    cart: '', // 购物清单
    type: 'buy', // 按钮类型
    courseDate: '', // 确认订单json
    course: '', //课程
    user: '', // 用户
    dataId: 1, // 团课选择
    activity: '', // 活动
    coupon_list: '', // 团课可用优惠券
    couponAll: '', // 所以优惠券
    user_coupon_id: 0, // 优惠券ID
    reduce_cost: 0, // 优惠金额
    coupon_type: 'normal', // 优惠券类型
    number: 0, // 选择的数量
    priceIndex: 0, // 价格私教课时index
    pay_price: 0, // 应付金额
    queue_order: 0, // /订单人数
    showTips: false, // 提示遮罩
    discount_price: 0, // 魔橙卡优惠价
    teamNumber: [{
        id: 1,
        status: true
      },
      {
        id: 2,
        status: true
      },
      {
        id: 3,
        status: true
      }
    ], // 团课选择人数
    spellNumber: [{
        id: 1,
        status: true
      },
      {
        id: 3,
        status: true
      },
      {
        id: 6,
        status: true
      },
    ] // 拼课选择人数
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


  openGive: function () {
    this.setModalContent('提示', '赠送的课程被领取后，双方均不可取消该订单', this.createOrder)
  },
  /***
   * modal 确认按钮事件
   */
  onConfirm: function () {
    this.data.tip.confirmFun()
  },

  /***
   * 设置 modal 内容
   */
  setModalContent: function (title, content, confirmFun) {
    let tip = this.data.tip
    tip.title = title
    tip.content = content
    tip.confirmFun = confirmFun
    this.setData({
      tip,
      showModalTips: true,
    })
  },

  /***
   * 打开训练营
   */
  openCamp: function () {
    this.setData({
      showTips: true,
    })

  },

  /**
   * 关闭提示
   */
  closeTips: function () {
    this.setData({
      showTips: false,
    })
  },

  /**
   * 打开优惠券
   */
  openCoupon: function () {
    let dataId = this.data.dataId
    let coupon_list = this.data.coupon_list
    let user_coupon_id = this.data.user_coupon_id
    let pay_price = this.data.discount_price
    let course = this.data.course
    app.couponList = coupon_list
    console.log('price--->',course.price)
    wx.navigateTo({
      url: '/pages/confirm_order/coupon?id=' + user_coupon_id + '&pay_price=' + pay_price + '&price=' + course.price
    })
  },

  /**
   * 私教选择课时
   */
  choiceCourseTime: function (e) {
    let num = e.currentTarget.dataset.num
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let price_list = this.data.price_list
    let courseDate = this.data.courseDate
    let user = this.data.user
    let pay_price = 0
    let obj = this.privatePayPirce(price_list, id, courseDate, user)
    pay_price = obj.pay_price
    this.setData({
      'cart.id': id,
      priceIndex: index,
      number: num,
      pay_price: pay_price,
      discount_price: pay_price
    })
  },


  /**
   * 团课选择人数 拼课
   **/
  choiceNumber: function (e) {
    let id = e.currentTarget.dataset.id
    let activity = this.data.activity
    let couponAll = this.data.couponAll
    let courseDate = this.data.courseDate
    let coupon_type = this.coupon_type
    let user = this.data.user
    let temp = []
    let pay_price = this.teamPayPirce(courseDate, id, user, activity)
    if (id == 3 || id == 2 && !activity.two) {
      for (let item of couponAll) {
        if (item.coupon_type == 'normal') {
          temp.push(item)
        }
      }
    }

    if (id == 1) {
      temp = couponAll
    }

    let hasDiscount = false
    this.data.coupon_list.forEach(item => {
      if (item.coupon_type == 'discount') {
          hasDiscount = true
      }
    });

    if(hasDiscount){
      temp = couponAll
    }
    
    this.setData({
      'cart.amount': id,
      dataId: id,
      number: id,
      coupon_list: temp,
      user_coupon_id: 0,
      coupon_type: 'normal',
      pay_price: pay_price,
      discount_price: pay_price
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type || []
    })

    this.getData()
  },


  /**
   *  初始化数据
   */
  getData: function () {
    let that = this
    let cart = app.shoppingList
    let teamNumber = that.data.teamNumber
    new Promise((resolve, reject) => {
      ajax.post(api.getMccardHome, {}, ({
        data
      }) => {
        if (data.code == 200) {
          let user = data.obj.user
          that.setData({
            user: user
          })
          resolve(user)
        }
      }, 'auth', true)
    }).then((user) => {
      ajax.post(api.tradeOrder, {
        'cart': cart
      }, ({
        data
      }) => {
        if (data.code == 200) {
          let price_list = data.obj.result_arr.price_list || ''
          let order_result = data.obj.order_result || ''
          let courseDate = data.obj.result_arr
          let course = courseDate.course
          let activity = data.obj.activity
          let number = 1
          let priceIndex = 0
          let pay_price = 0
          let discount_price = 0

          // 检验可选人数
          if (courseDate.rest_stock > 0) {
            for (let item of teamNumber) {
              if (courseDate.rest_stock < item.id) {
                item.status = false
              }
            }
          }

          // 团课
          if (course.type == 'team') {
            let discountType = that.data.coupon_type
            let discount = that.data.discount
            let price = that.teamPayPirce(courseDate, cart.amount, user, activity)
            discount_price = price
            pay_price = discountType == 'discount' ? price * discount  :price - that.data.reduce_cost
            number = cart.amount
          }

          // 训练营
          if (course.type == 'camp') {
            pay_price = order_result.pay_price
            discount_price = pay_price
            number = cart.amount
          }

          // 私教
          if (course.type == 'private') {
            let obj = that.privatePayPirce(price_list, cart.id, courseDate, user)
            number = obj.number
            priceIndex = obj.priceIndex
            discount_price = obj.pay_price
            pay_price = obj.pay_price
          }

          that.setData({
            price_list: price_list,
            activity: data.obj.activity,
            coupon_list: data.obj.coupon_list,
            couponAll: data.obj.coupon_list,
            queue_order: data.obj.queue_order,
            courseDate: courseDate,
            course: course,
            cart: cart,
            number: number,
            priceIndex: priceIndex,
            pay_price: pay_price,
            discount_price: discount_price,
            give_expired: data.obj.give_expired,
            teamNumber: teamNumber,
            dataId: 1,
            showLoad: false
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        }
      })
    }).catch(function (err) {
      wx.showModal({
        title: '提示',
        content: '网络出错',
        showCancel: false
      })
      console.log(err)
    })
  },

  /**
   * 计算团课应付价
   */
  teamPayPirce: function (courseDate, num, user, activity) {
    let pay_price = 0
    let type = this.data.type
    if (activity.two && num == 2) {
      // 普通价
      if (user.type == 'user') {
        pay_price = courseDate.price
      }
      //会员价
      if (user.type == 'vip') {
        pay_price = courseDate.vip_price
      }
    } else {
      // 普通价
      if (user.type == 'user') {
        if(app.globalData.freeCourseList.indexOf(courseDate.course_id) != -1 && courseDate.is_spell != 1 && !courseDate.svip_free && type == 'buy'){
          pay_price = courseDate.price * (num - 1)
        }else{
          pay_price = courseDate.price * num
        }
      }
      //会员价
      if (user.type == 'vip') {
        if(app.globalData.freeCourseList.indexOf(courseDate.course_id) != -1 && courseDate.is_spell != 1 && !courseDate.svip_free && type == 'buy'){
          pay_price = courseDate.vip_price * (num - 1)
        }else{
          pay_price = courseDate.vip_price * num
        }
        
      }

    }

    return pay_price
  },

  /***
   * 计算私教应付价
   */
  privatePayPirce: function (arr, id, courseDate, user) {
    let number = 1
    let priceIndex = 0
    let pay_price = 0
    let obj = {}
    for (let i in arr) {
      if (arr[i].id == id) {
        number = arr[i].course_num
        priceIndex = i
        // 体验价
        if (courseDate.first && arr[i].first_price > 0) {
          pay_price = arr[i].first_price * arr[i].course_num
        }
        // 普通价
        if (!courseDate.first || courseDate.first && arr[i].first_price == 0) {
          pay_price = arr[i].price * arr[i].course_num
        }
      }
    }
    return obj = {
      number: number,
      priceIndex: priceIndex,
      pay_price: pay_price - this.data.reduce_cost
    }
  },

  /**
   * 确认购买
   */
  createBuy: function () {
    console.log('create buy',this.data.reduce_cost, this.data.pay_price)
    let that = this
    let type = that.data.type
    let course = that.data.course
    if (type == 'give') {
      that.openGive()
      return
    }
    if (course.type == 'camp') {
      that.openCamp()
      return
    }
    that.createOrder()
  },

  /**
   * 创建订单
   */
  createOrder: function () {
    let that = this
    let cart = that.data.cart
    let user = that.data.user
    let pay_price = that.data.pay_price
    let courseDate = that.data.courseDate
    let activity = that.data.activity
    let user_coupon_id = that.data.user_coupon_id
    let reduce_cost = that.data.reduce_cost
    cart.order_status = courseDate.rest_stock == 0 ? 'queue' : 'success'
    ajax.post(api.createOrder, {
      'cart': cart,
      'user_coupon_id': user_coupon_id
    }, ({
      data
    }) => {
      if (data.code == 200) { 
        that.setData({
          showModalTips: false,
          ordersn: data.obj.order_result.ordersn
        })
        if (that.data.coupon_type == 'week' || that.data.coupon_type == 'gift' || reduce_cost == pay_price) {
          pay_price = 0
        }

        if (user.balance >= pay_price) {
          pay_price = pay_price / 100
          that.setData({
            ordersn: data.obj.order_result.ordersn,
          })
          that.setModalContent('提示', '支付' + pay_price + '元', that.cardPaynotify)
          
        } else {
          that.wxPay()
        }
      } else if (data.code == 501) {
        this.setModalContent('提示', '库存不足', ()=>{
          wx.navigateBack({
            delta: 1,
          })
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
   * 微信支付
   */
  wxPay() {
    let that = this
    let type = that.data.type
    let ordersn = that.data.ordersn
    let give_expired = that.data.give_expired
    let user = that.data.user
    //发起微信支付
    ajax.post(api.wxMpPay, {
        "ordersn": ordersn
      },
      ({
        data
      }) => {
        if (data.code == 200) {
          //调起微信支付
          wx.requestPayment({
            'timeStamp': data.obj.config.timeStamp,
            'nonceStr': data.obj.config.nonceStr,
            'package': data.obj.config.package,
            'signType': 'MD5',
            'paySign': data.obj.config.paySign,
            'success': function (res) {
              if (type == 'give') {
                wx.redirectTo({
                  url: '/pages/confirm_order/payment_success?give_expired=' + give_expired + '&ordersn=' + ordersn + '&user_name=' + user.miniprogram.nickname
                })
              } else {
                wx.redirectTo({
                  url: '/pages/reservation/reservation_success?ordersn=' + ordersn,
                })
              }
            },
            'fail': function (res) {
              this.setModalContent('提示', '离支付成功只差一步,怎么能轻易放弃？', that.wxPay)
            
              // wx.showModal({
              //   content: '离支付成功只差一步,怎么能轻易放弃？',
              //   cancelText: '放弃支付',
              //   confirmText: '继续支付',
              //   success: function (res) {
              //     if (res.confirm) {
              //       that.wxPay(ordersn)
              //     } else if (res.cancel) {

              //     }
              //   },
              // })
            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: data.msg
          })
        }
      }
    )
  },

  /**
   * 魔橙卡支付
   */
  cardPaynotify: function () {
    let that = this
    let type = that.data.type
    let ordersn = that.data.ordersn
    let give_expired = that.data.give_expired
    let user = that.data.user
    ajax.post(api.cardPay, {
      'ordersn': ordersn
    }, ({
      data
    }) => {
      if (data.code == 200) {
        if (type == 'give') {
          wx.redirectTo({
            url: '/pages/confirm_order/payment_success?give_expired=' + give_expired + '&ordersn=' + ordersn + '&user_name=' + user.miniprogram.nickname
          })
        } else {
          wx.redirectTo({
            url: '/pages/reservation/reservation_success?ordersn=' + ordersn,
          })
        }
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
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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