var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Api = (function () {
    function Api() {
    }
    /**
     * post请求数据，默认需要token才能请求
     * @param  {} url post地址
     * @param  {} data post数据，默认放在body内
     */
    Api.post = function (url, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.decoratePostData(data);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var request = new egret.HttpRequest();
                        request.responseType = egret.HttpResponseType.TEXT;
                        request.open(url, egret.HttpMethod.POST);
                        request.setRequestHeader("Content-Type", "application/json");
                        request.send(data);
                        request.addEventListener(egret.Event.COMPLETE, function (evt) {
                            var res = evt.currentTarget;
                            res.response ? resolve(JSON.parse(res.response)) : resolve({});
                        }, _this);
                        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (evt) {
                            reject(evt);
                        }, _this);
                    })];
            });
        });
    };
    /**
     * get请求数据
     * @param  {} url 请求地址
     * @param  {} noToken? 是否需要传入token，若为true，则不需要传token亦可访问
     */
    Api.get = function (url, noToken) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var request = new egret.HttpRequest();
                        request.responseType = egret.HttpResponseType.TEXT;
                        request.open(url, egret.HttpMethod.GET);
                        request.send();
                        request.addEventListener(egret.Event.COMPLETE, function (evt) {
                            var res = evt.currentTarget;
                            resolve(JSON.parse(res.response));
                        }, _this);
                        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (evt) {
                            reject(evt);
                        }, _this);
                    })];
            });
        });
    };
    /**
     * 挂载需要传的公共属性
     */
    Api.decoratePostData = function (data) {
        var open_id = UserManager.getInstance().getOpenId();
        var userId = UserManager.getInstance().getUid();
        data.userId = userId;
        data.open_id = open_id;
        data.appid = GameConfig.appid;
    };
    // api地址  
    // public static GET_JUMP_INFO = "https://gw.365you.com/wx/getJumpInfo"; //获取跳转信息  (测试)
    Api.GET_JUMP_INFO = "https://gws.365you.com/wx/getJumpInfo"; //获取跳转信息  
    return Api;
}());
__reflect(Api.prototype, "Api");
