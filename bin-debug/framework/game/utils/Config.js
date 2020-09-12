var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Config = (function () {
    function Config() {
    }
    /**
     * 获取配置文件
     * 示例：let configs:Dictionary<HeadConfig> = Config.getConfig(HeadConfig);
     * let configs:Dictionary<HeadConfig> = Config.getConfig(HeadConfig);
     * configs.get('1').emojiID;
     */
    Config.getConfig = function (ref) {
        var name = egret.getQualifiedClassName(ref);
        return Config.s_configs[name];
    };
    return Config;
}());
__reflect(Config.prototype, "Config");
