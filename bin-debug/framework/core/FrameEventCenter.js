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
var core;
(function (core) {
    var FrameEventCenter = (function () {
        function FrameEventCenter() {
            this.m_callbacks = [];
        }
        FrameEventCenter.getInstance = function () {
            if (FrameEventCenter.s_instance == null) {
                FrameEventCenter.s_instance = new FrameEventCenter();
            }
            return FrameEventCenter.s_instance;
        };
        FrameEventCenter.prototype.init = function (stage) {
            this.m_stage = stage;
            if (this.m_stage) {
                this.m_preTick = Date.now();
                this.m_stage.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            }
            else {
                egret.log('Stage为null不能开启帧循环监听');
            }
        };
        FrameEventCenter.prototype.onEnterFrame = function (event) {
            var curTick = Date.now();
            var callbacks = this.m_callbacks;
            if (callbacks) {
                for (var i = callbacks.length; i > 0; i--) {
                    var data = callbacks[i - 1];
                    if (!data.isValid) {
                        callbacks.splice(i - 1, 1);
                    }
                }
                for (var i = 0, iLen = callbacks.length; i < iLen; i++) {
                    var data = callbacks[i];
                    if (data.isValid) {
                        if (data.callback) {
                            data.callback.call(data.thisObj, curTick - this.m_preTick);
                        }
                    }
                }
            }
            this.m_preTick = curTick;
        };
        /**
         * 注册事件监听
         */
        FrameEventCenter.prototype.addFrameEventListener = function (callback, thisObj) {
            if (callback && thisObj) {
                var data = new FrameCallBack(callback, thisObj);
                this.m_callbacks.push(data);
            }
        };
        /**
         * 移除事件监听
         */
        FrameEventCenter.prototype.removeFrameEventListener = function (callback, thisObj) {
            var callbacks = this.m_callbacks;
            if (callbacks) {
                for (var i = 0, iLen = callbacks.length; i < iLen; i++) {
                    var data = callbacks[i];
                    if (data.callback === callback && data.thisObj === thisObj) {
                        data.isValid = false;
                    }
                }
            }
        };
        return FrameEventCenter;
    }());
    core.FrameEventCenter = FrameEventCenter;
    __reflect(FrameEventCenter.prototype, "core.FrameEventCenter");
    var FrameCallBack = (function (_super) {
        __extends(FrameCallBack, _super);
        function FrameCallBack(callback, thisObj) {
            var _this = _super.call(this, callback, thisObj) || this;
            _this.isValid = true;
            return _this;
        }
        FrameCallBack.prototype.clone = function () {
            var data = new FrameCallBack(this.callback, this.thisObj);
            data.index = this.index;
            data.isValid = this.isValid;
            return data;
        };
        return FrameCallBack;
    }(core.Callback));
    __reflect(FrameCallBack.prototype, "FrameCallBack");
})(core || (core = {}));
