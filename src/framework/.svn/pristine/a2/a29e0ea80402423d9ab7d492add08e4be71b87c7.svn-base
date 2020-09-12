class MainLayerBase extends core.EUILayer {

	/**
	 * 游戏数据管理
	 */
	protected _gameManager:GameManager;

	public constructor() {
		super();
		GameConfig.curStage().addEventListener(egret.TouchEvent.TOUCH_TAP,this.playFirstSound,this)
		this.initViews();
	}

	protected initViews():void{

	}

	private playFirstSound():void{
		GameConfig.curStage().removeEventListener(egret.TouchEvent.TOUCH_TAP,this.playFirstSound,this)
	}
}