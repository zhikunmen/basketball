var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GmBoxPlatform = (function () {
    function GmBoxPlatform() {
    }
    GmBoxPlatform.prototype.init = function () {
    };
    GmBoxPlatform.prototype.share = function (options, successCallback, failedCallback) {
    };
    GmBoxPlatform.prototype.showAd = function () {
    };
    GmBoxPlatform.prototype.getLeaderboard = function () {
    };
    GmBoxPlatform.prototype.setScoreAsync = function (score, extraData) {
    };
    GmBoxPlatform.prototype.getSelfRank = function () {
        return null;
    };
    GmBoxPlatform.prototype.getTargetOpponentsRank = function (index, score) {
        return null;
    };
    GmBoxPlatform.prototype.getOpponentsPassMeRank = function (index, score) {
        return null;
    };
    GmBoxPlatform.prototype.saveData = function (data, successCallback, failedCallback) {
    };
    GmBoxPlatform.prototype.getData = function (keys, successCallback, failedCallback) {
    };
    return GmBoxPlatform;
}());
__reflect(GmBoxPlatform.prototype, "GmBoxPlatform", ["platform.IPlatform"]);
