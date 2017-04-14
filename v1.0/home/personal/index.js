// home/personal/index.js
let app = getApp();
let common = app.common;
Page({
  data: {
    entrance: [
      { img: 'pic', name: '相册', path: '/pages/album/index' },
      { img: 'like', name: '收藏', path: '/pages/favorites/index' },
      { img: 'favor', name: '关注', path: '/pages/follow/index' },
    ],
    profilePagePath: '/pages/profile/index'
  },
  onLoad: function (options) {
    let self = this;
    // let intervalId = setInterval(function () {
    //   let userInfo = app.getUserInfo();
    //   if (userInfo.nickName) {
    //     clearInterval(intervalId);
    //     self.setData({
    //       userInfo: userInfo
    //     });
    //   }
    // }, 200);
    app.getUserInfo(function (userInfo) {
      self.setData({
        userInfo: userInfo
      })
    })
    app.getUserid(function (userid) {
      self.setData({
        userid: userid
      })
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onEntranceClick: function (e) {
    console.log('/' + e.target.dataset.path)
    common.to(e.target.dataset.path)
  }
})