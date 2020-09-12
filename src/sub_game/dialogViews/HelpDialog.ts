class HelpDialog extends core.EUIComponent {

    public m_help_back: eui.Image;
    public m_content1: eui.Label;
    public title_info: eui.Label;
    public m_content2: eui.Label;
    public m_help_group: eui.Group;


    public constructor() {
        super();
        this.skinName = "resource/assets/exml/HelpView.exml";
        this.top = this.bottom = this.left = this.right = 0;
    }

    private addListeners(): void {
        this.m_help_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
    }

    private removeListeners(): void {
        this.m_help_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
    }

    public closeDialog(): void {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            this.removeListeners();
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
        GameManager.getInstance().resumeGame();
    }

    protected onShow(event?: egret.Event) {
        super.onShow(event);
        GameManager.getInstance().pauseGame();

        this.title_info.text = LanguageManager.instance.getLangeuage(3);
        this.m_content1.text = LanguageManager.instance.getLangeuage(4);
        this.m_content2.text = LanguageManager.instance.getLangeuage(5);

        this.m_help_group.scaleX = 0.5;
        this.m_help_group.scaleY = 0.5;
        egret.Tween.get(this.m_help_group).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut);

    }

    protected touchDarkEnable(): boolean {
        return true;
    }

    public popUp(): void {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
        this.addListeners();
    }

}