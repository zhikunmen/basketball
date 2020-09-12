class FacebookPlatform implements platform.IPlatform {

    public init(): void {
        Facebook.init();
    }

    public share(options?: Object, successCallback?: Function, failedCallback?: Function): void {
        if (!Facebook.IsApiSupport("context.chooseAsync")) {
            return;
        }
        let tex: egret.Texture = RES.getRes("img_logo_png");
        let base64 = tex.toDataURL("image/png");
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
    }
    public showAd(): void {
        Facebook.FBPropAd.showRewardedVideoAd();
    }
    public getLeaderboard(): void {
        let rankView = new RankDialog();
        rankView.popUp();
    }
    public setScoreAsync(score: number, extraData?: string): void {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            FacebookRank.getInstance().setScoreToGloalRank(score, extraData);
        } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            FacebookRank.getInstance().setScoreToEndlessRank(score, extraData);
        }
    }

    public getSelfRank(): FacebookPlayerInfoInRank {
        return FacebookRank.getInstance().myRankInGlobal;
    }

    public getTargetOpponentsRank(index: number, score: number): Array<FacebookPlayerInfoInRank> {
        let rankList = FacebookRank.getInstance()._oppentRankList;
        egret.log(rankList)
        let size = rankList.length;
        let start = index * 3 - 3;
        let end = index * 3;
        if (end - 1 < size) {
            return rankList.slice(start, end);
        }
        return null;
    }

    public getOpponentsPassMeRank(index: number, score: number): FacebookPlayerInfoInRank {
        let rankList = FacebookRank.getInstance()._emenyRankList;
        egret.log(rankList)
        let size = rankList.length;
        let pos = index;
        if (pos < size) {
            return rankList[pos];
        }
        return null;
    }

    public saveData(data: Object, successCallback?: Function, failedCallback?: Function) {
        egret.log("saveData:" + data)
        FacebookStorage.getInstance().saveDataToFB(data);
    }
    public getData(keys: Array<string>, successCallback?: Function, failedCallback?: Function) {
    }

}