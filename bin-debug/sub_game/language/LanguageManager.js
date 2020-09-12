var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LanguageManager = (function () {
    function LanguageManager() {
    }
    Object.defineProperty(LanguageManager, "instance", {
        get: function () {
            if (!this._ins) {
                this._ins = new LanguageManager;
            }
            return this._ins;
        },
        enumerable: true,
        configurable: true
    });
    LanguageManager.prototype.initTable = function () {
        this._languageTable = RES.getRes("Language_json");
    };
    /**
     * 根据英文获取其他地区语言
     */
    LanguageManager.prototype.getLangeuage = function (id) {
        if (id <= 0) {
            return;
        }
        var lang = this._languageTable[id - 1];
        if (lang.id != id) {
            this._languageTable.some(function (f) {
                if (f.id == id) {
                    lang = f;
                    return true;
                }
            });
        }
        if (lang[GameConfig.languageType]) {
            return lang[GameConfig.languageType].trim();
        }
    };
    return LanguageManager;
}());
__reflect(LanguageManager.prototype, "LanguageManager");
