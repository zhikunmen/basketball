class ReconnectView extends core.EUIComponent {
    private static s_instance: ReconnectView;

    private ReconnectMc:egret.MovieClip;
    private darkSprite:egret.Sprite;
    private label:egret.TextField;
    
	public constructor() {
		super();   
	}
    /**
     * 显示
     */
    protected onShow(event?: egret.Event): void {
        super.onShow(event);
        this.left = this.right = this.top = this.bottom = 0;
    }

    protected onHide(event?: egret.Event): void {
        super.onHide(event);

    }

    /**
     * 添加监听
     */
    protected addListener(): void {
    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
    }

    private init():void{
        this.darkSprite = new egret.Sprite();
        this.darkSprite.graphics.clear();
        this.darkSprite.graphics.beginFill(0x000000, 0.05);
        this.darkSprite.graphics.drawRect(0, 0, GameConfig.curWidth(), GameConfig.curHeight());
        this.darkSprite.graphics.endFill();
        this.darkSprite.width = GameConfig.curWidth();
        this.darkSprite.height = GameConfig.curHeight();
        this.darkSprite.touchEnabled = false;
        this.darkSprite.visible = true;
        this.addChild(this.darkSprite);
        
        const SIZE:egret.Point = new egret.Point(150,150);
        this.darkSprite = new egret.Sprite();
        this.darkSprite.graphics.clear();
        this.darkSprite.graphics.beginFill(0x000000, 0.1);
        this.darkSprite.graphics.drawRoundRect(0, 0, SIZE.x,SIZE.y,20);
        this.darkSprite.graphics.endFill();
        this.darkSprite.width = SIZE.x;
        this.darkSprite.height = SIZE.y;
        this.darkSprite.x = GameConfig.curWidth() - SIZE.x >> 1;
        this.darkSprite.y = GameConfig.curHeight() - SIZE.y >> 1;
        this.addChild(this.darkSprite);
        this.darkSprite.touchEnabled = false;
        this.darkSprite.visible = true;

        // this.ReconnectMc = core.MCFactory.instance.getMovieClip("reconnect_json","reconnect_png","reconnect");
        // this.ReconnectMc.x = GameConfig.curWidth()/2;
        // this.ReconnectMc.y = GameConfig.curHeight()/2;
        

        this.label = new egret.TextField();
        this.label.text = "网络重连中";
        this.label.size = 20;
        this.addChild(this.label);
        this.label.width = GameConfig.curWidth();
        this.label.textAlign = "center";
        this.label.y = GameConfig.curHeight()/2 + SIZE.x/4;
    }

    public popup(tip:string = ''):void{
        if(core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this)){
            return;
        }
        this.init();
        
        this.label.text = tip;
        if(tip){
            this.darkSprite.visible = true;
        }else{
            this.darkSprite.visible = false;
        }

        this.ReconnectMc.play(-1);
        this.addChild(this.ReconnectMc);
        core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this);
    }   

    public removeFromParent():void{
        this.removeChildren();
        this.parent && this.parent.removeChild(this);
    }

    public release():void{
        // core.MCFactory.instance.revertMovieClip("reconnect_json","reconnect_png",this.ReconnectMc);
        // this.ReconnectMc = null;
    }

    /**
     * 是否正在显示
     */
    public get isShow():boolean{
        return core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this);
    }

    public static getInstance(): ReconnectView {
        if (ReconnectView.s_instance == null) {
            ReconnectView.s_instance = new ReconnectView();
        }
        return ReconnectView.s_instance;
    }
}