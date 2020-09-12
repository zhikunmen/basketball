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
var HelpDialog = (function (_super) {
    __extends(HelpDialog, _super);
    function HelpDialog() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/assets/exml/HelpView.exml";
        _this.top = _this.bottom = _this.left = _this.right = 0;
        return _this;
    }
    HelpDialog.prototype.addListeners = function () {
        this.m_help_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
    };
    HelpDialog.prototype.removeListeners = function () {
        this.m_help_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
    };
    HelpDialog.prototype.closeDialog = function () {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            this.removeListeners();
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
        GameManager.getInstance().resumeGame();
    };
    HelpDialog.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        GameManager.getInstance().pauseGame();
        this.title_info.text = LanguageManager.instance.getLangeuage(3);
        this.m_content1.text = LanguageManager.instance.getLangeuage(4);
        this.m_content2.text = LanguageManager.instance.getLangeuage(5);
        this.m_help_group.scaleX = 0.5;
        this.m_help_group.scaleY = 0.5;
        egret.Tween.get(this.m_help_group).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut);
    };
    HelpDialog.prototype.touchDarkEnable = function () {
        return true;
    };
    HelpDialog.prototype.popUp = function () {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
        this.addListeners();
    };
    return HelpDialog;
}(core.EUIComponent));
__reflect(HelpDialog.prototype, "HelpDialog");
