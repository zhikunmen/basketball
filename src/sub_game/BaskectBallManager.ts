class BaskectBallManager extends egret.EventDispatcher {

    private static TIME = 90;
    public static SWITCH_SIDE: string = "switch_side";
    public static REBORN: string = "reborn";
    public static START_TIMEOUT: string = "start_timeout";
    public static COMPLETE_TIMEOUT: string = "complete_timeout";
    public static COMPLETE_COMBO: string = "complete_combo";
    public static GAME_TIMEOUT: string = "game_timeout";

    public static ADD_EFFECT: string = "add_effect";

    public static CHANGE_SKIN: string = "change_skin";
    public static COLLECT_COINS: string = "collect_coins";
    public static BASKET_PRICE: number[] = [-1, 0, 0, 500, 800, 1300, 2000]

    /**
     * 当前篮筐的方向
     */
    private _curSide: string = "right";//"left"

    /**
     * 显示的篮筐
     */
    private _curPos: number[] = [3];

    /**
     * 投篮倒计时
     */
    public comboTimeout: number = 10000;

    private _matterScene: core.MatterScene;

    public curRound: number = 1;
    public curCombo: number = 0;

    private _skinInfo: string[] = ["0"];
    private _coinsNumber: number = 0;
    public _curCoins: number = 0;
    private _use: number = 0;

    private _rankScore: number = 0;

    public constructor() {
        super();
    }

    public set matterScene(m: core.MatterScene) {
        this._matterScene = m;
    }

    public get matterScene() {
        return this._matterScene;
    }

    private generateCurPos() {
        if (this.curRound == 1) {
            this._curPos = [3];
        } else if (this.curRound <= 3) {
            let index = core.MathUtils.random(1, 3);
            this._curPos = [index];
        } else {
            let index = core.MathUtils.random(0, 100);
            if (index < 4) {
                this._curPos = [1, 2, 3];
            } else if (index < 12) {
                this._curPos = [1, 2];
            } else if (index < 20) {
                this._curPos = [2, 3];
            } else if (index < 46) {
                this._curPos = [3];
            } else if (index < 73) {
                this._curPos = [2];
            } else {
                this._curPos = [1];
            }
        }
    }

    private generateNextPos() {
        let pos = core.MathUtils.random(1, 4);
        this._curPos = [];
        this._curPos.push(pos);
    }


    public switchSide(): string {
        this.curRound++;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this.generateCurPos();
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            this.generateNextPos();
        }
        if (this._curSide == "right") {
            this._curSide = "left";
        } else {
            this._curSide = "right";
        }

        // this.dispatchEvent(new egret.Event(BaskectBallManager.SWITCH_SIDE))
        return this._curSide;
    }

    public get curSide(): string {
        return this._curSide;
    }

    public get curPos(): number[] {
        return this._curPos;
    }

    private comboTimer: number = 0;
    public maxCombo: number = 0;
    public _comboSecond: number = 0;
    public startCombTimer(isResume: boolean = false): void {
        if (!isResume) {
            this.curCombo++;
            if (this.curCombo > this.maxCombo) {
                this.maxCombo = this.curCombo - 1;
            }
            this.calcShotTime();
            this._comboSecond = this.comboTimeout;
        }
        this.dispatchEventWith(GameManager.GAME_COMBO, false, { round: this.curCombo });
        let flagTimestamp: number = this._matterScene.engine.timing.timestamp;
        egret.clearInterval(this.comboTimer);
        this.comboTimer = egret.setInterval(() => {
            this._comboSecond -= (this._matterScene.engine.timing.timestamp - flagTimestamp);
            let percent = this._comboSecond / this.comboTimeout;
            this.dispatchEventWith(GameManager.GAME_COMBO_PROGRESS, false, { percent: percent, round: this.curCombo });
            flagTimestamp = this._matterScene.engine.timing.timestamp;
            if (percent <= 0) {
                this.curCombo = 0;
                egret.clearInterval(this.comboTimer);
                this.dispatchEvent(new egret.Event(BaskectBallManager.COMPLETE_COMBO))
            }
        }, this, 16)
    }

    /**
     * 倒计时
     */
    private _timeoutSecond: number = BaskectBallManager.TIME;
    private tiemoutInterval: number = 0;
    public startTimeout(): void {
        this.dispatchEvent(new egret.Event(BaskectBallManager.START_TIMEOUT));
        this.dispatchEventWith(GameManager.GAME_TIME, false, { time: this._timeoutSecond });
        let flagTimestamp: number = this._matterScene.engine.timing.timestamp;
        egret.clearInterval(this.tiemoutInterval);
        this.tiemoutInterval = egret.setInterval(() => {
            this._timeoutSecond--;
            this.dispatchEventWith(GameManager.GAME_TIME, false, { time: this._timeoutSecond });
            flagTimestamp = this._matterScene.engine.timing.timestamp;
            if (this._timeoutSecond <= 10) {
                SoundMgr.getInstance().daojishi(this._timeoutSecond);
            }

            if (this._timeoutSecond <= 0) {
                egret.clearInterval(this.tiemoutInterval);
                egret.clearInterval(this.comboTimer);
                this.dispatchEvent(new egret.Event(BaskectBallManager.COMPLETE_COMBO))
            }
            this.updateRobotScore();
        }, this, 1000)
    }

    private updateRobotScore() {
        if (PlatfromUtil.getPlatformEnum() != PlatfromEnum.GMBOX) {
            return;
        }
        let otherUserInfo = BatterInfo.instance.otherUserInfo;
        if (otherUserInfo && otherUserInfo.type == 0) {//真人对战
            return;
        }
        let level = otherUserInfo ? otherUserInfo.aiRank : 1;
        if (this._timeoutSecond % 2 == 1) {
            return;
        }
        let score = 0;
        if (level == 1) {
            score = this.getRobotScoreLevel1();
        } else if (level == 2) {
            score = this.getRobotScoreLevel2();
        } else if (level == 3) {
            score = this.getRobotScoreLevel3();
        } else if (level == 4) {
            score = this.getRobotScoreLevel4();
        } else {
            score = this.getRobotScoreLevel5();
        }
        if (score > 0) {
            GameManager.getInstance().scoreManager.updateOtherScore(score);
        }
    }

    /**
     * 1级别的机器人，平均得分85.5分；
     * 前10秒，33.3%概率得0分，33.3%概率1分，33.3%概率2分：1.0 * 5
     * 后80秒，60%概率得1分，10%概率得2,3,4,5分：2.0 * 40
     * 10%的概率得压哨球的5分:0.1 * 5
     */
    private getRobotScoreLevel1(): number {
        let score = 0;
        if (this._timeoutSecond == 0) {
            let index = core.MathUtils.random(0, 10);
            if (index == 5) {
                score = 5;
            }
        } if (this._timeoutSecond >= 80) {
            let index = core.MathUtils.random(0, 3);
            if (index == 0) {
                score = 0;
            } else if (index == 1) {
                score = 1;
            } else {
                score = 2;
            }
        } else {
            let index = core.MathUtils.random(0, 10);
            if (index < 6) {
                score = 1;
            } else if (index == 6) {
                score = 2;
            } else if (index == 7) {
                score = 3;
            } else if (index == 8) {
                score = 4;
            } else if (index == 9) {
                score = 5;
            }
        }
        return score;
    }

    /**
     * 2级别的机器人，平均得分96分；
     * 前10秒，50%概率得1分，50%的概率得2分：1.5 * 5
     * 后80秒，50%概率得1分，10%概率得2分，20%概率得3分，10%概率得4,5分：2.2 * 40
     * 10%的概率得压哨球的5分:0.1 * 5
     */
    private getRobotScoreLevel2(): number {
        let score = 0;
        if (this._timeoutSecond == 0) {
            let index = core.MathUtils.random(0, 10);
            if (index == 5) {
                score = 5;
            }
        } if (this._timeoutSecond >= 80) {
            let index = core.MathUtils.random(0, 2);
            if (index == 0) {//50%
                score = 1;
            } else if (index == 1) {//50%
                score = 2;
            }
        } else {
            let index = core.MathUtils.random(0, 10);
            if (index < 5) {
                score = 1;
            } else if (index == 5) {
                score = 2;
            } else if (index < 8) {
                score = 3;
            } else if (index == 8) {
                score = 4;
            } else if (index == 9) {
                score = 5;
            }
        }
        return score;
    }

    /**
     * 2级别的机器人，平均得分108分；
     * 前10秒，50%概率得1分，50%的概率得2分：1.5 * 5
     * 后80秒，30%概率得1分，20%概率得2分，30%概率得3分，10%概率得4,5分：2.5 * 40
     * 10%的概率得压哨球的5分:0.1 * 5
     */
    private getRobotScoreLevel3(): number {
        let score = 0;
        if (this._timeoutSecond == 0) {
            let index = core.MathUtils.random(0, 10);
            if (index == 5) {
                score = 5;
            }
        } if (this._timeoutSecond >= 80) {
            let index = core.MathUtils.random(0, 2);
            if (index == 0) {//50%
                score = 1;
            } else if (index == 1) {//50%
                score = 2;
            }
        } else {
            let index = core.MathUtils.random(0, 10);
            if (index < 3) {//30%
                score = 1;
            } else if (index < 5) {//20%
                score = 2;
            } else if (index < 8) {//30%
                score = 3;
            } else if (index == 8) {//10%
                score = 4;
            } else if (index == 9) {//10%
                score = 5;
            }
        }
        return score;
    }

    /**
     * 3级别的机器人，平均得分130分；
     * 前8秒，50%概率得1分，50%的概率得2分：1.5 * 4
     * 后82秒，20%的概率得1,2,3,4,5分：3.0 * 41
     * 10%的概率得压哨球的5分:0.2 * 5
     */
    private getRobotScoreLevel4(): number {
        let score = 0;
        if (this._timeoutSecond == 0) {
            let index = core.MathUtils.random(0, 10);
            if (index == 5 || index == 7) {
                score = 5;
            }
        } if (this._timeoutSecond >= 82) {
            let index = core.MathUtils.random(0, 2);
            if (index == 0) {//50%
                score = 1;
            } else if (index == 1) {//50%
                score = 2;
            }
        } else {
            let index = core.MathUtils.random(0, 5);
            if (index == 0) {//20%
                score = 1;
            } else if (index == 1) {//20%
                score = 2;
            } else if (index == 2) {//20%
                score = 3;
            } else if (index == 3) {//20%
                score = 4;
            } else if (index == 4) {//20%
                score = 5;
            }
        }
        return score;
    }

    /**
    * 4级别的机器人，平均得分152分；
    * 前6秒，50%概率得1分，50%的概率得2分：1.5 * 3
    * 后84秒，30%概率得2分，20%概率得3分，20%概率得4分,30%的概率得5分：3.5 * 42
    * 10%的概率得压哨球的5分:0.1 * 5
    */
    private getRobotScoreLevel5(): number {
        let score = 0;
        if (this._timeoutSecond == 0) {
            let index = core.MathUtils.random(0, 10);
            if (index == 5) {
                score = 5;
            }
        } if (this._timeoutSecond >= 84) {
            let index = core.MathUtils.random(0, 2);
            if (index == 0) {//50%
                score = 1;
            } else if (index == 1) {//50%
                score = 2;
            }
        } else {
            let index = core.MathUtils.random(0, 10);
            if (index < 3) {//30%
                score = 2;
            } else if (index < 5) {//20%
                score = 3;
            } else if (index < 7) {//20%
                score = 4;
            } else {//30%
                score = 5;
            }
        }
        return score;
    }

    /**
    * 5级别的机器人，平均得分177.5分；
    * 前4秒，50%概率得1分，50%的概率得2分：1.5 * 2
    * 后86秒，30%概率得2分，20%概率得3分，20%概率得4分,30%的概率得5分：4.0 * 43
    * 50%的概率得压哨球的5分:0.5 * 5
    */
    private getRobotScoreLevel6(): number {
        let score = 0;
        if (this._timeoutSecond == 0) {
            let index = core.MathUtils.random(0, 1);
            if (index == 0) {
                score = 5;
            }
        } if (this._timeoutSecond >= 86) {
            let index = core.MathUtils.random(0, 2);
            if (index == 0) {//50%
                score = 1;
            } else if (index == 1) {//50%
                score = 2;
            }
        } else {
            let index = core.MathUtils.random(0, 10);
            if (index == 0) {//10%
                score = 1;
            } else if (index == 1) {//10%
                score = 2;
            } else if (index == 2) {//10%
                score = 3;
            } else if (index == 3) {//10%
                score = 4;
            } else {//60%
                score = 5;
            }
        }
        return score;
    }

    //时间：第一关时间为无限，第二关为15s，第三关到第十关分别为（12，12，10，10，9，9，8，8），第十关到第二十关时间为7s，二十一关到四十关时间为6s，四十关之后时间为5s。
    private calcShotTime(): void {
        let t;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            if (this.curCombo == 1) {
                t = 10;
            } else if (this.curCombo <= 5) {
                t = 10 - this.curCombo * 0.3;
            } else if (this.curCombo <= 35) {
                t = 8.5 - (this.curCombo - 5) * 0.2;
            } else if (this.curCombo <= 50) {
                t = 2.5 - (this.curCombo - 35) * 0.1;
            } else {
                t = 1;
            }
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            if (this.curRound == 1) {
                t = 6;
            } else if (this.curRound <= 25) {
                t = 6 - this.curRound * 0.1;
            } else {
                t = 3.5;
            }
        }
        this.comboTimeout = t * 1000
    }

    /**
     * 是否压哨球
     */
    public isLastTime(): boolean {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            if (this._timeoutSecond <= 0) {
                return true;
            }
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            if (this._comboSecond < 0) {
                return true;
            }
        }
        return false;
    }

    public get timeoutSecond() {
        return this._timeoutSecond;
    }

    /**
     * 增加空心
     */
    public highShotCount: number = 0;
    public kongxinCount: number = 0;
    public yashaoCount: number = 0;
    public bankCount: number = 0;
    public endlessCombo = 0;
    public addEffect(type: string): void {
        if (type == "highShot") {
            this.endlessCombo++;
            this.highShotCount++;
        } else if (type == "kongxin") {
            this.endlessCombo++;
            this.kongxinCount++;
        } else if (type == "yashao") {
            this.endlessCombo++;
            this.yashaoCount++;
        } else if (type == "bank") {
            this.endlessCombo++;
            this.bankCount++;
        } else if (type = "null") {
            this.endlessCombo = 0;
            // this.kongxinCount = this.yashaoCount = this.bankCount = this.highShotCount = 0;
        }

        this.dispatchEventWith(BaskectBallManager.ADD_EFFECT, false, { type: type });
        // if (this.highShotCount == 3 || this.kongxinCount == 5 || this.bankCount == 5) {
        //     this.collectCoinsNumber(10);
        // }

    }


    //皮肤数据
    public set skinInfo(s: string[]) {
        this._skinInfo = s;
    }
    public get skinInfo(): string[] {
        return this._skinInfo;
    }

    public addSkinInfo(skin: string) {
        this._skinInfo.push(skin);
        if (Facebook.isFBInit()) {
            FacebookStorage.getInstance().saveDataToFB({
                "ownSkin": this._skinInfo.toString()
            });
        } else {
            localStorage.setItem("ownSkin", JSON.stringify({
                "ownSkin": this._skinInfo.toString()
            }));
        }
    }

    //金币数量
    public set coinsNumber(s: number) {
        this._coinsNumber = s;
    }
    public get coinsNumber(): number {
        return this._coinsNumber;
    }

    public collectCoinsNumber(data: number) {
        this._coinsNumber += data;
        this._curCoins += data;
        GameManager.getInstance().refreshGold(this._coinsNumber);
        if (Facebook.isFBInit()) {
            FacebookStorage.getInstance().saveDataToFB({
                "gameCoin": this._coinsNumber
            });
        } else {
            localStorage.setItem("gameCoin", JSON.stringify({
                "gameCoin": this._coinsNumber
            }));
        }
    }

    public payCoinsNumber(data: number) {
        this._coinsNumber -= data;
        GameManager.getInstance().refreshGold(this._coinsNumber);
        if (Facebook.isFBInit()) {
            FacebookStorage.getInstance().saveDataToFB({
                "gameCoin": this._coinsNumber
            });
        } else {
            localStorage.setItem("gameCoin", JSON.stringify({
                "gameCoin": this._coinsNumber
            }));
        }
    }

    //当前使用的皮肤id
    public set use(s: number) {
        this._use = s;
        if (Facebook.isFBInit()) {
            FacebookStorage.getInstance().saveDataToFB({
                "usingSkin": s
            });
        } else {
            localStorage.setItem("usingSkin", JSON.stringify({
                "usingSkin": s
            }));
        }
    }

    public get use(): number {
        return this._use;
    }

    public set rankScore(s: number) {
        this._rankScore = s;
        if (Facebook.isFBInit()) {
            FacebookStorage.getInstance().saveDataToFB({
                "rankScore": s
            });
        } else {
            localStorage.setItem("rankScore", JSON.stringify({
                "rankScore": s
            }));
        }
    }

    public get rankScore(): number {
        return this._rankScore;
    }


    /**
     * 复活
     */
    public reborn(): void {
        egret.clearInterval(this.comboTimer);
        egret.clearInterval(this.tiemoutInterval);
        this.dispatchEventWith(BaskectBallManager.REBORN, false, {});
    }

    /**
     * 重新开始
     */
    public reset(): void {
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
    }

    public pauseGame(): void {
        egret.clearInterval(this.comboTimer);
        egret.clearInterval(this.tiemoutInterval);
    }

    public resumeGame(startCombo: boolean): void {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this.startTimeout();
        }
        if (startCombo) {
            this.startCombTimer(true);
        }
    }

    public rebornGame(): void {
        // this.curCombo = 1;
        // this.curRound = 1;
        // this._comboSecond = 0;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this._timeoutSecond = 15;
            this.startTimeout();
            this.startCombTimer(true);
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            this._comboSecond = 0;
        }
    }

    public isYanMode(): boolean {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            return this.curCombo > 1 && this.curCombo < 4;
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            return this.endlessCombo > 1 && this.endlessCombo < 5;
        }
        return false;
    }

    /**
     * 是否火焰特效
     */
    public isFireMode(): boolean {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            return this.curCombo >= 4;
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            return this.endlessCombo >= 5;
        }
        return false;
    }

    /**
     * 是否闪电特效
     */
    public isLightMode(): boolean {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            return this.curCombo >= 14;
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            return this.endlessCombo >= 14;
        }
        return false;
    }

    /**
     * COMBO连击数达到10次，20次，30次，40次可获得额外金币
     */
    // public addComboGold(): void {
    //     if (this.curCombo == 10 || this.curCombo == 20 || this.curCombo == 30 || this.curCombo == 40) {
    //         this.collectCoinsNumber(10);
    //     }
    // }
}
