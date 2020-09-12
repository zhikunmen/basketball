class PreLoadingUI extends core.Component implements core.ILoadingUI {

    private bg: egret.Sprite;

    public constructor() {
        super();
        this.createView();
    }

    private textField: egret.TextField;

    private createView(): void {
        // this.bg = new egret.Sprite();
        // this.bg.graphics.clear();
        // // this.bg.graphics.beginFill(0x2abab0, 1);
        // this.bg.graphics.beginFill(0x0A141E, 1);
        // this.bg.graphics.drawRect(0, 0, GameConfig.curWidth(), GameConfig.curHeight());
        // this.bg.graphics.endFill();
        // this.bg.width = GameConfig.curWidth();
        // this.bg.height = GameConfig.curHeight();
        // this.addChild(this.bg);


        // let bmp: egret.Bitmap = new egret.Bitmap();
        // bmp.width = 720;
        // bmp.height = 1280;
        // this.addChild(bmp);
        // bmp.x = (GameConfig.curWidth() - 720) / 2;
        // bmp.y = (GameConfig.curHeight() - 1280) / 2;
       
        // let logo:eui.Image = new eui.Image();
        // this.addChild(logo);
        // logo.x = GameConfig.curWidth() - 313 >>1;
        // logo.y = (GameConfig.curHeight() - 342) /2 -100;
       
        // Utils.getTexture(window["game_config"].logoBase64,(texture)=>{
        //     logo.texture = texture;
        // });
    }

    public setProgress(data: core.GroupData): void {
        //this.textField.text = `Loading...${data.loaded}/${data.total}`;
    }

    public show(): void {
        core.LayerCenter.getInstance().getLayer(LayerEnum.LOADING).addChild(this);
    }

    public hide(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public release(): void {
    }

}
