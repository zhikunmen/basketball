/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-27
 * Desc   ： 简单游戏场景
 ********************************/
module core {
    export class MatterScene {
        //物理世界
        public world: Matter.World;
        public engine: Matter.Engine;
        public runner: Matter.Runner;
        public render: Matter.Render;
        public stage: egret.Stage;
        
        /**
         * 重力
         */
        private _gravity: number = 0.80;
        
        public set gravity(v : number) {
            this._gravity = v;
            this.world.gravity.y = v;
        }
        
        public get gravity() : number {
            return this._gravity;
        }
        

        public constructor() {
            new MatterUtil(this);

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


            let clock = new egret.Timer(16, 0);
            clock.addEventListener(egret.TimerEvent.TIMER, this.p2Step, this);
            clock.start();
        }

        private p2Step(e: egret.Event): void {
            this.updateWorldBodiesSkin(this.world);
        }

        private updateWorldBodiesSkin(world: Matter.World): void {
            var len = world.bodies.length;

            for (var i: number = 0; i < len; i++) {//遍历所有的刚体
                var temBody: Matter.Body = world.bodies[i];
                this.updateBodySkin(temBody);
            }
        }

		/**
         * 更新刚体的皮肤显示
         */
        private updateBodySkin(body: Matter.Body): void {
            if (body.isStatic || body.displays == null || body.displays.length == 0) {
                return;
            }
            for (var i = 0; i < body.displays.length; i++) {
                var skinDisp: egret.DisplayObject = body.displays[i];
                if (skinDisp) {
                    skinDisp.x = body.position.x;
                    skinDisp.y = body.position.y;
                    skinDisp.rotation = body.angle * 180 / Math.PI;
                }
            }
        }

        /**
         * 加速
         */
        private _speedupRunner: Matter.Runner = Matter.Runner.create({});
        public speedUp(): void {
            Matter.Runner.run(this._speedupRunner, this.engine);
        }
        public resetSpeed(): void {
            Matter.Runner.stop(this._speedupRunner);
        }

        public clear():void{
            this.resetSpeed();
            Matter.Engine.clear(this.engine);
            Matter.World.clear(this.world,false);
        }
    }
}