var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-05-25
 * Desc   ： 配置文件
 ********************************/
var HDGGame;
(function (HDGGame) {
    var Config = (function () {
        function Config() {
            /**
             * 配置由excel导出，请不要随便修改
             */
            this.scoreRateJson = [
                { index: 1, minTimes: 0, maxTimes: 5, rate: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { index: 2, minTimes: 6, maxTimes: 10, rate: [0.4, 0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { index: 3, minTimes: 11, maxTimes: 15, rate: [0.25, 0.6, 0.15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { index: 4, minTimes: 16, maxTimes: 20, rate: [0.25, 0.25, 0.35, 0.15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { index: 5, minTimes: 21, maxTimes: 25, rate: [0.15, 0.2, 0.35, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { index: 6, minTimes: 26, maxTimes: 30, rate: [0.1, 0.1, 0.25, 0.3, 0.15, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { index: 7, minTimes: 31, maxTimes: 35, rate: [0.05, 0.1, 0.15, 0.2, 0.2, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { index: 8, minTimes: 36, maxTimes: 40, rate: [0.05, 0.05, 0.1, 0.1, 0.2, 0.2, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0, 0] },
                { index: 9, minTimes: 41, maxTimes: 45, rate: [0.05, 0.05, 0.05, 0.05, 0.15, 0.15, 0.2, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0] },
                { index: 10, minTimes: 46, maxTimes: 50, rate: [0, 0.05, 0.05, 0.05, 0.15, 0.15, 0.15, 0.15, 0.15, 0.1, 0, 0, 0, 0, 0, 0] },
                { index: 11, minTimes: 51, maxTimes: 55, rate: [0, 0, 0.05, 0.05, 0.05, 0.15, 0.15, 0.15, 0.15, 0.15, 0.1, 0, 0, 0, 0, 0] },
                { index: 12, minTimes: 56, maxTimes: 60, rate: [0, 0, 0, 0.05, 0.05, 0.05, 0.15, 0.15, 0.15, 0.15, 0.15, 0.1, 0, 0, 0, 0] },
                { index: 13, minTimes: 61, maxTimes: 65, rate: [0, 0, 0, 0, 0.05, 0.05, 0.1, 0.1, 0.15, 0.15, 0.15, 0.15, 0.1, 0, 0, 0] },
                { index: 14, minTimes: 66, maxTimes: 70, rate: [0, 0, 0, 0, 0, 0.05, 0.05, 0.1, 0.1, 0.15, 0.15, 0.15, 0.15, 0.1, 0, 0] },
                { index: 15, minTimes: 71, maxTimes: 75, rate: [0, 0, 0, 0, 0, 0, 0.05, 0.05, 0.1, 0.1, 0.15, 0.15, 0.15, 0.15, 0.1, 0] },
                { index: 16, minTimes: 76, maxTimes: 80, rate: [0, 0, 0, 0, 0, 0, 0, 0.05, 0.05, 0.05, 0.15, 0.15, 0.15, 0.15, 0.15, 0.1] },
                { index: 17, minTimes: 81, maxTimes: 85, rate: [0, 0, 0, 0, 0, 0, 0, 0, 0.05, 0.1, 0.15, 0.15, 0.15, 0.15, 0.15, 0.1] },
                { index: 18, minTimes: 86, maxTimes: 90, rate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.05, 0.15, 0.15, 0.2, 0.2, 0.15, 0.1] },
                { index: 19, minTimes: 91, maxTimes: 95, rate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.05, 0.2, 0.2, 0.2, 0.2, 0.15] },
                { index: 20, minTimes: 96, maxTimes: 10000, rate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.2, 0.2, 0.2, 0.2] },
            ];
            this.scoreJson = [
                { index: 1, minScore: 5, maxScore: 20 },
                { index: 2, minScore: 20, maxScore: 40 },
                { index: 3, minScore: 40, maxScore: 60 },
                { index: 4, minScore: 60, maxScore: 80 },
                { index: 5, minScore: 80, maxScore: 100 },
                { index: 6, minScore: 100, maxScore: 150 },
                { index: 7, minScore: 150, maxScore: 200 },
                { index: 8, minScore: 200, maxScore: 250 },
                { index: 9, minScore: 250, maxScore: 300 },
                { index: 10, minScore: 300, maxScore: 400 },
                { index: 11, minScore: 400, maxScore: 500 },
                { index: 12, minScore: 500, maxScore: 600 },
                { index: 13, minScore: 600, maxScore: 700 },
                { index: 14, minScore: 700, maxScore: 800 },
                { index: 15, minScore: 800, maxScore: 900 },
                { index: 16, minScore: 900, maxScore: 1000 },
            ];
            this.blockNumRate = [
                { minTimes: 0, maxTimes: 20, rate: [0.3, 0.4, 0.3, 0, 0] },
                { minTimes: 21, maxTimes: 50, rate: [0.2, 0.3, 0.3, 0.2, 0] },
                { minTimes: 51, maxTimes: 70, rate: [0.1, 0.2, 0.3, 0.2, 0.2] },
                { minTimes: 71, maxTimes: 10000, rate: [0, 0.2, 0.2, 0.3, 0.3] },
            ];
            this.propNumRate = [
                { blockNum: 1, rate: [0.6, 0.3, 0.05, 0.05] },
                { blockNum: 2, rate: [0.6, 0.3, 0.05, 0.05] },
                { blockNum: 3, rate: [0.6, 0.3, 0.05, 0.05] },
                { blockNum: 4, rate: [0.6, 0.3, 0.1, 0] },
                { blockNum: 5, rate: [0.7, 0.3, 0, 0] },
            ];
        }
        Config.getInstance = function () {
            if (Config._instance == null) {
                Config._instance = new Config();
            }
            return Config._instance;
        };
        Config.prototype.getScoreByTimes = function (times) {
            var rate = null;
            for (var i = 0; i < this.scoreRateJson.length; i++) {
                if (this.scoreRateJson[i].minTimes >= times && this.scoreRateJson[i].maxTimes >= times) {
                    rate = this.scoreRateJson[i].rate;
                    break;
                }
            }
            //获取不到次数对应的配置
            if (rate == null || rate.length <= 0) {
                console.log("cannot find times = ", times, " score rate config");
                return 0;
            }
            var randomRate = Math.random();
            var sumRate = 0;
            var index = -1;
            for (var i = 0; i < rate.length; i++) {
                sumRate += rate[i];
                if (randomRate <= sumRate) {
                    index = i;
                    break;
                }
            }
            var scoreConfig = this.scoreJson[index];
            if (scoreConfig == null) {
                return 0;
            }
            var score = Math.floor(Math.random() * (scoreConfig.maxScore - scoreConfig.minScore)) + scoreConfig.minScore;
            console.log("times ", times, " score is", score);
            return score;
        };
        Config.prototype.getBlockNum = function (times) {
            var rate = null;
            for (var i = 0; i < this.blockNumRate.length; i++) {
                if (this.blockNumRate[i].minTimes >= times && this.blockNumRate[i].maxTimes >= times) {
                    rate = this.blockNumRate[i].rate;
                    break;
                }
            }
            if (rate == null && rate.length <= 0) {
                return 0;
            }
            var randomRate = Math.random();
            var sumRate = 0;
            var index = -1;
            for (var i = 0; i < rate.length; i++) {
                sumRate += rate[i];
                if (randomRate <= sumRate) {
                    index = i;
                    break;
                }
            }
            console.log("times ", times, " block num is", index + 1);
            return (index + 1);
        };
        Config.prototype.getProNumByBlockNum = function (blockNum) {
            var proRate = this.propNumRate[blockNum - 1];
            if (proRate == null) {
                return 0;
            }
            var rate = proRate.rate;
            var sumRate = 0;
            var index = -1;
            var randomRate = Math.random();
            for (var i = 0; i < rate.length; i++) {
                sumRate += rate[i];
                if (randomRate <= sumRate) {
                    index = i;
                    break;
                }
            }
            console.log("blockNum ", blockNum, " block num is", index + 1);
            return (index + 1);
        };
        Config.prototype.getRandomArray = function () {
            var a = [0, 1, 2, 3, 4, 5];
            var len = a.length;
            for (var i = 0; i < len - 1; i++) {
                var index = Math.floor(Math.random() * (len - i));
                var temp = a[index];
                a[index] = a[len - i - 1];
                a[len - i - 1] = temp;
            }
            console.log(a);
            return a;
        };
        return Config;
    }());
    HDGGame.Config = Config;
    __reflect(Config.prototype, "HDGGame.Config");
})(HDGGame || (HDGGame = {}));
