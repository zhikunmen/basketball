/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-09
 * Desc   ： 声音管理器
 ********************************/
class SoundMgr {
	private static _instance: SoundMgr;
	public static getInstance(): SoundMgr {
		if (SoundMgr._instance == null) {
			SoundMgr._instance = new SoundMgr();
		}
		return SoundMgr._instance;
	}

	private _bg: egret.Sound;//背景音乐

	public constructor() {
		this._bg = RES.getRes("bg_mp3");
		// this.playBGM();
	}

	/**
	 * ready go
	 */
	public playReadyGo(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("ready_go_mp3").play(0, 1);

	}

	/**
	 * 进球的音效
	 */
	public playJinqiu() {
		if (!GameConfig.soundSwitch) {
			return;
		}
		if (GameManager.getInstance().baskectBallManager.isFireMode()) {
			RES.getRes("ball_in_fire_mp3").play(0, 1);
		} else {
			RES.getRes("ball_in_mp3").play(0, 1);
		}
	}

	public playWin() {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("win_mp3").play(0, 1);
	}

	/**
	 * 游戏结束的音效
	 */
	public gameover(result: number): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		switch (result) {
			case game.ResultCodeEnum.WIN:
				RES.getRes("win_mp3").play(0, 1);
				break;
			case game.ResultCodeEnum.LOSE:
				RES.getRes("win_mp3").play(0, 1);
				break;
			case game.ResultCodeEnum.PLAYEVEN:
				RES.getRes("playeven_mp3").play(0, 1);
				break;
		}
	}

	/**
	 * 球跳动
	 */
	public click(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("ball_jump_mp3").play(0, 1);
	}

	/**
	 * 球打地板
	 */
	public playGround() {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("ball_background_mp3").play(0, 1);
	}

	/**
	 * 球碰到框
	 */
	public playKuang(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("ball_kuang_mp3").play(0, 1);
	}

	/**
	 * 球碰到板
	 */
	public playBank(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("ball_bank_mp3").play(0, 1);
	}

	/**
	 * 宝贝欢呼
	 */
	public playCheer(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("baby_cheer_mp3").play(0, 1);
	}

	/**
 	* 宝贝兴奋
 	*/
	public playExciting(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("baby_exceting_mp3").play(0, 1);
	}

	/**
  	* 宝贝打盹
  	*/
	public playSleep(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("baby_paopaotang_mp3").play(0, 1);
	}

	/**
  	* 宝贝从梦中惊醒
  	*/
	public playWake(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("baby_paopaotang_bmob_mp3").play(0, 1);
	}

	/**
  	* 宝贝叹气
  	*/
	public playTanqi(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		RES.getRes("playeven_mp3").play(0, 1);
	}


	/**
	 * 倒计时
	 */
	public daojishi(time: number): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		switch (time) {
			case 10:
				RES.getRes("ten_mp3").play(0, 1);
				break;
			case 9:
				RES.getRes("nine_mp3").play(0, 1);
				break;
			case 8:
				RES.getRes("eight_mp3").play(0, 1);
				break;
			case 7:
				RES.getRes("seven_mp3").play(0, 1);
				break;
			case 6:
				RES.getRes("six_mp3").play(0, 1);
				break;
			case 5:
				RES.getRes("five_mp3").play(0, 1);
				break;
			case 4:
				RES.getRes("four_mp3").play(0, 1);
				break;
			case 3:
				RES.getRes("three_mp3").play(0, 1);
				break;
			case 2:
				RES.getRes("two_mp3").play(0, 1);
				break;
			case 1:
				RES.getRes("one_mp3").play(0, 1);
				break;
			case 0:
				RES.getRes("time_out_mp3").play(0, 1);
				break;
		}
	}

	private _bgSoundChannel: egret.SoundChannel;
	private hasPlayBgm: boolean = false;
	public playBGM(): void {
		if (!GameConfig.soundSwitch) {
			return;
		}
		if(this.hasPlayBgm) {
			return;
		}
		this.hasPlayBgm = true;
		if (this._bg) {
			this._bgSoundChannel = this._bg.play(0, -1);
		}

	}

	public stopBGM(): void {
		// if (!GameConfig.soundSwitch) {
		// 	return;
		// }
		this._bgSoundChannel && this._bgSoundChannel.stop();
		this.hasPlayBgm = false;
	}



}