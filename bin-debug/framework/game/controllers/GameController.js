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
var GameController = (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        return _super.call(this, ModuleEnum.GAME) || this;
    }
    GameController.prototype.show = function (data) {
        _super.prototype.show.call(this, data);
        this.startTick();
    };
    GameController.prototype.hide = function () {
        _super.prototype.hide.call(this);
        this.release();
    };
    GameController.prototype.startTick = function () {
        egret.startTick(this.onDragonBonesTick, egret.MainContext.instance.stage);
    };
    GameController.prototype.onDragonBonesTick = function (timeStamp) {
        if (typeof (dragonBones) === "undefined")
            return false;
        dragonBones["WorldClock"]["clock"].advanceTime(-1);
        if (egret.Capabilities.engineVersion < "5.0") {
            return true;
        }
        else {
            return false;
        }
    };
    ;
    return GameController;
}(GameControllerBase));
__reflect(GameController.prototype, "GameController");
