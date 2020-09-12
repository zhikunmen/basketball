var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-27
 * Desc   ： 简单游戏场景
 ********************************/
var core;
(function (core) {
    var MatterScene = (function () {
        function MatterScene() {
            /**
             * 重力
             */
            this._gravity = 0.80;
            /**
             * 加速
             */
            this._speedupRunner = Matter.Runner.create({});
            new core.MatterUtil(this);
            this.stage = GameConfig.curStage();
            //创建world
            this.engine = Matter.Engine.create();
            this.engine.enableSleeping = true;
            this.world = this.engine.world;
            this.world.gravity.y = this._gravity;
            this.runner = Matter.Runner.create({});
            Matter.Runner.run(this.runner, this.engine);
            if (GameConfig.openMatterDebugger) {
                this.render = Matter.Render.create({
                    element: document.getElementById("matter-debugger"),
                    engine: this.engine,
                    options: {
                        width: GameConfig.curWidth(),
                        height: GameConfig.curHeight(),
                        wireframes: false
                    }
                });
                Matter.Render.run(this.render);
            }
            //let mouseConstraint = Matter.MouseConstraint.create(this.engine, {
            //});
            // Matter.World.add(this.world, mouseConstraint);
            var clock = new egret.Timer(16, 0);
            clock.addEventListener(egret.TimerEvent.TIMER, this.p2Step, this);
            clock.start();
        }
        Object.defineProperty(MatterScene.prototype, "gravity", {
            get: function () {
                return this._gravity;
            },
            set: function (v) {
                this._gravity = v;
                this.world.gravity.y = v;
            },
            enumerable: true,
            configurable: true
        });
        MatterScene.prototype.p2Step = function (e) {
            this.updateWorldBodiesSkin(this.world);
        };
        MatterScene.prototype.updateWorldBodiesSkin = function (world) {
            var len = world.bodies.length;
            for (var i = 0; i < len; i++) {
                var temBody = world.bodies[i];
                this.updateBodySkin(temBody);
            }
        };
        /**
         * 更新刚体的皮肤显示
         */
        MatterScene.prototype.updateBodySkin = function (body) {
            if (body.isStatic || body.displays == null || body.displays.length == 0) {
                return;
            }
            for (var i = 0; i < body.displays.length; i++) {
                var skinDisp = body.displays[i];
                if (skinDisp) {
                    skinDisp.x = body.position.x;
                    skinDisp.y = body.position.y;
                    skinDisp.rotation = body.angle * 180 / Math.PI;
                }
            }
        };
        MatterScene.prototype.speedUp = function () {
            Matter.Runner.run(this._speedupRunner, this.engine);
        };
        MatterScene.prototype.resetSpeed = function () {
            Matter.Runner.stop(this._speedupRunner);
        };
        MatterScene.prototype.clear = function () {
            this.resetSpeed();
            Matter.Engine.clear(this.engine);
            Matter.World.clear(this.world, false);
        };
        return MatterScene;
    }());
    core.MatterScene = MatterScene;
    __reflect(MatterScene.prototype, "core.MatterScene");
})(core || (core = {}));
