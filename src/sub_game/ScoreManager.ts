class ScoreManager extends egret.EventDispatcher {
    public static UPDATE_SCORE: string = "update_self_score";

    /**
     * 当前分数
     */
    public totalScore: number = 0;
    public otherScore: number = 0;
    public constructor() {
        super();
    }
    /**
    * 更新分数
    */
    public updateScore(type: string, pos: any): void {
        let score: number = 0;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            score = this.getTimeScore(type);
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            score = this.getEndLesScore(type);
        }
        this.totalScore += score;
        this.dispatchEventWith(ScoreManager.UPDATE_SCORE, false, { score: score, pos: pos });
        game.BattleManager.instance.sendDragMessage(score);
    }

    private getTimeScore(type: string): number {
        let score: number = 0;
        let baskectBallManager: BaskectBallManager = GameManager.getInstance().baskectBallManager;
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
        } else if (baskectBallManager.isFireMode()) {
            score += 1;
        }
        return score;
    }

    private getEndLesScore(type: string): number {
        let combo = GameManager.getInstance().baskectBallManager.endlessCombo;
        let score: number = 0;
        if (type == "null") {
            score = 1;
        } else {
            score = combo;
        }
        return score;
    }

    public reset(): void {
        this.totalScore = 0;
        this.otherScore = 0;
    }

    public updateOtherScore(score: number) {
        this.otherScore += score;
        this.dispatchEventWith(BattleEventConst.UPDATE_OTHER_SCORE, false, this.otherScore);
    }
}
