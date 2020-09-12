
/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-03
 * Desc   ： 游戏界面视图
 ********************************/
class MainView extends core.EUIComponent {
	public m_shadow: eui.Image;
	// public m_gamedesc: eui.Image;
	public m_gamedesc: eui.Group;
	public game: egret.tween.TweenGroup;
	public timeout: egret.tween.TweenGroup;
	public m_ball: eui.Image;

	public m_help: eui.Image;
	public m_pause: eui.Image;
	public m_back: eui.Image;

	public m_right: eui.Group;
	public m_right_basketry_kuan1: eui.Group;
	public m_right_basketry_kuan2: eui.Group;
	public m_right_basketry_kuan3: eui.Group;
	public m_right_basketry_part1: eui.Group;
	public m_right_basketry_part3: eui.Group;
	public m_right_basketry_part5: eui.Group;
	public m_right_ball_container: eui.Group;
	public m_shapeContainer_right: eui.Group;
	public m_right_basketry_part2: eui.Group;
	public m_right_basketry_part4: eui.Group;
	public m_right_basketry_part6: eui.Group;
	public m_right_basketry_block1: eui.Image;
	public m_right_basketry_block2: eui.Image;
	public m_right_basketry_block3: eui.Image;
	public m_right_points: eui.Group;
	public m_right_colli_point1: eui.Group;
	public m_right_colli_point2: eui.Group;
	public m_right_net1: eui.Group;
	public m_right_net2: eui.Group;
	public m_right_points3: eui.Group;
	public m_right_colli_point0: eui.Group;
	public m_right_colli_point3: eui.Group;
	public m_right_net0: eui.Group;
	public m_right_net3: eui.Group;
	public m_right_points1: eui.Group;
	public m_right_colli_point4: eui.Group;
	public m_right_colli_point5: eui.Group;
	public m_right_net4: eui.Group;
	public m_right_net5: eui.Group;
	public m_right_net_side3: eui.Group;
	public m_right_net_side2: eui.Group;
	public m_right_net_side1: eui.Group;
	public m_right_fire_group1: eui.Group;
	public m_right_fire_group2: eui.Group;
	public m_right_fire_group3: eui.Group;
	public m_right_coin: eui.Group;

	public m_left: eui.Group;
	public m_left_basketry_kuan1: eui.Group;
	public m_left_basketry_kuan2: eui.Group;
	public m_left_basketry_kuan3: eui.Group;
	public m_left_basketry_part1: eui.Group;
	public m_left_basketry_part3: eui.Group;
	public m_left_basketry_part5: eui.Group;
	public m_left_ball_container: eui.Group;
	public m_shapeContainer_left: eui.Group;
	public m_left_basketry_part2: eui.Group;
	public m_left_basketry_part4: eui.Group;
	public m_left_basketry_part6: eui.Group;
	public m_left_basketry_block1: eui.Image;
	public m_left_basketry_block2: eui.Image;
	public m_left_basketry_block3: eui.Image;
	public m_left_points: eui.Group;
	public m_left_colli_point1: eui.Group;
	public m_left_colli_point2: eui.Group;
	public m_left_net1: eui.Group;
	public m_left_net2: eui.Group;
	public m_left_points2: eui.Group;
	public m_left_colli_point3: eui.Group;
	public m_left_colli_point4: eui.Group;
	public m_left_net3: eui.Group;
	public m_left_net4: eui.Group;
	public m_left_points3: eui.Group;
	public m_left_colli_point5: eui.Group;
	public m_left_colli_point6: eui.Group;
	public m_left_net5: eui.Group;
	public m_left_net6: eui.Group;
	public m_left_net_side1: eui.Group;
	public m_left_net_side2: eui.Group;
	public m_left_net_side3: eui.Group;
	public m_left_coin: eui.Group;

	public tween: egret.tween.TweenGroup;
	public _readyGo: eui.Group;
	public image1: eui.Image;
	public image0: eui.Image;
	public image: eui.Image;

	private _manager: BaskectBallManager;
	private _shapeContainer: eui.Group;
	private _matterScene: core.MatterScene;
	private _walls: MatterWalls;
	private _ballBody: Matter.Body;
	private _ballAngular: number = 0.05;
	private _ballForce_x: number = 4.0;
	private _ballForce_y: number = -16;
	private _netBody: Matter.Composite;
	private _netDisplays: eui.Image[] = [];
	private _netW: number = 4;
	private _netH: number = 4;
	private _isFirst: boolean = true;
	//最后一次点击时球的位置
	private _lastPointerPos: egret.Point;

	private _avgposYArr: number[] = [];

	private _isKongxin: boolean = true; //是否空心球
	private _isBank: boolean = false; //是否篮板球
	private _isHighShot: boolean = false; //是否高弧度进球

	private _particleView: ParticleView;
	private _netRect: egret.Rectangle;



	public constructor() {
		super();
		this.skinName = "resource/assets/exml/MainView.exml";

		this._manager = GameManager.getInstance().baskectBallManager;

		//BaskectballController.getInstance().init();

	}

	public childrenCreated() {
		super.childrenCreated();

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
			let self = this;
			core.DatGuiUtil.getInstance().addEventListener(core.DatGuiUtil.DAT_GUI_FINISH_CHANGE, ({data}) => {
				if (data.name == "ball_x") {
					self._ballForce_x = data.val;
				} else if (data.name == "ball_y") {
					self._ballForce_y = data.val;
				} else if (data.name = "gravity") {
					this._matterScene.gravity = data.val;
				}
			}, this)
		}

		if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
			EventUtils.logEvent("launch_timeMode_game");
		} else {
			EventUtils.logEvent("launch_funMode_game");
		}

	}

	private _basketry: Matter.Body;
	private _basketryPoint: Matter.Body;
	private _basketryPoint1: Matter.Body;

	private _basketry1: Matter.Body;
	private _basketryPoint2: Matter.Body;
	private _basketryPoint3: Matter.Body;

	private _basketry2: Matter.Body;
	private _basketryPoint4: Matter.Body;
	private _basketryPoint5: Matter.Body;

	private _basketrys: Map<number, Matter.Body[]> = new Map();
	private creatScenne() {
		if (this._basketrys) {
			this._basketrys.forEach((value, key) => {
				let b: Matter.Body[] = value;
				b.forEach(element => {
					core.MatterUtil.removeBody(element);
				});
			});
			this._basketrys.clear();
		}

		let index = this._manager.curPos;
		if (!index) {
			return;
		}

		let _basketryArray: Matter.Body[];

		index.forEach(element => {
			let _basketry = core.MatterUtil.addOneBox(Utils.euiPosToNormal(this[`m_${this._manager.curSide}_basketry_kuan${element}`]).x,
				Utils.euiPosToNormal(this[`m_${this._manager.curSide}_basketry_kuan${element}`]).y,
				this[`m_${this._manager.curSide}_basketry_kuan${element}`].width,
				this[`m_${this._manager.curSide}_basketry_kuan${element}`].height, 0);
			let _basketryPoint = core.MatterUtil.addOneBox(Utils.euiPosToNormal(this[`m_${this._manager.curSide}_colli_point${(2 * element - 1)}`]).x,
				Utils.euiPosToNormal(this[`m_${this._manager.curSide}_colli_point${(2 * element - 1)}`]).y,
				this[`m_${this._manager.curSide}_colli_point${(2 * element - 1)}`].width,
				this[`m_${this._manager.curSide}_colli_point${(2 * element - 1)}`].height, 0);
			let _basketryPoint1 = core.MatterUtil.addOneBox(Utils.euiPosToNormal(this[`m_${this._manager.curSide}_colli_point${(2 * element)}`]).x,
				Utils.euiPosToNormal(this[`m_${this._manager.curSide}_colli_point${(2 * element)}`]).y,
				this[`m_${this._manager.curSide}_colli_point${(2 * element)}`].width,
				this[`m_${this._manager.curSide}_colli_point${(2 * element)}`].height, 0);


			// (this[`m_${this._manager.curSide}_basketry_part${(2 * element - 1)}`] as egret.DisplayObjectContainer).removeChildren();
			// (this[`m_${this._manager.curSide}_basketry_part${(2 * element)}`] as egret.DisplayObjectContainer).removeChildren();
			this.createNet(element, 1);

			_basketryArray = [];

			Matter.World.add(this._matterScene.world, _basketry);
			_basketry.isStatic = true;
			_basketry.label = "basketryBank";
			_basketryArray.push(_basketry)

			Matter.World.add(this._matterScene.world, _basketryPoint);
			_basketryPoint.isStatic = true;
			_basketryPoint.label = "basketryPoint";
			_basketryArray.push(_basketryPoint)

			Matter.World.add(this._matterScene.world, _basketryPoint1);
			_basketryPoint1.isStatic = true;
			_basketryPoint1.label = "basketryPoint";
			_basketryArray.push(_basketryPoint1)

			this._basketrys.set(element, _basketryArray);
		});
	}

	private clearArmature(armatures: dragonBones.Armature[]) {
		if (armatures == null || armatures.length == 0) {
			return;
		}
		armatures.forEach(armature => {
			if (armature) {
				armature.animation.stop();
				DragonUtils.removeFromParent(armature.display);
				dragonBones.WorldClock.clock.remove(armature);
				armature = null;
			}
		});

	}

	factory: dragonBones.EgretFactory;
	factory2: dragonBones.EgretFactory;
	_hou: dragonBones.Armature[] = [];
	_qian: dragonBones.Armature[] = [];
	private createNet(element: number, type: number): void {
		(this[`m_${this._manager.curSide}_basketry_part${(2 * element - 1)}`] as egret.DisplayObjectContainer).removeChildren();
		(this[`m_${this._manager.curSide}_basketry_part${(2 * element)}`] as egret.DisplayObjectContainer).removeChildren();
		if (!this.factory) {
			this.factory = DragonUtils.createDragonBones(`net_back_ske_json`, `net_back_tex_json`, `net_back_tex_png`);
		}
		let hou = this.factory.buildArmature(`${type}`);
		if (!this.factory2) {
			this.factory2 = DragonUtils.createDragonBones(`net_font_ske_json`, `net_font_tex_json`, `net_font_tex_png`);
		}
		let qian = this.factory2.buildArmature(`${type}`);

		dragonBones.WorldClock.clock.add(hou);
		this._hou.push(hou)
		let houDisplay: egret.DisplayObjectContainer = hou.display;
		if (this._manager.curSide == "left") {
			houDisplay.scaleX = -1;
		} else {
			houDisplay.scaleX = 1;
		}
		houDisplay.anchorOffsetX = 61;

		dragonBones.WorldClock.clock.add(qian);
		this._qian.push(qian)
		let qianDisplay: egret.DisplayObjectContainer = qian.display;
		if (this._manager.curSide == "left") {
			qianDisplay.scaleX = -1;
		} else {
			qianDisplay.scaleX = 1;
		}
		qianDisplay.anchorOffsetX = 61;

		this[`m_${this._manager.curSide}_basketry_part${(2 * element - 1)}`].addChild(houDisplay);
		this[`m_${this._manager.curSide}_basketry_part${(2 * element)}`].addChild(qianDisplay);

		hou.animation.play("newAnimation", 1);
		qian.animation.play("newAnimation", 1);
	}


	_fire: Array<dragonBones.Armature> = [];
	private playFire(element: number) {
		if ((GameConfig.gameMode == GameConfig.GameMode.TIME && this._manager.curCombo < 4)
			|| (GameConfig.gameMode == GameConfig.GameMode.ENDLESS && this._manager.endlessCombo < 5)) {
			return;
		}
		let fire = this._fire.pop();
		if (!fire) {
			fire = DragonUtils.createDragonBonesDisplay(`fire_ske_json`, `fire_tex_json`, `fire_tex_png`, 'Sprite');
			dragonBones.WorldClock.clock.add(fire);
			fire.addEventListener(dragonBones.EgretEvent.COMPLETE, () => {
				this._fire.push(fire);
				fire.display.parent && fire.display.parent.removeChild(fire.display);
			}, this)
		}
		let display = fire.display as egret.DisplayObjectContainer;
		display.x = 60;
		display.y = -40;


		this[`m_${this._manager.curSide}_fire_group${element}`].addChild(display);
		fire.animation.play("Sprite", -1);
	}

	/**
	 * 检测网有没有碰撞
	 */
	private checkNetCollision(): void {
		if (this._ballBody.collisionFilter.mask == 0x002 && (this._ballBody.position.y > 600 || !this._hasWin)) {
			let vy = this._ballBody.velocity.y;
			this.addBallBody(this._ballBody.position.y, 0, this._ballBody.position.x);
			Matter.Body.setVelocity(this._ballBody, { x: 0, y: vy });
		}
	}
	private disableNetCollision(): void {
		this._ballBody.collisionFilter.mask = 0x002;
	}

	/**
	 * 显示
	 */
	protected onShow(event?: egret.Event): void {
		super.onShow();
		// this.restartHandler(null);
		// this.startGame();
		// this.m_ball.source = "mg_qiu_" + GameManager.getInstance().baskectBallManager.use + "_png";
		//this.m_ball.source=ChangeSkinView.getInstance().targetBall;
		//this.m_ball.source=ChangeSkinView.getInstance().skinPlay[ChangeSkinView.getInstance().searchSelect()].m_ball.source;
		this.readyGo();
	}

	private _isReadyGo = false;
	private readyGo(): void {
		if (this._isReadyGo) {
			return;
		}
		this._isReadyGo = true;
		this._readyGo.visible = true;

		SoundMgr.getInstance().playReadyGo();

		this.tween.play();
		this.tween.once(egret.Event.COMPLETE, () => {
			this.m_gamedesc.visible = GameConfig.showTips;
			TweenUtil.playTweenGroup(this.game, true);
			this.restartHandler(null);
		}, this);
	}

	//开始游戏
	private startGame(): void {
		if (!this._matterScene) {
			return;
		}
		this.switchSideHandler();
		this.addBallBody(-1, 0, 350);
		this.m_shadow.visible = true;
	}

	private addBallBody(y: number = -1, velocityX: number = 0, x: number = -1): void {
		if (y == -1) {
			y = GameConfig.curHeight() / 2;
		}
		if (x == -1) {
			if (this._manager.curSide == "right") {
				x = 10;
			} else {
				x = GameConfig.curWidth() - 10;
			}
		}
		core.MatterUtil.removeBody(this._ballBody);
		this._ballBody = core.MatterUtil.addOneBall(x, y, this.m_ball.width / 2, 0);
		this._ballBody.density = 0.3, // 密度
			this._ballBody.restitution = 0.7, // 弹性
			this._ballBody.displays = [this.m_ball];
		this._ballBody.label = "ball";
		this._ballBody.collisionFilter.group = -2;
		Matter.World.add(this._matterScene.world, this._ballBody);
		if (velocityX) {
			Matter.Body.setVelocity(this._ballBody, { x: velocityX, y: 0 });
		}
	}

	protected onHide(event?: egret.Event): void {
		super.onHide();
	}
	/**
	 * 添加监听
	 */
	protected addListener(): void {
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

	}


	/**
	 * 删除监听
	 */
	protected removeListener(): void {
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
	}

	private stopFrontMc(evt: egret.Event): void {
		// this._frontMc.gotoAndStop(1);
	}

	private stopBackMc(evt: egret.Event): void {
		// this._backMc.gotoAndStop(1);
	}

	//暂停
	private pauseGameHandler(evt: egret.Event): void {
		// GameConfig.curStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		if (this._matterScene) {
			this._matterScene.runner.enabled = false;
		}
		this._manager.pauseGame();
	}

	//恢复
	private resumeGameHandler(evt: egret.Event): void {
		// GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		if (this._matterScene) {
			this._matterScene.runner.enabled = true;
		}
		this._manager.resumeGame(!this._isFirst);
	}


	private rebornGameHandler(evt: egret.Event): void {
		// GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		this.hasGameOver = false;
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		if (this._matterScene) {
			this._matterScene.runner.enabled = true;
		}
		this._manager.rebornGame();
	}

	private restartGameHandler(evt: egret.Event): void {
		// GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		if (this._matterScene) {
			this._matterScene.runner.enabled = true;
		}
	}

	/**
	 * 改变篮筐方向
	 */
	private switchSideHandler(): void {
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
			} else {
				this._manager.startTimeout();//开始倒计时
			}
		} else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
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
		} else {
			this.addChild(this.m_ball);
			this._particleView && this.addChild(this._particleView);
		}


		if (this._manager.curSide == "left") {
			this._shapeContainer = this.m_shapeContainer_left;
			this.m_left.visible = true;
			this.m_left.right = 500;
			egret.Tween.get(this.m_left).to({ right: 0 }, 400, egret.Ease.bounceIn).call(() => {
				this.creatScenne();
				this._shapeContainer.visible = true;
				if (this._manager.isYanMode()) {
					this.m_left_ball_container.addChild(this._particleView);
					this.m_left_ball_container.addChild(this.m_ball);
				} else {
					this.m_left_ball_container.addChild(this.m_ball);
					this.m_left_ball_container.addChild(this._particleView);
				}
				this.showCoinImage();
			});
		} else {
			this.m_right.visible = true;
			this.m_right.left = 500;
			this._shapeContainer = this.m_shapeContainer_right;
			egret.Tween.get(this.m_right).to({ left: 0 }, 400, egret.Ease.bounceIn).call(() => {
				this.creatScenne();
				this._shapeContainer.visible = true;
				if (this._manager.isYanMode()) {
					this.m_right_ball_container.addChild(this._particleView);
					this.m_right_ball_container.addChild(this.m_ball);
				} else {
					this.m_right_ball_container.addChild(this.m_ball);
					this.m_right_ball_container.addChild(this._particleView);
				}
				this.showCoinImage();
			});
		}
	}

	private showCoinImage() {
		if (GameConfig.gameMode != GameConfig.GameMode.ENDLESS) {
			return;
		}
		let pos = this._manager.curPos[0];
		let x;
		let y;

		let xOffset = 125;
		let yOffset = 230;

		let p = core.MathUtils.random(0, 2);
		if (pos == 1) {
			if (this._manager.curSide == "left") {
				x = p ? xOffset : xOffset + 100;
			} else {
				x = p ? GameConfig.curWidth() - xOffset : GameConfig.curWidth() - xOffset - 100;
			}
			y = GameConfig.curHeight() - 796 - yOffset;
		} else if (pos == 2) {
			if (this._manager.curSide == "left") {
				x = p ? xOffset : xOffset + 100;
			} else {
				x = p ? GameConfig.curWidth() - xOffset : GameConfig.curWidth() - xOffset - 100;
			}
			y = GameConfig.curHeight() - 596 - yOffset;
		} else {
			if (this._manager.curSide == "left") {
				x = p ? xOffset : xOffset + 100;
			} else {
				x = p ? GameConfig.curWidth() - xOffset : GameConfig.curWidth() - xOffset - 100;
			}
			y = GameConfig.curHeight() - 396 - yOffset;
		}

		this[`m_${this._manager.curSide}_coin`].visible = true;
		this[`m_${this._manager.curSide}_coin`].x = x;
		this[`m_${this._manager.curSide}_coin`].y = y;
		this._manager.dispatchEventWith("show_coin", false, { x: x, y: y })
	}

	private isCollectCoin() {
		if (!this[`m_${this._manager.curSide}_coin`].visible) {
			return;
		}
		let left = this[`m_${this._manager.curSide}_coin`].x - 14;
		let right = this[`m_${this._manager.curSide}_coin`].x + 14;
		let top = this[`m_${this._manager.curSide}_coin`].y - 14;
		let bottom = this[`m_${this._manager.curSide}_coin`].y + 14;

		if (this.m_ball.hitTestPoint(left, top) || this.m_ball.hitTestPoint(left, bottom)
			|| this.m_ball.hitTestPoint(right, top) || this.m_ball.hitTestPoint(right, bottom)) {
			this[`m_${this._manager.curSide}_coin`].visible = false;
			this._manager.dispatchEvent(new egret.Event("collect_coin"))
		}
	}

	private hideView(): void {
		this.clearArmature(this._hou);
		this.clearArmature(this._qian);
		let self = this;
		[1, 2, 3].forEach(element => {
			this[`m_${this._manager.curSide}_basketry_block${element}`].visible = false;
			this[`m_${this._manager.curSide}_basketry_part${(2 * element - 1)}`].visible = false;
			this[`m_${this._manager.curSide}_basketry_part${(2 * element)}`].visible = false;
		});
		this.showView();
	}

	private showView(): void {
		let index = this._manager.curPos;
		if (!index) {
			return;
		}
		index.forEach(element => {
			this[`m_${this._manager.curSide}_basketry_block${element}`].visible = true;
			this[`m_${this._manager.curSide}_basketry_part${(2 * element - 1)}`].visible = true;
			this[`m_${this._manager.curSide}_basketry_part${(2 * element)}`].visible = true;
		});
	}

	/**
	 * 调整篮筐的高度
	 */
	private sideleftPosY: number = -1;
	private sideRightPosY: number = 1;
	private changeSidePosY(side: string): void {
		let addedTop: number = 0;
		let target: eui.Group;
		let ran: number = 0;
		if (side == "left") {
			target = this.m_left;
		} else {
			target = this.m_right;
		}

		ran = core.MathUtils.random(200, GameConfig.curHeight() - 500);
		addedTop = ran - this[`m_${this._manager.curSide}_basketry_block`].top;
		egret.log(ran, addedTop);

		//改变篮筐高度
		for (let i = 0; i < target.numChildren; i++) {
			let display: eui.Component = target.getChildAt(i) as eui.Component;
			if (display.numChildren && (display.top == 0)) {
				for (let j = 0; j < display.numChildren; j++) {
					let child: eui.Component = display.getChildAt(j) as eui.Component;

					child.top += addedTop;
				}
			} else if (display.top != 0) {
				display.top += addedTop;
			}
		}
	}

	/**
	 * 倒计时结束
	 */
	private completeTimeoutHandler(evt: egret.Event): void {
		// GameConfig.curStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
	}

	/**
	 * 复活
	 */
	private rebornHandler(evt: egret.Event): void {
		// GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		this.rebornGameHandler(null);
	}

	private changeSkinHandler(evt: egret.Event): void {
		console.log(evt);

	}

	private _fromBank: boolean = false;
	private _bankTimeout: number;
	private onCollisionStart(evt: Matter.IEventCollision<any>): void {
		let pairs = evt.pairs;
		let self = this;
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			if (pairs[i].bodyA.label == "ball" && pairs[i].bodyB.label == "background" || (pairs[i].bodyA.label == "background" && pairs[i].bodyB.label == "ball")) {
				SoundMgr.getInstance().playGround();
				this.isGameover(true);
			} else if (pairs[i].bodyA.label == "ball" && pairs[i].bodyB.label == "basketryPoint" || (pairs[i].bodyA.label == "basketryPoint" && pairs[i].bodyB.label == "ball")) {
				this._isKongxin = false;
				SoundMgr.getInstance().playKuang();
				if (this._fromBank) {
					this._isBank = true;
				}
			} else if (pairs[i].bodyA.label == "ball" && pairs[i].bodyB.label == "basketryBank" || (pairs[i].bodyA.label == "basketryBank" && pairs[i].bodyB.label == "ball")) {
				SoundMgr.getInstance().playBank();
				self._fromBank = true;
				egret.clearTimeout(this._bankTimeout);
				this._bankTimeout = egret.setTimeout(() => {
					self._fromBank = false;
				}, self, 1000)
			}
		}
	}


	/**
	 * 播放动画
	 */
	_isTilt: boolean = false;
	private shakeBasketry(size: number, velocityY: number, index: number): void {
		// let type = this._isHighShot ? 2 : 3;
		if (size == 1 && velocityY > 20 && this._isBank) {
			this.createNet(index, 6);
			this._isTilt = true;
		} else {
			this.createNet(index, 2);
			this._isTilt = false;
		}
		// this[`_frontMc${index}`].gotoAndPlay(1);
		// this[`_backMc${index}`].gotoAndPlay(1);
		// this._frontMc.gotoAndPlay(1);
		// this._backMc.gotoAndPlay(1);
	}

	_shakeNum: number = 1;
	_hasShake: boolean = false;
	private screenShake(): void {
		if (this._hasShake && this._shakeNum <= 0 || this._manager.curCombo < 5) {
			return;
		}
		this._hasShake = true;
		let stage = this.parent;
		let duration = 50;
		let offset = 10;
		var tween = () => {
			egret.Tween.get(stage).to({ x: offset, y: -offset }, duration).to({ x: 0, y: 0 }, duration)
				.to({ x: -offset, y: offset }, duration * 2).to({ x: 0, y: 0 }, duration).call(() => {
					this._shakeNum--;
					if (this._shakeNum > 0) {
						tween();
					} else {
						this._shakeNum = 1;
					}
				})
		}
		tween();

	}

	private _forceTimeout_1: number;
	private _forceTimeout_2: number;
	private _forceTimeout_3: number;
	private _fromUnder: Map<number, boolean> = new Map();
	_netAnimation: boolean = false;
	private isJinQiu(index: number, topIndex: number): boolean {
		let self = this;
		if (!this[`m_${this._manager.curSide}_basketry_block${index}`].visible) {
			return false;
		}
		let pointBottom = Utils.euiPosToNormal(this[`m_${this._manager.curSide}_net${2 * index - 1}`]);
		let pointSide = Utils.euiPosToNormal(this[`m_${this._manager.curSide}_net_side${index}`]);
		let isBottom = this.m_ball.hitTestPoint(pointBottom.x, pointBottom.y);
		let isSide = this.m_ball.hitTestPoint(pointSide.x, pointSide.y);
		if (isBottom) {
			if (!this._netAnimation) {
				this._netAnimation = true;
				this.createNet(index, 5);
				egret.setTimeout(() => {
					this._netAnimation = false;
				}, self, 750);
			}

			this._fromUnder.set(index, true)
			egret.clearTimeout(this[`_forceTimeout_${index}`])
			this[`_forceTimeout_${index}`] = egret.setTimeout(() => {
				self._fromUnder.set(index, false);
			}, self, 500)
		}
		if (isSide) {
			if (!this._netAnimation) {
				this._netAnimation = true;
				this.createNet(index, 4);
				egret.setTimeout(() => {
					this._netAnimation = false;
				}, self, 750);
			}
		}

		let pointTop = Utils.euiPosToNormal(this[`m_${this._manager.curSide}_net${2 * index}`])
		if (this.m_ball.hitTestPoint(pointTop.x, pointTop.y)) {
			if (!this._fromUnder.get(index)) {
				if (index == topIndex) {
					let y = GameConfig.curHeight() - this._lastPointerPos.y;
					let top = this[`m_${this._manager.curSide}_basketry_block${topIndex}`].bottom + 250;
					if (y - top >= 100) {
						this._isHighShot = true;
					}
				}
				return true;
			}
		}
		return false;
	}


	private _switching: boolean = false;
	private _hasWin: boolean = false;
	private _jinqiuTimeOut: number;
	private _jinQiuStatus: Map<number, boolean> = new Map();
	private isWin(): void {
		let self = this;
		let index = this._manager.curPos;
		let size = index.length;
		index.forEach(element => {
			if (!this._jinQiuStatus.get(element)) {
				if (this.isJinQiu(element, index[0])) {
					let posy;
					// if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
					// 	posy = this._manager.curCombo >= 5 ? 20 : 12;
					// } else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
					// 	posy = this._manager.endlessCombo >= 5 ? 10 : 6;
					// }

					posy = Math.abs(this._ballBody.velocity.y);
					posy = this._manager.curCombo >= 5 ? posy * 1.5 : posy;
					posy = Math.min(posy, 30);
					Matter.Body.setVelocity(this._ballBody, { x: 0, y: posy })
					SoundMgr.getInstance().playJinqiu();
					this.screenShake();
					this.shakeBasketry(size, posy, element);
					this.playFire(element);
					this.updateScore(element);
					this._jinQiuStatus.set(element, true);

					let b: Matter.Body[] = this._basketrys.get(element);
					if (b) {
						b.forEach(element => {
							core.MatterUtil.removeBody(element);
						});
					}

					egret.clearTimeout(this._jinqiuTimeOut)
					this._jinqiuTimeOut = egret.setTimeout(() => {
						self._hasWin = true;
					}, self, 1000)

					if (index[size - 1] == element) {
						self._hasWin = true;
						egret.clearTimeout(this._jinqiuTimeOut)
					}

				}
			}
		});
	}


	private onCollisionEnd(evt: Matter.IEventCollision<any>): void {

	}
	private _tempY: number = 0;
	private _tempX: number = 0;
	private _shape: egret.Shape;
	private _flagTimestamp: number = -1;
	private _finishRound: boolean = false;
	private _switchSideTimeout;
	private _lastShotTime: number;
	private _lastJinQiuTime: number;
	private _isBabySleep: boolean = false;
	private onUpdateBefore(evt: Matter.IEventTimestamped<any>): void {
		if (this._manager.isLastTime()) {
			// GameConfig.curStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
			this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shotBallHandler, this);
		}

		if (this.isGameover()) {
			// PLATFORM.shakeShort();
			return;
		}
		if (this._lastJinQiuTime - this._manager.timeoutSecond >= 15) {
			this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.TANQI })
			this._lastJinQiuTime = this._manager.timeoutSecond - 10;
		} else if (!this._isBabySleep && this._lastShotTime - this._manager.timeoutSecond >= 10) {
			this._isBabySleep = true;
			this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.CHUIPAOPAO })
		}
		this.isCollectCoin();
		this.isWin();
		if (this._hasWin) {
			if (this._finishRound) {
				return;
			}
			let xxx = 2;
			if (this._isTilt) {
				xxx = 10;
			}
			if (this._manager.curSide == "left") {
				xxx = xxx;
			} else {
				xxx = -xxx;
			}
			egret.setTimeout(() => {
				Matter.Body.setVelocity(this._ballBody, { x: xxx, y: this._ballBody.velocity.y })
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
				this._switchSideTimeout = egret.setTimeout(() => {
					// this._switching = false;
					// this._manager.switchSide();
					this.switchSideHandler();
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
			} else if (this._ballBody && this._ballBody.position.x < -this._ballBody.displays[0].width) {
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
			} else if (this.m_shadow.scaleX < 0.4) {
				this.m_shadow.scaleX = this.m_shadow.scaleY = 0.4;
			}
			this.m_shadow.x = this.m_ball.x;
		}
	}

	private hasGameOver = false;
	private isGameover(iscoliBackgroud: boolean = false): boolean {
		if (this.hasGameOver || !this._ballBody) {
			return;
		}
		let belowNumBasketry: number = 500;
		if (Matter.Bounds.overlaps(this._ballBody.bounds, this._walls.bottomWall.bounds)) {//和地面碰撞
			belowNumBasketry = 0;
		}

		if (this._manager.isLastTime() && this._ballBody && this._ballBody.position.y > (GameConfig.curHeight() - this.m_left_basketry_kuan1.bottom) + belowNumBasketry && !this._hasWin) {
			if (belowNumBasketry == 0) {
			}
			egret.setTimeout(() => {
				this.timeOut();
			}, this, 1000)
			this.hasGameOver = true;
			return true;
		}
		return false;
	}

	private shotBallHandler(evt: egret.TouchEvent): void {
		if (this._ballBody.position.y < -100) {
			return;
		}
		if (this._isBabySleep) {
			// SoundMgr.getInstance().playWake();
			this._isBabySleep = false;
			this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.NORMAL })
		}
		SoundMgr.getInstance().click();
		if (this.m_gamedesc.visible) {
			EventUtils.logEvent("click_gameInfo");
			this.m_gamedesc.alpha = 0.9;
			TweenUtil.stopTweenGroup(this.game);
			egret.Tween.get(this.m_gamedesc).wait(200).to({ alpha: 0 }, 200, egret.Ease.backOut).call(() => {
				this.m_gamedesc.visible = false;
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
			} else {
				Matter.Body.setVelocity(this._ballBody, { x: -Math.abs(this._ballForce_x), y: this._ballForce_y });
				Matter.Body.setAngularVelocity(this._ballBody, -this._ballAngular);
			}
		} else {
			if (this._manager.curSide == "right") {
				Matter.Body.setVelocity(this._ballBody, { x: Math.abs(this._ballForce_x), y: this._ballForce_y });
				Matter.Body.setAngularVelocity(this._ballBody, this._ballAngular);
			} else {
				Matter.Body.setVelocity(this._ballBody, { x: -Math.abs(this._ballForce_x), y: this._ballForce_y });
				Matter.Body.setAngularVelocity(this._ballBody, -this._ballAngular);
			}
		}
		this._lastShotTime = this._manager.timeoutSecond;
		if (!this._playGame) {
			this._playGame = true;
			EventUtils.logEvent("click_ballShot");
		}
	}

	_playGame: boolean = false;

	/**
	 * 一局结束
	 */
	private updateScore(index: number): void {
		let position = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		};
		egret.setTimeout(() => {
			this._fromUnder.clear();
		}, this, 1000)

		let p = this[`m_${this._manager.curSide}_net${2 * index}`];
		if (this._manager.curSide == "left") {
			position.left = p.left;
			position.bottom = p.bottom;
		} else {
			position.right = p.right;
			position.bottom = p.bottom;
		}

		if (this._manager.isLastTime()) {
			if (this._jinQiuStatus.size == 0) {
				this._manager.addEffect("yashao");
				this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.TIAOQI })
			}
			position.bottom = p.bottom - 200;
			GameManager.getInstance().scoreManager.updateScore("yashao", position);
			if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS) {
				return;
			}
		}
		position.bottom = p.bottom;

		let coinNumber: number = 0;
		if (this._isHighShot) {
			if (!this._manager.isLastTime() && this._jinQiuStatus.size == 0) {
				this._manager.addEffect("highShot");
				let randoom = core.MathUtils.random(0, 100);
				if (randoom < 25) {
					this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.TIAOQI })
				}
				if (this._manager.highShotCount == 3) {
					coinNumber += 10;
				}
			}
			GameManager.getInstance().scoreManager.updateScore("highShot", position);
		} else if (this._isKongxin) {
			if (!this._manager.isLastTime() && this._jinQiuStatus.size == 0) {
				this._manager.addEffect("kongxin");
				let randoom = core.MathUtils.random(0, 100);
				if (randoom < 30) {
					this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.HUANHU })
				}
				if (this._manager.kongxinCount == 5) {
					coinNumber += 10;
				}
			}
			GameManager.getInstance().scoreManager.updateScore("kongxin", position);
		} else if (this._isBank) {
			if (!this._manager.isLastTime() && this._jinQiuStatus.size == 0) {
				this._manager.addEffect("bank");
				let randoom = core.MathUtils.random(0, 100);
				if (randoom < 30) {
					this._manager.dispatchEventWith(Girl.PLAY_ANIMATION, false, { type: ANIMATION_TYPE.HUANHU })
				}
				if (this._manager.bankCount == 5) {
					coinNumber += 10;
				}
			}
			GameManager.getInstance().scoreManager.updateScore("bank", position);
		} else {
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
	}

	private timeOut(): void {
		if (this._exitView && this._exitView.parent) {
			this._exitView.closeDialog();
		}
		if (this._helpView && this._helpView.parent) {
			this._helpView.closeDialog();
		}
		let timeout: number = 500;
		if (GameConfig.gameMode == GameConfig.GameMode.TIME) {
			TweenUtil.playTweenGroup(this.timeout, false);
			timeout = 2000;
		}
		egret.setTimeout(() => {
			this.gameover();
		}, this, timeout)
	}

	/**
	 * 游戏结束
	 */
	private _rebornView;
	private _gameoverDlg: ResultDialog;
	private gameover(): void {
		// SoundMgr.getInstance().gameover();
		this.pauseGameHandler(null);

		egret.log("gameover");
		if (this._gameoverDlg && this._gameoverDlg.parent) {
			return;
		}
		if (this._rebornView && this._rebornView.parent) {
			return;
		}
		let showReborn = false;
		if (SwitchManager.openborn && GameManager.getInstance().rebornCount > 0) {
			if (GameConfig.gameMode == GameConfig.GameMode.TIME && GameManager.getInstance().scoreManager.totalScore > 20) {
				showReborn = true;
				core.ResUtils.loadGroups(["reborn"], (progress) => {
				}, (fail) => {
				}, (loadComplete) => {
					this._rebornView = new RebornView();
					this._rebornView.popUp(true, 0, 0, 0, 0);
				}, this);
			} else if (GameConfig.gameMode == GameConfig.GameMode.ENDLESS && GameManager.getInstance().scoreManager.totalScore > 50) {
				showReborn = true;
				core.ResUtils.loadGroups(["reborn_endless"], (progress) => {
				}, (fail) => {
				}, (loadComplete) => {
					this._rebornView = new EndlessRebornDialog();
					this._rebornView.popUp(true, 0, 0, 0, 0);
				}, this);
			}
		}
		if (!showReborn) {
			core.ResUtils.loadGroups(["result"], (progress) => {
			}, (fail) => {
			}, (loadComplete) => {
				this._gameoverDlg = new ResultDialog();
				this._gameoverDlg.popUp();
			}, this);
		}


	}

	/**
	 * 重新开始
	 */
	private restartHandler(evt: egret.Event): void {
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
	}

	private _exitView: ExitDialog;
	private showExitDialog(): void {
		if (this._manager.timeoutSecond <= 0) {
			return;
		}
		if (this._exitView && this._exitView.parent) {
			return;
		}
		EventUtils.logEvent("click_exit");
		this._exitView = new ExitDialog();
		this._exitView.popUp();
	}

	private _loadHelpRes: boolean = false;
	private _helpView: HelpDialog;
	private showHelpDialog(): void {
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
		core.ResUtils.loadGroups(["help"], (progress) => {
		}, (fail) => {
		}, (loadComplete) => {
			this._helpView = new HelpDialog();
			this._helpView.popUp();
			this._loadHelpRes = false;
		}, this);
	}

	private showPauseDialog(): void {
		if (this._manager.timeoutSecond <= 0) {
			return;
		}
		EventUtils.logEvent("click_pause");
		let pauseView: PauseDialog = new PauseDialog();
		pauseView.popUp();
	}

	public release() {
		super.release();

		this._matterScene.clear();
		this._matterScene = null;
		dragonBones.WorldClock.clock.clear();
		this._fire = [];
		this._hou = [];
		this._qian = [];
	}
}