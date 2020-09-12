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
var ParticleView = (function (_super) {
    __extends(ParticleView, _super);
    function ParticleView() {
        var _this = _super.call(this) || this;
        _this.touchEnabled = false;
        _this.touchChildren = false;
        return _this;
    }
    ParticleView.prototype.onShow = function (event) {
        _super.prototype.onShow.call(this, event);
    };
    ParticleView.prototype.onHide = function (event) {
        _super.prototype.onHide.call(this, event);
    };
    /**
     * 添加监听
     */
    ParticleView.prototype.addListener = function () {
        GameManager.getInstance().baskectBallManager.addEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        GameManager.getInstance().baskectBallManager.addEventListener(BaskectBallManager.COMPLETE_COMBO, this.removeEffectHandler, this);
    };
    /**
     * 删除监听
     */
    ParticleView.prototype.removeListener = function () {
        // GameManager.getInstance().baskectBallManager.removeEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        // GameManager.getInstance().baskectBallManager.removeEventListener(BaskectBallManager.COMPLETE_COMBO, this.removeEffectHandler, this);
    };
    ParticleView.prototype.addEffectHandler = function (evt) {
        var type = evt.data.type;
        if (this.system) {
            this.system.stop();
            this.system.parent && this.system.parent.removeChild(this.system);
        }
        if (GameManager.getInstance().baskectBallManager.isYanMode()) {
            var texture = RES.getRes("maoyan_png");
            var config = RES.getRes("maoyan_json");
            this.system = new particle.GravityParticleSystem(texture, config);
            this.addChild(this.system);
            this.system.start();
        }
        else if (GameManager.getInstance().baskectBallManager.isLightMode()) {
            var texture = RES.getRes("fire_png");
            var config = RES.getRes("fire_json");
            this.system = new particle.GravityParticleSystem(texture, config);
            this.addChild(this.system);
            this.system.start();
        }
        else if (GameManager.getInstance().baskectBallManager.isFireMode()) {
            var texture = RES.getRes("fire_png");
            var config = RES.getRes("fire_json");
            this.system = new particle.GravityParticleSystem(texture, config);
            this.addChild(this.system);
            this.system.start();
        }
    };
    ParticleView.prototype.removeEffectHandler = function (evt) {
        if (this.system) {
            this.system.stop();
            this.system.parent && this.system.parent.removeChild(this.system);
        }
    };
    ParticleView.prototype.changeTexture = function (s) {
        var texture = RES.getRes(s);
        this.system.changeTexture(texture);
    };
    ParticleView.prototype.updatePos = function (_x, _y) {
        if (this.system) {
            this.system.emitterX = _x;
            this.system.emitterY = _y;
        }
    };
    return ParticleView;
}(core.EUIComponent));
__reflect(ParticleView.prototype, "ParticleView");
