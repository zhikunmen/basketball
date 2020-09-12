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
var EndlessRebornDialog = (function (_super) {
    __extends(EndlessRebornDialog, _super);
    function EndlessRebornDialog() {
        var _this = _super.call(this) || this;
        _this._isEnable = true;
        _this.skinName = "resource/assets/exml/EndlessRebornView.exml";
        return _this;
    }
    EndlessRebornDialog.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        this.m_content.text = LanguageManager.instance.getLangeuage(23);
        this._isEnable = true;
    };
    EndlessRebornDialog.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this, event);
    };
    /**
     * 添加监听
     */
    EndlessRebornDialog.prototype.addListener = function () {
        _super.prototype.addListener.call(this);
        this.m_reborn_btn && this.m_reborn_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rebornHandler, this);
        this.m_pass_btn && this.m_pass_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.passHandler, this);
    };
    /**
     * 删除监听
     */
    EndlessRebornDialog.prototype.removeListener = function () {
        _super.prototype.removeListener.call(this);
        this.m_reborn_btn && this.m_reborn_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rebornHandler, this);
        this.m_pass_btn && this.m_pass_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.passHandler, this);
    };
    EndlessRebornDialog.prototype.rebornHandler = function (evt) {
        var _this = this;
        if (!this._isEnable) {
            return;
        }
        this._isEnable = false;
        EventUtils.logEvent("click_endeless_reborn");
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
    EndlessRebornDialog.prototype.passHandler = function (evt) {
        EventUtils.logEvent("click_endless_skipReborn");
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
    EndlessRebornDialog.prototype.touchDarkEnable = function () {
        return false;
    };
    return EndlessRebornDialog;
}(DialogBaseView));
__reflect(EndlessRebornDialog.prototype, "EndlessRebornDialog");
