var app = getApp()
const util = require('../../utils/util.js')
Component({
  properties: {
    //属性值可以在组件使用时指定
    openType: {
      type: String,
      value: ''
    },
    buttonName: {
      type: String,
      value: ''
    }
  },
  methods: {
    queryUserInfo(e) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        wx.setStorage({
          key: 'userName',
          data: e.detail.userInfo.nickName
        })
        wx.setStorage({
          key: 'avatarUrl',
          data: e.detail.userInfo.avatarUrl
        })
        wx.setStorage({
          key: 'gender',
          data: e.detail.userInfo.gender
        })
        this.triggerEvent('initData')
      }
    }
  }
})