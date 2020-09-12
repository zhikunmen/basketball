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
var SkinDialog = (function (_super) {
    __extends(SkinDialog, _super);
    function SkinDialog() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/assets/exml/SkinView.exml";
        _this.top = _this.bottom = _this.left = _this.right = 0;
        return _this;
    }
    SkinDialog.prototype.addListener = function () {
        this.m_skin_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_ball_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_hoop_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_basket_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
    };
    SkinDialog.prototype.removeListener = function () {
        this.m_skin_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_ball_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_hoop_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_basket_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
    };
    SkinDialog.prototype.closeDialog = function () {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
        GameManager.getInstance().resumeGame();
    };
    SkinDialog.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
    };
    SkinDialog.prototype.touchDarkEnable = function () {
        return true;
    };
    SkinDialog.prototype.popUp = function () {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    };
    SkinDialog.prototype.switchTab = function (evt) {
        if (evt.target == this.m_ball_tab) {
            egret.log(1);
        }
        else if (evt.target == this.m_ball_tab) {
            egret.log(2);
        }
        else {
            egret.log(3);
        }
    };
    return SkinDialog;
}(core.EUIComponent));
__reflect(SkinDialog.prototype, "SkinDialog");
