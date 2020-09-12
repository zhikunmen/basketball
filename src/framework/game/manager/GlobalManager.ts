class GlobalManager extends egret.EventDispatcher {
    private static s_instance: GlobalManager;

    public where:WhereEnum = WhereEnum.LOGIN;
    private _gameType:string;

    public constructor() {
        super();
    }

    public static getInstance(): GlobalManager {
        if (GlobalManager.s_instance == null) {
            GlobalManager.s_instance = new GlobalManager();
        }
        return GlobalManager.s_instance;
    }


    /**
     * 走大厅
     */
    public goLobby():void{
        this.hideAll();
        //清除所有弹窗
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChildren();
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_SHOW, ModuleEnum.MAINUI));
        this.where = WhereEnum.LOBBY;
    }


    /**
     * 走游戏
     */
    public goGame():void{
        this.hideAll();

        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_SHOW, ModuleEnum.GAME));
        this.where = WhereEnum.GAME;
    }

    /**
     * 走登录页面
     */
    public goLogin():void{
        this.hideAll();
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_SHOW, ModuleEnum.LOGIN));
        this.where = WhereEnum.LOGIN;
    }
    
    private hideAll():void{
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_HIDE, ModuleEnum.LOGIN));
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_HIDE, ModuleEnum.MAINUI));
        core.EventCenter.getInstance().sendEvent(new core.ModuleEventData(core.EventID.MODULE_HIDE, ModuleEnum.GAME));
    }
}