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
var ResultDialog = (function (_super) {
    __extends(ResultDialog, _super);
    function ResultDialog() {
        var _this = _super.call(this) || this;
        _this._has_collect_coin = false;
        _this.skinName = "resource/assets/exml/ResultView.exml";
        _this.top = _this.bottom = _this.left = _this.right = 0;
        _this.baskectBallManager = GameManager.getInstance().baskectBallManager;
        _this.scoreManager = GameManager.getInstance().scoreManager;
        return _this;
    }
    ResultDialog.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
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
        }
        else {
            this.free_coin_group.visible = true;
        }
    };
    ResultDialog.prototype.logEvent = function () {
        var totalScore = this.scoreManager.totalScore;
        var coinsNumber = this.baskectBallManager.coinsNumber;
        var curCoin = this.baskectBallManager._curCoins;
        EventUtils.logEvent("score", {
            "score": totalScore
        });
        EventUtils.logEvent("coin", {
            "curCoin": curCoin,
            "totalCoin": coinsNumber
        });
    };
    ResultDialog.prototype.updateGold = function () {
        var _this = this;
        var gold = this.baskectBallManager.coinsNumber;
        egret.Tween.get(this.m_total_coin).to({ scaleX: 1.2, scaleY: 1.2 }, 300).call(function () {
            _this.m_total_coin.text = gold + "";
        }).to({ scaleX: 1, scaleY: 1 }, 300);
        this.updateBuySkin(gold);
    };
    ResultDialog.prototype.updateBuySkin = function (gold) {
        var skinInfo = this.baskectBallManager.skinInfo;
        skinInfo.sort(function (a, b) {
            var a0 = parseInt(a);
            var b0 = parseInt(b);
            return a0 - b0;
        });
        var targetSkin = -1;
        var arr = [3, 4, 5, 6]; //[1, 2, 3, 4, 5, 6]
        for (var j = 0; j < arr.length; j++) {
            var isFind = false;
            for (var i = 0; i < skinInfo.length; i++) {
                var skinId = parseInt(skinInfo[i]);
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
        if (targetSkin == -1) {
            this.m_finger.visible = false;
            this.m_skin_point.visible = false;
            this.m_skin_btn.touchEnabled = true;
            return;
        }
        var price = BaskectBallManager.BASKET_PRICE[targetSkin];
        if (gold >= price) {
            this.m_finger.visible = true;
            this.m_skin_point.visible = true;
            this.m_skin_btn.touchEnabled = true;
            TweenUtil.playTweenGroup(this.finger, true);
        }
        else {
            this.m_finger.visible = false;
            this.m_skin_point.visible = false;
            // Utils.gray(this.m_skin_btn);
            // this.m_skin_btn.touchEnabled = false;
            TweenUtil.stopTweenGroup(this.finger);
        }
    };
    ResultDialog.prototype.addListener = function () {
        this.m_home_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goGameHome, this);
        this.m_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backEvent, this);
        this.m_restart_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartGame, this);
        // this.m_share_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
        this.m_skin_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSkin, this);
        this.free_coin_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.collectCoin, this);
        this.free_coin_ad_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.collectCoinAd, this);
        // GameManager.getInstance().addEventListener(GameManager.REFRESH_GOLD, this.updateGold, this);
    };
    ResultDialog.prototype.removeListener = function () {
        this.m_home_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goGameHome, this);
        this.m_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.backEvent, this);
        this.m_restart_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.restartGame, this);
        // this.m_share_rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
        this.m_skin_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSkin, this);
        this.free_coin_group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.collectCoin, this);
        this.free_coin_ad_group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.collectCoinAd, this);
        // GameManager.getInstance().removeEventListener(GameManager.REFRESH_GOLD, this.updateGold, this);
    };
    ResultDialog.prototype.popUp = function () {
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    };
    ResultDialog.prototype.showResultLabel = function () {
        var result;
        SoundMgr.getInstance().gameover(result);
        egret.setTimeout(function () {
            game.BattleManager.instance.postResult(result);
        }, this, 3000);
    };
    ResultDialog.prototype.getData = function () {
        this.recordData = JSON.parse(localStorage.getItem("record"));
        egret.log(this.recordData);
    };
    ResultDialog.prototype.setScoreText = function () {
        this.getData();
        var totalScore = this.scoreManager.totalScore;
        var rankScore = this.baskectBallManager.rankScore;
        var maxCombo = this.baskectBallManager.maxCombo;
        var maxKongxin = this.baskectBallManager.kongxinCount;
        var maxBank = this.baskectBallManager.bankCount;
        var maxHighShot = this.baskectBallManager.highShotCount;
        var maxYashao = this.baskectBallManager.yashaoCount;
        var coinCount = this.baskectBallManager._curCoins;
        this.m_score.text = totalScore + "";
        if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            var rank = JSON.parse(localStorage.getItem("endless_rank"));
            if (rank) {
                rankScore = rank.score;
            }
            else {
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
                });
            }
            else {
                PlatfromUtil.getPlatform().setScoreAsync(totalScore);
            }
        }
        else {
            this.m_rank.text = LanguageManager.instance.getLangeuage(2);
        }
        this.m_max_combo.text = maxCombo + "";
        this.m_clean_shot.text = maxKongxin + "";
        this.m_ban_shot.text = maxBank + "";
        this.m_high_shot.text = maxHighShot + "";
        this.m_buzzer_shot.text = maxYashao + "";
        this.m_cur_coin_number.text = coinCount + "";
        if (this.recordData) {
            var recordCombo = this.recordData.m_max_combo;
            if (maxCombo > recordCombo) {
                egret.Tween.get(this.m_combo_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_max_combo);
                this.changedToRrecordText(this.m_max_combo_label);
            }
            else {
                maxCombo = recordCombo;
            }
            var recordClean = this.recordData.m_clean_shot;
            if (maxKongxin > recordClean) {
                egret.Tween.get(this.m_clean_shot_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_clean_shot);
                this.changedToRrecordText(this.m_clean_shot_label);
            }
            else {
                maxKongxin = recordClean;
            }
            var recordBank = this.recordData.m_bank_shot;
            if (maxBank > recordBank) {
                egret.Tween.get(this.m_ban_shot_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_ban_shot);
                this.changedToRrecordText(this.m_ban_shot_label);
            }
            else {
                maxBank = recordBank;
            }
            var recordHigh = this.recordData.m_high_shot;
            if (maxHighShot > recordHigh) {
                egret.Tween.get(this.m_high_shot_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_high_shot);
                this.changedToRrecordText(this.m_high_shot_label);
            }
            else {
                maxHighShot = recordHigh;
            }
            var recordYashao = this.recordData.m_buzzer_shot;
            if (maxYashao > recordYashao) {
                egret.Tween.get(this.m_buzzer_shot_new).to({ x: 0, alpha: 1 }, 500, egret.Ease.bounceIn);
                this.changedToRrecordText(this.m_buzzer_shot);
                this.changedToRrecordText(this.m_buzzer_shot_label);
            }
            else {
                maxYashao = recordYashao;
            }
        }
        this.saveData(totalScore, maxCombo, maxKongxin, maxBank, maxHighShot, maxYashao);
        if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            localStorage.setItem("endless_rank", JSON.stringify({
                "score": totalScore,
            }));
        }
    };
    ResultDialog.prototype.changedToRrecordText = function (label) {
        label.textColor = 0xFF1a1a;
        label.strokeColor = 0xffdada;
        label.stroke = 2;
    };
    ResultDialog.prototype.saveData = function (score, combo, clean, bank, high, buzzer) {
        var json = {
            "m_score": score,
            "m_max_combo": combo,
            "m_clean_shot": clean,
            "m_bank_shot": bank,
            "m_high_shot": high,
            "m_buzzer_shot": buzzer
        };
        localStorage.setItem("record", JSON.stringify(json));
    };
    ResultDialog.prototype.closeDialog = function () {
        if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this);
        }
    };
    ResultDialog.prototype.backEvent = function () {
        EventUtils.logEvent("click_back");
        this.closeDialog();
        this.baskectBallManager.reset();
        GlobalManager.getInstance().goLobby();
    };
    ResultDialog.prototype.goGameHome = function () {
        EventUtils.logEvent("click_home");
        this.closeDialog();
        this.baskectBallManager.reset();
        GlobalManager.getInstance().goLobby();
    };
    ResultDialog.prototype.restartGame = function () {
        EventUtils.logEvent("click_restart");
        this.closeDialog();
        GameManager.getInstance().restart();
    };
    ResultDialog.prototype.shareGame = function () {
        EventUtils.logEvent("click_resultShare");
        PlatfromUtil.getPlatform().share();
    };
    ResultDialog.prototype.changeSkin = function () {
        EventUtils.logEvent("click_resultSkin");
        var skinsView = new ChangeSkinView();
        skinsView.popUp();
    };
    ResultDialog.prototype.collectCoin = function () {
        EventUtils.logEvent("click_collectCoin");
        if (this._has_collect_coin) {
            return;
        }
        this._has_collect_coin = true;
        this.playCollectCoinAnimation(false);
    };
    ResultDialog.prototype.collectCoinAd = function () {
        var _this = this;
        EventUtils.logEvent("click_collectCoinAd");
        if (this._has_collect_coin) {
            return;
        }
        var successCallback = function () {
            _this._has_collect_coin = true;
            SoundMgr.getInstance().playBGM();
            egret.setTimeout(function () {
                _this.playCollectCoinAnimation(true);
            }, _this, 300);
        };
        AdManager.showRewardedVideoAd(successCallback);
        SoundMgr.getInstance().stopBGM();
    };
    ResultDialog.prototype.getCoin = function (coinCount) {
        Utils.gray(this.free_coin_group);
        Utils.gray(this.free_coin_ad_group);
        this.free_coin_group.touchEnabled = false;
        this.free_coin_ad_group.touchEnabled = false;
        this.baskectBallManager.collectCoinsNumber(coinCount);
        TweenUtil.stopTweenGroup(this.adCoin);
        this.updateGold();
    };
    ResultDialog.prototype.playCollectCoinAnimation = function (isAd) {
        var _this = this;
        var coinNum = isAd ? 120 : 40;
        var _coin = DragonUtils.createDragonBonesDisplay("langqiu_feijingbi_ske_json", "langqiu_feijingbi_tex_json", "langqiu_feijingbi_tex_png", 'Armature');
        _coin.addEventListener(dragonBones.EgretEvent.COMPLETE, function () {
            _this.getCoin(coinNum);
            _coin.display.parent && _coin.display.parent.removeChild(_coin.display);
            dragonBones.WorldClock.clock.remove(_coin);
        }, this);
        dragonBones.WorldClock.clock.add(_coin);
        var _coinDisplay = _coin.display;
        _coinDisplay.x = this.m_coin_total.x + 58;
        _coinDisplay.y = this.m_coin_total.y + 46;
        this.addChild(_coinDisplay);
        _coin.animation.play("newAnimation_1", 1);
        if (_coin != null) {
            return;
        }
        // this.m_coin_collect.visible = true;
        var targetX = 0;
        var targetY = 0;
        if (isAd) {
            targetX = this.m_ad_coin_image.localToGlobal().x;
            targetY = this.m_ad_coin_image.localToGlobal().y;
        }
        else {
            targetX = this.m_free_coin_image.localToGlobal().x;
            targetY = this.m_free_coin_image.localToGlobal().y;
        }
        var coinCount = isAd ? 120 : 40;
        var x = this.m_coin_total.localToGlobal().x + 55;
        var y = this.m_coin_total.localToGlobal().y + 40;
        var _loop_1 = function (i) {
            var goldImg = new egret.Bitmap(RES.getRes("img_jinbi_xiao_png"));
            this_1.addChild(goldImg);
            goldImg.width = 32;
            goldImg.height = 32;
            goldImg.anchorOffsetX = 16;
            goldImg.anchorOffsetY = 16;
            goldImg.x = targetX;
            goldImg.y = targetY;
            var angle = 360 / 5 * i;
            var radius = 100;
            var x1 = targetX + (radius - 0.2 * radius * Math.random()) * Math.cos(angle * Math.PI / 180);
            var y1 = targetY + (radius - 0.2 * radius * Math.random()) * Math.sin(angle * Math.PI / 180);
            egret.Tween.get(goldImg).wait(50 + 10 * i).to({ x: x1, y: y1 }, 200).wait(400).to({ x: x, y: y }, 500).to({ scaleX: 1.5, scaleY: 1.5 }, 100).call(function () {
                if (i == 4) {
                    Utils.gray(_this.free_coin_group);
                    Utils.gray(_this.free_coin_ad_group);
                    _this.free_coin_group.touchEnabled = false;
                    _this.free_coin_ad_group.touchEnabled = false;
                    _this.baskectBallManager.collectCoinsNumber(coinCount);
                    TweenUtil.stopTweenGroup(_this.adCoin);
                    _this.updateGold();
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < 5; i++) {
            _loop_1(i);
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
    };
    return ResultDialog;
}(core.EUIComponent));
__reflect(ResultDialog.prototype, "ResultDialog");
