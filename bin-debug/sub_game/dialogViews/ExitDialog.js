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
var ExitDialog = (function (_super) {
    __extends(ExitDialog, _super);
    function ExitDialog() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/assets/exml/ExitDialog.exml";
        _this.top = _this.bottom = _this.left = _this.right = 0;
        return _this;
    }
    ExitDialog.prototype.addListener = function () {
        // this.m_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancel, this);
        this.m_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
    };
    ExitDialog.prototype.removeListener = function () {
        // this.m_mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_cancel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.cancel, this);
        this.m_confirm.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
    };
    ExitDialog.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        GameManager.getInstance().pauseGame();
        this.m_message.text = LanguageManager.instance.getLangeuage(21);
        this.m_confirm_label.text = LanguageManager.instance.getLangeuage(22);
        this.m_exit_group.scaleX = 0.5;
        this.m_exit_group.scaleY = 0.5;
        egret.Tween.get(this.m_exit_group).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut);
    };
    ExitDialog.prototype.touchDarkEnable = function () {
        return true;
    };
    ExitDialog.prototype.popUp = function () {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    };
    ExitDialog.prototype.closeDialog = function () {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
        GameManager.getInstance().resumeGame();
    };
    ExitDialog.prototype.cancel = function () {
        this.closeDialog();
    };
    ExitDialog.prototype.confirm = function () {
        this.closeDialog();
        GameManager.getInstance().baskectBallManager.reset();
        GlobalManager.getInstance().goLobby();
    };
    return ExitDialog;
}(core.EUIComponent));
__reflect(ExitDialog.prototype, "ExitDialog");
