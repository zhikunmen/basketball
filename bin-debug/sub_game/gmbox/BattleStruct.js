var game;
(function (game) {
    /**消息类型 */
    var BattleMsgType;
    (function (BattleMsgType) {
        /**拖放 */
        BattleMsgType[BattleMsgType["DRAGDOWN"] = 0] = "DRAGDOWN";
        /**结果 */
        BattleMsgType[BattleMsgType["RESULT"] = 1] = "RESULT";
        /**表情 */
        BattleMsgType[BattleMsgType["EMOJI"] = 2] = "EMOJI";
        /**语音 */
        BattleMsgType[BattleMsgType["VOICE"] = 3] = "VOICE";
    })(BattleMsgType = game.BattleMsgType || (game.BattleMsgType = {}));
    var ResultCodeEnum;
    (function (ResultCodeEnum) {
        /**胜利 */
        ResultCodeEnum[ResultCodeEnum["WIN"] = 2] = "WIN";
        /**平局 */
        ResultCodeEnum[ResultCodeEnum["PLAYEVEN"] = 3] = "PLAYEVEN";
        /**失败 */
        ResultCodeEnum[ResultCodeEnum["LOSE"] = 4] = "LOSE";
    })(ResultCodeEnum = game.ResultCodeEnum || (game.ResultCodeEnum = {}));
})(game || (game = {}));
