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
var BuyDialog = (function (_super) {
    __extends(BuyDialog, _super);
    function BuyDialog() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/assets/exml/BuyView.exml";
        _this.top = _this.bottom = _this.left = _this.right = 0;
        return _this;
    }
    BuyDialog.prototype.addListener = function () {
        this.m_buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyEvent, this);
        this.m_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
    };
    BuyDialog.prototype.removeListener = function () {
        this.m_buy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buyEvent, this);
        this.m_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeDialog, this);
    };
    BuyDialog.prototype.closeDialog = function () {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
    };
    BuyDialog.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        this.m_skin_image.source = "mg_qiu_" + this.skinId + "_png";
        if (this.price == 0) {
            this.m_video_image.visible = true;
            this.m_coin_image.visible = false;
            this.m_coin_count.visible = false;
            this.m_info.text = LanguageManager.instance.getLangeuage(13);
        }
        else {
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
    };
    BuyDialog.prototype.touchDarkEnable = function () {
        return true;
    };
    BuyDialog.prototype.popUp = function () {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    };
    BuyDialog.prototype.buy = function (price, skinId) {
        this.price = price;
        this.skinId = skinId;
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    };
    BuyDialog.prototype.buyEvent = function () {
        var _this = this;
        this.closeDialog();
        if (this.price == 0) {
            var successCallback = function () {
                _this.buySuccess();
                SoundMgr.getInstance().playBGM();
            };
            AdManager.showRewardedVideoAd(successCallback);
            SoundMgr.getInstance().stopBGM();
            return;
        }
        if (GameManager.getInstance().baskectBallManager.coinsNumber >= this.price) {
            GameManager.getInstance().baskectBallManager.payCoinsNumber(this.price);
            this.buySuccess();
        }
        else {
            ChangeSkinView.getInstance().showToast(3);
        }
    };
    BuyDialog.prototype.buySuccess = function () {
        ChangeSkinView.getInstance().skinPlay[this.skinId].buySuccess();
        GameManager.getInstance().baskectBallManager.addSkinInfo(this.skinId.toString());
        ChangeSkinView.getInstance().showToast(2);
        EventUtils.logEvent("buySkin", {
            "skinId": this.skinId
        });
    };
    return BuyDialog;
}(core.EUIComponent));
__reflect(BuyDialog.prototype, "BuyDialog");
