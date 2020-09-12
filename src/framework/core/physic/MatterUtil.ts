/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-27
 * Desc   ： Matter物理引擎工具
 ********************************/
module core {
    export class MatterUtil {
        private static _matterScene:MatterScene;

        public constructor(matterScene:MatterScene) {
            MatterUtil._matterScene = matterScene;
        }
        
		/**
         * 在物理世界创建一个矩形刚体，显示cube矢量图形
         */
        public static addOneBox(px: number, py: number, pw: number, ph: number, pAngle: number): Matter.Body {
            let body: Matter.Body = Matter.Bodies.rectangle(px, py, pw, ph, { isStatic: true, restitution: 1.0, friction: 0.1, angle: pAngle / 180 * Math.PI});
            Matter.World.add(this._matterScene.world, body);

            return body;
        }

		/**
        * 在物理世界创建一个圆形刚体，显示circle矢量图形
        */
        public static addOneBall(px: number, py: number, pr: number, pAngle: number): Matter.Body {
            var display: egret.DisplayObject;
            let body = Matter.Bodies.circle(px, py, pr, { isStatic: false, restitution: 1.1, friction: 0.1 });
            Matter.World.add(this._matterScene.world, body);
            return body;
        }

		/**
        * 在物理世界创建一个三角形刚体，显示三角形矢量图形
        */
        public static addTriangle(px: number, py: number, pr: number, pAngle: number): Matter.Body {
            var display: egret.DisplayObject;
            let body = Matter.Bodies.polygon(px, py, 3, pr, { isStatic: true, restitution: 1.3, friction: 0, angle: Math.PI / 180 * pAngle });
            Matter.World.add(this._matterScene.world, body);

            return body;
        }

        public static removeBody( body: Matter.Body | Matter.Composite | Matter.Constraint):void{
            if(!body){
                return;
            }
            Matter.World.remove(this._matterScene.world, body);
            Matter.World.remove(this._matterScene.world, body);
        }

        public static addBody( body: Matter.Body | Matter.Composite | Matter.Constraint):void{
            Matter.World.add(this._matterScene.world, body);
        }   

        public static setTimeout(listener: (this: any, ...arg) => void, thisObject: any, delay: number, ...args: any[]): Function{
            let self = this;
            function callback(){
                if(self._matterScene.engine.timing.timestamp - tempTimeStamp >= delay){
                    listener.apply(thisObject,[self,...args]);
                    self.clearTimeout(callback,thisObject);
                }
            }
            
            let tempTimeStamp:number = this._matterScene.engine.timing.timestamp;
            core.TimerManager.instance.addTick(16,-1,callback,thisObject)
            
            return callback;
        }

        public static clearTimeout(listener:Function,thisObject:any):void{
            core.TimerManager.instance.removeTick(listener,thisObject);
        }

        public static clearTimeouts(thisObject:any):void{
            core.TimerManager.instance.removeTicks(thisObject);
        }
    }
}