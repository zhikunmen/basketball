class ExitDialog extends core.EUIComponent {
    // public m_mask: eui.Rect;
    public m_message: eui.Label;
    public m_cancel: eui.Image;
    public m_confirm: eui.Image;
    public m_confirm_label: eui.Label;
    public m_exit_group:eui.Group;

    public constructor() {
        super();
        this.skinName = "resource/assets/exml/ExitDialog.exml";
        this.top = this.bottom = this.left = this.right = 0;
    }

    protected addListener(): void {
        // this.m_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancel, this);
        this.m_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
    }

    protected removeListener(): void {
        // this.m_mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_cancel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.cancel, this);
        this.m_confirm.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
    }

    protected onShow(event?: egret.Event) {
        super.onShow(event);
        GameManager.getInstance().pauseGame();
        this.m_message.text = LanguageManager.instance.getLangeuage(21);
        this.m_confirm_label.text = LanguageManager.instance.getLangeuage(22);

        this.m_exit_group.scaleX = 0.5;
        this.m_exit_group.scaleY = 0.5;
        egret.Tween.get(this.m_exit_group).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut);
    }


    protected touchDarkEnable(): boolean {
        return true;
    }

    public popUp(): void {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    }

    public closeDialog(): void {
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