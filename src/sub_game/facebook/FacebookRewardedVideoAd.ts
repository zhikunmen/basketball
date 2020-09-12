
 
 
 class FacebookRewardedVideoAd {

    private mLogTag: string = null;
    private mAdUnitId: string = null;
    private mRewardedVideoAd: FBInstant.AdInstance = null;
    private mRewardedVideoAdLoading = false;
    private mRewardedVideoAdLoaded = false;
    private mSuccessCallback = null;
    private mFailCallback = null;
    private mOnLoadSuccess = null;
    private mRetryCount = 0;
    private mRetryId;
    private mTimeoutId;

    public constructor(adUnitId: string, logTag: string = null) {
        this.mAdUnitId = adUnitId;
        this.mLogTag = logTag;
        this.init();
    }

    private init() {
        if (!Facebook.isFBInit()) {
            return;
        }
        this.loadRewardedVideoAd();
    }

    private callSuccess() {
        if (this.mSuccessCallback) {
            this.mSuccessCallback();
        }
        this.resetCall();
        clearTimeout(this.mTimeoutId);
    }

    private callFail() {
        if (this.mFailCallback) {
            this.mFailCallback();
        }
        this.resetCall();
        clearTimeout(this.mTimeoutId);
    }

    private resetCall() {
        this.mSuccessCallback = null;
        this.mFailCallback = null;
        this.mOnLoadSuccess = null;
    }

    private callLoad() {
        if (this.mOnLoadSuccess) {
            this.mOnLoadSuccess();
        }
    }

    private loadRewardedVideoAd() {
        clearTimeout(this.mRetryId);
        if (!Facebook.IsApiSupport("getRewardedVideoAsync")) {
            this.callFail();
            return;
        }
        if (this.mRewardedVideoAdLoading) {
            if (this.mRewardedVideoAd == null) {
                this.logDebug("激励视频正在创建");
            } else {
                this.logDebug("激励视频正在加载");
            }
            return;
        }
        if (this.mRewardedVideoAdLoaded) {
            this.callLoad();
            return;
        }
        this.mRewardedVideoAdLoading = true;
        this.mRewardedVideoAdLoaded = false;
        if (this.mRewardedVideoAd == null) {
            this.logDebug("激励视频开始创建" + this.mRetryCount);
            this.logCreateEvent();
            FBInstant.getRewardedVideoAsync(this.mAdUnitId).then((rewardedVideo) => {
                this.mRewardedVideoAd = rewardedVideo;
                this.logDebug("激励视频创建完成" + this.mRetryCount);
                this.loadRewardedVideoAdInternal();
            }).catch((err) => {
                this.onLoadFail(err);
                this.logLoadFailEvent(JSON.stringify(err));
            });
        } else {
            this.loadRewardedVideoAdInternal();
        }
    }

    private loadRewardedVideoAdInternal() {
        if (this.mRewardedVideoAd == null) {
            this.onLoadFail({ reson: "mRewardedVideoAd is null" });
            return;
        }
        if (this.mRewardedVideoAdLoaded) {
            this.callLoad();
            return;
        }
        this.logDebug("激励视频开始加载" + this.mRetryCount);
        this.logRequestEvent();
        this.mRewardedVideoAd.loadAsync().then(() => {
            this.logDebug("激励视频加载完成" + this.mRetryCount);
            this.mRewardedVideoAdLoading = false;
            this.mRewardedVideoAdLoaded = true;
            this.mRetryCount = 0;
            this.callLoad();
            this.logLoadSuccessEvent();
        }).catch((err) => {
            this.onLoadFail(err);
            this.logLoadFailEvent(JSON.stringify(err));
        });
    }

    private onLoadFail(err) {
        this.mRewardedVideoAdLoading = false;
        this.mRewardedVideoAdLoaded = false;
        if (this.mRewardedVideoAd == null) {
            this.logDebug('激励视频创建失败 : ' + JSON.stringify(err));
        } else {
            this.logDebug('激励视频加载失败 : ' + JSON.stringify(err));
        }
        this.mRetryCount++;
        if (this.mRetryCount > 3) {
            this.logError("激励视频失败次数太多");
            this.callFail();
            return;
        }
        this.mRetryId = setTimeout(() => {
            this.loadRewardedVideoAd();
        }, 10000 * this.mRetryCount);
    }

    public abandonShow() {
        this.logDebug("激励视频放弃显示");
        this.resetCall();
    }

    public showRewardedVideoAd(successCallback: Function = null, failCallback: Function = null, timeout: number = 5) {
        this.logDebug("激励视频请求显示");
        this.mSuccessCallback = successCallback;
        this.mFailCallback = failCallback;
        clearTimeout(this.mTimeoutId);
        this.mOnLoadSuccess = () => {
            this.showRewardedVideoAdInternal();
        };
        if (!Facebook.isFBInit()) {
            this.callFail();
            return;
        }

        if (timeout > 0) {
            this.mTimeoutId = setTimeout(() => {
                let reason = `激励视频${timeout}秒显示超时`;
                this.logDebug(reason);
                this.callFail();
                this.logTimeoutEvent(timeout);
            }, timeout * 1000);
        }

        if (!this.mRewardedVideoAdLoaded) {
            this.mRetryCount = 0;
            this.loadRewardedVideoAd();
            return;
        }
        this.showRewardedVideoAdInternal();
    }

    private showRewardedVideoAdInternal() {
        if (!Facebook.isFBInit() || this.mRewardedVideoAd == null || !this.mRewardedVideoAdLoaded) {
            this.callFail();
            return;
        }

        clearTimeout(this.mTimeoutId);
        this.logDebug("激励视频开始显示");
        let rewardedVideoAd = this.mRewardedVideoAd;
        rewardedVideoAd.showAsync().then(() => {
            this.logDebug("激励视频显示成功");
            this.callSuccess();
            this.logShowSuccessEvent();
            this.mRetryCount = 0;
            this.mRewardedVideoAd = null;
            this.loadRewardedVideoAd();
        }).catch((err) => {
            this.mRewardedVideoAd = null;
            this.callFail();
            this.logShowFailEvent(JSON.stringify(err));
            this.logError('激励视频显示失败 : ' + JSON.stringify(err));
        });
        this.mRewardedVideoAd = null;
        this.mRewardedVideoAdLoaded = false;
    }

    public async reloadRewardedVideoAd() {
        if (!this.mRewardedVideoAdLoaded) {
            this.mRetryCount = 0;
            this.loadRewardedVideoAd();
        }
    }

    public isLoaded(): boolean {
        return this.mRewardedVideoAdLoaded;
    }

    private createLogObj() {
        return {
            adUnitId: this.mAdUnitId
        }
    }

    private logCreateEvent() {
        EventUtils.logEvent("reward_create", this.createLogObj());
    }

    private logRequestEvent() {
        EventUtils.logEvent("reward_request", this.createLogObj());
    }

    private logLoadSuccessEvent() {
        EventUtils.logEvent("reward_load_success", this.createLogObj());
    }

    private logLoadFailEvent(reason: string) {
        let logObj = this.createLogObj();
        logObj['reason'] = reason;
        EventUtils.logEvent("reward_load_fail", logObj);
    }

    private logShowSuccessEvent() {
        EventUtils.logEvent("reward_show_success", this.createLogObj());
    }

    private logShowFailEvent(reason: string) {
        let logObj = this.createLogObj();
        logObj['reason'] = reason;
        EventUtils.logEvent("reward_show_fail", logObj);
    }

    private logTimeoutEvent(timeout: number) {
        let logObj = this.createLogObj();
        logObj['loaded'] = this.mRewardedVideoAdLoaded;
        logObj['timeout'] = timeout;
        EventUtils.logEvent("reward_timeout", logObj);
    }

    private logDebug(log?: any) {
        if (this.mLogTag) {
            log = this.mLogTag + "_" + log;
        }
        egret.log(log);
    }

    private logError(log?: any) {
        if (this.mLogTag) {
            log = this.mLogTag + "_" + log;
        }
        egret.error(log);
    }
}
