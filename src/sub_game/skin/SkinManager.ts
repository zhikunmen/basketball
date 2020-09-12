class SkinManager {

	//单例类
	private static _instance: SkinManager;
	public static getInstance(): SkinManager {
		if (SkinManager._instance == null) {
			SkinManager._instance = new SkinManager();
		}
		return SkinManager._instance;
	}
	//单例类结束

	public constructor() {
		this.addListener();
	}

	public addListener(): void {
		core.EventCenter.getInstance().addEventListener('event' + 2007, this.getGoldInfo, this);
		core.EventCenter.getInstance().addEventListener('event' + 2008, this.getBuyInfo, this);
		core.EventCenter.getInstance().addEventListener('event' + 2009, this.getCurSkin, this);
	}


	public getGoldInfo(data: any) {
		console.log(data);
		let coinsNumber = data.messageData.data.gold;
		GameManager.getInstance().baskectBallManager.coinsNumber = coinsNumber
		GameManager.getInstance().refreshGold(coinsNumber);
	}

	public getBuyInfo(data: any) {
		
	}
	public getCurSkin(data: any) {
		GameManager.getInstance().baskectBallManager.use = data.messageData.data.use;
	}

	public payGold() {
		let json = {
			"skinId": ChangeSkinView.getInstance().buySkinId
		}
		console.log("买到的皮肤",ChangeSkinView.getInstance().buySkinId)
	}

	public getGold(goldNum) {
		let json = {
			"gold": goldNum
		}
	}
}