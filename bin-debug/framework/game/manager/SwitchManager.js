var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SwitchManager = (function () {
    function SwitchManager() {
    }
    Object.defineProperty(SwitchManager, "switchs", {
        set: function (s) {
            for (var i = 0; i < s.length; i++) {
                this[this.keys[s[i].key]] = s[i].switch;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 复活开关 ,分享的开关
     */
    SwitchManager.openborn = 1;
    /**
     * 看视频换成分享开关
     */
    SwitchManager.lookVideoToShare = 0;
    /**
     * 分享到相同的群时间间隔
     */
    SwitchManager.differentTime = 2;
    /**
     * 分享的次数
     */
    SwitchManager.shareTimes = "2_5_8";
    /**
     * 分享换变成视频的概率
     */
    SwitchManager.shareProNum = 30;
    /**
     * 当天看视频次数
     */
    SwitchManager.seeplay = 0;
    /**
     * 是否拉取Banner广告
     */
    SwitchManager.isShowBanner = 1;
    SwitchManager.keys = [
        "openborn",
        "openborn",
        "lookVideoToShare",
        "differentTime",
        "shareTimes",
        "shareProNum",
        "seeplay",
        "isShowBanner"
    ]; //重生开关
    return SwitchManager;
}());
__reflect(SwitchManager.prototype, "SwitchManager");
