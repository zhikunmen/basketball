var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var ChangeSkinView = (function (_super) {
    __extends(ChangeSkinView, _super);
    //单例类结束
    function ChangeSkinView() {
        var _this = _super.call(this) || this;
        _this.valueNumber = 500; //皮肤价格
        _this.isHideActionUp = false;
        _this.skinName = "resource/assets/exml/ChangeSkinExml.exml";
        ChangeSkinView._instance = _this;
        _this.top = _this.bottom = _this.left = _this.right = 0;
        return _this;
    }
    ChangeSkinView.getInstance = function () {
        // if (ChangeSkinView._instance == null) {
        //     ChangeSkinView._instance = new ChangeSkinView();
        // }
        return ChangeSkinView._instance;
    };
    ChangeSkinView.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        this.skinString = GameManager.getInstance().baskectBallManager.skinInfo;
        this.m_coins.text = GameManager.getInstance().baskectBallManager.coinsNumber + "";
        this.targetBall = GameManager.getInstance().baskectBallManager.use;
        this.init();
        if (this.isHideActionUp && typeof gmbox != 'undefined') {
            gmbox.updateActionView({ action: 1 });
        }
    };
    ChangeSkinView.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this, event);
        if (this.isHideActionUp && typeof gmbox != 'undefined') {
            gmbox.updateActionView({ action: 2 });
        }
    };
    /**
     * 添加监听
     */
    ChangeSkinView.prototype.addListener = function () {
        _super.prototype.addListener.call(this);
        this.m_skin_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_ball_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_hoop_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_basket_tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        // this.m_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.itemClickHandler, this);
        // this.videoAward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onVideoAward, this);
        GameManager.getInstance().addEventListener(GameManager.REFRESH_GOLD, this.changeGold, this);
    };
    /**
     * 删除监听
     */
    ChangeSkinView.prototype.removeListener = function () {
        _super.prototype.removeListener.call(this);
        this.m_skin_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
        this.m_ball_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_hoop_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        this.m_basket_tab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchTab, this);
        // this.m_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buyEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.itemClickHandler, this);
        // this.videoAward_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onVideoAward, this);
        GameManager.getInstance().removeEventListener(GameManager.REFRESH_GOLD, this.changeGold, this);
    };
    ChangeSkinView.prototype.itemClickHandler = function (evt) {
        var target = evt.target;
    };
    ChangeSkinView.prototype.changeGold = function () {
        this.m_coins.text = GameManager.getInstance().baskectBallManager.coinsNumber + "";
    };
    ChangeSkinView.prototype.popUp = function (isHideActionUp) {
        if (isHideActionUp === void 0) { isHideActionUp = false; }
        this.isHideActionUp = isHideActionUp;
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    };
    /**
     * 购买皮肤
     */
    ChangeSkinView.prototype.buyEvent = function (evt) {
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
    };
    ChangeSkinView.prototype.onShareAward = function () {
    };
    ChangeSkinView.prototype.onVideoAward = function () {
    };
    ChangeSkinView.prototype.shareHandler = function (evt) {
        // WxKit.shareGame("", ``);
        GameManager.getInstance().baskectBallManager.dispatchEventWith(BaskectBallManager.CHANGE_SKIN);
        GameManager.getInstance().dispatchEventWith(GameManager.RESUME_GAME);
    };
    //皮肤界面初始化
    ChangeSkinView.prototype.init = function () {
        //初始化存放皮肤组建的数组
        this.skinPlay = [];
        //后台传入的skinId
        var skinId = this.skinString;
        skinId.sort(function (a, b) {
            var a0 = parseInt(a);
            var b0 = parseInt(b);
            return a0 - b0;
        });
        var skinNumber = 0;
        for (var i = 0; i < 7; i++) {
            this.skinPlay[i] = new SkinItemView();
            this.skinPlay[i].m_ball.source = "mg_qiu_" + i + "_png";
            this.skinPlay[i].price = BaskectBallManager.BASKET_PRICE[i];
            this.m_skinItem_container.addChild(this.skinPlay[i]);
            // this.skinPlay[i].m_red_point.visible = false;
            // this.skinPlay[i].m_selected.visible = false;
            var k = parseInt(skinId[skinNumber]);
            if (k == i && skinId[skinNumber]) {
                this.skinPlay[i].status = 1; //拥有
                skinNumber++;
            }
            else {
                this.skinPlay[i].status = 0; //未拥有            
            }
            this.skinPlay[i].skinId = i;
            this.skinPlay[i].init();
        }
        this.skinPlay[this.targetBall].m_selected.visible = true; //第一个皮肤默认被选择
        // this.m_buy.visible = false;
        this.skinPlay[this.targetBall].m_selected.visible = true;
    };
    //单选函数start
    ChangeSkinView.prototype.clearSelected = function () {
        for (var i = 0; i < 12; i++) {
            if (this.skinPlay[i].m_selected.visible) {
                this.skinPlay[i].m_selected.visible = false;
                break;
            }
        }
    };
    ChangeSkinView.prototype.closeDialog = function () {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
        GameManager.getInstance().resumeGame();
    };
    ChangeSkinView.prototype.switchTab = function (evt) {
        if (evt.target == this.m_ball_tab) {
            egret.log(1);
        }
        else if (evt.target == this.m_ball_tab) {
            egret.log(2);
        }
        else {
            egret.log(3);
        }
    };
    /**
     * 1-皮肤切换成功
     * 2-皮肤购买成功
     * 3-金币不足
     */
    ChangeSkinView.prototype.showToast = function (type) {
        TweenUtil.stopTweenGroup(this.toast);
        this.m_toast.text = type == 1 ? "Exchange Succeeded!" : type == 2 ? "Successful transaction" : "Not enough coin";
        TweenUtil.playTweenGroup(this.toast, false);
    };
    return ChangeSkinView;
}(core.EUIComponent));
__reflect(ChangeSkinView.prototype, "ChangeSkinView");
