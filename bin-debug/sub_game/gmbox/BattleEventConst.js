var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BattleEventConst = (function () {
    function BattleEventConst() {
    }
    /**游戏开始 */
    BattleEventConst.GAME_START = "game_start";
    /**收到消息 */
    BattleEventConst.RECV_MESSAGE = "recv_message";
    /**语音变化 */
    BattleEventConst.VOICE_CHANGE = "voice_change";
    /**表情 */
    BattleEventConst.RECV_EMOJI = "recv_emoji";
    /**我发表情 */
    BattleEventConst.SEND_EMOJI = "send_emoji";
    /**对手分数 */
    BattleEventConst.UPDATE_OTHER_SCORE = "update_other_score";
    return BattleEventConst;
}());
__reflect(BattleEventConst.prototype, "BattleEventConst");
