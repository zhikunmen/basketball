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
var core;
(function (core) {
    /**
     * EUIComponent为EUI容器组件，该容器自动关注添加到舞台和从舞台移除事件
     *
     */
    var EUIComponent = (function (_super) {
        __extends(EUIComponent, _super);
        function EUIComponent() {
            var _this = _super.call(this) || this;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onShow, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onHide, _this);
            return _this;
        }
        /**
         * 显示
         */
        EUIComponent.prototype.onShow = function (event) {
            this.addListener();
        };
        EUIComponent.prototype.onHide = function (event) {
            this.removeListener();
            this.release();
        };
        /**
         * 添加监听
         */
        EUIComponent.prototype.addListener = function () {
        };
        /**
         * 删除监听
         */
        EUIComponent.prototype.removeListener = function () {
        };
        /**
         * 释放资源
         */
        EUIComponent.prototype.release = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        return EUIComponent;
    }(eui.Component));
    core.EUIComponent = EUIComponent;
    __reflect(EUIComponent.prototype, "core.EUIComponent", ["core.IComponent"]);
})(core || (core = {}));
