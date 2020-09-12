class MainLayer extends core.EUILayer {

    private main: MainView;
    private scoreView: ScoreView;
    private endlessScore: EndlessScore;
    private girl: Girl;

    public constructor() {
        super();
        this.init();
    }

    private init(): void {

        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this.scoreView = new ScoreView();
            this.addChild(this.scoreView);
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            this.endlessScore = new EndlessScore();
            this.addChild(this.endlessScore);
        }

        this.girl = new Girl();
        this.addChild(this.girl);
        this.girl.x = GameConfig.curWidth() / 2;
        this.girl.y = GameConfig.curHeight() - 620;

        this.main = new MainView();
        this.addChild(this.main);


    }

    public release(): void {
        super.release();
        this.main = null;
        this.scoreView = null;
        this.girl = null;
    }
}