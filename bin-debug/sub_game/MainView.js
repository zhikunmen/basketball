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
/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-03
 * Desc   ： 游戏界面视图
 ********************************/
var MainView = (function (_super) {
    __extends(MainView, _super);
    function MainView() {
        var _this = _super.call(this) || this;
        _this._ballAngular = 0.05;
        _this._ballForce_x = 4.0;
        _this._ballForce_y = -16;
        _this._netDisplays = [];
        _this._netW = 4;
        _this._netH = 4;
        _this._isFirst = true;
        _this._avgposYArr = [];
        _this._isKongxin = true; //是否空心球
        _this._isBank = false; //是否篮板球
        _this._isHighShot = false; //是否高弧度进球
        _this._basketrys = new Map();
        _this._hou = [];
        _this._qian = [];
        _this._fire = [];
        _this._isReadyGo = false;
        /**
         * 调整篮筐的高度
         */
        _this.sideleftPosY = -1;
        _this.sideRightPosY = 1;
        _this._fromBank = false;
        /**
         * 播放动画
         */
        _this._isTilt = false;
        _this._shakeNum = 1;
        _this._hasShake = false;
        _this._fromUnder = new Map();
        _this._netAnimation = false;
        _this._switching = false;
        _this._hasWin = false;
        _this._jinQiuStatus = new Map();
        _this._tempY = 0;
        _this._tempX = 0;
        _this._flagTimestamp = -1;
        _this._finishRound = false;
        _this._isBabySleep = false;
        _this.hasGameOver = false;
        _this._playGame = false;
        _this._loadHelpRes = false;
        _this.skinName = "resource/assets/exml/MainView.exml";
        _this._manager = GameManager.getInstance().baskectBallManager;
        return _this;
        //BaskectballController.getInstance().init();
    }
    MainView.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
        this._matterScene = new core.MatterScene();
        this._manager.matterScene = this._matterScene;
        this._walls = new MatterWalls();
        this.addChild(this._walls);
        this._particleView = new ParticleView();
        this.addChild(this._particleView);
        if (GameConfig.openGUI) {
            core.DatGuiUtil.getInstance().addItem("ball_x", this._ballForce_x);
            core.DatGuiUtil.getInstance().addItem("ball_y", this._ballForce_y);
            core.DatGuiUtil.getInstance().addItem("gravity", this._matterScene.gravity);
            var self_1 = this;
            core.DatGuiUtil.getInstance().addEventListener(core.DatGuiUtil.DAT_GUI_FINISH_CHANGE, function (_a) {
                var data = _a.data;
                if (data.name == "ball_x") {
                    self_1._ballForce_x = data.val;
                }
                else if (data.name == "ball_y") {
                    self_1._ballForce_y = data.val;
                }
                else if (data.name = "gravity") {
                    _this._matterScene.gravity = data.val;
                }
            }, this);
        }
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            EventUtils.logEvent("launch_timeMode_game");
        }
        else {
            EventUtils.logEvent("launch_funMode_game");
        }
    };
    MainView.prototype.creatScenne = function () {
        var _this = this;
        if (this._basketrys) {
            this._basketrys.forEach(function (value, key) {
                var b = value;
                b.forEach(function (element) {
                    core.MatterUtil.removeBody(element);
                });
            });
            this._basketrys.clear();
        }
        var index = this._manager.curPos;
        if (!index) {
            return;
        }
        var _basketryArray;
        index.forEach(function (element) {
            var _basketry = core.MatterUtil.addOneBox(Utils.euiPosToNormal(_this["m_" + _this._manager.curSide + "_basketry_kuan" + element]).x, Utils.euiPosToNormal(_this["m_" + _this._manager.curSide + "_basketry_kuan" + element]).y, _this["m_" + _this._manager.curSide + "_basketry_kuan" + element].width, _this["m_" + _this._manager.curSide + "_basketry_kuan" + element].height, 0);
            var _basketryPoint = core.MatterUtil.addOneBox(Utils.euiPosToNormal(_this["m_" + _this._manager.curSide + "_colli_point" + (2 * element - 1)]).x, Utils.euiPosToNormal(_this["m_" + _this._manager.curSide + "_colli_point" + (2 * element - 1)]).y, _this["m_" + _this._manager.curSide + "_colli_point" + (2 * element - 1)].width, _this["m_" + _this._manager.curSide + "_colli_point" + (2 * element - 1)].height, 0);
            var _basketryPoint1 = core.MatterUtil.addOneBox(Utils.euiPosToNormal(_this["m_" + _this._manager.curSide + "_colli_point" + (2 * element)]).x, Utils.euiPosToNormal(_this["m_" + _this._manager.curSide + "_colli_point" + (2 * element)]).y, _this["m_" + _this._manager.curSide + "_colli_point" + (2 * element)].width, _this["m_" + _this._manager.curSide + "_colli_point" + (2 * element)].height, 0);
            // (this[`m_${this._manager.curSide}_basketry_part${(2 * element - 1)}`] as egret.DisplayObjectContainer).removeChildren();
            // (this[`m_${this._manager.curSide}_basketry_part${(2 * element)}`] as egret.DisplayObjectContainer).removeChildren();
            _this.createNet(element, 1);
            _basketryArray = [];
            Matter.World.add(_this._matterScene.world, _basketry);
            _basketry.isStatic = true;
            _basketry.label = "basketryBank";
            _basketryArray.push(_basketry);
            Matter.World.add(_this._matterScene.world, _basketryPoint);
            _basketryPoint.isStatic = true;
            _basketryPoint.label = "basketryPoint";
            _basketryArray.push(_basketryPoint);
            Matter.World.add(_this._matterScene.world, _basketryPoint1);
            _basketryPoint1.isStatic = true;
            _basketryPoint1.label = "basketryPoint";
            _basketryArray.push(_basketryPoint1);
            _this._basketrys.set(element, _basketryArray);
        });
    };
    MainView.prototype.clearArmature = function (armatures) {
        if (armatures == null || armatures.length == 0) {
            return;
        }
        armatures.forEach(function (armature) {
            if (armature) {
                armature.animation.stop();
                DragonUtils.removeFromParent(armature.display);
                dragonBones.WorldClock.clock.remove(armature);
                armature = null;
            }
        });
    };
    MainView.prototype.createNet = function (element, type) {
        this["m_" + this._manager.curSide + "_basketry_part" + (2 * element - 1)].removeChildren();
        this["m_" + this._manager.curSide + "_basketry_part" + (2 * element)].removeChildren();
        if (!this.factory) {
            this.factory = DragonUtils.createDragonBones("net_back_ske_json", "net_back_tex_json", "net_back_tex_png");
        }
        var hou = this.factory.buildArmature("" + type);
        if (!this.factory2) {
            this.factory2 = DragonUtils.createDragonBones("net_font_ske_json", "net_font_tex_json", "net_font_tex_png");
        }
        var qian = this.factory2.buildArmature("" + type);
        dragonBones.WorldClock.clock.add(hou);
        this._hou.push(hou);
        var houDisplay = hou.display;
        if (this._manager.curSide == "left") {
            houDisplay.scaleX = -1;
        }
        else {
            houDisplay.scaleX = 1;
        }
        houDisplay.anchorOffsetX = 61;
        dragonBones.WorldClock.clock.add(qian);
        this._qian.push(qian);
        var qianDisplay = qian.display;
        if (this._manager.curSide == "left") {
            qianDisplay.scaleX = -1;
        }
        else {
            qianDisplay.scaleX = 1;
        }
        qianDisplay.anchorOffsetX = 61;
        this["m_" + this._manager.curSide + "_basketry_part" + (2 * element - 1)].addChild(houDisplay);
        this["m_" + this._manager.curSide + "_basketry_part" + (2 * element)].addChild(qianDisplay);
        hou.animation.play("newAnimation", 1);
        qian.animation.play("newAnimation", 1);
    };
    MainView.prototype.playFire = function (element) {
        var _this = this;
        if ((GameConfig.gameMode == GameConfig.GameMode.TIME && this._manager.curCombo < 4)
            || (GameConfig.gameMode == GameConfig.GameMode.ENDLESS && this._manager.endlessCombo < 5)) {
            return;
        }
        var fire = this._fire.pop();
        if (!fire) {
            fire = DragonUtils.createDragonBonesDisplay("fire_ske_json", "fire_tex_json", "fire_tex_png", 'Sprite');
            dragonBones.WorldClock.clock.add(fire);
            fire.addEventListener(dragonBones.EgretEvent.COMPLETE, function () {
                _this._fire.push(fire);
                fire.display.parent && fire.display.parent.removeChild(fire.display);
            }, this);
        }
        var display = fire.display;
        display.x = 60;
        display.y = -40;
        this["m_" + this._manager.curSide + "_fire_group" + element].addChild(display);
        fire.animation.play("Sprite", -1);
    };
    /**
     * 检测网有没有碰撞
     */
    MainView.prototype.checkNetCollision = function () {
        if (this._ballBody.collisionFilter.mask == 0x002 && (this._ballBody.position.y > 600 || !this._hasWin)) {
            var vy = this._ballBody.velocity.y;
            this.addBallBody(this._ballBody.position.y, 0, this._ballBody.position.x);
            Matter.Body.setVelocity(this._ballBody, { x: 0, y: vy });
        }
    };
    MainView.prototype.disableNetCollision = function () {
        this._ballBody.collisionFilter.mask = 0x002;
    };
    /**
     * 显示
     */
    MainView.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this);
        // this.restartHandler(null);
        // this.startGame();
        // this.m_ball.source = "mg_qiu_" + GameManager.getInstance().baskectBallManager.use + "_png";
        //this.m_ball.source=ChangeSkinView.getInstance().targetBall;
        //this.m_ball.source=ChangeSkinView.getInstance().skinPlay[ChangeSkinView.getInstance().searchSelect()].m_ball.source;
        this.readyGo();
    };
    MainView.prototype.readyGo = function () {
        var _this = this;
        if (this._isReadyGo) {
            return;
        }
        this._isReadyGo = true;
        this._readyGo.visible = true;
        SoundMgr.getInstance().playReadyGo();
        this.tween.play();
        this.tween.once(egret.Event.COMPLETE, function () {
            _this.m_gamedesc.visible = GameConfig.showTips;
            TweenUtil.playTweenGroup(_this.game, true);
            _this.restartHandler(null);
        }, this);
    };
    //开始游戏
    MainView.prototype.startGame = function () {
        if (!this._matterScene) {
            return;
        }
        this.switchSideHandler();
        this.addBallBody(-1, 0, 350);
        this.m_shadow.visible = true;
    };
    MainView.prototype.addBallBody = function (y, velocityX, x) {
        if (y === void 0) { y = -1; }
        if (velocityX === void 0) { velocityX = 0; }
        if (x === void 0) { x = -1; }
        if (y == -1) {
            y = GameConfig.curHeight() / 2;
        }
        if (x == -1) {
            if (this._manager.curSide == "right") {
                x = 10;
            }
            else {
                x = GameConfig.curWidth() - 10;
            }
        }
        core.MatterUtil.removeBody(this._ballBody);
        this._ballBody = core.MatterUtil.addOneBall(x, y, this.m_ball.width / 2, 0);
        this._ballBody.density = 0.3,
            this._ballBody.restitution = 0.7,
            this._ballBody.displays = [this.m_ball];
        this._ballBody.label = "ball";
        this._ballBody.collisionFilter.group = -2;
        Matter.World.add(this._matterScene.world, this._ballBody);
        if (velocityX) {
            Matter.Body.setVelocity(this._ballBody, { x: velocityX, y: 0 });
        }
    };
    MainView.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this);
    };
    /**
     * 添加监听
     */
    MainView.prototype.addListener = function () {
        Matter.Events.on(this._matterScene.engine, 'collisionStart', this.onCollisionStart.bind(this));
        Matter.Events.on(this._matterScene.engine, 'collisionEnd', this.onCollisionEnd.bind(this));
        Matter.Events.on(this._matterScene.engine, "beforeUpdate", this.onUpdateBefore.bind(this));
        this._manager.addEventListener(BattleEventConst.GAME_START, this.readyGo, this);
        this._manager.addEventListener(BaskectBallManager.SWITCH_SIDE, this.switchSideHandler, this);
        this._manager.addEventListener(BaskectBallManager.COMPLETE_TIMEOUT, this.completeTimeoutHandler, this);
        this._manager.addEventListener(BaskectBallManager.REBORN, this.rebornHandler, this);
        this._manager.addEventListener(BaskectBallManager.CHANGE_SKIN, this.changeSkinHandler, this);
        GameManager.getInstance().addEventListener(GameManager.PAUSE_GAME, this.pauseGameHandler, this);
        GameManager.getInstance().addEventListener(GameManager.RESUME_GAME, this.resumeGameHandler, this);
        GameManager.getInstance().addEventListener(GameManager.RESTART_GAME, this.restartHandler, this);
        this.m_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showExitDialog, this);
        this.m_help.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showHelpDialog, this);
        this.m_pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showPauseDialog, this);
    };
    /**
     * 删除监听
     */
    MainView.prototype.removeListener = function () {
        // GameConfig.curStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        Matter.Events.off(this._matterScene.engine, 'collisionStart', this.onCollisionStart.bind(this));
        Matter.Events.off(this._matterScene.engine, 'collisionEnd', this.onCollisionEnd.bind(this));
        Matter.Events.off(this._matterScene.engine, "beforeUpdate", this.onUpdateBefore.bind(this));
        this._manager.removeEventListener(BattleEventConst.GAME_START, this.readyGo, this);
        this._manager.removeEventListener(BaskectBallManager.SWITCH_SIDE, this.switchSideHandler, this);
        this._manager.removeEventListener(BaskectBallManager.COMPLETE_TIMEOUT, this.completeTimeoutHandler, this);
        this._manager.removeEventListener(BaskectBallManager.REBORN, this.rebornHandler, this);
        this._manager.removeEventListener(BaskectBallManager.CHANGE_SKIN, this.changeSkinHandler, this);
        GameManager.getInstance().removeEventListener(GameManager.PAUSE_GAME, this.pauseGameHandler, this);
        GameManager.getInstance().removeEventListener(GameManager.RESUME_GAME, this.resumeGameHandler, this);
        GameManager.getInstance().removeEventListener(GameManager.RESTART_GAME, this.restartHandler, this);
        this.m_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showExitDialog, this);
        this.m_help.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showHelpDialog, this);
        this.m_pause.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showPauseDialog, this);
    };
    MainView.prototype.stopFrontMc = function (evt) {
        // this._frontMc.gotoAndStop(1);
    };
    MainView.prototype.stopBackMc = function (evt) {
        // this._backMc.gotoAndStop(1);
    };
    //暂停
    MainView.prototype.pauseGameHandler = function (evt) {
        // GameConfig.curStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        if (this._matterScene) {
            this._matterScene.runner.enabled = false;
        }
        this._manager.pauseGame();
    };
    //恢复
    MainView.prototype.resumeGameHandler = function (evt) {
        // GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        if (this._matterScene) {
            this._matterScene.runner.enabled = true;
        }
        this._manager.resumeGame(!this._isFirst);
    };
    MainView.prototype.rebornGameHandler = function (evt) {
        // GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        this.hasGameOver = false;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        if (this._matterScene) {
            this._matterScene.runner.enabled = true;
        }
        this._manager.rebornGame();
    };
    MainView.prototype.restartGameHandler = function (evt) {
        // GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        if (this._matterScene) {
            this._matterScene.runner.enabled = true;
        }
    };
    /**
     * 改变篮筐方向
     */
    MainView.prototype.switchSideHandler = function () {
        var _this = this;
        this._isKongxin = true;
        this._isBank = false;
        this._hasWin = false;
        this._isHighShot = false;
        this._jinQiuStatus.clear();
        this._finishRound = false;
        this._hasShake = false;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            if (!this._isFirst) {
                this._manager.startCombTimer();
            }
            else {
                this._manager.startTimeout(); //开始倒计时
            }
        }
        else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
            if (!this._isFirst) {
                this._manager.startCombTimer();
            }
        }
        // GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        // this.creatScenne();
        this.m_left.visible = this.m_right.visible = false;
        this._shapeContainer && (this._shapeContainer.visible = false);
        this.hideView();
        if (this._manager.isYanMode()) {
            this._particleView && this.addChild(this._particleView);
            this.addChild(this.m_ball);
        }
        else {
            this.addChild(this.m_ball);
            this._particleView && this.addChild(this._particleView);
        }
        if (this._manager.curSide == "left") {
            this._shapeContainer = this.m_shapeContainer_left;
            this.m_left.visible = true;
            this.m_left.right = 500;
            egret.Tween.get(this.m_left).to({ right: 0 }, 400, egret.Ease.bounceIn).call(function () {
                _this.creatScenne();
                _this._shapeContainer.visible = true;
                if (_this._manager.isYanMode()) {
                    _this.m_left_ball_container.addChild(_this._particleView);
                    _this.m_left_ball_container.addChild(_this.m_ball);
                }
                else {
                    _this.m_left_ball_container.addChild(_this.m_ball);
                    _this.m_left_ball_container.addChild(_this._particleView);
                }
                _this.showCoinImage();
            });
        }
        else {
            this.m_right.visible = true;
            this.m_right.left = 500;
            this._shapeContainer = this.m_shapeContainer_right;
            egret.Tween.get(this.m_right).to({ left: 0 }, 400, egret.Ease.bounceIn).call(function () {
                _this.creatScenne();
                _this._shapeContainer.visible = true;
                if (_this._manager.isYanMode()) {
                    _this.m_right_ball_container.addChild(_this._particleView);
                    _this.m_right_ball_container.addChild(_this.m_ball);
                }
                else {
                    _this.m_right_ball_container.addChild(_this.m_ball);
                    _this.m_right_ball_container.addChild(_this._particleView);
                }
                _this.showCoinImage();
            });
        }
    };
    MainView.prototype.showCoinImage = function () {
        if (GameConfig.gameMode != GameConfig.GameMode.ENDLESS) {
            return;
        }
        var pos = this._manager.curPos[0];
        var x;
        var y;
        var xOffset = 125;
        var yOffset = 230;
        var p = core.MathUtils.random(0, 2);
        if (pos == 1) {
            if (this._manager.curSide == "left") {
                x = p ? xOffset : xOffset + 100;
            }
            else {
                x = p ? GameConfig.curWidth() - xOffset : GameConfig.curWidth() - xOffset - 100;
            }
            y = GameConfig.curHeight() - 796 - yOffset;
        }
        else if (pos == 2) {
            if (this._manager.curSide == "left") {
                x = p ? xOffset : xOffset + 100;
            }
            else {
                x = p ? GameConfig.curWidth() - xOffset : GameConfig.curWidth() - xOffset - 100;
            }
            y = GameConfig.curHeight() - 596 - yOffset;
        }
        else {
            if (this._manager.curSide == "left") {
                x = p ? xOffset : xOffset + 100;
            }
            else {
                x = p ? GameConfig.curWidth() - xOffset : GameConfig.curWidth() - xOffset - 100;
            }
            y = GameConfig.curHeight() - 396 - yOffset;
        }
        this["m_" + this._manager.curSide + "_coin"].visible = true;
        this["m_" + this._manager.curSide + "_coin"].x = x;
        this["m_" + this._manager.curSide + "_coin"].y = y;
        this._manager.dispatchEventWith("show_coin", false, { x: x, y: y });
    };
    MainView.prototype.isCollectCoin = function () {
        if (!this["m_" + this._manager.curSide + "_coin"].visible) {
            return;
        }
        var left = this["m_" + this._manager.curSide + "_coin"].x - 14;
        var right = this["m_" + this._manager.curSide + "_coin"].x + 14;
        var top = this["m_" + this._manager.curSide + "_coin"].y - 14;
        var bottom = this["m_" + this._manager.curSide + "_coin"].y + 14;
        if (this.m_ball.hitTestPoint(left, top) || this.m_ball.hitTestPoint(left, bottom)
            || this.m_ball.hitTestPoint(right, top) || this.m_ball.hitTestPoint(right, bottom)) {
            this["m_" + this._manager.curSide + "_coin"].visible = false;
            this._manager.dispatchEvent(new egret.Event("collect_coin"));
        }
    };
    MainView.prototype.hideView = function () {
        var _this = this;
        this.clearArmature(this._hou);
        this.clearArmature(this._qian);
        var self = this;
        [1, 2, 3].forEach(function (element) {
            _this["m_" + _this._manager.curSide + "_basketry_block" + element].visible = false;
            _this["m_" + _this._manager.curSide + "_basketry_part" + (2 * element - 1)].visible = false;
            _this["m_" + _this._manager.curSide + "_basketry_part" + (2 * element)].visible = false;
        });
        this.showView();
    };
    MainView.prototype.showView = function () {
        var _this = this;
        var index = this._manager.curPos;
        if (!index) {
            return;
        }
        index.forEach(function (element) {
            _this["m_" + _this._manager.curSide + "_basketry_block" + element].visible = true;
            _this["m_" + _this._manager.curSide + "_basketry_part" + (2 * element - 1)].visible = true;
            _this["m_" + _this._manager.curSide + "_basketry_part" + (2 * element)].visible = true;
        });
    };
    MainView.prototype.changeSidePosY = function (side) {
        var addedTop = 0;
        var target;
        var ran = 0;
        if (side == "left") {
            target = this.m_left;
        }
        else {
            target = this.m_right;
        }
        ran = core.MathUtils.random(200, GameConfig.curHeight() - 500);
        addedTop = ran - this["m_" + this._manager.curSide + "_basketry_block"].top;
        egret.log(ran, addedTop);
        //改变篮筐高度
        for (var i = 0; i < target.numChildren; i++) {
            var display = target.getChildAt(i);
            if (display.numChildren && (display.top == 0)) {
                for (var j = 0; j < display.numChildren; j++) {
                    var child = display.getChildAt(j);
                    child.top += addedTop;
                }
            }
            else if (display.top != 0) {
                display.top += addedTop;
            }
        }
    };
    /**
     * 倒计时结束
     */
    MainView.prototype.completeTimeoutHandler = function (evt) {
        // GameConfig.curStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
    };
    /**
     * 复活
     */
    MainView.prototype.rebornHandler = function (evt) {
        // GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        this.rebornGameHandler(null);
    };
    MainView.prototype.changeSkinHandler = function (evt) {
        console.log(evt);
    };
    MainView.prototype.onCollisionStart = function (evt) {
        var pairs = evt.pairs;
        var self = this;
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (pairs[i].bodyA.label == "ball" && pairs[i].bodyB.label == "background" || (pairs[i].bodyA.label == "background" && pairs[i].bodyB.label == "ball")) {
                SoundMgr.getInstance().playGround();
                this.isGameover(true);
            }
            else if (pairs[i].bodyA.label == "ball" && pairs[i].bodyB.label == "basketryPoint" || (pairs[i].bodyA.label == "basketryPoint" && pairs[i].bodyB.label == "ball")) {
                this._isKongxin = false;
                SoundMgr.getInstance().playKuang();
                if (this._fromBank) {
                    this._isBank = true;
                }
            }
            else if (pairs[i].bodyA.label == "ball" && pairs[i].bodyB.label == "basketryBank" || (pairs[i].bodyA.label == "basketryBank" && pairs[i].bodyB.label == "ball")) {
                SoundMgr.getInstance().playBank();
                self._fromBank = true;
                egret.clearTimeout(this._bankTimeout);
                this._bankTimeout = egret.setTimeout(function () {
                    self._fromBank = false;
                }, self, 1000);
            }
        }
    };
    MainView.prototype.shakeBasketry = function (size, velocityY, index) {
        // let type = this._isHighShot ? 2 : 3;
        if (size == 1 && velocityY > 20 && this._isBank) {
            this.createNet(index, 6);
            this._isTilt = true;
        }
        else {
            this.createNet(index, 2);
            this._isTilt = false;
        }
        // this[`_frontMc${index}`].gotoAndPlay(1);
        // this[`_backMc${index}`].gotoAndPlay(1);
        // this._frontMc.gotoAndPlay(1);
        // this._backMc.gotoAndPlay(1);
    };
    MainView.prototype.screenShake = function () {
        var _this = this;
        if (this._hasShake && this._shakeNum <= 0 || this._manager.curCombo < 5) {
            return;
        }
        this._hasShake = true;
        var stage = this.parent;
        var duration = 50;
        var offset = 10;
        var tween = function () {
            egret.Tween.get(stage).to({ x: offset, y: -offset }, duration).to({ x: 0, y: 0 }, duration)
                .to({ x: -offset, y: offset }, duration * 2).to({ x: 0, y: 0 }, duration).call(function () {
                _this._shakeNum--;
                if (_this._shakeNum > 0) {
                    tween();
                }
                else {
                    _this._shakeNum = 1;
                }
            });
        };
        tween();
    };
    MainView.prototype.isJinQiu = function (index, topIndex) {
        var _this = this;
        var self = this;
        if (!this["m_" + this._manager.curSide + "_basketry_block" + index].visible) {
            return false;
        }
        var pointBottom = Utils.euiPosToNormal(this["m_" + this._manager.curSide + "_net" + (2 * index - 1)]);
        var pointSide = Utils.euiPosToNormal(this["m_" + this._manager.curSide + "_net_side" + index]);
        var isBottom = this.m_ball.hitTestPoint(pointBottom.x, pointBottom.y);
        var isSide = this.m_ball.hitTestPoint(pointSide.x, pointSide.y);
        if (isBottom) {
            if (!this._netAnimation) {
                this._netAnimation = true;
                this.createNet(index, 5);
                egret.setTimeout(function () {
                    _this._netAnimation = false;
                }, self, 750);
            }
            this._fromUnder.set(index, true);
            egret.clearTimeout(this["_forceTimeout_" + index]);
            this["_forceTimeout_" + index] = egret.setTimeout(function () {
                self._fromUnder.set(index, false);
            }, self, 500);
        }
        if (isSide) {
            if (!this._netAnimation) {
                this._netAnimation = true;
                this.createNet(index, 4);
                egret.setTimeout(function () {
                    _this._netAnimation = false;
                }, self, 750);
            }
        }
        var pointTop = Utils.euiPosToNormal(this["m_" + this._manager.curSide + "_net" + 2 * index]);
        if (this.m_ball.hitTestPoint(pointTop.x, pointTop.y)) {
            if (!this._fromUnder.get(index)) {
                if (index == topIndex) {
                    var y = GameConfig.curHeight() - this._lastPointerPos.y;
                    var top_1 = this["m_" + this._manager.curSide + "_basketry_block" + topIndex].bottom + 250;
                    if (y - top_1 >= 100) {
                        this._isHighShot = true;
                    }
                }
                return true;
            }
        }
        return false;
    };
    MainView.prototype.isWin = function () {
        var _this = this;
        var self = this;
        var index = this._manager.curPos;
        var size = index.length;
        index.forEach(function (element) {
            if (!_this._jinQiuStatus.get(element)) {
                if (_this.isJinQiu(element, index[0])) {
                    var posy = void 0;
                    // if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
                    // 	posy = this._manager.curCombo >= 5 ? 20 : 12;
                    // } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
                    // 	posy = this._manager.endlessCombo >= 5 ? 10 : 6;
                    // }
                    posy = Math.abs(_this._ballBody.velocity.y);
                    posy = _this._manager.curCombo >= 5 ? posy * 1.5 : posy;
                    posy = Math.min(posy, 30);
                    Matter.Body.setVelocity(_this._ballBody, { x: 0, y: posy });
                    SoundMgr.getInstance().playJinqiu();
                    _this.screenShake();
                    _this.shakeBasketry(size, posy, element);
                    _this.playFire(element);
                    _this.updateScore(element);
                    _this._jinQiuStatus.set(element, true);
                    var b = _this._basketrys.get(element);
                    if (b) {
                        b.forEach(function (element) {
                            core.MatterUtil.removeBody(element);
                        });
                    }
                    egret.clearTimeout(_this._jinqiuTimeOut);
                    _this._jinqiuTimeOut = egret.setTimeout(function () {
                        self._hasWin = true;
                    }, self, 1000);
                    if (index[size - 1] == element) {
                        self._hasWin = true;
                        egret.clearTimeout(_this._jinqiuTimeOut);
                    }
                }
            }
        });
    };
    MainView.prototype.onCollisionEnd = function (evt) {
    };
    MainView.prototype.onUpdateBefore = function (evt) {
        var _this = this;
        if (this._manager.isLastTime()) {
            // GameConfig.curStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
        }
        if (this.isGameover()) {
            // PLATFORM.shakeShort();
            return;
        }
        if (this._lastJinQiuTime - this._manager.timeoutSecond >= 15) {
            this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.TANQI });
            this._lastJinQiuTime = this._manager.timeoutSecond - 10;
        }
        else if (!this._isBabySleep && this._lastShotTime - this._manager.timeoutSecond >= 10) {
            this._isBabySleep = true;
            this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.CHUIPAOPAO });
        }
        this.isCollectCoin();
        this.isWin();
        if (this._hasWin) {
            if (this._finishRound) {
                return;
            }
            var xxx_1 = 2;
            if (this._isTilt) {
                xxx_1 = 10;
            }
            if (this._manager.curSide == "left") {
                xxx_1 = xxx_1;
            }
            else {
                xxx_1 = -xxx_1;
            }
            egret.setTimeout(function () {
                Matter.Body.setVelocity(_this._ballBody, { x: xxx_1, y: _this._ballBody.velocity.y });
            }, this, 50);
            this._lastJinQiuTime = this._manager.timeoutSecond;
            this._finishRound = true;
            this._forceTimeout_1 = null;
            this._forceTimeout_2 = null;
            this._forceTimeout_3 = null;
            if (!this._switching) {
                this._manager.switchSide();
                // this._switching = true;
                egret.clearTimeout(this._switchSideTimeout);
                this._switchSideTimeout = egret.setTimeout(function () {
                    // this._switching = false;
                    // this._manager.switchSide();
                    _this.switchSideHandler();
                }, this, 400);
            }
        }
        if (this._ballBody && this._ballBody.position)
            if (this._ballBody && this._ballBody.position.x > GameConfig.curWidth() + this._ballBody.displays[0].width) {
                this._ballBody.position.x = 0;
                core.MatterUtil.removeBody(this._ballBody);
                this._tempY = this._ballBody.position.y;
                this._tempX = this._ballBody.velocity.x;
                this.addBallBody(this._tempY, this._tempX);
            }
            else if (this._ballBody && this._ballBody.position.x < -this._ballBody.displays[0].width) {
                this._tempY = this._ballBody.position.y;
                this._tempX = this._ballBody.velocity.x;
                core.MatterUtil.removeBody(this._ballBody);
                this.addBallBody(this._tempY, this._tempX);
            }
        /**
        if (this._netBody) {
            if (this._shape) {
                this._shape.graphics.clear();
            } else {
                this._shape = new egret.Shape();
            }
            this._shapeContainer.addChild(this._shape);

            this._shape.graphics.lineStyle(4, 0xffffff);
            //左边直线
            this._shape.graphics.moveTo(this._netBody.bodies[0].position.x, this._netBody.bodies[0].position.y);
            for (let i = 1; i < this._netH; i++) {
                this._shape.graphics.lineTo(this._netBody.bodies[i * this._netW].position.x, this._netBody.bodies[i * this._netW].position.y);
            }

            //右边直线
            this._shape.graphics.moveTo(this._netBody.bodies[this._netW - 1].position.x, this._netBody.bodies[this._netW - 1].position.y);
            for (let i = 1; i < this._netH; i++) {
                this._shape.graphics.lineTo(this._netBody.bodies[(i + 1) * this._netW - 1].position.x, this._netBody.bodies[(i + 1) * this._netW - 1].position.y);
            }
            //右斜线
            for (let i = 0; i < this._netBody.bodies.length; i++) {
                if (this._netBody.bodies[i + this._netW + 1]) {
                    if (i != this._netW - 1 && i != this._netW * 2 - 1) {
                        this._shape.graphics.moveTo(this._netBody.bodies[i].position.x, this._netBody.bodies[i].position.y);
                        this._shape.graphics.lineTo(this._netBody.bodies[i + this._netW + 1].position.x, this._netBody.bodies[i + this._netW + 1].position.y);
                    }
                }
            }
            //左斜线
            for (let i = 0; i < this._netBody.bodies.length; i++) {
                if (this._netBody.bodies[i + this._netW]) {
                    if (i + 1 != this._netW && i + 1 != this._netW * 2 && i + 1 != this._netW * 3) {
                        this._shape.graphics.moveTo(this._netBody.bodies[i + 1].position.x, this._netBody.bodies[i + 1].position.y);
                        this._shape.graphics.lineTo(this._netBody.bodies[i + this._netW].position.x, this._netBody.bodies[i + this._netW].position.y);
                    }
                }
            }
        } */
        if (this._ballBody) {
            this._particleView.updatePos(this._ballBody.position.x, this._ballBody.position.y);
            this.m_shadow.scaleX = this.m_shadow.scaleY = Math.abs(100 / (this._ballBody.position.y - this.m_shadow.y));
            if (this.m_shadow.scaleX > 1) {
                this.m_shadow.scaleX = this.m_shadow.scaleY = 1;
            }
            else if (this.m_shadow.scaleX < 0.4) {
                this.m_shadow.scaleX = this.m_shadow.scaleY = 0.4;
            }
            this.m_shadow.x = this.m_ball.x;
        }
    };
    MainView.prototype.isGameover = function (iscoliBackgroud) {
        var _this = this;
        if (iscoliBackgroud === void 0) { iscoliBackgroud = false; }
        if (this.hasGameOver || !this._ballBody) {
            return;
        }
        var belowNumBasketry = 500;
        if (Matter.Bounds.overlaps(this._ballBody.bounds, this._walls.bottomWall.bounds)) {
            belowNumBasketry = 0;
        }
        if (this._manager.isLastTime() && this._ballBody && this._ballBody.position.y > (GameConfig.curHeight() - this.m_left_basketry_kuan1.bottom) + belowNumBasketry && !this._hasWin) {
            if (belowNumBasketry == 0) {
            }
            egret.setTimeout(function () {
                _this.timeOut();
            }, this, 1000);
            this.hasGameOver = true;
            return true;
        }
        return false;
    };
    MainView.prototype.shotBallHandler = function (evt) {
        var _this = this;
        if (this._ballBody.position.y < -100) {
            return;
        }
        if (this._isBabySleep) {
            // SoundMgr.getInstance().playWake();
            this._isBabySleep = false;
            this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.NORMAL });
        }
        SoundMgr.getInstance().click();
        if (this.m_gamedesc.visible) {
            EventUtils.logEvent("click_gameInfo");
            this.m_gamedesc.alpha = 0.9;
            TweenUtil.stopTweenGroup(this.game);
            egret.Tween.get(this.m_gamedesc).wait(200).to({ alpha: 0 }, 200, egret.Ease.backOut).call(function () {
                _this.m_gamedesc.visible = false;
            });
            // PlatfromUtil.getPlatform().saveData({
            // 	"showTips": false
            // });
            localStorage.setItem("showTips", JSON.stringify({
                "showTips": false
            }));
            return;
        }
        this._lastPointerPos = new egret.Point(this._ballBody.position.x, this._ballBody.position.y);
        if (this._switching) {
            if (this._manager.curSide == "left") {
                Matter.Body.setVelocity(this._ballBody, { x: Math.abs(this._ballForce_x), y: this._ballForce_y });
                Matter.Body.setAngularVelocity(this._ballBody, this._ballAngular);
            }
            else {
                Matter.Body.setVelocity(this._ballBody, { x: -Math.abs(this._ballForce_x), y: this._ballForce_y });
                Matter.Body.setAngularVelocity(this._ballBody, -this._ballAngular);
            }
        }
        else {
            if (this._manager.curSide == "right") {
                Matter.Body.setVelocity(this._ballBody, { x: Math.abs(this._ballForce_x), y: this._ballForce_y });
                Matter.Body.setAngularVelocity(this._ballBody, this._ballAngular);
            }
            else {
                Matter.Body.setVelocity(this._ballBody, { x: -Math.abs(this._ballForce_x), y: this._ballForce_y });
                Matter.Body.setAngularVelocity(this._ballBody, -this._ballAngular);
            }
        }
        this._lastShotTime = this._manager.timeoutSecond;
        if (!this._playGame) {
            this._playGame = true;
            EventUtils.logEvent("click_ballShot");
        }
    };
    /**
     * 一局结束
     */
    MainView.prototype.updateScore = function (index) {
        var _this = this;
        var position = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
        egret.setTimeout(function () {
            _this._fromUnder.clear();
        }, this, 1000);
        var p = this["m_" + this._manager.curSide + "_net" + 2 * index];
        if (this._manager.curSide == "left") {
            position.left = p.left;
            position.bottom = p.bottom;
        }
        else {
            position.right = p.right;
            position.bottom = p.bottom;
        }
        if (this._manager.isLastTime()) {
            if (this._jinQiuStatus.size == 0) {
                this._manager.addEffect("yashao");
                this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.TIAOQI });
            }
            position.bottom = p.bottom - 200;
            GameManager.getInstance().scoreManager.updateScore("yashao", position);
            if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
                return;
            }
        }
        position.bottom = p.bottom;
        var coinNumber = 0;
        if (this._isHighShot) {
            if (!this._manager.isLastTime() && this._jinQiuStatus.size == 0) {
                this._manager.addEffect("highShot");
                var randoom = core.MathUtils.random(0, 100);
                if (randoom < 25) {
                    this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.TIAOQI });
                }
                if (this._manager.highShotCount == 3) {
                    coinNumber += 10;
                }
            }
            GameManager.getInstance().scoreManager.updateScore("highShot", position);
        }
        else if (this._isKongxin) {
            if (!this._manager.isLastTime() && this._jinQiuStatus.size == 0) {
                this._manager.addEffect("kongxin");
                var randoom = core.MathUtils.random(0, 100);
                if (randoom < 30) {
                    this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.HUANHU });
                }
                if (this._manager.kongxinCount == 5) {
                    coinNumber += 10;
                }
            }
            GameManager.getInstance().scoreManager.updateScore("kongxin", position);
        }
        else if (this._isBank) {
            if (!this._manager.isLastTime() && this._jinQiuStatus.size == 0) {
                this._manager.addEffect("bank");
                var randoom = core.MathUtils.random(0, 100);
                if (randoom < 30) {
                    this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.HUANHU });
                }
                if (this._manager.bankCount == 5) {
                    coinNumber += 10;
                }
            }
            GameManager.getInstance().scoreManager.updateScore("bank", position);
        }
        else {
            if (!this._manager.isLastTime() && this._jinQiuStatus.size == 0) {
                this._manager.addEffect("null");
            }
            GameManager.getInstance().scoreManager.updateScore("null", position);
        }
        if (this._manager.curCombo == 10 || this._manager.curCombo == 20 || this._manager.curCombo == 30 || this._manager.curCombo == 40) {
            coinNumber += 10;
        }
        if (coinNumber && GameConfig.gameMode == GameConfig.GameMode.TIME) {
            this._manager.collectCoinsNumber(coinNumber);
            this._manager.dispatchEventWith(BaskectBallManager.COLLECT_COINS, false, { coinNumber: coinNumber, pos: position });
        }
        this._isFirst = false;
    };
    MainView.prototype.timeOut = function () {
        var _this = this;
        if (this._exitView && this._exitView.parent) {
            this._exitView.closeDialog();
        }
        if (this._helpView && this._helpView.parent) {
            this._helpView.closeDialog();
        }
        var timeout = 500;
        if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
            TweenUtil.playTweenGroup(this.timeout, false);
            timeout = 2000;
        }
        egret.setTimeout(function () {
            _this.gameover();
        }, this, timeout);
    };
    MainView.prototype.gameover = function () {
        var _this = this;
        // SoundMgr.getInstance().gameover();
        this.pauseGameHandler(null);
        egret.log("gameover");
        if (this._gameoverDlg && this._gameoverDlg.parent) {
            return;
        }
        if (this._rebornView && this._rebornView.parent) {
            return;
        }
        var showReborn = false;
        if (SwitchManager.openborn && GameManager.getInstance().rebornCount > 0) {
            if (GameConfig.gameMode == GameConfig.GameMode.TIME && GameManager.getInstance().scoreManager.totalScore > 20) {
                showReborn = true;
                core.ResUtils.loadGroups(["reborn"], function (progress) {
                }, function (fail) {
                }, function (loadComplete) {
                    _this._rebornView = new RebornView();
                    _this._rebornView.popUp(true, 0, 0, 0, 0);
                }, this);
            }
            else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS && GameManager.getInstance().scoreManager.totalScore > 50) {
                showReborn = true;
                core.ResUtils.loadGroups(["reborn_endless"], function (progress) {
                }, function (fail) {
                }, function (loadComplete) {
                    _this._rebornView = new EndlessRebornDialog();
                    _this._rebornView.popUp(true, 0, 0, 0, 0);
                }, this);
            }
        }
        if (!showReborn) {
            core.ResUtils.loadGroups(["result"], function (progress) {
            }, function (fail) {
            }, function (loadComplete) {
                _this._gameoverDlg = new ResultDialog();
                _this._gameoverDlg.popUp();
            }, this);
        }
    };
    /**
     * 重新开始
     */
    MainView.prototype.restartHandler = function (evt) {
        this._switching = false;
        this._forceTimeout_1 = null;
        this._forceTimeout_2 = null;
        this._forceTimeout_3 = null;
        this._jinqiuTimeOut = null;
        this._isFirst = true;
        this._flagTimestamp = -1;
        this.sideleftPosY = -1;
        this.sideRightPosY = -1;
        this._lastShotTime = this._manager.timeoutSecond;
        this._lastJinQiuTime = this._manager.timeoutSecond;
        this._playGame = false;
        core.MatterUtil.clearTimeouts(this);
        this.m_ball.source = "mg_qiu_" + GameManager.getInstance().baskectBallManager.use + "_png";
        this._gameoverDlg && this._gameoverDlg.closeDialog();
        this.hasGameOver = false;
        this._isBabySleep = false;
        this._manager.reset();
        if (evt != null) {
            this.restartGameHandler(null);
        }
        this.startGame();
    };
    MainView.prototype.showExitDialog = function () {
        if (this._manager.timeoutSecond <= 0) {
            return;
        }
        if (this._exitView && this._exitView.parent) {
            return;
        }
        EventUtils.logEvent("click_exit");
        this._exitView = new ExitDialog();
        this._exitView.popUp();
    };
    MainView.prototype.showHelpDialog = function () {
        var _this = this;
        if (this._manager.timeoutSecond <= 0) {
            return;
        }
        if (this._loadHelpRes) {
            return;
        }
        if (this._helpView && this._helpView.parent) {
            return;
        }
        this._loadHelpRes = true;
        EventUtils.logEvent("click_help");
        core.ResUtils.loadGroups(["help"], function (progress) {
        }, function (fail) {
        }, function (loadComplete) {
            _this._helpView = new HelpDialog();
            _this._helpView.popUp();
            _this._loadHelpRes = false;
        }, this);
    };
    MainView.prototype.showPauseDialog = function () {
        if (this._manager.timeoutSecond <= 0) {
            return;
        }
        EventUtils.logEvent("click_pause");
        var pauseView = new PauseDialog();
        pauseView.popUp();
    };
    MainView.prototype.release = function () {
        _super.prototype.release.call(this);
        this._matterScene.clear();
        this._matterScene = null;
        dragonBones.WorldClock.clock.clear();
        this._fire = [];
        this._hou = [];
        this._qian = [];
    };
    return MainView;
}(core.EUIComponent));
__reflect(MainView.prototype, "MainView");
