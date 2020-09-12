var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TweenUtil = (function () {
    function TweenUtil() {
    }
    TweenUtil.playTweenGroup = function (target, isLoop) {
        this.stopTweenGroup(target);
        if (isLoop) {
            for (var key in target.items) {
                target.items[key].props = { loop: true };
            }
        }
        target.play();
    };
    TweenUtil.stopTweenGroup = function (target) {
        if (target.items) {
            for (var key in target.items) {
                target.items[key].props = { loop: false };
            }
        }
        target.stop();
    };
    return TweenUtil;
}());
__reflect(TweenUtil.prototype, "TweenUtil");
