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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//分数界面
var ScoreView = (function (_super) {
    __extends(ScoreView, _super);
    function ScoreView() {
        var _this = _super.call(this) || this;
        _this.randomRank = new Map();
        _this.rankIndex = 1;
        _this.randomTime = new Map();
        _this.timeIndex = 1;
        _this._hasUpdateSelf = false;
        _this.isGameOver = false;
        _this._isAnimation = false;
        _this.skinName = "resource/assets/exml/ScoreView.exml";
        _this._manager = GameManager.getInstance().scoreManager;
        return _this;
    }
    ScoreView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
        this.generateRandomRank();
    };
    ScoreView.prototype.generateRandomRank = function () {
        this.randomRank.set(1, core.MathUtils.random(50, 70));
        this.randomRank.set(2, core.MathUtils.random(80, 100));
        this.randomRank.set(3, core.MathUtils.random(120, 150));
        this.randomTime.set(1, core.MathUtils.random(30, 60));
        this.randomTime.set(2, core.MathUtils.random(80, 110));
        this.randomTime.set(3, core.MathUtils.random(130, 200));
    };
    ScoreView.prototype.onShow = function (event) {
        var _this = this;
        _super.prototype.onShow.call(this);
        this.rankIndex = 1;
        this.m_self_score.text = "0";
        this.m_self_high_score.text = LanguageManager.instance.getLangeuage(17) + GameManager.getInstance().baskectBallManager.rankScore;
        this.updateGold();
        this.updateSelfRank();
        if (typeof gmbox != 'undefined') {
            var myuserInfo = BatterInfo.instance.myUserInfo;
            if (myuserInfo) {
                this.m_self_avatar.source = myuserInfo.avatar;
                this.setPlayerIconMask(this.m_self_avatar);
            }
            else {
                egret.setTimeout(function () {
                    var myuserInfo = BatterInfo.instance.myUserInfo;
                    if (myuserInfo) {
                        _this.m_self_avatar.source = myuserInfo.avatar;
                        _this.setPlayerIconMask(_this.m_self_avatar);
                    }
                }, this, 2000);
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
    };
    // private changeLayoutHierarchy() {
    //     this.m_back.parent.removeChild(this.m_back);
    //     this.parent.addChild(this.m_back);
    //     this.m_help.parent.removeChild(this.m_help);
    //     this.parent.addChild(this.m_help);
    //     this.m_vibrate.parent.removeChild(this.m_vibrate);
    //     this.parent.addChild(this.m_vibrate);
    // }
    ScoreView.prototype.setPlayerIconMask = function (image) {
        var circle = this.createCircle(1, image.width / 2 - 1);
        circle.x = image.x;
        circle.y = image.y;
        image.parent.addChild(circle);
        image.mask = circle;
    };
    ScoreView.prototype.createCircle = function (alpha, r, color) {
        if (alpha === void 0) {
            alpha = 0.3;
        }
        if (color === void 0) {
            color = 0x000000;
        }
        var sp = new egret.Sprite();
        sp.graphics.clear();
        sp.graphics.beginFill(color, alpha);
        sp.graphics.drawCircle(0, 0, r);
        sp.graphics.endFill();
        return sp;
    };
    ;
    ScoreView.prototype.addListener = function () {
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
    };
    ScoreView.prototype.removeListener = function () {
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
    };
    ScoreView.prototype.updateSelfRank = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selfInfo;
            return __generator(this, function (_a) {
                if (this._hasUpdateSelf) {
                    return [2 /*return*/];
                }
                selfInfo = PlatfromUtil.getPlatform().getSelfRank();
                if (selfInfo) {
                    this._hasUpdateSelf = true;
                    this.m_self_avatar.source = selfInfo.playerPicUrl;
                    this.setPlayerIconMask(this.m_self_avatar);
                }
                this.updateOpponentsRank(true, 0);
                return [2 /*return*/];
            });
        });
    };
    ScoreView.prototype.restartHandler = function (evt) {
        this.rankIndex = 1;
        this.timeIndex = 1;
        this.m_self_score.text = "0";
        this.m_self_high_score.text = LanguageManager.instance.getLangeuage(17) + GameManager.getInstance().baskectBallManager.rankScore;
        this.generateRandomRank();
    };
    ScoreView.prototype.updateCombo = function (evt) {
        var round = evt.data.round;
        if (round == 5 || round == 15) {
            this.m_combo1.visible = false;
            this.m_combo_label1.visible = false;
            this.m_combo2.visible = true;
            this.m_combo_label2.visible = true;
            this.m_combo2.text = round + "";
        }
        else {
            this.m_combo1.visible = true;
            this.m_combo_label1.visible = true;
            this.m_combo2.visible = false;
            this.m_combo_label2.visible = false;
            this.m_combo1.text = round + "";
        }
    };
    ScoreView.prototype.updateComboProgress = function (evt) {
        if (this.isGameOver) {
            return;
        }
        var percent = evt.data.percent;
        var round = evt.data.round;
        if (round == 5 || round == 15) {
            this.m_progress_bg.source = "img_xuetiao_h2_png";
            this.m_progress.source = "img_xuetiao_h1_png";
        }
        else {
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
        }
        else if (percent < 0.5) {
            // this.m_progress.source = "lanqiu-fangjiandanjishi-2_png";
        }
    };
    ScoreView.prototype.updateTime = function (evt) {
        var time = evt.data.time;
        if (time >= 0) {
            this.m_time.text = time + "";
        }
        if (time <= 10) {
            this.m_time.font = "time_last_fnt";
        }
        else {
            this.m_time.font = "time_fnt";
        }
        if (time == 0) {
            this.isGameOver = true;
        }
        else {
            this.isGameOver = false;
        }
    };
    //已经超越我的对手
    ScoreView.prototype.updateEnemy = function (score) {
        var _this = this;
        var targetRank = this.randomTime.get(this.timeIndex);
        if (score <= targetRank) {
            return;
        }
        var emeneyRank = PlatfromUtil.getPlatform().getOpponentsPassMeRank(this.timeIndex, score);
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
        egret.Tween.get(this.m_enemy_group).to({ x: 196 }, 400).call(function () {
            var expression = DragonUtils.createDragonBonesDisplay("expression_ske_json", "expression_tex_json", "expression_tex_png", 'Sprite');
            dragonBones.WorldClock.clock.add(expression);
            var display = expression.display;
            display.x = 60;
            display.y = 40;
            _this.m_biaoqing_group.addChild(display);
            expression.animation.play("Sprite", -1);
            egret.setTimeout(function () {
                _this.clearArmature(expression);
                _this.m_enemy_group.visible = false;
            }, _this, 4000);
        });
    };
    ScoreView.prototype.clearArmature = function (armature) {
        if (armature) {
            armature.animation.stop();
            DragonUtils.removeFromParent(armature.display);
            dragonBones.WorldClock.clock.remove(armature);
        }
    };
    /**
 * 增加分数
 */
    ScoreView.prototype.updateScoreHandler = function (evt) {
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
        var score = this._manager.totalScore;
        this.updateOpponentsRank(false, score);
        this.updateEnemy(score);
        // egret.Tween.get(this.m_self_score).to({ scaleX: 1.2, scaleY: 1.2 }, 300).call(() => {
        this.m_self_score.text = score + "";
        // }).to({ scaleX: 1, scaleY: 1 }, 300)
    };
    ScoreView.prototype.updateOpponentsRank = function (isFirst, score) {
        var _this = this;
        if (isFirst === void 0) { isFirst = true; }
        var targetRank = this.randomRank.get(this.rankIndex);
        if (score > 0 && targetRank > 0 && score <= targetRank) {
            return;
        }
        if (isFirst) {
            this.rankIndex = 1;
        }
        else {
            this.rankIndex += 1;
        }
        var nextRank = this.randomRank.get(this.rankIndex);
        var opponentsRanks = PlatfromUtil.getPlatform().getTargetOpponentsRank(this.rankIndex, nextRank);
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
                    .to({ x: 1572, scaleX: 1, scaleY: 1 }, 10).to({ x: 572 }, 400).call(function () {
                    _this._isAnimation = false;
                });
            }
        }
        else {
            this.m_opponent_group.visible = false;
            this.m_guang.visible = false;
            this.m_vs_image.visible = false;
        }
    };
    ScoreView.prototype.updateOtherScore = function (evt) {
        this.m_oppenent_score.text = evt.data + "";
    };
    /**
     * 增加空心
     */
    ScoreView.prototype.addEffectHandler = function (evt) {
        var _this = this;
        var type = evt.data.type;
        if (type == "highShot") {
            this.m_shot_type.source = "img_high arc shot_png";
        }
        else if (type == "kongxin") {
            this.m_shot_type.source = "img–clean shot_png";
        }
        else if (type == "bank") {
            this.m_shot_type.source = "img_bank shot_png";
        }
        else if (type == "yashao") {
            this.m_shot_type.source = "img_buxzzer_png";
        }
        else if (type == "null") {
            this.m_shot.visible = false;
            return;
        }
        this.m_shot.visible = true;
        egret.Tween.get(this.m_shot).to({ x: 0, alpha: 1 }, 400).to({ x: 31 }, 100)
            .wait(500).to({ x: -500, alpha: 0 }, 500, egret.Ease.sineOut).call(function () {
            _this.m_shot.visible = false;
            _this.m_shot.x = 500;
        });
    };
    ScoreView.prototype.updateGold = function () {
        var gold = GameManager.getInstance().baskectBallManager.coinsNumber;
        this.m_gold.text = gold + "";
    };
    ScoreView.prototype.collectCoin = function (evt) {
        var _this = this;
        var coins = evt.data.coinNumber;
        var pos = evt.data.pos;
        this.m_goin_image.visible = true;
        this.m_goin_image.y = Utils.euiPosToNormal1(pos).y;
        this.m_goin_image.x = Utils.euiPosToNormal1(pos).x;
        TweenUtil.playTweenGroup(this.coin, true);
        var x = this.m_coin_total.x + 50;
        var y = this.m_coin_total.y + 30;
        egret.Tween.get(this.m_goin_image).to({ x: x, y: y }, 1000).call(function () {
            TweenUtil.stopTweenGroup(_this.coin);
            egret.Tween.get(_this.m_goin_image).to({ scaleX: 0, scaleY: 0 }, 300);
            _this.updateGold();
        });
    };
    ScoreView.prototype.showExitDialog = function () {
        EventUtils.logEvent("click_exit");
        var pauseView = new ExitDialog();
        pauseView.popUp();
    };
    ScoreView.prototype.showHelpDialog = function () {
        EventUtils.logEvent("click_help");
        core.ResUtils.loadGroups(["help"], function (progress) {
        }, function (fail) {
        }, function (loadComplete) {
            new HelpDialog().popUp();
        }, this);
    };
    ScoreView.prototype.switchMikeStatus = function () {
    };
    /**收到语音修改 */
    ScoreView.prototype.voiceChange = function (evt) {
        var data = evt.data;
        this.updateVoiceStatus(data.userId, data.status);
    };
    ScoreView.prototype.updateVoiceStatus = function (userId, status) {
        // if (userId == BatterInfo.instance.myUserInfo.userId) {//我的
        //     this.m_game_mike.source = `games_voice_${status == 1 ? "on_png" : "off_png"}`;
        // } else {
        //     this.m_other_game_mike.source = `games_voice_${status == 1 ? "on_png" : "off_png"}`;
        // }
    };
    ScoreView.prototype.headClick = function (evt) {
        if (typeof gmbox != 'undefined') {
            var userId = void 0;
            if (evt.currentTarget === this.m_self_avatar) {
                userId = BatterInfo.instance.myUserInfo.userId;
            }
            else {
                userId = BatterInfo.instance.otherUserInfo.userId;
            }
            if (gmbox.openUserInfoDialog)
                gmbox.openUserInfoDialog({ uid: userId });
        }
    };
    return ScoreView;
}(core.EUIComponent));
__reflect(ScoreView.prototype, "ScoreView");
