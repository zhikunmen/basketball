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
/**
* alert类
* 提示相关信息
*/
var AlertPanel = (function (_super) {
    __extends(AlertPanel, _super);
    /**
    * descStr        描述
    */
    function AlertPanel(descStr, type, resolve, reject, thisObject) {
        if (descStr === void 0) { descStr = ""; }
        var _this = _super.call(this) || this;
        _this._descStr = "";
        _this._descStr = descStr;
        _this._type = type;
        _this._resolve = resolve;
        _this._reject = reject;
        _this._thisObject = thisObject;
        _this.skinName = "";
        _this.m_desc.textFlow = (new egret.HtmlTextParser).parser(_this._descStr);
        return _this;
    }
    ;
    /**
     * 显示
     */
    AlertPanel.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this);
        this.left = this.right = this.top = this.bottom = 0;
        if (this._type == 1) {
            this.m_reject.visible = false;
            this.m_resolve.horizontalCenter = 0;
        }
    };
    /**
     * 添加监听
     */
    AlertPanel.prototype.addListener = function () {
        _super.prototype.addListener.call(this);
        this.m_resolve.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resolveHander, this);
        this.m_reject.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rejectHandler, this);
    };
    AlertPanel.prototype.resolveHander = function (evt) {
        this.removeFromParent(0);
        this._resolve.apply(this._thisObject);
    };
    AlertPanel.prototype.rejectHandler = function (evt) {
        this.removeFromParent(0);
        this._reject.apply(this._thisObject);
    };
    /**
     * 删除监听
     */
    AlertPanel.prototype.removeListener = function () {
        _super.prototype.removeListener.call(this);
    };
    AlertPanel.prototype.release = function () {
        this.removeChildren();
    };
    return AlertPanel;
}(DialogBaseView));
__reflect(AlertPanel.prototype, "AlertPanel");
