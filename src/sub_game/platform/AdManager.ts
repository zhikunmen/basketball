class AdManager {

    private static RewardedVideoAd: GmboxRewardedVideoAd = GmboxRewardedVideoAd.isValid() ? new GmboxRewardedVideoAd("") : null;

    public static checkRewardedVideoAdLoad(): boolean {
        if (PlatfromUtil.getPlatformEnum() == PlatfromEnum.FACEBOOK) {
            Facebook.FBPropAd.reloadRewardedVideoAd();
            Facebook.FBTrasureChestAd.reloadRewardedVideoAd();
            return Facebook.FBPropAd.isLoaded() || Facebook.FBTrasureChestAd.isLoaded();
        } else {
            if (AdManager.RewardedVideoAd) {
                AdManager.RewardedVideoAd.reloadRewardedVideoAd();
                return AdManager.RewardedVideoAd.isLoaded();
            }
        }
        return false;
    }

    public static showRewardedVideoAd(successCallback: Function = null, failCallback: Function = null, timeout: number = 5) {
        if (PlatfromUtil.getPlatformEnum() == PlatfromEnum.FACEBOOK) {
            if (Facebook.FBPropAd.isLoaded() || !Facebook.FBTrasureChestAd.isLoaded()) {
                Facebook.FBPropAd.showRewardedVideoAd(successCallback, failCallback, timeout);
            } else {
                Facebook.FBTrasureChestAd.showRewardedVideoAd(successCallback, failCallback, timeout);
            }

        } else {
            if (AdManager.RewardedVideoAd) {
                AdManager.RewardedVideoAd.showRewardedVideoAd(successCallback, failCallback, timeout);
            }
        }
    }

    public static abandonShowRewardedVideoAd() {
        if (PlatfromUtil.getPlatformEnum() == PlatfromEnum.FACEBOOK) {
            Facebook.FBPropAd.abandonShow();
            Facebook.FBTrasureChestAd.abandonShow();
        } else {
            if (AdManager.RewardedVideoAd) {
                AdManager.RewardedVideoAd.abandonShow();
            }
        }
    }
}
