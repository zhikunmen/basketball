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
/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-03
 * Desc   ： 游戏界面视图
 ********************************/
var MatterWalls = (function (_super) {
    __extends(MatterWalls, _super);
    function MatterWalls() {
        return _super.call(this) || this;
    }
    MatterWalls.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    };
    /**
     * 显示
     */
    MatterWalls.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this);
        //加200是为了出边界的时候y值还有
        this.bottomWall = core.MatterUtil.addOneBox((GameConfig.curWidth()) / 2, GameConfig.curHeight() - 100, (GameConfig.curWidth() + 1000), 250, 0);
        this.bottomWall.label = "background";
        // core.MatterUtil.addOneBox(GameConfig.curWidth() /2,0,GameConfig.curWidth(),30,0);
    };
    MatterWalls.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this);
    };
    /**
     * 添加监听
     */
    MatterWalls.prototype.addListener = function () {
    };
    /**
     * 删除监听
     */
    MatterWalls.prototype.removeListener = function () {
    };
    MatterWalls.prototype.release = function () {
        _super.prototype.release.call(this);
    };
    return MatterWalls;
}(core.EUIComponent));
__reflect(MatterWalls.prototype, "MatterWalls");
