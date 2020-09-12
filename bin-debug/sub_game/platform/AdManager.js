var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AdManager = (function () {
    function AdManager() {
    }
    AdManager.checkRewardedVideoAdLoad = function () {
        if (PlatfromUtil.getPlatformEnum() == PlatfromEnum.FACEBOOK) {
            Facebook.FBPropAd.reloadRewardedVideoAd();
            Facebook.FBTrasureChestAd.reloadRewardedVideoAd();
            return Facebook.FBPropAd.isLoaded() || Facebook.FBTrasureChestAd.isLoaded();
        }
        else {
            if (AdManager.RewardedVideoAd) {
                AdManager.RewardedVideoAd.reloadRewardedVideoAd();
                return AdManager.RewardedVideoAd.isLoaded();
            }
        }
        return false;
    };
    AdManager.showRewardedVideoAd = function (successCallback, failCallback, timeout) {
        if (successCallback === void 0) { successCallback = null; }
        if (failCallback === void 0) { failCallback = null; }
        if (timeout === void 0) { timeout = 5; }
        if (PlatfromUtil.getPlatformEnum() == PlatfromEnum.FACEBOOK) {
            if (Facebook.FBPropAd.isLoaded() || !Facebook.FBTrasureChestAd.isLoaded()) {
                Facebook.FBPropAd.showRewardedVideoAd(successCallback, failCallback, timeout);
            }
            else {
                Facebook.FBTrasureChestAd.showRewardedVideoAd(successCallback, failCallback, timeout);
            }
        }
        else {
            if (AdManager.RewardedVideoAd) {
                AdManager.RewardedVideoAd.showRewardedVideoAd(successCallback, failCallback, timeout);
            }
        }
    };
    AdManager.abandonShowRewardedVideoAd = function () {
        if (PlatfromUtil.getPlatformEnum() == PlatfromEnum.FACEBOOK) {
            Facebook.FBPropAd.abandonShow();
            Facebook.FBTrasureChestAd.abandonShow();
        }
        else {
            if (AdManager.RewardedVideoAd) {
                AdManager.RewardedVideoAd.abandonShow();
            }
        }
    };
    AdManager.RewardedVideoAd = GmboxRewardedVideoAd.isValid() ? new GmboxRewardedVideoAd("") : null;
    return AdManager;
}());
__reflect(AdManager.prototype, "AdManager");
