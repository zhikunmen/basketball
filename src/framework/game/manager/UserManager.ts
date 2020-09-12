class UserManager extends egret.EventDispatcher {
    public static USER_DATA_CHANGE: string = "user_data_change";

    private openId: string;
    private uid: string;
    private avatar_url: string;
    private nickname: string;
    private gender: string;
    private userInfo: {};
    private _maxScore: number = 0;

    private static s_instance: UserManager;
    public constructor() {
        super();
        if (GameConfig.gameType == "") {
            this.uid = GameConfig.testUid;
            this.avatar_url = "";
            this.nickname = "test" + GameConfig.testUid;
            this.gender = "M";
            this.openId = "test123456openId";
            this.userInfo = {
                uid: this.uid,
                gender: this.gender,
                nickname: this.nickname,
                openId: this.openId,
                avatar_url: this.avatar_url
            }
        }
    }

    public static getInstance(): UserManager {
        if (UserManager.s_instance == null) {
            UserManager.s_instance = new UserManager();
        }
        return UserManager.s_instance;
    }

    public getNickname() {
        return this.nickname;
    }

    public getOpenId() {
        return this.openId;
    }

    public getUid() {
        return this.uid;
    }

    public getUserData() {
        return JSON.parse(JSON.stringify(this.userInfo));
    }

    //最大分数
    public set maxScore(s: number) {
        this._maxScore = s;
    }
    public get maxScore(): number {
        return this._maxScore;
    }


    //登录用
    public time: string;
    public token: string;

    public setUserData(userData: { userId, wxOpenId, iconUrl, nickName, gender, time, token, thirdUid }) {
        this.avatar_url = userData.iconUrl;
        this.openId = userData.wxOpenId;
        this.nickname = userData.nickName;
        this.gender = userData.gender;
        this.uid = userData.userId;
        this.time = userData.time;
        this.token = userData.token;

        if (userData.thirdUid) {
            this.openId = userData.thirdUid;
        }

        this.userInfo = {
            uid: this.uid,
            gender: this.gender,
            nickname: this.nickname,
            openId: this.openId,
            avatar_url: this.avatar_url
        }
        this.dispatchEventWith(UserManager.USER_DATA_CHANGE);
    }
}
