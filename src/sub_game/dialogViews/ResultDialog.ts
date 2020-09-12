class ResultDialog extends core.EUIComponent {

    public result: egret.tween.TweenGroup;
    public finger: egret.tween.TweenGroup;
    public adCoin: egret.tween.TweenGroup;
    public collect: egret.tween.TweenGroup;

    public m_score: eui.Label;
    public m_rank: eui.Label;

    public m_max_combo: eui.Label;
    public m_clean_shot: eui.Label;
    public m_ban_shot: eui.Label;
    public m_high_shot: eui.Label;
    public m_buzzer_shot: eui.Label;
    public m_cur_coin_number: eui.Label;

    public m_max_combo_label: eui.Label;
    public m_clean_shot_label: eui.Label;
    public m_ban_shot_label: eui.Label;
    public m_high_shot_label: eui.Label;
    public m_buzzer_shot_label: eui.Label;

    public m_combo_new: eui.Image;
    public m_clean_shot_new: eui.Image;
    public m_ban_shot_new: eui.Image;
    public m_high_shot_new: eui.Image;
    public m_buzzer_shot_new: eui.Image;


    public m_home_btn: eui.Image;
    public m_restart_btn: eui.Image;
    // public m_share_rank: eui.Image;

    public free_coin_ad_group: eui.Group;
    public free_coin_group: eui.Group;

    private baskectBallManager: BaskectBallManager;
    private scoreManager: ScoreManager;
    private recordData: any;
    private _has_collect_coin: boolean = false;

    public m_skin_btn: eui.Image;
    public m_skin_point: eui.Image;
    public m_total_coin: eui.Label;
    public m_finger: eui.Image;

    public m_close: eui.Image;

    // public m_coin_collect: eui.Image;
    public m_coin_total: eui.Image;

    public m_free_coin_image: eui.Image;
    public m_ad_coin_image: eui.Image;

    public constructor() {
        super();
        this.skinName = "resource/assets/exml/ResultView.exml";
        this.top = this.bottom = this.left = this.right = 0;
        this.baskectBallManager = GameManager.getInstance().baskectBallManager;
        this.scoreManager = GameManager.getInstance().scoreManager;
    }

    protected onShow(event?: egret.Event) {
        super.onShow(event);

        SoundMgr.getInstance().playWin();
        GameManager.getInstance().rebornCount = 1;
        TweenUtil.playTweenGroup(this.result, true);
        TweenUtil.playTweenGroup(this.adCoin, true);
        this.setScoreText();
        // this.showResultLabel();
        this.updateGold();
        this.logEvent();

        if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS && this.scoreManager.totalScore < 40) {
            this.free_coin_group.visible = false;
        } else {
            this.free_coin_group.visible = true;
        }
    }

    private logEvent() {
        let totalScore = this.scoreManager.totalScore;
        let coinsNumber = this.baskectBallManager.coinsNumber;
        let curCoin = this.baskectBallManager._curCoins;
        EventUtils.logEvent("score", {
            "score": totalScore
        });
        EventUtils.logEvent("coin", {
            "curCoin": curCoin,
            "totalCoin": coinsNumber
        });
    }

    private updateGold(): void {
        let gold = this.baskectBallManager.coinsNumber;
        egret.Tween.get(this.m_total_coin).to({ scaleX: 1.2, scaleY: 1.2 }, 300).call(() => {
            this.m_total_coin.text = gold + "";
        }).to({ scaleX: 1, scaleY: 1 }, 300)
        this.updateBuySkin(gold);
    }

    private updateBuySkin(gold: number) {
        let skinInfo = this.baskectBallManager.skinInfo;
        skinInfo.sort((a, b) => {
            let a0 = parseInt(a);
            let b0 = parseInt(b);
            return a0 - b0;
        })

        let targetSkin = -1;
        let arr = [3, 4, 5, 6];//[1, 2, 3, 4, 5, 6]
        for (let j = 0; j < arr.length; j++) {
            let isFind = false;
            for (let i = 0; i < skinInfo.length; i++) {
                let skinId = parseInt(skinInfo[i]);
                if (skinId == arr[j]) {
                    isFind = true;
                    break;
                }
            }
            if (!isFind) {
                targetSkin = arr[j];
                break;
            }
        }
        if (targetSkin == -1) {//已经拥有全部皮肤
            this.m_finger.visible = false;
            this.m_skin_point.visible = false;
            this.m_skin_btn.touchEnabled = true;
            return;
        }
        let price = BaskectBallManager.BASKET_PRICE[targetSkin];
        if (gold >= price) {//手里的钱买得起皮肤
            this.m_finger.visible = true;
            this.m_skin_point.visible = true;
            this.m_skin_btn.touchEnabled = true;
            TweenUtil.playTweenGroup(this.finger, true);
        } else {
            this.m_finger.visible = false;
            this.m_skin_point.visible = false;
            // Utils.gray(this.m_skin_btn);
            // this.m_skin_btn.touchEnabled = false;
            TweenUtil.stopTweenGroup(this.finger);
        }
    }

    protected addListener(): void {
        this.m_home_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goGameHome, this);
        this.m_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backEvent, this);
        this.m_restart_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartGame, this);
        // this.m_share_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
        this.m_skin_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSkin, this);
        this.free_coin_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.collectCoin, this);
        this.free_coin_ad_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.collectCoinAd, this);
        // GameManager.getInstance().addEventListener(GameManager.REFRESH_GOLD, this.updateGold, this);
    }

    protected removeListener(): void {
        this.m_home_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goGameHome, this);
        this.m_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.backEvent, this);
        this.m_restart_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.restartGame, this);
        // this.m_share_rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
        this.m_skin_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSkin, this);
        this.free_coin_group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.collectCoin, this);
        this.free_coin_ad_group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.collectCoinAd, this);
        // GameManager.getInstance().removeEventListener(GameManager.REFRESH_GOLD, this.updateGold, this);
    }

    public popUp(): void {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    }

    private showResultLabel() {
        let result;
        SoundMgr.getInstance().gameover(result);
        egret.setTimeout(() => {
            game.BattleManager.instance.postResult(result)
        }, this, 3000)
    }

    private getData(): void {
        this.recordData = JSON.parse(localStorage.getItem("record"));
        egret.log(this.recordData);
    }

    private setScoreText(): void {
        this.getData();

        let totalScore = this.scoreManager.totalScore;
        let rankScore = this.baskectBallManager.rankScore;
        let maxCombo = this.baskectBallManager.maxCombo;
        let maxKongxin = this.baskectBallManager.kongxinCount;
        let maxBank = this.baskectBallManager.bankCount;
        let maxHighShot = this.baskectBallManager.highShotCount;
        let maxYashao = this.baskectBallManager.yashaoCount;
        let coinCount = this.baskectBallManager._curCoins;

        this.m_score.text = totalScore + "";
        if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            let rank = JSON.parse(localStorage.getItem("endless_rank"));
            if (rank) {
                rankScore = rank.score;
            } else {
                rankScore = 0;
            }
        }
        if (totalScore > rankScore) {
            this.baskectBallManager.rankScore = totalScore;
            this.m_rank.text = LanguageManager.instance.getLangeuage(1);
            this.baskectBallManager.rankScore = totalScore;

            if (typeof gmbox != 'undefined') {
                gmbox.updateGameRank({
                    value: Number(totalScore),
                    type: 1
                })
            } else {
                PlatfromUtil.getPlatform().setScoreAsync(totalScore);
            }

        } else {
            this.m_rank.text = LanguageManager.instance.getLangeuage(2);
        }

        this.m_max_combo.text = maxCombo + "";
        this.m_clean_shot.text = maxKongxin + "";
        this.m_ban_shot.text = maxBank + "";
        this.m_high_shot.text = maxHighShot + "";
        this.m_buzzer_shot.text = maxYashao + "";
        this.m_cur_coin_number.text = coinCount + "";


        if (this.recordData) {
            let recordCombo = this.recordData.m_max_combo;
            if (maxCombo > recordCombo) {//破纪录
                egret.Tween.get(this.m_combo_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_max_combo);
                this.changedToRrecordText(this.m_max_combo_label);
            } else {
                maxCombo = recordCombo;
            }

            let recordClean = this.recordData.m_clean_shot;
            if (maxKongxin > recordClean) {//破纪录
                egret.Tween.get(this.m_clean_shot_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_clean_shot);
                this.changedToRrecordText(this.m_clean_shot_label);
            } else {
                maxKongxin = recordClean;
            }

            let recordBank = this.recordData.m_bank_shot;
            if (maxBank > recordBank) {//破纪录
                egret.Tween.get(this.m_ban_shot_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_ban_shot);
                this.changedToRrecordText(this.m_ban_shot_label);
            } else {
                maxBank = recordBank;
            }

            let recordHigh = this.recordData.m_high_shot;
            if (maxHighShot > recordHigh) {//破纪录
                egret.Tween.get(this.m_high_shot_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_high_shot);
                this.changedToRrecordText(this.m_high_shot_label);
            } else {
                maxHighShot = recordHigh;
            }

            let recordYashao = this.recordData.m_buzzer_shot;
            if (maxYashao > recordYashao) {//破纪录
                egret.Tween.get(this.m_buzzer_shot_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_buzzer_shot);
                this.changedToRrecordText(this.m_buzzer_shot_label);
            } else {
                maxYashao = recordYashao;
            }

        }

        this.saveData(totalScore, maxCombo, maxKongxin, maxBank, maxHighShot, maxYashao);
        if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            localStorage.setItem("endless_rank", JSON.stringify({
                "score": totalScore,
            }));
        }
    }

    private changedToRrecordText(label: eui.Label) {
        label.textColor = 0xFF1a1a;
        label.strokeColor = 0xffdada;
        label.stroke = 2;
    }

    private saveData(score: number, combo: number, clean: number, bank: number, high: number, buzzer: number): void {
        let json = {
            "m_score": score,
            "m_max_combo": combo,
            "m_clean_shot": clean,
            "m_bank_shot": bank,
            "m_high_shot": high,
            "m_buzzer_shot": buzzer
        }
        localStorage.setItem("record", JSON.stringify(json));
    }

    public closeDialog(): void {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
    }

    private backEvent() {
        EventUtils.logEvent("click_back");
        this.closeDialog();
        this.baskectBallManager.reset();
        GlobalManager.getInstance().goLobby();
    }

    private goGameHome() {
        EventUtils.logEvent("click_home");
        this.closeDialog();
        this.baskectBallManager.reset();
        GlobalManager.getInstance().goLobby();
    }

    private restartGame() {
        EventUtils.logEvent("click_restart");
        this.closeDialog();
        GameManager.getInstance().restart();
    }

    private shareGame() {
        EventUtils.logEvent("click_resultShare");
        PlatfromUtil.getPlatform().share();
    }

    private changeSkin() {
        EventUtils.logEvent("click_resultSkin");
        let skinsView: ChangeSkinView = new ChangeSkinView();
        skinsView.popUp();
    }

    private collectCoin() {
        EventUtils.logEvent("click_collectCoin");
        if (this._has_collect_coin) {
            return;
        }
        this._has_collect_coin = true;
        this.playCollectCoinAnimation(false);
    }

    private collectCoinAd() {
        EventUtils.logEvent("click_collectCoinAd");
        if (this._has_collect_coin) {
            return;
        }
        let successCallback = () => {
            this._has_collect_coin = true;
            SoundMgr.getInstance().playBGM();
            egret.setTimeout(() => {
                this.playCollectCoinAnimation(true);
            }, this, 300);
        }
        AdManager.showRewardedVideoAd(successCallback);
        SoundMgr.getInstance().stopBGM();
    }

    private getCoin(coinCount: number) {
        Utils.gray(this.free_coin_group);
        Utils.gray(this.free_coin_ad_group);
        this.free_coin_group.touchEnabled = false;
        this.free_coin_ad_group.touchEnabled = false;
        this.baskectBallManager.collectCoinsNumber(coinCount);
        TweenUtil.stopTweenGroup(this.adCoin);
        this.updateGold();
    }

    private playCollectCoinAnimation(isAd: boolean) {
        let coinNum = isAd ? 120 : 40;
        let _coin = DragonUtils.createDragonBonesDisplay(`langqiu_feijingbi_ske_json`, `langqiu_feijingbi_tex_json`, `langqiu_feijingbi_tex_png`, 'Armature');
        _coin.addEventListener(dragonBones.EgretEvent.COMPLETE, () => {
            this.getCoin(coinNum);
            _coin.display.parent && _coin.display.parent.removeChild(_coin.display);
            dragonBones.WorldClock.clock.remove(_coin);
        }, this)
        dragonBones.WorldClock.clock.add(_coin);
        let _coinDisplay = _coin.display;
        _coinDisplay.x = this.m_coin_total.x + 58;
        _coinDisplay.y = this.m_coin_total.y + 46;
        this.addChild(_coinDisplay);
        _coin.animation.play("newAnimation_1", 1);

        if (_coin != null) {
            return;
        }

        // this.m_coin_collect.visible = true;
        let targetX = 0;
        let targetY = 0;
        if (isAd) {
            targetX = this.m_ad_coin_image.localToGlobal().x;
            targetY = this.m_ad_coin_image.localToGlobal().y;
        } else {
            targetX = this.m_free_coin_image.localToGlobal().x;
            targetY = this.m_free_coin_image.localToGlobal().y;
        }
        let coinCount = isAd ? 120 : 40;
        let x = this.m_coin_total.localToGlobal().x + 55;
        let y = this.m_coin_total.localToGlobal().y + 40;

        for (let i = 0; i < 5; i++) {
            let goldImg: egret.Bitmap = new egret.Bitmap(RES.getRes("img_jinbi_xiao_png"));
            this.addChild(goldImg)
            goldImg.width = 32;
            goldImg.height = 32;
            goldImg.anchorOffsetX = 16;
            goldImg.anchorOffsetY = 16;
            goldImg.x = targetX;
            goldImg.y = targetY;

            let angle = 360 / 5 * i;
            let radius = 100;
            let x1 = targetX + (radius - 0.2 * radius * Math.random()) * Math.cos(angle * Math.PI / 180);
            let y1 = targetY + (radius - 0.2 * radius * Math.random()) * Math.sin(angle * Math.PI / 180);
            egret.Tween.get(goldImg).wait(50 + 10 * i).to({ x: x1, y: y1 }, 200).wait(400).to({ x: x, y: y }, 500).to({ scaleX: 1.5, scaleY: 1.5 }, 100).call(() => {
                if (i == 4) {
                    Utils.gray(this.free_coin_group);
                    Utils.gray(this.free_coin_ad_group);
                    this.free_coin_group.touchEnabled = false;
                    this.free_coin_ad_group.touchEnabled = false;
                    this.baskectBallManager.collectCoinsNumber(coinCount);
                    TweenUtil.stopTweenGroup(this.adCoin);
                    this.updateGold();
                }
            })


        }
        // var goldImg: egret.Bitmap = new egret.Bitmap(RES.getRes("img_jinbi_xiao_png"));
        // this.addChild(goldImg)
        // goldImg.width = 32;
        // goldImg.height = 32;
        // goldImg.x = targetX;
        // goldImg.y = targetY;

        // // TweenUtil.playTweenGroup(this.collect, true);

        // egret.Tween.get(goldImg).to({ x: x, y: y }, 1000).call(() => {
        //     TweenUtil.stopTweenGroup(this.collect);
        //     egret.Tween.get(goldImg).to({ scaleX: 0, scaleY: 0 }, 300);

        //     Utils.gray(this.free_coin_group);
        //     Utils.gray(this.free_coin_ad_group);
        //     this.free_coin_group.touchEnabled = false;
        //     this.free_coin_ad_group.touchEnabled = false;
        //     this.baskectBallManager.collectCoinsNumber(coinCount);
        //     TweenUtil.stopTweenGroup(this.adCoin);
        //     this.updateGold();
        // })

    }



}