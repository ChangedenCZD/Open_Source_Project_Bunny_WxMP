// pages/follow/index.js
let app = getApp();
let common = app.common;
let Apis = app.Apis;
Page({
  data: {
    followList: []
  },
  onLoad: function (options) {
    let self = this;
    app.getUserid((userid) => {
      self.setData({
        userid: userid
      })
      getData(self)
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
  onItemClick: function (e) {
    common.to('/pages/profile/index?userid=' + e.target.dataset.id)
  }
})
function getData(self) {
  common.request(
    Apis.followList(self.data.userid),
    (res) => {
      console.log(res);
      if (Apis.checkResult(res)) {
        self.setData({
          followList: res.data.result
        })
      }
    }, (err) => {
      console.error(err);
      common.showToast('关注列表获取失败');
    }
  )
}