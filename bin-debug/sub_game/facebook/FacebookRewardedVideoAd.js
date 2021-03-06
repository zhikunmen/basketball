var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var FacebookRewardedVideoAd = (function () {
    function FacebookRewardedVideoAd(adUnitId, logTag) {
        if (logTag === void 0) { logTag = null; }
        this.mLogTag = null;
        this.mAdUnitId = null;
        this.mRewardedVideoAd = null;
        this.mRewardedVideoAdLoading = false;
        this.mRewardedVideoAdLoaded = false;
        this.mSuccessCallback = null;
        this.mFailCallback = null;
        this.mOnLoadSuccess = null;
        this.mRetryCount = 0;
        this.mAdUnitId = adUnitId;
        this.mLogTag = logTag;
        this.init();
    }
    FacebookRewardedVideoAd.prototype.init = function () {
        if (!Facebook.isFBInit()) {
            return;
        }
        this.loadRewardedVideoAd();
    };
    FacebookRewardedVideoAd.prototype.callSuccess = function () {
        if (this.mSuccessCallback) {
            this.mSuccessCallback();
        }
        this.resetCall();
        clearTimeout(this.mTimeoutId);
    };
    FacebookRewardedVideoAd.prototype.callFail = function () {
        if (this.mFailCallback) {
            this.mFailCallback();
        }
        this.resetCall();
        clearTimeout(this.mTimeoutId);
    };
    FacebookRewardedVideoAd.prototype.resetCall = function () {
        this.mSuccessCallback = null;
        this.mFailCallback = null;
        this.mOnLoadSuccess = null;
    };
    FacebookRewardedVideoAd.prototype.callLoad = function () {
        if (this.mOnLoadSuccess) {
            this.mOnLoadSuccess();
        }
    };
    FacebookRewardedVideoAd.prototype.loadRewardedVideoAd = function () {
        var _this = this;
        clearTimeout(this.mRetryId);
        if (!Facebook.IsApiSupport("getRewardedVideoAsync")) {
            this.callFail();
            return;
        }
        if (this.mRewardedVideoAdLoading) {
            if (this.mRewardedVideoAd == null) {
                this.logDebug("激励视频正在创建");
            }
            else {
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
            FBInstant.getRewardedVideoAsync(this.mAdUnitId).then(function (rewardedVideo) {
                _this.mRewardedVideoAd = rewardedVideo;
                _this.logDebug("激励视频创建完成" + _this.mRetryCount);
                _this.loadRewardedVideoAdInternal();
            }).catch(function (err) {
                _this.onLoadFail(err);
                _this.logLoadFailEvent(JSON.stringify(err));
            });
        }
        else {
            this.loadRewardedVideoAdInternal();
        }
    };
    FacebookRewardedVideoAd.prototype.loadRewardedVideoAdInternal = function () {
        var _this = this;
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
        this.mRewardedVideoAd.loadAsync().then(function () {
            _this.logDebug("激励视频加载完成" + _this.mRetryCount);
            _this.mRewardedVideoAdLoading = false;
            _this.mRewardedVideoAdLoaded = true;
            _this.mRetryCount = 0;
            _this.callLoad();
            _this.logLoadSuccessEvent();
        }).catch(function (err) {
            _this.onLoadFail(err);
            _this.logLoadFailEvent(JSON.stringify(err));
        });
    };
    FacebookRewardedVideoAd.prototype.onLoadFail = function (err) {
        var _this = this;
        this.mRewardedVideoAdLoading = false;
        this.mRewardedVideoAdLoaded = false;
        if (this.mRewardedVideoAd == null) {
            this.logDebug('激励视频创建失败 : ' + JSON.stringify(err));
        }
        else {
            this.logDebug('激励视频加载失败 : ' + JSON.stringify(err));
        }
        this.mRetryCount++;
        if (this.mRetryCount > 3) {
            this.logError("激励视频失败次数太多");
            this.callFail();
            return;
        }
        this.mRetryId = setTimeout(function () {
            _this.loadRewardedVideoAd();
        }, 10000 * this.mRetryCount);
    };
    FacebookRewardedVideoAd.prototype.abandonShow = function () {
        this.logDebug("激励视频放弃显示");
        this.resetCall();
    };
    FacebookRewardedVideoAd.prototype.showRewardedVideoAd = function (successCallback, failCallback, timeout) {
        var _this = this;
        if (successCallback === void 0) { successCallback = null; }
        if (failCallback === void 0) { failCallback = null; }
        if (timeout === void 0) { timeout = 5; }
        this.logDebug("激励视频请求显示");
        this.mSuccessCallback = successCallback;
        this.mFailCallback = failCallback;
        clearTimeout(this.mTimeoutId);
        this.mOnLoadSuccess = function () {
            _this.showRewardedVideoAdInternal();
        };
        if (!Facebook.isFBInit()) {
            this.callFail();
            return;
        }
        if (timeout > 0) {
            this.mTimeoutId = setTimeout(function () {
                var reason = "\u6FC0\u52B1\u89C6\u9891" + timeout + "\u79D2\u663E\u793A\u8D85\u65F6";
                _this.logDebug(reason);
                _this.callFail();
                _this.logTimeoutEvent(timeout);
            }, timeout * 1000);
        }
        if (!this.mRewardedVideoAdLoaded) {
            this.mRetryCount = 0;
            this.loadRewardedVideoAd();
            return;
        }
        this.showRewardedVideoAdInternal();
    };
    FacebookRewardedVideoAd.prototype.showRewardedVideoAdInternal = function () {
        var _this = this;
        if (!Facebook.isFBInit() || this.mRewardedVideoAd == null || !this.mRewardedVideoAdLoaded) {
            this.callFail();
            return;
        }
        clearTimeout(this.mTimeoutId);
        this.logDebug("激励视频开始显示");
        var rewardedVideoAd = this.mRewardedVideoAd;
        rewardedVideoAd.showAsync().then(function () {
            _this.logDebug("激励视频显示成功");
            _this.callSuccess();
            _this.logShowSuccessEvent();
            _this.mRetryCount = 0;
            _this.mRewardedVideoAd = null;
            _this.loadRewardedVideoAd();
        }).catch(function (err) {
            _this.mRewardedVideoAd = null;
            _this.callFail();
            _this.logShowFailEvent(JSON.stringify(err));
            _this.logError('激励视频显示失败 : ' + JSON.stringify(err));
        });
        this.mRewardedVideoAd = null;
        this.mRewardedVideoAdLoaded = false;
    };
    FacebookRewardedVideoAd.prototype.reloadRewardedVideoAd = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.mRewardedVideoAdLoaded) {
                    this.mRetryCount = 0;
                    this.loadRewardedVideoAd();
                }
                return [2 /*return*/];
            });
        });
    };
    FacebookRewardedVideoAd.prototype.isLoaded = function () {
        return this.mRewardedVideoAdLoaded;
    };
    FacebookRewardedVideoAd.prototype.createLogObj = function () {
        return {
            adUnitId: this.mAdUnitId
        };
    };
    FacebookRewardedVideoAd.prototype.logCreateEvent = function () {
        EventUtils.logEvent("reward_create", this.createLogObj());
    };
    FacebookRewardedVideoAd.prototype.logRequestEvent = function () {
        EventUtils.logEvent("reward_request", this.createLogObj());
    };
    FacebookRewardedVideoAd.prototype.logLoadSuccessEvent = function () {
        EventUtils.logEvent("reward_load_success", this.createLogObj());
    };
    FacebookRewardedVideoAd.prototype.logLoadFailEvent = function (reason) {
        var logObj = this.createLogObj();
        logObj['reason'] = reason;
        EventUtils.logEvent("reward_load_fail", logObj);
    };
    FacebookRewardedVideoAd.prototype.logShowSuccessEvent = function () {
        EventUtils.logEvent("reward_show_success", this.createLogObj());
    };
    FacebookRewardedVideoAd.prototype.logShowFailEvent = function (reason) {
        var logObj = this.createLogObj();
        logObj['reason'] = reason;
        EventUtils.logEvent("reward_show_fail", logObj);
    };
    FacebookRewardedVideoAd.prototype.logTimeoutEvent = function (timeout) {
        var logObj = this.createLogObj();
        logObj['loaded'] = this.mRewardedVideoAdLoaded;
        logObj['timeout'] = timeout;
        EventUtils.logEvent("reward_timeout", logObj);
    };
    FacebookRewardedVideoAd.prototype.logDebug = function (log) {
        if (this.mLogTag) {
            log = this.mLogTag + "_" + log;
        }
        egret.log(log);
    };
    FacebookRewardedVideoAd.prototype.logError = function (log) {
        if (this.mLogTag) {
            log = this.mLogTag + "_" + log;
        }
        egret.error(log);
    };
    return FacebookRewardedVideoAd;
}());
__reflect(FacebookRewardedVideoAd.prototype, "FacebookRewardedVideoAd");
