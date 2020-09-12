var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FacebookStorage = (function () {
    function FacebookStorage() {
    }
    FacebookStorage.getInstance = function () {
        if (FacebookStorage._instance == null) {
            FacebookStorage._instance = new FacebookStorage();
        }
        return FacebookStorage._instance;
    };
    FacebookStorage.prototype.loadItem = function (data, key, defaultValue) {
        var itemValue = data[key];
        if (itemValue != undefined) {
            return itemValue;
        }
        else {
            return defaultValue;
        }
    };
    FacebookStorage.prototype.loadDataFormFB = function (keys, successCallback, failedCallback) {
        if (!Facebook.IsApiSupport("player.getDataAsync")) {
            return;
        }
        FBInstant.player
            .getDataAsync(keys)
            .then(function (data) {
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
    };
    FacebookStorage.prototype.saveDataToFB = function (data, successCallback, failedCallback) {
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
    };
    FacebookStorage.prototype.flushData = function (successCallback, failedCallback) {
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
    };
    FacebookStorage.highestScore = "highestScore";
    FacebookStorage.ownSkin = "ownSkin";
    FacebookStorage.usingSkin = "usingSkin";
    FacebookStorage.GAME_COIN = "gameCoin";
    return FacebookStorage;
}());
__reflect(FacebookStorage.prototype, "FacebookStorage");
