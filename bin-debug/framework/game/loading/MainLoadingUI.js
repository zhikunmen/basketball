var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var MainLoadingUI = (function (_super) {
    __extends(MainLoadingUI, _super);
    function MainLoadingUI() {
        var _this = _super.call(this) || this;
        /**要加载资源的数量*/
        _this.m_pResNum = 0;
        // //资源组完成数
        _this.m_pResGroupsCompleteCount = 0;
        //资源项数
        _this.m_pResItemCount = 0;
        //资源项完成数
        _this.m_pResItemCompleteCount = 0;
        _this.skinName = 'LoadingUIExml';
        return _this;
    }
    MainLoadingUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        var newDate = new Date();
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
    };
    MainLoadingUI.prototype.setProgress = function (progress) {
        //if (!this.progress) return;
        var percent = progress.curGroupLoaded / progress.curGroupTotal;
        //this.progress.value = percent * 100;
        if (this.m_pProgressMask) {
            this.m_pProgressMask.width = percent * this.loadWidth;
        }
        // this.setGmboxProgress(percent * 100)
        // if (percent == 1) {
        //     gmbox.loadingComplete();
        // }
    };
    MainLoadingUI.prototype.show = function () {
        core.LayerCenter.getInstance().getLayer(LayerEnum.LOADING).addChild(this);
        core.LoadingManager.getLoading(PreLoadingUI).hide();
        this.updateAdaptive();
    };
    MainLoadingUI.prototype.release = function () {
    };
    MainLoadingUI.prototype.hide = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    MainLoadingUI.prototype.updateAdaptive = function () {
    };
    MainLoadingUI.prototype.setGmboxProgress = function (num) {
        if (Utils.isRuntime) {
            gmbox.setLoadingProgress({ progress: num });
        }
    };
    return MainLoadingUI;
}(core.EUIComponent));
__reflect(MainLoadingUI.prototype, "MainLoadingUI", ["core.ILoadingUI"]);
