class LobbyController extends core.Control {
    private lobbyLayer: LobbyLayer;
    constructor() {
        super(ModuleEnum.MAINUI);
    }

    public getLoadGroup(data?: any): string[] {
        return ["delay"];
    }

    protected preShow(data: number): void {

    }

    protected show(data?: any): void {
        GameManager.getInstance().rebornCount = 1; //回大厅复活次数复位
        if (!this.lobbyLayer) {
          
            this.lobbyLayer = new LobbyLayer();
        }
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).addChild(this.lobbyLayer);

        // //加载房间素材
        // if (!RES.isGroupLoaded("loading")) {
        //     core.ResUtils.loadGroups(["loading"], (progress) => {

        //     }, (fail) => {

        //     }, (loadComplete) => {

        //     }, self);
        // }

    }

    protected hide(): void {
        if (this.lobbyLayer && this.lobbyLayer.parent) {
            this.lobbyLayer.parent.removeChild(this.lobbyLayer);
            this.lobbyLayer = null;
        }
    }
    protected release(): void {
        super.release();
    }

}