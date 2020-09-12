class ParticleView extends core.EUIComponent {
    private system: particle.ParticleSystem;
    public constructor() {
        super();
        this.touchEnabled = false;
        this.touchChildren = false;
    }


    protected onShow(event?: egret.Event): void {
        super.onShow(event);
    }

    protected onHide(event?: egret.Event): void {
        super.onHide(event);
    }
    /**
     * 添加监听
     */
    protected addListener(): void {
        GameManager.getInstance().baskectBallManager.addEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        GameManager.getInstance().baskectBallManager.addEventListener(BaskectBallManager.COMPLETE_COMBO, this.removeEffectHandler, this);
    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
        // GameManager.getInstance().baskectBallManager.removeEventListener(BaskectBallManager.ADD_EFFECT, this.addEffectHandler, this);
        // GameManager.getInstance().baskectBallManager.removeEventListener(BaskectBallManager.COMPLETE_COMBO, this.removeEffectHandler, this);
    }

    private addEffectHandler(evt: egret.Event): void {
        let type: string = evt.data.type;
        if (this.system) {
            this.system.stop();
            this.system.parent && this.system.parent.removeChild(this.system);
        }
        if (GameManager.getInstance().baskectBallManager.isYanMode()) {
            let texture = RES.getRes("maoyan_png");
            let config = RES.getRes("maoyan_json");
            this.system = new particle.GravityParticleSystem(texture, config);
            this.addChild(this.system);
            this.system.start();
        } else if (GameManager.getInstance().baskectBallManager.isLightMode()) {
            let texture = RES.getRes("fire_png");
            let config = RES.getRes("fire_json");
            this.system = new particle.GravityParticleSystem(texture, config);
            this.addChild(this.system);
            this.system.start();
        } else if (GameManager.getInstance().baskectBallManager.isFireMode()) {
            let texture = RES.getRes("fire_png");
            let config = RES.getRes("fire_json");
            this.system = new particle.GravityParticleSystem(texture, config);
            this.addChild(this.system);
            this.system.start();
        }
    }

    private removeEffectHandler(evt: egret.Event): void {
        if (this.system) {
            this.system.stop();
            this.system.parent && this.system.parent.removeChild(this.system);
        }
    }

    public changeTexture(s: string): void {
        var texture = RES.getRes(s);
        this.system.changeTexture(texture);
    }

    public updatePos(_x: number, _y: number): void {
        if (this.system) {
            this.system.emitterX = _x;
            this.system.emitterY = _y;
        }
    }
}