const util = require('../../utils/util.js')
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
    firstNames: ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '闵',
      '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏',
      '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦',
      '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '余',
      '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '元',
      '卜', '顾', '孟', '平', '黄', '胡', '穆', '萧', '尹', '欧阳', '慕容'
    ],
    secondMale: ['祥', '柏辰', '俊帆', '星年', '信秀', '炫宇', '风宏', '泰君', '冠余', '俊利', '信杉', '春佑', '星宇', '柏君', '信辰', '信吉', '柏帆', '炫辰', '波佑', '柏江', '星谷', '冠佑',
      '冠均', '星宏', '识全', '俊江', '鹏宇', '肖辰', '春宇', '泰伯', '劲帆', '泰舟', '识帆', '镜向', '炫江', '冠伯', '幽余', '建光', '镜曲', '劲宇', '施君', '泰吉',
      '冠全', '识亦', '星佑', '俊年', '肖佑', '柏志', '俊延', '俊宏', '泰旭', '镜舟', '星江', '波旭', '风年', '风帆', '泰江', '幽朋', '炫均', '柏吉', '肖羽', '建江',
      '俊朋', '风西', '炫吉', '泰羽', '俊辰', '镜冰', '田生', '腾飞', '星吉', '亮', '凯', '豪', '星帆', '识吉', '建舟', '风宇', '镜帆', '冠君', '信帆', '皓辰',
      '冠宇', '泰宏', '幽光', '波宇', '冠名', '幽全', '波亦', '建年', '幽辰', '俊材', '星良', '波帆', '俊宇', '肖朋', '镜吉', '韵舟', '志立', '焱林', '白', '庆',
      '信佑', '炫谷', '冠辰', '南朋', '建余', '炫志', '建任', '韵舟', '建志', '镜光', '波江', '信何', '星辰', '泰辰', '俊全', '信江', '冠羽', '星延', '建波', '正正',
      '建宇', '泰帆', '风佑', '泰宇', '泰延', '信志', '韵名', '泰佑', '信亦', '劲羽', '鹏年', '信旭', '幽伯', '幽吉', '信朋', '春帆', '镜名', '俊羽', '庚',
      '韵帆', '镜宇', '镜西', '建延', '肖宇', '波言', '冠江', '建辰', '星舟', '建利', '冠年', '波杉', '风辰', '劲杉', '泰年', '建全', '信宏', '建君', '星朋', '星羽'
    ],
    secondFemale: ['盈冰', '柳妍', '盈君', '柳江', '红杏', '思采', '思江', '幽江', '香冰', '春竹', '香邑', '柳秀', '柔妍', '盈竹', '怡竹', '怡冰', '韵冰', '幽羽', '柳邑', '柏冰', '思君',
      '思冰', '怡采', '思妙', '玥冰', '怡君', '怡邑', '怡妍', '柔竹', '柳君', '怡江', '春妍', '幽冰', '南妍', '思羽', '红豆', '柔君', '柔邑', '盈羽', '春杏', '马铃',
      '盈江', '怡羽', '玥妍', '思妍', '玥羽', '柔羽', '薇冰', '香羽', '芊冰', '幽邑', '芍冰', '虹妍', '柔冰', '幽君', '盈安', '盈妍', '玥江', '翾慕', '映嘉', '璐',
      '怡菲', '玫颖', '怡嫣', '柳霎', '怡绮', '香瑾', '思菲', '柔嘉', '幽菱', '盈瑾', '盈菲', '春萍', '柳菱', '姿璇', '思凝', '柏凝', '盈瑛', '柔睿', '盈瑜', '新闻',
      '幽嫣', '春璇', '柔霎', '思睿', '柳华', '秋语', '秋瑾', '思梦', '春绿', '秋睿', '柔凝', '思润', '春菲', '思蓉', '春嫣', '秋嘉', '柳瑛', '柳嘉', '幽燕', '瑶',
      '柳菡', '盈蓉', '盈梦', '玥菲', '柔颖', '南嫣', '香华', '思嫦', '南璇', '彦颖', '香凝', '秋碧', '映睿', '幽绿', '柏璇', '姿洁', '玥凝', '姿菲', '姿瑾', '莫凡',
      '怡瑾', '姿颖', '姿嫣', '柏嘉', '映凝', '柔华', '幽绮', '秋翠', '映菲', '南凤', '盈语', '盼翠', '思碧', '柔瑜', '芊华', '彦梦', '翾静', '柳瑜', '思静', '晓曦',
      '南华', '姿菡', '柳菲', '姿静', '玥华', '盈菱', '盈凤', '柔菱', '柏颖', '柳瑾', '思华', '春翠', '彦瑾', '彦睿', '幽凝', '芊梦', '映瑛', '姿晓', '映梦', '燕敏',
      '思菱', '玥静', '思舞', '思嘉', '香嫣', '柏华', '春晓', '柔瑾', '幽菲', '秋嫣', '柏菲', '玫华', '柳嫣', '虹晓', '怡华', '盈嘉', '幽颖', '柔菲', '秋梦',
      '柔嫦', '香菱', '香鸣', '盈凝', '丽月', '姿瑜', '思晓', '彦璇', '思瑛', '虹瑛', '柔蓉', '怡瑛', '盈菡', '红璇', '韵月', '虹颖', '春华', '虹凝', '秋菊',
      '红菡', '彦瑜', '薇月', '芍嫣', '柔嫣', '春菡', '秋璇', '姿睿', '思洁', '南菲', '幽语', '柳凝', '思瑾', '怡嫦', '秋华', '思语', '南洁', '彦嘉', '彦菲',
      '思燕', '姿瑛', '思萍', '映瑜', '香瑜', '春瑛', '音菡', '彦蓉', '柔菡', '盈洁', '怡梦', '映瑾', '映蓉', '虹嫣', '佳丽', '倩', '燕敏'
    ]
  },
  onShareAppMessage() {
    return {
      title: this.data.shareContent,
      imageUrl: 'https://qiniu-image.qtshe.com/20180817shareImage.png',
      path: this.data.shareUrl
    }
  },
  onLoad(options) {
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
            shareUrl: `/activity/wedding/home/index?weddingId=${res.data.weddingId}`
          })
          let _this = this
          wx.getImageInfo({
            src: res.data.qrCode,
            success: (res) => {
              _this.setData({
                qtsheXcxCode: res.path,
                isPhotoModel: true
              })
            },
            fail: (err) => {
              console.log(err)
            }
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
    let i = parseInt(Math.random() * this.data.firstNames.length)
    if (parseInt(wx.getStorageSync('gender')) === 1) {
      j = parseInt(Math.random() * this.data.secondFemale.length)
      this.setData({
        myCpName: this.data.firstNames[i] + this.data.secondFemale[j],
      })
    } else {
      j = parseInt(Math.random() * this.data.secondMale.length)
      this.setData({
        myCpName: this.data.firstNames[i] + this.data.secondMale[j]
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
