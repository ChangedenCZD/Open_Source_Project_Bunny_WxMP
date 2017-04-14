let StorageUtils = require('StorageUtils');
Date.prototype.format = function (formatStr) {
    /**用于格式化日期*/
    var str = formatStr;
    const Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth());
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
};
function showToast(title, isLoading, duration) {
    var icon = 'success';
    if (true == isLoading) {
        icon = 'loading';
    }
    if (!duration) {
        duration = 1500;
    }
    wx.showToast({
        title: title,
        icon: icon,
        duration: duration,
        mask: true
    });
}
function request(api, success, fail, complete) {
    showToast('请稍等...', true, 10000);
    var header = {
        'content-type': 'application/json'
    }
    wx.request({
        url: api.url,
        data: api.data,
        method: api.method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: header, // 设置请求的 header
        success: success,
        fail: function (a, b, c, d) {
            showToast('数据请求失败');
            typeof fail == "function" && fail(a, b, c, d)
        },
        complete: complete
    });
}
function back(pages, success, fail, complete) {
    wx.navigateBack({
        delta: pages ? pages : 1, // 回退前 delta(默认为1) 页面
        success: success,
        fail: fail,
        complete: complete
    });
}
function to(page, success, fail, complete) {
    wx.navigateTo({
        url: page,
        success: success,
        fail: fail,
        complete: complete
    })
}
function rto(page, success, fail, complete) {
    wx.redirectTo({
        url: page,
        success: success,
        fail: fail,
        complete: complete
    })
}
module.exports = {
    StorageUtils: StorageUtils,
    showToast: showToast,
    request: request,
    back: back,
    to: to,
    rto: rto
}