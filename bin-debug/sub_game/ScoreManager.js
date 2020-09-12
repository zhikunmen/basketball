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
var ScoreManager = (function (_super) {
    __extends(ScoreManager, _super);
    function ScoreManager() {
        var _this = _super.call(this) || this;
        /**
         * 当前分数
         */
        _this.totalScore = 0;
        _this.otherScore = 0;
        return _this;
    }
    /**
    * 更新分数
    */
    ScoreManager.prototype.updateScore = function (type, pos) {
        var score = 0;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            score = this.getTimeScore(type);
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            score = this.getEndLesScore(type);
        }
        this.totalScore += score;
        this.dispatchEventWith(ScoreManager.UPDATE_SCORE, false, { score: score, pos: pos });
        game.BattleManager.instance.sendDragMessage(score);
    };
    ScoreManager.prototype.getTimeScore = function (type) {
        var score = 0;
        var baskectBallManager = GameManager.getInstance().baskectBallManager;
        switch (type) {
            case "highShot":
                score += 3;
                break;
            case "yashao":
                score += 5;
                break;
            case "kongxin":
                score += 2;
                break;
            case "bank":
                score += 2;
                break;
            case "null":
                score += 1;
                break;
        }
        if (baskectBallManager.isLightMode()) {
            score += 2;
        }
        else if (baskectBallManager.isFireMode()) {
            score += 1;
        }
        return score;
    };
    ScoreManager.prototype.getEndLesScore = function (type) {
        var combo = GameManager.getInstance().baskectBallManager.endlessCombo;
        var score = 0;
        if (type == "null") {
            score = 1;
        }
        else {
            score = combo;
        }
        return score;
    };
    ScoreManager.prototype.reset = function () {
        this.totalScore = 0;
        this.otherScore = 0;
    };
    ScoreManager.prototype.updateOtherScore = function (score) {
        this.otherScore += score;
        this.dispatchEventWith(BattleEventConst.UPDATE_OTHER_SCORE, false, this.otherScore);
    };
    ScoreManager.UPDATE_SCORE = "update_self_score";
    return ScoreManager;
}(egret.EventDispatcher));
__reflect(ScoreManager.prototype, "ScoreManager");
