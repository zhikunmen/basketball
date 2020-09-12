class ChangeSkinView extends core.EUIComponent {
    public m_skin_back: eui.Image;
    public m_ball_tab: eui.Button;
    public m_ball_tab_img: eui.Image;
    public m_hoop_tab: eui.Button;
    public m_hoop_tab_img: eui.Image;
    public m_basket_tab: eui.Button;
    public m_basket_tab_img: eui.Image;

    public Award: eui.Group;
    public m_skinItem_container: eui.Group;

    // public m_buy: eui.Group;
    // public m_value_bg: eui.Image;       //皮肤背景（点击事件）

    public m_value: eui.Label;          //皮肤价格文本
    public valueNumber: number = 500;          //皮肤价格

    public m_ownCoins: eui.Group;
    public Coins: eui.Image;

    public m_coins: eui.Label;          //已拥有金币文本

    public skinPlay: SkinItemView[];    //皮肤数组

    private skinString: string[];     //后台给的字符串：格式：number|number|number...

    public buySkinId;

    public showBall: number;
    public targetBall: number;

    public m_toast_group: eui.Group;
    public m_toast: eui.Label;

    public toast: egret.tween.TweenGroup;
    private isHideActionUp: boolean = false;

    //单例类
    private static _instance: ChangeSkinView;
    public static getInstance(): ChangeSkinView {
        // if (ChangeSkinView._instance == null) {
        //     ChangeSkinView._instance = new ChangeSkinView();
        // }
        return ChangeSkinView._instance;
    }
    //单例类结束



    public constructor() {
        super();
        this.skinName = "resource/assets/exml/ChangeSkinExml.exml";
        ChangeSkinView._instance = this;
        this.top = this.bottom = this.left = this.right = 0;
    }
    protected onShow(event?: egret.Event) {
        super.onShow(event);
        this.skinString = GameManager.getInstance().baskectBallManager.skinInfo;
        this.m_coins.text = GameManager.getInstance().baskectBallManager.coinsNumber + "";
        this.targetBall = GameManager.getInstance().baskectBallManager.use;
        this.init();
        if (this.isHideActionUp && typeof gmbox != 'undefined') {
            gmbox.updateActionView({ action: 1 })
        }
    }

    protected onHide(event?: egret.Event) {
        super.onHide(event);
        if (this.isHideActionUp && typeof gmbox != 'undefined') {
            gmbox.updateActionView({ action: 2 })
        }
    }


	/**
     * 添加监听
     */
    protected addListener(): void {
        super.addListener();

        this.m_skin_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_ball_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_hoop_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_basket_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);

        // this.m_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.itemClickHandler, this);

        // this.videoAward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onVideoAward, this);
        GameManager.getInstance().addEventListener(GameManager.REFRESH_GOLD, this.changeGold, this);
    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
        super.removeListener();

        this.m_skin_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_ball_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_hoop_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_basket_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);

        // this.m_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buyEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.itemClickHandler, this);
        // this.videoAward_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onVideoAward, this);
        GameManager.getInstance().removeEventListener(GameManager.REFRESH_GOLD, this.changeGold, this);
    }

    private itemClickHandler(evt: egret.TouchEvent): void {
        let target: SkinItemView = evt.target as SkinItemView;
    }

    private changeGold() {
        this.m_coins.text = GameManager.getInstance().baskectBallManager.coinsNumber + "";
    }

    public popUp(isHideActionUp: boolean = false): void {
        this.isHideActionUp = isHideActionUp;
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    }

    /**
     * 购买皮肤
     */
    private buyEvent(evt: egret.TouchEvent): void {

        SkinManager.getInstance().getGoldInfo;

        //是否有足够金币
        if (GameManager.getInstance().baskectBallManager.coinsNumber >= 500) {
            GameManager.getInstance().baskectBallManager.payCoinsNumber(this.valueNumber);
            this.m_coins.text = GameManager.getInstance().baskectBallManager.coinsNumber + "";
            this.skinPlay[this.buySkinId].m_skins_mask.visible = false;
            // this.m_buy.visible = false;
            this.skinPlay[this.buySkinId].status = 1;

            SkinManager.getInstance().payGold();
        }
        else {

        }
    }
    private onShareAward() {
    }

    private onVideoAward() {
    }

    protected shareHandler(evt: egret.Event): void {
        // WxKit.shareGame("", ``);
        GameManager.getInstance().baskectBallManager.dispatchEventWith(BaskectBallManager.CHANGE_SKIN);
        GameManager.getInstance().dispatchEventWith(GameManager.RESUME_GAME);
    }

    //皮肤界面初始化
    private init(): void {
        //初始化存放皮肤组建的数组
        this.skinPlay = [];
        //后台传入的skinId

        let skinId = this.skinString;
        skinId.sort((a, b) => {
            let a0 = parseInt(a);
            let b0 = parseInt(b);
            return a0 - b0;
        })

        let skinNumber = 0;

        for (let i = 0; i < 7; i++) {
            this.skinPlay[i] = new SkinItemView();
            this.skinPlay[i].m_ball.source = `mg_qiu_${i}_png`;
            this.skinPlay[i].price = BaskectBallManager.BASKET_PRICE[i];
            this.m_skinItem_container.addChild(this.skinPlay[i]);
            // this.skinPlay[i].m_red_point.visible = false;
            // this.skinPlay[i].m_selected.visible = false;

            let k = parseInt(skinId[skinNumber]);

            if (k == i && skinId[skinNumber]) {
                this.skinPlay[i].status = 1;    //拥有
                skinNumber++;
            } else {
                this.skinPlay[i].status = 0;    //未拥有            
            }

            this.skinPlay[i].skinId = i;
            this.skinPlay[i].init();
        }

        this.skinPlay[this.targetBall].m_selected.visible = true;//第一个皮肤默认被选择
        // this.m_buy.visible = false;
        this.skinPlay[this.targetBall].m_selected.visible = true;
    }

    //单选函数start
    public clearSelected(): void {

        for (let i = 0; i < 12; i++) {

            if (this.skinPlay[i].m_selected.visible) {
                this.skinPlay[i].m_selected.visible = false;
                break;
            }
        }
    }


    private closeDialog(): void {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
        GameManager.getInstance().resumeGame();
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

    /**
     * 1-皮肤切换成功
     * 2-皮肤购买成功
     * 3-金币不足
     */
    public showToast(type: number) {
        TweenUtil.stopTweenGroup(this.toast);
        this.m_toast.text = type == 1 ? "Exchange Succeeded!" : type == 2 ? "Successful transaction" : "Not enough coin";
        TweenUtil.playTweenGroup(this.toast, false);
    }

}

