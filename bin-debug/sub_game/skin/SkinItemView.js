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
var SkinItemView = (function (_super) {
    __extends(SkinItemView, _super);
    function SkinItemView() {
        var _this = _super.call(this) || this;
        _this.status = 0; //0是没有 1是拥有
        _this.isSelect = false; //false是没被选择，true是被选择
        _this.skinId = 0;
        _this.price = 0;
        _this.skinName = "resource/assets/exml/SkinItemExml.exml";
        return _this;
    }
    SkinItemView.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        this.m_selected.visible = false;
        this.init();
    };
    SkinItemView.prototype.init = function () {
        if (this.status == 1) {
            this.m_skins_mask.visible = false;
            this.m_video.visible = false;
            this.m_coin.visible = false;
            this.m_price.visible = false;
        }
        else {
            this.m_selected.visible = false;
            if (this.price < 0) {
                this.m_video.visible = false;
                this.m_coin.visible = false;
                this.m_price.visible = false;
            }
            else if (this.price == 0) {
                this.m_video.visible = true;
                this.m_coin.visible = false;
                this.m_price.visible = false;
            }
            else {
                this.m_video.visible = false;
                this.m_coin.visible = true;
                this.m_price.visible = true;
                this.m_price.text = this.price + "";
            }
        }
    };
    SkinItemView.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this, event);
    };
    SkinItemView.prototype.onTouch = function () {
        egret.log("onTouch: " + this.skinId);
        if (this.status == 1) {
            if (ChangeSkinView.getInstance().targetBall != this.skinId) {
                this.selectSkin();
                ChangeSkinView.getInstance().showToast(1);
            }
        }
        else {
            var buyDialog = new BuyDialog();
            buyDialog.buy(this.price, this.skinId);
        }
    };
    SkinItemView.prototype.selectSkin = function () {
        GameManager.getInstance().baskectBallManager.use = this.skinId;
        GameManager.getInstance().baskectBallManager.dispatchEventWith(BaskectBallManager.CHANGE_SKIN);
        ChangeSkinView.getInstance().clearSelected(); //单选
        this.m_selected.visible = true; //给点击的图标打上对勾
        ChangeSkinView.getInstance().targetBall = this.skinId; //获取目前皮肤的id
        EventUtils.logEvent("useSkin", {
            "skinId": this.skinId
        });
    };
    SkinItemView.prototype.curSkin = function () {
        var json = {
            "skinId": this.skinId
        };
    };
    /**
     * 添加监听
     */
    SkinItemView.prototype.addListener = function () {
        _super.prototype.addListener.call(this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    };
    /**
     * 删除监听
     */
    SkinItemView.prototype.removeListener = function () {
        _super.prototype.removeListener.call(this);
    };
    SkinItemView.prototype.buySuccess = function () {
        this.status = 1;
        this.m_skins_mask.visible = false;
        this.m_video.visible = false;
        this.m_coin.visible = false;
        this.m_price.visible = false;
        this.selectSkin();
    };
    return SkinItemView;
}(core.EUIComponent));
__reflect(SkinItemView.prototype, "SkinItemView");
