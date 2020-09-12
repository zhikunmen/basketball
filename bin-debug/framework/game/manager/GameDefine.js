var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameDefine = (function () {
    function GameDefine() {
    }
    GameDefine.RANKBASEVIEW = "RankBaseView";
    GameDefine.GAMEOVERBASEVIEW = "GameoverBaseView";
    GameDefine.REBORNBASEVIEW = "RebornBaseView";
    GameDefine.LOBBYVIEW = "LobbyView";
    GameDefine.MAINVIEW = "MainView";
    return GameDefine;
}());
__reflect(GameDefine.prototype, "GameDefine");
