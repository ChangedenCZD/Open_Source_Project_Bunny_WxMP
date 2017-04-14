/**检查并获取OpenId */
var StorageUtils = require('StorageUtils');
let OPEN_ID_KEY = 'openId';
let USER_ID_KEY = 'userId';
function get() {
    return StorageUtils.get(OPEN_ID_KEY);
}
function set(openId) {
    return StorageUtils.set(OPEN_ID_KEY, openId);
}
function getUserid() {
    return StorageUtils.get(USER_ID_KEY);
}
function setUserid(userid) {
    return StorageUtils.set(USER_ID_KEY, userid);
}
module.exports = {
    StorageUtils: StorageUtils,
    get: get,
    set: set,
    getUserid: getUserid,
    setUserid: setUserid,
    OPEN_ID_KEY: OPEN_ID_KEY,
    USER_ID_KEY: USER_ID_KEY
}