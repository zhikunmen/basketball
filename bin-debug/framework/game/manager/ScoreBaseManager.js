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
var ScoreBaseManager = (function (_super) {
    __extends(ScoreBaseManager, _super);
    function ScoreBaseManager() {
        var _this = _super.call(this) || this;
        /**
         * 当前分数
         */
        _this.totalScore = 0;
        return _this;
    }
    /**
    * 更新分数
    */
    ScoreBaseManager.prototype.updateScore = function (type, pos) {
    };
    ScoreBaseManager.prototype.reset = function () {
        this.totalScore = 0;
    };
    ScoreBaseManager.UPDATE_SCORE = "update_score";
    return ScoreBaseManager;
}(egret.EventDispatcher));
__reflect(ScoreBaseManager.prototype, "ScoreBaseManager");
