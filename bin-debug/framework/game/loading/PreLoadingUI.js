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
var PreLoadingUI = (function (_super) {
    __extends(PreLoadingUI, _super);
    function PreLoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    PreLoadingUI.prototype.createView = function () {
        // this.bg = new egret.Sprite();
        // this.bg.graphics.clear();
        // // this.bg.graphics.beginFill(0x2abab0, 1);
        // this.bg.graphics.beginFill(0x0A141E, 1);
        // this.bg.graphics.drawRect(0, 0, GameConfig.curWidth(), GameConfig.curHeight());
        // this.bg.graphics.endFill();
        // this.bg.width = GameConfig.curWidth();
        // this.bg.height = GameConfig.curHeight();
        // this.addChild(this.bg);
        // let bmp: egret.Bitmap = new egret.Bitmap();
        // bmp.width = 720;
        // bmp.height = 1280;
        // this.addChild(bmp);
        // bmp.x = (GameConfig.curWidth() - 720) / 2;
        // bmp.y = (GameConfig.curHeight() - 1280) / 2;
        // let logo:eui.Image = new eui.Image();
        // this.addChild(logo);
        // logo.x = GameConfig.curWidth() - 313 >>1;
        // logo.y = (GameConfig.curHeight() - 342) /2 -100;
        // Utils.getTexture(window["game_config"].logoBase64,(texture)=>{
        //     logo.texture = texture;
        // });
    };
    PreLoadingUI.prototype.setProgress = function (data) {
        //this.textField.text = `Loading...${data.loaded}/${data.total}`;
    };
    PreLoadingUI.prototype.show = function () {
        core.LayerCenter.getInstance().getLayer(LayerEnum.LOADING).addChild(this);
    };
    PreLoadingUI.prototype.hide = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    PreLoadingUI.prototype.release = function () {
    };
    return PreLoadingUI;
}(core.Component));
__reflect(PreLoadingUI.prototype, "PreLoadingUI", ["core.ILoadingUI"]);
