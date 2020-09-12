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
/**
  * tips类
  * 提示相关信息
  */
var ToastPanel = (function (_super) {
    __extends(ToastPanel, _super);
    /**
    * descStr        描述
    */
    function ToastPanel(descStr) {
        if (descStr === void 0) { descStr = ""; }
        var _this = _super.call(this) || this;
        _this.descStr = "";
        _this.group = new eui.Group();
        _this.descStr = descStr;
        _this.initUI();
        _this.touchEnabled = false;
        _this.touchChildren = false;
        return _this;
    }
    /**
     * 显示
     */
    ToastPanel.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this);
    };
    // 初始化面板
    ToastPanel.prototype.initUI = function () {
        this.addChild(this.group);
        this.bg = new eui.Image("prompt_bg1_png");
        this.bg.verticalCenter = this.bg.horizontalCenter = 0;
        this.bg.scale9Grid = new egret.Rectangle(30, 10, 10, 40);
        this.group.addChild(this.bg);
        this.descTF = new eui.Label();
        this.group.addChild(this.descTF);
        this.descTF.textColor = 0xffffff;
        this.descTF.size = 25;
        this.descTF.lineSpacing = 18;
        this.descTF.verticalCenter = this.descTF.horizontalCenter = 0;
        this.descTF.textAlign = "center";
        // '没有任何格式初始文本，' +
        // '<font color="#0000ff" size="30" fontFamily="Verdana">Verdana blue large</font>' +
        // '<font color="#ff7f50" size="10">珊瑚色<b>局部加粗</b>小字体</font>' +
        // '<i>斜体</i>'
        this.descTF.textFlow = (new egret.HtmlTextParser).parser(this.descStr);
        this.group.verticalCenter = this.group.horizontalCenter = 0;
        this.bg.width = this.descTF.width + 50;
    };
    Object.defineProperty(ToastPanel.prototype, "height", {
        // 获取高度
        get: function () {
            return this.bg.height + 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToastPanel.prototype, "width", {
        // 获取宽度
        get: function () {
            return this.bg.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToastPanel.prototype, "groupX", {
        set: function (_x) {
            this.group.anchorOffsetX = 0;
            this.group.horizontalCenter = _x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToastPanel.prototype, "groupY", {
        set: function (_y) {
            this.group.anchorOffsetY = 0;
            this.group.verticalCenter = _y;
        },
        enumerable: true,
        configurable: true
    });
    ToastPanel.prototype.release = function () {
        this.removeChildren();
    };
    return ToastPanel;
}(core.EUIComponent));
__reflect(ToastPanel.prototype, "ToastPanel");
