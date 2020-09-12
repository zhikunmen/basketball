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
var RebornBaseView = (function (_super) {
    __extends(RebornBaseView, _super);
    function RebornBaseView() {
        var _this = _super.call(this) || this;
        _this._isEnable = true;
        _this.skinName = "resource/assets/exml/RebornViewExml.exml";
        return _this;
    }
    RebornBaseView.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        this.m_content.text = LanguageManager.instance.getLangeuage(24);
        this._isEnable = true;
    };
    RebornBaseView.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this, event);
    };
    /**
     * 添加监听
     */
    RebornBaseView.prototype.addListener = function () {
        _super.prototype.addListener.call(this);
        this.m_reborn_btn && this.m_reborn_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rebornHandler, this);
        this.m_pass_btn && this.m_pass_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.passHandler, this);
    };
    /**
     * 删除监听
     */
    RebornBaseView.prototype.removeListener = function () {
        _super.prototype.removeListener.call(this);
        this.m_reborn_btn && this.m_reborn_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rebornHandler, this);
        this.m_pass_btn && this.m_pass_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.passHandler, this);
    };
    RebornBaseView.prototype.rebornHandler = function (evt) {
        var _this = this;
        if (!this._isEnable) {
            return;
        }
        this._isEnable = false;
        EventUtils.logEvent("click_reborn");
        var successCallback = function () {
            GameManager.getInstance().rebornCount -= 1;
            egret.setTimeout(function () {
                _this.removeFromParent();
                GameManager.getInstance().baskectBallManager.reborn();
            }, _this, 300);
            SoundMgr.getInstance().playBGM();
        };
        var failCallback = function () {
            _this._isEnable = true;
            SoundMgr.getInstance().playBGM();
        };
        AdManager.showRewardedVideoAd(successCallback, failCallback);
        SoundMgr.getInstance().stopBGM();
    };
    //点击跳过
    RebornBaseView.prototype.passHandler = function (evt) {
        EventUtils.logEvent("click_skipReborn");
        this.removeFromParent();
        core.ResUtils.loadGroups(["result"], function (progress) {
        }, function (fail) {
        }, function (loadComplete) {
            var resultView = new ResultDialog();
            resultView.popUp();
        }, this);
    };
    /**
     * 点击空白处是否关闭
     */
    RebornBaseView.prototype.touchDarkEnable = function () {
        return false;
    };
    return RebornBaseView;
}(DialogBaseView));
__reflect(RebornBaseView.prototype, "RebornBaseView");
