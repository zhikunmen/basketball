class LoginController extends core.Control {
    private _loginLayer: LoginLayer;
    constructor() {
        super(ModuleEnum.LOGIN);
        Facebook.init();
    }

    public getLoadGroup(data?: any): string[] {
        return [];
    }

    protected preShow(data: number): void {
    }

    protected show(data?: any): void {
        if (!this._loginLayer) {
            this._loginLayer = new LoginLayer();
        }
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).addChild(this._loginLayer);

        if (typeof gmbox != 'undefined') {
            BatterInfo.instance.init();
        }

        if (Utils.isRuntime) {
            BatterInfo.instance.init().then((data) => {
                game.BattleManager.instance.init().then(() => {
                    gmbox.loadingComplete();
                    this.startGame();
                    game.BattleManager.instance.ready();
                }).catch(() => {
                    game.BattleManager.instance.postResult(game.ResultCodeEnum.PLAYEVEN)
                })
            })
        } else {
            this.startGame();
        }

        // this.loginWx();
    }

    private startGame(): void {
        if (Utils.isRuntime) {
            GlobalManager.getInstance().goGame();
        } else {
            GlobalManager.getInstance().goLobby();
        }
    }

    private async loginWx() {
        // WxKit.login();
        // core.SocketAPI.getInstance();
        // if (GameConfig.gameType == "wx") {
        //     //登录微信
        //     await WxKit.login();
        //     wx.hideLoading();
        //     ShareManager.getInstance().getShareInfo();

        //     // 设置默认分享,需要登录后方可调用分享功能
        //     WxKit.setDefaultShare();
        //     WxKit.setOnShowRule();

        //     // AdPlayManager.getInstance().getSystemInfoSync();

        //     //离屏域
        //     //let open_data: egret.Sprite = WxKit.linkOpenData({});
        //     //this.addChild(open_data);
        // }
        // else {
        //     await WxKit.login();
        //     //链接websocket
        //    // core.SocketAPI.getInstance();
        // }
    }

    protected hide(): void {
        if (this._loginLayer && this._loginLayer.parent) {
            this._loginLayer.parent.removeChild(this._loginLayer);
            this._loginLayer = null;
        }
    }
    protected release(): void {
        super.release();
    }
}