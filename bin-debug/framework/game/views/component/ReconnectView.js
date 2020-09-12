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
var ReconnectView = (function (_super) {
    __extends(ReconnectView, _super);
    function ReconnectView() {
        return _super.call(this) || this;
    }
    /**
     * 显示
     */
    ReconnectView.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        this.left = this.right = this.top = this.bottom = 0;
    };
    ReconnectView.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this, event);
    };
    /**
     * 添加监听
     */
    ReconnectView.prototype.addListener = function () {
    };
    /**
     * 删除监听
     */
    ReconnectView.prototype.removeListener = function () {
    };
    ReconnectView.prototype.init = function () {
        this.darkSprite = new egret.Sprite();
        this.darkSprite.graphics.clear();
        this.darkSprite.graphics.beginFill(0x000000, 0.05);
        this.darkSprite.graphics.drawRect(0, 0, GameConfig.curWidth(), GameConfig.curHeight());
        this.darkSprite.graphics.endFill();
        this.darkSprite.width = GameConfig.curWidth();
        this.darkSprite.height = GameConfig.curHeight();
        this.darkSprite.touchEnabled = false;
        this.darkSprite.visible = true;
        this.addChild(this.darkSprite);
        var SIZE = new egret.Point(150, 150);
        this.darkSprite = new egret.Sprite();
        this.darkSprite.graphics.clear();
        this.darkSprite.graphics.beginFill(0x000000, 0.1);
        this.darkSprite.graphics.drawRoundRect(0, 0, SIZE.x, SIZE.y, 20);
        this.darkSprite.graphics.endFill();
        this.darkSprite.width = SIZE.x;
        this.darkSprite.height = SIZE.y;
        this.darkSprite.x = GameConfig.curWidth() - SIZE.x >> 1;
        this.darkSprite.y = GameConfig.curHeight() - SIZE.y >> 1;
        this.addChild(this.darkSprite);
        this.darkSprite.touchEnabled = false;
        this.darkSprite.visible = true;
        // this.ReconnectMc = core.MCFactory.instance.getMovieClip("reconnect_json","reconnect_png","reconnect");
        // this.ReconnectMc.x = GameConfig.curWidth()/2;
        // this.ReconnectMc.y = GameConfig.curHeight()/2;
        this.label = new egret.TextField();
        this.label.text = "网络重连中";
        this.label.size = 20;
        this.addChild(this.label);
        this.label.width = GameConfig.curWidth();
        this.label.textAlign = "center";
        this.label.y = GameConfig.curHeight() / 2 + SIZE.x / 4;
    };
    ReconnectView.prototype.popup = function (tip) {
        if (tip === void 0) { tip = ''; }
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            return;
        }
        this.init();
        this.label.text = tip;
        if (tip) {
            this.darkSprite.visible = true;
        }
        else {
            this.darkSprite.visible = false;
        }
        this.ReconnectMc.play(-1);
        this.addChild(this.ReconnectMc);
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    };
    ReconnectView.prototype.removeFromParent = function () {
        this.removeChildren();
        this.parent && this.parent.removeChild(this);
    };
    ReconnectView.prototype.release = function () {
        // core.MCFactory.instance.revertMovieClip("reconnect_json","reconnect_png",this.ReconnectMc);
        // this.ReconnectMc = null;
    };
    Object.defineProperty(ReconnectView.prototype, "isShow", {
        /**
         * 是否正在显示
         */
        get: function () {
            return core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this);
        },
        enumerable: true,
        configurable: true
    });
    ReconnectView.getInstance = function () {
        if (ReconnectView.s_instance == null) {
            ReconnectView.s_instance = new ReconnectView();
        }
        return ReconnectView.s_instance;
    };
    return ReconnectView;
}(core.EUIComponent));
__reflect(ReconnectView.prototype, "ReconnectView");
