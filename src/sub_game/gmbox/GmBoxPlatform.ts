class GmBoxPlatform implements platform.IPlatform {

    init(): void {
    }
    share(options?: Object, successCallback?: Function, failedCallback?: Function) {
    }
    showAd(): void {
    }
    getLeaderboard(): void {
    }
    setScoreAsync(score: number, extraData?: string): void {
    }
    public getSelfRank(): FacebookPlayerInfoInRank {
        return null;
    }
    public getTargetOpponentsRank(index: number, score: number): Array<FacebookPlayerInfoInRank> {
        return null;
    }

    public getOpponentsPassMeRank(index: number, score: number): FacebookPlayerInfoInRank {
        return null;
    }
    public saveData(data: Object, successCallback?: Function, failedCallback?: Function) {
    }
    public getData(keys: Array<string>, successCallback?: Function, failedCallback?: Function) {
    }

}