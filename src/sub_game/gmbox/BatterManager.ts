module game {
    export class BattleManager {
        private static _instance = null;

        public initBattleData: gmbox.IInitBattleData;
        public isAgainstRobert: boolean = false;
        public emojiDataArr: Array<IEmojiStruct>;
        private voiceRes;
        constructor() {
            this.registCallback();
        }

        public static get instance(): BattleManager {
            if (!BattleManager._instance) {
                BattleManager._instance = new BattleManager();
            }
            return BattleManager._instance;
        }

        public registCallback(): void {
            /**游戏开始回调 */
            if (Utils.isRuntime) {
                gmbox.battleBridge.onStart(() => {
                    egret.log("game start");
                    GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.GAME_START);
                    if(this.voiceRes) {
                        this.postMessage({ type: BattleMsgType.VOICE, data: this.voiceRes.status });
                    }
                })

                /**游戏中收到回调 */
                gmbox.battleBridge.onMessage((res) => {
                    this.onMessage(res);
                })
                /**强制结束游戏收到回调 */
                gmbox.battleBridge.onForceQuit(() => {
                    this.postMessage({ type: BattleMsgType.RESULT, data: ResultCodeEnum.LOSE });
                    this.postResult(4);
                })

                /**语音变化*/
                if (gmbox.battleBridge.updateVoiceStatus) {
                    gmbox.battleBridge.updateVoiceStatus((res) => {
                        egret.log("收到语音修改", JSON.stringify(res));
                        GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.VOICE_CHANGE, false, res);
                        if(res.userId == BatterInfo.instance.myUserInfo.userId) {
                            this.voiceRes = res;
                            this.postMessage({ type: BattleMsgType.VOICE, data: res.status });
                        }
                        BatterInfo.instance.setMikeStatus(res)
                    })
                }
                /**表情 */
                if (gmbox.battleBridge.onEmojiMessage) {
                    gmbox.battleBridge.onEmojiMessage((res) => {
                        this.onMessage({ type: BattleMsgType.EMOJI, data: res.id });
                    })
                }
            }
        }

        /**
         * 准备游戏
         */
        public init(): Promise<any> {
            return new Promise((resovle, reject) => {
                egret.log("准备游戏");
                gmbox.battleBridge.init({
                    success: (data: gmbox.IInitBattleData) => {
                        this.initBattleData = data;
                        data.players.forEach((f) => {//两人对战
                            if (f.userId != BatterInfo.instance.myUserInfo.userId) {
                                BatterInfo.instance.otherUserInfo = f;
                                if (f.type == 0)
                                    BatterInfo.instance.isRobot = false;
                            }
                        })
                        egret.log("收到用户信息", JSON.stringify(data));
                        resovle(data);
                    },
                    fail: (data) => {
                        reject(data);
                        egret.log("收到用户信息失败", JSON.stringify(data));
                    },
                    complete: (data) => {
                        egret.log("收到用户信息完成");
                    },
                });
            })
        }
        /**
         * 通知服务器游戏开始
         */
        public ready(): void {
            egret.log('-----本人ready');
            if (Utils.isRuntime) {
                gmbox.battleBridge.ready();
            }
        }

        /**
         * 广播信息
         * @param msg 
         */
        public postMessage(msg: IBattleMsg): void {
            egret.log("-----postMessage-----", JSON.stringify(msg))
            if (Utils.isRuntime) {
                gmbox.battleBridge.postMessage(msg);
            }
        }
        /**
         * 收到消息
         */
        private onMessage(msg: game.IBattleMsg) {
            egret.log("-----onMessage-----", JSON.stringify(msg))
            clearTimeout(BatterInfo.instance.resultTimeout);
            switch (msg.type) {
                case BattleMsgType.DRAGDOWN:
                    GameManager.getInstance().scoreManager.updateOtherScore(msg.data);
                    break;
                case BattleMsgType.EMOJI:
                    GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.RECV_EMOJI, false, msg.data);
                    break;
                case BattleMsgType.RESULT://对手输就是我赢 对手赢就是我输。
                    let code;
                    if (msg.data == ResultCodeEnum.LOSE) {
                        code = ResultCodeEnum.WIN;
                    } else if (msg.data == ResultCodeEnum.PLAYEVEN) {
                        code = ResultCodeEnum.PLAYEVEN
                    } else if (msg.data == ResultCodeEnum.WIN) {
                        code = ResultCodeEnum.LOSE
                    }
                    // ModuleMgr.instance.showResultPanel(code)
                    break;
                case BattleMsgType.VOICE://收到对方状态  
                    GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.VOICE_CHANGE, false, <IVoiceStruct>{ userId: BatterInfo.instance.otherUserInfo.userId, status: msg.data });
                    break;
            }
        }

        /**
         * 游戏结束
         * 2：游戏胜利结束。3：游戏平局结束。4：失败。
         * @param msg 
         */
        public postResult(result: number): void {
            egret.log("-----postResult-----", JSON.stringify(result))
            if (Utils.isRuntime) {
                gmbox.battleBridge.postResult({
                    "result": result
                });
            }
        }

        /**
         * 
         * 发送操作消息
         * @param {score} 分数
         * 
         *  */
        public sendDragMessage(score: number) {
            if (BatterInfo.instance.isRobot) {
                return;
            }
            let req = <IBattleMsg>{};
            req.type = BattleMsgType.DRAGDOWN;
            req.data = score;
            this.postMessage(req);
        }


        /**初始化表情数据 */
        public initEmojiData(): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.emojiDataArr && this.emojiDataArr.length) {
                    resolve(this.emojiDataArr);
                } else {
                    gmbox.platformCall({
                        type: 1,
                        success: (res) => {
                            this.emojiDataArr = res.data;
                            resolve(res.data);
                        }, fail: (res) => {

                        }, complete: (res) => {
                        }
                    });
                }
            })
        }
        /**发送表情 */
        public postEmoji(id: number) {
            GameManager.getInstance().baskectBallManager.dispatchEventWith(BattleEventConst.SEND_EMOJI, false, id);
            if (Utils.isRuntime) {
                gmbox.battleBridge.postEmojiMessage({
                    "id": id.toString()
                });
            }
        }
        /**根据id获取表情 */
        public getEmojiById(id: number): IEmojiStruct {
            let emoji;
            this.emojiDataArr.some((f) => {
                if (f.id == id) {
                    emoji = f;
                    return true;
                }
            })
            return emoji;
        }
    }
}