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
  created() {
    app.getWechatCode()
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
        this.upLoadImage(e)
      }
    },
    postUserInfo(e, headImg) {
      let postData = {
        url: '/qtsWeChat/wechat/program/auth/login',
        data: {
          code: wx.getStorageSync('miniCode'),
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          headImg: headImg || ''
        }
      }
      app.ajax(postData).then((res) => {
        app.getWechatCode() //重新生成code
        if (res.success) {
          wx.setStorage({
            key: 'openId',
            data: res.data.openId
          })
          if (res.data.token) {
            wx.setStorage({
              key: 'token',
              data: res.data.token
            })
          }
          if (res.data.jwtToken) {
            wx.setStorage({
              key: 'jwtToken',
              data: res.data.jwtToken
            })
          }
          this.triggerEvent('initData')
        } else {
          if (res.code === 6011) {
            wx.showToast({
              title: '登录失败，请稍后重试',
              icon: 'none'
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }, 2000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }
      })
    },
    // 上传头像昵称到CDN
    upLoadImage(e) {
      let postData = {
        url: '/uploadCenter/image/third/cndUrl',
        data: {
          cdnUrl: e.detail.userInfo.avatarUrl
        }
      }
      app.ajax(postData).then((res) => {
        if (res.success) {
          this.postUserInfo(e, res.data.imageMax)
          wx.setStorage({
            key: 'avatarUrl',
            data: res.data.imageMax,
            success: () => {
              this.triggerEvent('imgUpload')
            }
          })
        } else {
          this.postUserInfo(e, '')
        }
      })
    }
  }
})