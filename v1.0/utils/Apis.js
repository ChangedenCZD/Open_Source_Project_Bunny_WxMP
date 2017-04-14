/**导包 */
let OpenIdUtils = require('OpenIdUtils');
let StorageUtils = OpenIdUtils.StorageUtils;
/**常量 */
let isTest = false;
let APP_NAME = 'bunny';
let DOMAIN = '自己的安全域名';

let PATH_ROOT = {
    wechat: 'wechat/',
    mp: 'wechat/mp/',
    upload: 'files/upload'
};
/**变量 */
function getUrl(path) {
    return DOMAIN + (isTest ? 'dev/' : '') + path;
}
function openId() {
    return OpenIdUtils.get();
}
function api(url, data, method) {
    return {
        url: getUrl(url),
        data: data ? data : {},
        method: method
    }
}
module.exports = {
    checkResult: (result) => {
        wx.hideToast();
        var mResult = (result && 0 === result.code) || (result.data && 0 === result.data.code);
        if (!mResult) {
            var message = result.message;
            if (!message) {
                message = result.data.message;
            }
            if (message) {
                wx.showToast({
                    title: message,
                    icon: 'success',
                    duration: 1500
                });
            }
        }
        return mResult;
    },
    openId: (code) => {/**获取openId */
        var url = PATH_ROOT.mp + 'openid/' + APP_NAME + '/' + code;
        return new api(url, {}, 'GET');
    },
    reg: () => {//注册
        return new api(PATH_ROOT.mp + 'user/' + openId(), {}, 'GET');
    },
    updateUserInfo: (userid) => {
        let userInfo = StorageUtils.get('wxUserInfo', {}).userInfo || {};
        return new api(PATH_ROOT.mp + 'user/id/' + userid, userInfo, 'PUT');
    },
    uploadFile: (userid) => {
        return new api(PATH_ROOT.upload, { userid: userid }, 'POST');
    },
    publish: (userid, desc, images, isPub) => {
        return new api(PATH_ROOT.mp + 'post/' + userid, { images: images, desc: desc, pub: isPub ? 1 : 0 }, 'PUT');
    },
    postList: (userid, page, size) => {
        let selfid = getUserid();
        return new api(
            PATH_ROOT.mp + 'post/list?page=' + (page || 1) + '&size=' + (size || 20) + '&userid=' + (userid || '') + '&selfid=' + selfid,
            {}, 'GET');
    },
    like: (postid) => {
        return new api(
            PATH_ROOT.mp + 'post/like/' + postid + '/' + getUserid(), {}, 'PUT'
        )
    },
    unLike: (postid) => {
        return new api(
            PATH_ROOT.mp + 'post/like/' + postid + '/' + getUserid(), {}, 'DELETE'
        )
    },
    favorites: (postid) => {
        return new api(
            PATH_ROOT.mp + 'post/favorites/' + postid + '/' + getUserid(), {}, 'PUT'
        )
    },
    unFavorites: (postid) => {
        return new api(
            PATH_ROOT.mp + 'post/favorites/' + postid + '/' + getUserid(), {}, 'DELETE'
        )
    },
    follow: (targetid) => {
        return new api(
            PATH_ROOT.mp + 'post/follow/' + targetid + '/' + getUserid(), {}, 'PUT'
        )
    },
    unFollow: (targetid) => {
        return new api(
            PATH_ROOT.mp + 'post/follow/' + targetid + '/' + getUserid(), {}, 'DELETE'
        )
    },
    followList: (userid) => {
        return new api(PATH_ROOT.mp + userid + '/follow', {}, 'GET');
    },
    profile: (userid) => {
        return new api(PATH_ROOT.mp + userid + '/profile', {}, 'GET');
    }
}
function getUserid() {
    return StorageUtils.get('userId', openId());
}