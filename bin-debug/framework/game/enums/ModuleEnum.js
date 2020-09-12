/**界面枚举 */
var ModuleEnum;
(function (ModuleEnum) {
    ModuleEnum[ModuleEnum["NONE"] = 0] = "NONE";
    /**加载 */
    ModuleEnum[ModuleEnum["LOADING"] = 1] = "LOADING";
    /**登录 */
    ModuleEnum[ModuleEnum["LOGIN"] = 2] = "LOGIN";
    /**主界面 */
    ModuleEnum[ModuleEnum["MAINUI"] = 3] = "MAINUI";
    /**游戏 */
    ModuleEnum[ModuleEnum["GAME"] = 4] = "GAME";
    /**设置 */
    ModuleEnum[ModuleEnum["GAMESETUI"] = 5] = "GAMESETUI";
    /**ͨ通用提示 */
    ModuleEnum[ModuleEnum["COMMON"] = 6] = "COMMON";
    /**重连 */
    ModuleEnum[ModuleEnum["BREAKLINE"] = 7] = "BREAKLINE";
    /**转圈圈 */
    ModuleEnum[ModuleEnum["LINK"] = 8] = "LINK";
    /**走马灯 */
    ModuleEnum[ModuleEnum["NOTICEANIM"] = 9] = "NOTICEANIM";
    /**公告 */
    ModuleEnum[ModuleEnum["NOTICE"] = 10] = "NOTICE";
})(ModuleEnum || (ModuleEnum = {}));
