class MainLoadingUI extends core.EUIComponent implements core.ILoadingUI {
    /**主组 */
    public m_pMainGroup: eui.Group;
    /**要加载资源的数量*/
    public m_pResNum: number = 0;
    /**要加载的资源百分比文本*/
    public m_pLoginLbl: eui.Label;
    /**进度条组 */
    public m_pProgressGroup: eui.Group;
    /**进度条显示 */
    public m_pProgressImg: eui.Image;
    // /**进度条遮罩 */
    public m_pProgressMask: eui.Image;
    // //资源组完成数
    public m_pResGroupsCompleteCount: number = 0;
    //资源项数
    public m_pResItemCount: number = 0;
    //资源项完成数
    public m_pResItemCompleteCount: number = 0;
    /**logo */
    public m_pLogoImg: eui.Image;

    private loadWidth: number;

    private progress: eui.ProgressBar;

    private bg: egret.Sprite;
    public constructor() {
        super();
        this.skinName = 'LoadingUIExml';
    }
    protected childrenCreated(): void {
        super.childrenCreated();

        let newDate = new Date();
        console.log("请求ssssssssssssssssssssssss======== ", newDate);
        EventUtils.logEvent("launch_loadingUI");

        this.left = this.right = this.top = this.bottom = 0;

        if (this.m_pProgressImg) {
            this.loadWidth = this.m_pProgressMask.width;
            this.m_pProgressImg.mask = this.m_pProgressMask;
            this.m_pProgressMask.width = 0;
            // this.m_pStateLbl.text = "首次进游戏需加载更多资源，疯狂载入中...";
            // this.setGmboxProgress(0)
        }

        // let logo: eui.Image = new eui.Image();
        // this.addChild(logo);
        // logo.x = GameConfig.curWidth() - 547 >> 1;
        // logo.y = GameConfig.curHeight() - 259 >> 1;

    }

    public setProgress(progress: core.GroupData): void {
        //if (!this.progress) return;
        let percent: number = progress.curGroupLoaded / progress.curGroupTotal;

        //this.progress.value = percent * 100;
        if (this.m_pProgressMask) {
            this.m_pProgressMask.width = percent * this.loadWidth;
        }
        // this.setGmboxProgress(percent * 100)

        // if (percent == 1) {
        //     gmbox.loadingComplete();
        // }

    }

    public show(): void {
        core.LayerCenter.getInstance().getLayer(LayerEnum.LOADING).addChild(this);
        core.LoadingManager.getLoading(PreLoadingUI).hide();
        this.updateAdaptive();
    }
    public release() {
    }

    public hide(): void {

        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
    public updateAdaptive(): void {

    }

    private setGmboxProgress(num: number): void {
        if (Utils.isRuntime) {
            gmbox.setLoadingProgress({ progress: num });
        }
    }
}
