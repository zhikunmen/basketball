class FacebookRank {

    private static _instance = null;
    private static RANK_NAME: string = "basketball_rank";//排行名称
    globalRank: FBInstant.Leaderboard = null;
    _globalRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//全球排行榜
    _friendRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//好友排行榜
    _oppentRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//对手的排行榜
    _emenyRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//对手的排行榜
    myRankInGlobal: FacebookPlayerInfoInRank = null;//自己的全球排名
    m_playerId: string;

    private static ENDLESS_RANK_NAME: string = "test_rank";//排行名称
    endlessRank: FBInstant.Leaderboard = null;
    _endless_globalRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//无尽模式全球排行榜
    _endless_friendRankList: Array<FacebookPlayerInfoInRank> = new Array<FacebookPlayerInfoInRank>();//无尽模式好友排行榜

    public static getInstance(): FacebookRank {
        if (!FacebookRank._instance) {
            FacebookRank._instance = new FacebookRank();
        }
        return FacebookRank._instance;
    }


    public getGlobalRank() {
        egret.log("getGlobalRank")
        var firstTime = false;
        if (!Facebook.IsApiSupport("getLeaderboardAsync")) {
            return;
        }

        FBInstant.getLeaderboardAsync(FacebookRank.RANK_NAME).then(function (leaderboard) {
            this.globalRank = leaderboard;
            return leaderboard.getPlayerEntryAsync();
        }.bind(this)).then(function (entry) {
            if (entry == null && this.globalRank) {
                egret.warn("no data in", this.globalRank);
                firstTime = true;
                return this.globalRank.setScoreAsync(0, "");
            }
            else {
                firstTime = false;
                this.getGlobalRankList();
            }
        }.bind(this)).then(function () {
            if (firstTime == false) {
                return;
            }
            this.getGlobalRankList();
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });

    }

    private getGlobalRankList(count: number = 30, offset = 0) {
        if (!this.globalRank) return;
        this.globalRank.getEntriesAsync(count, offset).then(function (entries) {
            this._globalRankList = new Array<FacebookPlayerInfoInRank>();
            this.fullRank(entries, this._globalRankList, 1);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });

        this.globalRank.getPlayerEntryAsync().then(function (entry: FBInstant.LeaderboardEntry) {
            this.myRankInGlobal = this.changeToFacebookPlayerInfoInRank(entry);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
        this.globalRank.getConnectedPlayerEntriesAsync(count, offset).then(function (entries) {
            this._friendRankList = new Array<FacebookPlayerInfoInRank>();
            this.fullRank(entries, this._friendRankList, 2);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
        this.globalRank.getEntryCountAsync().then(function (count) {
            let half = count / 2;
            let start = core.MathUtils.random(Math.max(half - 100, 0), Math.min(half + 100, count));
            egret.log(start);
            this.globalRank.getEntriesAsync(15, start).then(function (entries) {
                this._oppentRankList = new Array<FacebookPlayerInfoInRank>();
                this.fullRank(entries, this._oppentRankList, 3);
            }.bind(this)).catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
            });
            let third = count / 3;
            let s = core.MathUtils.random(Math.max(third - 100, 0), Math.min(third + 100, count));
            egret.log(s);
            this.globalRank.getEntriesAsync(4, s).then(function (entries) {
                this._emenyRankList = new Array<FacebookPlayerInfoInRank>();
                this.fullRank(entries, this._emenyRankList, 4);
            }.bind(this)).catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
            });
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
    }

    public getEndlessRank() {
        egret.log("getEndlessRank")
        var firstTime = false;
        if (!Facebook.IsApiSupport("getLeaderboardAsync")) {
            return;
        }

        FBInstant.getLeaderboardAsync(FacebookRank.ENDLESS_RANK_NAME).then(function (leaderboard) {
            this.endlessRank = leaderboard;
            return leaderboard.getPlayerEntryAsync();
        }.bind(this)).then(function (entry) {
            if (entry == null && this.endlessRank) {
                egret.warn("no data in", this.endlessRank);
                firstTime = true;
                return this.endlessRank.setScoreAsync(0, "");
            }
            else {
                firstTime = false;
                this.getEndlessRankList();
            }
        }.bind(this)).then(function () {
            if (firstTime == false) {
                return;
            }
            this.getEndlessRankList();
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });

    }

    private getEndlessRankList(count: number = 30, offset = 0) {
        if (!this.endlessRank) return;
        this.endlessRank.getEntriesAsync(count, offset).then(function (entries) {
            this._endless_globalRankList = new Array<FacebookPlayerInfoInRank>();
            this.fullRank(entries, this._endless_globalRankList, 1);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });

        this.endlessRank.getConnectedPlayerEntriesAsync(count, offset).then(function (entries) {
            this._endless_friendRankList = new Array<FacebookPlayerInfoInRank>();
            this.fullRank(entries, this._endless_friendRankList, 2);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
    }

    private changeToFacebookPlayerInfoInRank(enity: FBInstant.LeaderboardEntry) {
        let player: FacebookPlayerInfoInRank = new FacebookPlayerInfoInRank();
        player.playerId = enity.getPlayer().getID();
        player.playerName = enity.getPlayer().getName();
        player.playerRank = enity.getRank();
        player.playerScore = enity.getScore();
        player.playerPicUrl = enity.getPlayer().getPhoto();
        return player;
    }

    private fullRank(entries: Array<FBInstant.LeaderboardEntry>, rank: Array<FacebookPlayerInfoInRank>, type: number) {
        if (type == 2) {
            this.m_playerId = FBInstant.player.getID();
        }
        let totalCount = entries.length;
        egret.log("fullRank : " + this.m_playerId + "; totalCount : " + totalCount + "; isFriendsRank : " + type);
        let count: number = 0;
        for (let i = 0; i < entries.length; i++) {
            let player = this.changeToFacebookPlayerInfoInRank(entries[i]);
            if (type == 1 || type == 2) {
                rank.push(player);
            } else if (player.playerId != this.m_playerId) {
                rank.push(player);
            }
        }
        if (type == 2) {
            rank = rank.sort((a, b) => {
                return a.playerRank - b.playerRank
            })
        } else if (type == 3) {
            rank = rank.sort((a, b) => {
                return b.playerRank - a.playerRank
            })
        }
        //检测是否加载完成
        this.loadRankFinish();
    }

    loadRankFinish() {
        GameManager.getInstance().updateRankComplete();
    }

    _isRankUpdate: boolean = false;
    public setScoreToGloalRank(score: number, extraData?: string) {
        if (!Facebook.isFBInit()) {
            return;
        }

        let self = this;
        FBInstant.getLeaderboardAsync(FacebookRank.RANK_NAME).then(function (leaderboard) {
            console.log(leaderboard.getName());
            leaderboard.setScoreAsync(score, extraData).then(function (enity) {
                egret.log(enity)
                self._isRankUpdate = true;
                // self.getGlobalRank();
                // self.getFriendRank();
            }.bind(this)).catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
            });

        }).then(() => egret.log('Score saved')).catch(error => console.error(error));
    }

    _isEndlessUpdate: boolean = false;
    public setScoreToEndlessRank(score: number, extraData?: string) {
        if (!Facebook.isFBInit()) {
            return;
        }

        let self = this;
        FBInstant.getLeaderboardAsync(FacebookRank.ENDLESS_RANK_NAME).then(function (leaderboard) {
            console.log(leaderboard.getName());
            leaderboard.setScoreAsync(score, extraData).then(function (enity) {
                egret.log(enity)
                self._isEndlessUpdate = true;
                // self.getEndlessRank();
            }.bind(this)).catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
            });
        }).then(() => egret.log('Score saved')).catch(error => console.error(error));

    }

    //检查是否更新了数据
    public updateRankList() {
        if (this._isRankUpdate) {
            this._isRankUpdate = false;
            this.getGlobalRank();
        }
        if (this._isEndlessUpdate) {
            this._isEndlessUpdate = false;
            this.getEndlessRank();
        }
    }

}
