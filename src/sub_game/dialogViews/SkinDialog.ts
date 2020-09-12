class SkinDialog extends core.EUIComponent {

    public m_skin_back: eui.Image;
    public m_ball_tab: eui.Button;
    public m_ball_tab_img: eui.Image;
    public m_hoop_tab: eui.Button;
    public m_hoop_tab_img: eui.Image;
    public m_basket_tab: eui.Button;
    public m_basket_tab_img: eui.Image;


    public m_qiu_1: eui.Image;
    public m_qiu_select_1: eui.Image;
    public m_qiu_mask_1: eui.Image;

    public m_qiu_2: eui.Image;
    public m_qiu_select_2: eui.Image;
    public m_qiu_mask_2: eui.Image;

    public m_qiu_3: eui.Image;
    public m_qiu_select_3: eui.Image;
    public m_qiu_mask_3: eui.Image;

    public m_qiu_4: eui.Image;
    public m_qiu_select_4: eui.Image;
    public m_qiu_mask_4: eui.Image;

    public m_qiu_5: eui.Image;
    public m_qiu_select_5: eui.Image;
    public m_qiu_mask_5: eui.Image;

    public m_qiu_6: eui.Image;
    public m_qiu_select_6: eui.Image;
    public m_qiu_mask_6: eui.Image;


    public constructor() {
        super();
        this.skinName = "resource/assets/exml/SkinView.exml";
        this.top = this.bottom = this.left = this.right = 0;
    }

    protected addListener(): void {
        this.m_skin_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_ball_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_hoop_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_basket_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
    }

    protected removeListener(): void {
        this.m_skin_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_ball_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_hoop_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_basket_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
    }

    private closeDialog(): void {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
        GameManager.getInstance().resumeGame();
    }

    protected onShow(event?: egret.Event) {
        super.onShow(event);
    }


    protected touchDarkEnable(): boolean {
        return true;
    }

    public popUp(): void {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    }

    private switchTab(evt: egret.Event) {
        if (evt.target == this.m_ball_tab) {
            egret.log(1)
        } else if (evt.target == this.m_ball_tab) {
            egret.log(2)
        } else {
            egret.log(3)
        }
    }

}