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
var Girl = (function (_super) {
    __extends(Girl, _super);
    function Girl() {
        var _this = _super.call(this) || this;
        _this.newAnimationType = ANIMATION_TYPE.NONE;
        return _this;
    }
    Girl.prototype.addListener = function () {
        GameManager.getInstance().baskectBallManager.addEventListener(Girl.PLAY_ANIMATION, this.playAnimation, this);
        // GameManager.getInstance().baskectBallManager.addEventListener(Girl.PAUSE_ANIMATION, this.pauseAnimation, this);
    };
    /**
     * 删除监听
     */
    Girl.prototype.removeListener = function () {
        GameManager.getInstance().baskectBallManager.removeEventListener(Girl.PLAY_ANIMATION, this.playAnimation, this);
        // GameManager.getInstance().baskectBallManager.removeEventListener(Girl.PAUSE_ANIMATION, this.pauseAnimation, this);
    };
    Girl.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
        this.factory = DragonUtils.createDragonBones("lalamei_ske_json", "lalamei_tex_json", "lalamei_tex_png");
        this.createOrComplete(ANIMATION_TYPE.NORMAL);
    };
    Girl.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this, event);
    };
    Girl.prototype.playAnimation = function (evt) {
        var type = evt.data.type;
        // this.newAnimationType = type;
        this.createOrComplete(type);
    };
    Girl.prototype.pauseAnimation = function (evt) {
        this.clearArmature();
    };
    Girl.prototype.getRandomType = function () {
        return core.MathUtils.random(1, 3);
    };
    Girl.prototype.createOrComplete = function (type) {
        if (typeof type != "number") {
            type = this.getRandomType();
        }
        this.clearArmature();
        this.currentArmature = this.factory.buildArmature("" + type);
        dragonBones.WorldClock.clock.add(this.currentArmature);
        var display = this.currentArmature.display;
        display.scaleX = display.scaleY = 1;
        this.addChild(display);
        this.currentArmature.addEventListener(dragonBones.EventObject.COMPLETE, this.createOrComplete, this);
        this.currentArmature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.animationEvent, this);
        this.currentArmature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.looperComplete, this);
        if (type == ANIMATION_TYPE.NORMAL) {
            this.currentArmature.animation.play("animation", 10);
        }
        else if (type == ANIMATION_TYPE.TANQI || type == ANIMATION_TYPE.TIAOQI || type == ANIMATION_TYPE.HUANHU) {
            this.currentArmature.animation.play("animation", 1);
        }
        else {
            this.currentArmature.animation.play("animation", 2);
        }
    };
    Girl.prototype.clearArmature = function () {
        if (this.currentArmature) {
            this.currentArmature.animation.stop();
            DragonUtils.removeFromParent(this.currentArmature.display);
            dragonBones.WorldClock.clock.remove(this.currentArmature);
            this.currentArmature.removeEventListener(dragonBones.EventObject.COMPLETE, this.createOrComplete, this);
            this.currentArmature.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this.animationEvent, this);
            this.currentArmature.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.looperComplete, this);
            this.currentArmature = null;
        }
    };
    Girl.prototype.animationEvent = function (evt) {
        if (evt.frameLabel == "chui") {
            SoundMgr.getInstance().playSleep();
        }
        else if (evt.frameLabel == "bmob") {
            SoundMgr.getInstance().playWake();
        }
        else if (evt.frameLabel == "tanqi") {
            SoundMgr.getInstance().playTanqi();
        }
        else if (evt.frameLabel == "nice") {
            SoundMgr.getInstance().playCheer();
        }
        else if (evt.frameLabel == "perfact") {
            SoundMgr.getInstance().playExciting();
        }
    };
    Girl.prototype.looperComplete = function () {
        // if (this.newAnimationType) {
        //     this.createOrComplete(this.newAnimationType);
        //     this.newAnimationType = ANIMATION_TYPE.NONE;
        // }
    };
    Girl.PLAY_ANIMATION = "play_animation";
    Girl.PAUSE_ANIMATION = "pause_animation";
    return Girl;
}(core.EUIComponent));
__reflect(Girl.prototype, "Girl");
var ANIMATION_TYPE;
(function (ANIMATION_TYPE) {
    ANIMATION_TYPE[ANIMATION_TYPE["NONE"] = 0] = "NONE";
    ANIMATION_TYPE[ANIMATION_TYPE["NORMAL"] = 1] = "NORMAL";
    ANIMATION_TYPE[ANIMATION_TYPE["JIAYOU"] = 2] = "JIAYOU";
    ANIMATION_TYPE[ANIMATION_TYPE["TANQI"] = 3] = "TANQI";
    ANIMATION_TYPE[ANIMATION_TYPE["CHUIPAOPAO"] = 4] = "CHUIPAOPAO";
    ANIMATION_TYPE[ANIMATION_TYPE["HUANHU"] = 5] = "HUANHU";
    ANIMATION_TYPE[ANIMATION_TYPE["TIAOQI"] = 6] = "TIAOQI";
})(ANIMATION_TYPE || (ANIMATION_TYPE = {}));
