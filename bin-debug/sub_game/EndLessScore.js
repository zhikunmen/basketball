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
//无尽模式的分数界面
var EndlessScore = (function (_super) {
    __extends(EndlessScore, _super);
    function EndlessScore() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/assets/exml/EndlessScoreView.exml";
        _this.top = _this.bottom = _this.left = _this.right = 0;
        return _this;
    }
    EndlessScore.prototype.addListener = function () {
        GameManager.getInstance().addEventListener(GameManager.RESTART_GAME, this.restartHandler, this);
        GameManager.getInstance().scoreManager.addEventListener(ScoreManager.UPDATE_SCORE, this.updateScoreHandler, this);
        GameManager.getInstance().baskectBallManager.addEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        // GameManager.getInstance().baskectBallManager.addEventListener(GameManager.GAME_COMBO, this.updateCombo, this);
        GameManager.getInstance().baskectBallManager.addEventListener(GameManager.GAME_COMBO_PROGRESS, this.updateComboProgress, this);
        GameManager.getInstance().baskectBallManager.addEventListener("show_coin", this.showCoin, this);
        GameManager.getInstance().baskectBallManager.addEventListener("collect_coin", this.collectCoin, this);
    };
    EndlessScore.prototype.removeListener = function () {
        GameManager.getInstance().removeEventListener(GameManager.RESTART_GAME, this.restartHandler, this);
        GameManager.getInstance().scoreManager.removeEventListener(ScoreManager.UPDATE_SCORE, this.updateScoreHandler, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        // GameManager.getInstance().baskectBallManager.removeEventListener(GameManager.GAME_COMBO, this.updateCombo, this);
        GameManager.getInstance().baskectBallManager.removeEventListener(GameManager.GAME_COMBO_PROGRESS, this.updateComboProgress, this);
        GameManager.getInstance().baskectBallManager.removeEventListener("show_coin", this.showCoin, this);
        GameManager.getInstance().baskectBallManager.addEventListener("collect_coin", this.collectCoin, this);
    };
    EndlessScore.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this);
        this.updateGold();
        var self = this;
        setTimeout(function () {
            self.m_goin_image.visible = true;
            self.m_goin_image.x = self.m_coin_total.x + 54;
            self.m_goin_image.y = self.m_coin_total.y + 42;
        }, self, 2000);
    };
    EndlessScore.prototype.restartHandler = function (evt) {
        this.m_score.text = "0";
        this.m_progress_group.visible = false;
        this.m_shot_type.visible = false;
        this.m_combo.visible = false;
        this.m_mask.visible = false;
    };
    //更新分数
    EndlessScore.prototype.updateScoreHandler = function (evt) {
        var _this = this;
        var m_addScore = new eui.Label();
        this.addChild(m_addScore);
        m_addScore.text = "+" + evt.data.score;
        var pos = evt.data.pos;
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
            .to({ y: m_addScore.y - 150, alpha: 1 }, 500, egret.Ease.sineOut).call(function () {
            m_addScore.visible = false;
            m_addScore.parent && m_addScore.parent.removeChild(m_addScore);
            m_addScore = null;
        });
        var score = GameManager.getInstance().scoreManager.totalScore;
        egret.Tween.get(this.m_score).wait(100).to({ scaleX: 1.2, scaleY: 1.2 }, 200).call(function () {
            _this.m_score.text = score + "";
            egret.Tween.get(_this.m_score).to({ scaleX: 1, scaleY: 1 }, 200);
        });
    };
    //更新进球类型
    // combo: number = 0;
    EndlessScore.prototype.addEffectHandler = function (evt) {
        var type = evt.data.type;
        if (type == "highShot") {
            // this.combo++;
            this.m_shot_type.visible = true;
            this.m_shot_type.text = "HIGH ARC SHOT";
        }
        else if (type == "kongxin") {
            // this.combo++;
            this.m_shot_type.visible = true;
            this.m_shot_type.text = "CLEAN SHOT";
        }
        else if (type == "bank") {
            // this.combo++;
            this.m_shot_type.visible = true;
            this.m_shot_type.text = "BANK SHOT";
        }
        else if (type == "yashao") {
            // this.combo++;
            this.m_shot_type.visible = true;
            this.m_shot_type.text = "BUZZER BEATER";
            this.m_mask.visible = false;
        }
        else if (type == "null") {
            // this.combo = 0;
            this.m_shot_type.visible = false;
        }
        this.updateCombo();
    };
    EndlessScore.prototype.updateCombo = function () {
        var _this = this;
        var combo = GameManager.getInstance().baskectBallManager.endlessCombo;
        if (combo > 0) {
            this.m_combo.visible = true;
            if (combo > 4) {
                this.m_combo.text = "Fire " + combo + "X";
            }
            else {
                this.m_combo.text = combo + "X";
            }
        }
        else {
            this.m_combo.visible = false;
        }
        egret.Tween.removeTweens(this.m_shot_group);
        this.m_shot_group.visible = true;
        egret.Tween.get(this.m_shot_group).to({ x: (GameConfig.curWidth() - this.m_shot_group.width) / 2, alpha: 1 }, 200).wait(500)
            .to({ x: 0, alpha: 0 }, 200, egret.Ease.sineOut).call(function () {
            _this.m_shot_group.visible = false;
            _this.m_shot_group.x = 500;
        });
    };
    //更新进度条
    EndlessScore.prototype.updateComboProgress = function (evt) {
        this.m_progress_group.visible = true;
        var percent = evt.data.percent;
        var round = evt.data.round;
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
    };
    EndlessScore.prototype.showCoin = function (evt) {
        var x = evt.data.x;
        var y = evt.data.y;
        if (!this._coin) {
            this._coin = DragonUtils.createDragonBonesDisplay("coin_ske_json", "coin_tex_json", "coin_tex_png", 'Sprite');
            dragonBones.WorldClock.clock.add(this._coin);
            this._coinDisplay = this._coin.display;
            this.m_goin_image.parent.addChildAt(this._coinDisplay, 4);
            this._coin.animation.play("Sprite", -1);
        }
        this._coinDisplay.alpha = 1;
        // this._coin.animation.stop();
        this._coinDisplay.x = x;
        this._coinDisplay.y = y;
    };
    EndlessScore.prototype.collectCoin = function (evt) {
        var _this = this;
        if (!this._coin) {
            return;
        }
        var x = this.m_coin_total.x + 50;
        var y = this.m_coin_total.y + 40;
        var horztionX = GameManager.getInstance().baskectBallManager.curSide == "left" ? this._coinDisplay.x + 100 : this._coinDisplay.x - 100;
        egret.Tween.get(this._coinDisplay).to({ x: horztionX }, 100).to({ x: x, y: y }, 600).call(function () {
            _this._coinDisplay.alpha = 0;
            // this._coin.animation.stop();
            egret.Tween.get(_this.m_goin_image).to({ scaleX: 1.6, scaleY: 1.6 }, 200).to({ scaleX: 1, scaleY: 1 }, 200);
            _this.updateGold(true);
        });
    };
    EndlessScore.prototype.updateGold = function (collect) {
        if (collect === void 0) { collect = false; }
        if (collect) {
            GameManager.getInstance().baskectBallManager.collectCoinsNumber(1);
        }
        var gold = GameManager.getInstance().baskectBallManager.coinsNumber;
        this.m_gold.text = gold + "";
    };
    return EndlessScore;
}(core.EUIComponent));
__reflect(EndlessScore.prototype, "EndlessScore");
