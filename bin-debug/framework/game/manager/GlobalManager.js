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
var GlobalManager = (function (_super) {
    __extends(GlobalManager, _super);
    function GlobalManager() {
        var _this = _super.call(this) || this;
        _this.where = WhereEnum.LOGIN;
        return _this;
    }
    GlobalManager.getInstance = function () {
        if (GlobalManager.s_instance == null) {
            GlobalManager.s_instance = new GlobalManager();
        }
        return GlobalManager.s_instance;
    };
    /**
     * 走大厅
     */
    GlobalManager.prototype.goLobby = function () {
        this.hideAll();
        //清除所有弹窗
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChildren();
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_SHOW, ModuleEnum.MAINUI));
        this.where = WhereEnum.LOBBY;
    };
    /**
     * 走游戏
     */
    GlobalManager.prototype.goGame = function () {
        this.hideAll();
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_SHOW, ModuleEnum.GAME));
        this.where = WhereEnum.GAME;
    };
    /**
     * 走登录页面
     */
    GlobalManager.prototype.goLogin = function () {
        this.hideAll();
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_SHOW, ModuleEnum.LOGIN));
        this.where = WhereEnum.LOGIN;
    };
    GlobalManager.prototype.hideAll = function () {
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_HIDE, ModuleEnum.LOGIN));
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_HIDE, ModuleEnum.MAINUI));
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_HIDE, ModuleEnum.GAME));
    };
    return GlobalManager;
}(egret.EventDispatcher));
__reflect(GlobalManager.prototype, "GlobalManager");
