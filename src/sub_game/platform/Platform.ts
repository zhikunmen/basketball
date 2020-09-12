/**
 * author wujiaohai
 */
module platform {

    export interface IPlatform {
        init():void;//初始化
        share(options?: Object, successCallback?: Function, failedCallback?: Function): void;//分享
        showAd(): void;//显示广告
        getLeaderboard():void;//获取排行榜
        setScoreAsync(score: number, extraData?: string):void;//设置用户排行榜分数
        getSelfRank(): FacebookPlayerInfoInRank;//获取自己的排行榜
        getTargetOpponentsRank(index: number, score: number):Array<FacebookPlayerInfoInRank>;//获取我即将超越的对手的排行榜
        getOpponentsPassMeRank(index: number, score: number):FacebookPlayerInfoInRank;//获取对手超越我的排行榜
        saveData(data: Object, successCallback?: Function, failedCallback?: Function);//保存数据
        getData(keys: Array<string>, successCallback?: Function, failedCallback?: Function);//获取数据
    }

}
