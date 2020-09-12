class Girl extends core.EUIComponent {

    public static PLAY_ANIMATION: string = "play_animation";
    public static PAUSE_ANIMATION: string = "pause_animation";
    public factory: dragonBones.EgretFactory;
    private currentArmature: dragonBones.Armature;
    private newAnimationType: ANIMATION_TYPE = ANIMATION_TYPE.NONE;

    public constructor() {
        super();
    }

    protected addListener(): void {
        GameManager.getInstance().baskectBallManager.addEventListener(Girl.PLAY_ANIMATION, this.playAnimation, this);
        // GameManager.getInstance().baskectBallManager.addEventListener(Girl.PAUSE_ANIMATION, this.pauseAnimation, this);
    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
        GameManager.getInstance().baskectBallManager.removeEventListener(Girl.PLAY_ANIMATION, this.playAnimation, this);
        // GameManager.getInstance().baskectBallManager.removeEventListener(Girl.PAUSE_ANIMATION, this.pauseAnimation, this);
    }

    protected onShow(event?: egret.Event): void {
        super.onShow(event);
        this.factory = DragonUtils.createDragonBones(`lalamei_ske_json`, `lalamei_tex_json`, `lalamei_tex_png`);
        this.createOrComplete(ANIMATION_TYPE.NORMAL);
    }

    protected onHide(event?: egret.Event): void {
        super.onHide(event);
    }

    private playAnimation(evt: egret.Event): void {
        let type: number = evt.data.type;
        // this.newAnimationType = type;
        this.createOrComplete(type);
    }

    private pauseAnimation(evt: egret.Event): void {
        this.clearArmature();
    }

    private getRandomType() {
        return core.MathUtils.random(1, 3);
    }

    private createOrComplete(type: number) {
        if (typeof type != "number") {
            type = this.getRandomType();
        }
        this.clearArmature();
        this.currentArmature = this.factory.buildArmature(`${type}`);
        dragonBones.WorldClock.clock.add(this.currentArmature);
        let display: egret.DisplayObjectContainer = this.currentArmature.display;
        display.scaleX = display.scaleY = 1;
        this.addChild(display);
        this.currentArmature.addEventListener(dragonBones.EventObject.COMPLETE, this.createOrComplete, this);
        this.currentArmature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.animationEvent, this);
        this.currentArmature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.looperComplete, this);
        if (type == ANIMATION_TYPE.NORMAL) {
            this.currentArmature.animation.play("animation", 10);
        } else if (type == ANIMATION_TYPE.TANQI || type == ANIMATION_TYPE.TIAOQI || type == ANIMATION_TYPE.HUANHU) {
            this.currentArmature.animation.play("animation", 1);
        } else {
            this.currentArmature.animation.play("animation", 2);
        }
    }

    private clearArmature() {
        if (this.currentArmature) {
            this.currentArmature.animation.stop();
            DragonUtils.removeFromParent(this.currentArmature.display);
            dragonBones.WorldClock.clock.remove(this.currentArmature);
            this.currentArmature.removeEventListener(dragonBones.EventObject.COMPLETE, this.createOrComplete, this);
            this.currentArmature.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this.animationEvent, this);
            this.currentArmature.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.looperComplete, this);
            this.currentArmature = null;
        }
    }

    private animationEvent(evt: dragonBones.Event) {
        if (evt.frameLabel == "chui") {
            SoundMgr.getInstance().playSleep();
        } else if (evt.frameLabel == "bmob") {
            SoundMgr.getInstance().playWake();
        } else if (evt.frameLabel == "tanqi") {
            SoundMgr.getInstance().playTanqi();
        } else if (evt.frameLabel == "nice") {
            SoundMgr.getInstance().playCheer();
        } else if (evt.frameLabel == "perfact") {
            SoundMgr.getInstance().playExciting();
        }
    }

    private looperComplete() {
        // if (this.newAnimationType) {
        //     this.createOrComplete(this.newAnimationType);
        //     this.newAnimationType = ANIMATION_TYPE.NONE;
        // }
    }

}

enum ANIMATION_TYPE {
    NONE = 0,
    NORMAL = 1,
    JIAYOU = 2,
    TANQI = 3,
    CHUIPAOPAO = 4,
    HUANHU = 5,
    TIAOQI = 6
}