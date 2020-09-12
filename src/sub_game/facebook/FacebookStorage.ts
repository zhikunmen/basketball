class FacebookStorage {

    static highestScore: string = "highestScore";
    static ownSkin: string = "ownSkin";
    static usingSkin: string = "usingSkin";
    static GAME_COIN: string = "gameCoin";

    private static _instance: FacebookStorage;


    public static getInstance(): FacebookStorage {
        if (FacebookStorage._instance == null) {
            FacebookStorage._instance = new FacebookStorage();
        }
        return FacebookStorage._instance;
    }

    loadItem(data: any, key: string, defaultValue: any) {
        let itemValue = data[key];
        if (itemValue != undefined) {
            return itemValue;
        }
        else {
            return defaultValue;
        }
    }

    loadDataFormFB(keys: Array<string>, successCallback?: Function, failedCallback?: Function) {
        if (!Facebook.IsApiSupport("player.getDataAsync")) {
            return;
        }
        FBInstant.player
            .getDataAsync(keys)
            .then(function (data: Object) {
                egret.log('data is loaded');
                if (successCallback) {
                    successCallback(data);
                }

                //发送读取记录完成
                this.fbStorageLoadFinish = true;

            }.bind(this))
            .catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback) {
                    failedCallback();
                }
            });
    }

    public saveDataToFB(data: Object, successCallback?: Function, failedCallback?: Function) {
        if (!Facebook.IsApiSupport("player.setDataAsync")) {
            return;
        }
        FBInstant.player.setDataAsync(data)
            .then(function () {
                egret.log('Data Presaved');
                if (successCallback) {
                    successCallback();
                }
            }.bind(this))
            .catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback) {
                    failedCallback();
                }
            });
    }

    flushData(successCallback?: Function, failedCallback?: Function) {
        if (!Facebook.IsApiSupport("player.flushDataAsync")) {
            return;
        }
        FBInstant.player.flushDataAsync()
            .then(function () {
                egret.log('Data persisted to FB!');
                if (successCallback) {
                    successCallback();
                }
            }.bind(this))
            .catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
                if (failedCallback) {
                    failedCallback();
                }
            });
    }
}
