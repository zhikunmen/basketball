class LobbyView extends core.EUIComponent {

	public tween: egret.tween.TweenGroup;

	public m_bg: eui.Image;
	public m_back_btn: eui.Image;
	public m_sound_btn: eui.Image;
	public m_vibrate_btn: eui.Image;
	public m_rank_btn: eui.Image;
	public m_skin_btn: eui.Image;
	public m_game_group: eui.Group;
	public m_mode_group: eui.Group;
	public m_mode_name: eui.Label;


	public _rank_label: eui.Label;
	public _skin_label: eui.Label;

	public isGetSkin: boolean = false;

	private _adIcon: eui.Image;

	public constructor() {
		super();
		this.skinName = "LoginViewexml";
	}

	public childrenCreated() {
		super.childrenCreated();

		this.left = 0;
		this.right = 0;
		this.top = 0;
		this.bottom = 0;
		EventUtils.logEvent("launch_lobbyUI");
	}

	/**
	 * 显示
	 */
	private inter: number = 0;
	protected onShow(event?: egret.Event): void {
		super.onShow();
		if (typeof gmbox != 'undefined') {
			gmbox.updateActionView({ action: 2 })
		}
		SoundMgr.getInstance();
		SkinManager.getInstance();
		this.getFirstInfo();
		this.initLabel();
		this.initSound();
		TweenUtil.playTweenGroup(this.tween, true);
	}

	private initSound() {
		if (GameConfig.soundSwitch) {
			this.m_sound_btn.source = "img_shengyin_png"
			// SoundMgr.getInstance().playBGM();
		} else {
			this.m_sound_btn.source = "img_shengyin2_png"
			// SoundMgr.getInstance().stopBGM();
		}
	}

	private initLabel(): void {
		this._rank_label.text = LanguageManager.instance.getLangeuage(9);
		this._skin_label.text = LanguageManager.instance.getLangeuage(10);
	}

	protected onHide(event?: egret.Event): void {
		super.onHide();
		if (typeof gmbox != 'undefined') {
			gmbox.updateActionView({ action: 1 })
		}
		egret.clearInterval(this.inter);
		TweenUtil.stopTweenGroup(this.tween);
	}
	/**
	 * 添加监听
	 */
	protected addListener(): void {
		this.m_game_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goGameHandler, this);
		this.m_mode_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeMode, this);
		this.m_rank_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rankHandler, this);
		this.m_skin_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.skinsHandler, this);
		this.m_sound_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSound, this);
		this.m_vibrate_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changedVibrate, this);
	}

	/**
	 * 删除监听
	 */
	protected removeListener(): void {
		this.m_game_group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goGameHandler, this);
		this.m_mode_group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.changeMode, this);
		this.m_rank_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rankHandler, this);
		this.m_skin_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.skinsHandler, this);
		this.m_sound_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSound, this);
	}

	//开始游戏
	private goGameHandler(evt: egret.Event): void {
		EventUtils.logEvent("click_playGame")
		GlobalManager.getInstance().goGame();
	}

	//切换模式
	private changeMode(evt: egret.Event): void {
		EventUtils.logEvent("click_changeMode")
		if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
			GameConfig.gameMode = GameConfig.GameMode.ENDLESS;
		} else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
			GameConfig.gameMode = GameConfig.GameMode.TIME;
		}
		localStorage.setItem("mode", JSON.stringify({
			"mode": GameConfig.gameMode
		}));
		this.updateBg();
	}

	//排行
	private rankHandler(evt: egret.Event): void {
		EventUtils.logEvent("click_rank")
		if (Facebook.isFBInit()) {
			core.ResUtils.loadGroups(["rank"], (progress) => {
			}, (fail) => {
			}, (loadComplete) => {
				PlatfromUtil.getPlatform().getLeaderboard();
			}, this);
		} else {
			gmbox.openRankPage();
		}
	}

	//分享
	private shareHandler(evt: egret.Event): void {
		EventUtils.logEvent("click_share")
		PlatfromUtil.getPlatform().share();
	}

	//皮肤
	private skinsHandler(evt: egret.Event): void {
		EventUtils.logEvent("click_skin")
		core.ResUtils.loadGroups(["skin"], (progress) => {
		}, (fail) => {
		}, (loadComplete) => {
			new ChangeSkinView().popUp(true);
		}, this);

		// let skinsView: SkinDialog = new SkinDialog();
		// skinsView.popUp();
	}

	private updateBg() {
		if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
			this.m_mode_name.text = "Time Mode"
		} else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
			this.m_mode_name.text = "Fun Mode"
		}
	}

	//声音
	private changeSound(evt: egret.Event): void {
		GameConfig.soundSwitch = !GameConfig.soundSwitch;
		this.updateSound();
		// PlatfromUtil.getPlatform().saveData({
		// 	"soundSwitch": GameConfig.soundSwitch
		// });
		localStorage.setItem("soundSwitch", JSON.stringify({
			"soundSwitch": GameConfig.soundSwitch
		}));
	}

	private updateSound(): void {
		if (GameConfig.soundSwitch) {
			this.m_sound_btn.source = "img_shengyin_png"
			SoundMgr.getInstance().playBGM();
		} else {
			this.m_sound_btn.source = "img_shengyin2_png"
			SoundMgr.getInstance().stopBGM();
		}
	}

	private changedVibrate(evt: egret.Event): void {
		GameConfig.vibrateSwitch = !GameConfig.vibrateSwitch;
		if (GameConfig.vibrateSwitch) {
			this.m_vibrate_btn.source = "img_zhengdong1_png"
		} else {
			this.m_vibrate_btn.source = "img_zhengdong2_png"
		}
	}

	public release() {
		super.release();
		TweenUtil.stopTweenGroup(this.tween);
	}

	private getLocalData() {
		let mode = localStorage.getItem("mode");
		if (mode == undefined || mode == "") {
			GameConfig.gameMode = GameConfig.GameMode.TIME;
		} else {
			GameConfig.gameMode = JSON.parse(mode).mode;
			this.updateBg();
		}

		let showTips = localStorage.getItem("showTips");
		if (showTips == undefined || showTips == "") {
			GameConfig.showTips = true;
		} else {
			GameConfig.showTips = JSON.parse(showTips).showTips;
		}

		let soundSwitch = localStorage.getItem("soundSwitch");
		if (soundSwitch == undefined || soundSwitch == "") {
			GameConfig.soundSwitch = true;
			this.updateSound();
		} else {
			GameConfig.soundSwitch = JSON.parse(soundSwitch).soundSwitch;
			this.updateSound();
		}

	}

	private readDataFromFacebook() {
		let manager: BaskectBallManager = GameManager.getInstance().baskectBallManager;
		FacebookStorage.getInstance().loadDataFormFB(['gameCoin', 'ownSkin', 'usingSkin', 'rankScore'], (data) => {
			egret.log(data);

			if (data.gameCoin == undefined) {
				manager.coinsNumber = 0;
			} else {
				manager.coinsNumber = data.gameCoin;
			}

			if (data.ownSkin == undefined) {
				manager.skinInfo = ["0"];
			} else {
				manager.skinInfo = data.ownSkin.split(",");
			}

			if (data.usingSkin == undefined) {
				manager.use = 0;
			} else {
				manager.use = data.usingSkin;
			}

			if (data.rankScore == undefined) {
				manager.rankScore = 0;
			} else {
				manager.rankScore = data.rankScore;
			}
		})
	}

	private readDataFromLocal() {
		let manager: BaskectBallManager = GameManager.getInstance().baskectBallManager;

		let gameCoin = localStorage.getItem("gameCoin");
		if (gameCoin == undefined || gameCoin == "") {
			manager.coinsNumber = 0;
		} else {
			manager.coinsNumber = JSON.parse(gameCoin).gameCoin;
		}

		let ownSkin = localStorage.getItem("ownSkin");
		if (ownSkin == undefined || ownSkin == "") {
			manager.skinInfo = ["0"];
		} else {
			manager.skinInfo = JSON.parse(ownSkin).ownSkin.split(",");
		}

		let usingSkin = localStorage.getItem("usingSkin");
		if (usingSkin == undefined || usingSkin == "") {
			manager.use = 0;
		} else {
			manager.use = JSON.parse(usingSkin).usingSkin;
		}

		let rankScore = localStorage.getItem("rankScore");
		if (rankScore == undefined || rankScore == "") {
			manager.rankScore = 0;
		} else {
			manager.rankScore = JSON.parse(rankScore).rankScore;
		}
	}

	private getFirstInfo() {
		this.getLocalData();
		if (Facebook.isFBInit()) {
			this.readDataFromFacebook();
		} else {
			this.readDataFromLocal();
		}

	}
}