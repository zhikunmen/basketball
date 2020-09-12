var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FacebookContextId = (function () {
    function FacebookContextId() {
        this.contextId = null;
        this.contextType = "";
        this.local = "";
        this.lanCode = "";
        this.platform = "";
        this.SDKVersion = "";
        this.entryPoint = "";
        this.entryPointData = null;
    }
    FacebookContextId.prototype.Init = function () {
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
    };
    FacebookContextId.prototype.RefreshContextInfo = function () {
        this.contextType = FBInstant.context.getType();
        if (this.contextType == "SOLO") {
            this.contextId = FBInstant.player.getID() + "_SOLO";
        }
        else {
            this.contextId = FBInstant.context.getID();
        }
    };
    return FacebookContextId;
}());
__reflect(FacebookContextId.prototype, "FacebookContextId");
