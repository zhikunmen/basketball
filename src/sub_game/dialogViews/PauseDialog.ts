class PauseDialog extends core.EUIComponent {

    public m_game_continue: eui.Image;
    public m_game_home: eui.Image;



    public constructor() {
        super();
        this.skinName = "resource/assets/exml/PauseView.exml";
        this.top = this.bottom = this.left = this.right = 0;
    }

    protected addListener(): void {
        this.m_game_continue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancel, this);
        this.m_game_home.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
    }

    protected removeListener(): void {
        this.m_game_continue.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.cancel, this);
        this.m_game_home.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
    }

    protected onShow(event?: egret.Event) {
        super.onShow(event);
        GameManager.getInstance().pauseGame();
    }

    protected touchDarkEnable(): boolean {
        return true;
    }

    public popUp(): void {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    }

    private closeDialog(): void {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
        GameManager.getInstance().resumeGame();
    }

    private cancel(): void {
        this.closeDialog();
    }

    private confirm(): void {
        this.closeDialog();
        GameManager.getInstance().baskectBallManager.reset();
        GlobalManager.getInstance().goLobby();
    }

}