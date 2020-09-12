var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var BattleManager = (function () {
        function BattleManager() {
            this.isAgainstRobert = false;
            this.registCallback();
        }
        Object.defineProperty(BattleManager, "instance", {
            get: function () {
                if (!BattleManager._instance) {
                    BattleManager._instance = new BattleManager();
                }
                return BattleManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        BattleManager.prototype.registCallback = function () {
            var _this = this;
            /**游戏开始回调 */
            if (Utils.isRuntime) {
                gmbox.battleBridge.onStart(function () {
                    egret.log("game start");
                    GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.GAME_START);
                    if (_this.voiceRes) {
                        _this.postMessage({ type: game.BattleMsgType.VOICE, data: _this.voiceRes.status });
                    }
                });
                /**游戏中收到回调 */
                gmbox.battleBridge.onMessage(function (res) {
                    _this.onMessage(res);
                });
                /**强制结束游戏收到回调 */
                gmbox.battleBridge.onForceQuit(function () {
                    _this.postMessage({ type: game.BattleMsgType.RESULT, data: game.ResultCodeEnum.LOSE });
                    _this.postResult(4);
                });
                /**语音变化*/
                if (gmbox.battleBridge.updateVoiceStatus) {
                    gmbox.battleBridge.updateVoiceStatus(function (res) {
                        egret.log("收到语音修改", JSON.stringify(res));
                        GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.VOICE_CHANGE, false, res);
                        if (res.userId == BatterInfo.instance.myUserInfo.userId) {
                            _this.voiceRes = res;
                            _this.postMessage({ type: game.BattleMsgType.VOICE, data: res.status });
                        }
                        BatterInfo.instance.setMikeStatus(res);
                    });
                }
                /**表情 */
                if (gmbox.battleBridge.onEmojiMessage) {
                    gmbox.battleBridge.onEmojiMessage(function (res) {
                        _this.onMessage({ type: game.BattleMsgType.EMOJI, data: res.id });
                    });
                }
            }
        };
        /**
         * 准备游戏
         */
        BattleManager.prototype.init = function () {
            var _this = this;
            return new Promise(function (resovle, reject) {
                egret.log("准备游戏");
                gmbox.battleBridge.init({
                    success: function (data) {
                        _this.initBattleData = data;
                        data.players.forEach(function (f) {
                            if (f.userId != BatterInfo.instance.myUserInfo.userId) {
                                BatterInfo.instance.otherUserInfo = f;
                                if (f.type == 0)
                                    BatterInfo.instance.isRobot = false;
                            }
                        });
                        egret.log("收到用户信息", JSON.stringify(data));
                        resovle(data);
                    },
                    fail: function (data) {
                        reject(data);
                        egret.log("收到用户信息失败", JSON.stringify(data));
                    },
                    complete: function (data) {
                        egret.log("收到用户信息完成");
                    },
                });
            });
        };
        /**
         * 通知服务器游戏开始
         */
        BattleManager.prototype.ready = function () {
            egret.log('-----本人ready');
            if (Utils.isRuntime) {
                gmbox.battleBridge.ready();
            }
        };
        /**
         * 广播信息
         * @param msg
         */
        BattleManager.prototype.postMessage = function (msg) {
            egret.log("-----postMessage-----", JSON.stringify(msg));
            if (Utils.isRuntime) {
                gmbox.battleBridge.postMessage(msg);
            }
        };
        /**
         * 收到消息
         */
        BattleManager.prototype.onMessage = function (msg) {
            egret.log("-----onMessage-----", JSON.stringify(msg));
            clearTimeout(BatterInfo.instance.resultTimeout);
            switch (msg.type) {
                case game.BattleMsgType.DRAGDOWN:
                    GameManager.getInstance().scoreManager.updateOtherScore(msg.data);
                    break;
                case game.BattleMsgType.EMOJI:
                    GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.RECV_EMOJI, false, msg.data);
                    break;
                case game.BattleMsgType.RESULT://对手输就是我赢 对手赢就是我输。
                    var code = void 0;
                    if (msg.data == game.ResultCodeEnum.LOSE) {
                        code = game.ResultCodeEnum.WIN;
                    }
                    else if (msg.data == game.ResultCodeEnum.PLAYEVEN) {
                        code = game.ResultCodeEnum.PLAYEVEN;
                    }
                    else if (msg.data == game.ResultCodeEnum.WIN) {
                        code = game.ResultCodeEnum.LOSE;
                    }
                    // ModuleMgr.instance.showResultPanel(code)
                    break;
                case game.BattleMsgType.VOICE://收到对方状态  
                    GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.VOICE_CHANGE, false, { userId: BatterInfo.instance.otherUserInfo.userId, status: msg.data });
                    break;
            }
        };
        /**
         * 游戏结束
         * 2：游戏胜利结束。3：游戏平局结束。4：失败。
         * @param msg
         */
        BattleManager.prototype.postResult = function (result) {
            egret.log("-----postResult-----", JSON.stringify(result));
            if (Utils.isRuntime) {
                gmbox.battleBridge.postResult({
                    "result": result
                });
            }
        };
        /**
         *
         * 发送操作消息
         * @param {score} 分数
         *
         *  */
        BattleManager.prototype.sendDragMessage = function (score) {
            if (BatterInfo.instance.isRobot) {
                return;
            }
            var req = {};
            req.type = game.BattleMsgType.DRAGDOWN;
            req.data = score;
            this.postMessage(req);
        };
        /**初始化表情数据 */
        BattleManager.prototype.initEmojiData = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this.emojiDataArr && _this.emojiDataArr.length) {
                    resolve(_this.emojiDataArr);
                }
                else {
                    gmbox.platformCall({
                        type: 1,
                        success: function (res) {
                            _this.emojiDataArr = res.data;
                            resolve(res.data);
                        }, fail: function (res) {
                        }, complete: function (res) {
                        }
                    });
                }
            });
        };
        /**发送表情 */
        BattleManager.prototype.postEmoji = function (id) {
            GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.SEND_EMOJI, false, id);
            if (Utils.isRuntime) {
                gmbox.battleBridge.postEmojiMessage({
                    "id": id.toString()
                });
            }
        };
        /**根据id获取表情 */
        BattleManager.prototype.getEmojiById = function (id) {
            var emoji;
            this.emojiDataArr.some(function (f) {
                if (f.id == id) {
                    emoji = f;
                    return true;
                }
            });
            return emoji;
        };
        BattleManager._instance = null;
        return BattleManager;
    }());
    game.BattleManager = BattleManager;
    __reflect(BattleManager.prototype, "game.BattleManager");
})(game || (game = {}));
