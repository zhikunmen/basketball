var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-09
 * Desc   ： 声音管理器
 ********************************/
var SoundMgr = (function () {
    function SoundMgr() {
        this.hasPlayBgm = false;
        this._bg = RES.getRes("bg_mp3");
        // this.playBGM();
    }
    SoundMgr.getInstance = function () {
        if (SoundMgr._instance == null) {
            SoundMgr._instance = new SoundMgr();
        }
        return SoundMgr._instance;
    };
    /**
     * ready go
     */
    SoundMgr.prototype.playReadyGo = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("ready_go_mp3").play(0, 1);
    };
    /**
     * 进球的音效
     */
    SoundMgr.prototype.playJinqiu = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        if (GameManager.getInstance().baskectBallManager.isFireMode()) {
            RES.getRes("ball_in_fire_mp3").play(0, 1);
        }
        else {
            RES.getRes("ball_in_mp3").play(0, 1);
        }
    };
    SoundMgr.prototype.playWin = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("win_mp3").play(0, 1);
    };
    /**
     * 游戏结束的音效
     */
    SoundMgr.prototype.gameover = function (result) {
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
    };
    /**
     * 球跳动
     */
    SoundMgr.prototype.click = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("ball_jump_mp3").play(0, 1);
    };
    /**
     * 球打地板
     */
    SoundMgr.prototype.playGround = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("ball_background_mp3").play(0, 1);
    };
    /**
     * 球碰到框
     */
    SoundMgr.prototype.playKuang = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("ball_kuang_mp3").play(0, 1);
    };
    /**
     * 球碰到板
     */
    SoundMgr.prototype.playBank = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("ball_bank_mp3").play(0, 1);
    };
    /**
     * 宝贝欢呼
     */
    SoundMgr.prototype.playCheer = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("baby_cheer_mp3").play(0, 1);
    };
    /**
    * 宝贝兴奋
    */
    SoundMgr.prototype.playExciting = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("baby_exceting_mp3").play(0, 1);
    };
    /**
    * 宝贝打盹
    */
    SoundMgr.prototype.playSleep = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("baby_paopaotang_mp3").play(0, 1);
    };
    /**
    * 宝贝从梦中惊醒
    */
    SoundMgr.prototype.playWake = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("baby_paopaotang_bmob_mp3").play(0, 1);
    };
    /**
    * 宝贝叹气
    */
    SoundMgr.prototype.playTanqi = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        RES.getRes("playeven_mp3").play(0, 1);
    };
    /**
     * 倒计时
     */
    SoundMgr.prototype.daojishi = function (time) {
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
    };
    SoundMgr.prototype.playBGM = function () {
        if (!GameConfig.soundSwitch) {
            return;
        }
        if (this.hasPlayBgm) {
            return;
        }
        this.hasPlayBgm = true;
        if (this._bg) {
            this._bgSoundChannel = this._bg.play(0, -1);
        }
    };
    SoundMgr.prototype.stopBGM = function () {
        // if (!GameConfig.soundSwitch) {
        // 	return;
        // }
        this._bgSoundChannel && this._bgSoundChannel.stop();
        this.hasPlayBgm = false;
    };
    return SoundMgr;
}());
__reflect(SoundMgr.prototype, "SoundMgr");
