/**网络状态 */
var NetStateEnum;
(function (NetStateEnum) {
    NetStateEnum[NetStateEnum["conneting"] = 0] = "conneting";
    NetStateEnum[NetStateEnum["close"] = 1] = "close";
    NetStateEnum[NetStateEnum["authing"] = 2] = "authing";
    NetStateEnum[NetStateEnum["connected"] = 3] = "connected";
})(NetStateEnum || (NetStateEnum = {}));
