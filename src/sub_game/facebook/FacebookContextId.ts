class FacebookContextId {
    contextId: string = null;
    contextType: string = "";
    local: string = "";
    lanCode: string = "";
    platform: string = "";
    SDKVersion: string = "";
    entryPoint: string = "";
    entryPointData: any = null;

    Init() {
        if (!Facebook.isFBInit()) {
            return;
        }

        this.contextType = FBInstant.context.getType();
        if (this.contextType == "SOLO") {
            this.contextId = FBInstant.player.getID() + "_SOLO";
        }
        else {
            this.contextId = FBInstant.context.getID();
        }
        this.local = FBInstant.getLocale();
        this.lanCode = this.local.substr(0, 2);
        this.platform = FBInstant.getPlatform();
        this.SDKVersion = FBInstant.getSDKVersion();
        this.entryPoint = FBInstant.getEntryPointAsync();
        this.entryPointData = FBInstant.getEntryPointData();
        egret.log("contextType:" + this.contextType);
        egret.log("contextId:" + this.contextId);
        egret.log("local:" + this.local);
        egret.log("lanCode:" + this.lanCode);
        egret.log("SDKVersion:" + this.SDKVersion);
        egret.log("entryPoint:" + this.entryPoint);
        egret.log("entryPointData:" + JSON.stringify(this.entryPointData));
    }

    RefreshContextInfo() {
        this.contextType = FBInstant.context.getType();
        if (this.contextType == "SOLO") {
            this.contextId = FBInstant.player.getID() + "_SOLO";
        }
        else {
            this.contextId = FBInstant.context.getID();
        }
    }
}
