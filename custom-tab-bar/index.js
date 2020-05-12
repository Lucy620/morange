const app = getApp()

Component({
  data: {
    selected: null,
    color: "#424242",
    selectedColor: "#FF9C00",
    list: [{
      "pagePath": "/pages/index/index",
      "iconPath": "/assets/image/home1.png",
      "selectedIconPath": "/assets/image/home2.png",
      "text": "门店"
    },
    {
      "pagePath": "/pages/course/course",
      "iconPath": "/assets/image/book1.png",
      "selectedIconPath": "/assets/image/book2.png",
      "text": "课程"
    },
    {
      "pagePath": "/pages/reservation/my_reservation",
      "iconPath": "/assets/image/love1.png",
      "selectedIconPath": "/assets/image/love2.png",
      "text": "我的预约"
    },
    {
      "pagePath": "/pages/user/user",
      "iconPath": "/assets/image/card1.png",
      "selectedIconPath": "/assets/image/card2.png",
      "text": "魔橙卡"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      const index = data.index
      wx.switchTab({url})
      this.setData({
        selected: index
      })
    }
  }
})