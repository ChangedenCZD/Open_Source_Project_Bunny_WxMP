// pages/publish/index.js
let Apis = require('../../utils/Apis');
let common = require('../../utils/Commons');
let StorageUtils = common.StorageUtils;
let OpenIdUtils = require('../../utils/OpenIdUtils');
Page({
  data: {
    isPub: true,
    desc: '',
    images: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      userid: StorageUtils.get('userId', OpenIdUtils.get())
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
  onDescInput: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },
  onChooseImg: function (e) {
    let self = this;
    let images = self.data.images || [];
    let count = 4 - images.length;
    if (count) {
      wx.chooseImage({
        count: count, // 默认9
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          tempFilePaths.forEach((item) => {
            images.push(item)
          })
          self.setData({
            images: images
          })
        }
      })
    } else {
      wx.showModal({
        title: '提醒',
        content: '已选9张，请先删除部分照片再尝试添加。'
      })
    }
  },
  onImgItemClick: function (e) {
    let self = this;
    let index = parseInt(e.target.dataset.id);
    let images = this.data.images;
    let current = images[index];
    wx.showActionSheet({
      itemList: ['预览', '删除'],
      success: function (res) {
        let idx = res.tapIndex;
        if (idx != null) {
          switch (idx) {
            case 0:
              wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: images // 需要预览的图片http链接列表
              })
              break;
            case 1:
              let newArray = [];
              images.forEach((item, idx) => {
                if (idx != index) {
                  newArray.push(item)
                }
              })
              self.setData({
                images: newArray
              })
              break;
          }
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  onPubChange: function (e) {
    var isPub = e.detail.value;
    if (isPub == null) {
      isPub = !this.data.isPub;
    }
    this.setData({
      isPub: isPub
    })
  },
  commit: function (e) {
    let self = this;
    let data = this.data;
    let images = data.images;
    let desc = data.desc;
    let isPub = data.isPub;
    if (images.length < 1 && desc.length < 1) {
      wx.showModal({
        title: '提醒',
        content: '请输入你想写的话或者选择添加图片'
      })
    } else {
      upload(this, (results) => {
        console.log(results)
        common.request(
          Apis.publish(self.data.userid, desc, results),
          (res) => {
            if (Apis.checkResult(res)) {
              common.showToast('发布成功');
              common.back();
            } else { }
          },
          (err) => {
            console.log(err)
            common.showToast('发布失败，请重试')
          }
        )
      })
    }
  }
})

function upload(self, cb) {
  let images = self.data.images;
  var length = images.length;
  if (length > 0) {
    var results = [];
    images.forEach((image, idx) => {
      let api = Apis.uploadFile(self.data.userid);
      common.showToast('图片上传中', true, 60000);
      wx.uploadFile({
        url: api.url,
        filePath: image,
        name: 'file',
        formData: api.data,
        header: { 'USER': self.data.userid },
        success: function (res) {
          let array = JSON.parse(res.data || '{}').result || [];
          results = [];
          array.forEach((item) => {
            results.push(item.filePath)
          })
          // results.push(((JSON.parse(res.data || '{}').result || {})[0] || {}).filePath)
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function () {
          length--
          if (length < 1) {
            console.log(results)
            cb && cb(results)
          }
        }
      })
    })
    // let intervalId = setInterval(() => {
    //   if (length < 1) {
    //     clearInterval(intervalId);
    //     cb && cb(results)
    //   }
    // }, 200);
  } else {
    cb && cb([])
  }
}