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
var LobbyLayer = (function (_super) {
    __extends(LobbyLayer, _super);
    function LobbyLayer() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    LobbyLayer.prototype.init = function () {
        this._lobbyView = new LobbyView();
        this.addChild(this._lobbyView);
    };
    LobbyLayer.prototype.release = function () {
        _super.prototype.release.call(this);
        this._lobbyView = null;
    };
    return LobbyLayer;
}(core.EUILayer));
__reflect(LobbyLayer.prototype, "LobbyLayer");
