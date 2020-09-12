var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Facebook = (function () {
    function Facebook() {
        this.globalRankList = new Array(); //全球排行榜
        this.friendRankList = new Array(); //好友排行榜
    }
    /**
     * 初始化
     */
    Facebook.init = function () {
        if (Facebook.isFBInit()) {
            Facebook.FBPlatformInfo = new FacebookContextId();
            Facebook.supportApi = FBInstant.getSupportedAPIs();
            // Facebook.FBPropAd = new FacebookRewardedVideoAd("974171789613772_974174142946870", "Prop");
            // Facebook.FBTrasureChestAd = new FacebookRewardedVideoAd("974171789613772_981702192194065", "TrasureChest");
            Facebook.FBPropAd = new FacebookRewardedVideoAd("406768563375011_406771486708052", "Prop");
            Facebook.FBTrasureChestAd = new FacebookRewardedVideoAd("406768563375011_406771876708013", "TrasureChest");
        }
    };
    /**
     * 是否是facebook平台
     */
    Facebook.isFBInit = function () {
        if (typeof FBInstant === 'undefined') {
            egret.warn("FBInstant is undefined");
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * api是否支持
     */
    Facebook.IsApiSupport = function (apiName) {
        if (!Facebook.isFBInit()) {
            return;
        }
        if (Facebook.supportApi.indexOf(apiName) != -1) {
            return true;
        }
        else {
            egret.warn("Unsupport API:", apiName);
            return false;
        }
    };
    //发送分析log
    Facebook.logEvent = function (eventName, valueToSum, parameters) {
        if (!Facebook.IsApiSupport("logEvent")) {
            return;
        }
        FBInstant.logEvent(eventName, valueToSum, parameters);
    };
    return Facebook;
}());
__reflect(Facebook.prototype, "Facebook");
