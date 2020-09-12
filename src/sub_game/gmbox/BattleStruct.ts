module game {
	/**消息结构 */
	export interface IBattleMsg {
		/**类型 */
		type: BattleMsgType;
		/**数据 */
		data: any;
	}

	/**消息类型 */
	export enum BattleMsgType {
		/**拖放 */
		DRAGDOWN,
		/**结果 */
		RESULT,
		/**表情 */
		EMOJI,
		/**语音 */
		VOICE,

	}

	// /**下棋的结构 */
	// export interface IDragStruct {
	// 	/**下的位置 */
	// 	index: number;
	// 	/**是否旋转 */
	// 	rotation: boolean;
	// 	/**下一个棋子的数据 */
	// 	nextDrag: IDragGrid;
	// 	/**时间戳 */
	// 	timeStamp: number;
	// 	/**first */
	// 	first: boolean
	// }

	/**声音修改 */
	export interface IVoiceStruct {
		/**玩家id */
		userId: string,
		/**状态 0/1 关 开 */
		status: number;
	}
	/**表情 */
	export interface IEmojiStruct {
		url: string,
		id: number
	}

	export enum ResultCodeEnum {
		/**胜利 */
		WIN = 2,
		/**平局 */
		PLAYEVEN = 3,
		/**失败 */
		LOSE = 4,
	}
}