const util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    hasOpenId: false,
    avatarUrl: '',
    userName: '',
    isLooked: true,
    routeData: {},
    openId: '',
    weddingId: '',
    animationData: {},
    results: [],
    cpName: '',
    image: '',
    name: '',
    pageNum: 1,
    isOpenMusic: true,
    isSelf: false,
    shareContent: '',
    totalCount: 0,
    shareImagePath: '',
    isCanvas: false,
    qtsheXcxCode: '',
    isPhotoModel: false,
    qtsheBackground: ''
  },
  onLoad(options) {
    this.scaleO()
    this.audioGreat = wx.createInnerAudioContext()
    this.audioGreat.autoplay = true
    this.audioGreat.src = 'https://qtsexcel.qtshe.com/Springloll-Beautiful%20Day.mp3'
    this.audioGreat.onPlay(() => {
      console.log('开始播放')
    })
    if (!options.scene) {
      if (options.weddingId) {
        this.setData({
          weddingId: options.weddingId
        })
      }
    } else {
      let getQueryString = {}
      let strs = decodeURIComponent(options.scene).split('&') //以&分割
      //取得全部并赋值
      for (let i = 0; i < strs.length; i++) {
        getQueryString[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
      if (getQueryString['wid']) {
        this.setData({
          weddingId: getQueryString['wid']
        })
      }
    }
  },
  onUnload() {
    this.audioGreat.stop()
  },
  onHide() {
    this.audioGreat.stop()
  },
  onShow() {
    this.initData()
    if (wx.getStorageSync('avatarUrl') && wx.getStorageSync('userName') && wx.getStorageSync('openId')) {
      this.setData({
        hasOpenId: true,
        openId: wx.getStorageSync('openId')
      })
    } else {
      this.setData({
        hasOpenId: false
      })
    }
    let _this = this
    wx.getImageInfo({
      src: 'https://qiniu-image.qtshe.com/20180817wedding%20%281%29.png',
      success: (res) => {
        _this.setData({
          qtsheBackground: res.path
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  openMusic() {
    this.audioGreat.play()
    this.setData({
      isOpenMusic: true
    })
  },
  closeMucic() {
    this.audioGreat.pause()
    this.setData({
      isOpenMusic: false
    })
  },
  onShareAppMessage() {
    return {
      title: `${this.data.userName}的婚礼邀请函`,
      imageUrl: 'https://qiniu-image.qtshe.com/20180817shareImage.png',
      path: `/activity/wedding/home/index?weddingId=${this.data.weddingId}`
    }
  },
  scaleO() {
    var animation = wx.createAnimation({
      duration: 1,
      timingFunction: 'liner',
    })
    // 放大
    animation.scale(0, 0).opacity(0).step({
      duration: 1
    })
    this.setData({
      routeData: animation.export()
    })
  },
  showPhotoModel() {
    this.setData({
      isPhotoModel: true
    })
  },
  closeModel() {
    this.setData({
      isPhotoModel: false
    })
  },
  initData() {
    let postData = {
      url: '/activityCenter/mini/share/get/content',
      data: {
        weddingId: this.data.weddingId,
        openid: this.data.openId
      }
    }
    app.ajax(postData).then((res) => {
      if (res.success) {
        this.setData({
          userName: res.data.name,
          cpName: res.data.cpName,
          image: res.data.image,
          isSelf: res.data.self
        })
        let _this = this
        wx.getImageInfo({
          src: res.data.qrCode,
          success: (res) => {
            _this.setData({
              qtsheXcxCode: res.path
            })
          },
          fail: (err) => {
            console.log(err)
          }
        })
        if (this.data.openId) {
          this.setUserInfo()
        }
        if (parseInt(res.data.gender) === 1) { //男
          this.setData({
            shareContent: '这世上真话本就不多，一位女子的脸红胜过一大段对白。'
          })
        } else if (parseInt(res.data.gender) === 2) { //女
          this.setData({
            shareContent: '他说要伴我一程，他还说一程即是余生'
          })
        } else { //未知
          this.setData({
            shareContent: '从今后是朝朝暮暮在一起，地久天长，同心比翼，相敬相爱相扶持。'
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //显示头像列表
  showInfoList() {
    if (this.data.isSelf) {
      this.setData({
        isSelf: true
      })
    } else {
      this.setData({
        isSelf: false
      })
    }
    let postData = {
      url: '/activityCenter/mini/share/list',
      data: {
        pageSize: 30,
        pageNum: this.data.pageNum,
        weddingId: this.data.weddingId
      }
    }
    app.ajax(postData).then((res) => {
      if (res.success) {
        this.setData({
          results: res.data.results,
          totalCount: res.data.totalCount
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //头像列表上拉刷新
  scrolltolower() {
    let postData = {
      url: '/activityCenter/mini/share/list',
      data: {
        pageSize: 30,
        pageNum: this.data.pageNum += 1,
        weddingId: this.data.weddingId
      }
    }
    app.ajax(postData).then((res) => {
      if (res.success) {
        if (res.data.results.length === 0) {
          this.setData({
            pageNum: this.data.pageNum - 1
          })
          util.toast('暂无更多数据')
          return false
        } else {
          for (var i = 0; i < res.data.results.length; i++) {
            this.data.results.push(res.data.results[i])
          }
          this.setData({
            results: this.data.results,
            totalCount: res.data.totalCount
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  skipToCreate() {
    this.audioGreat.stop()
    wx.reLaunch({
      url: '../create/index'
    })
  },
  unOnload() {
    this.audioGreat.stop()
  },
  rotateAndScale() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'liner',
    })
    // 旋转同时缩小
    animation.scale(0, 0).opacity(0).step({
      duration: 2000
    })
    this.setData({
      animationData: animation.export()
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#f5ced3',
      animation: {
        duration: 100,
        timingFunc: 'easeIn'
      }
    })
    this.scaleImage()
  },
  scaleImage() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'liner',
    })
    // 放大
    animation.scale(1, 1).opacity(1).step({
      duration: 2000
    })
    this.setData({
      routeData: animation.export()
    })
    this.initData()
  },
  setUserInfo() {
    let postData = {
      url: '/activityCenter/mini/share/add/record',
      data: {
        weddingId: this.data.weddingId,
        openid: this.data.openId || wx.getStorageSync('openId'),
        name: wx.getStorageSync('userName'),
        headImg: wx.getStorageSync('avatarUrl')
      }
    }
    app.ajax(postData).then((res) => {
      if (res.success) {
        this.showInfoList()
      }
    })
  },
  //将昵称绘制到canvas的固定位置
  setName(context) {
    context.setFontSize(14)
    context.setFillStyle('#FFF')
    context.fillText(this.data.cpName, 92, 476)
  },
  setQrcode(context) {
    let path = this.data.qtsheXcxCode
    context.drawImage(path, 245, 490, 56, 56)
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg() {
    let context = wx.createCanvasContext('mycanvas')
    let path = this.data.qtsheBackground
    let that = this
    context.drawImage(path, 0, 0, 320, 568)
    that.setName(context)
    that.setQrcode(context)
    //that.setAvatarUrl(context)
    //绘制图片
    context.draw()
    context.save()
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          wx.hideLoading()
          that.setData({
            shareImagePath: res.tempFilePath
          })
          that.savePhoto()
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      }, this)
    }, 2000)
  },
  savePhoto() {
    var that = this
    wx.showLoading({
      title: '正在保存...',
      mask: true
    })
    setTimeout(() => {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.shareImagePath,
        success(res) {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          setTimeout(() => {
            wx.hideLoading()
            that.setData({
              isCanvas: false
            })
          }, 300)
        },
        fail() {
          wx.showToast({
            title: '保存失败，请刷新页面重试',
            icon: 'none'
          })
          setTimeout(() => {
            wx.hideLoading()
            that.setData({
              isPhotoModel: false,
              isCanvas: false
            })
          }, 300)
        }
      })
    }, 2500)
  },
  showSaveModel() {
    if (this.data.qtsheXcxCode && this.data.qtsheBackground && this.data.cpName) {
      wx.showLoading({
        title: '正在生成...',
        mask: true
      })
      this.setData({
        isCanvas: true
      })
      this.createNewImg()
    } else {
      wx.showToast({
        title: '生成分享图片失败，请稍后重试',
        icon: 'none'
      })
    }
  }
})
