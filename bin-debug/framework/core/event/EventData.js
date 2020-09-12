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
    var EventData = (function (_super) {
        __extends(EventData, _super);
        function EventData(messageID, messageData) {
            var _this = _super.call(this) || this;
            _this.messageID = messageID;
            _this.messageData = messageData;
            return _this;
        }
        return EventData;
    }(egret.HashObject));
    core.EventData = EventData;
    __reflect(EventData.prototype, "core.EventData", ["core.IMessage"]);
})(core || (core = {}));
