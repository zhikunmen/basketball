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
var LobbyView = (function (_super) {
    __extends(LobbyView, _super);
    function LobbyView() {
        var _this = _super.call(this) || this;
        _this.isGetSkin = false;
        /**
         * 显示
         */
        _this.inter = 0;
        _this.skinName = "LoginViewexml";
        return _this;
    }
    LobbyView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
        EventUtils.logEvent("launch_lobbyUI");
    };
    LobbyView.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this);
        if (typeof gmbox != 'undefined') {
            gmbox.updateActionView({ action: 2 });
        }
        SoundMgr.getInstance();
        SkinManager.getInstance();
        this.getFirstInfo();
        this.initLabel();
        this.initSound();
        TweenUtil.playTweenGroup(this.tween, true);
    };
    LobbyView.prototype.initSound = function () {
        if (GameConfig.soundSwitch) {
            this.m_sound_btn.source = "img_shengyin_png";
            // SoundMgr.getInstance().playBGM();
        }
        else {
            this.m_sound_btn.source = "img_shengyin2_png";
            // SoundMgr.getInstance().stopBGM();
        }
    };
    LobbyView.prototype.initLabel = function () {
        this._rank_label.text = LanguageManager.instance.getLangeuage(9);
        this._skin_label.text = LanguageManager.instance.getLangeuage(10);
    };
    LobbyView.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this);
        if (typeof gmbox != 'undefined') {
            gmbox.updateActionView({ action: 1 });
        }
        egret.clearInterval(this.inter);
        TweenUtil.stopTweenGroup(this.tween);
    };
    /**
     * 添加监听
     */
    LobbyView.prototype.addListener = function () {
        this.m_game_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goGameHandler, this);
        this.m_mode_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeMode, this);
        this.m_rank_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rankHandler, this);
        this.m_skin_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.skinsHandler, this);
        this.m_sound_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSound, this);
        this.m_vibrate_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changedVibrate, this);
    };
    /**
     * 删除监听
     */
    LobbyView.prototype.removeListener = function () {
        this.m_game_group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goGameHandler, this);
        this.m_mode_group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.changeMode, this);
        this.m_rank_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rankHandler, this);
        this.m_skin_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.skinsHandler, this);
        this.m_sound_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSound, this);
    };
    //开始游戏
    LobbyView.prototype.goGameHandler = function (evt) {
        EventUtils.logEvent("click_playGame");
        GlobalManager.getInstance().goGame();
    };
    //切换模式
    LobbyView.prototype.changeMode = function (evt) {
        EventUtils.logEvent("click_changeMode");
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            GameConfig.gameMode = GameConfig.GameMode.ENDLESS;
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            GameConfig.gameMode = GameConfig.GameMode.TIME;
        }
        localStorage.setItem("mode", JSON.stringify({
            "mode": GameConfig.gameMode
        }));
        this.updateBg();
    };
    //排行
    LobbyView.prototype.rankHandler = function (evt) {
        EventUtils.logEvent("click_rank");
        if (Facebook.isFBInit()) {
            core.ResUtils.loadGroups(["rank"], function (progress) {
            }, function (fail) {
            }, function (loadComplete) {
                PlatfromUtil.getPlatform().getLeaderboard();
            }, this);
        }
        else {
            gmbox.openRankPage();
        }
    };
    //分享
    LobbyView.prototype.shareHandler = function (evt) {
        EventUtils.logEvent("click_share");
        PlatfromUtil.getPlatform().share();
    };
    //皮肤
    LobbyView.prototype.skinsHandler = function (evt) {
        EventUtils.logEvent("click_skin");
        core.ResUtils.loadGroups(["skin"], function (progress) {
        }, function (fail) {
        }, function (loadComplete) {
            new ChangeSkinView().popUp(true);
        }, this);
        // let skinsView: SkinDialog = new SkinDialog();
        // skinsView.popUp();
    };
    LobbyView.prototype.updateBg = function () {
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this.m_mode_name.text = "Time Mode";
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            this.m_mode_name.text = "Fun Mode";
        }
    };
    //声音
    LobbyView.prototype.changeSound = function (evt) {
        GameConfig.soundSwitch = !GameConfig.soundSwitch;
        this.updateSound();
        // PlatfromUtil.getPlatform().saveData({
        // 	"soundSwitch": GameConfig.soundSwitch
        // });
        localStorage.setItem("soundSwitch", JSON.stringify({
            "soundSwitch": GameConfig.soundSwitch
        }));
    };
    LobbyView.prototype.updateSound = function () {
        if (GameConfig.soundSwitch) {
            this.m_sound_btn.source = "img_shengyin_png";
            SoundMgr.getInstance().playBGM();
        }
        else {
            this.m_sound_btn.source = "img_shengyin2_png";
            SoundMgr.getInstance().stopBGM();
        }
    };
    LobbyView.prototype.changedVibrate = function (evt) {
        GameConfig.vibrateSwitch = !GameConfig.vibrateSwitch;
        if (GameConfig.vibrateSwitch) {
            this.m_vibrate_btn.source = "img_zhengdong1_png";
        }
        else {
            this.m_vibrate_btn.source = "img_zhengdong2_png";
        }
    };
    LobbyView.prototype.release = function () {
        _super.prototype.release.call(this);
        TweenUtil.stopTweenGroup(this.tween);
    };
    LobbyView.prototype.getLocalData = function () {
        var mode = localStorage.getItem("mode");
        if (mode == undefined || mode == "") {
            GameConfig.gameMode = GameConfig.GameMode.TIME;
        }
        else {
            GameConfig.gameMode = JSON.parse(mode).mode;
            this.updateBg();
        }
        var showTips = localStorage.getItem("showTips");
        if (showTips == undefined || showTips == "") {
            GameConfig.showTips = true;
        }
        else {
            GameConfig.showTips = JSON.parse(showTips).showTips;
        }
        var soundSwitch = localStorage.getItem("soundSwitch");
        if (soundSwitch == undefined || soundSwitch == "") {
            GameConfig.soundSwitch = true;
            this.updateSound();
        }
        else {
            GameConfig.soundSwitch = JSON.parse(soundSwitch).soundSwitch;
            this.updateSound();
        }
    };
    LobbyView.prototype.readDataFromFacebook = function () {
        var manager = GameManager.getInstance().baskectBallManager;
        FacebookStorage.getInstance().loadDataFormFB(['gameCoin', 'ownSkin', 'usingSkin', 'rankScore'], function (data) {
            egret.log(data);
            if (data.gameCoin == undefined) {
                manager.coinsNumber = 0;
            }
            else {
                manager.coinsNumber = data.gameCoin;
            }
            if (data.ownSkin == undefined) {
                manager.skinInfo = ["0"];
            }
            else {
                manager.skinInfo = data.ownSkin.split(",");
            }
            if (data.usingSkin == undefined) {
                manager.use = 0;
            }
            else {
                manager.use = data.usingSkin;
            }
            if (data.rankScore == undefined) {
                manager.rankScore = 0;
            }
            else {
                manager.rankScore = data.rankScore;
            }
        });
    };
    LobbyView.prototype.readDataFromLocal = function () {
        var manager = GameManager.getInstance().baskectBallManager;
        var gameCoin = localStorage.getItem("gameCoin");
        if (gameCoin == undefined || gameCoin == "") {
            manager.coinsNumber = 0;
        }
        else {
            manager.coinsNumber = JSON.parse(gameCoin).gameCoin;
        }
        var ownSkin = localStorage.getItem("ownSkin");
        if (ownSkin == undefined || ownSkin == "") {
            manager.skinInfo = ["0"];
        }
        else {
            manager.skinInfo = JSON.parse(ownSkin).ownSkin.split(",");
        }
        var usingSkin = localStorage.getItem("usingSkin");
        if (usingSkin == undefined || usingSkin == "") {
            manager.use = 0;
        }
        else {
            manager.use = JSON.parse(usingSkin).usingSkin;
        }
        var rankScore = localStorage.getItem("rankScore");
        if (rankScore == undefined || rankScore == "") {
            manager.rankScore = 0;
        }
        else {
            manager.rankScore = JSON.parse(rankScore).rankScore;
        }
    };
    LobbyView.prototype.getFirstInfo = function () {
        this.getLocalData();
        if (Facebook.isFBInit()) {
            this.readDataFromFacebook();
        }
        else {
            this.readDataFromLocal();
        }
    };
    return LobbyView;
}(core.EUIComponent));
__reflect(LobbyView.prototype, "LobbyView");
