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
var UserManager = (function (_super) {
    __extends(UserManager, _super);
    function UserManager() {
        var _this = _super.call(this) || this;
        _this._maxScore = 0;
        if (GameConfig.gameType == "") {
            _this.uid = GameConfig.testUid;
            _this.avatar_url = "";
            _this.nickname = "test" + GameConfig.testUid;
            _this.gender = "M";
            _this.openId = "test123456openId";
            _this.userInfo = {
                uid: _this.uid,
                gender: _this.gender,
                nickname: _this.nickname,
                openId: _this.openId,
                avatar_url: _this.avatar_url
            };
        }
        return _this;
    }
    UserManager.getInstance = function () {
        if (UserManager.s_instance == null) {
            UserManager.s_instance = new UserManager();
        }
        return UserManager.s_instance;
    };
    UserManager.prototype.getNickname = function () {
        return this.nickname;
    };
    UserManager.prototype.getOpenId = function () {
        return this.openId;
    };
    UserManager.prototype.getUid = function () {
        return this.uid;
    };
    UserManager.prototype.getUserData = function () {
        return JSON.parse(JSON.stringify(this.userInfo));
    };
    Object.defineProperty(UserManager.prototype, "maxScore", {
        get: function () {
            return this._maxScore;
        },
        //最大分数
        set: function (s) {
            this._maxScore = s;
        },
        enumerable: true,
        configurable: true
    });
    UserManager.prototype.setUserData = function (userData) {
        this.avatar_url = userData.iconUrl;
        this.openId = userData.wxOpenId;
        this.nickname = userData.nickName;
        this.gender = userData.gender;
        this.uid = userData.userId;
        this.time = userData.time;
        this.token = userData.token;
        if (userData.thirdUid) {
            this.openId = userData.thirdUid;
        }
        this.userInfo = {
            uid: this.uid,
            gender: this.gender,
            nickname: this.nickname,
            openId: this.openId,
            avatar_url: this.avatar_url
        };
        this.dispatchEventWith(UserManager.USER_DATA_CHANGE);
    };
    UserManager.USER_DATA_CHANGE = "user_data_change";
    return UserManager;
}(egret.EventDispatcher));
__reflect(UserManager.prototype, "UserManager");
