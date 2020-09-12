class Config {

    private static s_configs: Object;
    /**
     * 获取配置文件
     * 示例：let configs:Dictionary<HeadConfig> = Config.getConfig(HeadConfig);
     * let configs:Dictionary<HeadConfig> = Config.getConfig(HeadConfig);
     * configs.get('1').emojiID;
     */
    public static getConfig(ref: any): Dictionary<any> {
        let name: string = egret.getQualifiedClassName(ref);
        return Config.s_configs[name];
    }
}