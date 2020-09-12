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
var GameControllerBase = (function (_super) {
    __extends(GameControllerBase, _super);
    function GameControllerBase(moduleName) {
        var _this = _super.call(this, moduleName) || this;
        _this.m_gameManager = GameManager.getInstance();
        return _this;
    }
    GameControllerBase.prototype.getLoadGroup = function (data) {
        // return ["delay"];
        return [];
    };
    GameControllerBase.prototype.preShow = function (data) {
    };
    GameControllerBase.prototype.show = function (data) {
        core.EventCenter.getInstance().addEventListener(core.EventID.SOCKET_CONNECT, this.sockectConnectHandler, this);
        core.EventCenter.getInstance().addEventListener(core.EventID.SOCKET_DATA, this.roomSockectDataHandler, this);
        if (!this.m_pMainLayer) {
            var mainLayer = new MainLayer();
            this.m_pMainLayer = mainLayer;
        }
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).addChild(this.m_pMainLayer);
    };
    GameControllerBase.prototype.hide = function () {
        core.EventCenter.getInstance().removeEventListener(core.EventID.SOCKET_CONNECT, this.sockectConnectHandler, this);
        core.EventCenter.getInstance().removeEventListener(core.EventID.SOCKET_DATA, this.roomSockectDataHandler, this);
        if (this.m_pMainLayer && this.m_pMainLayer.parent) {
            this.m_pMainLayer.release();
            this.m_pMainLayer.parent.removeChild(this.m_pMainLayer);
            this.m_pMainLayer = null;
        }
    };
    GameControllerBase.prototype.release = function () {
    };
    /**
     * 连接成功
     */
    GameControllerBase.prototype.sockectConnectHandler = function (data) {
    };
    /**
     * 收到socket数据
     */
    GameControllerBase.prototype.roomSockectDataHandler = function (ed) {
    };
    return GameControllerBase;
}(core.Control));
__reflect(GameControllerBase.prototype, "GameControllerBase");
