class GameManager extends egret.EventDispatcher {

    private static s_instance: GameManager;

    //分数管理器
    public scoreManager: ScoreManager;

    //篮球
    public baskectBallManager: BaskectBallManager;

    //复活次数
    public rebornCount: number = 1;

    /**
     * 暂停游戏
     */
    public static PAUSE_GAME: string = "pause_game";

    /**
    * 恢复游戏
    */
    public static RESUME_GAME: string = "resume_game";

    /**
     * 重新开始游戏
     */
    public static RESTART_GAME: string = "restart_game"

    /**
     * 游戏结束
     */
    public static GAME_OVER: string = "gameover"
    /**
     * 游戏复活
     */
    public static GAME_REVIVE: string = "revive_game";
    /**
     * 游戏倒计时
     */
    public static GAME_TIME: string = "game_time"
    /**
     * 游戏Combo进度条
     */
    public static GAME_COMBO_PROGRESS: string = "game_combo_progress"
    /**
 * 游戏Combo
 */
    public static GAME_COMBO: string = "game_combo"
    /**
     * 分享到不同的群失败了
     */
    public static SHARE_DIFFRERENTGROUPFAIL: string = "SHARE_DIFFRERENTGROUPFAIL";
    /**
     * 
     */
    public static REFRESH_GOLD: string = "REFRESH_GOLD";

    /**
     * 排行榜更新
     */
    public static REFRESH_RANK: string = "REFRESH_RANK";


    public constructor() {
        super();

        this.scoreManager = new ScoreManager();
        this.baskectBallManager = new BaskectBallManager();
    }

    public static getInstance(): GameManager {
        if (GameManager.s_instance == null) {
            GameManager.s_instance = new GameManager();
        }
        return GameManager.s_instance;
    }

    /**
     * 暂停游戏
     */
    public pauseGame(): void {
        this.dispatchEvent(new egret.Event(GameManager.PAUSE_GAME));
    }

    /**
     * 恢复游戏
     */
    public resumeGame(): void {
        this.dispatchEvent(new egret.Event(GameManager.RESUME_GAME));
    }

    /**
     * 游戏结束
     */
    public gameover(): void {
        this.dispatchEvent(new egret.Event(GameManager.GAME_OVER));
    }

    /**
     * 重新开始
     */
    public restart(): void {
        this.dispatchEvent(new egret.Event(GameManager.RESTART_GAME));
    }
    /**
     * 复活
     */
    public revive() {
        this.dispatchEvent(new egret.Event(GameManager.GAME_REVIVE));
    }
    /**
     * 
     */
    public refreshGold(gold: number) {
        this.dispatchEvent(new egret.Event(GameManager.REFRESH_GOLD));
    }

    public updateRankComplete() {
        this.dispatchEvent(new egret.Event(GameManager.REFRESH_RANK));
    }
}