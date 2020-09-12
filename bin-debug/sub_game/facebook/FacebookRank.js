var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FacebookRank = (function () {
    function FacebookRank() {
        this.globalRank = null;
        this._globalRankList = new Array(); //全球排行榜
        this._friendRankList = new Array(); //好友排行榜
        this._oppentRankList = new Array(); //对手的排行榜
        this._emenyRankList = new Array(); //对手的排行榜
        this.myRankInGlobal = null; //自己的全球排名
        this.endlessRank = null;
        this._endless_globalRankList = new Array(); //无尽模式全球排行榜
        this._endless_friendRankList = new Array(); //无尽模式好友排行榜
        this._isRankUpdate = false;
        this._isEndlessUpdate = false;
    }
    FacebookRank.getInstance = function () {
        if (!FacebookRank._instance) {
            FacebookRank._instance = new FacebookRank();
        }
        return FacebookRank._instance;
    };
    FacebookRank.prototype.getGlobalRank = function () {
        egret.log("getGlobalRank");
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
    };
    FacebookRank.prototype.getGlobalRankList = function (count, offset) {
        if (count === void 0) { count = 30; }
        if (offset === void 0) { offset = 0; }
        if (!this.globalRank)
            return;
        this.globalRank.getEntriesAsync(count, offset).then(function (entries) {
            this._globalRankList = new Array();
            this.fullRank(entries, this._globalRankList, 1);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
        this.globalRank.getPlayerEntryAsync().then(function (entry) {
            this.myRankInGlobal = this.changeToFacebookPlayerInfoInRank(entry);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
        this.globalRank.getConnectedPlayerEntriesAsync(count, offset).then(function (entries) {
            this._friendRankList = new Array();
            this.fullRank(entries, this._friendRankList, 2);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
        this.globalRank.getEntryCountAsync().then(function (count) {
            var half = count / 2;
            var start = core.MathUtils.random(Math.max(half - 100, 0), Math.min(half + 100, count));
            egret.log(start);
            this.globalRank.getEntriesAsync(15, start).then(function (entries) {
                this._oppentRankList = new Array();
                this.fullRank(entries, this._oppentRankList, 3);
            }.bind(this)).catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
            });
            var third = count / 3;
            var s = core.MathUtils.random(Math.max(third - 100, 0), Math.min(third + 100, count));
            egret.log(s);
            this.globalRank.getEntriesAsync(4, s).then(function (entries) {
                this._emenyRankList = new Array();
                this.fullRank(entries, this._emenyRankList, 4);
            }.bind(this)).catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
            });
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
    };
    FacebookRank.prototype.getEndlessRank = function () {
        egret.log("getEndlessRank");
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
    };
    FacebookRank.prototype.getEndlessRankList = function (count, offset) {
        if (count === void 0) { count = 30; }
        if (offset === void 0) { offset = 0; }
        if (!this.endlessRank)
            return;
        this.endlessRank.getEntriesAsync(count, offset).then(function (entries) {
            this._endless_globalRankList = new Array();
            this.fullRank(entries, this._endless_globalRankList, 1);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
        this.endlessRank.getConnectedPlayerEntriesAsync(count, offset).then(function (entries) {
            this._endless_friendRankList = new Array();
            this.fullRank(entries, this._endless_friendRankList, 2);
        }.bind(this)).catch(function (err) {
            egret.error('failed : ' + err.code + " :: " + err.message);
        });
    };
    FacebookRank.prototype.changeToFacebookPlayerInfoInRank = function (enity) {
        var player = new FacebookPlayerInfoInRank();
        player.playerId = enity.getPlayer().getID();
        player.playerName = enity.getPlayer().getName();
        player.playerRank = enity.getRank();
        player.playerScore = enity.getScore();
        player.playerPicUrl = enity.getPlayer().getPhoto();
        return player;
    };
    FacebookRank.prototype.fullRank = function (entries, rank, type) {
        if (type == 2) {
            this.m_playerId = FBInstant.player.getID();
        }
        var totalCount = entries.length;
        egret.log("fullRank : " + this.m_playerId + "; totalCount : " + totalCount + "; isFriendsRank : " + type);
        var count = 0;
        for (var i = 0; i < entries.length; i++) {
            var player = this.changeToFacebookPlayerInfoInRank(entries[i]);
            if (type == 1 || type == 2) {
                rank.push(player);
            }
            else if (player.playerId != this.m_playerId) {
                rank.push(player);
            }
        }
        if (type == 2) {
            rank = rank.sort(function (a, b) {
                return a.playerRank - b.playerRank;
            });
        }
        else if (type == 3) {
            rank = rank.sort(function (a, b) {
                return b.playerRank - a.playerRank;
            });
        }
        //检测是否加载完成
        this.loadRankFinish();
    };
    FacebookRank.prototype.loadRankFinish = function () {
        GameManager.getInstance().updateRankComplete();
    };
    FacebookRank.prototype.setScoreToGloalRank = function (score, extraData) {
        if (!Facebook.isFBInit()) {
            return;
        }
        var self = this;
        FBInstant.getLeaderboardAsync(FacebookRank.RANK_NAME).then(function (leaderboard) {
            console.log(leaderboard.getName());
            leaderboard.setScoreAsync(score, extraData).then(function (enity) {
                egret.log(enity);
                self._isRankUpdate = true;
                // self.getGlobalRank();
                // self.getFriendRank();
            }.bind(this)).catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
            });
        }).then(function () { return egret.log('Score saved'); }).catch(function (error) { return console.error(error); });
    };
    FacebookRank.prototype.setScoreToEndlessRank = function (score, extraData) {
        if (!Facebook.isFBInit()) {
            return;
        }
        var self = this;
        FBInstant.getLeaderboardAsync(FacebookRank.ENDLESS_RANK_NAME).then(function (leaderboard) {
            console.log(leaderboard.getName());
            leaderboard.setScoreAsync(score, extraData).then(function (enity) {
                egret.log(enity);
                self._isEndlessUpdate = true;
                // self.getEndlessRank();
            }.bind(this)).catch(function (err) {
                egret.error('failed : ' + err.code + " :: " + err.message);
            });
        }).then(function () { return egret.log('Score saved'); }).catch(function (error) { return console.error(error); });
    };
    //检查是否更新了数据
    FacebookRank.prototype.updateRankList = function () {
        if (this._isRankUpdate) {
            this._isRankUpdate = false;
            this.getGlobalRank();
        }
        if (this._isEndlessUpdate) {
            this._isEndlessUpdate = false;
            this.getEndlessRank();
        }
    };
    FacebookRank._instance = null;
    FacebookRank.RANK_NAME = "basketball_rank"; //排行名称
    FacebookRank.ENDLESS_RANK_NAME = "test_rank"; //排行名称
    return FacebookRank;
}());
__reflect(FacebookRank.prototype, "FacebookRank");
