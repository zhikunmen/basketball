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
var BaskectBallManager = (function (_super) {
    __extends(BaskectBallManager, _super);
    function BaskectBallManager() {
        var _this = _super.call(this) || this;
        /**
         * 当前篮筐的方向
         */
        _this._curSide = "right"; //"left"
        /**
         * 显示的篮筐
         */
        _this._curPos = [3];
        /**
         * 投篮倒计时
         */
        _this.comboTimeout = 10000;
        _this.curRound = 1;
        _this.curCombo = 0;
        _this._skinInfo = ["0"];
        _this._coinsNumber = 0;
        _this._curCoins = 0;
        _this._use = 0;
        _this._rankScore = 0;
        _this.comboTimer = 0;
        _this.maxCombo = 0;
        _this._comboSecond = 0;
        /**
         * 倒计时
         */
        _this._timeoutSecond = BaskectBallManager.TIME;
        _this.tiemoutInterval = 0;
        /**
         * 增加空心
         */
        _this.highShotCount = 0;
        _this.kongxinCount = 0;
        _this.yashaoCount = 0;
        _this.bankCount = 0;
        _this.endlessCombo = 0;
        return _this;
    }
    Object.defineProperty(BaskectBallManager.prototype, "matterScene", {
        get: function () {
            return this._matterScene;
        },
        set: function (m) {
            this._matterScene = m;
        },
        enumerable: true,
        configurable: true
    });
    BaskectBallManager.prototype.generateCurPos = function () {
        if (this.curRound == 1) {
            this._curPos = [3];
        }
        else if (this.curRound <= 3) {
            var index = core.MathUtils.random(1, 3);
            this._curPos = [index];
        }
        else {
            var index = core.MathUtils.random(0, 100);
            if (index < 4) {
                this._curPos = [1, 2, 3];
            }
            else if (index < 12) {
                this._curPos = [1, 2];
            }
            else if (index < 20) {
                this._curPos = [2, 3];
            }
            else if (index < 46) {
                this._curPos = [3];
            }
            else if (index < 73) {
                this._curPos = [2];
            }
            else {
                this._curPos = [1];
            }
        }
    };
    BaskectBallManager.prototype.generateNextPos = function () {
        var pos = core.MathUtils.random(1, 4);
        this._curPos = [];
        this._curPos.push(pos);
    };
    BaskectBallManager.prototype.switchSide = function () {
        this.curRound++;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this.generateCurPos();
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            this.generateNextPos();
        }
        if (this._curSide == "right") {
            this._curSide = "left";
        }
        else {
            this._curSide = "right";
        }
        // this.dispatchEvent(new egret.Event(BaskectBallManager.SWITCH_SIDE))
        return this._curSide;
    };
    Object.defineProperty(BaskectBallManager.prototype, "curSide", {
        get: function () {
            return this._curSide;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaskectBallManager.prototype, "curPos", {
        get: function () {
            return this._curPos;
        },
        enumerable: true,
        configurable: true
    });
    BaskectBallManager.prototype.startCombTimer = function (isResume) {
        var _this = this;
        if (isResume === void 0) { isResume = false; }
        if (!isResume) {
            this.curCombo++;
            if (this.curCombo > this.maxCombo) {
                this.maxCombo = this.curCombo - 1;
            }
            this.calcShotTime();
            this._comboSecond = this.comboTimeout;
        }
        this.dispatchEventWith(GameManager.GAME_COMBO, false, { round: this.curCombo });
        var flagTimestamp = this._matterScene.engine.timing.timestamp;
        egret.clearInterval(this.comboTimer);
        this.comboTimer = egret.setInterval(function () {
            _this._comboSecond -= (_this._matterScene.engine.timing.timestamp - flagTimestamp);
            var percent = _this._comboSecond / _this.comboTimeout;
            _this.dispatchEventWith(GameManager.GAME_COMBO_PROGRESS, false, { percent: percent, round: _this.curCombo });
            flagTimestamp = _this._matterScene.engine.timing.timestamp;
            if (percent <= 0) {
                _this.curCombo = 0;
                egret.clearInterval(_this.comboTimer);
                _this.dispatchEvent(new egret.Event(BaskectBallManager.COMPLETE_COMBO));
            }
        }, this, 16);
    };
    BaskectBallManager.prototype.startTimeout = function () {
        var _this = this;
        this.dispatchEvent(new egret.Event(BaskectBallManager.START_TIMEOUT));
        this.dispatchEventWith(GameManager.GAME_TIME, false, { time: this._timeoutSecond });
        var flagTimestamp = this._matterScene.engine.timing.timestamp;
        egret.clearInterval(this.tiemoutInterval);
        this.tiemoutInterval = egret.setInterval(function () {
            _this._timeoutSecond--;
            _this.dispatchEventWith(GameManager.GAME_TIME, false, { time: _this._timeoutSecond });
            flagTimestamp = _this._matterScene.engine.timing.timestamp;
            if (_this._timeoutSecond <= 10) {
                SoundMgr.getInstance().daojishi(_this._timeoutSecond);
            }
            if (_this._timeoutSecond <= 0) {
                egret.clearInterval(_this.tiemoutInterval);
                egret.clearInterval(_this.comboTimer);
                _this.dispatchEvent(new egret.Event(BaskectBallManager.COMPLETE_COMBO));
            }
            _this.updateRobotScore();
        }, this, 1000);
    };
    BaskectBallManager.prototype.updateRobotScore = function () {
        if (PlatfromUtil.getPlatformEnum() != PlatfromEnum.GMBOX) {
            return;
        }
        var otherUserInfo = BatterInfo.instance.otherUserInfo;
        if (otherUserInfo && otherUserInfo.type == 0) {
            return;
        }
        var level = otherUserInfo ? otherUserInfo.aiRank : 1;
        if (this._timeoutSecond % 2 == 1) {
            return;
        }
        var score = 0;
        if (level == 1) {
            score = this.getRobotScoreLevel1();
        }
        else if (level == 2) {
            score = this.getRobotScoreLevel2();
        }
        else if (level == 3) {
            score = this.getRobotScoreLevel3();
        }
        else if (level == 4) {
            score = this.getRobotScoreLevel4();
        }
        else {
            score = this.getRobotScoreLevel5();
        }
        if (score > 0) {
            GameManager.getInstance().scoreManager.updateOtherScore(score);
        }
    };
    /**
     * 1级别的机器人，平均得分85.5分；
     * 前10秒，33.3%概率得0分，33.3%概率1分，33.3%概率2分：1.0 * 5
     * 后80秒，60%概率得1分，10%概率得2,3,4,5分：2.0 * 40
     * 10%的概率得压哨球的5分:0.1 * 5
     */
    BaskectBallManager.prototype.getRobotScoreLevel1 = function () {
        var score = 0;
        if (this._timeoutSecond == 0) {
            var index = core.MathUtils.random(0, 10);
            if (index == 5) {
                score = 5;
            }
        }
        if (this._timeoutSecond >= 80) {
            var index = core.MathUtils.random(0, 3);
            if (index == 0) {
                score = 0;
            }
            else if (index == 1) {
                score = 1;
            }
            else {
                score = 2;
            }
        }
        else {
            var index = core.MathUtils.random(0, 10);
            if (index < 6) {
                score = 1;
            }
            else if (index == 6) {
                score = 2;
            }
            else if (index == 7) {
                score = 3;
            }
            else if (index == 8) {
                score = 4;
            }
            else if (index == 9) {
                score = 5;
            }
        }
        return score;
    };
    /**
     * 2级别的机器人，平均得分96分；
     * 前10秒，50%概率得1分，50%的概率得2分：1.5 * 5
     * 后80秒，50%概率得1分，10%概率得2分，20%概率得3分，10%概率得4,5分：2.2 * 40
     * 10%的概率得压哨球的5分:0.1 * 5
     */
    BaskectBallManager.prototype.getRobotScoreLevel2 = function () {
        var score = 0;
        if (this._timeoutSecond == 0) {
            var index = core.MathUtils.random(0, 10);
            if (index == 5) {
                score = 5;
            }
        }
        if (this._timeoutSecond >= 80) {
            var index = core.MathUtils.random(0, 2);
            if (index == 0) {
                score = 1;
            }
            else if (index == 1) {
                score = 2;
            }
        }
        else {
            var index = core.MathUtils.random(0, 10);
            if (index < 5) {
                score = 1;
            }
            else if (index == 5) {
                score = 2;
            }
            else if (index < 8) {
                score = 3;
            }
            else if (index == 8) {
                score = 4;
            }
            else if (index == 9) {
                score = 5;
            }
        }
        return score;
    };
    /**
     * 2级别的机器人，平均得分108分；
     * 前10秒，50%概率得1分，50%的概率得2分：1.5 * 5
     * 后80秒，30%概率得1分，20%概率得2分，30%概率得3分，10%概率得4,5分：2.5 * 40
     * 10%的概率得压哨球的5分:0.1 * 5
     */
    BaskectBallManager.prototype.getRobotScoreLevel3 = function () {
        var score = 0;
        if (this._timeoutSecond == 0) {
            var index = core.MathUtils.random(0, 10);
            if (index == 5) {
                score = 5;
            }
        }
        if (this._timeoutSecond >= 80) {
            var index = core.MathUtils.random(0, 2);
            if (index == 0) {
                score = 1;
            }
            else if (index == 1) {
                score = 2;
            }
        }
        else {
            var index = core.MathUtils.random(0, 10);
            if (index < 3) {
                score = 1;
            }
            else if (index < 5) {
                score = 2;
            }
            else if (index < 8) {
                score = 3;
            }
            else if (index == 8) {
                score = 4;
            }
            else if (index == 9) {
                score = 5;
            }
        }
        return score;
    };
    /**
     * 3级别的机器人，平均得分130分；
     * 前8秒，50%概率得1分，50%的概率得2分：1.5 * 4
     * 后82秒，20%的概率得1,2,3,4,5分：3.0 * 41
     * 10%的概率得压哨球的5分:0.2 * 5
     */
    BaskectBallManager.prototype.getRobotScoreLevel4 = function () {
        var score = 0;
        if (this._timeoutSecond == 0) {
            var index = core.MathUtils.random(0, 10);
            if (index == 5 || index == 7) {
                score = 5;
            }
        }
        if (this._timeoutSecond >= 82) {
            var index = core.MathUtils.random(0, 2);
            if (index == 0) {
                score = 1;
            }
            else if (index == 1) {
                score = 2;
            }
        }
        else {
            var index = core.MathUtils.random(0, 5);
            if (index == 0) {
                score = 1;
            }
            else if (index == 1) {
                score = 2;
            }
            else if (index == 2) {
                score = 3;
            }
            else if (index == 3) {
                score = 4;
            }
            else if (index == 4) {
                score = 5;
            }
        }
        return score;
    };
    /**
    * 4级别的机器人，平均得分152分；
    * 前6秒，50%概率得1分，50%的概率得2分：1.5 * 3
    * 后84秒，30%概率得2分，20%概率得3分，20%概率得4分,30%的概率得5分：3.5 * 42
    * 10%的概率得压哨球的5分:0.1 * 5
    */
    BaskectBallManager.prototype.getRobotScoreLevel5 = function () {
        var score = 0;
        if (this._timeoutSecond == 0) {
            var index = core.MathUtils.random(0, 10);
            if (index == 5) {
                score = 5;
            }
        }
        if (this._timeoutSecond >= 84) {
            var index = core.MathUtils.random(0, 2);
            if (index == 0) {
                score = 1;
            }
            else if (index == 1) {
                score = 2;
            }
        }
        else {
            var index = core.MathUtils.random(0, 10);
            if (index < 3) {
                score = 2;
            }
            else if (index < 5) {
                score = 3;
            }
            else if (index < 7) {
                score = 4;
            }
            else {
                score = 5;
            }
        }
        return score;
    };
    /**
    * 5级别的机器人，平均得分177.5分；
    * 前4秒，50%概率得1分，50%的概率得2分：1.5 * 2
    * 后86秒，30%概率得2分，20%概率得3分，20%概率得4分,30%的概率得5分：4.0 * 43
    * 50%的概率得压哨球的5分:0.5 * 5
    */
    BaskectBallManager.prototype.getRobotScoreLevel6 = function () {
        var score = 0;
        if (this._timeoutSecond == 0) {
            var index = core.MathUtils.random(0, 1);
            if (index == 0) {
                score = 5;
            }
        }
        if (this._timeoutSecond >= 86) {
            var index = core.MathUtils.random(0, 2);
            if (index == 0) {
                score = 1;
            }
            else if (index == 1) {
                score = 2;
            }
        }
        else {
            var index = core.MathUtils.random(0, 10);
            if (index == 0) {
                score = 1;
            }
            else if (index == 1) {
                score = 2;
            }
            else if (index == 2) {
                score = 3;
            }
            else if (index == 3) {
                score = 4;
            }
            else {
                score = 5;
            }
        }
        return score;
    };
    //时间：第一关时间为无限，第二关为15s，第三关到第十关分别为（12，12，10，10，9，9，8，8），第十关到第二十关时间为7s，二十一关到四十关时间为6s，四十关之后时间为5s。
    BaskectBallManager.prototype.calcShotTime = function () {
        var t;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            if (this.curCombo == 1) {
                t = 10;
            }
            else if (this.curCombo <= 5) {
                t = 10 - this.curCombo * 0.3;
            }
            else if (this.curCombo <= 35) {
                t = 8.5 - (this.curCombo - 5) * 0.2;
            }
            else if (this.curCombo <= 50) {
                t = 2.5 - (this.curCombo - 35) * 0.1;
            }
            else {
                t = 1;
            }
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            if (this.curRound == 1) {
                t = 6;
            }
            else if (this.curRound <= 25) {
                t = 6 - this.curRound * 0.1;
            }
            else {
                t = 3.5;
            }
        }
        this.comboTimeout = t * 1000;
    };
    /**
     * 是否压哨球
     */
    BaskectBallManager.prototype.isLastTime = function () {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            if (this._timeoutSecond <= 0) {
                return true;
            }
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            if (this._comboSecond < 0) {
                return true;
            }
        }
        return false;
    };
    Object.defineProperty(BaskectBallManager.prototype, "timeoutSecond", {
        get: function () {
            return this._timeoutSecond;
        },
        enumerable: true,
        configurable: true
    });
    BaskectBallManager.prototype.addEffect = function (type) {
        if (type == "highShot") {
            this.endlessCombo++;
            this.highShotCount++;
        }
        else if (type == "kongxin") {
            this.endlessCombo++;
            this.kongxinCount++;
        }
        else if (type == "yashao") {
            this.endlessCombo++;
            this.yashaoCount++;
        }
        else if (type == "bank") {
            this.endlessCombo++;
            this.bankCount++;
        }
        else if (type = "null") {
            this.endlessCombo = 0;
            // this.kongxinCount = this.yashaoCount = this.bankCount = this.highShotCount = 0;
        }
        this.dispatchEventWith(BaskectBallManager.ADD_EFFECT, false, { type: type });
        // if (this.highShotCount == 3 || this.kongxinCount == 5 || this.bankCount == 5) {
        //     this.collectCoinsNumber(10);
        // }
    };
    Object.defineProperty(BaskectBallManager.prototype, "skinInfo", {
        get: function () {
            return this._skinInfo;
        },
        //皮肤数据
        set: function (s) {
            this._skinInfo = s;
        },
        enumerable: true,
        configurable: true
    });
    BaskectBallManager.prototype.addSkinInfo = function (skin) {
        this._skinInfo.push(skin);
        if (Facebook.isFBInit()) {
            FacebookStorage.getInstance().saveDataToFB({
                "ownSkin": this._skinInfo.toString()
            });
        }
        else {
            localStorage.setItem("ownSkin", JSON.stringify({
                "ownSkin": this._skinInfo.toString()
            }));
        }
    };
    Object.defineProperty(BaskectBallManager.prototype, "coinsNumber", {
        get: function () {
            return this._coinsNumber;
        },
        //金币数量
        set: function (s) {
            this._coinsNumber = s;
        },
        enumerable: true,
        configurable: true
    });
    BaskectBallManager.prototype.collectCoinsNumber = function (data) {
        this._coinsNumber += data;
        this._curCoins += data;
        GameManager.getInstance().refreshGold(this._coinsNumber);
        if (Facebook.isFBInit()) {
            FacebookStorage.getInstance().saveDataToFB({
                "gameCoin": this._coinsNumber
            });
        }
        else {
            localStorage.setItem("gameCoin", JSON.stringify({
                "gameCoin": this._coinsNumber
            }));
        }
    };
    BaskectBallManager.prototype.payCoinsNumber = function (data) {
        this._coinsNumber -= data;
        GameManager.getInstance().refreshGold(this._coinsNumber);
        if (Facebook.isFBInit()) {
            FacebookStorage.getInstance().saveDataToFB({
                "gameCoin": this._coinsNumber
            });
        }
        else {
            localStorage.setItem("gameCoin", JSON.stringify({
                "gameCoin": this._coinsNumber
            }));
        }
    };
    Object.defineProperty(BaskectBallManager.prototype, "use", {
        get: function () {
            return this._use;
        },
        //当前使用的皮肤id
        set: function (s) {
            this._use = s;
            if (Facebook.isFBInit()) {
                FacebookStorage.getInstance().saveDataToFB({
                    "usingSkin": s
                });
            }
            else {
                localStorage.setItem("usingSkin", JSON.stringify({
                    "usingSkin": s
                }));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaskectBallManager.prototype, "rankScore", {
        get: function () {
            return this._rankScore;
        },
        set: function (s) {
            this._rankScore = s;
            if (Facebook.isFBInit()) {
                FacebookStorage.getInstance().saveDataToFB({
                    "rankScore": s
                });
            }
            else {
                localStorage.setItem("rankScore", JSON.stringify({
                    "rankScore": s
                }));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 复活
     */
    BaskectBallManager.prototype.reborn = function () {
        egret.clearInterval(this.comboTimer);
        egret.clearInterval(this.tiemoutInterval);
        this.dispatchEventWith(BaskectBallManager.REBORN, false, {});
    };
    /**
     * 重新开始
     */
    BaskectBallManager.prototype.reset = function () {
        egret.clearInterval(this.comboTimer);
        egret.clearInterval(this.tiemoutInterval);
        GameManager.getInstance().scoreManager.reset();
        this._curSide = "right";
        this.kongxinCount = this.yashaoCount = this.highShotCount = this.bankCount = 0;
        this.curCombo = 0;
        this.curRound = 1;
        this.endlessCombo = 0;
        this._curPos = [3];
        this._timeoutSecond = BaskectBallManager.TIME;
        this._comboSecond = 0;
        this._curCoins = 0;
        this.maxCombo = 0;
    };
    BaskectBallManager.prototype.pauseGame = function () {
        egret.clearInterval(this.comboTimer);
        egret.clearInterval(this.tiemoutInterval);
    };
    BaskectBallManager.prototype.resumeGame = function (startCombo) {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this.startTimeout();
        }
        if (startCombo) {
            this.startCombTimer(true);
        }
    };
    BaskectBallManager.prototype.rebornGame = function () {
        // this.curCombo = 1;
        // this.curRound = 1;
        // this._comboSecond = 0;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this._timeoutSecond = 15;
            this.startTimeout();
            this.startCombTimer(true);
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            this._comboSecond = 0;
        }
    };
    BaskectBallManager.prototype.isYanMode = function () {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            return this.curCombo > 1 && this.curCombo < 4;
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            return this.endlessCombo > 1 && this.endlessCombo < 5;
        }
        return false;
    };
    /**
     * 是否火焰特效
     */
    BaskectBallManager.prototype.isFireMode = function () {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            return this.curCombo >= 4;
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            return this.endlessCombo >= 5;
        }
        return false;
    };
    /**
     * 是否闪电特效
     */
    BaskectBallManager.prototype.isLightMode = function () {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            return this.curCombo >= 14;
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            return this.endlessCombo >= 14;
        }
        return false;
    };
    BaskectBallManager.TIME = 90;
    BaskectBallManager.SWITCH_SIDE = "switch_side";
    BaskectBallManager.REBORN = "reborn";
    BaskectBallManager.START_TIMEOUT = "start_timeout";
    BaskectBallManager.COMPLETE_TIMEOUT = "complete_timeout";
    BaskectBallManager.COMPLETE_COMBO = "complete_combo";
    BaskectBallManager.GAME_TIMEOUT = "game_timeout";
    BaskectBallManager.ADD_EFFECT = "add_effect";
    BaskectBallManager.CHANGE_SKIN = "change_skin";
    BaskectBallManager.COLLECT_COINS = "collect_coins";
    BaskectBallManager.BASKET_PRICE = [-1, 0, 0, 500, 800, 1300, 2000];
    return BaskectBallManager;
}(egret.EventDispatcher));
__reflect(BaskectBallManager.prototype, "BaskectBallManager");
