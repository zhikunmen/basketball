class GameControllerBase extends core.Control {
    protected m_gameManager: GameManager;
    
    private m_pMainLayer: MainLayer;
    
    constructor(moduleName: number) {
        super(moduleName);
        this.m_gameManager = GameManager.getInstance();
    }

    public getLoadGroup(data?: any): string[] {
        // return ["delay"];
        return [];
    }

    protected preShow(data: number): void {
    }

    protected show(data?: any): void {
        core.EventCenter.getInstance().addEventListener(core.EventID.SOCKET_CONNECT, this.sockectConnectHandler, this);
        core.EventCenter.getInstance().addEventListener(core.EventID.SOCKET_DATA, this.roomSockectDataHandler, this);

        if (!this.m_pMainLayer) {
            let mainLayer: MainLayer = new MainLayer();
            this.m_pMainLayer = mainLayer;
        }
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).addChild(this.m_pMainLayer);
    }

    public hide(): void {
        core.EventCenter.getInstance().removeEventListener(core.EventID.SOCKET_CONNECT, this.sockectConnectHandler, this);
        core.EventCenter.getInstance().removeEventListener(core.EventID.SOCKET_DATA, this.roomSockectDataHandler, this);

        if (this.m_pMainLayer && this.m_pMainLayer.parent) {
            this.m_pMainLayer.release();
            this.m_pMainLayer.parent.removeChild(this.m_pMainLayer);
            this.m_pMainLayer = null;
        } 
    }
    protected release(): void {
    }


    /**
     * 连接成功
     */
    private sockectConnectHandler(data: any): void {
    }

    /**
     * 收到socket数据
     */
    private roomSockectDataHandler(ed: any): void {
        
    }

}