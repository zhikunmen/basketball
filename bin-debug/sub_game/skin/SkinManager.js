var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SkinManager = (function () {
    //单例类结束
    function SkinManager() {
        this.addListener();
    }
    SkinManager.getInstance = function () {
        if (SkinManager._instance == null) {
            SkinManager._instance = new SkinManager();
        }
        return SkinManager._instance;
    };
    SkinManager.prototype.addListener = function () {
        core.EventCenter.getInstance().addEventListener('event' + 2007, this.getGoldInfo, this);
        core.EventCenter.getInstance().addEventListener('event' + 2008, this.getBuyInfo, this);
        core.EventCenter.getInstance().addEventListener('event' + 2009, this.getCurSkin, this);
    };
    SkinManager.prototype.getGoldInfo = function (data) {
        console.log(data);
        var coinsNumber = data.messageData.data.gold;
        GameManager.getInstance().baskectBallManager.coinsNumber = coinsNumber;
        GameManager.getInstance().refreshGold(coinsNumber);
    };
    SkinManager.prototype.getBuyInfo = function (data) {
    };
    SkinManager.prototype.getCurSkin = function (data) {
        GameManager.getInstance().baskectBallManager.use = data.messageData.data.use;
    };
    SkinManager.prototype.payGold = function () {
        var json = {
            "skinId": ChangeSkinView.getInstance().buySkinId
        };
        console.log("买到的皮肤", ChangeSkinView.getInstance().buySkinId);
    };
    SkinManager.prototype.getGold = function (goldNum) {
        var json = {
            "gold": goldNum
        };
    };
    return SkinManager;
}());
__reflect(SkinManager.prototype, "SkinManager");
