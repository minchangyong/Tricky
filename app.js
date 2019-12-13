let { NEW_URL, appKey, version, appVersion, isProdEnv, fundeBugVersion } = require("./config/config.js")

let params = {
  appKey,
  version
};

let deviceId = wx.getStorageSync("deviceId");
if (deviceId === "") {
  deviceId = Math.random();
  wx.setStorageSync("deviceId", deviceId);
  params.deviceId = deviceId;
} else {
  params.deviceId = deviceId;
}
const util = require("./utils/util.js");
App({
  onLaunch() {
    //云开发初始化
    wx.cloud.init({
      env: 'prod-vjfdo',
      traceUser: true
    })
  },
  /*
    封装ajax原型
    @params config，obj对象，包含所需url, data, header, method, complete数据，与微信小程序文档一致
    @return new Promise对象
  */
  ajax(config) {
    let that = this;
    let {
      url,
      data = {},
      header,
      method,
      success,
      fail,
      complete
    } = config;
    // 调试时 appKey 处理 TODO
    data.appKey ? appKey = data.appKey : ''
    // 处理url前缀
    if (!url.includes('https')) {
      url = NEW_URL + url;
    }
    // 处理请求头
    header = util.extend(
      true, {
        "content-type": "application/x-www-form-urlencoded",
        'Authorization': wx.getStorageSync('jwtToken') ? `Bearer ${wx.getStorageSync('jwtToken')}` : '',
      },
      header
    );
    // 处理请求所需的其他默认参数
    let timestamp = Date.now();
    params.token = wx.getStorageSync("token") || '';
    params.timestamp = timestamp;
    params.sign = util.md5(appKey + timestamp + version);

    data = util.extend(true, {}, params, data);
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        header,
        method: method || "POST",
        success(res) {
          if (res.statusCode === 200) {
            success && success.apply(this, arguments);
            resolve(res.data);
          } else {
            fail && fail.apply(this, arguments);
            
            reject(res);
          }
        },
        fail(err) {
          fail && fail.apply(this, arguments);
          reject(err);
        },
        complete() {
          complete && complete.apply(this, arguments);
        }
      });
    });
  },
  getWechatCode(callback) {
    wx.login({
      success: (res) => {
        wx.setStorage({
          key: 'miniCode',
          data: res.code,
          complete: () => {
            callback && callback()
          }
        })

      }
    })
  },

  /*
  uploadFile 上传文件公共方法
  @params: successCb 回调函数
  */
  uploadFile: function (successCb, index) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var tempFilesSize = res.tempFiles[0].size; //获取图片的大小，单位B
        if (tempFilesSize <= 3000000) {
          //图片小于或者等于3M时 可以继续
          that.uploadImgFile(that, tempFilePaths, successCb, index);
        } else {
          wx.showToast({
            title: "上传图片不能大于3M哦～",
            icon: "none"
          });
        }
      }
    });
  },
  uploadImgFile: function (page, path, successCb, index) {
    wx.showLoading({
      title: "上传中...",
      mask: true
    });
    wx.uploadFile({
      url: NEW_URL + "/uploadCenter/image/app",
      filePath: path[0],
      name: "image",
      header: {
        chartset: "utf-8",
        "content-type": "multipart/form-data"
      },
      formData: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode !== 200) {
          wx.showModal({
            title: "提示",
            content: "上传失败，请稍后重试",
            showCancel: false
          });
          return;
        } else {
          try {
            let data = JSON.parse(res.data);
            if (data.success) {
              console.log(index);
              successCb && successCb(data.data, index);
            } else {
              wx.showModal({
                title: "提示",
                content: res.msg || "上传失败，请稍后重试",
                showCancel: false
              });
              return;
            }
          } catch (err) {
            wx.showModal({
              title: "提示",
              content: "上传失败，请稍后重试",
              showCancel: false
            });
            return;
          }
        }
      },
      fail: function (e) {
        wx.showModal({
          title: "提示",
          content: "上传失败，请稍后重试",
          showCancel: false
        });
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
 
  globalData: {
    userInfo: {
      token: wx.getStorageSync("token") || ""
    }
  }
});
