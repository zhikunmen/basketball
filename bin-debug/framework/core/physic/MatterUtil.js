var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-27
 * Desc   ： Matter物理引擎工具
 ********************************/
var core;
(function (core) {
    var MatterUtil = (function () {
        function MatterUtil(matterScene) {
            MatterUtil._matterScene = matterScene;
        }
        /**
         * 在物理世界创建一个矩形刚体，显示cube矢量图形
         */
        MatterUtil.addOneBox = function (px, py, pw, ph, pAngle) {
            var body = Matter.Bodies.rectangle(px, py, pw, ph, { isStatic: true, restitution: 1.0, friction: 0.1, angle: pAngle / 180 * Math.PI });
            Matter.World.add(this._matterScene.world, body);
            return body;
        };
        /**
        * 在物理世界创建一个圆形刚体，显示circle矢量图形
        */
        MatterUtil.addOneBall = function (px, py, pr, pAngle) {
            var display;
            var body = Matter.Bodies.circle(px, py, pr, { isStatic: false, restitution: 1.1, friction: 0.1 });
            Matter.World.add(this._matterScene.world, body);
            return body;
        };
        /**
        * 在物理世界创建一个三角形刚体，显示三角形矢量图形
        */
        MatterUtil.addTriangle = function (px, py, pr, pAngle) {
            var display;
            var body = Matter.Bodies.polygon(px, py, 3, pr, { isStatic: true, restitution: 1.3, friction: 0, angle: Math.PI / 180 * pAngle });
            Matter.World.add(this._matterScene.world, body);
            return body;
        };
        MatterUtil.removeBody = function (body) {
            if (!body) {
                return;
            }
            Matter.World.remove(this._matterScene.world, body);
            Matter.World.remove(this._matterScene.world, body);
        };
        MatterUtil.addBody = function (body) {
            Matter.World.add(this._matterScene.world, body);
        };
        MatterUtil.setTimeout = function (listener, thisObject, delay) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var self = this;
            function callback() {
                if (self._matterScene.engine.timing.timestamp - tempTimeStamp >= delay) {
                    listener.apply(thisObject, [self].concat(args));
                    self.clearTimeout(callback, thisObject);
                }
            }
            var tempTimeStamp = this._matterScene.engine.timing.timestamp;
            core.TimerManager.instance.addTick(16, -1, callback, thisObject);
            return callback;
        };
        MatterUtil.clearTimeout = function (listener, thisObject) {
            core.TimerManager.instance.removeTick(listener, thisObject);
        };
        MatterUtil.clearTimeouts = function (thisObject) {
            core.TimerManager.instance.removeTicks(thisObject);
        };
        return MatterUtil;
    }());
    core.MatterUtil = MatterUtil;
    __reflect(MatterUtil.prototype, "core.MatterUtil");
})(core || (core = {}));
