//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class Main extends core.EUILayer {


    private startGameAsync() {
        FBInstant.startGameAsync().then(
            function () {
                var contextId = FBInstant.context.getID();
                var contextType = FBInstant.context.getType();

                var playerName = FBInstant.player.getName();
                var playerPic = FBInstant.player.getPhoto();
                var playerId = FBInstant.player.getID();

                // Once startGameAsync() resolves it also means the loading view has
                // been removed and the user can see the game viewport
                FacebookRank.getInstance().getGlobalRank();
                FacebookRank.getInstance().getEndlessRank();
                
            }).catch(function (e) {
                console.log("startgame error", e)
            });
    }

    private initializeAsync(): void {
        if (!Facebook.isFBInit()) {
            return;
        }
        FBInstant.initializeAsync().then(function () {
        })
        // setTimeout(function () {
        //     FBInstant.setLoadingProgress(100);
        // }, 1000);
        // this.initStartGameAsync();
    }

    protected createChildren(): void {

        super.createChildren();

        this.initializeAsync();

        //debug等级
        egret.Logger.logLevel = egret.Logger.ALL;

        //开启纹理跨域
        egret.ImageLoader.crossOrigin = "anonymous";

        core.Core.run(this.stage);
        core.LayerCenter.getInstance().addLayer(LayerEnum.UI, new core.EUILayer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.POPUP, new core.EUILayer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.MENU, new core.Layer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.LOADING, new core.EUILayer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.HINT, new core.Layer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.HINTSEC, new core.Layer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.TOP, new core.EUILayer());
        //Config loading process interface
        //设置加载进度界面
        core.LoadingManager.getLoading(PreLoadingUI).show();
        // initialize the Resource loading library
        //初始化Resource资源加载库

        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme(window["resourceRoot"] + "resource/default.thm.json?_gameid=2574", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        core.ResUtils.loadGroups(['preload'], this.onResourceProgress, this.onResourceLoadError, this.onResourceLoadComplete, this);


    }

    private async loadSubgameConfig() {
        const result = await RES.getResAsync("description_json");
        GameConfig.injectConfig(result);
    }

    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        // this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    private isGoGame: boolean = false;

    private createScene() {
        // this.loadSubgameConfig();
        let self = this;
        let goGame = egret.setTimeout(() => {
            egret.clearTimeout(goGame);
            if (self.isGoGame) {
                return;
            }
            self.isGoGame = true;
            core.LoadingManager.setCurLoading(MainLoadingUI);
            self.initController();
            GlobalManager.getInstance().goLogin();
        }, this, 1500);
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.isGoGame = true;
            core.LoadingManager.setCurLoading(MainLoadingUI);
            this.initController();
            GlobalManager.getInstance().goLogin();
        }
    }

    /**
     * 资源组加载进度
     */
    private onResourceProgress(data: core.GroupData): void {
        if (Facebook.isFBInit()) {
            let progress = (data.curGroupLoaded / data.curGroupTotal) * 100;
            FBInstant.setLoadingProgress(progress);
        }
        core.LoadingManager.getLoading(PreLoadingUI).setProgress(data);
    }
    /**
     * 资源组加载出错
     * 
     * 
     * Resource group loading failed
     */
    private onResourceLoadError(data: core.GroupData): void {
        //TODO
        egret.log("Group:" + data.curGroup + " has failed to load");
    }
    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(data: core.GroupData): void {
        if (data.curGroup == 'preload') {
            // core.LoadingManager.getLoading(PreLoadingUI).hide();
            if (Facebook.isFBInit()) {
                this.startGameAsync();
            }
            this.isResourceLoadEnd = true;
            this.createScene();
            LanguageManager.instance.initTable();
        }
    }
    /**
     * 初始化控制器
     */
    private initController(): void {
        // var i = 30;
        // window["showProgress"](i);
        // var proSet = setInterval(function () {
        //     i++;
        //     window["showProgress"](i);
        //     if (i >= 100) {
        //         i = 100;
        //         clearInterval(proSet);
        //         window["removeLogo"]();
        //     }
        // }, 5);
        new LoginController();
        new LobbyController();
        new GameController();
    }
}
declare var dat;

