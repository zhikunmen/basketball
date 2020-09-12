class SwitchManager {
    /** 
     * 复活开关 ,分享的开关
     */
    public static openborn: number = 1;

    /**
     * 看视频换成分享开关
     */
    public static lookVideoToShare: number = 0;

    /**
     * 分享到相同的群时间间隔
     */
    public static differentTime: number = 2;
    /**
     * 分享的次数
     */
    public static shareTimes: string = "2_5_8";
    /**
     * 分享换变成视频的概率
     */
    public static shareProNum: number = 30;
    /**
     * 当天看视频次数
     */
    public static seeplay: number = 0;

    /**
	 * 是否拉取Banner广告
	 */
    public static isShowBanner: number = 1;

    private static keys: string[] = [
        "openborn",
        "openborn",
        "lookVideoToShare",
        "differentTime",
        "shareTimes",
        "shareProNum",
        "seeplay",
        "isShowBanner"
    ]; //重生开关

    constructor() {

    }

    public static set switchs(s: any[]) {
        for (let i = 0; i < s.length; i++) {
            this[this.keys[s[i].key]] = s[i].switch;
        }
    }
}