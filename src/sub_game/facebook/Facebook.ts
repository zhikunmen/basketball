class Facebook {

    static FBPlatformInfo: FacebookContextId;
    static supportApi: Array<string>;
    static FBPropAd: FacebookRewardedVideoAd;
    static FBTrasureChestAd: FacebookRewardedVideoAd;
    globalRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//全球排行榜
    friendRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//好友排行榜

    /**
     * 初始化
     */
    static init() {
        if (Facebook.isFBInit()) {
            Facebook.FBPlatformInfo = new FacebookContextId();
            Facebook.supportApi = FBInstant.getSupportedAPIs();
            // Facebook.FBPropAd = new FacebookRewardedVideoAd("974171789613772_974174142946870", "Prop");
            // Facebook.FBTrasureChestAd = new FacebookRewardedVideoAd("974171789613772_981702192194065", "TrasureChest");

            Facebook.FBPropAd = new FacebookRewardedVideoAd("406768563375011_406771486708052", "Prop");
            Facebook.FBTrasureChestAd = new FacebookRewardedVideoAd("406768563375011_406771876708013", "TrasureChest");
        }
    }

    /**
     * 是否是facebook平台
     */
    static isFBInit(): boolean {
        if (typeof FBInstant === 'undefined') {
            egret.warn("FBInstant is undefined");
            return false
        }
        else {
            return true;
        }
    }

    /**
     * api是否支持 
     */
    static IsApiSupport(apiName: string) {
        if (!Facebook.isFBInit()) {
            return;
        }

        if (Facebook.supportApi.indexOf(apiName) != -1) {
            return true;
        } else {
            egret.warn("Unsupport API:", apiName);
            return false;
        }
    }


    //发送分析log
    public static logEvent(eventName: string, valueToSum?: number, parameters?: Object) {
        if (!Facebook.IsApiSupport("logEvent")) {
            return;
        }
        FBInstant.logEvent(eventName, valueToSum, parameters);
    }
}