// pages/album/index.js
let app = getApp();
let common = app.common;
let StorageUtils = app.StorageUtils;
let Apis = app.Apis;
Page({
  data: {
    userid: '',
    postList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      imgSize: (app.getWidth() - 120) / 2,
      userid: options.userid || StorageUtils.get('userId', '')
    })
    getData(this)
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
  onImageClick: function (e) {
    let idx = e.target.dataset.idx;
    let images = this.data.postList[idx].images;
    let path = e.target.dataset.path;
    wx.previewImage({
      current: path,
      urls: images
    })
  }
})
function getData(self) {
  common.request(
    Apis.postList(self.data.userid, 1, 999999),
    (res) => {
      wx.stopPullDownRefresh()
      if (Apis.checkResult(res)) {
        let postList = res.data.result || [];
        postList.forEach((item) => {
          item.time = new Date(item.update).format('yyyy-MM-dd HH:mm:ss')
        })
        self.setData({
          postList: postList
        })
      }
    },
    (err) => {
      console.log(err)
      wx.stopPullDownRefresh()
    }
  )
}