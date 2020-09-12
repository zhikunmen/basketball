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
var GameManager = (function (_super) {
    __extends(GameManager, _super);
    function GameManager() {
        var _this = _super.call(this) || this;
        //复活次数
        _this.rebornCount = 1;
        _this.scoreManager = new ScoreManager();
        _this.baskectBallManager = new BaskectBallManager();
        return _this;
    }
    GameManager.getInstance = function () {
        if (GameManager.s_instance == null) {
            GameManager.s_instance = new GameManager();
        }
        return GameManager.s_instance;
    };
    /**
     * 暂停游戏
     */
    GameManager.prototype.pauseGame = function () {
        this.dispatchEvent(new egret.Event(GameManager.PAUSE_GAME));
    };
    /**
     * 恢复游戏
     */
    GameManager.prototype.resumeGame = function () {
        this.dispatchEvent(new egret.Event(GameManager.RESUME_GAME));
    };
    /**
     * 游戏结束
     */
    GameManager.prototype.gameover = function () {
        this.dispatchEvent(new egret.Event(GameManager.GAME_OVER));
    };
    /**
     * 重新开始
     */
    GameManager.prototype.restart = function () {
        this.dispatchEvent(new egret.Event(GameManager.RESTART_GAME));
    };
    /**
     * 复活
     */
    GameManager.prototype.revive = function () {
        this.dispatchEvent(new egret.Event(GameManager.GAME_REVIVE));
    };
    /**
     *
     */
    GameManager.prototype.refreshGold = function (gold) {
        this.dispatchEvent(new egret.Event(GameManager.REFRESH_GOLD));
    };
    GameManager.prototype.updateRankComplete = function () {
        this.dispatchEvent(new egret.Event(GameManager.REFRESH_RANK));
    };
    /**
     * 暂停游戏
     */
    GameManager.PAUSE_GAME = "pause_game";
    /**
    * 恢复游戏
    */
    GameManager.RESUME_GAME = "resume_game";
    /**
     * 重新开始游戏
     */
    GameManager.RESTART_GAME = "restart_game";
    /**
     * 游戏结束
     */
    GameManager.GAME_OVER = "gameover";
    /**
     * 游戏复活
     */
    GameManager.GAME_REVIVE = "revive_game";
    /**
     * 游戏倒计时
     */
    GameManager.GAME_TIME = "game_time";
    /**
     * 游戏Combo进度条
     */
    GameManager.GAME_COMBO_PROGRESS = "game_combo_progress";
    /**
 * 游戏Combo
 */
    GameManager.GAME_COMBO = "game_combo";
    /**
     * 分享到不同的群失败了
     */
    GameManager.SHARE_DIFFRERENTGROUPFAIL = "SHARE_DIFFRERENTGROUPFAIL";
    /**
     *
     */
    GameManager.REFRESH_GOLD = "REFRESH_GOLD";
    /**
     * 排行榜更新
     */
    GameManager.REFRESH_RANK = "REFRESH_RANK";
    return GameManager;
}(egret.EventDispatcher));
__reflect(GameManager.prototype, "GameManager");
