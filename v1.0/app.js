//app.js
let common = require('./utils/Commons');
let Apis = require('./utils/Apis');
let StorageUtils = common.StorageUtils;
let OpenIdUtils = require('./utils/OpenIdUtils');

let USER_INFO_ERROR = "userInfoError";
let WX_USER_INFO = "wxUserInfo";
App({
  onLaunch: function () {
    getSystemInfo(this);
    getUserInfo(this);
  },
  getUserInfo: function (cb) {
    let self = this;
    let intervalId = setInterval(
      function () {
        let userInfo = self.globalData.userInfo;
        if (userInfo && userInfo.nickName) {
          clearInterval(intervalId);
          cb && cb(userInfo);
        }
      }, 100
    )
    // return this.globalData.userInfo
  },
  getWidth: function () {
    return this.globalData.windowWidth
  },
  getUserid: function (cb) {
    let self = this;
    let intervalId = setInterval(
      function () {
        let userid = self.globalData.userid;
        if (userid) {
          clearInterval(intervalId);
          cb && cb(userid);
        }
      }, 100
    )
  },
  globalData: {
    userInfo: {},
    img: {
      logo_white: 'http://www.changeden.net/img/icon_bunny_middle_white.png',
      logo_default: 'http://www.changeden.net/img/icon_bunny_large.png',
      logo_small: 'http://www.changeden.net/img/icon_bunny_small.png',
    }
  },
  common: common,
  StorageUtils: StorageUtils,
  OpenIdUtils: OpenIdUtils,
  Apis: Apis
});
function getUserInfo(self) {
  if (StorageUtils.get(USER_INFO_ERROR)) {
    onUserInfoError();
  } else {
    wx.login({
      success: function (res) {
        let code = res.code;
        if (code) {
          self.globalData.code = code;
          let rawData = StorageUtils.get(WX_USER_INFO, {});
          if (rawData && rawData.iv && rawData.encryptedData) {//如果有数据，则证明授权过
            getWxUserInfo(self)
          } else {//如果没有数据，有可能被清理过缓存
            wx.showModal({
              title: '提醒',
              content: '爽快客小程序需要您授权给我们获取相关资料，请选择允许授权！',
              success: function (res) {
                getWxUserInfo(self)
              }
            })
          }
        } else {
          onUserInfoError();
        }
      }
    });
  }
}
function getOpenId(self) {
  let globalData = self.globalData;
  let code = globalData.code;
  common.request(
    Apis.openId(code),
    (res) => {
      if (Apis.checkResult(res)) {
        let openId = res.data.result.openid;
        self.globalData.openId = openId;
        OpenIdUtils.set(openId);
        common.showToast('成功识别用户身份');
        tryToRegUser(self);
      }
    },
    (err) => {
      console.log(err);
      userError();
    }
  )
}
function getWxUserInfo(self) {
  wx.getUserInfo({
    success: function (res) {
      StorageUtils.set(USER_INFO_ERROR, false)
      StorageUtils.set(WX_USER_INFO, res)
      self.globalData.userInfo = res.userInfo;
      if (!OpenIdUtils.get()) {
        getOpenId(self)
      } else {
        tryToRegUser(self)
      }
    },
    fail: function (res) {
      onUserInfoError();
    }
  })
}
function onUserInfoError() {
  StorageUtils.set(USER_INFO_ERROR, true)
  wx.showModal({
    title: '警告',
    content: '由于您之前拒绝了微信授权，因此导致部分功能无法正常使用。请删除兔子人小程序，重新进入并授权即可！',
    success: function (res) {
      common.back(5)
    }
  })
}
function getSystemInfo(self) {
  var globalData = self.globalData;
  let systemInfo = wx.getSystemInfoSync();
  var width = systemInfo.windowWidth;
  globalData.windowWidth = width;
  globalData.windowHeight = systemInfo.windowHeight;
  globalData.screenHeight = systemInfo.screenHeight;
  var isIphoneOS = systemInfo.system.toLowerCase().indexOf('ios') >= 0;
  var baseNumber = globalData.windowDefaultWidthForAndroidOS;
  if (isIphoneOS) {
    baseNumber = globalData.windowDefaultWidthForIphoneOS
  }
  globalData.windowScale = width * 1.0 / baseNumber;
  globalData.isAndroidOS = !isIphoneOS;
  globalData.isIphoneOS = isIphoneOS;

  if (!wx.chooseAddress) {
    showUpdateDialog();
  }
}
function showUpdateDialog() {
  wx.showModal({
    title: '警告',
    content: '当前微信版本过低，请升级到最新微信版本后重试。',
    success: function (res) {
      common.back(5)
    }
  })
}
function tryToRegUser(self) {
  common.request(
    Apis.reg(),
    (res) => {
      if (Apis.checkResult(res)) {
        let userid = res.data.result.userid;
        if (userid) {
          self.globalData.userid = userid;
          OpenIdUtils.setUserid(userid);
          updateInfo(self);
        } else {
          userError();
        }
      }
    },
    (err) => {
      console.log(err);
      userError();
    }
  )
}
function updateInfo(self) {
  common.request(
    Apis.updateUserInfo(self.globalData.userid),
    (res) => {
      if (!Apis.checkResult(res)) {
        userError();
      }
    }, (err) => {
      console.log(err);
      userError();
    }
  )
}
function userError() {
  common.showToast('无法识别用户，请重新打开小程序')
}