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
var EffectLine = (function (_super) {
    __extends(EffectLine, _super);
    function EffectLine() {
        var _this = _super.call(this) || this;
        _this.LineArr = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    EffectLine.prototype.onAddToStage = function (event) {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageTouch, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouch, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouch, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.clean, this);
    };
    EffectLine.prototype.dis = function (x1, x2, y1, y2) {
        var x1 = x1;
        //获取第一点的X坐标
        var y1 = (y1);
        //获取第一点的Y坐标
        var x2 = (x2);
        //获取第二点的X坐标
        var y2 = (y2);
        //获取第二点的Y坐标
        var calX = x2 - x1;
        var calY = y2 - y1;
        return Math.pow((calX * calX + calY * calY), 0.5);
    };
    EffectLine.prototype.createLine = function (x, y) {
        var effect = new eui.Image("z_png");
        effect['type'] = 0;
        effect.x = x;
        effect.y = y;
        effect.width = 25;
        effect.height = 25;
        effect.anchorOffsetX = effect.width / 2;
        effect.anchorOffsetY = effect.height / 2;
        effect.alpha = 1;
        this.addChild(effect);
        this.LineArr.push(effect);
    };
    EffectLine.prototype.onStageTouch = function (evt) {
        if (evt.type == "touchBegin") {
        }
        else if (evt.type == "touchMove") {
            if (this.LineArr.length > 0) {
                var x1 = this.LineArr[this.LineArr.length - 1].x;
                var y1 = this.LineArr[this.LineArr.length - 1].y;
                var x2 = evt.stageX;
                var y2 = evt.stageY;
                var dis = this.dis(x1, x2, y1, y2);
                if (dis > 3) {
                    var point1X = (x1 + x2) / 2;
                    var point1Y = (y1 + y2) / 2;
                    var point2X = (x1 + point1X) / 2;
                    var point2Y = (y1 + point1Y) / 2;
                    var point3X = (point2X + x2) / 2;
                    var point3Y = (point2Y + y2) / 2;
                    var center1X = (x1 + point2X) / 2;
                    var center1Y = (y1 + point2Y) / 2;
                    var center2X = (point2X + point1X) / 2;
                    var center2Y = (point2Y + point1Y) / 2;
                    var center3X = (point1X + point3X) / 2;
                    var center3Y = (point1Y + point3Y) / 2;
                    var center4X = (point3X + x2) / 2;
                    var center4Y = (point3Y + y2) / 2;
                    this.createLine(center1X, center1Y);
                    this.createLine(point2X, point2Y);
                    this.createLine(center2X, center2Y);
                    this.createLine(point1X, point1Y);
                    this.createLine(center3X, center3Y);
                    this.createLine(point3X, point3Y);
                    this.createLine(center4X, center4Y);
                }
            }
            this.createLine(evt.stageX, evt.stageY);
        }
        else if (evt.type == "touchEnd") {
        }
    };
    EffectLine.prototype.clean = function () {
        if (this.LineArr.length > 0) {
            for (var a = 0; a < this.LineArr.length; a++) {
                if (this.LineArr[a].scaleX < 0.8 && this.LineArr[a]['type'] == 0) {
                    this.LineArr[a].scaleX = this.LineArr[a].scaleX + 0.06;
                    this.LineArr[a].scaleY = this.LineArr[a].scaleY + 0.06;
                }
                else {
                    this.LineArr[a]['type'] = 1;
                    this.LineArr[a].scaleX = this.LineArr[a].scaleX - 0.06;
                    this.LineArr[a].scaleY = this.LineArr[a].scaleY - 0.06;
                    if (this.LineArr[a].scaleX <= 0) {
                        this.removeChild(this.LineArr[a]);
                        this.LineArr.splice(a, 1);
                        a--;
                    }
                }
            }
        }
    };
    EffectLine.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return EffectLine;
}(egret.DisplayObjectContainer));
__reflect(EffectLine.prototype, "EffectLine");
