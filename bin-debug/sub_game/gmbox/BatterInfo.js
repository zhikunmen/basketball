var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**数据管理 */
var BatterInfo = (function (_super) {
    __extends(BatterInfo, _super);
    function BatterInfo() {
        var _this = _super.call(this) || this;
        /**是否是机器人 */
        _this.isRobot = true;
        _this._mikeStatus = new Map();
        return _this;
    }
    Object.defineProperty(BatterInfo, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new BatterInfo();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    BatterInfo.prototype.init = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.myUserInfo) {
                resolve();
            }
            else {
                gmbox.login({
                    loginOpts: {
                        "appId": "10115674281540328553"
                    },
                    success: function (info) {
                        _this.myUserInfo = info;
                        egret.error(info);
                        resolve();
                    }
                });
            }
        });
    };
    Object.defineProperty(BatterInfo.prototype, "otherUserInfo", {
        get: function () {
            return this._otherUserInfo;
        },
        /**对手数据 */
        set: function (value) {
            if (value.type == 1) {
                this.isRobot = true;
            }
            this._otherUserInfo = value;
        },
        enumerable: true,
        configurable: true
    });
    BatterInfo.prototype.setMikeStatus = function (res) {
        var userId = res.userId;
        var status = res.status;
        this._mikeStatus.set(userId, status);
    };
    return BatterInfo;
}(egret.EventDispatcher));
__reflect(BatterInfo.prototype, "BatterInfo");
