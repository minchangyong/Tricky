// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const page = event.page
  const scene = event.scene

  //appid和秘钥
  const appid = 'wxa38784192e4187e3',
    secret = '25f056b13bf5f5a36d1b358f1bea22bb';

  const AccessToken_options = {
    method: 'GET',
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    qs: {
      appid,
      secret,
      grant_type: 'client_credential'
    },
    json: true

  };

  //获取AccessToken
  const resultValue = await rp(AccessToken_options);
  const token = resultValue.access_token;

  //获取小程序码配置
  const code_options = {
    method: 'POST',
    url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + token,
    body: {
      'page': page,
      'width': 430,
      'scene': scene
    },
    json: true,
    encoding: null
  };

  //获取二进制图片
  const buffer = await rp(code_options);

  const upload = await cloud.uploadFile({
    cloudPath: 'wxacode.png',
    fileContent: buffer,
  })
  return {
    wxacodefileID: upload.fileID
  }

}