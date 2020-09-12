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
    var ModuleEventData = (function (_super) {
        __extends(ModuleEventData, _super);
        function ModuleEventData(messageID, moduleEnum, data) {
            var _this = _super.call(this, messageID, data) || this;
            _this.moduleEnum = moduleEnum;
            return _this;
        }
        return ModuleEventData;
    }(core.EventData));
    core.ModuleEventData = ModuleEventData;
    __reflect(ModuleEventData.prototype, "core.ModuleEventData");
})(core || (core = {}));
