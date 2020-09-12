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
var LobbyController = (function (_super) {
    __extends(LobbyController, _super);
    function LobbyController() {
        return _super.call(this, ModuleEnum.MAINUI) || this;
    }
    LobbyController.prototype.getLoadGroup = function (data) {
        return ["delay"];
    };
    LobbyController.prototype.preShow = function (data) {
    };
    LobbyController.prototype.show = function (data) {
        GameManager.getInstance().rebornCount = 1; //回大厅复活次数复位
        if (!this.lobbyLayer) {
            this.lobbyLayer = new LobbyLayer();
        }
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).addChild(this.lobbyLayer);
        // //加载房间素材
        // if (!RES.isGroupLoaded("loading")) {
        //     core.ResUtils.loadGroups(["loading"], (progress) => {
        //     }, (fail) => {
        //     }, (loadComplete) => {
        //     }, self);
        // }
    };
    LobbyController.prototype.hide = function () {
        if (this.lobbyLayer && this.lobbyLayer.parent) {
            this.lobbyLayer.parent.removeChild(this.lobbyLayer);
            this.lobbyLayer = null;
        }
    };
    LobbyController.prototype.release = function () {
        _super.prototype.release.call(this);
    };
    return LobbyController;
}(core.Control));
__reflect(LobbyController.prototype, "LobbyController");
