class BuyDialog extends core.EUIComponent {

    public m_info: eui.Label;
    public m_close: eui.Image;
    public price: number;//价格
    public skinId: number;//价格

    public m_skin_image: eui.Image;
    public m_buy_btn: eui.Image;
    public m_coin_count: eui.Label;
    public m_try_label: eui.Label;
    public m_coin_image: eui.Image;
    public m_video_image: eui.Image;
    public m_buy_group:eui.Group;


    public constructor() {
        super();
        this.skinName = "resource/assets/exml/BuyView.exml";
        this.top = this.bottom = this.left = this.right = 0;
    }

    protected addListener(): void {
        this.m_buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyEvent, this);
        this.m_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
    }

    protected removeListener(): void {
        this.m_buy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buyEvent, this);
        this.m_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
    }

    private closeDialog(): void {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
    }

    protected onShow(event?: egret.Event) {
        super.onShow(event);
        this.m_skin_image.source = "mg_qiu_" + this.skinId + "_png";
        if (this.price == 0) {
            this.m_video_image.visible = true;
            this.m_coin_image.visible = false;
            this.m_coin_count.visible = false;
            this.m_info.text = LanguageManager.instance.getLangeuage(13);
        } else {
            this.m_video_image.visible = false;
            this.m_coin_image.visible = true;
            this.m_coin_count.visible = true;
            this.m_coin_count.text = this.price + "";
            this.m_info.text = LanguageManager.instance.getLangeuage(16);
            if (GameManager.getInstance().baskectBallManager.coinsNumber < this.price) {
                Utils.gray(this.m_buy_btn);
            }
        }
        this.m_try_label.text = LanguageManager.instance.getLangeuage(12);

        this.m_buy_group.scaleX = 0.5;
        this.m_buy_group.scaleY = 0.5;
        egret.Tween.get(this.m_buy_group).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut);
    }

    protected touchDarkEnable(): boolean {
        return true;
    }

    public popUp(): void {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    }

    public buy(price: number, skinId: number) {
        this.price = price;
        this.skinId = skinId;
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    }

    private buyEvent() {
        this.closeDialog();
        if (this.price == 0) {
            let successCallback = () => {
                this.buySuccess();
                SoundMgr.getInstance().playBGM();
            }
            AdManager.showRewardedVideoAd(successCallback);
            SoundMgr.getInstance().stopBGM();
            return;
        }


        if (GameManager.getInstance().baskectBallManager.coinsNumber >= this.price) {
            GameManager.getInstance().baskectBallManager.payCoinsNumber(this.price);
            this.buySuccess();
        } else {
            ChangeSkinView.getInstance().showToast(3);
        }
    }

    private buySuccess() {
        ChangeSkinView.getInstance().skinPlay[this.skinId].buySuccess();
        GameManager.getInstance().baskectBallManager.addSkinInfo(this.skinId.toString())
        ChangeSkinView.getInstance().showToast(2);
        
        EventUtils.logEvent("buySkin", {
            "skinId": this.skinId
        })
    }

}