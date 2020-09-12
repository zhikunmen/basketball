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
 * dat.gui
 */
var core;
(function (core) {
    var DatGuiUtil = (function (_super) {
        __extends(DatGuiUtil, _super);
        function DatGuiUtil() {
            var _this = _super.call(this) || this;
            _this.gui = new dat.GUI();
            return _this;
        }
        DatGuiUtil.getInstance = function () {
            if (DatGuiUtil.s_instance == null) {
                DatGuiUtil.s_instance = new DatGuiUtil();
            }
            return DatGuiUtil.s_instance;
        };
        DatGuiUtil.prototype.addItem = function (itemName, val) {
            this[itemName] = Number(val);
            var controller = this.gui.add(this, itemName).min(-20).max(20).step(0.1);
            ;
            var self = this;
            controller.onChange(function (value) {
                self.dispatchEventWith(DatGuiUtil.DAT_GUI_CHANGE, false, { name: itemName, val: value });
            });
            controller.onFinishChange(function (value) {
                self.dispatchEventWith(DatGuiUtil.DAT_GUI_FINISH_CHANGE, false, { name: itemName, val: value });
            });
        };
        DatGuiUtil.DAT_GUI_CHANGE = 'dat.gui_change';
        DatGuiUtil.DAT_GUI_FINISH_CHANGE = 'dat.gui_finish_change';
        return DatGuiUtil;
    }(egret.EventDispatcher));
    core.DatGuiUtil = DatGuiUtil;
    __reflect(DatGuiUtil.prototype, "core.DatGuiUtil");
})(core || (core = {}));
