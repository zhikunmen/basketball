class RankDialog extends core.EUIComponent {


    public _title: eui.Label;
    public m_list: eui.List;
    public m_share_btn: eui.Label;
    public m_mode_btn: eui.Label;
    public m_back_btn: eui.Image;
    public m_gobal_rank: eui.Label;
    public m_friend_rank: eui.Label;
    public m_global_unselect: eui.Image;
    public m_friend_select: eui.Image;
    public m_global_select: eui.Image;
    public m_friend_unselect: eui.Image;

    private isGlobalRank: boolean = false;
    private mode: GameConfig.GameMode;

    public constructor() {
        super();
        this.skinName = "resource/assets/exml/RankDialogView.exml";
        this.top = this.bottom = this.left = this.right = 0;
        this.mode = GameConfig.gameMode;
    }

    protected addListener(): void {
        GameManager.getInstance().addEventListener(GameManager.REFRESH_RANK, this.loadRankComplete, this);
        this.m_share_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler, this);
        this.m_mode_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.modeHandler, this);
        this.m_back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackPressed, this);
        this.m_gobal_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showGlobalRank, this);
        this.m_friend_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showFriendsRank, this);
    }

    protected removeListener(): void {
        GameManager.getInstance().removeEventListener(GameManager.REFRESH_RANK, this.loadRankComplete, this);
        this.m_share_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler, this);
        this.m_mode_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.modeHandler, this);
        this.m_back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackPressed, this);
        this.m_gobal_rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showGlobalRank, this);
        this.m_friend_rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showFriendsRank, this);
    }
    private arr: eui.ArrayCollection = new eui.ArrayCollection();
    protected onShow(event?: egret.Event) {
        super.onShow(event);

        this._title.text = this.mode == GameConfig.GameMode.TIME ? "Time Mode Leaderboard" : "Playground Mode Leaderboard";
        this.m_share_btn.text = LanguageManager.instance.getLangeuage(11);
        this.m_gobal_rank.text = LanguageManager.instance.getLangeuage(14);
        this.m_friend_rank.text = LanguageManager.instance.getLangeuage(15);

        this.m_list.itemRenderer = RankItem;
        this.m_list.dataProvider = this.arr;
        let globalRankList;
        if (this.mode == GameConfig.GameMode.TIME) {
            globalRankList = FacebookRank.getInstance()._globalRankList;
        } else if (this.mode == GameConfig.GameMode.ENDLESS) {
            globalRankList = FacebookRank.getInstance()._endless_globalRankList;
        }
        if (globalRankList.length > 0) {
            this.isGlobalRank = true;
            this.refreshListView(globalRankList);
        } else {

        }
        FacebookRank.getInstance().updateRankList();
    }

    private refreshListView(data: Array<FacebookPlayerInfoInRank>) {
        // this.arr.removeAll();
        // this.arr.replaceAll(data);
        this.arr.source = data;
        this.arr.refresh()
    }

    public popUp(): void {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    }

    private shareHandler(evt: egret.Event): void {
        PlatfromUtil.getPlatform().share();
    }

    private modeHandler(evt: egret.Event): void {
        if (this.mode == GameConfig.GameMode.TIME) {
            this.mode = GameConfig.GameMode.ENDLESS;
        } else if (this.mode == GameConfig.GameMode.ENDLESS) {
            this.mode = GameConfig.GameMode.TIME;
        }
        this.loadRankComplete();
    }

    private onBackPressed() {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
    }

    private loadRankComplete() {
        if (this.isGlobalRank) {
            this.isGlobalRank = false;
            this.showGlobalRank(true);
        } else {
            this.isGlobalRank = true;
            this.showFriendsRank(true);
        }
        this._title.text = this.mode == GameConfig.GameMode.TIME ? "Time Mode Leaderboard" : "Playground Mode Leaderboard";
    }

    private showGlobalRank(forceupdate: boolean = false) {
        if (this.isGlobalRank && !forceupdate) {//已经显示全球排行榜数据
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

        let rankList;
        if (this.mode == GameConfig.GameMode.TIME) {
            rankList = FacebookRank.getInstance()._globalRankList;
        } else if (this.mode == GameConfig.GameMode.ENDLESS) {
            rankList = FacebookRank.getInstance()._endless_globalRankList;
        }
        this.refreshListView(rankList);
    }

    private showFriendsRank(forceupdate: boolean = false) {
        if (!this.isGlobalRank && !forceupdate) {//已经显示好友排行榜数据
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
        let rankList;
        if (this.mode == GameConfig.GameMode.TIME) {
            rankList = FacebookRank.getInstance()._friendRankList;
        } else if (this.mode == GameConfig.GameMode.ENDLESS) {
            rankList = FacebookRank.getInstance()._endless_friendRankList;
        }
        this.refreshListView(rankList);
    }

}