var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FacebookPlatform = (function () {
    function FacebookPlatform() {
    }
    FacebookPlatform.prototype.init = function () {
        Facebook.init();
    };
    FacebookPlatform.prototype.share = function (options, successCallback, failedCallback) {
        if (!Facebook.IsApiSupport("context.chooseAsync")) {
            return;
        }
        var tex = RES.getRes("img_logo_png");
        var base64 = tex.toDataURL("image/png");
        FBInstant.context.chooseAsync(options)
            .then(function () {
            Facebook.FBPlatformInfo.RefreshContextInfo();
            egret.log("updateAsync");
            FBInstant.updateAsync({
                action: 'CUSTOM',
                cta: 'I wants to play On The Clock with you!',
                image: base64,
                text: 'Play On The Clock with me',
                template: 'play_turn',
                data: { myReplayData: 'nice' },
                strategy: 'IMMEDIATE',
                notification: 'NO_PUSH',
            })
                .then(function () {
                egret.log("customUpdate finish");
                if (successCallback) {
                    successCallback();
                }
            }).catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback) {
                    failedCallback(err);
                }
            });
            // });
            if (successCallback) {
                successCallback();
            }
        }).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
            if (failedCallback) {
                failedCallback(err);
            }
        });
    };
    FacebookPlatform.prototype.showAd = function () {
        Facebook.FBPropAd.showRewardedVideoAd();
    };
    FacebookPlatform.prototype.getLeaderboard = function () {
        var rankView = new RankDialog();
        rankView.popUp();
    };
    FacebookPlatform.prototype.setScoreAsync = function (score, extraData) {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            FacebookRank.getInstance().setScoreToGloalRank(score, extraData);
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            FacebookRank.getInstance().setScoreToEndlessRank(score, extraData);
        }
    };
    FacebookPlatform.prototype.getSelfRank = function () {
        return FacebookRank.getInstance().myRankInGlobal;
    };
    FacebookPlatform.prototype.getTargetOpponentsRank = function (index, score) {
        var rankList = FacebookRank.getInstance()._oppentRankList;
        egret.log(rankList);
        var size = rankList.length;
        var start = index * 3 - 3;
        var end = index * 3;
        if (end - 1 < size) {
            return rankList.slice(start, end);
        }
        return null;
    };
    FacebookPlatform.prototype.getOpponentsPassMeRank = function (index, score) {
        var rankList = FacebookRank.getInstance()._emenyRankList;
        egret.log(rankList);
        var size = rankList.length;
        var pos = index;
        if (pos < size) {
            return rankList[pos];
        }
        return null;
    };
    FacebookPlatform.prototype.saveData = function (data, successCallback, failedCallback) {
        egret.log("saveData:" + data);
        FacebookStorage.getInstance().saveDataToFB(data);
    };
    FacebookPlatform.prototype.getData = function (keys, successCallback, failedCallback) {
    };
    return FacebookPlatform;
}());
__reflect(FacebookPlatform.prototype, "FacebookPlatform", ["platform.IPlatform"]);
