/**
* alert类
* 提示相关信息
*/
class AlertPanel extends DialogBaseView {
    public m_desc:eui.Label;
    public m_resolve:eui.Button;
    public m_reject:eui.Button;
;

    private _descStr:string = "";
    private _type:number;
    private _resolve:Function;
    private _reject:Function;
    private _thisObject:Object;

    /**
    * descStr        描述
    */
    public constructor(descStr:string = "",type:number,resolve:Function,reject:Function,thisObject:Object){
        super();
        this._descStr = descStr;
        this._type = type;
        this._resolve = resolve;
        this._reject = reject;
        this._thisObject = thisObject;
        this.skinName = "";
        this.m_desc.textFlow = (new egret.HtmlTextParser).parser(this._descStr);
    }
 	/**
	 * 显示
	 */
	protected onShow(event?: egret.Event): void {
		super.onShow();
        this.left = this.right = this.top = this.bottom = 0;
        if(this._type == 1){
            this.m_reject.visible = false;
            this.m_resolve.horizontalCenter = 0;
        }
	}

	/**
     * 添加监听
     */
    protected addListener():void {
		super.addListener();

        this.m_resolve.addEventListener(egret.TouchEvent.TOUCH_TAP,this.resolveHander,this);
        this.m_reject.addEventListener(egret.TouchEvent.TOUCH_TAP,this.rejectHandler,this);
    }

    private resolveHander(evt:egret.Event):void{
        this.removeFromParent(0);
        this._resolve.apply(this._thisObject)
    }
    private rejectHandler(evt:egret.Event):void{
        this.removeFromParent(0);
        this._reject.apply(this._thisObject)
    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
		super.removeListener();
    }

    public release(): void{
        this.removeChildren();
    }
}

