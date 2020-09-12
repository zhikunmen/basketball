class LobbyLayer extends core.EUILayer {
    private _lobbyView:LobbyView;
    public constructor() {
        super();
        this.init();
    }
    private init():void{
        this._lobbyView = new LobbyView();
        this.addChild(this._lobbyView);
    }
    public release():void{
		super.release();
		this._lobbyView = null;
    }
}