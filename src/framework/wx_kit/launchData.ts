class launchData extends egret.EventDispatcher {
    public static scene: number;	  //场景值	
    public static query: any;        //启动参数	
    public static shareTicket: string;	//shareTicket
    public static referrerInfo: any;

    public constructor() {
        super();
    }

    public static setLaunchData(launchData: { scene, query, shareTicket, referrerInfo?: any }) {
        this.scene = launchData.scene;
        this.query = launchData.query;
        this.shareTicket = launchData.shareTicket;
        if (launchData.referrerInfo) {
            this.referrerInfo = launchData.referrerInfo;
        }
    }
}
