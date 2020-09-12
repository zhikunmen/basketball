class EndlessRebornDialog extends DialogBaseView {

    public m_reborn_btn: eui.Image;
    public m_pass_btn: eui.Image;
    public m_content: eui.Label;

    public constructor() {
        super();
        this.skinName = "resource/assets/exml/EndlessRebornView.exml";
    }
    protected onShow(event?: egret.Event) {
        super.onShow(event);
        this.m_content.text = LanguageManager.instance.getLangeuage(23);
        this._isEnable = true;
    }

    protected onHide(event?: egret.Event) {
        super.onHide(event);
    }

	/**
     * 添加监听
     */
    protected addListener(): void {
        super.addListener();

        this.m_reborn_btn && this.m_reborn_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rebornHandler, this);
        this.m_pass_btn && this.m_pass_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.passHandler, this);

    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
        super.removeListener();

        this.m_reborn_btn && this.m_reborn_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rebornHandler, this);
        this.m_pass_btn && this.m_pass_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.passHandler, this);
    }

    _isEnable: boolean = true;
    protected rebornHandler(evt: egret.Event) {
        if (!this._isEnable) {
            return;
        }
        this._isEnable = false;
        EventUtils.logEvent("click_endeless_reborn")
        let successCallback = () => {
            GameManager.getInstance().rebornCount -= 1;
            egret.setTimeout(() => {
                this.removeFromParent();
                GameManager.getInstance().baskectBallManager.reborn();
            }, this, 300);
            SoundMgr.getInstance().playBGM();
        }

        let failCallback = () => {
            this._isEnable = true;
            SoundMgr.getInstance().playBGM();
        }
        AdManager.showRewardedVideoAd(successCallback, failCallback);
        SoundMgr.getInstance().stopBGM();
    }



    //点击跳过
    protected passHandler(evt: egret.Event): void {
        EventUtils.logEvent("click_endless_skipReborn")
        this.removeFromParent();

        core.ResUtils.loadGroups(["result"], (progress) => {
        }, (fail) => {
        }, (loadComplete) => {
            let resultView = new ResultDialog();
            resultView.popUp();
        }, this);

    }

    /**
	 * 点击空白处是否关闭
	 */
    protected touchDarkEnable(): boolean {
        return false;
    }
}