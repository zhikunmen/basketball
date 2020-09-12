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
var RankDialog = (function (_super) {
    __extends(RankDialog, _super);
    function RankDialog() {
        var _this = _super.call(this) || this;
        _this.isGlobalRank = false;
        _this.arr = new eui.ArrayCollection();
        _this.skinName = "resource/assets/exml/RankDialogView.exml";
        _this.top = _this.bottom = _this.left = _this.right = 0;
        _this.mode = GameConfig.gameMode;
        return _this;
    }
    RankDialog.prototype.addListener = function () {
        GameManager.getInstance().addEventListener(GameManager.REFRESH_RANK, this.loadRankComplete, this);
        this.m_share_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler, this);
        this.m_mode_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.modeHandler, this);
        this.m_back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackPressed, this);
        this.m_gobal_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showGlobalRank, this);
        this.m_friend_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showFriendsRank, this);
    };
    RankDialog.prototype.removeListener = function () {
        GameManager.getInstance().removeEventListener(GameManager.REFRESH_RANK, this.loadRankComplete, this);
        this.m_share_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler, this);
        this.m_mode_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.modeHandler, this);
        this.m_back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackPressed, this);
        this.m_gobal_rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showGlobalRank, this);
        this.m_friend_rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showFriendsRank, this);
    };
    RankDialog.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        this._title.text = this.mode == GameConfig.GameMode.TIME ? "Time Mode Leaderboard" : "Playground Mode Leaderboard";
        this.m_share_btn.text = LanguageManager.instance.getLangeuage(11);
        this.m_gobal_rank.text = LanguageManager.instance.getLangeuage(14);
        this.m_friend_rank.text = LanguageManager.instance.getLangeuage(15);
        this.m_list.itemRenderer = RankItem;
        this.m_list.dataProvider = this.arr;
        var globalRankList;
        if (this.mode == GameConfig.GameMode.TIME) {
            globalRankList = FacebookRank.getInstance()._globalRankList;
        }
        else if (this.mode == GameConfig.GameMode.ENDLESS) {
            globalRankList = FacebookRank.getInstance()._endless_globalRankList;
        }
        if (globalRankList.length > 0) {
            this.isGlobalRank = true;
            this.refreshListView(globalRankList);
        }
        else {
        }
        FacebookRank.getInstance().updateRankList();
    };
    RankDialog.prototype.refreshListView = function (data) {
        // this.arr.removeAll();
        // this.arr.replaceAll(data);
        this.arr.source = data;
        this.arr.refresh();
    };
    RankDialog.prototype.popUp = function () {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    };
    RankDialog.prototype.shareHandler = function (evt) {
        PlatfromUtil.getPlatform().share();
    };
    RankDialog.prototype.modeHandler = function (evt) {
        if (this.mode == GameConfig.GameMode.TIME) {
            this.mode = GameConfig.GameMode.ENDLESS;
        }
        else if (this.mode == GameConfig.GameMode.ENDLESS) {
            this.mode = GameConfig.GameMode.TIME;
        }
        this.loadRankComplete();
    };
    RankDialog.prototype.onBackPressed = function () {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
    };
    RankDialog.prototype.loadRankComplete = function () {
        if (this.isGlobalRank) {
            this.isGlobalRank = false;
            this.showGlobalRank(true);
        }
        else {
            this.isGlobalRank = true;
            this.showFriendsRank(true);
        }
        this._title.text = this.mode == GameConfig.GameMode.TIME ? "Time Mode Leaderboard" : "Playground Mode Leaderboard";
    };
    RankDialog.prototype.showGlobalRank = function (forceupdate) {
        if (forceupdate === void 0) { forceupdate = false; }
        if (this.isGlobalRank && !forceupdate) {
            return;
        }
        this.isGlobalRank = true;
        this.m_global_select.visible = true;
        this.m_friend_unselect.visible = true;
        this.m_global_unselect.visible = false;
        this.m_friend_select.visible = false;
        // this.m_gobal_rank.textColor = 0xffffff;
        // this.m_gobal_rank.strokeColor = 0x003a75;
        // this.m_friend_rank.textColor = 0x8e5701;
        // this.m_friend_rank.strokeColor = 0xfff09a;
        var rankList;
        if (this.mode == GameConfig.GameMode.TIME) {
            rankList = FacebookRank.getInstance()._globalRankList;
        }
        else if (this.mode == GameConfig.GameMode.ENDLESS) {
            rankList = FacebookRank.getInstance()._endless_globalRankList;
        }
        this.refreshListView(rankList);
    };
    RankDialog.prototype.showFriendsRank = function (forceupdate) {
        if (forceupdate === void 0) { forceupdate = false; }
        if (!this.isGlobalRank && !forceupdate) {
            return;
        }
        this.isGlobalRank = false;
        this.m_friend_select.visible = true;
        this.m_global_unselect.visible = true;
        this.m_friend_unselect.visible = false;
        this.m_global_select.visible = false;
        // this.m_gobal_rank.textColor = 0x8e5701;
        // this.m_gobal_rank.strokeColor = 0xfff09a;
        // this.m_friend_rank.textColor = 0xffffff
        // this.m_friend_rank.strokeColor = 0x003a75;
        var rankList;
        if (this.mode == GameConfig.GameMode.TIME) {
            rankList = FacebookRank.getInstance()._friendRankList;
        }
        else if (this.mode == GameConfig.GameMode.ENDLESS) {
            rankList = FacebookRank.getInstance()._endless_friendRankList;
        }
        this.refreshListView(rankList);
    };
    return RankDialog;
}(core.EUIComponent));
__reflect(RankDialog.prototype, "RankDialog");
