class SkinItemView extends core.EUIComponent {

    public m_ball: eui.Image;//球    
    public m_selected: eui.Image;//选中的图标
    public m_skins_mask: eui.Image;//未购买的灰色透明背景
    public m_video: eui.Image;
    public m_coin: eui.Image;
    public m_price: eui.Label;


    public status: number = 0;//0是没有 1是拥有

    public isSelect: boolean = false;//false是没被选择，true是被选择

    public skinId: number = 0;
    public price: number = 0;

    public constructor() {
        super();
        this.skinName = "resource/assets/exml/SkinItemExml.exml";
    }

    protected onShow(event?: egret.Event) {
        super.onShow(event);
        this.m_selected.visible = false;
        this.init();
    }

    public init() {
        if (this.status == 1) {
            this.m_skins_mask.visible = false;
            this.m_video.visible = false;
            this.m_coin.visible = false;
            this.m_price.visible = false;
        } else {
            this.m_selected.visible = false;
            if (this.price < 0) {
                this.m_video.visible = false;
                this.m_coin.visible = false;
                this.m_price.visible = false;
            } else if (this.price == 0) {
                this.m_video.visible = true;
                this.m_coin.visible = false;
                this.m_price.visible = false;
            } else {
                this.m_video.visible = false;
                this.m_coin.visible = true;
                this.m_price.visible = true;
                this.m_price.text = this.price + "";
            }
        }
    }

    protected onHide(event?: egret.Event) {
        super.onHide(event);

    }

    private onTouch(): void {
        egret.log("onTouch: " + this.skinId)
        if (this.status == 1) {//已经拥有该皮肤
            if (ChangeSkinView.getInstance().targetBall != this.skinId) {
                this.selectSkin();
                ChangeSkinView.getInstance().showToast(1);
            }
        } else {
            let buyDialog = new BuyDialog();
            buyDialog.buy(this.price, this.skinId);
        }
    }

    private selectSkin() {
        GameManager.getInstance().baskectBallManager.use = this.skinId;
        GameManager.getInstance().baskectBallManager.dispatchEventWith(BaskectBallManager.CHANGE_SKIN);
        ChangeSkinView.getInstance().clearSelected();//单选
        this.m_selected.visible = true;//给点击的图标打上对勾
        ChangeSkinView.getInstance().targetBall = this.skinId;//获取目前皮肤的id

        EventUtils.logEvent("useSkin", {
            "skinId": this.skinId
        })
    }


    public curSkin() {
        let json = {
            "skinId": this.skinId
        }
    }


	/**
     * 添加监听
     */
    protected addListener(): void {
        super.addListener();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
        super.removeListener();
    }

    public buySuccess(): void {
        this.status = 1;
        this.m_skins_mask.visible = false;
        this.m_video.visible = false;
        this.m_coin.visible = false;
        this.m_price.visible = false;

        this.selectSkin();
    }
}