const util = require('../../utils/util.js')
const {
  firstNames,
  secondMale,
  secondFemale
} = require('./name.js');
var app = getApp()
Page({
  data: {
    avatarUrl: '',
    userName: '',
    cpName: '',
    openId: '',
    hasOpenId: false,
    isUpload: false,
    routeData: {},
    animationData: {},
    isCanvas: false,
    qtsheXcxCode: '',
    isPhotoModel: false,
    qtsheBackground: '',
    myCpName: '',
    isOpenMusic: true,
    shareUrl: '/pages/index/index',
    shareContent: '良辰已订，吉日待访。',
    shareImagePath: '',

  },
  onShareAppMessage() {
    return {
      title: this.data.shareContent,
      imageUrl: 'https://qiniu-image.qtshe.com/20180817shareImage.png',
      path: this.data.shareUrl
    }
  },
  // 获取用户openid
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        var openId = res.result.openId;
        this.setData({
          openId
        })
        wx.setStorageSync("openId", openId)
      }
    })
  },
  onLoad(options) {
    this.createQrCode()
    this.scaleO()
    this.audioGreat = wx.createInnerAudioContext()
    this.audioGreat.autoplay = true
    this.audioGreat.src = 'https://qtsexcel.qtshe.com/Springloll-Beautiful%20Day.mp3'
    this.audioGreat.onPlay(() => {
      console.log('开始播放')
    })
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
  onUnload() {
    this.audioGreat.stop()
  },
  onHide() {
    this.audioGreat.stop()
  },
  closeModel() {
    this.setData({
      isPhotoModel: false
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
  onShow() {
    this.openMusic()
    if (wx.getStorageSync('avatarUrl') && wx.getStorageSync('openId') && wx.getStorageSync('gender')) {
      this.setData({
        hasOpenId: true,
        openId: wx.getStorageSync('openId'),
        avatarUrl: wx.getStorageSync('avatarUrl')
      })
    } else {
      this.setData({
        hasOpenId: false
      })
    }
  },
  getUserName(e) {
    this.setData({
      userName: e.detail.value
    })
    if (parseInt(wx.getStorageSync('gender')) === 1) {
      this.setData({
        cpName: `${this.data.userName}先生&${this.data.myCpName}小姐`
      })
    } else if (parseInt(wx.getStorageSync('gender')) === 2) {
      this.setData({
        cpName: `${this.data.myCpName}先生&${this.data.userName}小姐`
      })
    } else {
      this.setData({
        cpName: `${this.data.userName}先生&${this.data.myCpName}小姐`
      })
    }
  },
  getObject(e) {
    this.setData({
      myCpName: e.detail.value
    })
    if (parseInt(wx.getStorageSync('gender')) === 1) {
      this.setData({
        cpName: `${this.data.userName}先生&${this.data.myCpName}小姐`
      })
    } else if (parseInt(wx.getStorageSync('gender')) === 2) {
      this.setData({
        cpName: `${this.data.myCpName}先生&${this.data.userName}小姐`
      })
    } else {
      this.setData({
        cpName: `${this.data.userName}先生&${this.data.myCpName}小姐`
      })
    }
  },
  preventTouchMove() { },
  creatMyPic() {
    if (!this.data.userName) {
      wx.showToast({
        title: '请输入你的姓名哦～',
        icon: 'none'
      })
    } else if (!this.data.myCpName) {
      wx.showToast({
        title: '请输入你的对象姓名哦～',
        icon: 'none'
      })
    } else {
      let postData = {
        url: '/activityCenter/mini/share/add/content',
        data: {
          openid: wx.getStorageSync('openId'),
          name: this.data.userName,
          cpName: this.data.cpName,
          image: this.data.avatarUrl,
          gender: this.data.gender
        }
      }
      wx.showLoading({
        title: '加载中'
      })
      app.ajax(postData).then((res) => {
        wx.hideLoading()
        if (res.success) {
          this.setData({
            weddingId: res.data.weddingId,
            shareUrl: `/pages/home/home?weddingId=${res.data.weddingId}`
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  createQrCode() {
    wx.cloud.callFunction({
      name: 'getqr',
      data: {
        page: 'pages/demo/demo',
        scene: 'id=6',
      }
    }).then(res => {
      console.log(res.result);
      if (res.result.status == 0) {
        _this.setData({
          qr_url: res.result.tempFileURL
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '生成小程序码失败',
        })
      }
    }).catch(err => {
      console.log(err);
    })
  },
  chooseImage() {
    app.uploadFile(this.getImage)
  },
  getImage(data, index) {
    let a = []
    a.push(data.imageMax)
    this.setData({
      avatarUrl: data.imageMax,
      isUpload: true,
      uploadImg: a
    })
  },
  previewImg() {
    let _this = this
    wx.previewImage({
      current: _this.data.avatarUrl, // 当前显示图片的http链接
      urls: _this.data.uploadImg // 需要预览的图片http链接列表
    })
  },
  changeImage(data) {
    this.setData({
      avatarUrl: data.imageMax
    })
  },
  deleteImage() {
    this.setData({
      isUpload: false,
      avatarUrl: wx.getStorageSync('avatarUrl'),
      uploadImg: []
    })
  },
  showActionSheet(e) {
    let _this = this
    wx.showActionSheet({
      itemList: ['删除', '查看大图', '更换图片'],
      success: function (res) {
        if (res.tapIndex === 0) {
          _this.deleteImage()
        } else if (res.tapIndex === 1) {
          wx.previewImage({
            current: _this.data.avatarUrl, // 当前显示图片的http链接
            urls: _this.data.uploadImg // 需要预览的图片http链接列表
          })
        } else if (res.tapIndex === 2) {
          app.uploadFile(_this.changeImage)
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
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
  rotateAndScale() {
    this.getOpenid()
    if (wx.getStorageSync('avatarUrl')) {
      this.setData({
        avatarUrl: wx.getStorageSync('avatarUrl')
      })
    }
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
  },
  getRandomName() {
    let j
    let i = parseInt(Math.random() * firstNames.length)
    if (parseInt(wx.getStorageSync('gender')) === 1) {
      j = parseInt(Math.random() * secondFemale.length)
      this.setData({
        myCpName: firstNames[i] + secondFemale[j],
      })
    } else {
      j = parseInt(Math.random() * secondMale.length)
      this.setData({
        myCpName: firstNames[i] + secondMale[j]
      })
    }
    if (parseInt(wx.getStorageSync('gender')) === 1) {
      this.setData({
        cpName: `${this.data.userName}先生&${this.data.myCpName}小姐`,
        shareContent: '这世上真话本就不多，一位女子的脸红胜过一大段对白。'
      })
    } else if (parseInt(wx.getStorageSync('gender')) === 2) {
      this.setData({
        cpName: `${this.data.myCpName}先生&${this.data.userName}小姐`,
        shareContent: '他说要伴我一程，他还说一程即是余生'
      })
    } else {
      this.setData({
        cpName: `${this.data.userName}先生&${this.data.myCpName}小姐`,
        shareContent: '从今后是朝朝暮暮在一起，地久天长，同心比翼，相敬相爱相扶持。'
      })
    }
  }
})