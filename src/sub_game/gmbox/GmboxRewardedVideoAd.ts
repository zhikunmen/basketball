class GmboxRewardedVideoAd {

    private mAdUnitId = null;
    private mVideoAds = null;
    private mRewardedVideoAdLoading = false;
    private mRewardedVideoAdLoaded = false;
    private mSuccessCallback = null;
    private mFailCallback = null;
    private mOnLoadSuccess = null;
    private mRetryCount = 0;
    private mRetryId;
    private mTimeoutId;

    constructor(adUnitId: string) {
        if (!GmboxRewardedVideoAd.isValid()) return;
        this.mAdUnitId = adUnitId;
        this.mVideoAds = gmbox["createRewardedVideoAd"]({
            adUnitId: adUnitId
        })

        this.mVideoAds.onClose((status) => {
            let isEnded: boolean = !status || status.isEnded
            this.logDebug("激励视频关闭 是否播放完成 = " + isEnded);
            if (isEnded) {
                this.callSuccess();
            } else {
                this.callFail();
            }
            this.logCloseEvent(isEnded);
            this.mRetryCount = 0;
            this.loadRewardedVideoAd();
        })
        this.loadRewardedVideoAd();
    }

    public static isValid(): boolean {
        if (typeof gmbox != 'undefined' && gmbox["createRewardedVideoAd"]) {
            return true;
        }
        return false;
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
        if (this.mVideoAds == null) {
            this.callFail();
            return;
        }
        if (this.mRewardedVideoAdLoading) {
            this.logDebug("激励视频正在加载");
            return;
        }
        if (this.mRewardedVideoAdLoaded) {
            this.callLoad();
            return;
        }
        this.logDebug("激励视频开始加载");
        this.mRewardedVideoAdLoading = true;
        this.mRewardedVideoAdLoaded = false;
        this.logRequestEvent();
        this.mVideoAds.load().then(() => {
            this.mRewardedVideoAdLoading = false;
            this.mRewardedVideoAdLoaded = true;
            this.mRetryCount = 0;
            this.logDebug("激励视频加载完成");
            this.callLoad();
            this.logLoadSuccessEvent();
        }).catch((err) => {
            this.mRewardedVideoAdLoading = false;
            this.mRewardedVideoAdLoaded = false;
            this.logDebug('激励视频加载失败 : ' + JSON.stringify(err));
            this.mRetryCount++;
            this.logLoadFailEvent(JSON.stringify(err));
            if (this.mRetryCount > 3) {
                this.logError("激励视频失败次数太多");
                this.callFail();
                return;
            }
            this.mRetryId = setTimeout(() => {
                this.loadRewardedVideoAd();
            }, 10000 * this.mRetryCount);
        });
    }

    public isLoaded(): boolean {
        return this.mRewardedVideoAdLoaded;
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
        if (this.mVideoAds == null) {
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
        if (this.mVideoAds == null || !this.mRewardedVideoAdLoaded) {
            this.callFail();
            return;
        }

        this.logDebug("激励视频开始显示");
        this.mVideoAds.show().then(() => {
            this.logDebug("激励视频显示成功");
            this.logShowSuccessEvent();
        }).catch((err) => {
            this.callFail();
            this.logShowFailEvent(JSON.stringify(err));
            this.logError('激励视频显示失败 : ' + JSON.stringify(err));
        });
        this.mRewardedVideoAdLoaded = false;
    }

    public async reloadRewardedVideoAd() {
        if (!this.mRewardedVideoAdLoaded) {
            this.mRetryCount = 0;
            this.loadRewardedVideoAd();
        }
    }

    private createLogObj() {
        return {
            adUnitId: this.mAdUnitId
        }
    }

    private logRequestEvent() {
        if(EventUtils != undefined) {
            EventUtils.logEvent("reward_request", this.createLogObj());
        }
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

    private logCloseEvent(isEnded: boolean) {
        let logObj = this.createLogObj();
        logObj['isEnded'] = isEnded;
        EventUtils.logEvent("reward_close", logObj);
    }

    private logDebug(log?: any) {
        log = "Gmbox_" + log;
        egret.log(log);
    }

    private logError(log?: any) {
        log = "Gmbox_" + log;
        egret.error(log);
    }
}
