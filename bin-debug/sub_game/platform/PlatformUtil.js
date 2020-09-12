var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PlatfromUtil = (function () {
    function PlatfromUtil() {
    }
    PlatfromUtil.getPlatformEnum = function () {
        if (Facebook.isFBInit()) {
            return PlatfromEnum.FACEBOOK;
        }
        else if (Utils.isRuntime) {
            return PlatfromEnum.GMBOX;
        }
        else {
            return PlatfromEnum.GP;
        }
    };
    PlatfromUtil.getPlatform = function () {
        if (Facebook.isFBInit()) {
            return new FacebookPlatform();
        }
        else if (Utils.isRuntime) {
            return new GmBoxPlatform();
        }
        else {
            return new GmBoxPlatform;
        }
    };
    return PlatfromUtil;
}());
__reflect(PlatfromUtil.prototype, "PlatfromUtil");
