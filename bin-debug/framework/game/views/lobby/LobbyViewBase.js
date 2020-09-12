var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var LobbyViewBase = (function (_super) {
    __extends(LobbyViewBase, _super);
    function LobbyViewBase() {
        return _super.call(this) || this;
    }
    LobbyViewBase.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    };
    /**
     * 显示
     */
    LobbyViewBase.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        this.getAdData();
    };
    LobbyViewBase.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this, event);
    };
    /**
     * 获取广告信息
     * http://192.168.1.232:8090/pages/viewpage.action?pageId=17924769
     */
    LobbyViewBase.prototype.getAdData = function () {
        var self = this;
        var userId = UserManager.getInstance().getUid();
        Api.get(Api.GET_JUMP_INFO + ("?appId=" + GameConfig.appid + "&channel=" + GameConfig.channelId + "&userId=" + userId)).then(function (data) {
            console.info("广告信息", data);
            self.dealAd(data.data);
        });
    };
    LobbyViewBase.prototype.dealAd = function (data) {
        if (!this._adIcon) {
            this._adIcon = new eui.Image(data.icon);
        }
        this._adIcon.left = 0;
        this._adIcon.bottom = 200;
        this.addChild(this._adIcon);
        this._adIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // wx.navigateToMiniProgram({
            // 	appId: data.mAppid,
            // 	path: data.transParam,
            // 	extraData: {}
            // })
        }, this);
    };
    LobbyViewBase.prototype.goGameHandler = function (evt) {
        GlobalManager.getInstance().goGame();
    };
    LobbyViewBase.prototype.rankHandler = function (evt) {
    };
    //分享
    LobbyViewBase.prototype.shareHandler = function (evt) {
        // WxKit.ZGSDKShare("LobbyViewBase", "m_share_btn", "share", "base");
    };
    LobbyViewBase.prototype.release = function () {
        _super.prototype.release.call(this);
    };
    return LobbyViewBase;
}(core.EUIComponent));
__reflect(LobbyViewBase.prototype, "LobbyViewBase");
