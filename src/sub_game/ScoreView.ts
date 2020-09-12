//分数界面
class ScoreView extends core.EUIComponent {

    // public m_help: eui.Image;
    // public m_back: eui.Image;
    public m_vibrate: eui.Image;

    public m_self_avatar: eui.Image;
    public m_self_sex: eui.Image;
    public m_self_score: eui.Label;
    public m_self_high_score: eui.Label;

    public m_opponent_group: eui.Group;
    public m_opponent_sex: eui.Image;
    public m_oppenent_avatar: eui.Image;
    public m_oppenent_avatar1: eui.Image;
    public m_oppenent_avatar2: eui.Image;
    public m_oppenent_score: eui.Label;
    public m_oppenent_rank: eui.Label;
    public m_oppenent_name: eui.Label;
    public m_oppenent_label: eui.Label;

    public m_enemy_group: eui.Group;
    public m_enemy_avatar_group: eui.Group;
    public m_enemy_avatar: eui.Image;
    public m_enemy_avatar_mask: eui.Image;
    public m_enemy_score: eui.Label;
    public m_enemy_rank: eui.Label;
    public m_enemy_name: eui.Label;
    public m_enemy_label: eui.Label;
    public m_biaoqing_group: eui.Group;

    public m_time: eui.BitmapLabel;

    // public m_combo_label: eui.Image;
    // public m_combo: eui.BitmapLabel;
    public m_combo_label2: eui.Image;
    public m_combo2: eui.BitmapLabel;
    public m_combo_label1: eui.Image;
    public m_combo1: eui.BitmapLabel;

    public m_progress_bg: eui.Image;
    public m_progress: eui.Image;
    public m_progress_mask: eui.Image;
    public m_shot: eui.Group;
    public m_shot_bg: eui.Image;
    public m_shot_type: eui.Image;

    public m_gold: eui.Label;
    public m_coin_total: eui.Image;
    public coin: egret.tween.TweenGroup;
    public m_goin_image: eui.Image;

    private _manager: ScoreManager;

    private randomRank: Map<number, number> = new Map<number, number>();
    private rankIndex: number = 1;
    private randomTime: Map<number, number> = new Map<number, number>();
    private timeIndex: number = 1;

    public m_guang: eui.Image;
    public m_vs_image: eui.Image;


    public constructor() {
        super();
        this.skinName = "resource/assets/exml/ScoreView.exml";
        this._manager = GameManager.getInstance().scoreManager;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
        this.generateRandomRank();
    }

    private generateRandomRank() {
        this.randomRank.set(1, core.MathUtils.random(50, 70))
        this.randomRank.set(2, core.MathUtils.random(80, 100))
        this.randomRank.set(3, core.MathUtils.random(120, 150))

        this.randomTime.set(1, core.MathUtils.random(30, 60))
        this.randomTime.set(2, core.MathUtils.random(80, 110))
        this.randomTime.set(3, core.MathUtils.random(130, 200))
    }

    protected onShow(event?: egret.Event): void {
        super.onShow();

        this.rankIndex = 1;
        this.m_self_score.text = "0";
        this.m_self_high_score.text = LanguageManager.instance.getLangeuage(17) + GameManager.getInstance().baskectBallManager.rankScore;
        this.updateGold();
        this.updateSelfRank();
        if (typeof gmbox != 'undefined') {
            let myuserInfo = BatterInfo.instance.myUserInfo;
            if (myuserInfo) {
                this.m_self_avatar.source = myuserInfo.avatar;
                this.setPlayerIconMask(this.m_self_avatar);
            } else {
                egret.setTimeout(() => {
                    let myuserInfo = BatterInfo.instance.myUserInfo;
                    if (myuserInfo) {
                        this.m_self_avatar.source = myuserInfo.avatar;
                        this.setPlayerIconMask(this.m_self_avatar);
                    }
                }, this, 2000)
            }

            // let otherUserInfo = BatterInfo.instance.otherUserInfo;
            // if (otherUserInfo) {
            //     this.m_oppenent_avatar.source = otherUserInfo.headIconUrl;
            //     this.setPlayerIconMask(this.m_oppenent_avatar);
            //     // this.m_other_sex.source = otherUserInfo.sex == "M" ? "mmale_png" : "ffmale_png";
            // }
            // let voiceStatus = BatterInfo.instance._mikeStatus;
            // if (voiceStatus) {
            //     voiceStatus.forEach((value, key) => {
            //         this.updateVoiceStatus(key, value);
            //     });
            // }
        }

        // this.changeLayoutHierarchy();
    }

    // private changeLayoutHierarchy() {
    //     this.m_back.parent.removeChild(this.m_back);
    //     this.parent.addChild(this.m_back);

    //     this.m_help.parent.removeChild(this.m_help);
    //     this.parent.addChild(this.m_help);

    //     this.m_vibrate.parent.removeChild(this.m_vibrate);
    //     this.parent.addChild(this.m_vibrate);
    // }

    private setPlayerIconMask(image: egret.Bitmap): void {
        let circle = this.createCircle(1, image.width / 2 - 1);
        circle.x = image.x;
        circle.y = image.y;
        image.parent.addChild(circle);
        image.mask = circle;
    }

    private createCircle(alpha?: number, r?: number, color?: number) {
        if (alpha === void 0) { alpha = 0.3; }
        if (color === void 0) { color = 0x000000; }
        var sp = new egret.Sprite();
        sp.graphics.clear();
        sp.graphics.beginFill(color, alpha);
        sp.graphics.drawCircle(0, 0, r);
        sp.graphics.endFill();
        return sp;
    };

    protected addListener(): void {
        GameManager.getInstance().addEventListener(GameManager.RESTART_GAME, this.restartHandler, this);
        GameManager.getInstance().addEventListener(GameManager.REFRESH_RANK, this.updateSelfRank, this);
        GameManager.getInstance().baskectBallManager.addEventListener(GameManager.GAME_COMBO, this.updateCombo, this);
        GameManager.getInstance().baskectBallManager.addEventListener(GameManager.GAME_COMBO_PROGRESS, this.updateComboProgress, this);
        GameManager.getInstance().baskectBallManager.addEventListener(GameManager.GAME_TIME, this.updateTime, this);
        GameManager.getInstance().baskectBallManager.addEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        // GameManager.getInstance().addEventListener(GameManager.REFRESH_GOLD, this.updateGold, this);
        GameManager.getInstance().baskectBallManager.addEventListener(BattleEventConst.VOICE_CHANGE, this.voiceChange, this);
        GameManager.getInstance().baskectBallManager.addEventListener(BaskectBallManager.COLLECT_COINS, this.collectCoin, this);
        this._manager.addEventListener(ScoreManager.UPDATE_SCORE, this.updateScoreHandler, this);
        this._manager.addEventListener(BattleEventConst.UPDATE_OTHER_SCORE, this.updateOtherScore, this);
        // this.m_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showExitDialog, this);
        // this.m_help.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showHelpDialog, this);
        this.m_vibrate.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchMikeStatus, this);
        this.m_self_avatar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.headClick, this);
        this.m_oppenent_avatar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.headClick, this);
    }

    protected removeListener(): void {
        GameManager.getInstance().removeEventListener(GameManager.RESTART_GAME, this.restartHandler, this);
        GameManager.getInstance().addEventListener(GameManager.REFRESH_RANK, this.updateSelfRank, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(GameManager.GAME_COMBO, this.updateCombo, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(GameManager.GAME_COMBO_PROGRESS, this.updateComboProgress, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(GameManager.GAME_TIME, this.updateTime, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        // GameManager.getInstance().removeEventListener(GameManager.REFRESH_GOLD, this.updateGold, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(BattleEventConst.VOICE_CHANGE, this.voiceChange, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(BaskectBallManager.COLLECT_COINS, this.collectCoin, this);
        this._manager.removeEventListener(ScoreManager.UPDATE_SCORE, this.updateScoreHandler, this);
        this._manager.addEventListener(BattleEventConst.UPDATE_OTHER_SCORE, this.updateOtherScore, this);
        // this.m_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showExitDialog, this);
        // this.m_help.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showHelpDialog, this);
        this.m_vibrate.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchMikeStatus, this);
        this.m_self_avatar.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.headClick, this);
        this.m_oppenent_avatar.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.headClick, this);
    }

    _hasUpdateSelf: boolean = false;
    private async updateSelfRank() {
        if (this._hasUpdateSelf) {
            return;
        }
        let selfInfo = PlatfromUtil.getPlatform().getSelfRank();
        if (selfInfo) {
            this._hasUpdateSelf = true;
            this.m_self_avatar.source = selfInfo.playerPicUrl;
            this.setPlayerIconMask(this.m_self_avatar);
        }
        this.updateOpponentsRank(true, 0);
    }

    private restartHandler(evt: egret.Event): void {
        this.rankIndex = 1;
        this.timeIndex = 1;
        this.m_self_score.text = "0";
        this.m_self_high_score.text = LanguageManager.instance.getLangeuage(17) + GameManager.getInstance().baskectBallManager.rankScore;
        this.generateRandomRank();
    }

    private updateCombo(evt: egret.Event): void {
        let round = evt.data.round;
        if (round == 5 || round == 15) {
            this.m_combo1.visible = false;
            this.m_combo_label1.visible = false;
            this.m_combo2.visible = true;
            this.m_combo_label2.visible = true;
            this.m_combo2.text = round + "";
        } else {
            this.m_combo1.visible = true;
            this.m_combo_label1.visible = true;
            this.m_combo2.visible = false;
            this.m_combo_label2.visible = false;
            this.m_combo1.text = round + "";
        }
    }
    private updateComboProgress(evt: egret.Event): void {
        if (this.isGameOver) {
            return;
        }
        let percent: any = evt.data.percent;
        let round = evt.data.round;
        if (round == 5 || round == 15) {
            this.m_progress_bg.source = "img_xuetiao_h2_png";
            this.m_progress.source = "img_xuetiao_h1_png";
        } else {
            this.m_progress_bg.source = "img_xuetiao_l2_png";
            this.m_progress.source = "img_xuetiao_l1_png";
        }
        // this.m_progress.scaleX = percent;
        this.m_progress.mask = this.m_progress_mask;
        this.m_progress_mask.width = percent * 257;
        this.m_progress_bg.visible = true;
        this.m_progress.visible = true;
        if (percent <= 0) {
            this.dispatchEvent(new egret.Event(BaskectBallManager.COMPLETE_TIMEOUT));
            this.m_progress_bg.visible = false;
            this.m_progress.visible = false;
            this.m_combo1.visible = false;
            this.m_combo_label1.visible = false;
            this.m_combo2.visible = false;
            this.m_combo_label2.visible = false;
        } else if (percent < 0.5) {
            // this.m_progress.source = "lanqiu-fangjiandanjishi-2_png";
        }

    }

    private isGameOver: boolean = false;
    private updateTime(evt: egret.Event): void {
        let time: any = evt.data.time;
        if (time >= 0) {
            this.m_time.text = time + "";

        }
        if (time <= 10) {
            this.m_time.font = "time_last_fnt"
        } else {
            this.m_time.font = "time_fnt"
        }
        if (time == 0) {
            this.isGameOver = true;
        } else {
            this.isGameOver = false;
        }
    }

    //已经超越我的对手
    private updateEnemy(score: number): void {
        let targetRank = this.randomTime.get(this.timeIndex);
        if (score <= targetRank) {//没有超越
            return;
        }
        let emeneyRank: FacebookPlayerInfoInRank = PlatfromUtil.getPlatform().getOpponentsPassMeRank(this.timeIndex, score);
        if (!emeneyRank) {
            return;
        }
        this.timeIndex++;
        this.m_enemy_group.visible = true;
        this.m_enemy_group.x = -400;
        this.m_enemy_avatar.source = emeneyRank.playerPicUrl;
        this.setPlayerIconMask(this.m_enemy_avatar);
        this.m_enemy_name.text = emeneyRank.playerName;
        this.m_enemy_rank.text = LanguageManager.instance.getLangeuage(18) + emeneyRank.playerRank;
        this.m_enemy_score.text = (score + core.MathUtils.random(5, 10)) + "";
        this.m_enemy_label.text = LanguageManager.instance.getLangeuage(20);

        egret.Tween.get(this.m_enemy_group).to({ x: 196 }, 400).call(() => {
            let expression = DragonUtils.createDragonBonesDisplay(`expression_ske_json`, `expression_tex_json`, `expression_tex_png`, 'Sprite');
            dragonBones.WorldClock.clock.add(expression);
            let display = expression.display as egret.DisplayObjectContainer;
            display.x = 60;
            display.y = 40;
            this.m_biaoqing_group.addChild(display);
            expression.animation.play("Sprite", -1);
            egret.setTimeout(() => {
                this.clearArmature(expression);
                this.m_enemy_group.visible = false;
            }, this, 4000)
        });
    }

    private clearArmature(armature: dragonBones.Armature) {
        if (armature) {
            armature.animation.stop();
            DragonUtils.removeFromParent(armature.display);
            dragonBones.WorldClock.clock.remove(armature);
        }
    }

    /**
 * 增加分数
 */
    private updateScoreHandler(evt: egret.Event): void {
        let m_addScore: eui.Label = new eui.Label();
        this.addChild(m_addScore);
        m_addScore.text = "+" + evt.data.score;
        let pos: any = evt.data.pos;
        m_addScore.size = 50;
        m_addScore.width = 90;
        m_addScore.anchorOffsetX = 45;
        m_addScore.textAlign = "center";
        m_addScore.visible = true;
        pos.anchorOffsetX = 0;
        pos.anchorOffsetY = 0;

        m_addScore.y = Utils.euiPosToNormal1(pos).y;
        m_addScore.x = Utils.euiPosToNormal1(pos).x;
        m_addScore.scaleX = m_addScore.scaleY = 1;
        m_addScore.alpha = 1;
        egret.Tween.get(m_addScore).to({ scaleX: 1.2, scaleY: 1.2 }, 200)
            .to({ scaleX: 1, scaleY: 1 }, 200)
            .to({ y: m_addScore.y - 150, alpha: 1 }, 500, egret.Ease.sineOut).call(() => {
                m_addScore.visible = false;
                m_addScore.parent && m_addScore.parent.removeChild(m_addScore);
                m_addScore = null;
            });
        let score = this._manager.totalScore;
        this.updateOpponentsRank(false, score);
        this.updateEnemy(score);
        // egret.Tween.get(this.m_self_score).to({ scaleX: 1.2, scaleY: 1.2 }, 300).call(() => {
        this.m_self_score.text = score + "";
        // }).to({ scaleX: 1, scaleY: 1 }, 300)
    }

    _isAnimation: boolean = false;
    private updateOpponentsRank(isFirst: boolean = true, score: number) {
        let targetRank = this.randomRank.get(this.rankIndex);
        if (score > 0 && targetRank > 0 && score <= targetRank) {//没有超越
            return;
        }
        if (isFirst) {
            this.rankIndex = 1;
        } else {
            this.rankIndex += 1;
        }
        let nextRank = this.randomRank.get(this.rankIndex);
        let opponentsRanks = PlatfromUtil.getPlatform().getTargetOpponentsRank(this.rankIndex, nextRank);
        egret.log(opponentsRanks);
        if (opponentsRanks && opponentsRanks.length >= 3) {
            this.m_oppenent_avatar.source = opponentsRanks[0].playerPicUrl;
            this.setPlayerIconMask(this.m_oppenent_avatar);
            this.m_oppenent_name.text = opponentsRanks[0].playerName;
            this.m_oppenent_rank.text = LanguageManager.instance.getLangeuage(18) + opponentsRanks[0].playerRank;
            this.m_oppenent_score.text = nextRank + "";
            this.m_oppenent_label.text = LanguageManager.instance.getLangeuage(19);

            this.m_oppenent_avatar1.source = opponentsRanks[1].playerPicUrl;
            this.setPlayerIconMask(this.m_oppenent_avatar1);
            this.m_oppenent_avatar2.source = opponentsRanks[2].playerPicUrl;
            this.setPlayerIconMask(this.m_oppenent_avatar2);

            if (!isFirst && !this._isAnimation) {
                this._isAnimation = true;
                egret.Tween.get(this.m_guang).to({ scaleX: 1.3, scaleY: 1.3 }, 200).to({ scaleX: 0, scaleY: 0 }, 200);
                egret.Tween.get(this.m_opponent_group).to({ x: 572, y: 180 }, 100).to({ x: 552, y: 200 }, 200).to({ x: 562, y: 190 }, 100)
                    .to({ scaleX: 1.2, scaleY: 1.2 }, 100).to({ scaleX: 0, scaleY: 0 }, 300)
                    .to({ x: 1572, scaleX: 1, scaleY: 1 }, 10).to({ x: 572 }, 400).call(() => {
                        this._isAnimation = false;
                    });
            }
        } else {
            this.m_opponent_group.visible = false;
            this.m_guang.visible = false;
            this.m_vs_image.visible = false;
        }

    }

    private updateOtherScore(evt: egret.Event): void {
        this.m_oppenent_score.text = evt.data + "";
    }

    /**
     * 增加空心
     */
    private addEffectHandler(evt: egret.Event): void {
        let type: string = evt.data.type;
        if (type == "highShot") {
            this.m_shot_type.source = "img_high arc shot_png";
        } else if (type == "kongxin") {
            this.m_shot_type.source = "img–clean shot_png";
        } else if (type == "bank") {
            this.m_shot_type.source = "img_bank shot_png";
        } else if (type == "yashao") {
            this.m_shot_type.source = "img_buxzzer_png";
        } else if (type == "null") {
            this.m_shot.visible = false;
            return;
        }
        this.m_shot.visible = true;
        egret.Tween.get(this.m_shot).to({ x: 0, alpha: 1 }, 400).to({ x: 31 }, 100)
            .wait(500).to({ x: -500, alpha: 0 }, 500, egret.Ease.sineOut).call(() => {
                this.m_shot.visible = false;
                this.m_shot.x = 500;
            });
    }

    private updateGold(): void {
        let gold = GameManager.getInstance().baskectBallManager.coinsNumber;
        this.m_gold.text = gold + "";
    }

    private collectCoin(evt: egret.Event) {
        let coins = evt.data.coinNumber;
        let pos = evt.data.pos;
        this.m_goin_image.visible = true;
        this.m_goin_image.y = Utils.euiPosToNormal1(pos).y;
        this.m_goin_image.x = Utils.euiPosToNormal1(pos).x;

        TweenUtil.playTweenGroup(this.coin, true);
        let x = this.m_coin_total.x + 50;
        let y = this.m_coin_total.y + 30;
        egret.Tween.get(this.m_goin_image).to({ x: x, y: y }, 1000).call(() => {
            TweenUtil.stopTweenGroup(this.coin);
            egret.Tween.get(this.m_goin_image).to({ scaleX: 0, scaleY: 0 }, 300);
            this.updateGold();
        })


    }

    private showExitDialog(): void {
        EventUtils.logEvent("click_exit");
        let pauseView: ExitDialog = new ExitDialog();
        pauseView.popUp();
    }

    private showHelpDialog(): void {
        EventUtils.logEvent("click_help");
        core.ResUtils.loadGroups(["help"], (progress) => {
        }, (fail) => {
        }, (loadComplete) => {
            new HelpDialog().popUp();
        }, this);
    }

    private switchMikeStatus(): void {

    }

    /**收到语音修改 */
    private voiceChange(evt: egret.Event) {
        let data = evt.data as game.IVoiceStruct;
        this.updateVoiceStatus(data.userId, data.status);
    }

    private updateVoiceStatus(userId: string, status: number): void {
        // if (userId == BatterInfo.instance.myUserInfo.userId) {//我的
        //     this.m_game_mike.source = `games_voice_${status == 1 ? "on_png" : "off_png"}`;
        // } else {
        //     this.m_other_game_mike.source = `games_voice_${status == 1 ? "on_png" : "off_png"}`;
        // }
    }

    private headClick(evt: egret.TouchEvent) {
        if (typeof gmbox != 'undefined') {
            let userId;
            if (evt.currentTarget === this.m_self_avatar) {
                userId = BatterInfo.instance.myUserInfo.userId;
            } else {
                userId = BatterInfo.instance.otherUserInfo.userId;
            }
            if (gmbox.openUserInfoDialog)
                gmbox.openUserInfoDialog({ uid: userId });
        }
    }

}