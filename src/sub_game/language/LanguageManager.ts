class LanguageManager {
	private static _ins: LanguageManager;
	public static get instance(): LanguageManager {
		if (!this._ins) {
			this._ins = new LanguageManager;
		}
		return this._ins;
	}
	/**语言 */
	private _languageTable: Array<table.TableLanguage>

	public initTable() {
		this._languageTable = RES.getRes("Language_json");
	}

	/**
	 * 根据英文获取其他地区语言
	 */
	public getLangeuage(id: number) {
		if (id <= 0) {
			return;
		}
		let lang = this._languageTable[id - 1];
		if (lang.id != id) {
			this._languageTable.some((f) => {
				if (f.id == id) {
					lang = f;
					return true;
				}
			})
		}
		if (lang[GameConfig.languageType]) {
			return lang[GameConfig.languageType].trim();
		}
	}
}
