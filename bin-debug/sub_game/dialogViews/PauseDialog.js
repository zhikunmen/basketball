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
var PauseDialog = (function (_super) {
    __extends(PauseDialog, _super);
    function PauseDialog() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/assets/exml/PauseView.exml";
        _this.top = _this.bottom = _this.left = _this.right = 0;
        return _this;
    }
    PauseDialog.prototype.addListener = function () {
        this.m_game_continue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancel, this);
        this.m_game_home.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
    };
    PauseDialog.prototype.removeListener = function () {
        this.m_game_continue.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.cancel, this);
        this.m_game_home.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
    };
    PauseDialog.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        GameManager.getInstance().pauseGame();
    };
    PauseDialog.prototype.touchDarkEnable = function () {
        return true;
    };
    PauseDialog.prototype.popUp = function () {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    };
    PauseDialog.prototype.closeDialog = function () {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
        GameManager.getInstance().resumeGame();
    };
    PauseDialog.prototype.cancel = function () {
        this.closeDialog();
    };
    PauseDialog.prototype.confirm = function () {
        this.closeDialog();
        GameManager.getInstance().baskectBallManager.reset();
        GlobalManager.getInstance().goLobby();
    };
    return PauseDialog;
}(core.EUIComponent));
__reflect(PauseDialog.prototype, "PauseDialog");
