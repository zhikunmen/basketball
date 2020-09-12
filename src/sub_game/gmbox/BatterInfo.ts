
/**数据管理 */
class BatterInfo extends egret.EventDispatcher {
    constructor() {
        super();
    }

    private static _instance: BatterInfo;
    /**用户资料 */
    public myUserInfo: gmbox.IUserInfo;
    /**对手资料 */
    private _otherUserInfo: gmbox.IBattlePlayer;
    /**是否是机器人 */
    public isRobot: boolean = true;
    /**结果延时 倒计时时间到了后等待对方两秒钟操作时间，如果对方没有操作 本人主动发胜利消息 */
    public resultTimeout: number;
    public _mikeStatus: Map<string, number> = new Map();

    public static get instance(): BatterInfo {
        if (!this._instance) {
            this._instance = new BatterInfo();
        }
        return this._instance;
    }

    public init(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.myUserInfo) {
                resolve();
            } else {
                gmbox.login({
                    loginOpts: {
                        "appId": "10115674281540328553"
                    },
                    success: (info: gmbox.IUserInfo) => {
                        this.myUserInfo = info;
                        egret.error(info);
                        resolve();
                    }
                })
            }
        })
    }

    /**对手数据 */
    public set otherUserInfo(value: gmbox.IBattlePlayer) {
        if (value.type == 1) {
            this.isRobot = true;
        }
        this._otherUserInfo = value;
    }

    public get otherUserInfo(): gmbox.IBattlePlayer {
        return this._otherUserInfo;
    }

    public setMikeStatus(res) {
        let userId = res.userId;
        let status = res.status;
        this._mikeStatus.set(userId, status);
    }





}