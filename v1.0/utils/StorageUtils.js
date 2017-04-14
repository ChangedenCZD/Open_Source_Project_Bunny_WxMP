//LocalStorage 工具类
/**写入 */
function set(key, value) {
    wx.setStorageSync(key, value);
}
/**获取 */
function get(key, defaultValue) {
    let value = wx.getStorageSync(key);
    return value ? value : defaultValue;
}
/**移除 */
function rm(key) {
    wx.removeStorageSync(key);
}
/**清空 */
function clr() {
    wx.clearStorageSync();
}

module.exports = {
    set: set,
    get: get,
    rm: rm,
    clr: clr,
}