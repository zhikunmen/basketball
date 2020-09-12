//无尽模式的分数界面
class EndlessScore extends core.EUIComponent {

    public m_back: eui.Image;
    public m_help: eui.Image;
    public m_pause: eui.Image;
    public m_shot_type: eui.Label;
    public m_combo: eui.Label;
    public m_score: eui.Label;
    public m_shot_group: eui.Group;

    public m_progress_group: eui.Group;
    public m_progress_bg: eui.Image;
    public m_progress: eui.Image;
    public m_progress_mask: eui.Image;
    public m_zhen_short: eui.Image;
    public m_zhen_long: eui.Image;

    public coin: egret.tween.TweenGroup;
    public m_coin_total: eui.Image;
    public m_gold: eui.Label;
    public m_goin_image: eui.Image;
    public m_mask: eui.Image;

    public constructor() {
        super();
        this.skinName = "resource/assets/exml/EndlessScoreView.exml";
        this.top = this.bottom = this.left = this.right = 0;
    }

    protected addListener(): void {
        GameManager.getInstance().addEventListener(GameManager.RESTART_GAME, this.restartHandler, this);
        GameManager.getInstance().scoreManager.addEventListener(ScoreManager.UPDATE_SCORE, this.updateScoreHandler, this);
        GameManager.getInstance().baskectBallManager.addEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        // GameManager.getInstance().baskectBallManager.addEventListener(GameManager.GAME_COMBO, this.updateCombo, this);
        GameManager.getInstance().baskectBallManager.addEventListener(GameManager.GAME_COMBO_PROGRESS, this.updateComboProgress, this);
        GameManager.getInstance().baskectBallManager.addEventListener("show_coin", this.showCoin, this);
        GameManager.getInstance().baskectBallManager.addEventListener("collect_coin", this.collectCoin, this);
    }

    protected removeListener(): void {
        GameManager.getInstance().removeEventListener(GameManager.RESTART_GAME, this.restartHandler, this);
        GameManager.getInstance().scoreManager.removeEventListener(ScoreManager.UPDATE_SCORE, this.updateScoreHandler, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        // GameManager.getInstance().baskectBallManager.removeEventListener(GameManager.GAME_COMBO, this.updateCombo, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(GameManager.GAME_COMBO_PROGRESS, this.updateComboProgress, this);
        GameManager.getInstance().baskectBallManager.removeEventListener("show_coin", this.showCoin, this);
        GameManager.getInstance().baskectBallManager.addEventListener("collect_coin", this.collectCoin, this);
    }

    protected onShow(event?: egret.Event): void {
        super.onShow();
        this.updateGold();

        let self = this;
        setTimeout(function () {
            self.m_goin_image.visible = true;
            self.m_goin_image.x = self.m_coin_total.x + 54;
            self.m_goin_image.y = self.m_coin_total.y + 42;
        }, self, 2000);
    }

    private restartHandler(evt: egret.Event): void {
        this.m_score.text = "0";
        this.m_progress_group.visible = false;
        this.m_shot_type.visible = false;
        this.m_combo.visible = false;
        this.m_mask.visible = false;
    }

    //更新分数
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
        let score = GameManager.getInstance().scoreManager.totalScore;
        egret.Tween.get(this.m_score).wait(100).to({ scaleX: 1.2, scaleY: 1.2 }, 200).call(() => {
            this.m_score.text = score + "";
            egret.Tween.get(this.m_score).to({ scaleX: 1, scaleY: 1 }, 200)
        });

    }

    //更新进球类型
    // combo: number = 0;
    private addEffectHandler(evt: egret.Event): void {
        let type: string = evt.data.type;
        if (type == "highShot") {
            // this.combo++;
            this.m_shot_type.visible = true;
            this.m_shot_type.text = "HIGH ARC SHOT";
        } else if (type == "kongxin") {
            // this.combo++;
            this.m_shot_type.visible = true;
            this.m_shot_type.text = "CLEAN SHOT";
        } else if (type == "bank") {
            // this.combo++;
            this.m_shot_type.visible = true;
            this.m_shot_type.text = "BANK SHOT";
        } else if (type == "yashao") {
            // this.combo++;
            this.m_shot_type.visible = true;
            this.m_shot_type.text = "BUZZER BEATER";
            this.m_mask.visible = false;
        } else if (type == "null") {
            // this.combo = 0;
            this.m_shot_type.visible = false;
        }
        this.updateCombo();
    }

    private updateCombo(): void {
        let combo = GameManager.getInstance().baskectBallManager.endlessCombo;
        if (combo > 0) {
            this.m_combo.visible = true;
            if (combo > 4) {
                this.m_combo.text = "Fire " + combo + "X";
            } else {
                this.m_combo.text = combo + "X";
            }

        } else {
            this.m_combo.visible = false;
        }

        egret.Tween.removeTweens(this.m_shot_group)
        this.m_shot_group.visible = true;
        egret.Tween.get(this.m_shot_group).to({ x: (GameConfig.curWidth() - this.m_shot_group.width) / 2, alpha: 1 }, 200).wait(500)
            .to({ x: 0, alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
                this.m_shot_group.visible = false;
                this.m_shot_group.x = 500;
            });
    }

    //更新进度条
    private updateComboProgress(evt: egret.Event): void {
        this.m_progress_group.visible = true;

        let percent: any = evt.data.percent;
        let round = evt.data.round;
        // if (round == 6 || round == 16) {
        //     this.m_progress_bg.source = "img_xuetiao_h2_png";
        //     this.m_progress.source = "img_xuetiao_h1_png";
        // } else {
        this.m_progress_bg.source = "img_xuetiao_l2_png";
        this.m_progress.source = "img_xuetiao_l1_png";
        // }
        this.m_progress.mask = this.m_progress_mask;
        this.m_progress_mask.width = percent * 257;
        this.m_progress_bg.visible = true;

        this.m_zhen_short.rotation = 90 + 270 * (1 - percent);
        this.m_zhen_long.rotation = -90 + 360 * (1 - percent);

        if (percent <= 0) {
            this.dispatchEvent(new egret.Event(BaskectBallManager.COMPLETE_TIMEOUT));
            this.m_progress_group.visible = false;
            // this.m_mask.visible = true;
        }
    }

    private showCoin(evt: egret.Event): void {
        let x: any = evt.data.x;
        let y: any = evt.data.y;

        if (!this._coin) {
            this._coin = DragonUtils.createDragonBonesDisplay(`coin_ske_json`, `coin_tex_json`, `coin_tex_png`, 'Sprite');
            dragonBones.WorldClock.clock.add(this._coin);
            this._coinDisplay = this._coin.display;
            this.m_goin_image.parent.addChildAt(this._coinDisplay, 4);
            this._coin.animation.play("Sprite", -1);
        }
        this._coinDisplay.alpha = 1;
        // this._coin.animation.stop();
        this._coinDisplay.x = x;
        this._coinDisplay.y = y;
    }

    _coin: dragonBones.Armature;
    _coinDisplay: egret.DisplayObjectContainer;
    private collectCoin(evt: egret.Event) {
        if (!this._coin) {
            return;
        }
        
        let x = this.m_coin_total.x + 50;
        let y = this.m_coin_total.y + 40;
        let horztionX = GameManager.getInstance().baskectBallManager.curSide == "left" ? this._coinDisplay.x + 100 : this._coinDisplay.x - 100;
        egret.Tween.get(this._coinDisplay).to({ x: horztionX }, 100).to({ x: x, y: y }, 600).call(() => {
            this._coinDisplay.alpha = 0;
            // this._coin.animation.stop();
            egret.Tween.get(this.m_goin_image).to({ scaleX: 1.6, scaleY: 1.6 }, 200).to({ scaleX: 1, scaleY: 1 }, 200);
            this.updateGold(true);
        });
    }


    private updateGold(collect: boolean = false): void {
        if (collect) {
            GameManager.getInstance().baskectBallManager.collectCoinsNumber(1);
        }
        let gold = GameManager.getInstance().baskectBallManager.coinsNumber;
        this.m_gold.text = gold + "";
    }

}