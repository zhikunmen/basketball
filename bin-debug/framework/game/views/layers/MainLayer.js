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
var MainLayer = (function (_super) {
    __extends(MainLayer, _super);
    function MainLayer() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    MainLayer.prototype.init = function () {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this.scoreView = new ScoreView();
            this.addChild(this.scoreView);
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            this.endlessScore = new EndlessScore();
            this.addChild(this.endlessScore);
        }
        this.girl = new Girl();
        this.addChild(this.girl);
        this.girl.x = GameConfig.curWidth() / 2;
        this.girl.y = GameConfig.curHeight() - 620;
        this.main = new MainView();
        this.addChild(this.main);
    };
    MainLayer.prototype.release = function () {
        _super.prototype.release.call(this);
        this.main = null;
        this.scoreView = null;
        this.girl = null;
    };
    return MainLayer;
}(core.EUILayer));
__reflect(MainLayer.prototype, "MainLayer");
