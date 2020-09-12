var qqPlayCoreBuildInfo = { buildPath:'/branches/7.7.0_dev/bricktest',version:'4124',creator:'wesleyxiao',buildTime:'Wed Jun 13 2018 16:53:07 GMT+0800 (CST)'};var hasBK = !!(typeof BK == 'object');
var isBrowser = !hasBK;
if (isBrowser) {
    if (typeof BK != 'undefined' == false) {
        BK = {};
        BK.isBrowser = true;
    }
(function (global, factory) {
    if (typeof global === 'object') {
        var _global = factory();
        if (typeof global.MQQ == 'undefined') {
            global.MQQ = {
                Webview: _global.Webview,
                SsoRequest: _global.SsoRequest,
                Account: _global.Account
            };
        }
        if (typeof global.FileUtil == 'undefined') {
            global.FileUtil = _global.FileUtil;
        }
        if (typeof global.Script == 'undefined') {
            global.Script = _global.Script;
        }
        if (typeof global.QQ == 'undefined') {
            global.QQ = _global.QQ;
        }
    }
}(BK, function () {
    var Webview = function () {
        function Webview() {
        }
        Webview.open = function (url) {
            SsoRequest.sendTo({ 'url': url }, 'cs.openWebView.local');
        };
        Webview.openTransparent = function (url, gameOrientation, callback) {
            if (gameOrientation === void 0) {
                gameOrientation = 1;
            }
            var cmd = 'cs.openWebViewWithoutUrl.local';
            if (callback) {
                __browserMsgHdl.removeListener(cmd, this);
                __browserMsgHdl.addListener(cmd, this, callback);
            }
            SsoRequest.sendTo({ 'url': url }, cmd);
        };
        Webview.closeTransparent = function (taskId) {
            SsoRequest.sendTo({ 'taskId': taskId }, 'cs.closeWebview.local');
        };
        Webview.onMessageHandle = function (callback) {
        };
        return Webview;
    }();
    var SsoRequest = function () {
        function SsoRequest() {
        }
        SsoRequest.ssoRequestCallBack = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'ssoRequestCallBack cmd:' + cmd + ' errCode:' + errCode + ' data:' + JSON.stringify(data));
            __dispatchEvent(errCode, data.cmd, JSON.stringify(data.data));
        };
        SsoRequest.send = function (data, cmd) {
            __browserMsgHdl.addListener('cs.ssoMessage.local', this, this.ssoRequestCallBack);
            SsoRequest.sendTo({
                'cmd': cmd,
                'data': JSON.stringify(data)
            }, 'cs.ssoMessage.local');
        };
        SsoRequest.addListener = function (cmd, target, callback) {
            __browserMsgHdl.addListener(cmd, target, callback);
        };
        SsoRequest.removeListener = function (cmd, target) {
            __browserMsgHdl.removeListener(cmd, target);
        };
        SsoRequest.sendTo = function (data, cmd) {
            if (typeof __browserMsg !== 'undefined') {
                __browserMsg.send(JSON.stringify(data), cmd);
            } else if (typeof window.webkit.messageHandlers !== 'undefined') {
                window.webkit.messageHandlers.cmWebGameSend.postMessage({
                    data: JSON.stringify(data),
                    cmd: cmd
                });
            }
        };
        return SsoRequest;
    }();
    var Account = function () {
        function Account() {
        }
        Account.accountCallBack = function (errCode, cmd, data) {
            var callBackID = '0';
            if (data.nickname === 1) {
                callBackID = '1';
            } else if (data.avatar === 1) {
                callBackID = '2';
            }
            var key = cmd + '_' + callBackID;
            if (Account.accountCallBackArr[key]) {
                var callback = Account.accountCallBackArr[key];
                callback(data.openId, data.data);
            }
        };
        Account.getNick = function (openId, callback) {
            var key = 'cs.get_userInfo.local_1';
            Account.accountCallBackArr[key] = callback;
            BK.MQQ.SsoRequest.addListener('cs.get_userInfo.local', this, this.accountCallBack);
            BK.MQQ.SsoRequest.sendTo({
                'openId': openId,
                'nickname': 1
            }, 'cs.get_userInfo.local');
        };
        Account.getHead = function (openId, callback) {
            var key = 'cs.get_userInfo.local_2';
            Account.accountCallBackArr[key] = callback;
            BK.MQQ.SsoRequest.addListener('cs.get_userInfo.local', this, this.accountCallBack);
            BK.MQQ.SsoRequest.sendTo({
                'openId': openId,
                'avatar': 1
            }, 'cs.get_userInfo.local');
        };
        return Account;
    }();
    Account.accountCallBackArr = [];
    var Script = function () {
        function Script() {
        }
        Script.log = function (level, errcode, info) {
            if (typeof GameStatusInfo !== 'undefined' && this.compareVersion(GameStatusInfo.QQVer, '7.6.0') >= 0) {
                if (typeof __browserMsg !== 'undefined') {
                    __browserMsg.log(level, errcode, 'webGame_log', info, '');
                } else if (typeof window.webkit.messageHandlers !== 'undefined') {
                    window.webkit.messageHandlers.cmWebGameLog.postMessage({
                        level: level,
                        errcode: errcode,
                        info1: 'webGame_log',
                        info2: info,
                        info3: ''
                    });
                }
            }
        };
        Script.compareVersion = function (v1, v2) {
            var _v1 = v1.split('.');
            var _v2 = v2.split('.');
            var _r = _v1[0] - _v2[0];
            return _r == 0 && v1 != v2 ? Script.compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.')) : _r;
        };
        return Script;
    }();
    var FileUtil = function () {
        function FileUtil() {
        }
        FileUtil.base64ToUint8Array = function (base64) {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
            if (base64[base64.length - 1] === '=') {
                bufferLength--;
                if (base64[base64.length - 2] === '=') {
                    bufferLength--;
                }
            }
            var arraybuffer = new ArrayBuffer(bufferLength);
            var bytes = new Uint8Array(arraybuffer);
            for (i = 0; i < len; i += 4) {
                encoded1 = chars.indexOf(base64[i]);
                encoded2 = chars.indexOf(base64[i + 1]);
                encoded3 = chars.indexOf(base64[i + 2]);
                encoded4 = chars.indexOf(base64[i + 3]);
                bytes[p++] = encoded1 << 2 | encoded2 >> 4;
                bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
                bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
            }
            return bytes;
        };
        FileUtil.upload = function (buff, extInfo, callback) {
            var length = buff.length > 1024 ? 1024 : buff.length;
            var tmp = buff.slice(0, length);
            var md5 = BK.Crypt.core_md5(tmp, length);
            var date = new Date();
            var time = date.getFullYear() + (date.getMonth() + 1 < 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1) + date.getDate();
            var tmpSecretId = extInfo.tmpSecretId;
            var uploadUrl = extInfo.upLoadPrefUrl;
            var downloadUrl = extInfo.downloadUrl;
            var sessionToken = extInfo.sessionToken;
            var signKey = extInfo.signature;
            var signTime = extInfo.signTime;
            var uri = '/' + GameStatusInfo.gameId + '_' + BK.Crypt.bin2hex(md5) + GameStatusInfo.gameId + '_' + time + '.png';
            uploadUrl = uploadUrl.replace(new RegExp('http://', 'gm'), '');
            var signAlgorithm = 'sha1';
            var headerList = 'host;x-cos-storage-class';
            var formatString = 'put' + '\n' + uri + '\n\nhost=' + uploadUrl + '&x-cos-storage-class=nearline\n';
            var stringToSign = signAlgorithm + '\n' + signTime + '\n' + BK.Crypt.hex_sha1(formatString) + '\n';
            var signature = BK.Crypt.hex_hmac_sha1(signKey, stringToSign);
            var authorization = 'q-sign-algorithm=' + signAlgorithm + '&q-ak=' + tmpSecretId + '&q-sign-time=' + signTime + '&q-key-time=' + signTime + '&q-header-list=' + headerList + '&q-url-param-list=' + '' + '&q-signature=' + signature;
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        BK.Script.log(0, 0, ' on response res = ' + this.status + '   ' + JSON.stringify(this.HEADERS_RECEIVED));
                        if (downloadUrl.charAt(downloadUrl.length - 1) == uri.charAt(0) && uri.charAt(0) == '/') {
                            downloadUrl = downloadUrl.slice(0, downloadUrl.length - 1);
                        }
                        callback(this.status, downloadUrl + uri);
                    } else {
                        callback(this.status, '');
                    }
                }
            };
            httpRequest.open('put', 'https://' + uploadUrl + uri, true);
            httpRequest.setRequestHeader('x-cos-storage-class', 'nearline');
            httpRequest.setRequestHeader('x-cos-security-token', sessionToken);
            httpRequest.setRequestHeader('authorization', authorization);
            httpRequest.send(buff);
        };
        FileUtil.uploadFromFile = function (path, callback) {
            var cmd = 'cs.get_file_data.local';
            var data = {
                'cmd': cmd,
                'path': path
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    var buff = BK.FileUtil.base64ToUint8Array(data);
                    BK.FileUtil.uploadFromBuff(buff, callback);
                });
                BK.MQQ.SsoRequest.sendTo(data, cmd);
            }
        };
        FileUtil.uploadFromBuff = function (buff, callback) {
            BK.QQ.queryCloudSignature(function (errCode, data) {
                BK.FileUtil.upload(buff, data, callback);
            });
        };
        return FileUtil;
    }();
    var QQ = function () {
        function QQ() {
        }
        QQ.shareToMQQ = function (title, summary, detailUrl, picUrl) {
            var cmd = 'cs.share_game_result.local';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'gameVersion': GameStatusInfo.gameVersion,
                'roomId': GameStatusInfo.roomId,
                'title': title,
                'summary': summary,
                'detailUrl': detailUrl,
                'picUrl': picUrl
            };
            SsoRequest.sendTo(data, cmd);
        };
        ;
        QQ.getRankList = function (callback, reqConfig) {
            var data = {
                'cmd': this.CMSHOW_SRV_GET_RANK_LIST,
                'from': 'default',
                'objType': 1,
                'objId': 0,
                'busType': 3,
                'busId': GameStatusInfo.gameId.toString()
            };
            if (reqConfig) {
                if (reqConfig.objType) {
                    data.objType = reqConfig.objType;
                }
                if (reqConfig.objId) {
                    data.objId = reqConfig.objId;
                }
                if (reqConfig.from) {
                    data.from = reqConfig.from;
                }
            }
            BK.Script.log(1, 1, 'BK.QQ.reqGetRankList! ' + JSON.stringify(data));
            if (data != undefined) {
                QQ._getRankListCallBack = callback;
                BK.MQQ.SsoRequest.removeListener(this.CMSHOW_SRV_GET_RANK_LIST, this);
                BK.MQQ.SsoRequest.addListener(this.CMSHOW_SRV_GET_RANK_LIST, this, this._event4GetRankList);
                BK.MQQ.SsoRequest.send(data, this.CMSHOW_SRV_GET_RANK_LIST);
            } else {
                BK.Script.log(0, 0, 'reqGetRankList data undefined!');
            }
        };
        QQ.consumeItems = function (itemList, callback) {
            var cmd = 'apollo_game_item.consume_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'items': itemList
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    var succList = [];
                    var failList = [];
                    if (errCode == 0) {
                        succList = data.data.succList;
                        failList = data.data.failList;
                    }
                    callback(errCode, succList, failList);
                });
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QQ.getUserGameItems = function (callback) {
            var cmd = 'apollo_aio_game.get_user_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    if (data != undefined) {
                        var rspData = {};
                        rspData.data = data.data;
                        callback(errCode, cmd, rspData);
                    }
                });
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QQ.buyGameItems = function (currencyType, items, callback) {
            var cmd = 'apollo_aio_game.buy_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'curreType': currencyType,
                'itemIdList': items
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    if (data != undefined) {
                        var rspData = {};
                        rspData.data = data.data;
                        callback(errCode, cmd, rspData);
                    }
                });
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QQ.queryCloudSignature = function (callback) {
            var date = new Date();
            var now = date.getTime() / 1000 - 1;
            var cmd = 'cs.fetch_cloud_signature.local';
            var data = {
                'cmd': cmd,
                'now': now,
                'delta': 600
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    callback(errCode, data);
                });
                BK.MQQ.SsoRequest.sendTo(data, cmd);
            }
        };
        QQ.notifyCloseGame = function () {
            var data = {
                'gameId': GameStatusInfo.gameId,
                'roomId': 0
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyCloseGame!gameId = ' + data.gameId + ', roomId = ' + data.roomId);
            BK.MQQ.SsoRequest.send(data, 'cs.close_room.local');
        };
        return QQ;
    }();
    QQ.CMSHOW_SRV_GET_RANK_LIST = 'apollo_router_game.game_rank_linkcmd_get_fri_rank_for_engine';
    QQ.shareToArk = function (roomId, summary, picUrl, isSelectFriend, extendInfo, callback) {
        if (typeof isSelectFriend == 'boolean') {
            isSelectFriend = isSelectFriend == true ? 1 : 0;
        }
        var cmd = 'cs.share_game_in_ark.local';
        var callbackCmd = 'sc.share_game_to_friend_result.local';
        if (GameStatusInfo.platform == 'android' && GameStatusInfo.QQVer.indexOf('7.6.0') == 0) {
            cmd = 'cs.game_shell_share_callback.local';
        }
        var data = {
            'cmd': cmd,
            'summary': summary,
            'picUrl': picUrl,
            'gameId': GameStatusInfo.gameId,
            'roomId': roomId,
            'gameMode': GameStatusInfo.gameMode,
            'isSelectFriend': isSelectFriend,
            'extendInfo': extendInfo
        };
        BK.Script.log(0, 0, 'ShareToArk summary=' + data.summary + ' roomId=' + data.roomId + '  gameMode=' + data.gameMode + 'picUrl=' + data.picUrl + '  gameId=' + data.gameId);
        if (callback) {
            BK.MQQ.SsoRequest.removeListener(callbackCmd, this);
            BK.MQQ.SsoRequest.addListener(callbackCmd, this, callback);
        }
        SsoRequest.sendTo(data, cmd);
    };
    QQ.shareToArkFromFile = function (roomId, summary, extendInfo, path) {
        BK.FileUtil.uploadFromFile(path, function (ret, url) {
            BK.QQ.shareToArk(roomId, summary, url, true, extendInfo);
        });
    };
    QQ.shareToArkFromBuff = function (roomId, summary, extendInfo, buff) {
        BK.FileUtil.uploadFromBuff(buff, function (ret, url) {
            if (ret == 200) {
                BK.QQ.shareToArk(roomId, summary, url, true, extendInfo);
            }
        });
    };
    QQ.fetchOpenKey = function (callback) {
        var cmd = 'cs.on_get_open_key.local';
        var data = { 'gameId': GameStatusInfo.gameId };
        if (callback) {
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        }
        BK.MQQ.SsoRequest.sendTo(data, cmd);
    };
    QQ.scoreUpload = function (scoreData, callback, arkData) {
        var cmd = 'apollo_aio_game.report_user_score_3rd';
        var data = {
            'cmd': cmd,
            'from': GameStatusInfo.platform,
            'gameId': GameStatusInfo.gameId,
            'openId': GameStatusInfo.openId,
            'version': GameStatusInfo.gameVersion,
            'roomId': GameStatusInfo.roomId,
            'gData': scoreData
        };
        if (arkData) {
            data['arkData'] = arkData;
        }
        if (callback) {
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        }
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    QQ._getRankListCallBack = undefined;
    QQ._event4GetRankList = function (errCode, cmd, data) {
        BK.Script.log(1, 1, 'BK.QQ.reqGetRankList! callback cmd:' + cmd + ' errCode:' + errCode + '  data:' + JSON.stringify(data));
        if (QQ._getRankListCallBack != undefined) {
            QQ._getRankListCallBack(errCode, cmd, data);
        }
        BK.MQQ.SsoRequest.removeListener(this.CMSHOW_SRV_GET_RANK_LIST, this);
    };
    QQ.uploadScoreWithoutRoom = function (gameMode, scoreData, callback) {
        var cmd = 'apollo_report_result.single_user_result';
        var ts = Math.floor(new Date().getTime() / 1000);
        var data = {
            from: GameStatusInfo.platform,
            gameId: GameStatusInfo.gameId,
            openId: GameStatusInfo.openId,
            version: GameStatusInfo.gameVersion,
            aioType: 1,
            ts: ts.toString(),
            src: GameStatusInfo.src,
            mode: gameMode !== undefined ? gameMode : 1,
            userData: scoreData.userData,
            attr: scoreData.attr
        };
        if (callback) {
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        }
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    QQ.getRankListWithoutRoom = function (attr, order, callback) {
        var cmd = 'apollo_router_game.apollo_user_rankinglist_linkcmd_custom_ranking';
        var ts = Math.floor(new Date().getTime() / 1000);
        var data = {
            from: GameStatusInfo.platform,
            gameId: GameStatusInfo.gameId,
            openId: GameStatusInfo.openId,
            version: GameStatusInfo.gameVersion,
            ts: ts.toString(),
            attr: attr !== undefined ? attr : 'score',
            order: order !== undefined ? order : 1
        };
        if (callback) {
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        }
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    QQ.qPayPurchase = function (gameOrientation, transparent, itemList, callback) {
        var cmd = 'cs.openWebViewWithoutUrl.local';
        var transparentNum = 1;
        if (transparent == true) {
            transparentNum = 1;
        } else {
            transparentNum = 0;
        }
        var baseUrl = 'https://cmshow.qq.com/apollo/html/game-platform/buy-props.html?_wv=3&adtag=inside_game';
        var url = baseUrl + '&gameId=' + GameStatusInfo.gameId + '&gameOrientation=' + gameOrientation + '&itemList=' + encodeURI(JSON.stringify(itemList));
        var data = {
            'gameOrientation': gameOrientation,
            'transparent': transparentNum,
            'businessType': 2,
            'url': url
        };
        if (callback) {
            var cbCmd = 'sc.apolloGameWebMessage.local';
            BK.MQQ.SsoRequest.removeListener(cbCmd, this);
            BK.MQQ.SsoRequest.addListener(cbCmd, this, function (errCode, cmd, data) {
                if (errCode == 0) {
                    if (data.op && data.op == 'apolloGamePlatform.buyProps') {
                        callback(data.data.code, data.data);
                    }
                }
            }.bind(this));
        }
        BK.MQQ.SsoRequest.sendTo(data, cmd);
    };
    QQ.getGameItemList = function (callback) {
        var cmd = 'apollo_aio_game.get_game_itemList';
        var data = {
            'cmd': cmd,
            'from': GameStatusInfo.platform,
            'gameId': GameStatusInfo.gameId
        };
        if (callback) {
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        }
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    QQ.rollbackGameItems = function (itemList, callback) {
        var cmd = 'apollo_game_item.rollback_game_items';
        var data = {
            'cmd': cmd,
            'from': GameStatusInfo.platform,
            'gameId': GameStatusInfo.gameId,
            'openId': GameStatusInfo.openId,
            'items': itemList
        };
        if (callback) {
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                var succList = [];
                var failList = [];
                if (errCode == 0) {
                    succList = data.data.succList;
                    failList = data.data.failList;
                }
                callback(errCode, succList, failList);
            }.bind(this));
        }
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    QQ.uploadData = function (action, enter, result, param1, param2, param3) {
        var cmd = 'cs.report_data_2_compass.local';
        var gameId = GameStatusInfo.gameId;
        if (GameStatusInfo.platform == 'ios') {
            action = action.toString();
            result = result.toString();
        }
        var data = {
            'cmd': cmd,
            'actionName': action,
            'enter': enter,
            'entry': enter,
            'result': result,
            'r2': gameId.toString(),
            'r3': param1,
            'r4': param2,
            'r5': param3
        };
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    return {
        Webview: Webview,
        SsoRequest: SsoRequest,
        Account: Account,
        Script: Script,
        FileUtil: FileUtil,
        QQ: QQ
    };
}));
} else {
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Emitter = factory();
    }
}(BK, function () {
    var EmitDesc = function () {
        function EmitDesc(target, callback, once) {
            this.once = once;
            this.target = target;
            this.callback = callback;
        }
        return EmitDesc;
    }();
    var Emitter = function () {
        function Emitter() {
            this._emits = {};
        }
        Emitter.prototype.__emit_get = function (event) {
            if (!this._emits[event]) {
                this._emits[event] = new Array();
            }
            return this._emits[event];
        };
        Emitter.prototype.__emit_put = function (event, desc) {
            this.__emit_get(event).push(desc);
        };
        Emitter.prototype.__emit_exists = function (event, target) {
            var descs = this.__emit_get(event);
            var exists = false;
            for (var i_1 = 0; i_1 < descs.length; i_1++) {
                if (descs[i_1].target == target) {
                    exists = true;
                    break;
                }
            }
            return exists;
        };
        Emitter.prototype.dispose = function () {
            delete this._emits;
        };
        Emitter.prototype.on = function (event, target, callback, once) {
            if (false == this.__emit_exists(event, target)) {
                var desc = new EmitDesc(target, callback, once);
                this.__emit_put(event, desc);
            } else {
                BK.Script.log(0, 0, 'BK.bkEmitter.on!has found, event = ' + event + ', target = ' + JSON.stringify(target));
            }
        };
        Emitter.prototype.off = function (event, target) {
            var descs = this.__emit_get(event);
            for (var i_2 = 0; i_2 < descs.length; i_2++) {
                if (descs[i_2].target == target) {
                    descs.splice(i_2, 1);
                    break;
                }
            }
        };
        Emitter.prototype.offAll = function (target) {
            Object.keys(this._emits).forEach(function (_event) {
                this.off(_event, target);
            }.bind(this));
        };
        Emitter.prototype.emitAll = function (event, extras) {
            var dels = new Array();
            var descs = this.__emit_get(event);
            for (var i_3 = 0; i_3 < descs.length; i_3++) {
                var data = {
                    'event': event,
                    'source': this,
                    'target': descs[i_3].target,
                    'extras': extras
                };
                descs[i_3].callback && descs[i_3].callback(data);
                if (descs[i_3].once == true) {
                    dels.push(descs[i_3].target);
                }
            }
            for (var i_4 = 0; i_4 < dels.length; i_4++) {
                this.off(event, dels[i_4]);
            }
        };
        Emitter.prototype.emitOnce = function (event, extras) {
            var dels = new Array();
            var descs = this.__emit_get(event);
            for (var i_5 = 0; i_5 < descs.length; i_5++) {
                if (descs[i_5].once == true) {
                    var data = {
                        'event': event,
                        'source': this,
                        'target': descs[i_5].target,
                        'extras': extras
                    };
                    dels.push(descs[i_5].target);
                    descs[i_5].callback && descs[i_5].callback(data);
                }
            }
            for (var i_6 = 0; i_6 < dels.length; i_6++) {
                this.off(event, dels[i_6]);
            }
        };
        return Emitter;
    }();
    return Emitter;
}));
(function () {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    function toArrayBuffer(base64) {
        var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }
        var arraybuffer = new ArrayBuffer(bufferLength);
        bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = chars.indexOf(base64[i]);
            encoded2 = chars.indexOf(base64[i + 1]);
            encoded3 = chars.indexOf(base64[i + 2]);
            encoded4 = chars.indexOf(base64[i + 3]);
            bytes[p++] = encoded1 << 2 | encoded2 >> 4;
            bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
            bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
        }
        return arraybuffer;
    }
    function fromArrayBuffer(arraybuffer, byteOffset, byteLength) {
        var bytes = new Uint8Array(arraybuffer, byteOffset ? byteOffset : 0, byteLength ? byteLength : arraybuffer.byteLength), i, len = bytes.length, base64 = '';
        for (i = 0; i < len; i += 3) {
            base64 += chars[bytes[i] >> 2];
            base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
            base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
            base64 += chars[bytes[i + 2] & 63];
        }
        if (len % 3 === 2) {
            base64 = base64.substring(0, base64.length - 1) + '=';
        } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + '==';
        }
        return base64;
    }
    function nativeTypedArrayToBKBuffer(array) {
        function _sliceTypedArray(type, array) {
            var _sliceNum = 4096;
            var _remainNum = array.length;
            var _obj = { 'type': type };
            switch (type) {
            case 0: {
                    var _offset = 0;
                    while (_remainNum > 0) {
                        var _minN = Math.min(_remainNum, _sliceNum);
                        var _array = new Int8Array(array.buffer, _offset * Int8Array.BYTES_PER_ELEMENT, _minN);
                        BK.Misc.transferArrayBuffer.apply(_obj, _array);
                        _offset += _sliceNum;
                        _remainNum -= _sliceNum;
                    }
                    break;
                }
            case 1: {
                    var _offset = 0;
                    while (_remainNum > 0) {
                        var _minN = Math.min(_remainNum, _sliceNum);
                        var _array = new Int16Array(array.buffer, _offset * Int16Array.BYTES_PER_ELEMENT, _minN);
                        BK.Misc.transferArrayBuffer.apply(_obj, _array);
                        _offset += _sliceNum;
                        _remainNum -= _sliceNum;
                    }
                    break;
                }
            case 2: {
                    var _offset = 0;
                    while (_remainNum > 0) {
                        var _minN = Math.min(_remainNum, _sliceNum);
                        var _array = new Int32Array(array.buffer, _offset * Int32Array.BYTES_PER_ELEMENT, _minN);
                        BK.Misc.transferArrayBuffer.apply(_obj, _array);
                        _offset += _sliceNum;
                        _remainNum -= _sliceNum;
                    }
                    break;
                }
            case 3: {
                    var _offset = 0;
                    while (_remainNum > 0) {
                        var _minN = Math.min(_remainNum, _sliceNum);
                        var _array = new Uint8Array(array.buffer, _offset * Uint8Array.BYTES_PER_ELEMENT, _minN);
                        BK.Misc.transferArrayBuffer.apply(_obj, _array);
                        _offset += _sliceNum;
                        _remainNum -= _sliceNum;
                    }
                    break;
                }
            case 5: {
                    var _offset = 0;
                    while (_remainNum > 0) {
                        var _minN = Math.min(_remainNum, _sliceNum);
                        var _array = new Uint16Array(array.buffer, _offset * Uint16Array.BYTES_PER_ELEMENT, _minN);
                        BK.Misc.transferArrayBuffer.apply(_obj, _array);
                        _offset += _sliceNum;
                        _remainNum -= _sliceNum;
                    }
                    break;
                }
            case 6: {
                    var _offset = 0;
                    while (_remainNum > 0) {
                        var _minN = Math.min(_remainNum, _sliceNum);
                        var _array = new Uint32Array(array.buffer, _offset * Uint32Array.BYTES_PER_ELEMENT, _minN);
                        BK.Misc.transferArrayBuffer.apply(_obj, _array);
                        _offset += _sliceNum;
                        _remainNum -= _sliceNum;
                    }
                    break;
                }
            case 7: {
                    var _offset = 0;
                    while (_remainNum > 0) {
                        var _minN = Math.min(_remainNum, _sliceNum);
                        var _array = new Float32Array(array.buffer, _offset * Float32Array.BYTES_PER_ELEMENT, _minN);
                        BK.Misc.transferArrayBuffer.apply(_obj, _array);
                        _offset += _sliceNum;
                        _remainNum -= _sliceNum;
                    }
                    break;
                }
            }
        }
        if (array instanceof Int8Array === true) {
            _sliceTypedArray(0, array);
        } else if (array instanceof Int16Array === true) {
            _sliceTypedArray(1, array);
        } else if (array instanceof Int32Array === true) {
            _sliceTypedArray(2, array);
        } else if (array instanceof Uint8Array === true) {
            _sliceTypedArray(3, array);
        } else if (array instanceof Uint16Array === true) {
            _sliceTypedArray(5, array);
        } else if (array instanceof Uint32Array === true) {
            _sliceTypedArray(6, array);
        } else if (array instanceof Float32Array === true) {
            _sliceTypedArray(7, array);
        }
        return BK.Misc.getTransferedArrayBuffer();
    }
    BK.Misc.BKBufferToArrayBuffer = function (buf) {
        buf.rewind();
        var s = BK.Misc.encodeBase64FromBuffer(buf);
        return toArrayBuffer(s);
    };
    BK.Misc.arrayBufferToBKBuffer = function (ab, byteOffset, byteLength) {
        var s = fromArrayBuffer(ab, byteOffset, byteLength);
        return BK.Misc.decodeBase64FromString(s);
    };
    BK.Misc.typedArrayToBKBuffer = function (array) {
        if (BK.Misc.transferArrayBuffer) {
            return nativeTypedArrayToBKBuffer(array);
        } else {
            return BK.Misc.arrayBufferToBKBuffer(array.buffer, array.byteOffset, array.byteLength);
        }
    };
}());
enGameHallSucc = 0;
eReqDataLenErr = 1000;
eReqMagicErr = 1001;
eReqFrontCmdErr = 1002;
eReqBackCmdErr = 1003;
eReqBackSrcErr = 1004;
eReqFromIdErr = 1005;
eSTDecryErr = 1006;
eReqDecryErr = 1007;
eSTExpire = 1008;
eSystmeErr = 1009;
eVerUnvalid = 1010;
eReqLimit = 1011;
eGetSvrErr = 1012;
eInitMemErr = 2001;
eQueryMemErr = 2002;
eUpdateMemErr = 2003;
eDelMemErr = 2004;
eGetConfigErr = 2005;
eNotifyCreateErr = 2006;
eGetRoomIdErr = 2007;
eCmdInvalid = 2008;
eRoomNotExist = 2009;
eInBlackList = 2010;
eMatchTimeOut = 2011;
eGetRoomErr = 3000;
eRoomStatusErr = 3001;
eIsNotCreator = 3002;
eIsNotInRoom = 3003;
eFlushTsErr = 3004;
eLogoutIdErr = 3005;
eIsNotInSvc = 3006;
eUsrOverFlow = 3007;
eRoomOverFlow = 3008;
eRoomIsExist = 3009;
eRmvUsrErr = 3010;
eLoginSysErr = 3011;
eUsrHasLoginErr = 3012;
eRoomIsFullErr = 3013;
eCreateRoomErr = 3014;
ePlayerHasJoin = 3015;
eUgcDataAnti = 3020, eFowardToClientErr = 4000;
eFowardToSvrErr = 4001;
function clone_(obj) {
    var o, i, j, k;
    if (typeof obj != 'object' || obj === null)
        return obj;
    if (obj instanceof Array) {
        o = [];
        i = 0;
        j = obj.length;
        for (; i < j; i++) {
            if (typeof obj[i] == 'object' && obj[i] != null) {
                o[i] = arguments.callee(obj[i]);
            } else {
                o[i] = obj[i];
            }
        }
    } else {
        o = {};
        for (i in obj) {
            if (typeof obj[i] == 'object' && obj[i] != null) {
                o[i] = arguments.callee(obj[i]);
            } else {
                o[i] = obj[i];
            }
        }
    }
    return o;
}
var DebugRecommandRoomSvrHost = '139.199.216.130';
var DebugRecommandRoomSvrPort = 10060;
var NormalRecommandRoomSvrHost = '139.199.216.128';
var NormalRecommandRoomSvrPort = 10060;
var TLVType = new Object();
TLVType.Int8 = 33;
TLVType.Uint8 = 34;
TLVType.Int16 = 33;
TLVType.Uint16 = 36;
TLVType.Int32 = 37;
TLVType.Uint32 = 38;
TLVType.Int64 = 39;
TLVType.Uint64 = 40;
TLVType.Byte = 41;
TLVType.Double = 42;
TLVType.Float = 43;
TLVType.Int8Repeated = 49;
TLVType.Uint8Repeated = 50;
TLVType.Int16Repeated = 51;
TLVType.Uint16Repeated = 52;
TLVType.Int32Repeated = 53;
TLVType.Uint32Repeated = 54;
TLVType.Int64Repeated = 55;
TLVType.Uint64Repeated = 56;
TLVType.ByteRepeated = 57;
TLVType.DoubleRepeated = 58;
TLVType.FloatRepeated = 59;
var fixedHeaderLen = 120;
var HeaderLen = 12;
var currentGameMode = GameStatusInfo.gameMode;
var fromPlatform = GameStatusInfo.platform;
var currentAioType = GameStatusInfo.aioType;
var currentPlayerOpenId = GameStatusInfo.openId;
var isMaster = GameStatusInfo.isMaster;
NETWORK_ENVIRONMENT_QQ_RELEASE = 0;
NETWORK_ENVIRONMENT_QQ_DEBUG = 1;
NETWORK_ENVIRONMENT_DEMO_DEV = 2;
CMSHOW_SRV_CMD_JOIN_ROOM = 'apollo_aio_game.join_room';
CMSHOW_SRV_CMD_QUIT_GAME = 'apollo_aio_game.quit_room';
CMSHOW_SRV_CMD_START_GAME = 'apollo_aio_game.start_game';
CMSHOW_SRV_CMD_CANCEL_GAME = 'apollo_aio_game.cancel_game_room';
CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC = 'apollo_game_openapi.custom_game_logic';
CMSHOW_SRV_GET_RANK_LIST = 'apollo_router_game.game_rank_linkcmd_get_fri_rank_for_engine';
CMSHOW_SC_CMD_STOP_GAME = 'sc.force_stop_game.local';
CMSHOW_CS_CMD_MINI_WND = 'cs.make_room_min.local';
CMSHOW_CS_CMD_CLOSE_WND = 'cs.close_room.local';
CMSHOW_CS_CMD_CREATE_ROOM = 'cs.create_room.local';
CMSHOW_CS_CMD_JOIN_ROOM = 'cs.join_room.local';
CMSHOW_CS_CMD_SEND_GAME_MSG = 'cs.send_game_msg.local';
CMSHOW_CS_CMD_GAME_TIPS = 'cs.game_tips.local';
CMSHOW_CS_CMD_GET_PLAYER_DRESS = 'cs.get_dress_path.local';
CMSHOW_CS_CMD_GAME_READY = 'cs.game_ready.local';
CMSHOW_CS_CMD_GAME_START = 'cs.game_start.local';
CMSHOW_CS_CMD_SAVE_RECOMM_VIP = 'cs.save_recommend_ip.local';
CMSHOW_CS_CMD_GET_SRV_IP_PORT = 'cs.get_server_ip_port.local';
CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE = 'cs.check_pubAccount_state.local';
CMSHOW_CS_CMD_ENTER_PUBACCOUNT_CARD = 'cs.enter_pubAccount_card.local';
CMSHOW_CS_CMD_SHARE_PIC = 'cs.share_pic.local';
CMSHOW_CS_CMD_SHARE_IN_ARK = 'cs.share_game_in_ark.local';
CMSHOW_CS_CMD_QUERY_CLOUD_SIGNATURE = 'cs.fetch_cloud_signature.local';
CMSHOW_AIO_PAUSE = 'sc.aio_pause.local';
CMSHOW_AIO_RESUME = 'sc.aio_resume.local';
CMD_CMSHOW_GAME_ENTER_BACKGROUND = 'sc.game_enter_background.local';
CMD_CMSHOW_GAME_ENTER_FORGROUND = 'sc.game_enter_foreground.local';
CMD_CMSHOW_GAME_MAXIMIZE = 'sc.game_maximize.local';
CMD_CMSHOW_GAME_MINIMIZE = 'sc.game_minimize.local';
CMSHOW_CS_CMD_AUDIOROOM_ENTERN = 'cs.audioRoom_enter.local';
CMSHOW_CS_CMD_AUDIOROOM_EXIT = 'cs.audioRoom_exit.local';
CMSHOW_CS_CMD_AUDIOROOM_UPDATEUSERINFO = 'cs.audioRoom_update_userinfo.local';
CMSHOW_CS_CMD_AUDIOROOM_SET_MIC = 'cs.audioRoom_set_mic.local';
CMSHOW_CS_CMD_AUDIOROOM_SET_SPEAKER = 'cs.audioRoom_set_speaker.local';
CMSHOW_CS_CMD_AUDIOROOM_INIT = 'cs.audioRoom_init.local';
CMSHOW_CS_CMD_AUDIOROOM_DISCONNECT = 'cs.audioRoom_disconnect.local';
CMSHOW_CS_CMD_AUDIOROOM_CAMERASWITCH = 'cs.audioRoom_cameraswitch.local';
CMSHOW_CS_CMD_AUDIOROOM_SET_BEAUTY = 'cs.audioRoom_set_beauty.local';
CMSHOW_CS_CMD_AUDIOROOM_REQ_AUDIO_SESSION = 'cs.audioRoom_req_audio_session.local';
var currentRenderMode;
var glpause;
checkRenderMode = function () {
    if (currentRenderMode == 0) {
        BK.Script.renderMode = 1;
        currentRenderMode = 1;
    }
};
BK.QQ = function () {
    return new function () {
        this.gameCfg = clone_(GameStatusInfo);
        this.gameCfg.gameId = parseInt(this.gameCfg.gameId);
        this.gameCfg.gameMode = 0;
        GameStatusInfo.gameMode = 0;
        this.hasJoinRoomSucc = false;
        this.arkData = { 'modeWording': '' };
        this.setArkData = function (modeWording) {
            this.arkData.modeWording = modeWording;
        };
        if (this.gameCfg.roomId) {
            this.gameCfg.roomId = parseInt(this.gameCfg.roomId);
        }
        if (this.gameCfg.isMaster == 1) {
            this.gameCfg.isCreator = true;
        } else {
            this.gameCfg.isCreator = false;
        }
        this.delegate = {};
        this.ssoJoinRoomCallback;
        this.ssoJoinRoomCallbackPublic;
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_BACKGROUND, this, function () {
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Director.tickerPause();
            }
        });
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_FORGROUND, this, function () {
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Director.tickerResume();
            }
        });
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MINIMIZE, this, function () {
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Script.renderMode = 0;
                renderTicker.paused = true;
                currentRenderMode = 0;
                glpause = true;
            }
        });
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MAXIMIZE, this, function () {
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Script.renderMode = 1;
                renderTicker.paused = false;
                currentRenderMode = 1;
                glpause = false;
            }
        });
        this.queryCloudSignature = function (callback) {
            if (BK.Misc.compQQVersion(GameStatusInfo.QQVer, '7.6.3')) {
                if (callback) {
                    var extInfo = JSON.parse(GameStatusInfo.extInfo);
                    var credentials = extInfo.certInfo.credentials;
                    var tmpSecretId = credentials.tmpSecretId;
                    var sessionToken = credentials.sessionToken;
                    var upLoadPrefUrl = extInfo.certInfo.upLoadPrefUrl;
                    var downLoadPrefUrl = extInfo.certInfo.downLoadPrefUrl;
                    var date = new Date();
                    var time = date.getFullYear() + (date.getMonth() + 1 < 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1) + date.getDate();
                    var now = date.getTime() / 1000 - 1;
                    var expired = now + 600;
                    var signTime = now + ';' + expired;
                    var signature = BK.Crypt.hex_hmac_sha1(credentials.tmpSecretKey, signTime);
                    var data = {
                        'tmpSecretId': tmpSecretId,
                        'upLoadPrefUrl': upLoadPrefUrl,
                        'downloadUrl': downLoadPrefUrl,
                        'sessionToken': sessionToken,
                        'signature': signature,
                        'signTime': signTime
                    };
                    callback(0, data);
                }
            } else {
                var date = new Date();
                var now = parseInt(date.getTime() / 1000) - 1;
                var data = {
                    'cmd': CMSHOW_CS_CMD_QUERY_CLOUD_SIGNATURE,
                    'now': now,
                    'delta': 600
                };
                if (callback) {
                    BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_QUERY_CLOUD_SIGNATURE, this);
                    BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_QUERY_CLOUD_SIGNATURE, this, function (errCode, cmd, data) {
                        callback(errCode, data);
                    });
                    BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_QUERY_CLOUD_SIGNATURE);
                }
            }
        };
        this.qGetRankBoard = function (gameOrientation, scoreAlias, unit, callback) {
            var cmd = 'cs.openWebViewWithoutUrl.local';
            var transparentNum = 1;
            var data = {
                'gameOrientation': gameOrientation,
                'openId': GameStatusInfo.openId,
                'transparent': transparentNum,
                'businessType': 2,
                'url': 'http://cmshow.qq.com/apollo/html/game-platform/general-chart.html?' + 'gameId=' + GameStatusInfo.gameId + '&_wwv=2' + '&gameOrientation=' + gameOrientation
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.qPayPurchase = function (gameOrientation, transparent, itemList, callback) {
            var cmd = 'cs.openWebViewWithoutUrl.local';
            var transparentNum = 1;
            if (transparent == true) {
                transparentNum = 1;
            } else {
                transparentNum = 0;
            }
            var data = {
                'gameOrientation': gameOrientation,
                'openId': GameStatusInfo.openId,
                'transparent': transparentNum,
                'businessType': 1,
                'itemList': itemList
            };
            if (callback) {
                var cbCmd = 'sc.apolloGameWebMessage.local';
                BK.MQQ.SsoRequest.removeListener(cbCmd, this);
                BK.MQQ.SsoRequest.addListener(cbCmd, this, function (errCode, cmd, data) {
                    if (errCode == 0) {
                        if (data.op && data.op == 'apolloGamePlatform.buyProps') {
                            callback(data.data.code, data.data);
                        }
                    }
                }.bind(this));
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.consumeItems = function (itemList, callback) {
            var cmd = 'apollo_game_item.consume_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'items': itemList
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    var succList = [];
                    var failList = [];
                    if (errCode == 0) {
                        succList = data.data.succList;
                        failList = data.data.failList;
                    }
                    callback(errCode, succList, failList);
                }.bind(this));
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.rollbackGameItems = function (itemList, callback) {
            var cmd = 'apollo_game_item.rollback_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'items': itemList
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    var succList = [];
                    var failList = [];
                    if (errCode == 0) {
                        succList = data.data.succList;
                        failList = data.data.failList;
                    }
                    callback(errCode, succList, failList);
                }.bind(this));
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.shareToMQQ = function (title, summary, detailUrl, picUrl) {
            var cmd = 'cs.share_game_result.local';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'gameVersion': GameStatusInfo.gameVersion,
                'roomId': GameStatusInfo.roomId,
                'title': title,
                'summary': summary,
                'detailUrl': detailUrl,
                'picUrl': picUrl
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.scoreUpload = function (scoreData, callback, arkData) {
            var cmd = 'apollo_aio_game.report_user_score_3rd';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'version': GameStatusInfo.gameVersion,
                'roomId': GameStatusInfo.roomId,
                'gData': scoreData
            };
            if (arkData) {
                data['arkData'] = arkData;
            }
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getRoomUserScoreInfo = function (roomId, callback) {
            var cmd = 'apollo_aio_game.get_room_info_3rd';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'version': GameStatusInfo.gameVersion,
                'roomId': roomId
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getUserGameinfo = function (openId, cycleType, callback) {
            var cmd = 'apollo_aio_game.get_user_gameinfo_3rd';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'version': GameStatusInfo.gameVersion,
                'roomId': GameStatusInfo.roomId,
                'toOpenId': openId,
                'cycleNum': cycleType
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getUserCurrencyInfo = function (currencyType, callback) {
            var cmd = 'apollo_aio_game.get_user_curreInfo';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId,
                'version': GameStatusInfo.gameVersion,
                'mask': currencyType
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getCmshowDressInfo = function (openId, callback) {
            var cmd = 'cs.get_dress_path.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            var data = { 'openId': openId };
            BK.MQQ.SsoRequest.send(data, 'cs.get_dress_path.local');
        };
        this.getGameItemList = function (callback) {
            var cmd = 'apollo_aio_game.get_game_itemList';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getUserGameItems = function (callback) {
            var cmd = 'apollo_aio_game.get_user_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'openId': GameStatusInfo.openId
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.buyGameItems = function (currencyType, items, callback) {
            var cmd = 'apollo_aio_game.buy_game_items';
            var data = {
                'cmd': cmd,
                'from': GameStatusInfo.platform,
                'gameId': GameStatusInfo.gameId,
                'curreType': currencyType,
                'itemIdList': items
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.notifyNewRoom = function (roomId, retCode) {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': roomId,
                'retcode': retCode
            };
            if (!this.gameCfg.roomId) {
                this.gameCfg.roomId = roomId;
            }
            BK.Script.log(0, 0, 'BK.QQ.notifyNewRoom!gameId = ' + data.gameId + ', roomId = ' + data.roomId + ', retCode = ' + retCode);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_CREATE_ROOM);
        };
        this.notifyHideGame = function () {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyHideGame!gameId = ' + data.gameId + ', roomId = ' + data.roomId);
            var isAndroid = GameStatusInfo.platform == 'android' ? 1 : 2;
            if (isAndroid == 1) {
                BK.Script.renderMode = 0;
                currentRenderMode = 0;
            }
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_MINI_WND);
        };
        this.notifyCloseGame = function () {
            this._closeRoom();
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyCloseGame!gameId = ' + data.gameId + ', roomId = ' + data.roomId);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_CLOSE_WND);
        };
        this.notifyReadyGame = function () {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GAME_READY);
        };
        this.notifyGameTips = function (tips) {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId,
                'tips': tips
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GAME_TIPS);
        };
        this.notifyGameTipsWaiting = function () {
            this.notifyGameTips('等待玩家加入');
        };
        this.notifyGameTipsSomeOneJoinRoom = function (nick) {
            this.notifyGameTips(nick + '加入房间');
        };
        this.notifyGameTipsSomeOneLeaveRoom = function (nick) {
            this.notifyGameTips(nick + '离开房间');
        };
        this.notifyGameTipsReady = function () {
            this.notifyGameTips('游戏即将开始');
        };
        this.notifyGameTipsPlaying = function () {
            this.notifyGameTips('游戏进行中');
        };
        this.notifyGameTipsGameOver = function () {
            this.notifyGameTips('游戏已结束');
        };
        this.inviteFriend = function (wording, roomId) {
            var cmd = 'cs.invite_friends.local';
            var data = {
                cmd: cmd,
                wording: wording,
                gameId: this.gameCfg.gameId,
                gameMode: 8,
                extendInfo: {}
            };
            if (roomId) {
                data.roomId = roomId;
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.uploadData = function (action, enter, result, param1, param2, param3) {
            var cmd = 'cs.report_data_2_compass.local';
            var gameId = this.gameCfg.gameId;
            if (this.gameCfg.platform == 'ios') {
                action = action.toString();
                result = result.toString();
            }
            var data = {
                'cmd': cmd,
                'actionName': action,
                'enter': enter,
                'entry': enter,
                'result': result,
                'r2': gameId.toString(),
                'r3': param1,
                'r4': param2,
                'r5': param3
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.sharePic = function (path) {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId,
                'path': path
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_SHARE_PIC);
        };
        this.addSSOJoinRoomCallBack = function (callback) {
            this.ssoJoinRoomCallbackPublic = callback;
        };
        this.checkPubAccountState = function (puin, callback) {
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE, this);
                BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE, this, callback);
            }
            var cmd = CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE;
            var data = {
                'cmd': cmd,
                'puin': puin
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.enterPubAccountCard = function (puin) {
            var cmd = CMSHOW_CS_CMD_ENTER_PUBACCOUNT_CARD;
            var data = {
                'cmd': cmd,
                'puin': puin
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.fetchOpenKey = function (callback) {
            var cmd = 'cs.on_get_open_key.local';
            var data = { 'gameId': GameStatusInfo.gameId };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.listenGameEventEnterBackground = function (obj, callback) {
            var cmd = 'sc.game_enter_background.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, obj);
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        };
        this.listenGameEventEnterForeground = function (obj, callback) {
            var cmd = 'sc.game_enter_foreground.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, obj);
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        };
        this.listenGameEventMaximize = function (obj, callback) {
            var cmd = 'sc.game_maximize.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, obj);
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        };
        this.listenGameEventMinimize = function (obj, callback) {
            var cmd = 'sc.game_minimize.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, obj);
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        };
        this._event4GetVIPInfo = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4GetVIPInfo!errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            if (this.delegate.onGetVIPInfoEvent) {
                this.delegate.onGetVIPInfoEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_SRV_IP_PORT, this);
        };
        this.notifyGetVIPInfo = function () {
            BK.MQQ.SsoRequest.send({}, CMSHOW_CS_CMD_GET_SRV_IP_PORT);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_SRV_IP_PORT, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_GET_SRV_IP_PORT, this, this._event4GetVIPInfo.bind(this));
        };
        this.notifySaveRecommVIP = function (ip, port) {
            BK.Script.log(0, 0, 'BK.QQ.notifySaveRecommVIP!ip = ' + ip + ', port = ' + port);
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.game.roomId,
                'ip': ip,
                'port': port
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_SAVE_RECOMM_VIP);
        };
        this._event4GetPlayerDress = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4GetPlayerDress!errCode = ' + errCode + ', cmd = ' + cmd + ', data = ' + JSON.stringify(data));
            if (this.delegate.onGetPlayerDressEvent) {
                this.delegate.onGetPlayerDressEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_PLAYER_DRESS, this);
        };
        this.notifyGetPlayerDress = function (openId) {
            var data = { 'openId': openId };
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_PLAYER_DRESS, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_GET_PLAYER_DRESS, this, this._event4GetPlayerDress.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GET_PLAYER_DRESS);
        };
        this._startGameLocal = function (retcode, resp) {
            var data = {
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId,
                'resp': resp,
                'retcode': retcode,
                'gameMode': this.gameCfg.gameMode
            };
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GAME_START);
        };
        this.notifyJoinRoom = function (newJoinPlayers, resp, retCode) {
            if (newJoinPlayers && newJoinPlayers.length > 0) {
                newJoinPlayers.forEach(function (player) {
                    var isMine = player.openId == currentPlayerOpenId ? true : false;
                    BK.Script.log(1, 1, 'player.openid=' + player.openId + ' currentPlayerOpenId=' + currentPlayerOpenId);
                    var avRoomId = 0;
                    if (resp && resp.data && resp.data.avRoomId) {
                        avRoomId = resp.data.avRoomId;
                    }
                    var sdkAppId = 0;
                    if (resp && resp.data && resp.data.sdkAppId) {
                        sdkAppId = resp.data.sdkAppId;
                    }
                    var accountType = 0;
                    if (resp && resp.data && resp.data.accountType) {
                        accountType = resp.data.accountType;
                    }
                    var someOneJoinGame = {
                        'gameId': this.gameCfg.gameId,
                        'openId': player.openId,
                        'isCreator': this.gameCfg.isCreator && player.openId == currentPlayerOpenId ? 1 : 0,
                        'roomId': this.gameCfg.roomId,
                        'resp': resp,
                        'retcode': retCode,
                        'gameMode': this.gameCfg.gameMode,
                        'avRoomId': avRoomId,
                        'sdkAppId': sdkAppId,
                        'accountType': accountType,
                        'isMine': isMine,
                        'isDisableSendMsg': 1
                    };
                    BK.Script.log(0, 0, 'BK.QQ.notifyJoinroom isDisableSendMsg: ' + someOneJoinGame.isDisableSendMsg);
                    BK.MQQ.SsoRequest.send(someOneJoinGame, CMSHOW_CS_CMD_JOIN_ROOM);
                }, this);
            } else {
                BK.Script.log(0, 0, 'BK.QQ.notifyJoinRoom!newJoinPlayers data error');
            }
        };
        this.sendGameMsg = function () {
            if (this.gameCfg.roomId && this.gameCfg.roomId > 0) {
                var JoinGameMsg = {
                    'gameId': this.gameCfg.gameId,
                    'openId': GameStatusInfo.openId,
                    'roomId': this.gameCfg.roomId,
                    'gameMode': this.gameCfg.gameMode
                };
                BK.Script.log(0, 0, 'SendGameMsg : gameId=' + JoinGameMsg.gameId + '  openId=' + JoinGameMsg.openId + ' roomId=' + JoinGameMsg.roomId + '  gameMode=' + JoinGameMsg.gameMode);
                BK.MQQ.SsoRequest.send(JoinGameMsg, CMSHOW_CS_CMD_SEND_GAME_MSG);
            }
        };
        this.shareToArk = function (roomId, summary, picPath, isSelectFriend, extendInfo, callback) {
            if (BK.Misc.compQQVersion(GameStatusInfo.QQVer, '7.6.3')) {
                this._oldShareToArk(roomId, summary, picPath, isSelectFriend, extendInfo, callback);
            } else {
                var data = {
                    summary: summary,
                    extendInfo: extendInfo,
                    localPicPath: '',
                    picUrl: '',
                    activityId: 0,
                    reqCode: 1
                };
                if (picPath.indexOf('GameRes://') == 0 || picPath.indexOf('GameSandBox://') == 0) {
                    data.localPicPath = picPath;
                } else {
                    data.picUrl = picPath;
                }
                this.share(data, callback);
            }
        };
        this.share = function (data, callback) {
            if (callback) {
                var cmd = 'sc.share_game_to_friend_result.local';
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    callback(errCode, cmd, data);
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                }.bind(this));
            }
            BK.Script.log(0, 0, 'share ' + JSON.stringify(data));
            BK.MQQ.SsoRequest.send(data, 'cs.game_shell_share_callback.local');
        };
        this._oldShareToArk = function (roomId, summary, picUrl, isSelectFriend, extendInfo, callback) {
            if (typeof isSelectFriend == 'boolean') {
                isSelectFriend = isSelectFriend == true ? 1 : 0;
            }
            var data = {
                'summary': summary,
                'picUrl': picUrl,
                'gameId': this.gameCfg.gameId,
                'roomId': roomId,
                'gameMode': this.gameCfg.gameMode,
                'isSelectFriend': isSelectFriend,
                'extendInfo': extendInfo
            };
            if (callback) {
                var cmd = 'sc.share_game_to_friend_result.local';
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    callback(errCode, cmd, data);
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                });
            }
            BK.Script.log(0, 0, 'ShareToArk summary=' + data.summary + ' roomId=' + data.roomId + '  gameMode=' + data.gameMode + 'picUrl=' + data.picUrl + '  gameId=' + data.gameId);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_SHARE_IN_ARK);
        };
        this._event4QuitGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4QuitGame errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            if (this.delegate.onQuitGameEvent) {
                this.delegate.onQuitGameEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_QUIT_GAME, this);
        };
        this._event4CancelGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4CancelGame errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            if (this.delegate.onCancelGameEvent) {
                this.delegate.onCancelGameEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CANCEL_GAME, this);
        };
        this.notifyQuitGameSrv = function () {
            var data = {
                'cmd': CMSHOW_SRV_CMD_QUIT_GAME,
                'from': this.gameCfg.platform,
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyQuitGameSrv!' + ', cmd = ' + data.cmd + ', from = ' + data.from + ', gameId = ' + data.gameId + ', roomId = ' + data.roomId);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_QUIT_GAME, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_QUIT_GAME, this, this._event4QuitGame.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_QUIT_GAME);
        };
        this.notifyCancelGameSrv = function () {
            var data = {
                'cmd': CMSHOW_SRV_CMD_CANCEL_GAME,
                'from': this.gameCfg.platform,
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyCancelGameSrv!' + ', cmd = ' + data.cmd + ', from = ' + data.from + ', gameId = ' + data.gameId + ', roomId = ' + data.roomId);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CANCEL_GAME, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_CANCEL_GAME, this, this._event4CancelGame.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_CANCEL_GAME);
        };
        this._event4StartGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4StartGame! errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            this.hasStartGameSucc = errCode == 0 ? true : false;
            this._startGameLocal(errCode, data);
            if (this.delegate.onStartGameEvent) {
                this.delegate.onStartGameEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_START_GAME, this);
        };
        this.notifyStartGameSrv = function () {
            var data = {
                'cmd': CMSHOW_SRV_CMD_START_GAME,
                'from': this.gameCfg.platform,
                'gameId': this.gameCfg.gameId,
                'roomId': this.gameCfg.roomId
            };
            BK.Script.log(0, 0, 'BK.QQ.notifyStartGameSrv!' + ', cmd = ' + data.cmd + ', from = ' + data.from + ', gameId = ' + data.gameId + ', roomId = ' + data.roomId);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_START_GAME, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_START_GAME, this, this._event4StartGame.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_START_GAME);
        };
        this._event4JoinRoom = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4JoinRoom errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            this.hasJoinRoomSucc = errCode == 0 ? true : false;
            if (this.delegate.onJoinRoomEvent) {
                this.delegate.onJoinRoomEvent(errCode, cmd, data);
            }
            BK.QQ.notifyJoinRoom(this.newJoinPlayers, data, errCode);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_JOIN_ROOM, this);
            if (this.ssoJoinRoomCallback) {
                this.ssoJoinRoomCallback(errCode, cmd, data);
            }
            if (this.ssoJoinRoomCallbackPublic) {
                data['gameId'] = this.gameCfg.gameId;
                data['gameRoomId'] = this.gameCfg.roomId;
                data['avRoomId'] = data.data.avRoomId ? data.data.avRoomId : 0, data['sdkAppId'] = data.data.sdkAppId ? data.data.sdkAppId : 0, data['accountType'] = data.data.accountType ? data.data.accountType : 0, this.ssoJoinRoomCallbackPublic(errCode, cmd, data);
            }
        };
        this.notifyNewOrJoinRoomSrv = function (newJoinPlayers, roomId, isCreator) {
            var data = {
                'cmd': CMSHOW_SRV_CMD_JOIN_ROOM,
                'from': this.gameCfg.platform,
                'aioType': this.gameCfg.aioType,
                'gameId': this.gameCfg.gameId,
                'version': this.gameCfg.gameVersion,
                'roomId': roomId,
                'opType': isCreator,
                'gameMode': this.gameCfg.gameMode,
                'roomVol': this.roomVol,
                'arkData': this.arkData
            };
            BK.Script.log(1, 1, 'BK.QQ.notifyNewOrJoinRoomSrv!' + ', cmd = ' + data.cmd + ', from = ' + data.from + ', aioType = ' + data.aioType + ', gameId = ' + data.gameId + ', version = ' + data.version + ', roomId = ' + data.roomId + ', opType = ' + data.opType);
            this.newJoinPlayers = newJoinPlayers;
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_JOIN_ROOM, this);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_JOIN_ROOM, this, this._event4JoinRoom.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_JOIN_ROOM);
        };
        this._customGameLogicCallBack = undefined;
        this._event4CustomLogic = function (errCode, cmd, data) {
            if (this._customGameLogicCallBack != undefined) {
                this._customGameLogicCallBack(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC, this);
        };
        this.reqCustomLogic = function (data, callback) {
            if (data != undefined) {
                this._customGameLogicCallBack = callback;
                BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC, this);
                BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC, this, this._event4CustomLogic.bind(this));
                BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC);
            } else {
                BK.Script.log(0, 0, 'reqCustomLogic data undefined!');
            }
        };
        this._getRankListLogicCallBack = undefined;
        this._event4GetRankList = function (errCode, cmd, data) {
            BK.Script.log(1, 1, 'BK.QQ.reqGetRankList! callback cmd' + cmd + ' errCode:' + errCode + '  data:' + JSON.stringify(data));
            if (this._getRankListLogicCallBack != undefined) {
                this._getRankListLogicCallBack(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_GET_RANK_LIST, this);
        };
        this.getRankList = function (callback, reqConfig) {
            var data = {
                'cmd': CMSHOW_SRV_GET_RANK_LIST,
                'from': 'default',
                'objType': 1,
                'objId': 0,
                'busType': 3,
                'busId': this.gameCfg.gameId.toString()
            };
            if (reqConfig) {
                if (reqConfig.objType) {
                    data.objType = reqConfig.objType;
                }
                if (reqConfig.objId) {
                    data.objId = reqConfig.objId;
                }
                if (reqConfig.from) {
                    data.from = reqConfig.from;
                }
            }
            BK.Script.log(1, 1, 'BK.QQ.reqGetRankList! ' + JSON.stringify(data));
            if (data != undefined) {
                this._getRankListLogicCallBack = callback;
                BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_GET_RANK_LIST, this);
                BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_GET_RANK_LIST, this, this._event4GetRankList.bind(this));
                BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_GET_RANK_LIST);
            } else {
                BK.Script.log(0, 0, 'reqGetRankList data undefined!');
            }
        };
        this._pushPublicMsgCallBack = undefined;
        this._event4PushPublicMsg = function (errCode, cmd, data) {
            BK.Script.log(1, 1, 'BK.QQ.pushPublicMsg! callback cmd' + cmd + ' errCode:' + errCode + '  data:' + JSON.stringify(data));
            if (this._pushPublicMsgCallBack != undefined) {
                this._pushPublicMsgCallBack(errCode, cmd, data);
            }
        };
        this.pushPublicMsg = function (callback, reqConfig) {
            var data = {
                'gameid': this.gameCfg.gameId,
                'templateid': reqConfig.templateid,
                'report_ts': reqConfig.report_ts,
                'tmpl_param': reqConfig.tmpl_param
            };
            BK.Script.log(1, 1, 'BK.QQ.pushPublicMsg! ' + JSON.stringify(data));
            if (data != undefined) {
                this._pushPublicMsgCallBack = callback;
                BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_PUSH_PUBLIC_MSG, this);
                BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_PUSH_PUBLIC_MSG, this, this._event4PushPublicMsg.bind(this));
                BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_PUSH_PUBLIC_MSG);
            } else {
                BK.Script.log(0, 0, 'pushPublicMsg data undefined!');
            }
        };
        this.hasJoinRoom = function () {
            return this.hasJoinRoomSucc;
        };
        this.hasStartGame = function () {
            return this.hasStartGameSucc;
        };
        this._event4StopGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, 'BK.QQ._event4StopGame!errCode = ' + errCode + ' cmd = ' + cmd + ' data = ' + JSON.stringify(data));
            this._closeRoom();
            if (this.delegate.onStopGameEvent) {
                this.delegate.onStopGameEvent(errCode, cmd, data);
            }
        };
        this._closeRoom = function (needSSOServer) {
            BK.QQ.isNeedSSOServer = needSSOServer != undefined && needSSOServer != null ? needSSOServer : true;
            if (Boolean(BK.QQ.isNeedSSOServer) == true) {
                if (!this.hasStartGameSucc) {
                    if (this.gameCfg.roomId && this.gameCfg.roomId != 0) {
                        if (this.gameCfg.isCreator) {
                            this.notifyCancelGameSrv();
                        } else {
                            this.notifyQuitGameSrv();
                        }
                    }
                }
            }
        };
        this.uploadScoreWithoutRoom = function (gameMode, scoreData, callback) {
            var cmd = 'apollo_report_result.single_user_result';
            var ts = Math.floor(new Date().getTime() / 1000);
            var data = {
                from: GameStatusInfo.platform,
                gameId: GameStatusInfo.gameId,
                openId: GameStatusInfo.openId,
                version: GameStatusInfo.gameVersion,
                aioType: GameStatusInfo.aioType,
                ts: ts.toString(),
                src: GameStatusInfo.src,
                mode: gameMode !== undefined ? gameMode : 1,
                userData: scoreData.userData,
                attr: scoreData.attr
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.getRankListWithoutRoom = function (attr, order, rankType, callback) {
            var cmd = 'apollo_router_game.apollo_user_rankinglist_linkcmd_custom_ranking';
            var ts = Math.floor(new Date().getTime() / 1000);
            var data = {
                from: GameStatusInfo.platform,
                gameId: GameStatusInfo.gameId,
                openId: GameStatusInfo.openId,
                version: GameStatusInfo.gameVersion,
                ts: ts.toString(),
                attr: attr !== undefined ? attr : 'score',
                order: order !== undefined ? order : 1,
                rankType: rankType !== undefined ? rankType : 0
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.saveGameData = function (json_data, callback) {
            var cmd = 'apollo_private_data.set_user_data';
            var ts = Math.floor(new Date().getTime() / 1000);
            var data = {
                openId: GameStatusInfo.openId,
                gameId: GameStatusInfo.gameId,
                version: GameStatusInfo.gameVersion,
                from: GameStatusInfo.platform,
                ts: ts.toString(),
                data: json_data
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.loadGameData = function (callback) {
            var cmd = 'apollo_private_data.get_user_data';
            var ts = Math.floor(new Date().getTime() / 1000);
            var data = {
                openId: GameStatusInfo.openId,
                gameId: GameStatusInfo.gameId,
                version: GameStatusInfo.gameVersion,
                from: GameStatusInfo.platform,
                ts: ts.toString()
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        this.reportGameResult = function (resultData, callback) {
            var cmd = 'apollo_router_game.apollo_reportcm_linkcmd_game_result';
            resultData.gameId = GameStatusInfo.gameId;
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(resultData, cmd);
        };
        this.updateScoreLocal = function (score) {
            var cmd = 'cs.game_update_score.local';
            BK.MQQ.SsoRequest.send({
                gameId: GameStatusInfo.gameId,
                score: score
            }, cmd);
        };
        this.getRedPacketResult = function (score, callback) {
            var cmd = 'cs.get_redPacket_result.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send({
                gameId: GameStatusInfo.gameId,
                score: score
            }, cmd);
        };
        this.listenRedPacketEvent = function (callback) {
            var cmd = 'sc.web_callback_game.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
        };
        this.skipGame = function (desGameId, extendInfo) {
            var cmd = 'cs.create_game.local';
            var data = {
                'gameId': desGameId,
                'extendInfo': extendInfo,
                'src': 302
            };
            BK.MQQ.SsoRequest.send(data, cmd);
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            month = ('' + month).length < 2 ? '0' + month : month;
            day = '' + day < 2 ? '0' + day : day;
            hour = '' + hour < 2 ? '0' + hour : hour;
            var time = '' + year + month + day + hour;
            var fieldsData = 'busi_id=4&&action_source=302&&action_type=34&&action_id=gameAtoB&&item_id=' + GameStatusInfo.gameId + '&&ext1=' + desGameId + '&&ext2=' + time;
            var reportData = {
                'cmd': 'apollo_router_game.game_extend_linkcmd_send_compass',
                'from': GameStatusInfo.platform + '.cmshow_create_game',
                'dcId': 'dc03153',
                'busiId': 4,
                'fieldsData': fieldsData
            };
            BK.QQ.scoreUpload(reportData, function (err, cmd, data) {
                BK.Script.log(0, 0, ' skip game errCode = ' + err);
            });
        };
        BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_STOP_GAME, this, this._event4StopGame.bind(this));
    }();
}();
BK.Room = function () {
    this.roomId;
    this.gameId;
    this.mId;
    this.ownerId;
    this.createTs;
    this.status;
    this.playerNum;
    this.ip0;
    this.ip1;
    this.msgSeq = 1;
    this.ackSeq;
    this.lastFrame = 0;
    this.startGameTs = 0;
    this.createRoomCallBack;
    this.queryRoomInfoCallBack;
    this.joinRoomCallBack;
    this.leaveRoomCallBack;
    this.startGameCallBack;
    this.broadcastDataCallBack;
    this.sensitiveWordCallBack;
    this.setUserDataCallBack;
    this.getUserDataCallBack;
    this.sendSyncOptCallBack;
    this.forceStopGameCallBack;
    this.frameSyncListener;
    this.queryFrameDataCallBack;
    this.matchGameCallBack;
    this.queryMatchGameCallBack;
    this.quitMatchGameCallBack;
    this.disconnectNetCallBack;
    this.reJoinRoomCallBack;
    this.socket = new BK.Socket();
    this.reqArray = new Array();
    this.newJoinPlayers = [];
    this.currentPlayers = [];
    this.isCreator = GameStatusInfo.isMaster == 1 ? true : false;
    this.gameStatusInfo = GameStatusInfo;
    this.serverConnected;
    this._environment = GameStatusInfo.isWhiteUser;
    this.headerVersion = 769;
    this.recommandRoomSvrHost = NormalRecommandRoomSvrHost;
    this.recommandRoomSvrPort = NormalRecommandRoomSvrPort;
    this.netTimeOutTs = 0;
    this.options = null;
    this.setArkData = function (modeWording) {
        BK.QQ.setArkData(modeWording);
    };
    this.setRoomVol = function (roomVol) {
        BK.QQ.roomVol = roomVol;
    };
    this.read32BytesToString = function (buff) {
        var str = '';
        for (var i = 0; i < 32; i++) {
            var ch = buff.readUint8Buffer();
            str = str + String.fromCharCode(ch);
        }
        return str;
    };
    this.writeOpenIdIntoBuffer = function (buffer, openId) {
        var writeBuf = new BK.Buffer(32);
        if (openId.length == 32) {
            for (var i = 0; i < 32; i++) {
                var ascii = openId.charCodeAt(i);
                writeBuf.writeUint8Buffer(ascii);
            }
        } else {
            for (var i = 0; i < 32; i++) {
                writeBuf.writeUint8Buffer(0);
            }
            BK.Script.log(0, 0, 'writeOpenIdIntoBuffer.length is not 32 bytes,Write empty data');
        }
        buffer.writeBuffer(writeBuf);
    };
    this.addHeader = function (header, len, stLen) {
        header.writeUint16Buffer(4660);
        header.writeUint16Buffer(this.headerVersion);
        header.writeUint16Buffer(0);
        header.writeUint16Buffer(stLen);
        header.writeUint32Buffer(len);
    };
    this.addFixedHeader = function (buff, cmd, gameId, roomId, fromId, toId, token, appId, accessToken) {
        if (toId == undefined) {
            toId = '';
        }
        if (token == undefined) {
            token = 0;
        }
        if (appId == undefined) {
            appId = 0;
        }
        if (accessToken == undefined) {
            accessToken = 0;
        }
        buff.writeUint16Buffer(72);
        buff.writeUint16Buffer(cmd);
        buff.writeUint32Buffer(0);
        buff.writeUint64Buffer(1111);
        buff.writeUint64Buffer(gameId);
        buff.writeUint64Buffer(roomId);
        this.writeOpenIdIntoBuffer(buff, fromId);
        this.writeOpenIdIntoBuffer(buff, toId);
        buff.writeUint64Buffer(token);
        buff.writeUint64Buffer(appId);
        buff.writeUint64Buffer(accessToken);
    };
    this.getHeader = function (buff) {
        var magic = buff.readUint16Buffer();
        var ver = buff.readUint16Buffer();
        var seq = buff.readUint16Buffer();
        var stlen = buff.readUint16Buffer();
        var bodyLen = buff.readUint32Buffer();
        var header = new Object();
        header.magic = magic;
        header.ver = ver;
        header.stlen = stlen;
        header.bodyLen = bodyLen;
        header.seq = seq;
        return header;
    };
    this.getFixedHeader = function (buff) {
        var fixLen = buff.readUint16Buffer();
        var cmd = buff.readUint16Buffer();
        var ret = buff.readUint32Buffer();
        var date = buff.readUint64Buffer();
        var gameId = buff.readUint64Buffer();
        var roomId = buff.readUint64Buffer();
        var fromId = '';
        var toId = '';
        fromId = this.read32BytesToString(buff);
        toId = this.read32BytesToString(buff);
        var token = buff.readUint64Buffer();
        var appId = buff.readUint64Buffer();
        var accessToken = buff.readUint64Buffer();
        var fixHead = new Object();
        fixHead.fixLen = fixLen;
        fixHead.cmd = cmd;
        fixHead.ret = ret;
        fixHead.date = date;
        fixHead.gameId = gameId;
        fixHead.roomId = roomId;
        fixHead.fromId = fromId;
        fixHead.toId = toId;
        fixHead.token = token;
        fixHead.appId = appId;
        fixHead.accessToken = accessToken;
        return fixHead;
    };
    this.matchGame = function (gameId, openId, callback) {
        this.mId = openId;
        this.gameId = parseInt(gameId);
        BK.QQ.gameCfg.gameMode = 6;
        GameStatusInfo.gameMode = 6;
        var con = this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
        BK.Script.log(0, 0, 'socket con =' + con);
        if (con == -1) {
            BK.Script.log(0, 0, 'socket connect failed! ' + con);
        } else {
            this.serverConnected = 1;
        }
        this.matchGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 36;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'createRoom ');
    };
    this.requestMatch = function (gameId, openId) {
        BK.Script.log(0, 0, 'match game request in');
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 36, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'match game request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this.queryMatchGame = function (gameId, openId, callback) {
        BK.Script.log(0, 0, 'queryMatchGame in ');
        this.mId = openId;
        this.gameId = parseInt(gameId);
        this.queryMatchGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 38;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
    };
    this.requestQueryMatch = function (gameId, openId) {
        BK.Script.log(0, 0, 'query match game request in');
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 38, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'query match game request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this.quitMatchGame = function (gameId, openId, callback) {
        BK.Script.log(0, 0, 'quitMatchGame in ');
        this.mId = openId;
        this.gameId = parseInt(gameId);
        this.quitMatchGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 40;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
    };
    this.requestQuitMatch = function (gameId, openId) {
        BK.Script.log(0, 0, 'quit match game request in');
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 40, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'quit match game request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this.createRoom = function (gameId, openId, callback) {
        this.mId = openId;
        this.gameId = parseInt(gameId);
        if (this.serverConnected != 1) {
            var con = this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
            BK.Script.log(0, 0, 'socket con =' + con);
            if (con == -1) {
                BK.Script.log(0, 0, 'socket connect failed! ' + con);
            } else {
                this.serverConnected = 1;
            }
        }
        this.createRoomCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 6;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'createRoom ');
    };
    this.requestCreateRoom = function (gameId, openId) {
        BK.Script.log(0, 0, 'create room request in');
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 6, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'create room request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this.requestQueryRoom = function () {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 10, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.queryRoom = function (gameId, roomId, fromId, callback) {
        this.mId = fromId;
        this.roomId = parseFloat(roomId);
        this.gameId = parseInt(gameId);
        ;
        this.queryRoomInfoCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 10;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'queryRoom push');
    };
    this.joinRoom = function (src, callback, notify, needSSOServer) {
        this.joinRoomCallBack = callback;
        BK.QQ.isNeedSSOServer = needSSOServer != undefined && needSSOServer != null ? needSSOServer : true;
        BK.Script.log(0, 0, 'BK.QQ.notifyJoinroom isDisableSendMsg   isAuto: ' + notify + ',isAutoSendJoin:  ' + BK.QQ.isAutoSendJoinRoomNotify);
        var funObj = new Object();
        funObj.cmd = 2;
        funObj.arg0 = src;
        this.reqArray.push(funObj);
    };
    this.requestJoinRoom = function (src) {
        BK.Script.log(0, 0, 'join room request');
        var body = new BK.Buffer(fixedHeaderLen + 5, 1);
        this.addFixedHeader(body, 2, this.gameId, this.roomId, this.mId);
        var tlv = new BK.TLV(5);
        tlv.bkJSTLVWriteUInt8(src, TLVType.Uint8, 201);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.setReJoinRoomCallBack = function (callback) {
        this.reJoinRoomCallBack = callback;
    };
    this.reConnectAndJoinRoom = function () {
        var con = this.socket.connect(this.gameSvrIp, this.gameSvrPort);
        BK.Script.log(0, 0, 'socket con =' + con);
        if (con == -1) {
            BK.Script.log(0, 0, 'socket connect failed! ' + con);
            return -1;
        } else {
            this.serverConnected = 1;
        }
        if (con == 0) {
            BK.Script.log(0, 0, 'socket connect =0 ');
        }
        if (con >= 0) {
            BK.Script.log(0, 0, 'rejoinroom send');
            this.joinRoom(1, function (statusCode, room) {
                BK.Script.log(0, 0, 'rejoinroom statusCode:' + statusCode + ' roomid is ' + room.roomId);
                if (this.reJoinRoomCallBack) {
                    this.reJoinRoomCallBack(statusCode, this);
                }
            });
        }
    };
    this.leaveRoom = function (callback, reason) {
        if (reason == undefined) {
            reason = -1;
        }
        ;
        var funObj = new Object();
        funObj.cmd = 4;
        funObj.arg0 = reason;
        this.reqArray.push(funObj);
        this.leaveRoomCallBack = callback;
        BK.Script.log(0, 0, 'leaveRoom push');
    };
    this.setLeaveRoomCallback = function (callback) {
        this.leaveRoomCallBack = callback;
    };
    this.requestLeaveRoom = function (reason) {
        var tlv = new BK.TLV(40 + 4);
        var buf = new BK.Buffer(40, 1);
        this.writeOpenIdIntoBuffer(buf, this.mId);
        buf.writeUint64Buffer(reason);
        tlv.bkJSTLVWriteBuffer(buf, TLVType.Byte, 201);
        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 4, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        var st = BK.Security.getST();
        var stlen = st.bufferLength();
        ;
        BK.Security.encrypt(body);
        buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, 'leave room buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
        return buff;
    };
    this._startGame = function (callback) {
        this.startGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 8;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'startGame push');
    };
    this.startGame = function (callback) {
        if (GameStatusInfo.devPlatform) {
            BK.Script.log(0, 0, 'startGame dev:');
            this._startGame(callback);
        } else if (BK.QQ.hasJoinRoomSucc == true) {
            BK.Script.log(0, 0, 'startGame qq:cmsrv confirm joinRoom response');
            this._startGame(callback);
        } else {
            BK.Script.log(0, 0, 'startGame qq:waiting cmsvr joiroom response');
            BK.QQ.delegate.onJoinRoomEvent = function (errCode, cmd, data) {
                BK.Script.log(0, 0, 'startGame qq:wait finish.start Game');
                this._startGame(callback);
            }.bind(this);
        }
    };
    this.setStartGameCallback = function (callback) {
        this.startGameCallBack = callback;
    };
    this.requestStartGame = function () {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 8, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.setBroadcastDataCallBack = function (callback) {
        this.broadcastDataCallBack = callback;
    };
    this.sendBroadcastData = function (buff) {
        var funObj = new Object();
        funObj.cmd = 1;
        funObj.arg0 = buff;
        this.reqArray.push(funObj);
    };
    this.requestsendBroadcastData = function (buf) {
        var bufLen = buf.capacity ? buf.capacity : buf.bufferLength();
        var body = new BK.Buffer(fixedHeaderLen + bufLen, 1);
        this.addFixedHeader(body, 1, this.gameId, this.roomId, this.mId);
        body.writeBuffer(buf);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.setSensitiveWordCallBack = function (callback) {
        this.sensitiveWordCallBack = callback;
    };
    this.sendSensitiveWordData = function (buff) {
        var funObj = new Object();
        funObj.cmd = 50;
        funObj.arg0 = buff;
        this.reqArray.push(funObj);
    };
    this.requestSendSendSensitiveWordData = function (buf) {
        var bufLen = buf.capacity ? buf.capacity : buf.bufferLength();
        var body = new BK.Buffer(fixedHeaderLen + bufLen, 1);
        this.addFixedHeader(body, 50, this.gameId, this.roomId, this.mId);
        body.writeBuffer(buf);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.setUserData = function (buff, callback) {
        BK.Script.log(0, 0, 'setUserData call');
        this.setUserDataCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 32;
        funObj.arg0 = buff;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'setUserData push');
    };
    this.requestSetUserData = function (buf) {
        var bufLen = buf.capacity ? buf.capacity : buf.bufferLength();
        var body = new BK.Buffer(fixedHeaderLen + bufLen, 1);
        this.addFixedHeader(body, 32, this.gameId, this.roomId, this.mId);
        body.writeBuffer(buf);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.getUserData = function (roomId, callback) {
        if (roomId == undefined) {
            roomId = 0;
        }
        this.getUserDataCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 34;
        funObj.arg0 = roomId;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, 'getUserData push roomId = ' + roomId);
    };
    this.requestGetUserData = function (roomId) {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 34, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.syncOpt = function (statusBuf, optBuf, extendBuf, itemListBuf, callback) {
        this.sendSyncOptCallBack = callback;
        var funObj = new Object();
        ;
        funObj.cmd = 14;
        funObj.arg0 = statusBuf;
        funObj.arg1 = optBuf;
        funObj.arg2 = extendBuf;
        funObj.arg3 = itemListBuf;
        this.reqArray.push(funObj);
    };
    this.sendSyncOpt = function (opt, callback) {
        var status = new BK.Buffer(1, 1);
        status.writeUint8Buffer(0);
        var extend = new BK.Buffer(1, 1);
        extend.writeUint8Buffer(0);
        this.syncOpt(status, opt, extend, undefined, callback);
    };
    this.requestSyncOpt = function (statusBuf, optBuf, extendBuf, itemListBuf) {
        var statusBufLen = statusBuf.capacity ? statusBuf.capacity : statusBuf.bufferLength();
        var optBufLen = optBuf.capacity ? optBuf.capacity : optBuf.bufferLength();
        var extendBufLen = extendBuf.capacity ? extendBuf.capacity : extendBuf.bufferLength();
        var sendTlvLen = 8 + 8 + 4 + statusBufLen + 4 + optBufLen + 4 + extendBufLen;
        if (itemListBuf) {
            var itemListBufLen = itemListBuf.capacity ? itemListBuf.capacity : itemListBuf.bufferLength();
            sendTlvLen = sendTlvLen + 4 + itemListBufLen;
            BK.Script.log(0, 0, 'requestSyncOpt with item len' + itemListBufLen);
        }
        var tlv = new BK.TLV(sendTlvLen);
        tlv.bkJSTLVWriteUInt32(this.msgSeq, TLVType.Uint32, 201);
        tlv.bkJSTLVWriteUInt32(this.lastFrame, TLVType.Uint32, 202);
        tlv.bkJSTLVWriteBuffer(statusBuf, TLVType.Byte, 203);
        tlv.bkJSTLVWriteBuffer(optBuf, TLVType.Byte, 204);
        tlv.bkJSTLVWriteBuffer(extendBuf, TLVType.Byte, 205);
        if (itemListBuf) {
            tlv.bkJSTLVWriteBuffer(itemListBuf, TLVType.Byte, 206);
        }
        BK.Script.log(0, 0, 'requestSyncOpt this.msgSeq:' + this.msgSeq + ' this.lastFrame:' + this.lastFrame);
        var res = tlv.bkJSParseTLV();
        BK.Script.log(0, 0, 'requestSyncOpt tlv len:' + tlv.bkJSTLVGetLength() + ' fix header:' + fixedHeaderLen);
        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 14, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        this.msgSeq += 1;
        return buff;
    };
    this.setFrameSyncListener = function (listener) {
        this.frameSyncListener = listener;
    };
    this.queryFrameData = function (beginFrame, count, callback) {
        this.queryFrameDataCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 18;
        funObj.arg0 = beginFrame;
        funObj.arg1 = count;
        this.reqArray.push(funObj);
    };
    this.requestQueryFrameData = function (beginFrame, count) {
        var tlv = new BK.TLV(8 + 8 + 6);
        tlv.bkJSTLVWriteUInt32(this.lastFrame, TLVType.Uint32, 201);
        tlv.bkJSTLVWriteUInt32(beginFrame, TLVType.Uint32, 202);
        tlv.bkJSTLVWriteUInt16(count, TLVType.Uint16, 203);
        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 18, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.sendControlCommand = function (subcmd, data, openKey, callback) {
        var funObj = new Object();
        funObj.cmd = 48;
        funObj.arg0 = subcmd;
        funObj.arg1 = data;
        funObj.arg2 = openKey;
        this.reqArray.push(funObj);
        this.controlCommandCallback = callback;
    };
    this.requestControlCommand = function (subcmd, data, openkey) {
        var tlv = new BK.TLV(14 + data.bufferLength() + openkey.bufferLength());
        tlv.bkJSTLVWriteBuffer(data, TLVType.Byte, 201);
        tlv.bkJSTLVWriteUInt16(subcmd, TLVType.Uint16, 202);
        tlv.bkJSTLVWriteBuffer(openkey, TLVType.Byte, 203);
        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 48, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        BK.Security.encrypt(body);
        var st = BK.Security.getST();
        var stlen = st.bufferLength();
        var buffer = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buffer, body.bufferLength(), stlen);
        buffer.writeBuffer(st);
        buffer.writeBuffer(body);
        return buffer;
    };
    this.sendKeepAlive = function () {
        var funObj = new Object();
        funObj.cmd = 12;
        this.reqArray.push(funObj);
        if (this.netTimeOutTs != 0) {
            var now = BK.Time.timestamp;
            var netCost = now - this.netTimeOutTs;
            if (netCost > 5) {
                if (this.disconnectNetCallBack) {
                    this.disconnectNetCallBack();
                }
            }
        } else {
        }
    };
    this.requestSendKeepAlive = function () {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 12, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        ;
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    };
    this.recvCreateRoom = function (buff, bodyLen) {
        BK.Script.log(0, 0, 'recvCreateRoom bodyLen=' + bodyLen);
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (res) {
            var buffer = res.tag202;
            var ipType = buffer.readUint8Buffer();
            var resServe = buffer.readUint8Buffer();
            var port = buffer.readUint16Buffer();
            buffer.readUint64Buffer();
            buffer.readUint32Buffer();
            var ip0 = buffer.readUint8Buffer();
            var ip1 = buffer.readUint8Buffer();
            var ip2 = buffer.readUint8Buffer();
            var ip3 = buffer.readUint8Buffer();
            var buffer2 = res.tag201;
            var ipType2 = buffer2.readUint8Buffer();
            var resServe2 = buffer2.readUint8Buffer();
            var port2 = buffer2.readUint16Buffer();
            buffer2.readUint64Buffer();
            buffer2.readUint32Buffer();
            var ip0_2 = buffer2.readUint8Buffer();
            var ip1_2 = buffer2.readUint8Buffer();
            var ip2_2 = buffer2.readUint8Buffer();
            var ip3_2 = buffer2.readUint8Buffer();
            var netAddr = new Object();
            netAddr.ipType_1 = ipType;
            netAddr.resServe_1 = resServe;
            netAddr.ipType_2 = ipType2;
            netAddr.resServe_2 = resServe2;
            netAddr.port_1 = port;
            netAddr.ip_1 = ip0 + '.' + ip1 + '.' + ip2 + '.' + ip3;
            netAddr.port_2 = port2;
            netAddr.ip_2 = ip0_2 + '.' + ip1_2 + '.' + ip2_2 + '.' + ip3_2;
            this.ip0 = netAddr.ip_1;
            this.ip1 = netAddr.ip_2;
            return netAddr;
        } else {
            BK.Script.log(0, 0, 'recvCreateRoom parse failed.');
            return undefined;
        }
    };
    this.recvQueryRoom = function (buff, bodyLen) {
        BK.Script.log(0, 0, 'recvQueryRoom bodyLen:' + bodyLen);
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (res) {
            var buffer = res.tag202;
            var ipType = buffer.readUint8Buffer();
            var resServe = buffer.readUint8Buffer();
            var port = buffer.readUint16Buffer();
            buffer.readUint64Buffer();
            buffer.readUint32Buffer();
            var ip0 = buffer.readUint8Buffer();
            var ip1 = buffer.readUint8Buffer();
            var ip2 = buffer.readUint8Buffer();
            var ip3 = buffer.readUint8Buffer();
            var buffer2 = res.tag201;
            var ipType2 = buffer2.readUint8Buffer();
            var resServe2 = buffer2.readUint8Buffer();
            var port2 = buffer2.readUint16Buffer();
            buffer2.readUint64Buffer();
            buffer2.readUint32Buffer();
            var ip0_2 = buffer2.readUint8Buffer();
            var ip1_2 = buffer2.readUint8Buffer();
            var ip2_2 = buffer2.readUint8Buffer();
            var ip3_2 = buffer2.readUint8Buffer();
            var buffer3 = res.tag203;
            var ownerId = this.read32BytesToString(buffer3);
            var createTs = buffer3.readUint64Buffer();
            var status = buffer3.readUint8Buffer();
            var playerNum = buffer3.readUint8Buffer();
            var ext_num = res.tag205;
            if (ext_num == undefined) {
                ext_num = 0;
            }
            var players = [];
            for (var i = 0; i < playerNum; i++) {
                var player = {};
                player.uid = this.read32BytesToString(buffer3);
                ;
                player.status = buffer3.readUint8Buffer();
                ;
                players.push(player);
            }
            var roomInfo = new Object();
            roomInfo.ipType_1 = ipType;
            roomInfo.resServe_1 = resServe;
            roomInfo.ipType_2 = ipType2;
            roomInfo.resServe_2 = resServe2;
            roomInfo.port_1 = port;
            roomInfo.ip_1 = ip0 + '.' + ip1 + '.' + ip2 + '.' + ip3;
            roomInfo.port_2 = port2;
            roomInfo.ip_2 = ip0_2 + '.' + ip1_2 + '.' + ip2_2 + '.' + ip3_2;
            roomInfo.ownerId = ownerId;
            roomInfo.createTs = createTs;
            roomInfo.status = status;
            roomInfo.playerNum = playerNum;
            roomInfo.ext_num = ext_num;
            this.ip0 = roomInfo.ip_1;
            this.ip1 = roomInfo.ip_2;
            this.ownerId = ownerId;
            this.createTs = createTs;
            this.status = status;
            this.playerNum = playerNum;
            this.players = players;
            return roomInfo;
        } else {
            BK.Script.log(0, 0, 'recvQueryRoom parse failed.bodyLen is 0');
            return undefined;
        }
    };
    this.recvJoinRoom = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        var buffer = res.tag201;
        var ownerId = this.read32BytesToString(buffer);
        var createTs = buffer.readUint64Buffer();
        var status = buffer.readUint8Buffer();
        var playerNum = buffer.readUint8Buffer();
        var players = [];
        for (var i = 0; i < playerNum; i++) {
            var player = {};
            var openid = this.read32BytesToString(buffer);
            var joinTs = buffer.readUint64Buffer();
            var status = buffer.readUint8Buffer();
            player['openId'] = openid;
            player.status = status;
            player.joinTs = joinTs;
            players.push(player);
        }
        this.ownerId = ownerId;
        this.createTs = createTs;
        this.status = status;
        this.playerNum = playerNum;
        if (this.currentPlayers.length == 0) {
            players.forEach(function (element) {
                this.newJoinPlayers.push(element);
            }, this);
        } else {
            var tmpArray = [];
            BK.Script.log(0, 0, 'recvJoinRoom!curPlayers = ' + JSON.stringify(this.currentPlayers));
            BK.Script.log(0, 0, 'recvJoinRoom!joinPlayers = ' + JSON.stringify(players));
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var isFormerJoin = false;
                for (var j = 0; j < this.currentPlayers.length; j++) {
                    var formerNewJoinPlayer = this.currentPlayers[j];
                    if (formerNewJoinPlayer.openId == player.openId) {
                        isFormerJoin = true;
                        break;
                    }
                }
                if (isFormerJoin == false) {
                    tmpArray.push(player);
                }
            }
            this.newJoinPlayers = tmpArray;
            BK.Script.log(0, 0, 'recvJoinRoom!newPlayers = ' + JSON.stringify(this.newJoinPlayers));
        }
        this.currentPlayers = players;
        BK.Script.log(0, 0, 'recvJoinRoom ownerId=' + ownerId + ',createTs =' + createTs + ',playerNum:' + playerNum);
    };
    this.recvLeaveRoom = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (res) {
            var buffer = res.tag201;
            var logOutId = this.read32BytesToString(buffer);
            var reason = buff.readUint64Buffer();
            var leaveInfo = new Object();
            BK.Script.log(0, 0, 'recvLeaveRoom!ret = ' + reason);
            leaveInfo.reason = reason;
            leaveInfo.logOutId = logOutId;
            this.currentPlayers.splice(this.currentPlayers.indexOf(logOutId));
            return leaveInfo;
        } else {
            BK.Script.log(0, 0, 'recvLeaveRoom parse failed.bodylen is ' + bodyLen);
            return undefined;
        }
    };
    this.recvStartGame = function (buff, bodyLen) {
        this.startGameTs = BK.Time.timestamp;
        BK.Script.log(0, 0, 'recvStartGame');
    };
    this.recvPushFrameSync = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        var needAck = res.tag201;
        var isFinish = res.tag202;
        var frameData = res.tag203;
        var frameDataArr = new Array();
        for (var i = 0; i < frameData.length; i++) {
            var frameSeq = frameData[i].readUint32Buffer();
            this.lastFrame = frameSeq;
            var len = frameData[i].bufferLength() - 4;
            BK.Script.log(0, 0, 'sync recv len= ' + frameData[i].bufferLength() + ' frameData.length=' + frameData.length);
            var userDataArr = new Array();
            while (len > 0) {
                BK.Script.log(0, 0, 'push frameNo=' + this.lastFrame);
                var dataLen = frameData[i].readUint16Buffer();
                BK.Script.log(0, 0, 'push databuf 2 datalen=' + dataLen);
                var openid = this.read32BytesToString(frameData[i]);
                var itemid = frameData[i].readUint64Buffer();
                var dataBuf = frameData[i].readBuffer(dataLen);
                var userData = {
                    'openId': openid,
                    'itemId': itemid,
                    'dataBuffer': dataBuf
                };
                BK.Script.log(0, 0, 'push databuf openid=' + openid);
                BK.Script.log(0, 0, 'push databuf itemid=' + itemid);
                userDataArr.push(userData);
                len -= 2 + 32 + 8;
                len -= dataLen;
            }
            userDataArr.frameSeq = frameSeq;
            frameDataArr.push(userDataArr);
        }
        this.frameSyncListener(frameDataArr);
    };
    this.recvQueryFrameSync = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (!res) {
            BK.Script.log(0, 0, 'recvQueryFrameSync empty.');
            this.queryFrameDataCallBack(0, undefined);
            return;
        }
        var frameData = res.tag201;
        var frameDataArr = new Array();
        for (var i = 0; i < frameData.length; i++) {
            var frameSeq = frameData[i].readUint32Buffer();
            var len = frameData[i].bufferLength() - 4;
            BK.Script.log(0, 0, 'sync query recv = ' + frameData[i].bufferLength() + ' frameData.length=' + frameData.length);
            var userDataArr = new Array();
            while (len > 0) {
                BK.Script.log(0, 0, 'push frameNo=' + this.lastFrame);
                var dataLen = frameData[i].readUint16Buffer();
                BK.Script.log(0, 0, 'push databuf 2 datalen=' + dataLen);
                var openid = this.read32BytesToString(frameData[i]);
                var itemid = frameData[i].readUint64Buffer();
                var dataBuf = frameData[i].readBuffer(dataLen);
                var userData = {
                    'openId': openid,
                    'itemId': itemid,
                    'dataBuffer': dataBuf
                };
                BK.Script.log(0, 0, 'push databuf openid=' + openid);
                BK.Script.log(0, 0, 'push databuf itemid=' + itemid);
                userDataArr.push(userData);
                len -= 2 + 32 + 8;
                len -= dataLen;
            }
            userDataArr.frameSeq = frameSeq;
            frameDataArr.push(userDataArr);
        }
        BK.Script.log(0, 0, 'query end');
        this.queryFrameDataCallBack(0, frameDataArr);
    };
    this.recvControlCommand = function (buffer, bodylen) {
        var body = buffer.readBuffer(bodylen);
        var tlv = new BK.TLV(body);
        var res = tlv.bkJSParseTLV();
        var resp = {};
        if (res.tag201) {
            resp = JSON.parse(res.tag201.readAsString());
        }
        if (this.controlCommandCallback) {
            this.controlCommandCallback(0, resp);
        }
    };
    this.recvSSOJoinRoom = function (errCode, cmd, data) {
        BK.Script.log(1, 1, 'recvSSOJoinRoom = true data=' + JSON.stringify(data));
        if (errCode == 0) {
            var avRoomId = data.data.avRoomId;
            var appId = data.data.sdkAppId;
            var accountType = data.data.accountType;
            GameStatusInfo.avAppId = appId;
            GameStatusInfo.avAccountType = accountType;
            GameStatusInfo.avRoomId = avRoomId;
            GameStatusInfo.roomId = this.roomId;
        }
    };
    this.handleServerError = function (fixedHeader) {
        BK.Script.log(0, 1, 'handleServerError!cmd = ' + fixedHeader.cmd + ', errCode = ' + fixedHeader.ret);
        switch (fixedHeader.cmd) {
        case 7:
            this.roomId = fixedHeader.roomId;
            this.createRoomCallBack(header.ret, null, fixedHeader.roomId);
            break;
        case 11:
            this.queryRoomInfoCallBack(fixedHeader.ret, null);
            break;
        case 3:
            this.joinRoomCallBack(fixedHeader.ret, this);
            break;
        case 4:
        case 5:
            this.leaveRoomCallBack(fixedHeader.ret, null);
            break;
        case 9:
            this.startGameCallBack(fixedHeader.ret);
            break;
        case 1:
            this.broadcastDataCallBack(fixedHeader.fromId, null);
            break;
        case 51:
            this.sensitiveWordCallBack(fixedHeader.ret, fixedHeader.fromId, null);
            break;
        case 33:
            this.setUserDataCallBack(fixedHeader.ret);
            break;
        case 35:
            this.getUserDataCallBack(fixedHeader.ret, null);
            break;
        case 15:
            this.sendSyncOptCallBack(fixedHeader.ret, null);
            break;
        case 16:
            break;
        case 19:
            this.queryFrameDataCallBack(fixedHeader.ret, null);
            break;
        case 37:
            this.matchGameCallBack(fixedHeader.ret);
            break;
        case 39:
            this.queryMatchGameCallBack(fixedHeader.ret);
            break;
        case 41:
            this.quitMatchGameCallBack(fixedHeader.ret);
            break;
        case 49: {
                this.controlCommandCallback && this.controlCommandCallback(fixedHeader.ret, {});
                break;
            }
        }
    };
    this.handleRecv = function (buff) {
        var header = this.getHeader(buff);
        if (header.stlen != 0) {
            var st = buff.readBuffer(header.stlen);
            BK.Script.log(0, 0, 'st.len = ' + header.stlen);
        }
        var body = buff.readBuffer(header.bodyLen);
        BK.Security.decrypt(body);
        var fixedHeader = this.getFixedHeader(body);
        this.netTimeOutTs = 0;
        if (fixedHeader.ret != 0) {
            this.handleServerError(fixedHeader);
            return;
        }
        BK.Script.log(0, 0, 'handleRecv = ' + fixedHeader.cmd + ',bodyLen=' + header.bodyLen + ',bodyreal=' + body.bufferLength());
        switch (fixedHeader.cmd) {
        case 7:
            this.roomId = fixedHeader.roomId;
            var addr = this.recvCreateRoom(body, body.bufferLength() - fixedHeaderLen);
            BK.Script.log(0, 0, 'magic = ' + header.magic + ',stlen = ' + header.stlen + ',bodyLen=' + header.bodyLen + ',cmd=' + fixedHeader.cmd + ',roomId=' + fixedHeader.roomId);
            this.createRoomCallBack(fixedHeader.ret, addr, fixedHeader.roomId);
            BK.QQ.notifyNewRoom(this.roomId, fixedHeader.ret);
            break;
        case 11:
            var roomInfo = this.recvQueryRoom(body, body.bufferLength() - fixedHeaderLen);
            this.queryRoomInfoCallBack(fixedHeader.ret, roomInfo);
            BK.Script.log(0, 0, 'magic = ' + header.magic + ',stlen = ' + header.stlen + ',bodyLen=' + header.bodyLen + ',cmd=' + fixedHeader.cmd + ',roomId=' + fixedHeader.roomId);
            break;
        case 3:
            this.recvJoinRoom(body, body.bufferLength() - fixedHeaderLen);
            this.joinRoomCallBack(fixedHeader.ret, this);
            if (Boolean(BK.QQ.isNeedSSOServer) == true) {
                for (var i = 0; i < this.newJoinPlayers.length; i++) {
                    if (this.newJoinPlayers[i].openId == currentPlayerOpenId) {
                        BK.QQ.ssoJoinRoomCallback = this.recvSSOJoinRoom.bind(this);
                        BK.QQ.notifyNewOrJoinRoomSrv(this.newJoinPlayers, this.roomId, this.ownerId == GameStatusInfo.openId ? 1 : 2);
                        return;
                    }
                }
            }
            BK.QQ.notifyJoinRoom(this.newJoinPlayers, {}, fixedHeader.ret);
            break;
        case 5:
            var leaveInfo = this.recvLeaveRoom(body, body.bufferLength() - fixedHeaderLen);
            if (this.leaveRoomCallBack) {
                this.leaveRoomCallBack(fixedHeader.ret, leaveInfo);
            }
            break;
        case 9:
            this.recvStartGame(body, body.bufferLength() - fixedHeaderLen);
            this.startGameCallBack(fixedHeader.ret);
            if (Boolean(BK.QQ.isNeedSSOServer) == true) {
                BK.QQ.notifyStartGameSrv();
            }
            if (fixedHeader.ret == 0) {
                BK.QQ.hasJoinRoomSucc = false;
            }
            break;
        case 1:
            var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
            this.broadcastDataCallBack(fixedHeader.fromId, buf, fixedHeader.toId);
            break;
        case 51:
            var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
            this.sensitiveWordCallBack(fixedHeader.ret, fixedHeader.fromId, buf, fixedHeader.toId);
            break;
        case 33:
            var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
            this.setUserDataCallBack(fixedHeader.ret);
            break;
        case 35:
            var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
            this.getUserDataCallBack(fixedHeader.ret, buf);
            break;
        case 15:
            var ack = body.readUint32Buffer();
            this.ackSeq = ack;
            this.sendSyncOptCallBack(fixedHeader.ret, ack);
            break;
        case 16:
            this.recvPushFrameSync(body, body.bufferLength() - fixedHeaderLen);
            break;
        case 19:
            this.recvQueryFrameSync(body, body.bufferLength() - fixedHeaderLen);
            break;
        case 37:
            this.matchGameCallBack(fixedHeader.ret);
            break;
        case 39:
            this.roomId = fixedHeader.roomId;
            this.queryMatchGameCallBack(fixedHeader.ret);
            break;
        case 41:
            this.roomId = fixedHeader.roomId;
            this.quitMatchGameCallBack(fixedHeader.ret);
            break;
        case 49: {
                this.recvControlCommand(body, body.bufferLength() - fixedHeaderLen);
                break;
            }
        }
    };
    this.requestSocket = function (funObj) {
        var buff;
        BK.Script.log(0, 0, 'requestSocket = ' + funObj.cmd);
        switch (funObj.cmd) {
        case 6:
            buff = this.requestCreateRoom(funObj.arg0, funObj.arg1);
            break;
        case 10:
            buff = this.requestQueryRoom();
            break;
        case 2:
            buff = this.requestJoinRoom(funObj.arg0);
            break;
        case 4:
            buff = this.requestLeaveRoom(funObj.arg0);
            break;
        case 8:
            buff = this.requestStartGame();
            break;
        case 1:
            buff = this.requestsendBroadcastData(funObj.arg0);
            break;
        case 50:
            buff = this.requestSendSendSensitiveWordData(funObj.arg0);
            break;
        case 32:
            buff = this.requestSetUserData(funObj.arg0);
            break;
        case 34:
            buff = this.requestGetUserData(funObj.arg0);
            break;
        case 14:
            buff = this.requestSyncOpt(funObj.arg0, funObj.arg1, funObj.arg2, funObj.arg3);
            break;
        case 18:
            buff = this.requestQueryFrameData(funObj.arg0, funObj.arg1);
            break;
        case 36:
            buff = this.requestMatch(funObj.arg0, funObj.arg1);
            break;
        case 38:
            buff = this.requestQueryMatch(funObj.arg0, funObj.arg1);
            break;
        case 40:
            buff = this.requestQuitMatch(funObj.arg0, funObj.arg1);
            break;
        case 12:
            buff = this.requestSendKeepAlive();
            if (this.netTimeOutTs == 0) {
                this.netTimeOutTs = BK.Time.timestamp;
            }
            break;
        case 48: {
                var data = new BK.Buffer();
                var openkey = new BK.Buffer();
                data.writeAsString(funObj.arg1);
                openkey.writeAsString(funObj.arg2);
                buff = this.requestControlCommand(funObj.arg0, data, openkey);
                break;
            }
        }
        if (buff != undefined) {
            BK.Script.log(0, 0, 'requestSocket = ' + funObj.cmd);
            this.socket.send(buff);
        }
    };
    this.seperatePackHandle = function () {
        while (true) {
            var checkBuff = this.socket.receiveNotRemove();
            var totalLen = checkBuff.bufferLength();
            var header = this.getHeader(checkBuff);
            var onePackLen = header.stlen + header.bodyLen + HeaderLen;
            BK.Script.log(0, 0, 'this.socket.receive():totalLen = ' + totalLen + '  onePackLen=' + onePackLen);
            if (totalLen == onePackLen) {
                BK.Script.log(0, 0, '  this.socket.receive():onePackLen=' + onePackLen);
                var rBuf = this.socket.receive(onePackLen);
                if (rBuf != undefined) {
                    this.handleRecv(rBuf);
                }
                break;
            } else if (totalLen < onePackLen) {
                BK.Script.log(0, 0, '  this.socket.receive():part of onePackLen=' + onePackLen);
                break;
            } else if (totalLen > onePackLen) {
                BK.Script.log(0, 0, '  this.socket.receive():Multipacks onePackLen=' + onePackLen);
                var rBuf = this.socket.receive(onePackLen);
                if (rBuf != undefined) {
                    this.handleRecv(rBuf);
                }
            }
        }
    };
    this.curConnRetrys = 0;
    this.curConnTimeout = 0;
    this.prevNetState = 0;
    this.reConnectTime = 0;
    this.updateNet = function () {
        var state = this.socket.update();
        var curNetStat = this.socket.state;
        if (-1 != state) {
            switch (this.prevNetState) {
            case 0: {
                    switch (curNetStat) {
                    case 3: {
                            this.onErrorEvent(this);
                            break;
                        }
                    case 1: {
                            this.onConnectingEvent(this);
                            break;
                        }
                    case 2: {
                            this.onConnectedEvent(this);
                            break;
                        }
                    }
                    break;
                }
            case 1: {
                    switch (curNetStat) {
                    case 2: {
                            switch (state) {
                            case 2: {
                                    this.onConnectedEvent();
                                    break;
                                }
                            case 3: {
                                    BK.Script.log(0, 0, 'BK.Socket.update!unexcepted status');
                                    break;
                                }
                            }
                            break;
                        }
                    default: {
                        }
                    }
                    break;
                }
            case 2: {
                    switch (curNetStat) {
                    case 2: {
                            this.onUpdateEvent();
                            break;
                        }
                    default: {
                            this.onErrorEvent();
                        }
                    }
                    break;
                }
            }
        } else {
            BK.Script.log(0, 0, 'BK.Socket.DisconnectEvent prevNetState=' + this.prevNetState);
            switch (this.prevNetState) {
            case 3:
            case 2:
            case 1: {
                    this.onDisconnectEvent();
                    break;
                }
            }
        }
        this.prevNetState = curNetStat;
        return state;
    };
    this.onErrorEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.ErrorEvent');
    };
    this.onUpdateEvent = function () {
        return 0;
    };
    this.onTimeoutEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.TimeoutEvent');
    };
    this.onConnectingEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.ConnectingEvent');
    };
    this.onConnectedEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.ConnectedEvent');
        if (this.connectedNetCallback) {
            this.connectedNetCallback();
        }
    };
    this.onReconnectEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.ReconnectEvent');
    };
    this.onDisconnectEvent = function () {
        BK.Script.log(0, 0, 'BK.Socket.DisconnectEvent');
        if (this.disconnectNetCallBack) {
            this.disconnectNetCallBack();
        }
        if (this.reConnectTime < 3) {
            BK.Script.log(0, 0, 'BK.Socket.DisconnectEvent reconnectAndJoinRoom');
            var ts = BK.Time.timestamp;
            var cost = (ts - this.startGameTs) / 60;
            if (cost < 5) {
                this.reConnectTime++;
                this.reConnectAndJoinRoom();
            } else {
                BK.Script.log(0, 0, 'BK.Socket.DisconnectEvent over 5 min');
            }
        } else {
            if (this.terminatedNetCallback) {
                this.terminatedNetCallback();
            }
        }
    };
    this.setConnectedNetCallBack = function (callback) {
        this.connectedNetCallback = callback;
    };
    this.setDisconnectNetCallBack = function (callback) {
        this.disconnectNetCallBack = callback;
    };
    this.setTerminatedNetCallback = function (callback) {
        this.terminatedNetCallback = callback;
    };
    this.updateSocket = function () {
        var update = this.updateNet();
        if (update == 3 || update == 2) {
            if (this.reqArray.length > 0) {
                var funObj = this.reqArray.pop();
                if (funObj != undefined && funObj != null) {
                    this.requestSocket(funObj);
                }
            }
        }
        if (update == 3 || update == 1) {
            this.seperatePackHandle();
        }
        return update;
    };
    this.createAndJoinRoom = function (gameId, masterOpenId, callback, isSendMsg, needSSOServer) {
        this.createRoom(gameId, masterOpenId, function (createStatusCode, netAddr, roomId) {
            if (createStatusCode == 0) {
                BK.Script.log(0, 0, '创建游戏 statusCode:' + createStatusCode + ' roomId:' + roomId);
                this.gameSvrIp = netAddr.ip_2;
                this.gameSvrPort = netAddr.port_2;
                this.roomSvrIp = netAddr.ip_1;
                this.roomSvrPort = netAddr.port_1;
                this.socket.close();
                this.socket.connect(this.gameSvrIp, this.gameSvrPort);
                this.joinRoom(0, function (statusCode, room) {
                    BK.Script.log(0, 0, '加入房间 statusCode:' + statusCode + ' roomid is ' + room.roomId);
                    if (statusCode == 0) {
                        GameStatusInfo.roomId = room.roomId;
                        BK.QQ.gameCfg.roomId = room.roomId;
                    }
                    callback(statusCode, this);
                    if (needSSOServer) {
                        if (BK.QQ.hasJoinRoomSucc == true) {
                            callback(statusCode, this);
                        } else {
                            BK.QQ.delegate.onJoinRoomEvent = function (errCode, cmd, data) {
                                callback(statusCode, this);
                            }.bind(this);
                        }
                    } else {
                        callback(statusCode, this);
                    }
                }, isSendMsg, needSSOServer);
            } else {
                callback(createStatusCode, this);
            }
        });
    };
    this.queryAndJoinRoom = function (gameId, roomId, joinerOpenId, callback, isSendMsg, needSSOServer) {
        if (this.serverConnected != 1) {
            this.socket.close();
            this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
        }
        this.queryRoom(gameId, roomId, joinerOpenId, function (queryStatusCode, roomInfo) {
            if (queryStatusCode == 0) {
                this.gameSvrIp = roomInfo.ip_2;
                this.gameSvrPort = roomInfo.port_2;
                this.roomSvrIp = roomInfo.ip_1;
                this.roomSvrPort = roomInfo.port_1;
                this.socket.close();
                this.socket.connect(this.gameSvrIp, this.gameSvrPort);
                this.joinRoom(0, function (statusCode, room) {
                    BK.QQ.hasJoinRoomSucc = true;
                    BK.Script.log(0, 0, '加入房间 statusCode:' + statusCode + ' roomid is ' + room.roomId);
                    callback(statusCode, this);
                }, isSendMsg, needSSOServer);
            } else {
                callback(queryStatusCode, undefined);
            }
        });
    };
    this.forceLeaveRoom = function (callback, reason) {
        var funObj = new Object();
        funObj.cmd = 4;
        funObj.arg0 = reason;
        this.leaveRoomCallBack = callback;
        var buff = this.requestLeaveRoom(funObj.arg0);
        var update = this.socket.update();
        if (update == 3 || update == 2) {
            this.socket.send(buff);
            BK.Script.log(0, 0, 'forceLeaveRoom push');
        } else {
            BK.Script.log(0, 0, 'forceLeaveRoom push Failed. Socket not allow Send.');
        }
    };
    this._event4StopGame = function (errCode, cmd, data) {
        BK.Script.log(0, 0, 'BK.Room._event4StopGame!errCode = ' + errCode + ', cmd = ' + cmd + ', data = ' + JSON.stringify(data));
        if (errCode == 0) {
            this.forceLeaveRoom(function (retCode, leaveInfo) {
                BK.Script.log(0, 0, 'forceLeaveRoom callback');
            }, 0);
        }
    };
    BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_STOP_GAME, this, this._event4StopGame.bind(this));
    this.addDebugFunctions = function () {
        this.createFixedRoom = function (gameId, openId, roomId, callback) {
            this.roomId = roomId;
            this.mId = openId;
            this.gameId = gameId;
            var con = this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
            BK.Script.log(0, 0, 'socket con =' + con);
            if (con != -1) {
                BK.Script.log(0, 0, 'socket connect failed! ' + con);
            }
            this.createRoomCallBack = callback;
            var funObj = new Object();
            funObj.cmd = 6;
            funObj.arg0 = gameId;
            funObj.arg1 = openId;
            this.reqArray.push(funObj);
            BK.Script.log(0, 0, 'create Fixed Room ');
        };
        this.createAndJoinFixedRoom = function (gameId, masterOpenId, roomId, callback, isSendMsg) {
            this.createFixedRoom(gameId, masterOpenId, roomId, function (createStatusCode, netAddr, roomId) {
                if (createStatusCode == 0) {
                    BK.Script.log(0, 0, '创建固定房间号 游戏 statusCode:' + createStatusCode + ' roomId:' + roomId);
                    this.gameSvrIp = netAddr.ip_2;
                    this.gameSvrPort = netAddr.port_2;
                    this.roomSvrIp = netAddr.ip_1;
                    this.roomSvrPort = netAddr.port_1;
                    this.socket.close();
                    this.socket.connect(this.gameSvrIp, this.gameSvrPort);
                    this.joinRoom(0, function (statusCode, room) {
                        BK.Script.log(0, 0, '加入房间 statusCode:' + statusCode + ' roomid is ' + room.roomId);
                        callback(statusCode, this);
                    }, isSendMsg);
                } else {
                    callback(createStatusCode, this);
                }
            });
        };
        this.requestCreateRoom = function (gameId, openId) {
            var fixedRoomId = this.roomId;
            if (!fixedRoomId) {
                fixedRoomId = 0;
            }
            BK.Script.log(0, 0, 'create fixed room request in fixedRoomId:' + fixedRoomId);
            var body = new BK.Buffer(fixedHeaderLen, 1);
            this.addFixedHeader(body, 6, gameId, fixedRoomId, openId);
            var st = BK.Security.getST();
            BK.Security.encrypt(body);
            var stLen = st.bufferLength();
            var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
            this.addHeader(buff, body.bufferLength(), stLen);
            buff.writeBuffer(st);
            buff.writeBuffer(body);
            BK.Script.log(0, 0, 'create room request buffer : ' + buff.bufferLength() + ' body len:' + body.bufferLength());
            return buff;
        };
    };
    Object.defineProperty(this, 'environment', {
        get: function () {
            return this._environment;
        },
        set: function (obj) {
            BK.Script.log(0, 0, 'Set Environment failed!Can\'t set the environment!!!');
        }
    });
    if (GameStatusInfo.devPlatform) {
        this._environment = NETWORK_ENVIRONMENT_DEMO_DEV;
        BK.Script.log(1, 1, '当前环境为---开发环境');
    } else if (GameStatusInfo.isWhiteUser == 1) {
        this._environment = NETWORK_ENVIRONMENT_QQ_DEBUG;
        BK.Script.log(1, 1, '当前环境为---手Q开发环境');
    } else {
        this._environment = NETWORK_ENVIRONMENT_QQ_RELEASE;
        BK.Script.log(1, 1, '当前环境为---正式环境');
    }
    if (this._environment == NETWORK_ENVIRONMENT_QQ_DEBUG) {
        this.headerVersion = 769;
        this.recommandRoomSvrHost = DebugRecommandRoomSvrHost;
        this.recommandRoomSvrPort = DebugRecommandRoomSvrPort;
    } else if (this._environment == NETWORK_ENVIRONMENT_DEMO_DEV) {
        this.addDebugFunctions();
        this.headerVersion = 257;
        this.recommandRoomSvrHost = DebugRecommandRoomSvrHost;
        this.recommandRoomSvrPort = DebugRecommandRoomSvrPort;
    }
};
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Device = factory();
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_BACKGROUND, this, function () {
            BK.Script.log(1, 1, 'keepScreenOn CMD_CMSHOW_GAME_ENTER_BACKGROUND ');
            BK.Device.innnerSetKeepScreenOn(false);
        });
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_FORGROUND, this, function () {
            BK.Script.log(1, 1, 'keepScreenOn CMD_CMSHOW_GAME_ENTER_FORGROUND ');
            if (BK.Device.isKeepScreenOnInit) {
                BK.Device.innnerSetKeepScreenOn(BK.Device.userSetDeviceScreenValue);
            } else {
                BK.Device.innnerSetKeepScreenOn(false);
            }
        });
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MINIMIZE, this, function () {
            BK.Script.log(1, 1, 'keepScreenOn CMD_CMSHOW_GAME_MINIMIZE ');
            BK.Device.innnerSetKeepScreenOn(false);
        });
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MAXIMIZE, this, function () {
            BK.Script.log(1, 1, 'keepScreenOn CMD_CMSHOW_GAME_MAXIMIZE ');
            if (BK.Device.isKeepScreenOnInit) {
                BK.Device.innnerSetKeepScreenOn(BK.Device.userSetDeviceScreenValue);
            } else {
                BK.Device.innnerSetKeepScreenOn(false);
            }
        });
        BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_STOP_GAME, this, function () {
            BK.Script.log(1, 1, 'keepScreenOn CMSHOW_SC_CMD_STOP_GAME ');
            BK.Device.innnerSetKeepScreenOn(false);
        });
    }
}(BK, function () {
    function Device() {
        this.isKeepScreenOnInit = false;
        this.userSetDeviceScreenValue = undefined;
        BK.Director.isKeepScreenOn = false;
    }
    Device.prototype.innnerSetKeepScreenOn = function (isKeepOn) {
        if (this.isKeepScreenOnInit) {
            BK.QQ.uploadData('call_screen_on', GameStatusInfo.src, isKeepOn ? 1 : 0, '', '', '');
            BK.Director.isKeepScreenOn = isKeepOn;
        } else {
            BK.Script.log(1, 1, 'user unset keepScreenOn,ignore the value');
        }
    };
    Device.prototype.setKeepScreenOn = function (isKeepOn) {
        BK.Script.log(1, 1, 'user set keepScreenOn ' + isKeepOn);
        this.userSetDeviceScreenValue = isKeepOn;
        this.isKeepScreenOnInit = true;
        this.innnerSetKeepScreenOn(isKeepOn);
    };
    return new Device();
}));
BK.Script.log(0, 0, 'filemanage.js is loaded');
BK.FileManager = function () {
    this.fileArray = [];
    this.readFile = function (path, func) {
        var nobFile = new BK.FileUtil(path);
        nobFile.openFile();
        var fileObj = new Object();
        fileObj.path = path;
        fileObj.status = 0;
        fileObj.readCallBack = func;
        fileObj.file = nobFile;
        this.fileArray.push(fileObj);
        return fileObj;
    };
    this.update = function () {
        for (var i = 0; i < this.fileArray.length; i++) {
            if (this.fileArray[i].status == 1) {
                continue;
            }
            var ret = this.fileArray[i].file.update();
            if (ret == 1 || ret == 3) {
                var buffer = this.fileArray[i].file.readFileAsync();
                if (buffer) {
                    this.fileArray[i].readCallBack(buffer);
                    this.fileArray[i].data = buffer;
                    this.fileArray[i].status = 1;
                    this.fileArray[i].file.close();
                }
            }
        }
    };
    this.getFileData = function (path) {
        for (var i = 0; i < this.fileArray.length; i++) {
            if (this.fileArray[i].path == path && this.fileArray[i].status == 1) {
                return this.fileArray[i].data;
            }
        }
    };
    this.closeFile = function (fileObj) {
        for (var i = his.fileArray.length; i > 0; i--) {
            if (this.fileArray[i].path == file.path) {
                this.fileArray.splice(i, 1);
            }
        }
        fileObj.file.removeFromCache();
    };
};
BK.Script.log(1, 1, 'skeletonAnimationAsync js done');
var fileManager = new BK.FileManager();
function skeletonAnimationAsync(path, timescale, startCB, completeCB, endCB, callback) {
    var pngPath = path + '.png';
    var atlasPath = path + '.atlas';
    var jsonPath = path + '.json';
    var progress = 0;
    fileManager.readFile(pngPath, function (buff) {
        BK.Script.log(0, 0, 'skeletonAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            var ani = new BK.SkeletonAnimation(atlasRealPath, jsonRealPath, timescale, startCB, completeCB, endCB);
            callback(ani);
        }
    });
    fileManager.readFile(atlasPath, function (buff) {
        BK.Script.log(0, 0, 'skeletonAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            var ani = new BK.SkeletonAnimation(atlasRealPath, jsonRealPath, timescale, startCB, completeCB, endCB);
            callback(ani);
        }
    });
    fileManager.readFile(jsonPath, function (buff) {
        BK.Script.log(0, 0, 'skeletonAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            var ani = new BK.SkeletonAnimation(atlasRealPath, jsonRealPath, timescale, startCB, completeCB, endCB);
            callback(ani);
        }
    });
}
function setAccessoryAsync(ani, path, callback) {
    var pngPath = path + '.png';
    var atlasPath = path + '.atlas';
    var jsonPath = path + '.json';
    var progress = 0;
    fileManager.readFile(pngPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessory(jsonRealPath, atlasRealPath);
            callback();
        }
    });
    fileManager.readFile(atlasPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessory(jsonRealPath, atlasRealPath);
            callback();
        }
    });
    fileManager.readFile(jsonPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessory(jsonRealPath, atlasRealPath);
            callback();
        }
    });
}
function setAccessoryWithInfoAsync(ani, path, content, callback) {
    var pngPath = path + '.png';
    var atlasPath = path + '.atlas';
    var jsonPath = path + '.json';
    var progress = 0;
    fileManager.readFile(pngPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryWithInfo Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryWithInfo(jsonRealPath, atlasRealPath, content);
            callback();
        }
    });
    fileManager.readFile(atlasPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryWithInfo Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryWithInfo(jsonRealPath, atlasRealPath, content);
            callback();
        }
    });
    fileManager.readFile(jsonPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryWithInfo Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryWithInfo(jsonRealPath, atlasRealPath, content);
            callback();
        }
    });
}
function setAccessoryAnimationAsync(ani, path, name, callback) {
    var pngPath = path + '.png';
    var atlasPath = path + '.atlas';
    var jsonPath = path + '.json';
    var progress = 0;
    fileManager.readFile(pngPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryAnimation(jsonRealPath, atlasRealPath, name);
            callback();
        }
    });
    fileManager.readFile(atlasPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryAnimation(jsonRealPath, atlasRealPath, name);
            callback();
        }
    });
    fileManager.readFile(jsonPath, function (buff) {
        BK.Script.log(0, 0, 'setAccessoryAnimationAsync Done');
        progress++;
        if (progress == 3) {
            var jsonRealPath = BK.Script.pathForResource(jsonPath);
            var atlasRealPath = BK.Script.pathForResource(atlasPath);
            ani.setAccessoryAnimation(jsonRealPath, atlasRealPath, name);
            callback();
        }
    });
}
BK.Director.ticker.add(function (ts, duration) {
    fileManager.update();
});
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.DNS = factory();
    }
}(BK, function () {
    function dns() {
        this.records = [];
        this.running = false;
    }
    dns.prototype.exists = function (hostname) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].hostname === hostname) {
                return true;
            }
        }
        return false;
    };
    dns.prototype.query = function (hostname, af) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].af === af && this.records[i].hostname === hostname) {
                return this.records[i];
            }
        }
        return null;
    };
    dns.prototype.update = function (hostname, callback, af, timeout) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].af === af && this.records[i].hostname === hostname) {
                this.records[i].callbacks.push(callback);
                return;
            }
        }
        this.records.push({
            af: af,
            timeout: timeout,
            hostname: hostname,
            callbacks: [callback]
        });
    };
    dns.prototype.delete = function (hostname) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].hostname === hostname) {
                this.records.splice(i);
                break;
            }
        }
    };
    dns.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            var _this = this;
            BK.Director.ticker.add(function (ts, duration) {
                if (_this.records.length) {
                    BK.Misc.handleDNSQueryResult();
                }
            });
        }
    };
    dns.prototype.queryIPAddress = function (hostname, callback, af, timeout) {
        var needQuery = !this.exists(hostname);
        if (undefined == af)
            af = 2;
        if (undefined == timeout)
            timeout = 0;
        this.update(hostname, callback, af, timeout);
        if (needQuery) {
            var _this = this;
            _this.start();
            BK.Misc.queryIPAddress(hostname, function (reason, af, iplist) {
                var item = _this.query(hostname, af);
                if (item) {
                    var callbacks = item.callbacks;
                    for (var i = 0; i < callbacks.length; i++) {
                        callbacks[i].call(_this, reason, af, iplist);
                    }
                }
                _this.delete(hostname);
            }, af, timeout);
        }
    };
    return new dns();
}));
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.HTTPParser = factory();
    }
}(this, function () {
    var CRLF = '\r\n';
    var CR = 13;
    var LF = 10;
    var MAX_CHUNK_SIZE = 512 * 1024;
    var MAX_HEADER_BYTES = 80 * 1024;
    var RE_STATUS_LINE = /^HTTP\/1\.([01]) ([0-9]{3})(?: ((?:[\x21-\x7E](?:[\t ]+[\x21-\x7E])*)*))?$/;
    var RE_HEADER = /^([!#$%'*+\-.^_`|~0-9A-Za-z]+):[\t ]*((?:[\x21-\x7E](?:[\t ]+[\x21-\x7E])*)*)[\t ]*$/;
    var RE_FOLDED = /^[\t ]+(.*)$/;
    var STATE_STATUS_LINE = 1;
    var STATE_HEADER = 2;
    var STATE_COMPLETE = 3;
    var STATE_NAMES = [
        'STATE_STATUS_LINE',
        'STATE_HEADER',
        'STATE_COMPLETE'
    ];
    var FLAG_CHUNKED = 1 << 0;
    var FLAG_CONNECTION_KEEP_ALIVE = 1 << 1;
    var FLAG_CONNECTION_CLOSE = 1 << 2;
    var FLAG_CONNECTION_UPGRADE = 1 << 3;
    var FLAG_TRAILING = 1 << 4;
    var FLAG_UPGRADE = 1 << 5;
    var FLAG_SKIPBODY = 1 << 6;
    var FLAG_ANY_UPGRADE = FLAG_UPGRADE | FLAG_CONNECTION_UPGRADE;
    function HTTPParser(type) {
        this.onHeaders = undefined;
        this.onComplete = undefined;
        this.reinitialize(type);
    }
    HTTPParser.prototype.reinitialize = function (type) {
        this.execute = this._executeHeader;
        this.type = type;
        if (type === HTTPParser.RESPONSE)
            this._state = STATE_STATUS_LINE;
        this._err = undefined;
        this._flags = 0;
        this._contentLen = undefined;
        this._nbytes = 0;
        this._nhdrbytes = 0;
        this._nhdrpairs = 0;
        this._buf = '';
        this._seenCR = false;
        this.headers = {};
        this.httpMajor = 1;
        this.httpMinor = undefined;
        this.maxHeaderPairs = 2000;
        this.method = undefined;
        this.url = undefined;
        this.statusCode = undefined;
        this.statusText = undefined;
    };
    HTTPParser.prototype._processHdrLine = function (line) {
        switch (this._state) {
        case STATE_HEADER:
            if (line.length === 0) {
                this._headersEnd();
                return;
            }
            var m = RE_HEADER.exec(line);
            if (m === null) {
                m = RE_FOLDED.exec(line);
                if (m === null) {
                    this.execute = this._executeError;
                    this._err = new Error('Malformed header line');
                    this.execute(this._err);
                    return this._err;
                }
                var extra = m[1];
                if (extra.length > 0) {
                    BK.Script.log(1, 0, 'processHdrLine!extra = ' + extra);
                }
            } else {
                var fieldName = m[1];
                var fieldValue = m[2];
                switch (fieldName.toLowerCase()) {
                case 'connection':
                    var valLower = fieldValue.toLowerCase();
                    if (valLower.substring(0, 5) === 'close')
                        this._flags |= FLAG_CONNECTION_CLOSE;
                    else if (valLower.substring(0, 10) === 'keep-alive')
                        this._flags |= FLAG_CONNECTION_KEEP_ALIVE;
                    else if (valLower.substring(0, 7) === 'upgrade')
                        this._flags |= FLAG_CONNECTION_UPGRADE;
                    break;
                case 'transfer-encoding':
                    var valLower = fieldValue.toLowerCase();
                    if (valLower.substring(0, 7) === 'chunked')
                        this._flags |= FLAG_CHUNKED;
                    break;
                case 'upgrade':
                    this._flags |= FLAG_UPGRADE;
                    break;
                case 'content-length':
                    var val = parseInt(fieldValue, 10);
                    if (isNaN(val) || val > MAX_CHUNK_SIZE) {
                        this.execute = this._executeError;
                        this._err = new Error('Bad Content-Length: ' + inspect(val));
                        this.execute(this._err);
                        return this._err;
                    }
                    this._contentLen = val;
                    break;
                }
                var maxHeaderPairs = this.maxHeaderPairs;
                if (maxHeaderPairs <= 0 || ++this._nhdrpairs < maxHeaderPairs)
                    this.headers[fieldName.toLowerCase()] = fieldValue;
            }
            break;
        case STATE_STATUS_LINE:
            if (line.length === 0)
                return true;
            var m = RE_STATUS_LINE.exec(line);
            if (m === null) {
                this.execute = this._executeError;
                this._err = new Error('Malformed status line');
                this.execute(this._err);
                return this._err;
            }
            this.httpMinor = parseInt(m[1], 10);
            this.statusCode = parseInt(m[2], 10);
            this.statusText = m[3] || '';
            this._state = STATE_HEADER;
            break;
        default:
            this.execute = this._executeError;
            this._err = new Error('Unexpected HTTP parser state: ' + this._state);
            this.execute(this._err);
            return this._err;
        }
    };
    HTTPParser.prototype._headersEnd = function () {
        var flags = this._flags;
        var methodLower = this.method && this.method.toLowerCase();
        var upgrade = (flags & FLAG_ANY_UPGRADE) === FLAG_ANY_UPGRADE || methodLower === 'connect';
        var keepalive = (flags & FLAG_CONNECTION_CLOSE) === 0;
        var contentLen = this._contentLen;
        var ret;
        this._buf = '';
        this._seenCR = false;
        this._nbytes = 0;
        if (this.httpMajor === 0 && this.httpMinor === 9 || this.httpMinor === 0 && (flags & FLAG_CONNECTION_KEEP_ALIVE) === 0) {
            keepalive = false;
        }
        if ((flags & FLAG_TRAILING) > 0) {
            this.onComplete && this.onComplete();
            this.reinitialize(this.type);
            return;
        } else {
            if (this.onHeaders) {
                var headers = this.headers;
                ret = this.onHeaders(this.httpMajor, this.httpMinor, headers, this.method, this.url, this.statusCode, this.statusText, upgrade, keepalive);
                if (ret === true)
                    flags = this._flags |= FLAG_SKIPBODY;
            }
        }
        if (upgrade) {
            this.onComplete && this.onComplete();
            this._state = STATE_COMPLETE;
        } else if (contentLen === 0 || (flags & FLAG_SKIPBODY) > 0 || (flags & FLAG_CHUNKED) === 0 && contentLen === undefined && !this._needsEOF()) {
            this.onComplete && this.onComplete();
            this.reinitialize(this.type);
        }
    };
    HTTPParser.prototype._executeHeader = function (data) {
        var offset = 0;
        var len = data.length;
        var idx;
        var seenCR = this._seenCR;
        var buf = this._buf;
        var ret;
        var bytesToAdd;
        var nhdrbytes = this._nhdrbytes;
        while (offset < len) {
            if (seenCR) {
                seenCR = false;
                if (data.charCodeAt(offset) === LF) {
                    ++offset;
                    ret = this._processHdrLine(buf);
                    buf = '';
                    if (typeof ret === 'object') {
                        this._err = ret;
                        this.execute(this._err);
                        return ret;
                    } else if (ret === undefined) {
                        var state = this._state;
                        if (state !== STATE_HEADER) {
                            if (state < STATE_COMPLETE && offset < len) {
                                ret = this.execute(data.slice(offset));
                                if (typeof ret !== 'number') {
                                    this._err = ret;
                                    this.execute(this._err);
                                    return ret;
                                }
                                return offset + ret;
                            } else if (state === STATE_COMPLETE)
                                this.reinitialize(this.type);
                            return offset;
                        }
                    }
                } else {
                    buf += '\r';
                    ++nhdrbytes;
                    if (nhdrbytes > MAX_HEADER_BYTES) {
                        this.execute = this._executeError;
                        this._err = new Error('Header size limit exceeded (' + MAX_HEADER_BYTES + ')');
                        this.execute(this._err);
                        return this._err;
                    }
                }
            }
            var idx = data.indexOf(CRLF, offset);
            if (idx > -1) {
                bytesToAdd = idx - offset;
                if (bytesToAdd > 0) {
                    nhdrbytes += bytesToAdd;
                    if (nhdrbytes > MAX_HEADER_BYTES) {
                        this.execute = this._executeError;
                        this._err = new Error('Header size limit exceeded (' + MAX_HEADER_BYTES + ')');
                        this.execute(this._err);
                        return this._err;
                    }
                    buf += data.substring(offset, idx);
                }
                offset = idx + 2;
                ret = this._processHdrLine(buf);
                buf = '';
                if (typeof ret === 'object') {
                    this._err = ret;
                    this.execute(this._err);
                    return ret;
                } else if (ret === undefined) {
                    var state = this._state;
                    if (state !== STATE_HEADER) {
                        if (state < STATE_COMPLETE && offset < len) {
                            ret = this.execute(data.slice(offset));
                            if (typeof ret !== 'number') {
                                this._err = ret;
                                this.execute(this._err);
                                return ret;
                            }
                            return offset + ret;
                        } else if (state === STATE_COMPLETE)
                            this.reinitialize(this.type);
                        return offset;
                    }
                }
            } else {
                var end;
                if (data.charCodeAt(len - 1) === CR) {
                    seenCR = true;
                    end = len - 1;
                } else
                    end = len;
                nhdrbytes += end - offset;
                if (nhdrbytes > MAX_HEADER_BYTES) {
                    this.execute = this._executeError;
                    this._err = new Error('Header size limit exceeded (' + MAX_HEADER_BYTES + ')');
                    this.execute(this._err);
                    return this._err;
                }
                buf += data.substring(offset, end);
                break;
            }
        }
        this._buf = buf;
        this._seenCR = seenCR;
        this._nhdrbytes = nhdrbytes;
        return len;
    };
    HTTPParser.prototype._executeError = function (err) {
        BK.Script.log(1, 0, '_executeError!err = ' + err.message);
        return this._err;
    };
    HTTPParser.prototype.execute = HTTPParser.prototype._executeHeader;
    HTTPParser.prototype._needsEOF = function () {
        if (this.type === HTTPParser.REQUEST)
            return false;
        var status = this.statusCode;
        var flags = this._flags;
        if (status !== undefined && (status === 204 || status === 304 || parseInt(status / 100, 1) === 1) || flags & FLAG_SKIPBODY) {
            return false;
        }
        if ((flags & FLAG_CHUNKED) > 0 || this._contentLen != undefined)
            return false;
        return true;
    };
    HTTPParser.REQUEST = 0;
    HTTPParser.RESPONSE = 1;
    return HTTPParser;
}));
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.URL = factory();
    }
}(BK, function () {
    var url = function () {
        function _t() {
            return new RegExp(/(.*?)\.?([^\.]*?)\.?(com|net|org|biz|ws|in|me|co\.uk|co|org\.uk|ltd\.uk|plc\.uk|me\.uk|edu|mil|br\.com|cn\.com|eu\.com|hu\.com|no\.com|qc\.com|sa\.com|se\.com|se\.net|us\.com|uy\.com|ac|co\.ac|gv\.ac|or\.ac|ac\.ac|af|am|as|at|ac\.at|co\.at|gv\.at|or\.at|asn\.au|com\.au|edu\.au|org\.au|net\.au|id\.au|be|ac\.be|adm\.br|adv\.br|am\.br|arq\.br|art\.br|bio\.br|cng\.br|cnt\.br|com\.br|ecn\.br|eng\.br|esp\.br|etc\.br|eti\.br|fm\.br|fot\.br|fst\.br|g12\.br|gov\.br|ind\.br|inf\.br|jor\.br|lel\.br|med\.br|mil\.br|net\.br|nom\.br|ntr\.br|odo\.br|org\.br|ppg\.br|pro\.br|psc\.br|psi\.br|rec\.br|slg\.br|tmp\.br|tur\.br|tv\.br|vet\.br|zlg\.br|br|ab\.ca|bc\.ca|mb\.ca|nb\.ca|nf\.ca|ns\.ca|nt\.ca|on\.ca|pe\.ca|qc\.ca|sk\.ca|yk\.ca|ca|cc|ac\.cn|com\.cn|edu\.cn|gov\.cn|org\.cn|bj\.cn|sh\.cn|tj\.cn|cq\.cn|he\.cn|nm\.cn|ln\.cn|jl\.cn|hl\.cn|js\.cn|zj\.cn|ah\.cn|gd\.cn|gx\.cn|hi\.cn|sc\.cn|gz\.cn|yn\.cn|xz\.cn|sn\.cn|gs\.cn|qh\.cn|nx\.cn|xj\.cn|tw\.cn|hk\.cn|mo\.cn|cn|cx|cz|de|dk|fo|com\.ec|tm\.fr|com\.fr|asso\.fr|presse\.fr|fr|gf|gs|co\.il|net\.il|ac\.il|k12\.il|gov\.il|muni\.il|ac\.in|co\.in|org\.in|ernet\.in|gov\.in|net\.in|res\.in|is|it|ac\.jp|co\.jp|go\.jp|or\.jp|ne\.jp|ac\.kr|co\.kr|go\.kr|ne\.kr|nm\.kr|or\.kr|li|lt|lu|asso\.mc|tm\.mc|com\.mm|org\.mm|net\.mm|edu\.mm|gov\.mm|ms|nl|no|nu|pl|ro|org\.ro|store\.ro|tm\.ro|firm\.ro|www\.ro|arts\.ro|rec\.ro|info\.ro|nom\.ro|nt\.ro|se|si|com\.sg|org\.sg|net\.sg|gov\.sg|sk|st|tf|ac\.th|co\.th|go\.th|mi\.th|net\.th|or\.th|tm|to|com\.tr|edu\.tr|gov\.tr|k12\.tr|net\.tr|org\.tr|com\.tw|org\.tw|net\.tw|ac\.uk|uk\.com|uk\.net|gb\.com|gb\.net|vg|sh|kz|ch|info|ua|gov|name|pro|ie|hk|com\.hk|org\.hk|net\.hk|edu\.hk|us|tk|cd|by|ad|lv|eu\.lv|bz|es|jp|cl|ag|mobi|eu|co\.nz|org\.nz|net\.nz|maori\.nz|iwi\.nz|io|la|md|sc|sg|vc|tw|travel|my|se|tv|pt|com\.pt|edu\.pt|asia|fi|com\.ve|net\.ve|fi|org\.ve|web\.ve|info\.ve|co\.ve|tel|im|gr|ru|net\.ru|org\.ru|hr|com\.hr|ly|xyz)$/);
        }
        function _d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }
        function _i(arg, str) {
            var sptr = arg.charAt(0), split = str.split(sptr);
            if (sptr === arg) {
                return split;
            }
            arg = parseInt(arg.substring(1), 10);
            return split[arg < 0 ? split.length + arg : arg - 1];
        }
        function _f(arg, str) {
            var sptr = arg.charAt(0), split = str.split('&'), field = [], params = {}, tmp = [], arg2 = arg.substring(1);
            for (var i = 0, ii = split.length; i < ii; i++) {
                field = split[i].match(/(.*?)=(.*)/);
                if (!field) {
                    field = [
                        split[i],
                        split[i],
                        ''
                    ];
                }
                if (field[1].replace(/\s/g, '') !== '') {
                    field[2] = _d(field[2] || '');
                    if (arg2 === field[1]) {
                        return field[2];
                    }
                    tmp = field[1].match(/(.*)\[([0-9]+)\]/);
                    if (tmp) {
                        params[tmp[1]] = params[tmp[1]] || [];
                        params[tmp[1]][tmp[2]] = field[2];
                    } else {
                        params[field[1]] = field[2];
                    }
                }
            }
            if (sptr === arg) {
                return params;
            }
            return params[arg2];
        }
        return function (arg, url) {
            var _l = {}, tmp, tmp2;
            if (arg === 'tld?') {
                return _t();
            }
            url = url || window.location.toString();
            if (!arg) {
                return url;
            }
            arg = arg.toString();
            if (tmp = url.match(/^mailto:([^\/].+)/)) {
                _l.protocol = 'mailto';
                _l.email = tmp[1];
            } else {
                if (tmp = url.match(/(.*?)\/#\!(.*)/)) {
                    url = tmp[1] + tmp[2];
                }
                if (tmp = url.match(/(.*?)#(.*)/)) {
                    _l.hash = tmp[2];
                    url = tmp[1];
                }
                if (_l.hash && arg.match(/^#/)) {
                    return _f(arg, _l.hash);
                }
                if (tmp = url.match(/(.*?)\?(.*)/)) {
                    _l.query = tmp[2];
                    url = tmp[1];
                }
                if (_l.query && arg.match(/^\?/)) {
                    return _f(arg, _l.query);
                }
                if (tmp = url.match(/(.*?)\:?\/\/(.*)/)) {
                    _l.protocol = tmp[1].toLowerCase();
                    url = tmp[2];
                }
                if (tmp = url.match(/(.*?)(\/.*)/)) {
                    _l.path = tmp[2];
                    url = tmp[1];
                }
                _l.path = (_l.path || '').replace(/^([^\/])/, '/$1');
                if (arg.match(/^[\-0-9]+$/)) {
                    arg = arg.replace(/^([^\/])/, '/$1');
                }
                if (arg.match(/^\//)) {
                    return _i(arg, _l.path.substring(1));
                }
                tmp = _i('/-1', _l.path.substring(1));
                if (tmp && (tmp = tmp.match(/(.*?)\.(.*)/))) {
                    _l.file = tmp[0];
                    _l.filename = tmp[1];
                    _l.fileext = tmp[2];
                }
                if (tmp = url.match(/(.*)\:([0-9]+)$/)) {
                    _l.port = tmp[2];
                    url = tmp[1];
                }
                if (tmp = url.match(/(.*?)@(.*)/)) {
                    _l.auth = tmp[1];
                    url = tmp[2];
                }
                if (_l.auth) {
                    tmp = _l.auth.match(/(.*)\:(.*)/);
                    _l.user = tmp ? tmp[1] : _l.auth;
                    _l.pass = tmp ? tmp[2] : undefined;
                }
                _l.hostname = url.toLowerCase();
                if (arg.charAt(0) === '.') {
                    return _i(arg, _l.hostname);
                }
                if (_t()) {
                    tmp = _l.hostname.match(_t());
                    if (tmp) {
                        _l.tld = tmp[3];
                        _l.domain = tmp[2] ? tmp[2] + '.' + tmp[3] : undefined;
                        _l.sub = tmp[1] || undefined;
                    }
                }
                if (!_l.port) {
                    if (_l.protocol === 'http' || _l.protocol === 'ws') {
                        _l.port = '80';
                    } else if (_l.protocol === 'https' || _l.protocol === 'wss') {
                        _l.port = '443';
                    }
                }
            }
            if (arg in _l) {
                return _l[arg];
            }
            if (arg === '{}') {
                return _l;
            }
            return undefined;
        };
    }();
    return url;
}));
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.WebSocket = factory();
    }
}(BK, function () {
    var SocketEventMgr = function () {
        function SocketEventMgr() {
            this._wsArray = [];
            BK.Director.ticker.add(function (ts, duration) {
                SocketEventMgr.Instance.dispatchEvent();
            });
        }
        SocketEventMgr.prototype.add = function (so) {
            this._wsArray.push(so);
            BK.Script.log(1, 0, 'SocketEventMgr.add!so = ' + so);
        };
        SocketEventMgr.prototype.del = function (so) {
            var idx = this._wsArray.indexOf(so, 0);
            if (idx >= 0) {
                this._wsArray.splice(idx, 1);
                BK.Script.log(1, 0, 'SocketEventMgr.del!so = ' + so);
            }
        };
        SocketEventMgr.prototype.dispatchEvent = function () {
            this._wsArray.forEach(function (so, index, array) {
                if (so) {
                    so.update();
                }
            });
        };
        return SocketEventMgr;
    }();
    SocketEventMgr.Instance = new SocketEventMgr();
    var KSocket = function () {
        function KSocket(ip, port) {
            this.ip = ip;
            this.port = port;
            this.__nativeObj = new BK.Socket();
            this.prevConnTs = 0;
            this.curConnRetrys = 0;
            this.curConnTimeout = 0;
            this.prevNetState = 0;
            this.options = {
                ConnectRetryCount: 3,
                ConnectTimeoutInterval: 3000
            };
        }
        KSocket.prototype.__internalClose = function () {
            if (this.__nativeObj) {
                return this.__nativeObj.close();
            }
            return -2;
        };
        KSocket.prototype.__internalSend = function (data) {
            if (this.__nativeObj) {
                return this.__nativeObj.send(data);
            }
            return -2;
        };
        KSocket.prototype.__internalRecv = function (length) {
            if (this.__nativeObj) {
                return this.__nativeObj.receive(length);
            }
            return undefined;
        };
        KSocket.prototype.__internalUpdate = function () {
            if (this.__nativeObj) {
                return this.__nativeObj.update();
            }
            return -2;
        };
        KSocket.prototype.__internalConnect = function () {
            if (this.__nativeObj) {
                var ret = this.__nativeObj.connect(this.ip, this.port);
                var curNetStat = this.curNetState();
                switch (this.prevNetState) {
                case 3:
                    this.onReconnectEvent(this);
                case 0: {
                        switch (curNetStat) {
                        case 3: {
                                this.onErrorEvent(this);
                                break;
                            }
                        case 1:
                        case 4: {
                                this.prevConnTs = BK.Time.clock;
                                if (!this.curConnTimeout) {
                                    this.curConnTimeout = this.options.ConnectTimeoutInterval;
                                }
                                this.onConnectingEvent(this);
                                ret = 0;
                                break;
                            }
                        case 2:
                        case 5: {
                                this.onConnectedEvent(this);
                                ret = 0;
                                break;
                            }
                        }
                        break;
                    }
                }
                this.prevNetState = curNetStat;
                return ret;
            }
            return -2;
        };
        KSocket.prototype.__internalCanReadLength = function () {
            if (this.__nativeObj) {
                return this.__nativeObj.canReadLength();
            }
            return 0;
        };
        KSocket.prototype.__internalIsEnableSSL = function () {
            if (this.__nativeObj) {
                return this.__nativeObj.getSSLEnable();
            }
            return false;
        };
        KSocket.prototype.__internalEnableSSL = function (ssl) {
            if (this.__nativeObj) {
                this.__nativeObj.setSSLEnable(ssl);
            }
        };
        KSocket.prototype.__internalUpdateSSL = function () {
            var state = this.__internalUpdate();
            var curNetStat = this.curNetState();
            if (-1 != state) {
                switch (this.prevNetState) {
                case 1: {
                        switch (curNetStat) {
                        case 2: {
                                BK.Script.log(1, 0, 'BK.Socket.update.ssl!connected, ip = ' + this.ip + ', port = ' + this.port);
                                break;
                            }
                        case 4:
                        case 5: {
                                break;
                            }
                        default: {
                                var curTs = BK.Time.clock;
                                var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                                if (diffT * 1000 >= this.curConnTimeout) {
                                    this.curConnRetrys = this.curConnRetrys + 1;
                                    if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                        this.close();
                                        this.connect();
                                        this.curConnTimeout = this.curConnTimeout * 2;
                                    } else {
                                        this.onTimeoutEvent(this);
                                        this.close();
                                    }
                                }
                                return state;
                            }
                        }
                        break;
                    }
                case 2: {
                        break;
                    }
                case 4: {
                        switch (curNetStat) {
                        case 5: {
                                switch (state) {
                                case 2:
                                case 3: {
                                        this.onConnectedEvent(this);
                                        break;
                                    }
                                }
                                break;
                            }
                        default: {
                                var curTs = BK.Time.clock;
                                var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                                if (diffT * 1000 >= this.curConnTimeout) {
                                    this.curConnRetrys = this.curConnRetrys + 1;
                                    if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                        this.close();
                                        this.connect();
                                        this.curConnTimeout = this.curConnTimeout * 2;
                                    } else {
                                        this.onTimeoutEvent(this);
                                        this.close();
                                    }
                                }
                                return state;
                            }
                        }
                        break;
                    }
                case 5: {
                        switch (curNetStat) {
                        case 5: {
                                this.onUpdateEvent(this);
                                break;
                            }
                        case 3: {
                                this.onDisconnectEvent(this);
                                break;
                            }
                        default: {
                                this.onErrorEvent(this);
                            }
                        }
                        break;
                    }
                }
            } else {
                switch (this.prevNetState) {
                case 2:
                case 1: {
                        this.onDisconnectEvent(this);
                        break;
                    }
                case 4:
                case 6:
                case 5: {
                        this.onErrorEvent(this);
                        break;
                    }
                }
            }
            this.prevNetState = curNetStat;
            return state;
        };
        KSocket.prototype.__internalUpdateNoSSL = function () {
            var state = this.__internalUpdate();
            var curNetStat = this.curNetState();
            if (-1 != state) {
                switch (this.prevNetState) {
                case 1: {
                        switch (curNetStat) {
                        case 2: {
                                switch (state) {
                                case 2: {
                                        this.onConnectedEvent(this);
                                        break;
                                    }
                                case 3: {
                                        BK.Script.log(1, 0, 'BK.Socket.update!unexcepted status');
                                        break;
                                    }
                                }
                                break;
                            }
                        default: {
                                var curTs = BK.Time.clock;
                                var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                                if (diffT * 1000 >= this.curConnTimeout) {
                                    this.curConnRetrys = this.curConnRetrys + 1;
                                    if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                        this.close();
                                        this.connect();
                                        this.curConnTimeout = this.curConnTimeout * 2;
                                    } else {
                                        this.onTimeoutEvent(this);
                                        this.close();
                                    }
                                }
                                return state;
                            }
                        }
                        break;
                    }
                case 2: {
                        switch (curNetStat) {
                        case 2: {
                                this.onUpdateEvent(this);
                                break;
                            }
                        case 3: {
                                this.onDisconnectEvent(this);
                                break;
                            }
                        default: {
                                this.onErrorEvent(this);
                            }
                        }
                        break;
                    }
                }
            } else {
                switch (this.prevNetState) {
                case 2:
                case 1: {
                        this.onDisconnectEvent(this);
                        break;
                    }
                }
            }
            this.prevNetState = curNetStat;
            return state;
        };
        KSocket.prototype.curNetState = function () {
            if (this.__nativeObj) {
                return this.__nativeObj.state;
            }
            return 0;
        };
        KSocket.prototype.close = function () {
            var ret = this.__internalClose();
            if (!ret)
                this.prevNetState = 0;
            SocketEventMgr.Instance.del(this);
            return ret;
        };
        KSocket.prototype.send = function (data) {
            var ret = this.__internalSend(data);
            if (ret < 0) {
                this.onErrorEvent(this);
                KSocket.prototype.close.call(this);
            }
            return ret;
        };
        KSocket.prototype.recv = function (length) {
            return this.__internalRecv(length);
        };
        KSocket.prototype.canRecvLength = function () {
            return this.__internalCanReadLength();
        };
        KSocket.prototype.update = function () {
            if (this.isEnableSSL()) {
                return this.__internalUpdateSSL();
            }
            return this.__internalUpdateNoSSL();
        };
        KSocket.prototype.connect = function () {
            var stat = this.curNetState();
            if (0 == stat || 3 == stat) {
                var ret = this.__internalConnect();
                if (!ret) {
                    SocketEventMgr.Instance.add(this);
                }
                return ret;
            }
            return 0;
        };
        KSocket.prototype.isEnableSSL = function () {
            return this.__internalIsEnableSSL();
        };
        KSocket.prototype.enableSSL = function (ssl) {
            this.__internalEnableSSL(ssl);
        };
        KSocket.prototype.onErrorEvent = function (so) {
            BK.Script.log(1, 0, 'BK.Socket.ErrorEvent');
        };
        KSocket.prototype.onUpdateEvent = function (so) {
            return 0;
        };
        KSocket.prototype.onTimeoutEvent = function (so) {
            BK.Script.log(1, 0, 'BK.Socket.TimeoutEvent');
        };
        KSocket.prototype.onConnectingEvent = function (so) {
            BK.Script.log(1, 0, 'BK.Socket.ConnectingEvent');
        };
        KSocket.prototype.onConnectedEvent = function (so) {
            BK.Script.log(1, 0, 'BK.Socket.ConnectedEvent');
        };
        KSocket.prototype.onReconnectEvent = function (so) {
            BK.Script.log(1, 0, 'BK.Socket.ReconnectEvent');
        };
        KSocket.prototype.onDisconnectEvent = function (so) {
            BK.Script.log(1, 0, 'BK.Socket.DisconnectEvent');
        };
        return KSocket;
    }();
    var WebSocketData = function () {
        function WebSocketData(data, isBinary) {
            this.data = data;
            this.isBinary = isBinary;
        }
        return WebSocketData;
    }();
    var KWebSocket = function (_super) {
        __extends(KWebSocket, _super);
        function KWebSocket(ip, port, host, path, query) {
            var _this = _super.call(this, ip, port) || this;
            _this.path = path ? path : '/';
            _this.host = host;
            _this.query = query;
            _this.httpVer = 1.1;
            _this.httpParser = new HTTPParser(HTTPParser.RESPONSE);
            _this.version = 13;
            _this.protocols = new Array();
            _this.extensions = new Array();
            _this.delegate = {
                onOpen: null,
                onClose: null,
                onError: null,
                onMessage: null,
                onSendComplete: null
            };
            if (!_this.options) {
                _this.options = {};
            }
            _this.options.DrainSegmentCount = 8;
            _this.options.DefaultSegmentSize = 4096;
            _this.options.PingPongInterval = 0;
            _this.options.HandleShakeRequestTimeout = 10000;
            _this.options.HandleShakeResponseTimeout = 10000;
            _this.options.CloseAckTimeout = 2000;
            _this.options.PingPongTimeout = 3000;
            _this.clear();
            return _this;
        }
        KWebSocket.prototype.clear = function () {
            this.mask4 = new BK.Buffer(4, false);
            this.txbuf = new BK.Buffer(128, true);
            this.rxbuf = new BK.Buffer(128, true);
            this.txbufQue = new Array();
            this.rxbufQue = new Array();
            this.udataQue = new Array();
            this.peerClosed = false;
            this.txSegCount = 0;
            this.rxSegCount = 0;
            this.rxFrameType = -1;
            this.isFinalSeg = false;
            this.inTxSegFrame = false;
            this.inRxSegFrame = false;
            this.inPartialTxbuf = false;
            this.inPingFrame = false;
            this.inPongFrame = false;
            this.errcode = 65535;
            this.state = 0;
            this.parseState = 0;
            this.phaseTimeout = 0;
            this.pingpongTimer = 0;
            this.prevPhaseTickCount = 0;
            this.prevPingPongTickCount = 0;
        };
        KWebSocket.prototype.getReadyState = function () {
            return this.state;
        };
        KWebSocket.prototype.getErrorCode = function () {
            return this.errcode;
        };
        KWebSocket.prototype.getErrorString = function () {
            return this.message;
        };
        KWebSocket.prototype.randomN = function (n) {
            var b = new BK.Buffer(n, false);
            for (var i_1 = 0; i_1 < n; i_1++) {
                var r = Math.round(Math.random() * 65535);
                b.writeUint8Buffer(r);
            }
            return b;
        };
        KWebSocket.prototype.toHex = function (c) {
            if (c >= 0 && c <= 9)
                return c.toString();
            switch (c) {
            case 10:
                return 'A';
            case 11:
                return 'B';
            case 12:
                return 'C';
            case 13:
                return 'D';
            case 14:
                return 'E';
            case 15:
                return 'F';
            }
            return 'u';
        };
        KWebSocket.prototype.bufferToHexString = function (buf) {
            var s = '';
            buf.rewind();
            while (!buf.eof) {
                var c = buf.readUint8Buffer();
                s = s.concat('x' + this.toHex((c & 240) >> 4) + this.toHex(c & 15) + ' ');
            }
            return s;
        };
        KWebSocket.prototype.startPhaseTimeout = function (phase) {
            if (phase == 6) {
                this.phaseTimeout = phase;
                this.prevPhaseTickCount = 0;
            } else {
                switch (this.state) {
                case 2: {
                        if (phase == 1) {
                            this.phaseTimeout = phase;
                            this.prevPhaseTickCount = BK.Time.clock;
                        }
                        break;
                    }
                case 3: {
                        if (phase == 2) {
                            this.phaseTimeout = phase;
                            this.prevPhaseTickCount = BK.Time.clock;
                        }
                        break;
                    }
                case 1: {
                        if (phase == 3) {
                            this.phaseTimeout = phase;
                            this.prevPhaseTickCount = BK.Time.clock;
                        }
                        break;
                    }
                case 4: {
                        switch (phase) {
                        case 4: {
                                this.options.PingPongTimeout = Math.min(this.options.PingPongTimeout, this.options.PingPongInterval);
                                break;
                            }
                        }
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                        break;
                    }
                }
            }
        };
        KWebSocket.prototype.handlePhaseTimeout = function () {
            if (this.phaseTimeout == 6)
                return;
            var interval = BK.Time.diffTime(this.prevPhaseTickCount, BK.Time.clock);
            switch (this.phaseTimeout) {
            case 1: {
                    if (interval * 1000 > this.options.HandleShakeRequestTimeout) {
                        BK.Script.log(1, 0, 'BK.WebSocket.handlePhaseTimeout!handshake request timeout');
                        this.prevPhaseTickCount = BK.Time.clock;
                        this.state = -1;
                        this.errcode = 4096;
                        this.message = 'handshake request timeout';
                        _super.prototype.close.call(this);
                        if (this.delegate.onError) {
                            this.delegate.onError(this);
                        }
                    }
                    break;
                }
            case 2: {
                    if (interval * 1000 > this.options.HandleShakeResponseTimeout) {
                        BK.Script.log(1, 0, 'BK.WebSocket.handlePhaseTimeout!handshake response timeout');
                        this.prevPhaseTickCount = BK.Time.clock;
                        this.state = -1;
                        this.errcode = 4097;
                        this.message = 'handshake response timeout';
                        _super.prototype.close.call(this);
                        if (this.delegate.onError) {
                            this.delegate.onError(this);
                        }
                    }
                    break;
                }
            case 3: {
                    if (interval * 1000 > this.options.CloseAckTimeout) {
                        BK.Script.log(1, 0, 'BK.WebSocket.handlePhaseTimeout!close ack timeout');
                        this.prevPhaseTickCount = BK.Time.clock;
                        _super.prototype.close.call(this);
                        if (1 == this.state) {
                            if (!this.peerClosed) {
                                this.errcode = 1006;
                                this.message = 'abnormal close';
                                if (this.delegate.onError) {
                                    this.delegate.onError(this);
                                }
                                this.startPhaseTimeout(6);
                            } else {
                                if (this.delegate.onClose) {
                                    this.delegate.onClose(this);
                                }
                            }
                        } else {
                            if (this.delegate.onError) {
                                this.delegate.onError(this);
                            }
                        }
                    }
                    break;
                }
            case 4: {
                    if (interval * 1000 > this.options.PingPongTimeout) {
                        BK.Script.log(1, 0, 'BK.WebSocket.handlePhaseTimeout!receive pong timeout');
                        this.prevPhaseTickCount = BK.Time.clock;
                    }
                    break;
                }
            }
        };
        KWebSocket.prototype.restartPingPongTimer = function () {
            if (4 == this.state && this.options.PingPongInterval > 0) {
                this.prevPingPongTickCount = BK.Time.clock;
            }
        };
        KWebSocket.prototype.handlePingPongTimer = function () {
            if (4 == this.state && this.options.PingPongInterval > 0) {
                var interval = BK.Time.diffTime(this.prevPingPongTickCount, BK.Time.clock);
                if (interval * 1000 > this.options.PingPongInterval) {
                    this.inPingFrame = false;
                    this.txPingData = this.randomN(16);
                    this.sendPingFrame(this.txPingData);
                    this.restartPingPongTimer();
                }
            }
        };
        KWebSocket.prototype.doHandshakePhase = function () {
            var s = '';
            s = s.concat('GET ' + this.path + ' HTTP/' + this.httpVer + '\r\n');
            if (this.port == 80 || this.port == 443) {
                s = s.concat('Host:' + this.host + '\r\n');
            } else {
                s = s.concat('Host:' + this.host + ':' + this.port + '\r\n');
            }
            s = s.concat('Upgrade:websocket\r\n');
            s = s.concat('Connection:Upgrade\r\n');
            var r16 = this.randomN(16);
            var s64 = BK.Misc.encodeBase64FromBuffer(r16);
            s = s.concat('Sec-WebSocket-Key:' + s64 + '\r\n');
            s = s.concat('Sec-WebSocket-Version:' + this.version + '\r\n');
            if (this.query) {
                var qa = this.query.split('&');
                for (var i_2 = 0; i_2 < qa.length; i_2++) {
                    var kv = qa[i_2].split('=');
                    if (kv.length > 0) {
                        s = s.concat(kv[0] + ':' + kv[1] + '\r\n');
                    }
                }
            }
            s = s.concat('\r\n');
            var sha = BK.Misc.sha1(s64.concat('258EAFA5-E914-47DA-95CA-C5AB0DC85B11'));
            this.handshakeSig = BK.Misc.encodeBase64FromBuffer(sha);
            var data = new BK.Buffer(s.length, false);
            data.writeAsString(s, false);
            if (0 < _super.prototype.send.call(this, data)) {
                this.state = 2;
                this.startPhaseTimeout(1);
            }
        };
        KWebSocket.prototype.doSvrHandshakePhase1 = function (resp) {
            var _this = this;
            if (!resp)
                return;
            if (!this.httpParser.onComplete) {
                this.httpParser.onComplete = function () {
                    for (var k in _this.httpParser.headers) {
                    }
                    if (!_this.doSvrHandshakePhase2()) {
                        _this.errcode = 4098;
                        _this.message = 'handshake parse error';
                        _this.startPhaseTimeout(6);
                        _super.prototype.close.call(_this);
                        if (_this.delegate.onError) {
                            _this.delegate.onError(_this);
                        }
                    } else {
                        _this.restartPingPongTimer();
                        _this.startPhaseTimeout(6);
                        if (_this.delegate.onOpen) {
                            _this.delegate.onOpen(_this);
                        }
                    }
                };
            }
            this.httpParser.execute(resp);
            if (2 == this.state) {
                this.state = 3;
                this.startPhaseTimeout(2);
            }
        };
        KWebSocket.prototype.doSvrHandshakePhase2 = function () {
            switch (this.httpParser.statusCode) {
            case 101: {
                    if (undefined == this.httpParser.headers['upgrade']) {
                        this.state = -1;
                        BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!missing \'upgrade\' header');
                        return false;
                    }
                    if (undefined == this.httpParser.headers['connection']) {
                        this.state = -1;
                        BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!missing \'connection\' header');
                        return false;
                    }
                    if ('upgrade' != this.httpParser.headers['connection'].toLowerCase()) {
                        this.state = -1;
                        BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!error \'connection\' header');
                        return false;
                    }
                    if (undefined == this.httpParser.headers['sec-websocket-accept']) {
                        this.state = -1;
                        BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!missing \'sec-websocket-accept\' header');
                        return false;
                    }
                    if (this.handshakeSig != this.httpParser.headers['sec-websocket-accept']) {
                        this.state = -1;
                        BK.Script.log(1, 0, 'BK.WebSocket.doSvrHandshakePhase2!error \'sec-websocket-accept\' header');
                        return false;
                    }
                    this.state = 4;
                    return true;
                }
            case 401: {
                    break;
                }
            }
            return false;
        };
        KWebSocket.prototype.doFrameDataPhase = function (data, opCode, moreSegs) {
            if (moreSegs === void 0) {
                moreSegs = false;
            }
            var total = 6;
            var length = data.length;
            if (this.extensions.length > 0) {
            }
            total = total + length;
            var buf = new BK.Buffer(total, false);
            var bitMask = 0;
            var isMask = false;
            switch (this.version) {
            case 13: {
                    isMask = true;
                    bitMask = 128;
                    break;
                }
            }
            var fin = true;
            switch (opCode) {
            case 1:
            case 2: {
                    if (moreSegs) {
                        if (!this.inTxSegFrame) {
                            fin = false;
                            this.inTxSegFrame = true;
                        } else {
                            fin = false;
                            opCode = 0;
                        }
                    } else {
                        if (this.inTxSegFrame) {
                            opCode = 0;
                        }
                    }
                    break;
                }
            }
            if (!fin) {
                buf.writeUint8Buffer(15 & opCode);
            } else {
                buf.writeUint8Buffer(128 | 15 & opCode);
            }
            if (length < 126) {
                buf.writeUint8Buffer(bitMask | 127 & data.length);
            } else {
                if (length < 65536) {
                    buf.writeUint8Buffer(bitMask | 126);
                    if (KWebSocket.isLittleEndian) {
                        buf.writeUint8Buffer((65280 & length) >> 8);
                        buf.writeUint8Buffer(255 & length);
                    } else {
                        buf.writeUint8Buffer(255 & length);
                        buf.writeUint8Buffer((65280 & length) >> 8);
                    }
                } else {
                    BK.Script.log(1, 0, 'BK.WebSocket.doFrameDataPhase!js don\'t support 64bit data type');
                }
            }
            if (isMask) {
                var mask = this.randomN(4);
                BK.Misc.encodeBufferXorMask4(data, mask);
                buf.writeBuffer(mask);
            }
            buf.writeBuffer(data);
            return buf;
        };
        KWebSocket.prototype.doSvrFrameDataPhase = function (data) {
            if (!data)
                return true;
            while (!data.eof) {
                switch (this.parseState) {
                case 0: {
                        this.mask4.rewind();
                        this.rxbuf = new BK.Buffer(this.options.DefaultSegmentSize, true);
                        this.maskBit = 0;
                        this.rxbuflen = 0;
                        this.isFinalSeg = false;
                        this.parseState = 1;
                    }
                case 1: {
                        var hdr1 = data.readUint8Buffer();
                        if (hdr1 & 128) {
                            this.isFinalSeg = true;
                        } else {
                            this.isFinalSeg = false;
                        }
                        this.opcode = hdr1 & 15;
                        switch (this.version) {
                        case 13: {
                                switch (this.opcode) {
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                case 7:
                                case 11:
                                case 12:
                                case 13:
                                case 14:
                                case 15:
                                    this.errcode = 1002;
                                    this.message = 'protocol error';
                                    BK.Script.log(1, 0, 'BK.WebSocket.doSvrFrameDataPhase!unknown opcode = ' + this.opcode);
                                    return false;
                                }
                                break;
                            }
                        }
                        switch (this.opcode) {
                        case 8:
                        case 9:
                        case 10:
                        case 0:
                            break;
                        default: {
                                if (!this.isFinalSeg) {
                                    if (this.opcode != 1 && this.opcode != 2) {
                                        this.errcode = 1003;
                                        this.message = 'unsupported data';
                                        BK.Script.log(1, 0, 'BK.WebSocket.doSvrFrameDataPhase!illegal opcode = ' + this.opcode);
                                        return false;
                                    }
                                }
                                if (-1 == this.rxFrameType) {
                                    this.rxFrameType = this.opcode;
                                } else if (this.rxFrameType != this.opcode) {
                                    this.errcode = 1002;
                                    this.message = 'protocol error';
                                    BK.Script.log(1, 0, 'BK.WebSocket.doSvrFrameDataPhase!rxFrameType = ' + this.rxFrameType + ', illegal opcode = ' + this.opcode);
                                    return false;
                                }
                            }
                        }
                        this.parseState = 2;
                        if (data.eof)
                            return true;
                    }
                case 2: {
                        var hdrLen = data.readUint8Buffer();
                        this.maskBit = (128 & hdrLen) >> 7;
                        switch (127 & hdrLen) {
                        case 126: {
                                this.parseState = 3;
                                if (data.eof)
                                    return true;
                                break;
                            }
                        case 127: {
                                this.parseState = 5;
                                if (data.eof)
                                    return true;
                                break;
                            }
                        default: {
                                this.rxbuflen = 127 & hdrLen;
                                if (this.maskBit == 1) {
                                    this.parseState = 13;
                                } else {
                                    this.parseState = 17;
                                }
                                if (this.rxbuflen > 0 && data.eof)
                                    return true;
                            }
                        }
                    }
                }
                switch (this.parseState) {
                case 3: {
                        var n = data.readUint8Buffer();
                        if (KWebSocket.isLittleEndian) {
                            this.rxbuflen |= (255 & n) << 8;
                        } else {
                            this.rxbuflen |= 255 & n;
                        }
                        if (data.eof)
                            return true;
                    }
                case 4: {
                        var n = data.readUint8Buffer();
                        if (KWebSocket.isLittleEndian) {
                            this.rxbuflen |= 255 & n;
                        } else {
                            this.rxbuflen |= (255 & n) << 8;
                        }
                        if (this.maskBit == 1) {
                            this.parseState = 13;
                        } else {
                            this.parseState = 17;
                        }
                        if (this.rxbuflen > 0 && data.eof) {
                            return true;
                        }
                        break;
                    }
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12: {
                        this.errcode = 1002;
                        this.message = 'protocol errors';
                        BK.Script.log(1, 0, 'BK.WebSocket.doSvrFrameDataPhase!js don\'t support 64bit data type');
                        return false;
                    }
                }
                switch (this.parseState) {
                case 13: {
                        this.mask4.writeUint8Buffer(data.readUint8Buffer());
                        this.parseState = 14;
                        if (data.eof)
                            return true;
                    }
                case 14: {
                        this.mask4.writeUint8Buffer(data.readUint8Buffer());
                        this.parseState = 15;
                        if (data.eof)
                            return true;
                    }
                case 15: {
                        this.mask4.writeUint8Buffer(data.readUint8Buffer());
                        this.parseState = 16;
                        if (data.eof)
                            return true;
                    }
                case 16: {
                        this.mask4.writeUint8Buffer(data.readUint8Buffer());
                        this.parseState = 17;
                        if (data.eof)
                            return true;
                    }
                }
                if (17 == this.parseState) {
                    var relen = data.length - data.pointer;
                    if (relen <= this.rxbuflen - this.rxbuf.length) {
                        this.rxbuf.writeBuffer(data.readBuffer(relen));
                    } else {
                        this.rxbuf.writeBuffer(data.readBuffer(this.rxbuflen - this.rxbuf.length));
                    }
                    if (this.rxbuf.length == this.rxbuflen) {
                        this.rxSegCount = this.rxSegCount + 1;
                        this.parseState = 0;
                        if (this.isFinalSeg) {
                            this.rxbuf.rewind();
                            switch (this.opcode) {
                            case 8: {
                                    BK.Script.log(0, 0, 'BK.WebSocket.doSvrFrameDataPhase!receive close frame');
                                    this.handleCloseFrame();
                                    break;
                                }
                            case 9: {
                                    BK.Script.log(0, 0, 'BK.WebSocket.doSvrFrameDataPhase!receive ping frame');
                                    this.handlePingFrame();
                                    break;
                                }
                            case 10: {
                                    BK.Script.log(0, 0, 'BK.WebSocket.doSvrFrameDataPhase!receive pong frame');
                                    this.handlePongFrame();
                                    break;
                                }
                            default: {
                                    this.rxbufQue.push(this.rxbuf);
                                    this.recvFrameFromRxQ(this.rxFrameType);
                                    this.rxSegCount = 0;
                                    this.rxFrameType = -1;
                                }
                            }
                        } else {
                            this.rxbuf.rewind();
                            this.rxbufQue.push(this.rxbuf);
                        }
                    }
                }
            }
            return true;
        };
        KWebSocket.prototype.handleCloseFrame = function () {
            this.peerClosed = true;
            if (4 == this.state) {
                var errcode = this.rxbuf.readUint16Buffer();
                var msgbuff = this.rxbuf.readBuffer(this.rxbuflen - 2);
                if (!errcode) {
                    this.errcode = 1005;
                    this.message = 'no status recv';
                } else {
                    this.errcode = errcode;
                    this.message = msgbuff.readAsString();
                }
                BK.Script.log(1, 0, 'BK.WebSocket.handleCloseFrame!errcode = ' + this.errcode + ', msg = ' + this.message);
                this.sendCloseFrame(this.errcode, this.message ? this.message : '');
            } else if (1 == this.state) {
                BK.Script.log(1, 0, 'BK.WebSocket.handleCloseFrame!normal closed');
                this.close();
                this.state = 0;
                if (this.delegate.onMessage) {
                    while (this.udataQue.length > 0) {
                        var udata = this.udataQue.shift();
                        this.delegate.onMessage(this, udata);
                    }
                }
                if (this.delegate.onClose) {
                    this.delegate.onClose(this);
                }
            }
        };
        KWebSocket.prototype.handlePingFrame = function () {
            if (4 == this.state) {
                if (this.rxbuflen > 128 - 3) {
                    this.errcode = 4099;
                    this.message = 'ping packet large';
                    return;
                }
                if (this.inPongFrame) {
                    BK.Script.log(1, 0, 'BK.WebSocket.handlePingFrame!already recv ping, drop it.');
                    return;
                }
                this.rxPongData = new BK.Buffer(this.rxbuflen, true);
                this.rxPongData.writeBuffer(this.rxbuf.readBuffer(this.rxbuflen));
                this.sendPongFrame(this.rxPongData);
            }
        };
        KWebSocket.prototype.handlePongFrame = function () {
            if (4 == this.state) {
                var data = new BK.Buffer(this.rxbuflen, true);
                data.writeBuffer(this.rxbuf.readBuffer(this.rxbuflen));
                this.startPhaseTimeout(6);
                BK.Script.log(0, 0, 'BK.WebSocket.handlePongFrame!pong data = ' + this.bufferToHexString(data));
            }
        };
        KWebSocket.prototype.sendFrameFromTxQ = function (t) {
            if (4 != this.state)
                return;
            if (this.inPartialTxbuf) {
                var txBytes = _super.prototype.send.call(this, this.txbuf);
                if (txBytes > 0) {
                    this.restartPingPongTimer();
                    if (txBytes < this.txbuf.length) {
                        var cap = this.txbuf.length - txBytes;
                        var buf = new BK.Buffer(cap, false);
                        this.txbuf.rewind();
                        this.txbuf.jumpBytes(txBytes);
                        buf.writeBuffer(this.txbuf.readBuffer(cap));
                        this.txbuf = buf;
                        return false;
                    }
                    this.inPartialTxbuf = false;
                } else {
                    BK.Script.log(1, txBytes, 'BK.WebSocket.sendFrameFromTxQ!partial send failed, data type = ' + t);
                    return false;
                }
            }
            var succ = true;
            var n = Math.min(this.options.DrainSegmentCount, this.txbufQue.length);
            for (; n > 0; n--) {
                var data = this.txbufQue.shift();
                var moreSegs = this.txbufQue.length > 0;
                var frameData = this.doFrameDataPhase(data, t, moreSegs);
                var txBytes = _super.prototype.send.call(this, frameData);
                if (txBytes > 0) {
                    this.restartPingPongTimer();
                    if (txBytes < frameData.length) {
                        frameData.rewind();
                        frameData.jumpBytes(txBytes);
                        this.txbuf.rewind();
                        this.txbuf.writeBuffer(frameData.readBuffer(frameData.length - txBytes));
                        this.inPartialTxbuf = true;
                        succ = false;
                        BK.Script.log(1, 0, 'BK.WebSocket.sendFrameFromTxQ!partial send, total size = ' + frameData.length + ', tx size = ' + txBytes);
                        break;
                    }
                } else {
                    succ = false;
                    BK.Script.log(1, txBytes, 'BK.WebSocket.sendFrameFromTxQ!send failed, data type = ' + t);
                    break;
                }
            }
            if (succ) {
                if (!this.txbufQue.length && this.inTxSegFrame) {
                    this.inTxSegFrame = false;
                }
            }
            return succ;
        };
        KWebSocket.prototype.recvFrameFromRxQ = function (t) {
            var isBinary = t == 2;
            var udata = new BK.Buffer(128, true);
            while (this.rxbufQue.length > 0) {
                var rxbuf = this.rxbufQue.shift();
                udata.writeBuffer(rxbuf);
            }
            if (false == isBinary) {
                udata.writeUint8Buffer(0);
            }
            udata.rewind();
            this.udataQue.push(new WebSocketData(udata, isBinary));
        };
        KWebSocket.prototype.__sendBinaryFrame = function (data, frameType) {
            var totLen = data.length;
            var segLen = this.options.DefaultSegmentSize;
            var offset = 0;
            data.rewind();
            while (totLen > segLen) {
                var buf = new BK.Buffer(segLen, false);
                data.rewind();
                data.jumpBytes(offset);
                buf.writeBuffer(data.readBuffer(segLen));
                buf.rewind();
                this.txbufQue.push(buf);
                offset = offset + segLen;
                totLen = totLen - segLen;
            }
            if (totLen > 0) {
                var buf = new BK.Buffer(totLen, false);
                data.rewind();
                data.jumpBytes(offset);
                buf.writeBuffer(data.readBuffer(totLen));
                buf.rewind();
                this.txbufQue.push(buf);
            }
            this.txFrameType = frameType;
            return this.sendFrameFromTxQ(frameType);
        };
        KWebSocket.prototype.sendTextFrame = function (text) {
            if (4 != this.state)
                return false;
            var data = new BK.Buffer(128, true);
            data.writeAsString(text, false);
            data.rewind();
            return this.__sendBinaryFrame(data, 1);
        };
        KWebSocket.prototype.sendBinaryFrame = function (data) {
            if (4 != this.state)
                return;
            return this.__sendBinaryFrame(data, 2);
        };
        KWebSocket.prototype.sendCloseFrame = function (code, reason) {
            if (this.isSendClose)
                return;
            this.isSendClose = true;
            var buf = new BK.Buffer(reason.length + 1, false);
            var data = new BK.Buffer(3 + reason.length, false);
            if (KWebSocket.isLittleEndian) {
                data.writeUint8Buffer((65280 & code) >> 8);
                data.writeUint8Buffer(255 & code);
            } else {
                data.writeUint8Buffer(255 & code);
                data.writeUint8Buffer((65280 & code) >> 8);
            }
            buf.writeAsString(reason, true);
            data.writeBuffer(buf);
            var frameData = this.doFrameDataPhase(data, 8);
            if (0 < _super.prototype.send.call(this, frameData)) {
                this.state = 1;
                this.startPhaseTimeout(3);
                BK.Script.log(1, 0, 'BK.WebSocket.sendCloseFrame!code = ' + code + ', reason = ' + reason);
            }
        };
        KWebSocket.prototype.sendPingFrame = function (data) {
            if (this.inPingFrame)
                return;
            BK.Script.log(0, 0, 'BK.WebSocket.sendPingFrame!ping data = ' + this.bufferToHexString(data));
            var frameData = this.doFrameDataPhase(data, 9);
            if (0 < _super.prototype.send.call(this, frameData)) {
                this.inPingFrame = true;
                this.startPhaseTimeout(4);
            }
        };
        KWebSocket.prototype.sendPongFrame = function (data) {
            if (this.inPongFrame)
                return;
            var frameData = this.doFrameDataPhase(data, 10);
            if (0 < _super.prototype.send.call(this, frameData)) {
                this.inPongFrame = true;
            }
        };
        KWebSocket.prototype.onErrorEvent = function (so) {
            if (this.state == 0 || this.state == 1)
                return;
            _super.prototype.onErrorEvent.call(this, so);
            this.state = -1;
            this.errcode = 1006;
            this.message = 'abnormal closure';
            if (this.delegate.onError) {
                this.delegate.onError(this);
            }
        };
        KWebSocket.prototype.onTimeoutEvent = function (so) {
            _super.prototype.onErrorEvent.call(this, so);
            this.state = 0;
            this.errcode = -1000;
            this.message = 'socket connect timeout';
            if (this.delegate.onError) {
                this.delegate.onError(this);
            }
        };
        KWebSocket.prototype.onDisconnectEvent = function (so) {
            _super.prototype.onDisconnectEvent.call(this, so);
            switch (this.state) {
            case 2:
            case 3:
            case 4: {
                    this.state = -1;
                    this.errcode = 1006;
                    this.message = 'abnormal closure';
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                    break;
                }
            case 1: {
                    this.state = 0;
                    if (this.delegate.onClose) {
                        this.delegate.onClose(this);
                    }
                    BK.Script.log(1, 0, 'BK.WebSocket.onDisconnectEvent!enter closed state');
                    break;
                }
            }
        };
        KWebSocket.prototype.onConnectedEvent = function (so) {
            _super.prototype.onConnectedEvent.call(this, so);
            if (0 == this.state) {
                this.clear();
                this.doHandshakePhase();
            }
        };
        KWebSocket.prototype.phaseBufferCheck = function (buff) {
            var endSymbol = '\r\n\r\n';
            var cursor = 0;
            var flag = 0;
            while (!buff.eof) {
                var hdr1 = buff.readUint8Buffer();
                flag++;
                if (hdr1 == endSymbol.charCodeAt(cursor)) {
                    cursor++;
                    if (cursor == endSymbol.length) {
                        return flag;
                    }
                } else {
                    cursor = 0;
                }
            }
            return -1;
        };
        KWebSocket.prototype.onUpdateEvent = function (so) {
            _super.prototype.onUpdateEvent.call(this, so);
            switch (this.state) {
            case 2:
            case 3: {
                    var rlen = so.canRecvLength();
                    if (rlen > 0) {
                        var buf = this.recv(rlen);
                        var flag = this.phaseBufferCheck(buf);
                        buf.rewind();
                        if (flag < buf.length) {
                            var handshakeBuf = buf.readBuffer(flag);
                            if (undefined != handshakeBuf) {
                                this.doSvrHandshakePhase1(handshakeBuf.readAsString(true));
                            }
                            this.handlePhaseTimeout();
                            if (this.state != 4) {
                                BK.Script.log(1, 0, 'BK.Websocket websocket state expected ESTABLISHED!');
                                break;
                            }
                            BK.Script.log(1, 0, 'BK.Websocket pointer:' + buf.pointer + 'length:' + buf.length);
                            if (undefined != buf) {
                                while (!buf.eof) {
                                    if (!this.doSvrFrameDataPhase(buf)) {
                                        this.sendCloseFrame(this.errcode, this.message ? this.message : '');
                                        if (this.delegate.onError) {
                                            this.delegate.onError(this);
                                        }
                                        break;
                                    }
                                }
                            }
                            if (this.delegate.onMessage) {
                                while (this.udataQue.length > 0) {
                                    var udata = this.udataQue.shift();
                                    this.delegate.onMessage(this, udata);
                                }
                            }
                            if (this.txbufQue.length > 0) {
                                this.sendFrameFromTxQ(this.txFrameType);
                            } else if (this.delegate.onSendComplete) {
                                this.delegate.onSendComplete(this);
                            }
                            this.inPongFrame = false;
                            this.handlePhaseTimeout();
                            this.handlePingPongTimer();
                        } else {
                            if (undefined != buf) {
                                this.doSvrHandshakePhase1(buf.readAsString(true));
                            }
                            this.handlePhaseTimeout();
                        }
                    }
                    break;
                }
            case 4: {
                    var rlen = so.canRecvLength();
                    if (rlen > 0) {
                        var rbuf = this.recv(rlen);
                        if (undefined != rbuf) {
                            while (!rbuf.eof) {
                                if (!this.doSvrFrameDataPhase(rbuf)) {
                                    this.sendCloseFrame(this.errcode, this.message ? this.message : '');
                                    if (this.delegate.onError) {
                                        this.delegate.onError(this);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    if (this.delegate.onMessage) {
                        while (this.udataQue.length > 0) {
                            var udata = this.udataQue.shift();
                            this.delegate.onMessage(this, udata);
                        }
                    }
                    if (this.txbufQue.length > 0) {
                        this.sendFrameFromTxQ(this.txFrameType);
                    } else if (this.delegate.onSendComplete) {
                        this.delegate.onSendComplete(this);
                    }
                    this.inPongFrame = false;
                    this.handlePhaseTimeout();
                    this.handlePingPongTimer();
                    break;
                }
            case 1: {
                    var rlen = so.canRecvLength();
                    if (rlen > 0 && this.doSvrFrameDataPhase(this.recv(rlen))) {
                        if (this.delegate.onMessage) {
                            while (this.udataQue.length > 0) {
                                var udata = this.udataQue.shift();
                                this.delegate.onMessage(this, udata);
                            }
                        }
                    }
                    this.handlePhaseTimeout();
                    break;
                }
            }
            return 0;
        };
        return KWebSocket;
    }(KSocket);
    KWebSocket.isLittleEndian = BK.Misc.isLittleEndian();
    var TxData = function () {
        function TxData(data, isBinary) {
            this.data = data;
            this.isBinary = isBinary;
        }
        return TxData;
    }();
    ;
    var WebSocket = function () {
        function WebSocket(url) {
            var _this = this;
            this.__url = url;
            this.options = null;
            this.inTrans = false;
            this.isPendingConn = true;
            this.txdataQ = new Array();
            var res = BK.URL('{}', url);
            this.scheme = res.protocol;
            this.port = res.port;
            this.path = res.path;
            this.query = res.query;
            this.host = res.hostname;
            BK.DNS.queryIPAddress(res.hostname, function (reason, af, iplist) {
                switch (reason) {
                case 0: {
                        BK.Script.log(1, 0, 'BK.WebSocket.queryIPAddress!iplist = ' + JSON.stringify(iplist));
                        _this.iplist = iplist;
                        _this.__nativeObj = new KWebSocket(iplist[0], _this.port, _this.host, _this.path, _this.query);
                        if (_this.scheme == 'wss') {
                            _this.__nativeObj.enableSSL(true);
                        }
                        if (_this.options) {
                            _this.setOptions(_this.options);
                            _this.options = null;
                        }
                        if (_this.isPendingConn) {
                            _this.connect();
                            _this.isPendingConn = false;
                        }
                        _this.__nativeObj.delegate.onOpen = function (kws) {
                            if (_this.txdataQ.length > 0) {
                                _this.send(_this.txdataQ.shift());
                            }
                            if (_this.onOpen) {
                                _this.onOpen(_this);
                            } else if (_this.onopen) {
                                _this.onopen.call(_this);
                            }
                        };
                        _this.__nativeObj.delegate.onClose = function (kws) {
                            var event = {};
                            event.code = _this.getErrorCode();
                            event.reason = _this.getErrorString();
                            if (_this.onClose) {
                                _this.onClose(_this, event);
                            } else if (_this.onclose) {
                                _this.onclose.call(_this, event);
                            }
                        };
                        _this.__nativeObj.delegate.onError = function (kws) {
                            var event = {};
                            event.code = _this.getErrorCode();
                            event.reason = _this.getErrorString();
                            if (_this.onError) {
                                _this.onError(_this, event);
                            } else if (_this.onerror) {
                                _this.onerror.call(_this, event);
                            }
                        };
                        _this.__nativeObj.delegate.onMessage = function (kws, event) {
                            if (_this.onMessage) {
                                _this.onMessage(_this, event);
                            } else if (_this.onmessage) {
                                if (event.isBinary == true) {
                                    var buf = event.data;
                                    buf.rewind();
                                    var ab = new ArrayBuffer(buf.length);
                                    var da = new DataView(ab);
                                    while (!buf.eof) {
                                        da.setUint8(buf.pointer, buf.readUint8Buffer());
                                    }
                                    event.data = ab;
                                }
                                _this.onmessage.call(_this, event);
                            }
                        };
                        _this.__nativeObj.delegate.onSendComplete = function (kws) {
                            if (_this.txdataQ.length > 0) {
                                var txdata = _this.txdataQ.shift();
                                if (!txdata.isBinary)
                                    _this.__nativeObj.sendTextFrame(txdata.data);
                                else
                                    _this.__sendBinaryFrame(txdata.data);
                                _this.inTrans = true;
                            } else {
                                _this.inTrans = false;
                            }
                        };
                        break;
                    }
                }
            });
        }
        Object.defineProperty(WebSocket.prototype, 'url', {
            get: function () {
                return this.__url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebSocket.prototype, 'readyState', {
            get: function () {
                return this.getReadyState();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebSocket.prototype, 'bufferedAmount', {
            get: function () {
                var bufferdAmount = 0;
                for (var i_3 = 0; i_3 < this.txdataQ.length; i_3++) {
                    bufferdAmount = bufferdAmount + this.txdataQ[i_3].data.length;
                }
                return bufferdAmount;
            },
            enumerable: true,
            configurable: true
        });
        WebSocket.prototype.__sendBinaryFrame = function (data) {
            if (Object.prototype.hasOwnProperty.call(data, '__rawBKData')) {
                return this.__nativeObj.sendBinaryFrame(data.__rawBKData);
            }
            if (data instanceof Int8Array == true || data instanceof Uint8Array == true || data instanceof Int16Array == true || data instanceof Uint16Array == true || data instanceof Int32Array == true || data instanceof Uint32Array == true || data instanceof Float32Array == true) {
                var bf = new BK.Buffer(data.byteLength);
                var da = new DataView(data.buffer);
                for (var i = 0; i < data.byteLength; i++) {
                    bf.writeUint8Buffer(da.getUint8(i));
                }
                return this.__nativeObj.sendBinaryFrame(bf);
            } else if (data instanceof ArrayBuffer == true) {
                var bf = new BK.Buffer(data.byteLength);
                var da = new DataView(data);
                for (var i = 0; i < data.byteLength; i++) {
                    bf.writeUint8Buffer(da.getUint8(i));
                }
                return this.__nativeObj.sendBinaryFrame(bf);
            }
            return this.__nativeObj.sendBinaryFrame(data);
        };
        WebSocket.prototype.getReadyState = function () {
            if (this.__nativeObj) {
                return this.__nativeObj.getReadyState();
            }
            return 0;
        };
        WebSocket.prototype.getErrorCode = function () {
            if (this.__nativeObj) {
                return this.__nativeObj.getErrorCode();
            }
            return 65535;
        };
        WebSocket.prototype.getErrorString = function () {
            if (this.__nativeObj) {
                return this.__nativeObj.getErrorString();
            }
            return '';
        };
        WebSocket.prototype.close = function () {
            var state = this.getReadyState();
            if (4 == state) {
                this.__nativeObj.sendCloseFrame(1000, 'see ya');
            }
        };
        WebSocket.prototype.connect = function () {
            if (this.__nativeObj) {
                return this.__nativeObj.connect() != 0;
            }
            return true;
        };
        WebSocket.prototype.send = function (data) {
            var state = this.getReadyState();
            if (1 == state || 0 == state) {
                return false;
            }
            if (typeof data == 'string') {
                if (this.inTrans || state != 4) {
                    this.txdataQ.push(new TxData(data, false));
                } else {
                    this.inTrans = true;
                    return this.__nativeObj.sendTextFrame(data);
                }
            } else if (typeof data == 'object') {
                if (this.inTrans || state != 4) {
                    this.txdataQ.push(new TxData(data, true));
                } else {
                    this.inTrans = true;
                    return this.__sendBinaryFrame(data);
                }
            }
            return false;
        };
        WebSocket.prototype.setOptions = function (options) {
            if (!this.__nativeObj) {
                this.options = options;
                return;
            }
            if (options.DrainSegmentCount)
                this.__nativeObj.options.DrainSegmentCount = options.DrainSegmentCount;
            if (options.DefaultSegmentSize)
                this.__nativeObj.options.DefaultSegmentSize = options.DefaultSegmentSize;
            if (options.PingPongInterval)
                this.__nativeObj.options.PingPongInterval = options.PingPongInterval;
            if (options.HandleShakeRequestTimeout)
                this.__nativeObj.options.HandleShakeRequestTimeout = options.HandleShakeRequestTimeout;
            if (options.HandleShakeResponseTimeout)
                this.__nativeObj.options.HandleShakeResponseTimeout = options.HandleShakeResponseTimeout;
            if (options.CloseAckTimeout)
                this.__nativeObj.options.CloseAckTimeout = options.CloseAckTimeout;
            if (options.PingPongTimeout)
                this.__nativeObj.options.PingPongTimeout = options.PingPongTimeout;
        };
        return WebSocket;
    }();
    return WebSocket;
}));
var SheetSprite = function () {
    function SheetSprite(textureInfo, width, height, flipU, flipV, stretchX, stretchY) {
        this.size = {
            width: 0,
            height: 0
        };
        this.flipU = 0;
        this.flipV = 1;
        this.stretchX = 1;
        this.stretchY = 1;
        if (flipU) {
            this.flipU = flipU;
        }
        if (flipV) {
            this.flipV = flipV;
        }
        if (stretchX) {
            this.stretchX = stretchX;
        }
        if (stretchY) {
            this.stretchY = stretchY;
        }
        if (width) {
            this.size.width = width;
        }
        if (height) {
            this.size.height = height;
        }
        this.textureInfo = textureInfo;
        this.onInit(this.size.width, this.size.height);
        this.adjustWithTextureInfo(textureInfo);
    }
    SheetSprite.prototype.onInit = function (width, height) {
        this.createSprites(width, height);
        var names = Object.getOwnPropertyNames(this.__nativeObj);
        names.forEach(function (element) {
            var key = element;
            Object.defineProperty(this, key, {
                get: function () {
                    return this.__nativeObj[key];
                },
                set: function (obj) {
                    this.__nativeObj[key] = obj;
                }
            });
        }, this);
        Object.defineProperty(this, 'size', {
            get: function () {
                return this.__nativeObj.contentSize;
            },
            set: function (obj) {
                this.__nativeObj.contentSize = obj;
                this.updateSize(this.textureInfo);
            }
        });
        Object.defineProperty(this, 'anchor', {
            get: function () {
                return this.__nativeObj.localAnchor;
            },
            set: function (obj) {
                this.__nativeObj.localAnchor = obj;
            }
        });
    };
    SheetSprite.prototype.updateSize = function (textureInfo) {
        if (textureInfo.frameInfo.trimmed == true) {
            var x = textureInfo.frameInfo.spriteSourceSize.x;
            var y = textureInfo.frameInfo.spriteSourceSize.y;
            var w = textureInfo.frameInfo.spriteSourceSize.w;
            var h = textureInfo.frameInfo.spriteSourceSize.h;
            var srcSize = textureInfo.frameInfo.sourceSize;
            var currSize = this.__nativeObj.contentSize;
            x = currSize.width * x / srcSize.w;
            y = currSize.height * y / srcSize.h;
            w = currSize.width * w / srcSize.w;
            h = currSize.height * h / srcSize.h;
            this.contentSprite.position = {
                x: x,
                y: y
            };
            this.contentSprite.contentSize = {
                width: w,
                height: h
            };
        } else {
            this.contentSprite.contentSize = this.__nativeObj.contentSize;
        }
    };
    SheetSprite.prototype.adjustWithTextureInfo = function (textureInfo) {
        if (textureInfo) {
            this.textureInfo = textureInfo;
            var tex = textureInfo.texture;
            var frameInfo = textureInfo.frameInfo;
            this.updateSize(textureInfo);
            this.currTexturePath = textureInfo.texturePath;
            var tex = new BK.Texture(this.currTexturePath);
            this.contentSprite.setTexture(tex);
            this.contentSprite.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
        }
    };
    SheetSprite.prototype.setTexture = function (tex) {
        this.__nativeObj.setTexture(tex);
    };
    SheetSprite.prototype.dispose = function () {
        BK.Director.ticker.remove(this);
        this.__nativeObj.dispose();
    };
    SheetSprite.prototype.removeChild = function (child) {
        return this.__nativeObj.removeChild(child);
    };
    SheetSprite.prototype.removeChildById = function (id, dispose) {
        return this.__nativeObj.removeChildById(id, dispose);
    };
    SheetSprite.prototype.removeChildByName = function (name, dispose) {
        return this.__nativeObj.removeChildByName(name, dispose);
    };
    SheetSprite.prototype.removeFromParent = function () {
        return this.__nativeObj.removeFromParent();
    };
    SheetSprite.prototype.addChild = function (child, index) {
        return this.__nativeObj.addChild(child, index);
    };
    SheetSprite.prototype.hittest = function (position) {
        return this.__nativeObj.hittest(position);
    };
    SheetSprite.prototype.convertToWorldSpace = function (position) {
        return this.__nativeObj.convertToWorldSpace(position);
    };
    SheetSprite.prototype.convertToNodeSpace = function (position) {
        return this.__nativeObj.convertToNodeSpace(position);
    };
    SheetSprite.prototype.createSprites = function (width, height) {
        this.__nativeObj = new BK.SpriteNode(width, height, {}, this.flipU, this.flipV, this.stretchX, this.stretchY);
        this.contentSprite = new BK.SpriteNode(width, height, {}, this.flipU, this.flipV, this.stretchX, this.stretchY);
        this.__nativeObj.addChild(this.contentSprite);
    };
    return SheetSprite;
}();
if (!BK.SheetSprite) {
    BK.SheetSprite = SheetSprite;
}
var SpriteSheetCache = function () {
    function SpriteSheetCache() {
        this.sheets = {};
        this.jsonConfigs = {};
    }
    SpriteSheetCache.prototype.getFrameInfoByFilename = function (filename) {
        for (var texturePath in this.jsonConfigs) {
            if (this.jsonConfigs.hasOwnProperty(texturePath)) {
                var config = this.jsonConfigs[texturePath];
                var texture = this.sheets[texturePath];
                var frames = config.frames;
                var meta = config.meta;
                this.fullWidth = meta.size.w;
                this.fullHeight = meta.size.h;
                for (var index = 0; index < frames.length; index++) {
                    var frm = frames[index];
                    if (filename == frm.filename) {
                        var frame = {
                            x: 0,
                            y: 1,
                            w: 0,
                            h: 0
                        };
                        var rotated = frm.rotated;
                        var trimmed = frm.trimmed;
                        var spriteSourceSize = frm.spriteSourceSize;
                        var sourceSize = frm.sourceSize;
                        if (rotated) {
                            frame.x = frm.frame.x;
                            frame.y = this.fullHeight - frm.frame.y - frm.frame.w;
                            frame.w = frm.frame.w;
                            frame.h = frm.frame.h;
                        } else {
                            frame.x = frm.frame.x;
                            frame.y = this.fullHeight - frm.frame.y - frm.frame.h;
                            frame.w = frm.frame.w;
                            frame.h = frm.frame.h;
                        }
                        spriteSourceSize.y = sourceSize.h - spriteSourceSize.y - spriteSourceSize.h;
                        var retSheetFrame = {
                            filename: filename,
                            frame: frame,
                            rotated: rotated,
                            trimmed: trimmed,
                            spriteSourceSize: spriteSourceSize,
                            sourceSize: sourceSize
                        };
                        return retSheetFrame;
                    }
                }
            }
        }
        return null;
    };
    SpriteSheetCache.prototype.getTexturePathByFilename = function (filename) {
        for (var texturePath in this.jsonConfigs) {
            if (this.jsonConfigs.hasOwnProperty(texturePath)) {
                var config = this.jsonConfigs[texturePath];
                var frames = config.frames;
                for (var index = 0; index < frames.length; index++) {
                    var frame = frames[index];
                    if (frame.filename == filename) {
                        return texturePath;
                    }
                }
            }
        }
        return null;
    };
    SpriteSheetCache.prototype.loadSheet = function (jsonPath, texturePath, format, minFilter, magFilter, uWrap, vWrap) {
        var buff = BK.FileUtil.readFile(jsonPath);
        var sheetJsonStr = buff.readAsString();
        if (sheetJsonStr) {
            var sheetObj = JSON.parse(sheetJsonStr);
            if (texturePath === void 0) {
                texturePath = jsonPath.replace(/.json$/, '.png');
            }
            this.jsonConfigs[texturePath] = sheetObj;
            if (format === void 0) {
                format = 4;
            }
            format = 4;
            if (minFilter === void 0) {
                minFilter = 1;
            }
            if (magFilter === void 0) {
                magFilter = 1;
            }
            if (uWrap === void 0) {
                uWrap = 1;
            }
            if (vWrap === void 0) {
                vWrap = 1;
            }
            var tex = new BK.Texture(texturePath, format, minFilter, magFilter, uWrap, vWrap);
            this.sheets[texturePath] = tex;
        } else {
            BK.Script.log(0, 0, 'loadSheet Failed.Please check path');
        }
    };
    SpriteSheetCache.prototype.removeSheet = function (jsonPath, texturePath) {
        if (this.jsonConfigs[texturePath]) {
            for (var key in this.jsonConfigs) {
                if (this.jsonConfigs.hasOwnProperty(key)) {
                    var val = this.jsonConfigs[key];
                    if (key == texturePath) {
                        delete this.jsonConfigs[texturePath];
                        BK.Script.log(0, 0, 'Delete jsonConfigs key:' + key + ' val:' + val);
                    }
                }
            }
        }
        if (this.sheets[texturePath]) {
            for (var key in this.sheets) {
                if (this.sheets.hasOwnProperty(key)) {
                    var val = this.sheets[key];
                    if (key == texturePath) {
                        delete this.sheets[texturePath];
                        BK.Script.log(0, 0, 'Delete sheets key:' + key + ' val:' + val);
                    }
                }
            }
        }
    };
    SpriteSheetCache.prototype.getTextureByFilename = function (filename) {
        var frameInfo = this.getFrameInfoByFilename(filename);
        var texturePath = this.getTexturePathByFilename(filename);
        if (frameInfo && texturePath) {
            var texture = new BK.Texture(texturePath);
            return texture;
        } else {
            BK.Script.log(0, 0, 'getTexture Failed.Please check path');
            return null;
        }
    };
    SpriteSheetCache.prototype.getSprite = function (filename, width, height) {
        var textureInfo = this.getTextureFrameInfoByFileName(filename);
        if (textureInfo) {
            var frameInfo = textureInfo.frameInfo;
            var texturePath = textureInfo.texturePath;
            var texture = new BK.Texture(texturePath);
            if (!width) {
                width = frameInfo.frame.w;
            }
            if (!height) {
                height = frameInfo.frame.h;
            }
            BK.Script.log(0, 0, 'getSprite  texture:' + texture + ' width:' + width + ' height:' + height);
            if (frameInfo.trimmed) {
                var sprite = new BK.SheetSprite(textureInfo, width, height);
                return sprite;
            } else {
                var sprite = new BK.Sprite(width, height, texture, 0, 1, 1, 1);
                sprite.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
                return sprite;
            }
        } else {
            return null;
        }
    };
    SpriteSheetCache.prototype.createSheetSprite = function (filename, width, height) {
        var textureInfo = this.getTextureFrameInfoByFileName(filename);
        if (textureInfo) {
            var frameInfo = textureInfo.frameInfo;
            var texturePath = textureInfo.texturePath;
            var texture = new BK.Texture(texturePath);
            if (!width) {
                width = frameInfo.frame.w;
            }
            if (!height) {
                height = frameInfo.frame.h;
            }
            BK.Script.log(0, 0, 'SheetSprite  texture:' + texture + ' width:' + width + ' height:' + height);
            var sprite = new BK.SheetSprite(textureInfo, width, height);
            return sprite;
        } else {
            return null;
        }
    };
    SpriteSheetCache.prototype.getTextureFrameInfoByFileName = function (filename) {
        var frameInfo = this.getFrameInfoByFilename(filename);
        var texturePath = this.getTexturePathByFilename(filename);
        if (frameInfo && texturePath) {
            var textureFrameInfo = {
                'frameInfo': frameInfo,
                'texturePath': texturePath
            };
            return textureFrameInfo;
        } else {
            return null;
        }
    };
    return SpriteSheetCache;
}();
var Sprite9 = function () {
    function Sprite9(texWidth, texHeight, texture, grid, offset, rotated) {
        if (offset === void 0) {
            offset = {
                x: 0,
                y: 0
            };
        }
        this._size = {
            width: 0,
            height: 0
        };
        this.__nativeObj = new BK.Node();
        this.onInit();
        this._grid = grid;
        this._size = {
            width: texHeight,
            height: texHeight
        };
        this._leftTop = new BK.Sprite(grid.left, grid.top, texture, 0, 1, 1, 1);
        this._leftTop.position = {
            x: 0,
            y: texHeight - grid.top
        };
        this._leftTop.zOrder = 99999;
        this._leftTop.name = '_leftTop';
        this.__nativeObj.addChild(this._leftTop);
        this._centerTop = new BK.Sprite(texWidth - grid.left - grid.right, grid.top, texture, 0, 1, 1, 1);
        this._centerTop.position = {
            x: grid.left,
            y: texHeight - grid.top
        };
        this._centerTop.zOrder = 99999;
        this._centerTop.name = '_centerTop';
        this.__nativeObj.addChild(this._centerTop);
        this._rightTop = new BK.Sprite(grid.right, grid.top, texture, 0, 1, 1, 1);
        this._rightTop.position = {
            x: texWidth - grid.right,
            y: texHeight - grid.top
        };
        this._rightTop.zOrder = 99999;
        this._rightTop.name = '_rightTop';
        this.__nativeObj.addChild(this._rightTop);
        this._leftCenter = new BK.Sprite(grid.left, texHeight - grid.top - grid.bottom, texture, 0, 1, 1, 1);
        this._leftCenter.position = {
            x: 0,
            y: grid.bottom
        };
        this._leftCenter.name = '_leftCenter';
        this.__nativeObj.addChild(this._leftCenter);
        this._centerCenter = new BK.Sprite(texWidth - grid.left - grid.right, texHeight - grid.top - grid.bottom, texture, 0, 1, 1, 1);
        this._centerCenter.position = {
            x: grid.left,
            y: grid.bottom
        };
        this._centerCenter.name = '_centerCenter';
        this.__nativeObj.addChild(this._centerCenter);
        this._rightCenter = new BK.Sprite(grid.right, texHeight - grid.bottom - grid.top, texture, 0, 1, 1, 1);
        this._rightCenter.position = {
            x: texWidth - grid.right,
            y: grid.bottom
        };
        this._rightCenter.name = '_rightCenter';
        this.__nativeObj.addChild(this._rightCenter);
        this._leftBottom = new BK.Sprite(grid.left, grid.bottom, texture, 0, 1, 1, 1);
        this._leftBottom.position = {
            x: 0,
            y: 0
        };
        this._leftBottom.name = '_leftBottom';
        this.__nativeObj.addChild(this._leftBottom);
        this._centerBottom = new BK.Sprite(texWidth - grid.left - grid.right, grid.bottom, texture, 0, 1, 1, 1);
        this._centerBottom.position = {
            x: grid.left,
            y: 0
        };
        this._centerBottom.name = '_centerBottom';
        this.__nativeObj.addChild(this._centerBottom);
        this._rightBottom = new BK.Sprite(grid.right, grid.bottom, texture, 0, 1, 1, 1);
        this._rightBottom.position = {
            x: texWidth - grid.right,
            y: 0
        };
        this._rightBottom.name = '_rightBottom';
        this.__nativeObj.addChild(this._rightBottom);
        if (rotated == true) {
            this._leftTop.adjustTexturePosition(offset.x + (texHeight - grid.top), offset.y + (texWidth - grid.left), grid.left, grid.top, rotated);
            this._centerTop.adjustTexturePosition(offset.x + (texHeight - grid.top), offset.y + grid.right, texWidth - grid.left - grid.right, grid.top, rotated);
            this._rightTop.adjustTexturePosition(offset.x + (texHeight - grid.top), offset.y, grid.right, grid.top, rotated);
            this._leftCenter.adjustTexturePosition(offset.x + grid.bottom, offset.y + (texWidth - grid.left), grid.left, texHeight - grid.top - grid.bottom, rotated);
            this._centerCenter.adjustTexturePosition(offset.x + grid.bottom, offset.y + grid.right, texWidth - grid.left - grid.right, texHeight - grid.top - grid.bottom, rotated);
            this._rightCenter.adjustTexturePosition(offset.x + grid.bottom, offset.y, grid.right, texHeight - grid.bottom - grid.top, rotated);
            this._leftBottom.adjustTexturePosition(offset.x, offset.y + (texWidth - grid.left), grid.left, grid.bottom, rotated);
            this._centerBottom.adjustTexturePosition(offset.x, offset.y + grid.right, texWidth - grid.left - grid.right, grid.bottom, rotated);
            this._rightBottom.adjustTexturePosition(offset.x, offset.y, grid.right, grid.bottom, rotated);
        } else {
            this._leftTop.adjustTexturePosition(0 + offset.x, texHeight - grid.top + offset.y, grid.left, grid.top);
            this._centerTop.adjustTexturePosition(grid.left + offset.x, texHeight - grid.top + offset.y, texWidth - grid.left - grid.right, grid.top);
            this._rightTop.adjustTexturePosition(texWidth - grid.right + offset.x, texHeight - grid.top + offset.y, grid.right, grid.top);
            this._leftCenter.adjustTexturePosition(0 + offset.x, grid.bottom + offset.y, grid.left, texHeight - grid.top - grid.bottom);
            this._centerCenter.adjustTexturePosition(grid.left + offset.x, grid.bottom + offset.y, texWidth - grid.left - grid.right, texHeight - grid.top - grid.bottom);
            this._rightCenter.adjustTexturePosition(texWidth - grid.right + offset.x, grid.bottom + offset.y, grid.right, texHeight - grid.bottom - grid.top);
            this._leftBottom.adjustTexturePosition(0 + offset.x, 0 + offset.y, grid.left, grid.bottom);
            this._centerBottom.adjustTexturePosition(grid.left + offset.x, 0 + offset.y, texWidth - grid.left - grid.right, grid.bottom);
            this._rightBottom.adjustTexturePosition(texWidth - grid.right + offset.x, 0 + offset.y, grid.right, grid.bottom);
        }
    }
    Sprite9.prototype.onInit = function () {
        var names = Object.getOwnPropertyNames(this.__nativeObj);
        names.forEach(function (element) {
            var key = element;
            if (key != 'size') {
                Object.defineProperty(this, key, {
                    get: function () {
                        return this.__nativeObj[key];
                    },
                    set: function (obj) {
                        this.__nativeObj[key] = obj;
                    }
                });
            }
        }, this);
    };
    Object.defineProperty(Sprite9.prototype, 'alpha', {
        get: function () {
            return this._rightBottom.vertexColor.a;
        },
        set: function (num) {
            this._leftTop.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._centerTop.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._rightTop.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._leftCenter.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._centerCenter.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._rightCenter.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._leftBottom.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._centerBottom.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
            this._rightBottom.vertexColor = {
                r: 1,
                g: 1,
                b: 1,
                a: num
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite9.prototype, 'size', {
        get: function () {
            return this._size;
        },
        set: function (contentSize) {
            this._size = contentSize;
            var tgtCenterWidth = contentSize.width - this._grid.left - this._grid.right;
            var tgtCenterHeight = contentSize.height - this._grid.top - this._grid.bottom;
            this._leftTop.position = {
                x: 0,
                y: contentSize.height - this._grid.top
            };
            this._leftCenter.size = {
                width: this._grid.left,
                height: tgtCenterHeight
            };
            this._leftCenter.position = {
                x: 0,
                y: this._grid.bottom
            };
            this._rightCenter.size = {
                width: this._grid.right,
                height: tgtCenterHeight
            };
            this._rightCenter.position = {
                x: contentSize.width - this._grid.right,
                y: this._grid.bottom
            };
            this._centerCenter.size = {
                width: tgtCenterWidth,
                height: tgtCenterHeight
            };
            this._centerTop.size = {
                width: tgtCenterWidth,
                height: this._grid.top
            };
            this._centerTop.position = {
                x: this._grid.left,
                y: contentSize.height - this._grid.top
            };
            this._centerBottom.size = {
                width: tgtCenterWidth,
                height: this._grid.bottom
            };
            this._centerBottom.position = {
                x: this._grid.left,
                y: 0
            };
            this._rightCenter.size = {
                width: this._grid.right,
                height: tgtCenterHeight
            };
            this._rightCenter.position = {
                x: contentSize.width - this._grid.right,
                y: this._grid.bottom
            };
            this._rightBottom.position = {
                x: contentSize.width - this._grid.right,
                y: 0
            };
            this._rightTop.position = {
                x: contentSize.width - this._grid.right,
                y: contentSize.height - this._grid.top
            };
        },
        enumerable: true,
        configurable: true
    });
    Sprite9.prototype.pos = function (x, y) {
        this.__nativeObj.position = {
            x: x,
            y: y
        };
    };
    Sprite9.prototype.dispose = function () {
        this.__nativeObj.dispose();
    };
    Sprite9.prototype.attachBody = function (body) {
        this.__nativeObj.attachComponent(body);
    };
    Sprite9.prototype.addChild = function (sonNode) {
        this.__nativeObj.addChild(sonNode);
    };
    Sprite9.prototype.removeChildById = function (id, isDispose) {
        return this.__nativeObj.removeChildById(id, isDispose);
    };
    Sprite9.prototype.removeChildByName = function (name, isDispose) {
        return this.__nativeObj.removeChildByName(name, isDispose);
    };
    Sprite9.prototype.removeFromParent = function () {
        return this.__nativeObj.removeFromParent();
    };
    Sprite9.prototype.hittest = function (position) {
        return this.__nativeObj.hittest(position);
    };
    return Sprite9;
}();
if (!BK.SpriteSheetCache) {
    BK.SpriteSheetCache = new SpriteSheetCache();
}
if (!BK.Sprite9) {
    BK.Sprite9 = Sprite9;
}
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.AnimatedSprite = factory();
    }
}(BK, function () {
    var AnimatedSprite = function () {
        function AnimatedSprite(textureInfoArr) {
            this.paused = false;
            this.delayUnits = 1 / 30;
            this.tmpPlayingIdx = 0;
            this.previousTs = -1;
            this.playedCount = 0;
            this.size = {
                width: 0,
                height: 0
            };
            this.readyTextureInfo(textureInfoArr);
            this.onInit(this.size.width, this.size.height);
            this.displayFrame(0);
            this.paused = true;
            BK.Director.ticker.add(function (ts, duration, obj) {
                obj.update(ts, duration);
            }, this);
        }
        AnimatedSprite.prototype.onInit = function (width, height) {
            this.createSprites(width, height);
            var names = Object.getOwnPropertyNames(this.__nativeObj);
            names.forEach(function (element) {
                var key = element;
                Object.defineProperty(this, key, {
                    get: function () {
                        return this.__nativeObj[key];
                    },
                    set: function (obj) {
                        this.__nativeObj[key] = obj;
                    }
                });
            }, this);
            Object.defineProperty(this, 'size', {
                get: function () {
                    return this.__nativeObj.contentSize;
                },
                set: function (obj) {
                    this.__nativeObj.contentSize = obj;
                    this.displayFrame(this.currDisplayIdx);
                }
            });
            Object.defineProperty(this, 'anchor', {
                get: function () {
                    return this.__nativeObj.localAnchor;
                },
                set: function (obj) {
                    this.__nativeObj.localAnchor = obj;
                    this.displayFrame(this.currDisplayIdx);
                }
            });
        };
        AnimatedSprite.prototype.setTexture = function (tex) {
            this.__nativeObj.setTexture(tex);
        };
        AnimatedSprite.prototype.dispose = function () {
            BK.Director.ticker.remove(this);
            this.__nativeObj.dispose();
        };
        AnimatedSprite.prototype.removeChild = function (child) {
            return this.__nativeObj.removeChild(child);
        };
        AnimatedSprite.prototype.removeChildById = function (id, dispose) {
            return this.__nativeObj.removeChildById(id, dispose);
        };
        AnimatedSprite.prototype.removeChildByName = function (name, dispose) {
            return this.__nativeObj.removeChildByName(name, dispose);
        };
        AnimatedSprite.prototype.removeFromParent = function () {
            return this.__nativeObj.removeFromParent();
        };
        AnimatedSprite.prototype.addChild = function (child, index) {
            return this.__nativeObj.addChild(child, index);
        };
        AnimatedSprite.prototype.hittest = function (position) {
            return this.__nativeObj.hittest(position);
        };
        AnimatedSprite.prototype.convertToWorldSpace = function (position) {
            return this.__nativeObj.convertToWorldSpace(position);
        };
        AnimatedSprite.prototype.convertToNodeSpace = function (position) {
            return this.__nativeObj.convertToNodeSpace(position);
        };
        AnimatedSprite.prototype.createSprites = function (width, height) {
            this.__nativeObj = new BK.SpriteNode(width, height, {}, 0, 1, 1, 1);
            this.contentSprite = new BK.SpriteNode(width, height, {}, 0, 1, 1, 1);
            this.__nativeObj.addChild(this.contentSprite);
        };
        AnimatedSprite.prototype.readyTextureInfo = function (textureInfoArr) {
            var _this = this;
            this.textureInfoArr = [];
            textureInfoArr.forEach(function (texInfo) {
                if (texInfo.texturePath) {
                    texInfo.texture = new BK.Texture(texInfo.texturePath);
                    _this.textureInfoArr.push(texInfo);
                    _this.size = {
                        width: texInfo.frameInfo.sourceSize.w,
                        height: texInfo.frameInfo.sourceSize.h
                    };
                }
            });
        };
        AnimatedSprite.prototype.displayFrame = function (index) {
            if (this.textureInfoArr.length > 0) {
                var textureInfo = this.textureInfoArr[index];
                if (textureInfo) {
                    this.currDisplayIdx = index;
                    var tex = textureInfo.texture;
                    var frameInfo = textureInfo.frameInfo;
                    if (textureInfo.frameInfo.trimmed == true) {
                        var x = textureInfo.frameInfo.spriteSourceSize.x;
                        var y = textureInfo.frameInfo.spriteSourceSize.y;
                        var w = textureInfo.frameInfo.spriteSourceSize.w;
                        var h = textureInfo.frameInfo.spriteSourceSize.h;
                        var srcSize = textureInfo.frameInfo.sourceSize;
                        var currSize = this.__nativeObj.contentSize;
                        x = currSize.width * x / srcSize.w;
                        y = currSize.height * y / srcSize.h;
                        w = currSize.width * w / srcSize.w;
                        h = currSize.height * h / srcSize.h;
                        this.contentSprite.position = {
                            x: x,
                            y: y
                        };
                        this.contentSprite.contentSize = {
                            width: w,
                            height: h
                        };
                    } else {
                        this.contentSprite.contentSize = this.__nativeObj.contentSize;
                    }
                    if (!this.currTexturePath || this.currTexturePath != textureInfo.texturePath) {
                        BK.Script.log(1, -1, 'this.currTexture != tex');
                        this.currTexturePath = textureInfo.texturePath;
                        this.contentSprite.setTexture(tex);
                    }
                    this.contentSprite.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
                } else {
                    BK.Script.log(1, -1, 'displayFrame failed! textureInfo is null. index is ' + index);
                }
            } else {
                BK.Script.log(1, -1, 'displayFrame failed! textureInfoArr.length is 0');
            }
        };
        AnimatedSprite.prototype.render = function () {
            if (this.tmpPlayingIdx > this.textureInfoArr.length - 1) {
                this.tmpPlayingIdx = 0;
            }
            this.displayFrame(this.tmpPlayingIdx);
            this.tmpPlayingIdx++;
            this.currDisplaySum++;
            this.updateCallback();
        };
        AnimatedSprite.prototype.update = function (ts, duration) {
            if (this.paused == false) {
                if (this.previousTs < 0) {
                    this.previousTs = ts;
                    this.render();
                } else if (ts - this.previousTs > this.delayUnits * 1000) {
                    this.previousTs = ts;
                    this.render();
                }
            }
        };
        AnimatedSprite.prototype.play = function (beginFrameIdx, repeatCount) {
            if (beginFrameIdx === void 0) {
                beginFrameIdx = 0;
            }
            if (repeatCount === void 0) {
                repeatCount = -1;
            }
            if (beginFrameIdx > this.textureInfoArr.length - 1) {
                this.tmpPlayingIdx = 0;
            } else {
                this.tmpPlayingIdx = beginFrameIdx;
            }
            this.paused = false;
            this.repeatCount = repeatCount;
            this.currDisplaySum = 0;
            this.playedCount = 0;
        };
        AnimatedSprite.prototype.stop = function (frameIdx) {
            if (frameIdx === void 0) {
                frameIdx = -1;
            }
            this.paused = true;
            if (frameIdx > -1) {
                this.displayFrame(frameIdx);
            }
        };
        AnimatedSprite.prototype.updateCallback = function () {
            var texInfArrCnt = this.textureInfoArr.length;
            if (this.currDisplaySum % texInfArrCnt == 0) {
                this.playedCount = parseInt(String(this.currDisplaySum / texInfArrCnt));
                if (this.completeCallback) {
                    this.completeCallback(this, this.playedCount);
                }
                if (this.repeatCount > 0 && this.repeatCount <= this.playedCount) {
                    if (this.endCallback) {
                        this.endCallback(this, this.playedCount);
                    }
                    this.stop();
                }
            }
        };
        AnimatedSprite.prototype.setCompleteCallback = function (completeCallback) {
            this.completeCallback = completeCallback;
        };
        AnimatedSprite.prototype.setEndCallback = function (completeCallback) {
            this.endCallback = completeCallback;
        };
        return AnimatedSprite;
    }();
    return AnimatedSprite;
}));
function Canvas() {
    var argumentLength = arguments.length;
    this._shadowColor = {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    };
    this._shadowOffset = {
        x: 0,
        y: 0
    };
    this._shadowRadius = 0;
    this._textBaseLine = 0;
    this._textAlign = 0;
    this._useH5Mode = 0;
    if (argumentLength == 2) {
        this.__nativeObj = new BK.CanvasNode(arguments[0], arguments[1]);
    } else {
        return undefined;
    }
    this.setFlipXY(0, 1);
    var names = Object.getOwnPropertyNames(this.__nativeObj);
    names.forEach(function (element) {
        var key = element;
        if (key != 'scale' && key != 'contentSize' && key != 'size' && key != 'fontPath') {
            Object.defineProperty(this, key, {
                get: function () {
                    return this.__nativeObj[key];
                },
                set: function (obj) {
                    this.__nativeObj[key] = obj;
                }
            });
        }
    }, this);
    Object.defineProperty(Canvas.prototype, 'fontPath', {
        get: function () {
            return this.__nativeObj['fontPath'];
        },
        set: function (obj) {
            if (BK.FileUtil.isFileExist(obj)) {
                this.__nativeObj['fontPath'] = obj;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'contentSize', {
        get: function () {
            return this.__nativeObj['contentSize'];
        },
        set: function (obj) {
            this.__nativeObj['contentSize'] = obj;
            this.__nativeObj.resetCanvas();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'size', {
        get: function () {
            return this.__nativeObj['size'];
        },
        set: function (obj) {
            this.__nativeObj['size'] = obj;
            this.__nativeObj.resetCanvas();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'textBaseline', {
        get: function () {
            return this._textBaseLine;
        },
        set: function (value) {
            switch (value) {
            case 0:
            case 1:
            case 2:
                this._textBaseLine = value;
                break;
            case 'bottom':
            case 'Bottom':
                this._textBaseLine = 0;
                break;
            case 'Middle':
            case 'middle':
                this._textBaseLine = 1;
                break;
            case 'Top':
            case 'top':
                this._textBaseLine = 2;
                break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'textAlign', {
        get: function () {
            return this._textAlign;
        },
        set: function (value) {
            switch (value) {
            case 0:
            case 1:
            case 2:
                this._textAlign = value;
                break;
            case 'left':
                this._textAlign = 0;
                break;
            case 'center':
                this._textAlign = 1;
                break;
            case 'right':
                this._textAlign = 2;
                break;
            }
            this.__nativeObj.setTextAlign(this._textAlign);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'lineWidth', {
        get: function () {
            return this.__nativeObj.lineWidth;
        },
        set: function (value) {
            this.__nativeObj.lineWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'globalAlpha', {
        get: function () {
            return this.__nativeObj.globalAlpha;
        },
        set: function (value) {
            value = Math.min(1, value);
            value = Math.max(0, value);
            this.__nativeObj.globalAlpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'fillColor', {
        get: function () {
            return this.__nativeObj.fillColor;
        },
        set: function (value) {
            this.__nativeObj.fillColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'strokeColor', {
        get: function () {
            return this.__nativeObj.strokeColor;
        },
        set: function (value) {
            this.__nativeObj.strokeColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'lineCap', {
        get: function () {
            return this.__nativeObj.lineCap;
        },
        set: function (value) {
            this.__nativeObj.lineCap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'lineJoin', {
        get: function () {
            return this.__nativeObj.lineJoin;
        },
        set: function (value) {
            this.__nativeObj.lineJoin = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, 'miterLimit', {
        get: function () {
            return this.__nativeObj.miterLimit;
        },
        set: function (value) {
            this.__nativeObj.miterLimit = value;
        },
        enumerable: true,
        configurable: true
    });
}
Canvas.prototype.setImagePath = function (path) {
    if (path) {
        this.imagePath = path;
        var texture = new BK.Texture(path);
        this.__nativeObj.setTexture(texture);
    }
};
Canvas.prototype.getImagePath = function () {
    return this.imagePath;
};
Canvas.prototype.setTexture = function (texture) {
    this.__nativeObj.setTexture(texture);
};
Canvas.prototype.setFlipXY = function (flipx, flipy) {
    this.__nativeObj.setUVFlip(flipx, flipy);
};
Canvas.prototype.setUVFlip = function (flipu, flipv) {
    this.__nativeObj.setUVFlip(flipu, flipv);
};
Canvas.prototype.setUVWrap = function (wrapu, wrapv) {
    this.__nativeObj.setUVWrap(wrapu, wrapv);
};
Canvas.prototype.setXYStretch = function (stretchX, stretchY) {
    this.__nativeObj.setXYStretch(stretchX, stretchY);
};
Canvas.prototype.adjustTexturePosition = function (x, y, width, height, rotated) {
    this.__nativeObj.adjustTexturePosition(x, y, width, height, rotated);
};
Canvas.prototype.addChild = function (child) {
    return this.__nativeObj.addChild(child);
};
Canvas.prototype.dispose = function () {
    return this.__nativeObj.dispose();
};
Canvas.prototype.removeChild = function (child) {
    return this.__nativeObj.removeChild(child);
};
Canvas.prototype.removeChildById = function (id) {
    return this.__nativeObj.removeChildById(id);
};
Canvas.prototype.removeChildByName = function (name) {
    return this.__nativeObj.removeChildByName(name);
};
Canvas.prototype.removeChildByTag = function (tag) {
    return this.__nativeObj.removeChildByTag(tag);
};
Canvas.prototype.queryChildAtIndex = function (index) {
    return this.__nativeObj.queryChildAtIndex(index);
};
Canvas.prototype.queryChildById = function (Id) {
    return this.__nativeObj.queryChildById(Id);
};
Canvas.prototype.queryChildByName = function (name) {
    return this.__nativeObj.queryChildByName(name);
};
Canvas.prototype.queryChildByTag = function (tag) {
    return this.__nativeObj.queryChildByTag(tag);
};
Canvas.prototype.getChildCount = function () {
    return this.__nativeObj.getChildCount();
};
Canvas.prototype.removeFromParent = function () {
    return this.__nativeObj.removeFromParent();
};
Canvas.prototype.attachComponent = function (component) {
    return this.__nativeObj.attachComponent(component);
};
Canvas.prototype.detachComponent = function (component) {
    return this.__nativeObj.detachComponent(component);
};
Canvas.prototype.queryComponent = function (type) {
    return this.__nativeObj.queryComponent(type);
};
Canvas.prototype.queryComponentList = function (type) {
    return this.__nativeObj.queryComponentList(type);
};
Canvas.prototype.hittest = function (pos) {
    return this.__nativeObj.hittest(pos);
};
Canvas.prototype.isEqual = function (node) {
    return this.__nativeObj.isEqual(node);
};
Canvas.prototype.convertToWorldSpace = function (pos) {
    return this.__nativeObj.convertToWorldSpace(pos);
};
Canvas.prototype.convertToNodeSpace = function (pos) {
    return this.__nativeObj.convertToNodeSpace(pos);
};
Canvas.prototype.setAtlas = function (jsonUrl, name) {
    if (this.__nativeObj) {
        BK.CanvasSheetCache.loadSheet(jsonUrl);
        var texturePath = BK.CanvasSheetCache.getTexturePathByFilename(name);
        var texture = new BK.Texture(texturePath);
        this.__nativeObj.setTexture(texture);
        var frameInfo = BK.CanvasSheetCache.getFrameInfoByFilename(name);
        this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
    }
    return 0;
};
Canvas.prototype.useH5Mode = function () {
    if (this.__nativeObj) {
        this._useH5Mode = 1;
        var argumentLength = arguments.length;
        if (argumentLength == 1) {
            this._useH5Mode = arguments[0];
            return this.__nativeObj.useH5Mode(arguments[0]);
        } else {
            return this.__nativeObj.useH5Mode();
        }
    }
    return 0;
};
Canvas.prototype.drawCircle = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.drawCircle(arguments[0], arguments[1], arguments[2]);
    }
    return 0;
};
Canvas.prototype.drawEllipse = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.drawEllipse(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.drawImage = function () {
    if (this.__nativeObj) {
        var argumentLength = arguments.length;
        if (argumentLength == 9) {
            this.__nativeObj.drawImage(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
        } else if (argumentLength == 5) {
            this.__nativeObj.drawImage(arguments[0], 0, 0, 0, 0, arguments[1], arguments[2], arguments[3], arguments[4]);
        } else if (argumentLength == 3) {
            this.__nativeObj.drawImage(arguments[0], 0, 0, 0, 0, arguments[1], arguments[2], 0, 0);
        } else {
            return undefined;
        }
    }
    return 0;
};
Canvas.prototype.fill = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.fill();
    }
    return 0;
};
Canvas.prototype.stroke = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.stroke();
    }
    return 0;
};
Canvas.prototype.rect = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.rect(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.fillRect = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.fillRect(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.strokeRect = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.strokeRect(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.clearRect = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.clearRect(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.beginPath = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.beginPath();
    }
    return 0;
};
Canvas.prototype.closePath = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.closePath();
    }
    return 0;
};
Canvas.prototype.moveTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.moveTo(arguments[0], arguments[1]);
    }
    return 0;
};
Canvas.prototype.lineTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.lineTo(arguments[0], arguments[1]);
    }
    return 0;
};
Canvas.prototype.arcTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.arcTo(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    }
    return 0;
};
Canvas.prototype.arc = function () {
    if (this.__nativeObj) {
        var argumentLength = arguments.length;
        if (argumentLength == 5) {
            return this.__nativeObj.arc(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
        } else if (argumentLength == 6) {
            return this.__nativeObj.arc(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
    }
    return 0;
};
Canvas.prototype.quadraticCurveTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.quadraticCurveTo(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    return 0;
};
Canvas.prototype.bezierCurveTo = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.bezierCurveTo(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    }
    return 0;
};
Canvas.prototype.save = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.save();
    }
    return 0;
};
Canvas.prototype.restore = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.restore();
    }
    return 0;
};
Canvas.prototype.fillText = function () {
    var argumentLength = arguments.length;
    if (argumentLength == 3) {
        var maxWidth = 2048;
        var maxHeight = 1024;
        var measureSize = this.measureText(arguments[0], maxWidth, maxHeight);
        var x = arguments[1];
        var y = arguments[2];
        var baseLineType = this._useH5Mode == 1 ? 2 - this._textBaseLine : this._textBaseLine;
        switch (baseLineType) {
        case 1:
            y = y - measureSize.height * 0.5;
            break;
        case 2:
            y = y - measureSize.height * 1;
            break;
        case 0:
        default:
            break;
        }
        switch (this._textAlign) {
        case 1:
            x = x - measureSize.width * 0.5;
            break;
        case 2:
            x = x - measureSize.width * 1;
            break;
        case 0:
        default:
            break;
        }
        return this.__nativeObj.fillText(arguments[0], x, y, Math.min(maxWidth, measureSize.width), Math.min(maxHeight, measureSize.height));
    }
    return 0;
};
Canvas.prototype.clip = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.clip();
    }
    return 0;
};
Canvas.prototype.isPointInPath = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.isPointInPath(arguments[0], arguments[1]);
    }
};
Canvas.prototype.scale = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.scales(arguments[0], arguments[1]);
    }
};
Canvas.prototype.rotate = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.rotate(arguments[0]);
    }
};
Canvas.prototype.translate = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.translate(arguments[0], arguments[1]);
    }
};
Canvas.prototype.transforms = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.transforms(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    }
};
Canvas.prototype.shadowColor = function () {
    this._shadowColor = arguments[0];
    if (this.__nativeObj) {
        return this.__nativeObj.setTextShadow(this._shadowOffset.x, this._shadowOffset.y, this._shadowRadius, this._shadowColor);
    }
};
Canvas.prototype.shadowRadius = function () {
    this._shadowRadius = arguments[0];
    if (this.__nativeObj) {
        return this.__nativeObj.setTextShadow(this._shadowOffset.x, this._shadowOffset.y, this._shadowRadius, this._shadowColor);
    }
};
Canvas.prototype.shadowOffsetX = function () {
    this._shadowOffset.x = arguments[0];
    if (this.__nativeObj) {
        return this.__nativeObj.setTextShadow(this._shadowOffset.x, this._shadowOffset.y, this._shadowRadius, this._shadowColor);
    }
};
Canvas.prototype.shadowOffsetY = function () {
    this._shadowOffset.y = arguments[0];
    if (this.__nativeObj) {
        return this.__nativeObj.setTextShadow(this._shadowOffset.x, this._shadowOffset.y, this._shadowRadius, this._shadowColor);
    }
};
Canvas.prototype.clear = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.clear();
    }
};
Canvas.prototype.getTexture = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.getTexture();
    }
    return null;
};
Canvas.prototype.drawText = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.drawText(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    }
    return null;
};
Canvas.prototype.setTextSize = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.setTextSize(arguments[0]);
    }
    return null;
};
Canvas.prototype.setTextAlign = function () {
    if (this.__nativeObj) {
        switch (arguments[0]) {
        case 0:
        case 1:
        case 2:
            this._textAlign = arguments[0];
            break;
        case 'left':
            this._textAlign = 0;
            break;
        case 'center':
            this._textAlign = 1;
            break;
        case 'right':
            this._textAlign = 2;
            break;
        }
        return this.__nativeObj.setTextAlign(this._textAlign);
    }
    return null;
};
Canvas.prototype.setTextBold = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.setTextBold(arguments[0]);
    }
    return null;
};
Canvas.prototype.setTextItalic = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.setTextItalic(arguments[0]);
    }
    return null;
};
Canvas.prototype.measureText = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.measureText(arguments[0], arguments[1], arguments[2]);
    }
    return null;
};
Canvas.prototype.updateCanvasTexture = function () {
    if (this.__nativeObj) {
        return this.__nativeObj.updateCanvasTexture();
    }
    return null;
};
Canvas.prototype.saveTo = function () {
    var argumentLength = arguments.length;
    if (this.__nativeObj && argumentLength == 1) {
        this.__nativeObj.saveTo(arguments[0]);
    }
    return null;
};
BK.Canvas = Canvas;
BK.Script.log(0, 0, 'Load Canvas.js succeed.');
BK.Sprite.__proto__.setImagePath = function (path) {
    if (path) {
        this.imagePath = path;
        var texture = new BK.Texture(path);
        this.setTexture(texture);
    }
};
BK.Sprite.__proto__.getImagePath = function () {
    return this.imagePath;
};
BK.Sprite.__proto__.setAtlas = function (jsonUrl, name) {
    BK.SpriteSheetCache.loadSheet(jsonUrl);
    var texturePath = BK.SpriteSheetCache.getTexturePathByFilename(name);
    var texture = new BK.Texture(texturePath);
    this.setTexture(texture);
    var frameInfo = BK.SpriteSheetCache.getFrameInfoByFilename(name);
    this.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
    return 0;
};
BK.Script.log(0, 0, 'Load Sprite.js succeed.');
var gl;
BK.ScreenShot = function () {
    this.origin = {
        x: 0,
        y: 0
    };
    this.size = {
        width: 0,
        height: 0
    };
    if (GameStatusInfo) {
        if (!BK.Misc.compQQVersion) {
            BK.Misc.compQQVersion = function (a, b) {
                var aa = a.split('.');
                var bb = b.split('.');
                var nn = Math.min(3, Math.min(aa.length, bb.length));
                for (var i = 0; i < nn; i++) {
                    if (aa[i] == bb[i])
                        continue;
                    if (aa[i] < bb[i])
                        return true;
                    return false;
                }
                return true;
            };
        }
        var isSupportTA;
        function __bkIsSupportTypedArray() {
            if (isSupportTA == undefined) {
                if (GameStatusInfo.platform == 'android') {
                    isSupportTA = true;
                }
                var info = BK.Director.queryDeviceInfo();
                var vers = info.version.split('.');
                if (info.platform == 'ios' && Number(vers[0]) >= 10 || info.platform == 'android') {
                    isSupportTA = true;
                } else {
                    BK.Script.log(1, 0, 'Current Device dont supoort TypedArray.[info = ' + JSON.stringify(info) + ']');
                    isSupportTA = false;
                }
            }
            return isSupportTA;
        }
        function __TypedArrayGetData(array) {
            if (Object.prototype.hasOwnProperty.call(array, '__rawBKData')) {
                return array.__rawBKData;
            } else if (Object.prototype.hasOwnProperty.call(array, '__nativeObj')) {
                return array.__nativeObj;
            }
            if (false == __bkIsSupportTypedArray()) {
                if (array instanceof Uint16Array == true) {
                    var buf = new BK.Buffer(array.byteLength, false);
                    for (var i = 0; i < array.length; i++) {
                        buf.writeUint16Buffer(array[i]);
                    }
                    return buf;
                } else if (array instanceof Float32Array == true) {
                    var buf = new BK.Buffer(array.byteLength, false);
                    for (var i = 0; i < array.length; i++) {
                        buf.writeFloatBuffer(array[i]);
                    }
                    return buf;
                }
            }
            return array;
        }
        function attatchConst() {
            gl.DEPTH_BUFFER_BIT = 256;
            gl.STENCIL_BUFFER_BIT = 1024;
            gl.COLOR_BUFFER_BIT = 16384;
            gl.TRIANGLES = 4;
            gl.TEXTURE_BINDING_2D = 32873;
            gl.ARRAY_BUFFER = 34962;
            gl.ARRAY_BUFFER_BINDING = 34964;
            gl.ELEMENT_ARRAY_BUFFER = 34963;
            gl.ELEMENT_ARRAY_BUFFER_BINDING = 34965;
            gl.STATIC_DRAW = 35044;
            gl.UNSIGNED_BYTE = 5121;
            gl.UNSIGNED_SHORT = 5123;
            gl.FLOAT = 5126;
            gl.RGBA = 6408;
            gl.FRAGMENT_SHADER = 35632;
            gl.VERTEX_SHADER = 35633;
            gl.LINK_STATUS = 35714;
            gl.CURRENT_PROGRAM = 35725;
            gl.NEAREST = 9728;
            gl.LINEAR = 9729;
            gl.TEXTURE_MAG_FILTER = 10240;
            gl.TEXTURE_MIN_FILTER = 10241;
            gl.TEXTURE_WRAP_S = 10242;
            gl.TEXTURE_WRAP_T = 10243;
            gl.TEXTURE_2D = 3553;
            gl.TEXTURE0 = 33984;
            gl.TEXTURE1 = 33985;
            gl.ACTIVE_TEXTURE = 34016;
            gl.REPEAT = 10497;
            gl.CLAMP_TO_EDGE = 33071;
            gl.MIRRORED_REPEAT = 33648;
            gl.FRAMEBUFFER = 36160;
            gl.RENDERBUFFER = 36161;
            gl.COLOR_ATTACHMENT0 = 36064;
            gl.DEPTH_ATTACHMENT = 36096;
            gl.STENCIL_ATTACHMENT = 36128;
            gl.NONE = 0;
            gl.FRAMEBUFFER_COMPLETE = 36053;
            gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054;
            gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055;
            gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057;
            gl.FRAMEBUFFER_UNSUPPORTED = 36061;
            gl.FRAMEBUFFER_BINDING = 36006;
            gl.RENDERBUFFER_BINDING = 36007;
            gl.INVALID_FRAMEBUFFER_OPERATION = 1286;
        }
        if (!gl) {
            gl = new BK.WebGL();
            attatchConst();
        }
        if (BK.Misc.compQQVersion(GameStatusInfo.QQVer, '7.6.1')) {
            function _initShaders() {
                var log;
                var vs = 'attribute vec2 pos; attribute vec2 inUVs; varying lowp vec2 outUVs; void main() { gl_Position = vec4(pos, 0, 1); outUVs = inUVs; }';
                var fs = 'varying lowp vec2 outUVs; uniform sampler2D uSampler; void main() { gl_FragColor = texture2D(uSampler, outUVs); }';
                var vsShader = gl.glCreateShader(gl.VERTEX_SHADER);
                if (vsShader != 0) {
                    gl.glShaderSource(vsShader, vs);
                    gl.glCompileShader(vsShader);
                }
                var fsShader = gl.glCreateShader(gl.FRAGMENT_SHADER);
                if (fsShader != 0) {
                    gl.glShaderSource(fsShader, fs);
                    gl.glCompileShader(fsShader);
                }
                var program = gl.glCreateProgram();
                gl.glAttachShader(program, vsShader);
                gl.glAttachShader(program, fsShader);
                gl.glLinkProgram(program);
                gl.glDeleteShader(vsShader);
                gl.glDeleteShader(fsShader);
                return program;
            }
            function _createFramebuffer(width, height) {
                gl.glActiveTexture(gl.TEXTURE1);
                var tex = gl.glCreateTexture();
                var oldTexture = gl.glGetParameterInt(gl.TEXTURE_BINDING_2D, 1);
                gl.glBindTexture(gl.TEXTURE_2D, tex);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.glTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                var fbo = gl.glCreateFramebuffer();
                gl.glBindFramebuffer(gl.FRAMEBUFFER, fbo);
                gl.glFramebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
                var status = gl.glCheckFramebufferStatus(gl.FRAMEBUFFER);
                if (status != gl.FRAMEBUFFER_COMPLETE) {
                    BK.Script.log(1, -1, '_createFramebuffer!failed, status = ' + status);
                }
                gl.glActiveTexture(gl.TEXTURE1);
                gl.glBindTexture(gl.TEXTURE_2D, oldTexture);
                return {
                    'tex': tex,
                    'fbo': fbo
                };
            }
            function _compacibilityRotate180(image) {
                var program = _initShaders();
                gl.glUseProgram(program);
                var uPos = gl.glGetAttribLocation(program, 'pos');
                var uUVs = gl.glGetAttribLocation(program, 'inUVs');
                var sampler = gl.glGetUniformLocation(program, 'uSampler');
                gl.glActiveTexture(gl.TEXTURE0);
                var newTexture = gl.glCreateTexture();
                var oldTexture = gl.glGetParameterInt(gl.TEXTURE_BINDING_2D, 1);
                gl.glBindTexture(gl.TEXTURE_2D, newTexture);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.glTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.glUniform1i(sampler, 0);
                var oldVBO = gl.glGetParameterInt(gl.ARRAY_BUFFER_BINDING, 1);
                var oldIBO = gl.glGetParameterInt(gl.ELEMENT_ARRAY_BUFFER_BINDING, 1);
                var vertexs = new Float32Array([
                    -1,
                    -1,
                    0,
                    1,
                    1,
                    -1,
                    1,
                    1,
                    1,
                    1,
                    1,
                    0,
                    -1,
                    1,
                    0,
                    0
                ]);
                var vbo = gl.glCreateBuffer();
                gl.glBindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.glEnableVertexAttribArray(uPos);
                gl.glVertexAttribPointer(uPos, 2, gl.FLOAT, false, 16, 0);
                gl.glVertexAttribPointer(uUVs, 2, gl.FLOAT, false, 16, 8);
                gl.glBufferData(gl.ARRAY_BUFFER, __TypedArrayGetData(vertexs), gl.STATIC_DRAW);
                var indices = new Uint16Array([
                    0,
                    1,
                    2,
                    0,
                    2,
                    3
                ]);
                var ibo = gl.glCreateBuffer();
                gl.glBindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
                gl.glBufferData(gl.ELEMENT_ARRAY_BUFFER, __TypedArrayGetData(indices), gl.STATIC_DRAW);
                var result = new BK.Buffer(image.width * image.height * 4);
                var oldFBO = gl.glGetParameterInt(gl.FRAMEBUFFER_BINDING, 1);
                var fboData = _createFramebuffer(image.width, image.height);
                gl.glClearColor(1, 1, 1, 1);
                gl.glClear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
                gl.glDrawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
                gl.glReadPixels(0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, result);
                gl.glBindFramebuffer(gl.FRAMEBUFFER, oldFBO);
                var find = 0;
                for (var i = 1; i <= 10; i++) {
                    gl.glUseProgram(i);
                    var oldAttrLoc0 = gl.glGetAttribLocation(i, 'Position');
                    var oldAttrLoc1 = gl.glGetAttribLocation(i, 'SourceColor');
                    var oldAttrLoc2 = gl.glGetAttribLocation(i, 'TexCoordIn');
                    if (oldAttrLoc0 != -1 && oldAttrLoc1 != -1 && oldAttrLoc2 != -1) {
                        find = 1;
                        break;
                    }
                }
                gl.glBindBuffer(gl.ARRAY_BUFFER, oldVBO);
                if (find == 1) {
                    gl.glEnableVertexAttribArray(oldAttrLoc0);
                    gl.glEnableVertexAttribArray(oldAttrLoc1);
                    gl.glEnableVertexAttribArray(oldAttrLoc2);
                    gl.glVertexAttribPointer(oldAttrLoc0, 3, gl.FLOAT, false, 36, 0);
                    gl.glVertexAttribPointer(oldAttrLoc1, 4, gl.FLOAT, false, 36, 12);
                    gl.glVertexAttribPointer(oldAttrLoc2, 2, gl.FLOAT, false, 36, 28);
                } else {
                    gl.glEnableVertexAttribArray(0);
                    gl.glEnableVertexAttribArray(1);
                    gl.glEnableVertexAttribArray(2);
                    gl.glVertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0);
                    gl.glVertexAttribPointer(1, 4, gl.FLOAT, false, 36, 12);
                    gl.glVertexAttribPointer(2, 2, gl.FLOAT, false, 36, 28);
                }
                gl.glBindBuffer(gl.ELEMENT_ARRAY_BUFFER, oldIBO);
                gl.glActiveTexture(gl.TEXTURE0);
                gl.glBindTexture(gl.TEXTURE_2D, oldTexture);
                gl.glDeleteProgram(program);
                gl.glDeleteTexture(newTexture);
                gl.glDeleteTexture(fboData.tex);
                gl.glDeleteFramebuffer(fboData.fbo);
                return result;
            }
            this.doImage_rotate180 = _compacibilityRotate180;
        }
        if (BK.Misc.compQQVersion(GameStatusInfo.QQVer, '7.6.1')) {
            this.bufferFromScreenShot_760 = function (node, x, y, width, height) {
                var tex = gl.glCreateTexture();
                gl.glActiveTexture(gl.TEXTURE1);
                gl.glBindTexture(gl.TEXTURE_2D, tex);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.glTexParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.glTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                var oldFBO = gl.glGetParameterInt(gl.FRAMEBUFFER_BINDING, 1);
                var oldRBO = gl.glGetParameterInt(gl.RENDERBUFFER_BINDING, 1);
                var rbo = gl.glCreateRenderbuffer();
                gl.glBindRenderbuffer(gl.RENDERBUFFER, rbo);
                gl.glRenderbufferStorage(gl.RENDERBUFFER, 35056, BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
                gl.glBindRenderbuffer(gl.RENDERBUFFER, oldRBO);
                var fbo = gl.glCreateFramebuffer();
                gl.glBindFramebuffer(gl.FRAMEBUFFER, fbo);
                gl.glFramebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
                gl.glFramebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rbo);
                gl.glFramebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo);
                var buffer;
                var status = gl.glCheckFramebufferStatus(gl.FRAMEBUFFER);
                if (status == gl.FRAMEBUFFER_COMPLETE) {
                    BK.Render.render(node, 0);
                    buffer = new BK.Buffer(width * height * 4);
                    gl.glReadPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
                } else {
                    BK.Script.log(1, -1, 'bufferFromScreenShot_760!framebuffer failed, code = ' + status);
                }
                gl.glBindFramebuffer(gl.FRAMEBUFFER, oldFBO);
                gl.glDeleteTexture(tex);
                gl.glDeleteRenderbuffer(rbo);
                gl.glDeleteFramebuffer(fbo);
                return buffer;
            };
        }
    }
    this.isInScreen = function () {
        if (this.origin.x == void 0 || this.origin.x < 0 || this.origin.x > BK.Director.screenPixelSize.width) {
            this.origin.x = 0;
        }
        if (this.origin.y == void 0 || this.origin.y < 0 || this.origin.y > BK.Director.screenPixelSize.height) {
            this.origin.y = 0;
        }
        if (this.size.width == void 0 || this.size.width <= 0 || this.size.width > BK.Director.screenPixelSize.width - this.origin.x) {
            this.origin.x = 0;
            this.size.width = BK.Director.screenPixelSize.width;
        }
        if (this.size.height == void 0 || this.size.height <= 0 || this.size.height > BK.Director.screenPixelSize.height - this.origin.y) {
            this.origin.y = 0;
            this.size.height = BK.Director.screenPixelSize.height;
        }
    };
    this.isInNode = function (node) {
        if (this.origin.x == void 0 || this.origin.x < 0 || this.origin.x > node.contentSize.width) {
            this.origin.x = 0;
        }
        if (this.origin.y == void 0 || this.origin.y < 0 || this.origin.y > node.contentSize.height) {
            this.origin.y = 0;
        }
        if (this.size.width == void 0 || this.size.width <= 0) {
            this.size.width = node.contentSize.width;
        }
        if (this.size.height == void 0 || this.size.height <= 0) {
            this.size.height = node.contentSize.height;
        }
    };
    this.saveImage = function (buff, path, type) {
        if (GameStatusInfo && BK.Misc.compQQVersion(GameStatusInfo.QQVer, '7.6.1')) {
            buff = this.doImage_rotate180({
                'buffer': buff,
                'width': this.size.width,
                'height': this.size.height
            });
            BK.Image.saveImage(buff, this.size.width, this.size.height, path, type);
        } else {
            BK.Image.saveImage(buff, this.size.width, this.size.height, path, type, 1);
        }
    };
    this.shotToFile = function (name, type) {
        this.isInScreen();
        var path = '';
        if (this.bufferFromScreenShot_760) {
            var buffer = this.bufferFromScreenShot_760(BK.Director.root, this.origin.x, this.origin.y, this.size.width, this.size.height);
            if (buffer != undefined) {
                path = 'GameSandBox://' + name;
                this.saveImage(buffer, path, type);
            }
        } else {
            path = 'GameSandBox://' + name + '.' + type;
            var shot = new BK.RenderTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
            BK.Render.renderToTexture(BK.Director.root, shot);
            shot.writeToDiskWithXY(path, this.origin.x, this.origin.y, this.size.width, this.size.height);
        }
        return path;
    };
    this.shotToBuff = function () {
        this.isInScreen();
        if (this.bufferFromScreenShot_760) {
            var buffer = this.bufferFromScreenShot_760(BK.Director.root, this.origin.x, this.origin.y, this.size.width, this.size.height);
            return buffer;
        } else {
            var shot = new BK.RenderTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
            BK.Render.renderToTexture(BK.Director.root, shot);
            var buff = shot.readPixels(this.origin.x, this.origin.y, this.size.width, this.size.height);
            return buff;
        }
    };
    this.shotToFileFromNode = function (node, name, type) {
        this.isInNode(node);
        var path = '';
        if (this.bufferFromScreenShot_760) {
            var buffer = this.bufferFromScreenShot_760(node, this.origin.x + node.position.x, this.origin.y + node.position.y, this.size.width, this.size.height);
            if (buffer != undefined) {
                path = 'GameSandBox://' + name;
                this.saveImage(buffer, path, type);
            }
        } else {
            path = 'GameSandBox://' + name + '.' + type;
            var shot = new BK.RenderTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
            BK.Render.renderToTexture(node, shot);
            shot.writeToDiskWithXY(path, this.origin.x + node.position.x, this.origin.y + node.position.y, this.size.width, this.size.height);
        }
        return path;
    };
    this.shotToBuffFromNode = function (node) {
        this.isInNode(node);
        if (this.bufferFromScreenShot_760) {
            var buffer = this.bufferFromScreenShot_760(node, this.origin.x + node.position.x, this.origin.y + node.position.y, this.size.width, this.size.height);
            return buffer;
        } else {
            var shot = new BK.RenderTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
            BK.Render.renderToTexture(node, shot);
            var buff = shot.readPixels(this.origin.x + node.position.x, this.origin.y + node.position.y, this.size.width, this.size.height);
            return buff;
        }
    };
    this.shotToFileFromGL = function (gl, name, type, callback) {
        BK.Notification.on('frame_final', this, function () {
            this.isInScreen();
            var path = 'GameSandBox://' + name;
            var buff = new BK.Buffer(this.size.height * this.size.width * 4);
            gl.glReadPixels(this.origin.x, this.origin.y, this.size.width, this.size.height, gl.RGBA, gl.UNSIGNED_BYTE, buff);
            this.saveImage(buff, path, type);
            callback && callback(path + '.' + type);
        }.bind(this), true);
    };
    this.shotToBuffFromGL = function (gl, callback) {
        BK.Notification.on('frame_final', this, function () {
            this.isInScreen();
            var buff = new BK.Buffer(this.size.height * this.size.width * 4);
            gl.glReadPixels(this.origin.x, this.origin.y, this.size.width, this.size.height, gl.RGBA, gl.UNSIGNED_BYTE, buff);
            callback && callback(buff);
        }.bind(this), true);
    };
};
var gl;
function bkWebGLGetInstance() {
    if (!gl) {
        gl = new BK.WebGL();
        attatchConst();
        attachMethod();
        gl.OpenOptMode = OpenOptMode;
        gl.viewport(0, 0, BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
    }
    Object.prototype.hasOwnProperty.call(this, 'renderTicker') && renderTicker.setTickerCallBack(function (ts, duration) {
    });
    return gl;
}
var isSupportTA;
function __bkIsSupportTypedArray() {
    if (isSupportTA == undefined) {
        if (GameStatusInfo.platform == 'android') {
            isSupportTA = true;
        }
        var info = BK.Director.queryDeviceInfo();
        var vers = info.version.split('.');
        if (info.platform == 'ios' && Number(vers[0]) >= 10 || info.platform == 'android') {
            isSupportTA = true;
        } else {
            BK.Script.log(1, 0, 'Current Device dont supoort TypedArray.[info = ' + JSON.stringify(info) + ']');
            isSupportTA = false;
        }
    }
    return isSupportTA;
}
function __TypedArrayGetData(array) {
    if (Object.prototype.hasOwnProperty.call(array, '__rawBKData')) {
        return array.__rawBKData;
    } else if (Object.prototype.hasOwnProperty.call(array, '__nativeObj')) {
        return array.__nativeObj;
    }
    if (false == __bkIsSupportTypedArray()) {
        var isArrBuf = array instanceof ArrayBuffer;
        return BK.Misc.arrayBufferToBKBuffer(isArrBuf ? array : array.buffer, isArrBuf ? 0 : array.byteOffset, array.byteLength);
    }
    return array;
}
var firstFrameUpload = false;
function checkFirstFrames() {
    if (firstFrameUpload == false) {
        BK.MQQ.SsoRequest.send({}, 'cs.first_frame_drawn.local');
        firstFrameUpload = true;
    }
}
function activeTexture(texture) {
    if (glpause) {
        return;
    }
    gl.glActiveTexture(texture);
}
function attachShader(program, shader) {
    if (glpause) {
        return;
    }
    gl.glAttachShader(program, shader);
}
function bindAttribLocation(program, index, name) {
    if (glpause) {
        return;
    }
    gl.glBindAttribLocation(program, index, name);
}
function bindBuffer(target, buffer) {
    if (glpause) {
        return;
    }
    gl.glBindBuffer(target, buffer);
}
function bindFramebuffer(target, framebuffer) {
    if (glpause) {
        return;
    }
    gl.glBindFramebuffer(target, framebuffer);
}
function bindRenderbuffer(target, renderbuffer) {
    if (glpause) {
        return;
    }
    gl.glBindRenderbuffer(target, renderbuffer);
}
function bindTexture(target, texture) {
    if (glpause) {
        return;
    }
    gl.glBindTexture(target, texture);
}
function blendColor(red, green, blue, alpha) {
    if (glpause) {
        return;
    }
    gl.glBlendColor(red, green, blue, alpha);
}
function blendEquation(mode) {
    if (glpause) {
        return;
    }
    gl.glBlendEquation(mode);
}
function blendEquationSeparate(modeRGB, modeAlpha) {
    if (glpause) {
        return;
    }
    gl.glBlendEquationSeparate(modeRGB, modeAlpha);
}
function blendFunc(sfactor, dfactor) {
    if (glpause) {
        return;
    }
    gl.glBlendFunc(sfactor, dfactor);
}
function blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha) {
    if (glpause) {
        return;
    }
    gl.glBlendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
}
function bufferData(target, size, usage) {
    if (glpause) {
        return;
    }
    gl.glBufferData(target, size, usage);
}
function bufferData(target, data, usage) {
    if (glpause) {
        return;
    }
    gl.glBufferData(target, __TypedArrayGetData(data), usage);
}
function bufferSubData(target, offset, data) {
    if (glpause) {
        return;
    }
    gl.glBufferSubData(target, offset, __TypedArrayGetData(data));
}
function checkFramebufferStatus(target) {
    if (glpause) {
        return;
    }
    return gl.glCheckFramebufferStatus(target);
}
function clear(mask) {
    if (glpause) {
        return;
    }
    gl.glClear(mask);
}
function clearColor(red, green, blue, alpha) {
    if (glpause) {
        return;
    }
    gl.glClearColor(red, green, blue, alpha);
}
function clearDepth(depth) {
    if (glpause) {
        return;
    }
    gl.glClearDepth(depth);
}
function clearStencil(s) {
    if (glpause) {
        return;
    }
    gl.glClearStencil(s);
}
function colorMask(red, green, blue, alpha) {
    if (glpause) {
        return;
    }
    gl.glColorMask(red, green, blue, alpha);
}
function compileShader(shader) {
    if (glpause) {
        return;
    }
    gl.glCompileShader(shader);
}
function compressedTexImage2D(target, level, internalformat, width, height, border, data) {
    if (glpause) {
        return;
    }
    gl.glCompressedTexImage2D(target, level, internalformat, width, height, border, data);
}
function compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data) {
    if (glpause) {
        return;
    }
    gl.glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data);
}
function copyTexImage2D(target, level, internalformat, x, y, width, height, border) {
    if (glpause) {
        return;
    }
    gl.glCopyTexImage2D(target, level, internalformat, x, y, width, height, border);
}
function copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height) {
    if (glpause) {
        return;
    }
    gl.glCopyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height);
}
function createBuffer() {
    if (glpause) {
        return -1;
    }
    return gl.glCreateBuffer();
}
function createFramebuffer() {
    if (glpause) {
        return -1;
    }
    return gl.glCreateFramebuffer();
}
function createProgram() {
    if (glpause) {
        return -1;
    }
    return gl.glCreateProgram();
}
function createRenderbuffer() {
    if (glpause) {
        return -1;
    }
    return gl.glCreateRenderbuffer();
}
function createShader(type) {
    if (glpause) {
        return -1;
    }
    return gl.glCreateShader(type);
}
function createTexture() {
    if (glpause) {
        return -1;
    }
    return gl.glCreateTexture();
}
function cullFace(mode) {
    if (glpause) {
        return;
    }
    gl.glCullFace(mode);
}
function deleteBuffer(buffer) {
    if (glpause) {
        return;
    }
    gl.glDeleteBuffer(buffer);
}
function deleteFramebuffer(framebuffer) {
    if (glpause) {
        return;
    }
    gl.glDeleteFramebuffer(framebuffer);
}
function deleteProgram(program) {
    if (glpause) {
        return;
    }
    gl.glDeleteProgram(program);
}
function deleteRenderbuffer(renderbuffer) {
    if (glpause) {
        return;
    }
    gl.glDeleteRenderbuffer(renderbuffer);
}
function deleteShader(shader) {
    if (glpause) {
        return;
    }
    gl.glDeleteShader(shader);
}
function deleteTexture(texture) {
    if (glpause) {
        return;
    }
    gl.glDeleteTexture(texture);
}
function depthFunc(func) {
    if (glpause) {
        return;
    }
    gl.glDepthFunc(func);
}
function depthMask(flag) {
    if (glpause) {
        return;
    }
    gl.glDepthMask(flag);
}
function depthRange(zNear, zFar) {
    if (glpause) {
        return;
    }
    gl.glDepthRange(zNear, zFar);
}
function detachShader(program, shader) {
    if (glpause) {
        return;
    }
    gl.glDetachShader(program, shader);
}
function disable(cap) {
    if (glpause) {
        return;
    }
    gl.glDisable(cap);
}
function disableVertexAttribArray(index) {
    if (glpause) {
        return;
    }
    gl.glDisableVertexAttribArray(index);
}
function drawArrays(mode, first, count) {
    if (glpause) {
        return;
    }
    gl.glDrawArrays(mode, first, count);
    if (count > 0) {
        checkFirstFrames();
    }
}
function drawElements(mode, count, type, offset) {
    if (glpause) {
        return;
    }
    gl.glDrawElements(mode, count, type, offset);
    if (count > 0) {
        checkFirstFrames();
    }
}
function enable(cap) {
    if (glpause) {
        return;
    }
    gl.glEnable(cap);
}
function enableVertexAttribArray(index) {
    if (glpause) {
        return;
    }
    gl.glEnableVertexAttribArray(index);
}
function finish() {
    if (glpause) {
        return;
    }
    gl.glFinish();
}
function flush() {
    if (glpause) {
        return;
    }
    gl.glFlush();
}
function framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
    if (glpause) {
        return;
    }
    gl.glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer);
}
function framebufferTexture2D(target, attachment, textarget, texture, level) {
    if (glpause) {
        return;
    }
    gl.glFramebufferTexture2D(target, attachment, textarget, texture, level);
}
function frontFace(mode) {
    if (glpause) {
        return;
    }
    gl.glFrontFace(mode);
}
function generateMipmap(target) {
    if (glpause) {
        return;
    }
    gl.glGenerateMipmap(target);
}
function getAttribLocation(program, name) {
    if (glpause) {
        return -1;
    }
    return gl.glGetAttribLocation(program, name);
}
function getError() {
    if (glpause) {
        return null;
    }
    return gl.glGetError();
}
function getShaderPrecisionFormat(shadertype, precisiontype) {
    if (glpause) {
        return -1;
    }
    return gl.glGetShaderPrecisionFormat(shadertype, precisiontype);
}
function getProgramInfoLog(program) {
    if (glpause) {
        return null;
    }
    return gl.glGetProgramInfoLog(program);
}
function getShaderInfoLog(shader) {
    if (glpause) {
        return null;
    }
    return gl.glGetShaderInfoLog(shader);
}
function getShaderSource(shader) {
    if (glpause) {
        return null;
    }
    return gl.glGetShaderSource(shader);
}
function getUniformLocation(program, name) {
    if (glpause) {
        return -1;
    }
    return gl.glGetUniformLocation(program, name);
}
function getVertexAttribOffset(index, pname) {
    if (glpause) {
        return -1;
    }
    return gl.glGetVertexAttribOffset(index, pname);
}
function hint(target, mode) {
    if (glpause) {
        return;
    }
    gl.glHint(target, mode);
}
function isBuffer(buffer) {
    if (glpause) {
        return false;
    }
    return gl.glIsBuffer(buffer);
}
function isEnabled(cap) {
    if (glpause) {
        return false;
    }
    return gl.glIsEnabled(cap);
}
function isFramebuffer(framebuffer) {
    if (glpause) {
        return false;
    }
    return gl.glIsFramebuffer(framebuffer);
}
function isProgram(program) {
    if (glpause) {
        return false;
    }
    return gl.glIsProgram(program);
}
function isRenderbuffer(renderbuffer) {
    if (glpause) {
        return false;
    }
    return gl.glIsRenderbuffer(renderbuffer);
}
function isShader(shader) {
    if (glpause) {
        return false;
    }
    return gl.glIsShader(shader);
}
function isTexture(texture) {
    if (glpause) {
        return false;
    }
    return gl.glIsTexture(texture);
}
function lineWidth(width) {
    if (glpause) {
        return;
    }
    gl.glLineWidth(width);
}
function linkProgram(program) {
    if (glpause) {
        return;
    }
    gl.glLinkProgram(program);
}
function pixelStorei(pname, param) {
    if (glpause) {
        return;
    }
    gl.glPixelStorei(pname, param);
}
function polygonOffset(factor, units) {
    if (glpause) {
        return;
    }
    gl.glPolygonOffset(factor, units);
}
function readPixels(x, y, width, height, format, type, pixels) {
    if (glpause) {
        return;
    }
    gl.glReadPixels(x, y, width, height, format, type, pixels);
}
function renderbufferStorage(target, internalformat, width, height) {
    if (glpause) {
        return;
    }
    gl.glRenderbufferStorage(target, internalformat, width, height);
}
function sampleCoverage(value, invert) {
    if (glpause) {
        return;
    }
    gl.glSampleCoverage(value, invert);
}
function scissor(x, y, width, height) {
    if (glpause) {
        return;
    }
    gl.glScissor(x, y, width, height);
}
function shaderSource(shader, source) {
    if (glpause) {
        return;
    }
    gl.glShaderSource(shader, source);
}
function stencilFunc(func, ref, mask) {
    if (glpause) {
        return;
    }
    gl.glStencilFunc(func, ref, mask);
}
function stencilFuncSeparate(face, func, ref, mask) {
    if (glpause) {
        return;
    }
    gl.glStencilFuncSeparate(face, func, ref, mask);
}
function stencilMask(mask) {
    if (glpause) {
        return;
    }
    gl.glStencilMask(mask);
}
function stencilMaskSeparate(face, mask) {
    if (glpause) {
        return;
    }
    gl.glStencilMaskSeparate(face, mask);
}
function stencilOp(fail, zfail, zpass) {
    if (glpause) {
        return;
    }
    gl.glStencilOp(fail, zfail, zpass);
}
function stencilOpSeparate(face, fail, zfail, zpass) {
    if (glpause) {
        return;
    }
    gl.glStencilOpSeparate(face, fail, zfail, zpass);
}
function texImage2D(target, level, internalformat) {
    if (glpause) {
        return;
    }
    switch (arguments.length) {
    case 6: {
            var format = arguments[3];
            var type = arguments[4];
            var source = arguments[5];
            if (Object.prototype.hasOwnProperty.call(source, '__nativeObj')) {
                gl.glTexImage2D(target, level, internalformat, format, type, source.__nativeObj);
            } else {
                if (Object.prototype.hasOwnProperty.call(source, 'buffer') && Object.prototype.hasOwnProperty.call(source.buffer, 'eof') && Object.prototype.hasOwnProperty.call(source.buffer, 'pointer') && Object.prototype.hasOwnProperty.call(source.buffer, 'netOrder') && source.width > 0 && source.height > 0) {
                    gl.glTexImage2D(target, level, internalformat, format, type, source);
                }
            }
            break;
        }
    case 9: {
            var width = arguments[3];
            var height = arguments[4];
            var border = arguments[5];
            var format = arguments[6];
            var type = arguments[7];
            var pixels = arguments[8];
            gl.glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels);
            break;
        }
    }
}
function texParameterf(target, pname, param) {
    if (glpause) {
        return;
    }
    gl.glTexParameterf(target, pname, param);
}
function texParameteri(target, pname, param) {
    if (glpause) {
        return;
    }
    gl.glTexParameteri(target, pname, param);
}
function texSubImage2D(target, level, xoffset, yoffset) {
    if (glpause) {
        return;
    }
    switch (arguments.length) {
    case 7: {
            var format = arguments[4];
            var type = arguments[5];
            var source = arguments[6];
            if (Object.prototype.hasOwnProperty.call(source, '__nativeObj')) {
                gl.glTexSubImage2D(target, level, xoffset, yoffset, format, type, source.__nativeObj);
            } else {
                gl.glTexSubImage2D(target, level, xoffset, yoffset, format, type, source);
            }
            break;
        }
    case 9: {
            var width = arguments[4];
            var height = arguments[5];
            var format = arguments[6];
            var type = arguments[7];
            var pixels = arguments[8];
            gl.glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
            break;
        }
    }
}
function uniform1f(location, x) {
    if (glpause) {
        return;
    }
    gl.glUniform1f(location, x);
}
function uniform2f(location, x, y) {
    if (glpause) {
        return;
    }
    gl.glUniform2f(location, x, y);
}
function uniform3f(location, x, y, z) {
    if (glpause) {
        return;
    }
    gl.glUniform3f(location, x, y, z);
}
function uniform4f(location, x, y, z, w) {
    if (glpause) {
        return;
    }
    gl.glUniform4f(location, x, y, z, w);
}
function uniform1i(location, x) {
    if (glpause) {
        return;
    }
    gl.glUniform1i(location, x);
}
function uniform2i(location, x, y) {
    if (glpause) {
        return;
    }
    gl.glUniform2i(location, x, y);
}
function uniform3i(location, x, y, z) {
    if (glpause) {
        return;
    }
    gl.glUniform3i(location, x, y, z);
}
function uniform4i(location, x, y, z, w) {
    if (glpause) {
        return;
    }
    gl.glUniform4i(location, x, y, z, w);
}
function uniform1fv(location, v) {
    if (glpause) {
        return;
    }
    gl.glUniform1fv(location, __TypedArrayGetData(v instanceof Array == true ? new Float32Array(v) : v));
}
function uniform2fv(location, v) {
    if (glpause) {
        return;
    }
    gl.glUniform2fv(location, __TypedArrayGetData(v instanceof Array == true ? new Float32Array(v) : v));
}
function uniform3fv(location, v) {
    if (glpause) {
        return;
    }
    gl.glUniform3fv(location, __TypedArrayGetData(v instanceof Array == true ? new Float32Array(v) : v));
}
function uniform4fv(location, v) {
    if (glpause) {
        return;
    }
    gl.glUniform4fv(location, __TypedArrayGetData(v instanceof Array == true ? new Float32Array(v) : v));
}
function uniform1iv(location, v) {
    if (glpause) {
        return;
    }
    gl.glUniform1iv(location, __TypedArrayGetData(v instanceof Array == true ? new Int32Array(v) : v));
}
function uniform2iv(location, v) {
    if (glpause) {
        return;
    }
    gl.glUniform2iv(location, __TypedArrayGetData(v instanceof Array == true ? new Int32Array(v) : v));
}
function uniform3iv(location, v) {
    if (glpause) {
        return;
    }
    gl.glUniform3iv(location, __TypedArrayGetData(v instanceof Array == true ? new Int32Array(v) : v));
}
function uniform4iv(location, v) {
    if (glpause) {
        return;
    }
    gl.glUniform4iv(location, __TypedArrayGetData(v instanceof Array == true ? new Int32Array(v) : v));
}
function uniformMatrix2fv(location, transpose, value) {
    if (glpause) {
        return;
    }
    gl.glUniformMatrix2fv(location, transpose, __TypedArrayGetData(value instanceof Array == true ? new Float32Array(value) : value));
}
function uniformMatrix3fv(location, transpose, value) {
    if (glpause) {
        return;
    }
    gl.glUniformMatrix3fv(location, transpose, __TypedArrayGetData(value instanceof Array == true ? new Float32Array(value) : value));
}
function uniformMatrix4fv(location, transpose, value) {
    if (glpause) {
        return;
    }
    gl.glUniformMatrix4fv(location, transpose, __TypedArrayGetData(value instanceof Array == true ? new Float32Array(value) : value));
}
function useProgram(program) {
    if (glpause) {
        return;
    }
    gl.glUseProgram(program);
}
function validateProgram(program) {
    if (glpause) {
        return;
    }
    gl.glValidateProgram(program);
}
function vertexAttrib1f(index, x) {
    if (glpause) {
        return;
    }
    gl.glVertexAttrib1f(index, x);
}
function vertexAttrib2f(index, x, y) {
    if (glpause) {
        return;
    }
    gl.glVertexAttrib2f(index, x, y);
}
function vertexAttrib3f(index, x, y, z) {
    if (glpause) {
        return;
    }
    gl.glVertexAttrib3f(index, x, y, z);
}
function vertexAttrib4f(index, x, y, z, w) {
    if (glpause) {
        return;
    }
    gl.glVertexAttrib4f(index, x, y, z, w);
}
function vertexAttrib1fv(index, values) {
    if (glpause) {
        return;
    }
    gl.glVertexAttrib1fv(index, __TypedArrayGetData(values instanceof Array == true ? new Float32Array(values) : values));
}
function vertexAttrib2fv(index, values) {
    if (glpause) {
        return;
    }
    gl.glVertexAttrib2fv(index, __TypedArrayGetData(values instanceof Array == true ? new Float32Array(values) : values));
}
function vertexAttrib3fv(index, values) {
    if (glpause) {
        return;
    }
    gl.glVertexAttrib3fv(index, __TypedArrayGetData(values instanceof Array == true ? new Float32Array(values) : values));
}
function vertexAttrib4fv(index, values) {
    if (glpause) {
        return;
    }
    gl.glVertexAttrib4fv(index, __TypedArrayGetData(values instanceof Array == true ? new Float32Array(values) : values));
}
function vertexAttribPointer(index, size, type, normalized, stride, offset, ignoreRecord) {
    if (glpause) {
        return;
    }
    if (typeof ignoreRecord == 'undefined') {
        var info = {
            index: index,
            size: size,
            type: type,
            normalized: normalized,
            stride: stride,
            offset: offset
        };
        if (typeof gl.recordVertexAttribPointer == 'undefined') {
            gl.recordVertexAttribPointer = [];
        }
        var has = false;
        for (var idx = 0; idx < gl.recordVertexAttribPointer.length; idx++) {
            var tmpInfo = gl.recordVertexAttribPointer[idx];
            if (tmpInfo.index == info.index) {
                has = true;
                gl.recordVertexAttribPointer[idx] = info;
                break;
            }
        }
        if (has == false) {
            gl.recordVertexAttribPointer.push(info);
        }
    }
    gl.glVertexAttribPointer(index, size, type, normalized, stride, offset);
}
function viewport(x, y, width, height) {
    if (glpause) {
        return;
    }
    gl.glViewport(x, y, width, height);
}
function getActiveAttrib(program, index) {
    if (glpause) {
        return;
    }
    return gl.glGetActiveAttrib(program, index);
}
function getActiveUniform(program, index) {
    if (glpause) {
        return;
    }
    return gl.glGetActiveUniform(program, index);
}
function getAttachedShaders(program) {
    if (glpause) {
        return;
    }
    return gl.glGetAttachedShaders(program);
}
function getBufferParameter(target, pname) {
    if (glpause) {
        return;
    }
    return gl.glGetBufferParameter(target, pname);
}
function getFramebufferAttachmentParameter(target, attachment, pname) {
    if (glpause) {
        return;
    }
    return gl.glGetFramebufferAttachmentParameter(target, attachment, pname);
}
function getProgramParameter(program, pname) {
    if (glpause) {
        return;
    }
    return gl.glGetProgramParameter(program, pname);
}
function getRenderbufferParameter(target, pname) {
    if (glpause) {
        return;
    }
    return gl.glGetRenderbufferParameter(target, pname);
}
function getShaderParameter(shader, pname) {
    if (glpause) {
        return;
    }
    return gl.glGetShaderParameter(shader, pname);
}
function getTexParameter(target, pname) {
    if (glpause) {
        return;
    }
    return gl.glGetTexParameter(target, pname);
}
function getVertexAttrib(index, pname) {
    if (glpause) {
        return;
    }
    return gl.glGetVertexAttrib(index, pname);
}
function getUniform(program, location) {
    if (glpause) {
        return;
    }
    return gl.glGetUniform(program, location);
}
function getParameter(pname) {
    if (glpause) {
        return;
    }
    switch (pname) {
    case gl.ACTIVE_TEXTURE:
    case gl.ALPHA_BITS:
    case gl.ARRAY_BUFFER_BINDING:
    case gl.BLUE_BITS:
    case gl.CULL_FACE_MODE:
    case gl.CURRENT_PROGRAM:
    case gl.DEPTH_BITS:
    case gl.DEPTH_FUNC:
    case gl.ELEMENT_ARRAY_BUFFER_BINDING:
    case gl.FRAMEBUFFER_BINDING:
    case gl.FRONT_FACE:
    case gl.GENERATE_MIPMAP_HINT:
    case gl.GREEN_BITS:
    case gl.IMPLEMENTATION_COLOR_READ_FORMAT:
    case gl.IMPLEMENTATION_COLOR_READ_TYPE:
    case gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS:
    case gl.MAX_CUBE_MAP_TEXTURE_SIZE:
    case gl.MAX_FRAGMENT_UNIFORM_VECTORS:
    case gl.MAX_RENDERBUFFER_SIZE:
    case gl.MAX_TEXTURE_IMAGE_UNITS:
    case gl.MAX_TEXTURE_SIZE:
    case gl.MAX_VARYING_VECTORS:
    case gl.MAX_VERTEX_ATTRIBS:
    case gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS:
    case gl.MAX_VERTEX_UNIFORM_VECTORS:
    case gl.MAX_VIEWPORT_DIMS:
    case gl.NUM_COMPRESSED_TEXTURE_FORMATS:
    case gl.NUM_SHADER_BINARY_FORMATS:
    case gl.PACK_ALIGNMENT:
    case gl.RED_BITS:
    case gl.RENDERBUFFER_BINDING:
    case gl.SAMPLE_BUFFERS:
    case gl.SAMPLES:
    case gl.STENCIL_BACK_FAIL:
    case gl.STENCIL_BACK_FUNC:
    case gl.STENCIL_BACK_PASS_DEPTH_FAIL:
    case gl.STENCIL_BACK_PASS_DEPTH_PASS:
    case gl.STENCIL_BACK_REF:
    case gl.STENCIL_BACK_VALUE_MASK:
    case gl.STENCIL_BACK_WRITEMASK:
    case gl.STENCIL_BITS:
    case gl.STENCIL_CLEAR_VALUE:
    case gl.STENCIL_FAIL:
    case gl.STENCIL_FUNC:
    case gl.STENCIL_PASS_DEPTH_FAIL:
    case gl.STENCIL_PASS_DEPTH_PASS:
    case gl.STENCIL_REF:
    case gl.STENCIL_VALUE_MASK:
    case gl.STENCIL_WRITEMASK:
    case gl.SUBPIXEL_BITS:
    case gl.TEXTURE_BINDING_2D:
    case gl.TEXTURE_BINDING_CUBE_MAP:
    case gl.UNPACK_ALIGNMENT:
    case gl.BLEND_DST_ALPHA:
    case gl.BLEND_DST_RGB:
    case gl.BLEND_EQUATION_ALPHA:
    case gl.BLEND_EQUATION_RGB:
    case gl.BLEND_SRC_ALPHA:
    case gl.BLEND_SRC_RGB: {
            return gl.glGetParameterInt(pname, 1);
        }
    case gl.ALIASED_LINE_WIDTH_RANGE:
    case gl.ALIASED_POINT_SIZE_RANGE:
    case gl.DEPTH_RANGE:
    case gl.MAX_VIEWPORT_DIMS: {
            return gl.glGetParameterFloat(pname, 2);
        }
    case gl.BLEND:
    case gl.CULL_FACE:
    case gl.DEPTH_TEST:
    case gl.DEPTH_WRITEMASK:
    case gl.DITHER:
    case gl.POLYGON_OFFSET_FILL:
    case gl.SAMPLE_ALPHA_TO_COVERAGE:
    case gl.SAMPLE_COVERAGE:
    case gl.SAMPLE_COVERAGE_INVERT:
    case gl.SCISSOR_TEST:
    case gl.SHADER_COMPILER:
    case gl.STENCIL_TEST: {
            return gl.glGetParameterBool(pname, 1);
        }
    case gl.BLEND_COLOR:
    case gl.COLOR_CLEAR_VALUE: {
            return gl.glGetParameterFloat(pname, 4);
        }
    case gl.SCISSOR_BOX:
    case gl.VIEWPORT: {
            return gl.glGetParameterInt(pname, 4);
        }
    case gl.COLOR_WRITEMASK: {
            return gl.glGetParameterBool(pname, 4);
        }
    case gl.POLYGON_OFFSET_FACTOR:
    case gl.POLYGON_OFFSET_UNITS:
    case gl.SAMPLE_COVERAGE_VALUE: {
            return gl.glGetParameterFloat(pname, 1);
        }
    case gl.SHADER_BINARY_FORMATS: {
            var len = gl.glGetParameterInt(gl.NUM_SHADER_BINARY_FORMATS, 1);
            return gl.glGetParameterInt(pname, len);
        }
    case gl.COMPRESSED_TEXTURE_FORMATS: {
            var len = gl.glGetParameterInt(gl.NUM_COMPRESSED_TEXTURE_FORMATS, 1);
            return gl.glGetParameterInt(pname, len);
        }
    default:
        break;
    }
}
function voidFunc(a, b, c, d, e, f, l, i, k, o) {
}
function attchVoidMethod() {
    gl.methodWorking = false;
    gl.activeTexture = voidFunc;
    gl.attachShader = voidFunc;
    gl.bindAttribLocation = voidFunc;
    gl.bindBuffer = voidFunc;
    gl.bindFramebuffer = voidFunc;
    gl.bindRenderbuffer = voidFunc;
    gl.bindTexture = voidFunc;
    gl.blendColor = voidFunc;
    gl.blendEquation = voidFunc;
    gl.blendEquationSeparate = voidFunc;
    gl.blendFunc = voidFunc;
    gl.blendFuncSeparate = voidFunc;
    gl.bufferData = voidFunc;
    gl.bufferData = voidFunc;
    gl.bufferSubData = voidFunc;
    gl.checkFramebufferStatus = voidFunc;
    gl.clear = voidFunc;
    gl.clearColor = voidFunc;
    gl.clearDepth = voidFunc;
    gl.clearStencil = voidFunc;
    gl.colorMask = voidFunc;
    gl.compileShader = voidFunc;
    gl.compressedTexImage2D = voidFunc;
    gl.compressedTexSubImage2D = voidFunc;
    gl.copyTexImage2D = voidFunc;
    gl.copyTexSubImage2D = voidFunc;
    gl.createBuffer = voidFunc;
    gl.createFramebuffer = voidFunc;
    gl.createProgram = voidFunc;
    gl.createRenderbuffer = voidFunc;
    gl.createShader = voidFunc;
    gl.createTexture = voidFunc;
    gl.cullFace = voidFunc;
    gl.deleteBuffer = voidFunc;
    gl.deleteFramebuffer = voidFunc;
    gl.deleteProgram = voidFunc;
    gl.deleteRenderbuffer = voidFunc;
    gl.deleteShader = voidFunc;
    gl.deleteTexture = voidFunc;
    gl.depthFunc = voidFunc;
    gl.depthMask = voidFunc;
    gl.depthRange = voidFunc;
    gl.detachShader = voidFunc;
    gl.disable = voidFunc;
    gl.disableVertexAttribArray = voidFunc;
    gl.drawArrays = voidFunc;
    gl.drawElements = voidFunc;
    gl.enable = voidFunc;
    gl.enableVertexAttribArray = voidFunc;
    gl.finish = voidFunc;
    gl.flush = voidFunc;
    gl.framebufferRenderbuffer = voidFunc;
    gl.framebufferTexture2D = voidFunc;
    gl.frontFace = voidFunc;
    gl.generateMipmap = voidFunc;
    gl.getAttribLocation = voidFunc;
    gl.getError = voidFunc;
    gl.getProgramInfoLog = voidFunc;
    gl.getShaderInfoLog = voidFunc;
    gl.getShaderSource = voidFunc;
    gl.getUniformLocation = voidFunc;
    gl.getVertexAttribOffset = voidFunc;
    gl.hint = voidFunc;
    gl.isBuffer = voidFunc;
    gl.isEnabled = voidFunc;
    gl.isFramebuffer = voidFunc;
    gl.isProgram = voidFunc;
    gl.isRenderbuffer = voidFunc;
    gl.isShader = voidFunc;
    gl.isTexture = voidFunc;
    gl.lineWidth = voidFunc;
    gl.linkProgram = voidFunc;
    gl.pixelStorei = voidFunc;
    gl.polygonOffset = voidFunc;
    gl.readPixels = voidFunc;
    gl.renderbufferStorage = voidFunc;
    gl.sampleCoverage = voidFunc;
    gl.scissor = voidFunc;
    gl.shaderSource = voidFunc;
    gl.stencilFunc = voidFunc;
    gl.stencilFuncSeparate = voidFunc;
    gl.stencilMask = voidFunc;
    gl.stencilMaskSeparate = voidFunc;
    gl.stencilOp = voidFunc;
    gl.stencilOpSeparate = voidFunc;
    gl.texImage2D = voidFunc;
    gl.texSubImage2D = voidFunc;
    gl.texParameterf = voidFunc;
    gl.texParameteri = voidFunc;
    gl.uniform1f = voidFunc;
    gl.uniform2f = voidFunc;
    gl.uniform3f = voidFunc;
    gl.uniform4f = voidFunc;
    gl.uniform1i = voidFunc;
    gl.uniform2i = voidFunc;
    gl.uniform3i = voidFunc;
    gl.uniform4i = voidFunc;
    gl.uniform1fv = voidFunc;
    gl.uniform2fv = voidFunc;
    gl.uniform3fv = voidFunc;
    gl.uniform4fv = voidFunc;
    gl.uniform1iv = voidFunc;
    gl.uniform2iv = voidFunc;
    gl.uniform3iv = voidFunc;
    gl.uniform4iv = voidFunc;
    gl.uniformMatrix2fv = voidFunc;
    gl.uniformMatrix3fv = voidFunc;
    gl.uniformMatrix4fv = voidFunc;
    gl.useProgram = voidFunc;
    gl.validateProgram = voidFunc;
    gl.vertexAttrib1f = voidFunc;
    gl.vertexAttrib2f = voidFunc;
    gl.vertexAttrib3f = voidFunc;
    gl.vertexAttrib4f = voidFunc;
    gl.vertexAttrib1fv = voidFunc;
    gl.vertexAttrib2fv = voidFunc;
    gl.vertexAttrib3fv = voidFunc;
    gl.vertexAttrib4fv = voidFunc;
    gl.vertexAttribPointer = voidFunc;
    gl.viewport = voidFunc;
    gl.getActiveAttrib = voidFunc;
    gl.getActiveUniform = voidFunc;
    gl.getAttachedShaders = voidFunc;
    gl.getBufferParameter = voidFunc;
    gl.getFramebufferAttachmentParameter = voidFunc;
    gl.getProgramParameter = voidFunc;
    gl.getRenderbufferParameter = voidFunc;
    gl.getShaderParameter = voidFunc;
    gl.getTexParameter = voidFunc;
    gl.getVertexAttrib = voidFunc;
    gl.getParameter = voidFunc;
    gl.getUniform = voidFunc;
    gl.getShaderPrecisionFormat = voidFunc;
}
function attachMethod() {
    gl.methodWorking = true;
    gl.activeTexture = activeTexture;
    gl.attachShader = attachShader;
    gl.bindAttribLocation = bindAttribLocation;
    gl.bindBuffer = bindBuffer;
    gl.bindFramebuffer = bindFramebuffer;
    gl.bindRenderbuffer = bindRenderbuffer;
    gl.bindTexture = bindTexture;
    gl.blendColor = blendColor;
    gl.blendEquation = blendEquation;
    gl.blendEquationSeparate = blendEquationSeparate;
    gl.blendFunc = blendFunc;
    gl.blendFuncSeparate = blendFuncSeparate;
    gl.bufferData = bufferData;
    gl.bufferData = bufferData;
    gl.bufferSubData = bufferSubData;
    gl.checkFramebufferStatus = checkFramebufferStatus;
    gl.clear = clear;
    gl.clearColor = clearColor;
    gl.clearDepth = clearDepth;
    gl.clearStencil = clearStencil;
    gl.colorMask = colorMask;
    gl.compileShader = compileShader;
    gl.compressedTexImage2D = compressedTexImage2D;
    gl.compressedTexSubImage2D = compressedTexSubImage2D;
    gl.copyTexImage2D = copyTexImage2D;
    gl.copyTexSubImage2D = copyTexSubImage2D;
    gl.createBuffer = createBuffer;
    gl.createFramebuffer = createFramebuffer;
    gl.createProgram = createProgram;
    gl.createRenderbuffer = createRenderbuffer;
    gl.createShader = createShader;
    gl.createTexture = createTexture;
    gl.cullFace = cullFace;
    gl.deleteBuffer = deleteBuffer;
    gl.deleteFramebuffer = deleteFramebuffer;
    gl.deleteProgram = deleteProgram;
    gl.deleteRenderbuffer = deleteRenderbuffer;
    gl.deleteShader = deleteShader;
    gl.deleteTexture = deleteTexture;
    gl.depthFunc = depthFunc;
    gl.depthMask = depthMask;
    gl.depthRange = depthRange;
    gl.detachShader = detachShader;
    gl.disable = disable;
    gl.disableVertexAttribArray = disableVertexAttribArray;
    gl.drawArrays = drawArrays;
    gl.drawElements = drawElements;
    gl.enable = enable;
    gl.enableVertexAttribArray = enableVertexAttribArray;
    gl.finish = finish;
    gl.flush = flush;
    gl.framebufferRenderbuffer = framebufferRenderbuffer;
    gl.framebufferTexture2D = framebufferTexture2D;
    gl.frontFace = frontFace;
    gl.generateMipmap = generateMipmap;
    gl.getAttribLocation = getAttribLocation;
    gl.getError = getError;
    gl.getProgramInfoLog = getProgramInfoLog;
    gl.getShaderInfoLog = getShaderInfoLog;
    gl.getShaderSource = getShaderSource;
    gl.getUniformLocation = getUniformLocation;
    gl.getVertexAttribOffset = getVertexAttribOffset;
    gl.hint = hint;
    gl.isBuffer = isBuffer;
    gl.isEnabled = isEnabled;
    gl.isFramebuffer = isFramebuffer;
    gl.isProgram = isProgram;
    gl.isRenderbuffer = isRenderbuffer;
    gl.isShader = isShader;
    gl.isTexture = isTexture;
    gl.lineWidth = lineWidth;
    gl.linkProgram = linkProgram;
    gl.pixelStorei = pixelStorei;
    gl.polygonOffset = polygonOffset;
    gl.readPixels = readPixels;
    gl.renderbufferStorage = renderbufferStorage;
    gl.sampleCoverage = sampleCoverage;
    gl.scissor = scissor;
    gl.shaderSource = shaderSource;
    gl.stencilFunc = stencilFunc;
    gl.stencilFuncSeparate = stencilFuncSeparate;
    gl.stencilMask = stencilMask;
    gl.stencilMaskSeparate = stencilMaskSeparate;
    gl.stencilOp = stencilOp;
    gl.stencilOpSeparate = stencilOpSeparate;
    gl.texImage2D = texImage2D;
    gl.texSubImage2D = texSubImage2D;
    gl.texParameterf = texParameterf;
    gl.texParameteri = texParameteri;
    gl.uniform1f = uniform1f;
    gl.uniform2f = uniform2f;
    gl.uniform3f = uniform3f;
    gl.uniform4f = uniform4f;
    gl.uniform1i = uniform1i;
    gl.uniform2i = uniform2i;
    gl.uniform3i = uniform3i;
    gl.uniform4i = uniform4i;
    gl.uniform1fv = uniform1fv;
    gl.uniform2fv = uniform2fv;
    gl.uniform3fv = uniform3fv;
    gl.uniform4fv = uniform4fv;
    gl.uniform1iv = uniform1iv;
    gl.uniform2iv = uniform2iv;
    gl.uniform3iv = uniform3iv;
    gl.uniform4iv = uniform4iv;
    gl.uniformMatrix2fv = uniformMatrix2fv;
    gl.uniformMatrix3fv = uniformMatrix3fv;
    gl.uniformMatrix4fv = uniformMatrix4fv;
    gl.useProgram = useProgram;
    gl.validateProgram = validateProgram;
    gl.vertexAttrib1f = vertexAttrib1f;
    gl.vertexAttrib2f = vertexAttrib2f;
    gl.vertexAttrib3f = vertexAttrib3f;
    gl.vertexAttrib4f = vertexAttrib4f;
    gl.vertexAttrib1fv = vertexAttrib1fv;
    gl.vertexAttrib2fv = vertexAttrib2fv;
    gl.vertexAttrib3fv = vertexAttrib3fv;
    gl.vertexAttrib4fv = vertexAttrib4fv;
    gl.vertexAttribPointer = vertexAttribPointer;
    gl.viewport = viewport;
    gl.getActiveAttrib = getActiveAttrib;
    gl.getActiveUniform = getActiveUniform;
    gl.getAttachedShaders = getAttachedShaders;
    gl.getBufferParameter = getBufferParameter;
    gl.getFramebufferAttachmentParameter = getFramebufferAttachmentParameter;
    gl.getProgramParameter = getProgramParameter;
    gl.getRenderbufferParameter = getRenderbufferParameter;
    gl.getShaderParameter = getShaderParameter;
    gl.getTexParameter = getTexParameter;
    gl.getVertexAttrib = getVertexAttrib;
    gl.getParameter = getParameter;
    gl.getUniform = getUniform;
    gl.getShaderPrecisionFormat = getShaderPrecisionFormat;
}
function attatchConst() {
    gl.DEPTH_BUFFER_BIT = 256;
    gl.STENCIL_BUFFER_BIT = 1024;
    gl.COLOR_BUFFER_BIT = 16384;
    gl.POINTS = 0;
    gl.LINES = 1;
    gl.LINE_LOOP = 2;
    gl.LINE_STRIP = 3;
    gl.TRIANGLES = 4;
    gl.TRIANGLE_STRIP = 5;
    gl.TRIANGLE_FAN = 6;
    gl.ZERO = 0;
    gl.ONE = 1;
    gl.SRC_COLOR = 768;
    gl.ONE_MINUS_SRC_COLOR = 769;
    gl.SRC_ALPHA = 770;
    gl.ONE_MINUS_SRC_ALPHA = 771;
    gl.DST_ALPHA = 772;
    gl.ONE_MINUS_DST_ALPHA = 773;
    gl.DST_COLOR = 774;
    gl.ONE_MINUS_DST_COLOR = 775;
    gl.SRC_ALPHA_SATURATE = 776;
    gl.FUNC_ADD = 32774;
    gl.BLEND_EQUATION = 32777;
    gl.BLEND_EQUATION_RGB = 32777;
    gl.BLEND_EQUATION_ALPHA = 34877;
    gl.FUNC_SUBTRACT = 32778;
    gl.FUNC_REVERSE_SUBTRACT = 32779;
    gl.BLEND_DST_RGB = 32968;
    gl.BLEND_SRC_RGB = 32969;
    gl.BLEND_DST_ALPHA = 32970;
    gl.BLEND_SRC_ALPHA = 32971;
    gl.CONSTANT_COLOR = 32769;
    gl.ONE_MINUS_CONSTANT_COLOR = 32770;
    gl.CONSTANT_ALPHA = 32771;
    gl.ONE_MINUS_CONSTANT_ALPHA = 32772;
    gl.BLEND_COLOR = 32773;
    gl.ARRAY_BUFFER = 34962;
    gl.ELEMENT_ARRAY_BUFFER = 34963;
    gl.ARRAY_BUFFER_BINDING = 34964;
    gl.ELEMENT_ARRAY_BUFFER_BINDING = 34965;
    gl.STREAM_DRAW = 35040;
    gl.STATIC_DRAW = 35044;
    gl.DYNAMIC_DRAW = 35048;
    gl.BUFFER_SIZE = 34660;
    gl.BUFFER_USAGE = 34661;
    gl.CURRENT_VERTEX_ATTRIB = 34342;
    gl.FRONT = 1028;
    gl.BACK = 1029;
    gl.FRONT_AND_BACK = 1032;
    gl.CULL_FACE = 2884;
    gl.BLEND = 3042;
    gl.DITHER = 3024;
    gl.STENCIL_TEST = 2960;
    gl.DEPTH_TEST = 2929;
    gl.SCISSOR_TEST = 3089;
    gl.POLYGON_OFFSET_FILL = 32823;
    gl.SAMPLE_ALPHA_TO_COVERAGE = 32926;
    gl.SAMPLE_COVERAGE = 32928;
    gl.NO_ERROR = 0;
    gl.INVALID_ENUM = 1280;
    gl.INVALID_VALUE = 1281;
    gl.INVALID_OPERATION = 1282;
    gl.OUT_OF_MEMORY = 1285;
    gl.CW = 2304;
    gl.CCW = 2305;
    gl.LINE_WIDTH = 2849;
    gl.ALIASED_POINT_SIZE_RANGE = 33901;
    gl.ALIASED_LINE_WIDTH_RANGE = 33902;
    gl.CULL_FACE_MODE = 2885;
    gl.FRONT_FACE = 2886;
    gl.DEPTH_RANGE = 2928;
    gl.DEPTH_WRITEMASK = 2930;
    gl.DEPTH_CLEAR_VALUE = 2931;
    gl.DEPTH_FUNC = 2932;
    gl.STENCIL_CLEAR_VALUE = 2961;
    gl.STENCIL_FUNC = 2962;
    gl.STENCIL_FAIL = 2964;
    gl.STENCIL_PASS_DEPTH_FAIL = 2965;
    gl.STENCIL_PASS_DEPTH_PASS = 2966;
    gl.STENCIL_REF = 2967;
    gl.STENCIL_VALUE_MASK = 2963;
    gl.STENCIL_WRITEMASK = 2968;
    gl.STENCIL_BACK_FUNC = 34816;
    gl.STENCIL_BACK_FAIL = 34817;
    gl.STENCIL_BACK_PASS_DEPTH_FAIL = 34818;
    gl.STENCIL_BACK_PASS_DEPTH_PASS = 34819;
    gl.STENCIL_BACK_REF = 36003;
    gl.STENCIL_BACK_VALUE_MASK = 36004;
    gl.STENCIL_BACK_WRITEMASK = 36005;
    gl.VIEWPORT = 2978;
    gl.SCISSOR_BOX = 3088;
    gl.COLOR_CLEAR_VALUE = 3106;
    gl.COLOR_WRITEMASK = 3107;
    gl.UNPACK_ALIGNMENT = 3317;
    gl.PACK_ALIGNMENT = 3333;
    gl.MAX_TEXTURE_SIZE = 3379;
    gl.MAX_VIEWPORT_DIMS = 3386;
    gl.SUBPIXEL_BITS = 3408;
    gl.RED_BITS = 3410;
    gl.GREEN_BITS = 3411;
    gl.BLUE_BITS = 3412;
    gl.ALPHA_BITS = 3413;
    gl.DEPTH_BITS = 3414;
    gl.STENCIL_BITS = 3415;
    gl.POLYGON_OFFSET_UNITS = 10752;
    gl.POLYGON_OFFSET_FACTOR = 32824;
    gl.TEXTURE_BINDING_2D = 32873;
    gl.SAMPLE_BUFFERS = 32936;
    gl.SAMPLES = 32937;
    gl.SAMPLE_COVERAGE_VALUE = 32938;
    gl.SAMPLE_COVERAGE_INVERT = 32939;
    gl.COMPRESSED_TEXTURE_FORMATS = 34467;
    gl.DONT_CARE = 4352;
    gl.FASTEST = 4353;
    gl.NICEST = 4354;
    gl.GENERATE_MIPMAP_HINT = 33170;
    gl.BYTE = 5120;
    gl.UNSIGNED_BYTE = 5121;
    gl.SHORT = 5122;
    gl.UNSIGNED_SHORT = 5123;
    gl.INT = 5124;
    gl.UNSIGNED_INT = 5125;
    gl.FLOAT = 5126;
    gl.DEPTH_COMPONENT = 6402;
    gl.ALPHA = 6406;
    gl.RGB = 6407;
    gl.RGBA = 6408;
    gl.LUMINANCE = 6409;
    gl.LUMINANCE_ALPHA = 6410;
    gl.UNSIGNED_SHORT_4_4_4_4 = 32819;
    gl.UNSIGNED_SHORT_5_5_5_1 = 32820;
    gl.UNSIGNED_SHORT_5_6_5 = 33635;
    gl.FRAGMENT_SHADER = 35632;
    gl.VERTEX_SHADER = 35633;
    gl.MAX_VERTEX_ATTRIBS = 34921;
    gl.MAX_VERTEX_UNIFORM_VECTORS = 36347;
    gl.MAX_VARYING_VECTORS = 36348;
    gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661;
    gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660;
    gl.MAX_TEXTURE_IMAGE_UNITS = 34930;
    gl.MAX_FRAGMENT_UNIFORM_VECTORS = 36349;
    gl.SHADER_TYPE = 35663;
    gl.DELETE_STATUS = 35712;
    gl.LINK_STATUS = 35714;
    gl.VALIDATE_STATUS = 35715;
    gl.ATTACHED_SHADERS = 35717;
    gl.ACTIVE_UNIFORMS = 35718;
    gl.ACTIVE_ATTRIBUTES = 35721;
    gl.SHADING_LANGUAGE_VERSION = 35724;
    gl.CURRENT_PROGRAM = 35725;
    gl.NEVER = 512;
    gl.LESS = 513;
    gl.EQUAL = 514;
    gl.LEQUAL = 515;
    gl.GREATER = 516;
    gl.NOTEQUAL = 517;
    gl.GEQUAL = 518;
    gl.ALWAYS = 519;
    gl.KEEP = 7680;
    gl.REPLACE = 7681;
    gl.INCR = 7682;
    gl.DECR = 7683;
    gl.INVERT = 5386;
    gl.INCR_WRAP = 34055;
    gl.DECR_WRAP = 34056;
    gl.VENDOR = 7936;
    gl.RENDERER = 7937;
    gl.VERSION = 7938;
    gl.NEAREST = 9728;
    gl.LINEAR = 9729;
    gl.NEAREST_MIPMAP_NEAREST = 9984;
    gl.LINEAR_MIPMAP_NEAREST = 9985;
    gl.NEAREST_MIPMAP_LINEAR = 9986;
    gl.LINEAR_MIPMAP_LINEAR = 9987;
    gl.TEXTURE_MAG_FILTER = 10240;
    gl.TEXTURE_MIN_FILTER = 10241;
    gl.TEXTURE_WRAP_S = 10242;
    gl.TEXTURE_WRAP_T = 10243;
    gl.TEXTURE_2D = 3553;
    gl.TEXTURE = 5890;
    gl.TEXTURE_CUBE_MAP = 34067;
    gl.TEXTURE_BINDING_CUBE_MAP = 34068;
    gl.TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
    gl.MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
    gl.TEXTURE0 = 33984;
    gl.TEXTURE1 = 33985;
    gl.TEXTURE2 = 33986;
    gl.TEXTURE3 = 33987;
    gl.TEXTURE4 = 33988;
    gl.TEXTURE5 = 33989;
    gl.TEXTURE6 = 33990;
    gl.TEXTURE7 = 33991;
    gl.TEXTURE8 = 33992;
    gl.TEXTURE9 = 33993;
    gl.TEXTURE10 = 33994;
    gl.TEXTURE11 = 33995;
    gl.TEXTURE12 = 33996;
    gl.TEXTURE13 = 33997;
    gl.TEXTURE14 = 33998;
    gl.TEXTURE15 = 33999;
    gl.TEXTURE16 = 34000;
    gl.TEXTURE17 = 34001;
    gl.TEXTURE18 = 34002;
    gl.TEXTURE19 = 34003;
    gl.TEXTURE20 = 34004;
    gl.TEXTURE21 = 34005;
    gl.TEXTURE22 = 34006;
    gl.TEXTURE23 = 34007;
    gl.TEXTURE24 = 34008;
    gl.TEXTURE25 = 34009;
    gl.TEXTURE26 = 34010;
    gl.TEXTURE27 = 34011;
    gl.TEXTURE28 = 34012;
    gl.TEXTURE29 = 34013;
    gl.TEXTURE30 = 34014;
    gl.TEXTURE31 = 34015;
    gl.ACTIVE_TEXTURE = 34016;
    gl.REPEAT = 10497;
    gl.CLAMP_TO_EDGE = 33071;
    gl.MIRRORED_REPEAT = 33648;
    gl.FLOAT_VEC2 = 35664;
    gl.FLOAT_VEC3 = 35665;
    gl.FLOAT_VEC4 = 35666;
    gl.INT_VEC2 = 35667;
    gl.INT_VEC3 = 35668;
    gl.INT_VEC4 = 35669;
    gl.BOOL = 35670;
    gl.BOOL_VEC2 = 35671;
    gl.BOOL_VEC3 = 35672;
    gl.BOOL_VEC4 = 35673;
    gl.FLOAT_MAT2 = 35674;
    gl.FLOAT_MAT3 = 35675;
    gl.FLOAT_MAT4 = 35676;
    gl.SAMPLER_2D = 35678;
    gl.SAMPLER_CUBE = 35680;
    gl.VERTEX_ATTRIB_ARRAY_ENABLED = 34338;
    gl.VERTEX_ATTRIB_ARRAY_SIZE = 34339;
    gl.VERTEX_ATTRIB_ARRAY_STRIDE = 34340;
    gl.VERTEX_ATTRIB_ARRAY_TYPE = 34341;
    gl.VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922;
    gl.VERTEX_ATTRIB_ARRAY_POINTER = 34373;
    gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975;
    gl.IMPLEMENTATION_COLOR_READ_TYPE = 35738;
    gl.IMPLEMENTATION_COLOR_READ_FORMAT = 35739;
    gl.COMPILE_STATUS = 35713;
    gl.LOW_FLOAT = 36336;
    gl.MEDIUM_FLOAT = 36337;
    gl.HIGH_FLOAT = 36338;
    gl.LOW_INT = 36339;
    gl.MEDIUM_INT = 36340;
    gl.HIGH_INT = 36341;
    gl.FRAMEBUFFER = 36160;
    gl.RENDERBUFFER = 36161;
    gl.RGBA4 = 32854;
    gl.RGB5_A1 = 32855;
    gl.RGB565 = 36194;
    gl.DEPTH_COMPONENT16 = 33189;
    gl.STENCIL_INDEX8 = 36168;
    gl.DEPTH_STENCIL = 34041;
    gl.RENDERBUFFER_WIDTH = 36162;
    gl.RENDERBUFFER_HEIGHT = 36163;
    gl.RENDERBUFFER_INTERNAL_FORMAT = 36164;
    gl.RENDERBUFFER_RED_SIZE = 36176;
    gl.RENDERBUFFER_GREEN_SIZE = 36177;
    gl.RENDERBUFFER_BLUE_SIZE = 36178;
    gl.RENDERBUFFER_ALPHA_SIZE = 36179;
    gl.RENDERBUFFER_DEPTH_SIZE = 36180;
    gl.RENDERBUFFER_STENCIL_SIZE = 36181;
    gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048;
    gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049;
    gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050;
    gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051;
    gl.COLOR_ATTACHMENT0 = 36064;
    gl.DEPTH_ATTACHMENT = 36096;
    gl.STENCIL_ATTACHMENT = 36128;
    gl.DEPTH_STENCIL_ATTACHMENT = 33306;
    gl.NONE = 0;
    gl.FRAMEBUFFER_COMPLETE = 36053;
    gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054;
    gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055;
    gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057;
    gl.FRAMEBUFFER_UNSUPPORTED = 36061;
    gl.FRAMEBUFFER_BINDING = 36006;
    gl.RENDERBUFFER_BINDING = 36007;
    gl.MAX_RENDERBUFFER_SIZE = 34024;
    gl.INVALID_FRAMEBUFFER_OPERATION = 1286;
    gl.UNPACK_FLIP_Y_WEBGL = 37440;
    gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
    gl.CONTEXT_LOST_WEBGL = 37442;
    gl.UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
    gl.BROWSER_DEFAULT_WEBGL = 37444;
    gl.SHADER_BINARY_FORMATS = 36344;
    gl.NUM_SHADER_BINARY_FORMATS = 36345;
    gl.NUM_COMPRESSED_TEXTURE_FORMATS = 34466;
}
var GL_COMMAND_ACTIVE_TEXTURE = 0;
var GL_COMMAND_ATTACH_SHADER = 1;
var GL_COMMAND_BIND_ATTRIB_LOCATION = 2;
var GL_COMMAND_BIND_BUFFER = 3;
var GL_COMMAND_BIND_FRAME_BUFFER = 4;
var GL_COMMAND_BIND_RENDER_BUFFER = 5;
var GL_COMMAND_BIND_TEXTURE = 6;
var GL_COMMAND_BLEND_COLOR = 7;
var GL_COMMAND_BLEND_EQUATION = 8;
var GL_COMMAND_BLEND_EQUATION_SEPARATE = 9;
var GL_COMMAND_BLEND_FUNC = 10;
var GL_COMMAND_BLEND_FUNC_SEPARATE = 11;
var GL_COMMAND_BUFFER_DATA = 12;
var GL_COMMAND_BUFFER_SUB_DATA = 13;
var GL_COMMAND_CLEAR = 14;
var GL_COMMAND_CLEAR_COLOR = 15;
var GL_COMMAND_CLEAR_DEPTH = 16;
var GL_COMMAND_CLEAR_STENCIL = 17;
var GL_COMMAND_COLOR_MASK = 18;
var GL_COMMAND_COMMIT = 19;
var GL_COMMAND_COMPILE_SHADER = 20;
var GL_COMMAND_COMPRESSED_TEX_IMAGE_2D = 21;
var GL_COMMAND_COMPRESSED_TEX_SUB_IMAGE_2D = 22;
var GL_COMMAND_COPY_TEX_IMAGE_2D = 23;
var GL_COMMAND_COPY_TEX_SUB_IMAGE_2D = 24;
var GL_COMMAND_CULL_FACE = 25;
var GL_COMMAND_DELETE_BUFFER = 26;
var GL_COMMAND_DELETE_FRAME_BUFFER = 27;
var GL_COMMAND_DELETE_PROGRAM = 28;
var GL_COMMAND_DELETE_RENDER_BUFFER = 29;
var GL_COMMAND_DELETE_SHADER = 30;
var GL_COMMAND_DELETE_TEXTURE = 31;
var GL_COMMAND_DEPTH_FUNC = 32;
var GL_COMMAND_DEPTH_MASK = 33;
var GL_COMMAND_DEPTH_RANGE = 34;
var GL_COMMAND_DETACH_SHADER = 35;
var GL_COMMAND_DISABLE = 36;
var GL_COMMAND_DISABLE_VERTEX_ATTRIB_ARRAY = 37;
var GL_COMMAND_DRAW_ARRAYS = 38;
var GL_COMMAND_DRAW_ELEMENTS = 39;
var GL_COMMAND_ENABLE = 40;
var GL_COMMAND_ENABLE_VERTEX_ATTRIB_ARRAY = 41;
var GL_COMMAND_FINISH = 42;
var GL_COMMAND_FLUSH = 43;
var GL_COMMAND_FRAME_BUFFER_RENDER_BUFFER = 44;
var GL_COMMAND_FRAME_BUFFER_TEXTURE_2D = 45;
var GL_COMMAND_FRONT_FACE = 46;
var GL_COMMAND_GENERATE_MIPMAP = 47;
var GL_COMMAND_HINT = 48;
var GL_COMMAND_LINE_WIDTH = 49;
var GL_COMMAND_LINK_PROGRAM = 50;
var GL_COMMAND_PIXEL_STOREI = 51;
var GL_COMMAND_POLYGON_OFFSET = 52;
var GL_COMMAND_RENDER_BUFFER_STORAGE = 53;
var GL_COMMAND_SAMPLE_COVERAGE = 54;
var GL_COMMAND_SCISSOR = 55;
var GL_COMMAND_SHADER_SOURCE = 56;
var GL_COMMAND_STENCIL_FUNC = 57;
var GL_COMMAND_STENCIL_FUNC_SEPARATE = 58;
var GL_COMMAND_STENCIL_MASK = 59;
var GL_COMMAND_STENCIL_MASK_SEPARATE = 60;
var GL_COMMAND_STENCIL_OP = 61;
var GL_COMMAND_STENCIL_OP_SEPARATE = 62;
var GL_COMMAND_TEX_IMAGE_2D = 63;
var GL_COMMAND_TEX_PARAMETER_F = 64;
var GL_COMMAND_TEX_PARAMETER_I = 65;
var GL_COMMAND_TEX_SUB_IMAGE_2D = 66;
var GL_COMMAND_UNIFORM_1F = 67;
var GL_COMMAND_UNIFORM_1FV = 68;
var GL_COMMAND_UNIFORM_1I = 69;
var GL_COMMAND_UNIFORM_1IV = 70;
var GL_COMMAND_UNIFORM_2F = 71;
var GL_COMMAND_UNIFORM_2FV = 72;
var GL_COMMAND_UNIFORM_2I = 73;
var GL_COMMAND_UNIFORM_2IV = 74;
var GL_COMMAND_UNIFORM_3F = 75;
var GL_COMMAND_UNIFORM_3FV = 76;
var GL_COMMAND_UNIFORM_3I = 77;
var GL_COMMAND_UNIFORM_3IV = 78;
var GL_COMMAND_UNIFORM_4F = 79;
var GL_COMMAND_UNIFORM_4FV = 80;
var GL_COMMAND_UNIFORM_4I = 81;
var GL_COMMAND_UNIFORM_4IV = 82;
var GL_COMMAND_UNIFORM_MATRIX_2FV = 83;
var GL_COMMAND_UNIFORM_MATRIX_3FV = 84;
var GL_COMMAND_UNIFORM_MATRIX_4FV = 85;
var GL_COMMAND_USE_PROGRAM = 86;
var GL_COMMAND_VALIDATE_PROGRAM = 87;
var GL_COMMAND_VERTEX_ATTRIB_1F = 88;
var GL_COMMAND_VERTEX_ATTRIB_2F = 89;
var GL_COMMAND_VERTEX_ATTRIB_3F = 90;
var GL_COMMAND_VERTEX_ATTRIB_4F = 91;
var GL_COMMAND_VERTEX_ATTRIB_1FV = 92;
var GL_COMMAND_VERTEX_ATTRIB_2FV = 93;
var GL_COMMAND_VERTEX_ATTRIB_3FV = 94;
var GL_COMMAND_VERTEX_ATTRIB_4FV = 95;
var GL_COMMAND_VERTEX_ATTRIB_POINTER = 96;
var GL_COMMAND_VIEW_PORT = 97;
var total_size = 100000;
var next_index = 0;
var buffer_data;
var bufferdata_array;
var bufferdata_view;
var bufferdata_pointer = 0;
function OpenOptMode() {
    if (gl.flushCommand && isSupportTypeArray()) {
        attachMethodOpt();
    }
    buffer_data = new Float32Array(total_size);
}
function flushCommand() {
    if (next_index > 0) {
        gl.flushCommand(next_index, buffer_data);
        next_index = 0;
    }
}
function glCommitOpt() {
    flushCommand();
    gl.commit();
}
function activeTextureOpt(texture) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_ACTIVE_TEXTURE;
    buffer_data[next_index + 1] = texture;
    next_index += 2;
}
function attachShaderOpt(program, shader) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_ATTACH_SHADER;
    buffer_data[next_index + 1] = program;
    buffer_data[next_index + 2] = shader;
    next_index += 3;
}
function bindAttribLocationOpt(program, index, name) {
    flushCommand();
    bindAttribLocation(program, index, name);
}
function bindBufferOpt(target, buffer) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = buffer;
    next_index += 3;
}
function bindFramebufferOpt(target, framebuffer) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_FRAME_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = framebuffer;
    next_index += 3;
}
function bindRenderbufferOpt(target, renderbuffer) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_RENDER_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = renderbuffer;
    next_index += 3;
}
function bindTextureOpt(target, texture) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BIND_TEXTURE;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = texture;
    next_index += 3;
}
function blendColorOpt(red, green, blue, alpha) {
    if (next_index + 5 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_COLOR;
    buffer_data[next_index + 1] = red;
    buffer_data[next_index + 2] = green;
    buffer_data[next_index + 3] = blue;
    buffer_data[next_index + 4] = alpha;
    next_index += 5;
}
function blendEquationOpt(mode) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_EQUATION;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
}
function blendEquationSeparateOpt(modeRGB, modeAlpha) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_EQUATION_SEPARATE;
    buffer_data[next_index + 1] = modeRGB;
    buffer_data[next_index + 2] = modeAlpha;
    next_index += 3;
}
function blendFuncOpt(sfactor, dfactor) {
    if (next_index + 3 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_FUNC;
    buffer_data[next_index + 1] = sfactor;
    buffer_data[next_index + 2] = dfactor;
    next_index += 3;
}
function blendFuncSeparateOpt(srcRGB, dstRGB, srcAlpha, dstAlpha) {
    if (next_index + 5 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_BLEND_FUNC_SEPARATE;
    buffer_data[next_index + 1] = srcRGB;
    buffer_data[next_index + 2] = dstRGB;
    buffer_data[next_index + 3] = srcAlpha;
    buffer_data[next_index + 4] = dstAlpha;
    next_index += 5;
}
function bufferDataOpt(target, data, usage) {
    flushCommand();
    bufferData(target, data, usage);
}
function bufferSubDataOpt(target, offset, data) {
    flushCommand();
    bufferSubData(target, offset, data);
}
function checkFramebufferStatusOpt(target) {
    flushCommand();
    checkFramebufferStatus(target);
}
function clearOpt(mask) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR;
    buffer_data[next_index + 1] = mask;
    next_index += 2;
}
function clearColorOpt(red, green, blue, alpha) {
    if (next_index + 5 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_COLOR;
    buffer_data[next_index + 1] = red;
    buffer_data[next_index + 2] = green;
    buffer_data[next_index + 3] = blue;
    buffer_data[next_index + 4] = alpha;
    next_index += 5;
}
function clearDepthOpt(depth) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_DEPTH;
    buffer_data[next_index + 1] = depth;
    next_index += 2;
}
function clearStencilOpt(s) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CLEAR_STENCIL;
    buffer_data[next_index + 1] = s;
    next_index += 2;
}
function colorMaskOpt(red, green, blue, alpha) {
    if (next_index + 5 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_COLOR_MASK;
    buffer_data[next_index + 1] = red ? 1 : 0;
    buffer_data[next_index + 2] = green ? 1 : 0;
    buffer_data[next_index + 3] = blue ? 1 : 0;
    buffer_data[next_index + 4] = alpha ? 1 : 0;
    next_index += 5;
}
function compileShaderOpt(shader) {
    if (next_index + 2 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_COMPILE_SHADER;
    buffer_data[next_index + 1] = shader;
    next_index += 2;
}
function compressedTexImage2DOpt(target, level, internalformat, width, height, border, data) {
    flushCommand();
    compressedTexImage2D(target, level, internalformat, width, height, border, data);
}
function compressedTexSubImage2DOpt(target, level, xoffset, yoffset, width, height, format, data) {
    flushCommand();
    compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data);
}
function copyTexImage2DOpt(target, level, internalformat, x, y, width, height, border) {
    if (next_index + 9 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_COPY_TEX_IMAGE_2D;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = level;
    buffer_data[next_index + 3] = internalformat;
    buffer_data[next_index + 4] = x;
    buffer_data[next_index + 5] = y;
    buffer_data[next_index + 6] = width;
    buffer_data[next_index + 7] = height;
    buffer_data[next_index + 8] = border;
    next_index += 9;
}
function copyTexSubImage2DOpt(target, level, xoffset, yoffset, x, y, width, height) {
    if (next_index + 9 > total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_COPY_TEX_SUB_IMAGE_2D;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = level;
    buffer_data[next_index + 3] = xoffset;
    buffer_data[next_index + 4] = yoffset;
    buffer_data[next_index + 5] = x;
    buffer_data[next_index + 6] = y;
    buffer_data[next_index + 7] = width;
    buffer_data[next_index + 8] = height;
    next_index += 9;
}
function createBufferOpt() {
    flushCommand();
    return createBuffer();
}
function createFramebufferOpt() {
    flushCommand();
    return createFramebuffer();
}
function createProgramOpt() {
    flushCommand();
    return createProgram();
}
function createRenderbufferOpt() {
    flushCommand();
    return createRenderbuffer();
}
function createShaderOpt(type) {
    flushCommand();
    return createShader(type);
}
function createTextureOpt() {
    flushCommand();
    return createTexture();
}
function cullFaceOpt(mode) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_CULL_FACE;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
}
function deleteBufferOpt(buffer) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_BUFFER;
    buffer_data[next_index + 1] = buffer;
    next_index += 2;
}
function deleteFramebufferOpt(framebuffer) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_FRAME_BUFFER;
    buffer_data[next_index + 1] = framebuffer;
    next_index += 2;
}
function deleteProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_PROGRAM;
    buffer_data[next_index + 1] = program;
    next_index += 2;
}
function deleteRenderbufferOpt(renderbuffer) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_RENDER_BUFFER;
    buffer_data[next_index + 1] = renderbuffer;
    next_index += 2;
}
function deleteShaderOpt(shader) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_SHADER;
    buffer_data[next_index + 1] = shader;
    next_index += 2;
}
function deleteTextureOpt(texture) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DELETE_TEXTURE;
    buffer_data[next_index + 1] = texture;
    next_index += 2;
}
function depthFuncOpt(func) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_FUNC;
    buffer_data[next_index + 1] = func;
    next_index += 2;
}
function depthMaskOpt(flag) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_MASK;
    buffer_data[next_index + 1] = flag ? 1 : 0;
    next_index += 2;
}
function depthRangeOpt(zNear, zFar) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DEPTH_RANGE;
    buffer_data[next_index + 1] = zNear;
    buffer_data[next_index + 1] = zFar;
    next_index += 3;
}
function detachShaderOpt(program, shader) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DETACH_SHADER;
    buffer_data[next_index + 1] = program;
    buffer_data[next_index + 1] = shader;
    next_index += 3;
}
function disableOpt(cap) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DISABLE;
    buffer_data[next_index + 1] = cap;
    next_index += 2;
}
function disableVertexAttribArrayOpt(index) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DISABLE_VERTEX_ATTRIB_ARRAY;
    buffer_data[next_index + 1] = index;
    next_index += 2;
}
function drawArraysOpt(mode, first, count) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DRAW_ARRAYS;
    buffer_data[next_index + 1] = mode;
    buffer_data[next_index + 2] = first;
    buffer_data[next_index + 3] = count;
    next_index += 4;
    if (count > 0) {
        checkFirstFrames();
    }
}
function drawElementsOpt(mode, count, type, offset) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_DRAW_ELEMENTS;
    buffer_data[next_index + 1] = mode;
    buffer_data[next_index + 2] = count;
    buffer_data[next_index + 3] = type;
    buffer_data[next_index + 4] = offset;
    next_index += 5;
    if (count > 0) {
        checkFirstFrames();
    }
}
function enableOpt(cap) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_ENABLE;
    buffer_data[next_index + 1] = cap;
    next_index += 2;
}
function enableVertexAttribArrayOpt(index) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_ENABLE_VERTEX_ATTRIB_ARRAY;
    buffer_data[next_index + 1] = index;
    next_index += 2;
}
function finishOpt() {
    if (next_index + 1 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FINISH;
    next_index += 1;
}
function flushOpt() {
    if (next_index + 1 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FLUSH;
    next_index += 1;
}
function framebufferRenderbufferOpt(target, attachment, renderbuffertarget, renderbuffer) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FRAME_BUFFER_RENDER_BUFFER;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = attachment;
    buffer_data[next_index + 3] = renderbuffertarget;
    buffer_data[next_index + 4] = renderbuffer;
    next_index += 5;
}
function framebufferTexture2DOpt(target, attachment, textarget, texture, level) {
    if (next_index + 6 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FRAME_BUFFER_TEXTURE_2D;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = attachment;
    buffer_data[next_index + 3] = textarget;
    buffer_data[next_index + 4] = texture;
    buffer_data[next_index + 5] = level;
    next_index += 6;
}
function frontFaceOpt(mode) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_FRONT_FACE;
    buffer_data[next_index + 1] = mode;
    next_index += 2;
}
function generateMipmapOpt(target) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_GENERATE_MIPMAP;
    buffer_data[next_index + 1] = target;
    next_index += 2;
}
function getActiveAttribOpt(program, index) {
    flushCommand();
    return getActiveAttrib(program, index);
}
function getActiveUniformOpt(program, index) {
    flushCommand();
    return getActiveUniform(program, index);
}
function getAttachedShadersOpt(program) {
    flushCommand();
    return getAttachedShaders(program);
}
function getAttribLocationOpt(program, name) {
    flushCommand();
    return getAttribLocation(program, name);
}
function getBufferParameterOpt(target, pname) {
    flushCommand();
    return getBufferParameter(target, pname);
}
function getParameterOpt(pname) {
    flushCommand();
    return getParameter(pname);
}
function getErrorOpt() {
    flushCommand();
    return getError();
}
function getFramebufferAttachmentParameterOpt(target, attachment, pname) {
    flushCommand();
    return getFramebufferAttachmentParameter(target, attachment, pname);
}
function getProgramParameterOpt(program, pname) {
    flushCommand();
    return getProgramParameter(program, pname);
}
function getProgramInfoLogOpt(program) {
    flushCommand();
    return getProgramInfoLog(program);
}
function getRenderbufferParameterOpt(target, pname) {
    flushCommand();
    return getRenderbufferParameter(target, pname);
}
function getShaderParameterOpt(shader, pname) {
    flushCommand();
    return getShaderParameter(shader, pname);
}
function getShaderPrecisionFormatOpt(shadertype, precisiontype) {
    flushCommand();
    return getShaderPrecisionFormat(shadertype, precisiontype);
}
function getShaderInfoLogOpt(shader) {
    flushCommand();
    return getShaderInfoLog(shader);
}
function getShaderSourceOpt(shader) {
    flushCommand();
    return getShaderSource(shader);
}
function getTexParameterOpt(target, pname) {
    flushCommand();
    return getTexParameter(target, pname);
}
function getUniformOpt(program, location) {
    flushCommand();
    return getUniform(program, location);
}
function getUniformLocationOpt(program, name) {
    flushCommand();
    return getUniformLocation(program, name);
}
function getVertexAttribOpt(index, pname) {
    flushCommand();
    return getVertexAttrib(index, pname);
}
function getVertexAttribOffsetOpt(index, pname) {
    flushCommand();
    return getVertexAttribOffset(index, pname);
}
function hintOpt(target, mode) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_HINT;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = mode;
    next_index += 3;
}
function isBufferOpt(buffer) {
    flushCommand();
    return isBuffer(buffer);
}
function isEnabledOpt(cap) {
    flushCommand();
    return isEnabled(cap);
}
function isFramebufferOpt(framebuffer) {
    flushCommand();
    return isFramebuffer(framebuffer);
}
function isProgramOpt(program) {
    flushCommand();
    return isProgram(program);
}
function isRenderbufferOpt(renderbuffer) {
    flushCommand();
    return isRenderbuffer(renderbuffer);
}
function isShaderOpt(shader) {
    flushCommand();
    return isShader(shader);
}
function isTextureOpt(texture) {
    flushCommand();
    return isTexture(texture);
}
function lineWidthOpt(width) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_LINE_WIDTH;
    buffer_data[next_index + 1] = width;
    next_index += 2;
}
function linkProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_LINK_PROGRAM;
    buffer_data[next_index + 1] = program;
    next_index += 2;
}
function pixelStoreiOpt(pname, param) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_PIXEL_STOREI;
    buffer_data[next_index + 1] = pname;
    buffer_data[next_index + 2] = param;
    next_index += 3;
}
function polygonOffsetOpt(factor, units) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_POLYGON_OFFSET;
    buffer_data[next_index + 1] = factor;
    buffer_data[next_index + 2] = units;
    next_index += 3;
}
function readPixelsOpt(x, y, width, height, format, type, pixels) {
    flushCommand();
    readPixels(x, y, width, height, format, type, pixels);
}
function renderbufferStorageOpt(target, internalformat, width, height) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_RENDER_BUFFER_STORAGE;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = internalFormat;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
}
function sampleCoverageOpt(value, invert) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_SAMPLE_COVERAGE;
    buffer_data[next_index + 1] = value;
    buffer_data[next_index + 2] = invert ? 1 : 0;
    next_index += 3;
}
function scissorOpt(x, y, width, height) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_SCISSOR;
    buffer_data[next_index + 1] = x;
    buffer_data[next_index + 2] = y;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
}
function shaderSourceOpt(shader, source) {
    flushCommand();
    shaderSource(shader, source);
}
function stencilFuncOpt(func, ref, mask) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_FUNC;
    buffer_data[next_index + 1] = func;
    buffer_data[next_index + 2] = ref;
    buffer_data[next_index + 3] = mask;
    next_index += 4;
}
function stencilFuncSeparateOpt(face, func, ref, mask) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_FUNC_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = func;
    buffer_data[next_index + 3] = ref;
    buffer_data[next_index + 4] = mask;
    next_index += 5;
}
function stencilMaskOpt(mask) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_MASK;
    buffer_data[next_index + 1] = mask;
    next_index += 2;
}
function stencilMaskSeparateOpt(face, mask) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_MASK_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = mask;
    next_index += 3;
}
function stencilOpOpt(fail, zfail, zpass) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_OP;
    buffer_data[next_index + 1] = fail;
    buffer_data[next_index + 2] = zfail;
    buffer_data[next_index + 3] = zpass;
    next_index += 4;
}
function stencilOpSeparateOpt(face, fail, zfail, zpass) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_STENCIL_OP_SEPARATE;
    buffer_data[next_index + 1] = face;
    buffer_data[next_index + 2] = fail;
    buffer_data[next_index + 3] = zfail;
    buffer_data[next_index + 4] = zpass;
    next_index += 5;
}
function texImage2DOpt(target, level, internalformat) {
    flushCommand();
    switch (arguments.length) {
    case 6: {
            var format = arguments[3];
            var type = arguments[4];
            var source = arguments[5];
            if (Object.prototype.hasOwnProperty.call(source, '__nativeObj')) {
                gl.glTexImage2D(target, level, internalformat, format, type, source.__nativeObj);
            } else {
                if (source.bkImage) {
                    gl.glTexImage2D(target, level, internalformat, format, type, source.bkImage);
                } else {
                    gl.glTexImage2D(target, level, internalformat, format, type, source);
                }
            }
            break;
        }
    case 9: {
            var width = arguments[3];
            var height = arguments[4];
            var border = arguments[5];
            var format = arguments[6];
            var type = arguments[7];
            var pixels = arguments[8];
            gl.glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels);
            break;
        }
    }
}
function texParameterfOpt(target, pname, param) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_TEX_PARAMETER_F;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = pname;
    buffer_data[next_index + 3] = param;
    next_index += 4;
}
function texParameteriOpt(target, pname, param) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_TEX_PARAMETER_I;
    buffer_data[next_index + 1] = target;
    buffer_data[next_index + 2] = pname;
    buffer_data[next_index + 3] = param;
    next_index += 4;
}
function texSubImage2DOpt(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    flushCommand();
    texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
}
function texSubImage2DOpt(target, level, xoffset, yoffset, format, type, source) {
    flushCommand();
    texSubImage2D(target, level, xoffset, yoffset, format, type, source);
}
function uniform1fOpt(location, x) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    next_index += 3;
}
function uniform2fOpt(location, x, y) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
}
function uniform3fOpt(location, x, y, z) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
}
function uniform4fOpt(location, x, y, z, w) {
    if (next_index + 6 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4F;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    buffer_data[next_index + 5] = w;
    next_index += 6;
}
function uniform1iOpt(location, x) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    next_index += 3;
}
function uniform2iOpt(location, x, y) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
}
function uniform3iOpt(location, x, y, z) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
}
function uniform4iOpt(location, x, y, z, w) {
    if (next_index + 6 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4I;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    buffer_data[next_index + 5] = w;
    next_index += 6;
}
function uniform1fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform2fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform3fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform4fvOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform1ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_1IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform2ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_2IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform3ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_3IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniform4ivOpt(location, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_4IV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function uniformMatrix2fvOpt(location, transpose, value) {
    if (next_index + 4 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_2FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
}
function uniformMatrix3fvOpt(location, transpose, value) {
    if (next_index + 4 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_3FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
}
function uniformMatrix4fvOpt(location, transpose, value) {
    if (next_index + 4 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_UNIFORM_MATRIX_4FV;
    buffer_data[next_index + 1] = location;
    buffer_data[next_index + 2] = transpose;
    buffer_data[next_index + 3] = value.length;
    buffer_data.set(value, next_index + 4);
    next_index += 4 + value.length;
}
function useProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_USE_PROGRAM;
    buffer_data[next_index + 1] = program;
    next_index += 2;
}
function validateProgramOpt(program) {
    if (next_index + 2 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VALIDATE_PROGRAM;
    buffer_data[next_index + 1] = program;
    next_index += 2;
}
function vertexAttrib1fOpt(index, x) {
    if (next_index + 3 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_1F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    next_index += 3;
}
function vertexAttrib2fOpt(index, x, y) {
    if (next_index + 4 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_2F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    next_index += 4;
}
function vertexAttrib3fOpt(index, x, y, z) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_3F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    next_index += 5;
}
function vertexAttrib4fOpt(index, x, y, z, w) {
    if (next_index + 6 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_4F;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = x;
    buffer_data[next_index + 3] = y;
    buffer_data[next_index + 4] = z;
    buffer_data[next_index + 5] = w;
    next_index += 6;
}
function vertexAttrib1fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_1FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function vertexAttrib2fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_2FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function vertexAttrib3fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_3FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function vertexAttrib4fvOpt(index, value) {
    if (next_index + 3 + value.length >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_4FV;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = value.length;
    buffer_data.set(value, next_index + 3);
    next_index += 3 + value.length;
}
function vertexAttribPointerOpt(index, size, type, normalized, stride, offset) {
    if (next_index + 7 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VERTEX_ATTRIB_POINTER;
    buffer_data[next_index + 1] = index;
    buffer_data[next_index + 2] = size;
    buffer_data[next_index + 3] = type;
    buffer_data[next_index + 4] = normalized ? 1 : 0;
    buffer_data[next_index + 5] = stride;
    buffer_data[next_index + 6] = offset;
    next_index += 7;
}
function viewportOpt(x, y, width, height) {
    if (next_index + 5 >= total_size) {
        flushCommand();
    }
    buffer_data[next_index] = GL_COMMAND_VIEW_PORT;
    buffer_data[next_index + 1] = x;
    buffer_data[next_index + 2] = y;
    buffer_data[next_index + 3] = width;
    buffer_data[next_index + 4] = height;
    next_index += 5;
}
function isSupportTypeArray() {
    if (GameStatusInfo.platform == 'android') {
        return true;
    }
    var info = BK.Director.queryDeviceInfo();
    var vers = info.version.split('.');
    if (info.platform == 'ios' && Number(vers[0]) >= 10) {
        return true;
    }
    return false;
}
function attachMethodOpt() {
    gl.activeTexture = activeTextureOpt;
    gl.attachShader = attachShaderOpt;
    gl.bindAttribLocation = bindAttribLocationOpt;
    gl.bindBuffer = bindBufferOpt;
    gl.bindFramebuffer = bindFramebufferOpt;
    gl.bindRenderbuffer = bindRenderbufferOpt;
    gl.bindTexture = bindTextureOpt;
    gl.blendColor = blendColorOpt;
    gl.blendEquation = blendEquationOpt;
    gl.blendEquationSeparate = blendEquationSeparateOpt;
    gl.blendFunc = blendFuncOpt;
    gl.blendFuncSeparate = blendFuncSeparateOpt;
    gl.bufferData = bufferDataOpt;
    gl.bufferData = bufferDataOpt;
    gl.bufferSubData = bufferSubDataOpt;
    gl.checkFramebufferStatus = checkFramebufferStatusOpt;
    gl.clear = clearOpt;
    gl.clearColor = clearColorOpt;
    gl.clearDepth = clearDepthOpt;
    gl.clearStencil = clearStencilOpt;
    gl.colorMask = colorMaskOpt;
    gl.compileShader = compileShaderOpt;
    gl.compressedTexImage2D = compressedTexImage2DOpt;
    gl.compressedTexSubImage2D = compressedTexSubImage2DOpt;
    gl.copyTexImage2D = copyTexImage2DOpt;
    gl.copyTexSubImage2D = copyTexSubImage2DOpt;
    gl.createBuffer = createBufferOpt;
    gl.createFramebuffer = createFramebufferOpt;
    gl.createProgram = createProgramOpt;
    gl.createRenderbuffer = createRenderbufferOpt;
    gl.createShader = createShaderOpt;
    gl.createTexture = createTextureOpt;
    gl.cullFace = cullFaceOpt;
    gl.deleteBuffer = deleteBufferOpt;
    gl.deleteFramebuffer = deleteFramebufferOpt;
    gl.deleteProgram = deleteProgramOpt;
    gl.deleteRenderbuffer = deleteRenderbufferOpt;
    gl.deleteShader = deleteShaderOpt;
    gl.deleteTexture = deleteTextureOpt;
    gl.depthFunc = depthFuncOpt;
    gl.depthMask = depthMaskOpt;
    gl.depthRange = depthRangeOpt;
    gl.detachShader = detachShaderOpt;
    gl.disable = disableOpt;
    gl.disableVertexAttribArray = disableVertexAttribArrayOpt;
    gl.drawArrays = drawArraysOpt;
    gl.drawElements = drawElementsOpt;
    gl.enable = enableOpt;
    gl.enableVertexAttribArray = enableVertexAttribArrayOpt;
    gl.finish = finishOpt;
    gl.flush = flushOpt;
    gl.framebufferRenderbuffer = framebufferRenderbufferOpt;
    gl.framebufferTexture2D = framebufferTexture2DOpt;
    gl.frontFace = frontFaceOpt;
    gl.generateMipmap = generateMipmapOpt;
    gl.getActiveAttrib = getActiveAttribOpt;
    gl.getActiveUniform = getActiveUniformOpt;
    gl.getAttachedShaders = getAttachedShadersOpt;
    gl.getAttribLocation = getAttribLocationOpt;
    gl.getBufferParameter = getBufferParameterOpt;
    gl.getParameter = getParameterOpt;
    gl.getError = getErrorOpt;
    gl.getFramebufferAttachmentParameter = getFramebufferAttachmentParameterOpt;
    gl.getProgramParameter = getProgramParameterOpt;
    gl.getProgramInfoLog = getProgramInfoLogOpt;
    gl.getRenderbufferParameter = getRenderbufferParameterOpt;
    gl.getShaderParameter = getShaderParameterOpt;
    gl.getShaderPrecisionFormat = getShaderPrecisionFormatOpt;
    gl.getShaderInfoLog = getShaderInfoLogOpt;
    gl.getShaderSource = getShaderSourceOpt;
    gl.getTexParameter = getTexParameterOpt;
    gl.getUniform = getUniformOpt;
    gl.getUniformLocation = getUniformLocationOpt;
    gl.getVertexAttrib = getVertexAttribOpt;
    gl.getVertexAttribOffset = getVertexAttribOffsetOpt;
    gl.hint = hintOpt;
    gl.isBuffer = isBufferOpt;
    gl.isEnabled = isEnabledOpt;
    gl.isFramebuffer = isFramebufferOpt;
    gl.isProgram = isProgramOpt;
    gl.isRenderbuffer = isRenderbufferOpt;
    gl.isShader = isShaderOpt;
    gl.isTexture = isTextureOpt;
    gl.lineWidth = lineWidthOpt;
    gl.linkProgram = linkProgramOpt;
    gl.pixelStorei = pixelStoreiOpt;
    gl.polygonOffset = polygonOffsetOpt;
    gl.readPixels = readPixelsOpt;
    gl.renderbufferStorage = renderbufferStorageOpt;
    gl.sampleCoverage = sampleCoverageOpt;
    gl.scissor = scissorOpt;
    gl.shaderSource = shaderSourceOpt;
    gl.stencilFunc = stencilFuncOpt;
    gl.stencilFuncSeparate = stencilFuncSeparateOpt;
    gl.stencilMask = stencilMaskOpt;
    gl.stencilMaskSeparate = stencilMaskSeparateOpt;
    gl.stencilOp = stencilOpOpt;
    gl.stencilOpSeparate = stencilOpSeparateOpt;
    gl.texImage2D = texImage2DOpt;
    gl.texImage2D = texImage2DOpt;
    gl.texParameterf = texParameterfOpt;
    gl.texParameteri = texParameteriOpt;
    gl.texSubImage2D = texSubImage2DOpt;
    gl.texSubImage2D = texSubImage2DOpt;
    gl.uniform1f = uniform1fOpt;
    gl.uniform2f = uniform2fOpt;
    gl.uniform3f = uniform3fOpt;
    gl.uniform4f = uniform4fOpt;
    gl.uniform1i = uniform1iOpt;
    gl.uniform2i = uniform2iOpt;
    gl.uniform3i = uniform3iOpt;
    gl.uniform4i = uniform4iOpt;
    gl.uniform1fv = uniform1fvOpt;
    gl.uniform2fv = uniform2fvOpt;
    gl.uniform3fv = uniform3fvOpt;
    gl.uniform4fv = uniform4fvOpt;
    gl.uniform1iv = uniform1ivOpt;
    gl.uniform2iv = uniform2ivOpt;
    gl.uniform3iv = uniform3ivOpt;
    gl.uniform4iv = uniform4ivOpt;
    gl.uniformMatrix2fv = uniformMatrix2fvOpt;
    gl.uniformMatrix3fv = uniformMatrix3fvOpt;
    gl.uniformMatrix4fv = uniformMatrix4fvOpt;
    gl.useProgram = useProgramOpt;
    gl.validateProgram = validateProgramOpt;
    gl.vertexAttrib1f = vertexAttrib1fOpt;
    gl.vertexAttrib2f = vertexAttrib2fOpt;
    gl.vertexAttrib3f = vertexAttrib3fOpt;
    gl.vertexAttrib4f = vertexAttrib4fOpt;
    gl.vertexAttrib1fv = vertexAttrib1fvOpt;
    gl.vertexAttrib2fv = vertexAttrib2fvOpt;
    gl.vertexAttrib3fv = vertexAttrib3fvOpt;
    gl.vertexAttrib4fv = vertexAttrib4fvOpt;
    gl.vertexAttribPointer = vertexAttribPointerOpt;
    gl.viewport = viewportOpt;
    gl.glCommit = glCommitOpt;
}
(function (global, factory) {
    if (typeof global === 'object') {
        global.MQQ.Webview.openTransparent = factory().openTransparent;
        global.MQQ.Webview.closeTransparent = factory().closeTransparent;
        global.MQQ.Webview.onMessageHandle = factory().onMessageHandle;
    }
}(BK, function () {
    function openTransparent(url, gameOrientation, callback) {
        if (gameOrientation === void 0) {
            gameOrientation = 1;
        }
        var cmd = 'cs.openWebViewWithoutUrl.local';
        var data = {
            'url': url,
            'gameOrientation': gameOrientation,
            'businessType': 2
        };
        if (GameStatusInfo.devPlatform) {
            BK.Script.log(0, 0, 'BK.MQQ.Webview.openTransparent rely QQ.Call Failed!');
        }
        if (callback) {
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        }
        BK.MQQ.SsoRequest.send(data, cmd);
    }
    function closeTransparent(taskId) {
        var data = { 'taskId': taskId };
        var cmd = 'cs.closeWebview.local';
        BK.MQQ.SsoRequest.send(data, cmd);
    }
    function onMessageHandle(callback) {
        var webviewMsgCBCmd = 'sc.web_callback_game.local';
        BK.MQQ.SsoRequest.addListener(webviewMsgCBCmd, null, function (errCode, cmd, data) {
            if (callback) {
                callback(cmd, data);
            }
        });
    }
    ;
    var ret = {
        openTransparent: openTransparent,
        closeTransparent: closeTransparent,
        onMessageHandle: onMessageHandle
    };
    return ret;
}));
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Audio = factory();
    }
}(BK, function () {
    var __nativeAudio = BK.Audio;
    var Audio = function () {
        function Audio(type, path, loop) {
            this.__nativeObj = new __nativeAudio(type, path, loop);
            this.type = type;
            this.path = path;
            this.loopCount = loop;
        }
        Audio.pauseAllBackground = function () {
            if (this.playingBackgrounds) {
                for (var index = 0; index < this.playingBackgrounds.length; index++) {
                    var tmp = this.playingBackgrounds[index];
                    if (typeof tmp.music != 'string') {
                        tmp.music.pauseMusic();
                    } else {
                    }
                }
            }
        };
        Audio.resumeAllBackground = function () {
            if (this.playingBackgrounds) {
                for (var index = 0; index < this.playingBackgrounds.length; index++) {
                    var tmp = this.playingBackgrounds[index];
                    if (typeof tmp.music != 'string') {
                        tmp.music.resumeMusic();
                        BK.Script.log(1, 1, ' music.resumeMusic not string');
                    } else {
                        BK.Script.log(1, 1, ' music.resumeMusic ' + typeof tmp.music);
                        __nativeAudio.playMusic(tmp.type, tmp.music, tmp.loop);
                    }
                }
            }
        };
        Audio.removeBackgrounFromArray = function (music) {
            if (this.playingBackgrounds) {
                var removeIdx = -1;
                for (var index = 0; index < Audio.playingBackgrounds.length; index++) {
                    var tmp = Audio.playingBackgrounds[index];
                    if (music == tmp.music) {
                        removeIdx == index;
                    }
                }
                if (removeIdx > -1) {
                    Audio.playingBackgrounds.splice(removeIdx);
                }
            }
        };
        Audio.addBackgroundToArray = function (music, type, loop) {
            var musicObj = {
                music: music,
                type: type,
                loop: loop
            };
            if (typeof this.playingBackgrounds == 'undefined') {
                this.playingBackgrounds = [];
            }
            var hasMusic = -1;
            for (var index = 0; index < Audio.playingBackgrounds.length; index++) {
                var tmp = Audio.playingBackgrounds[index];
                if (music == tmp.music) {
                    hasMusic == index;
                }
            }
            if (hasMusic == -1) {
                this.playingBackgrounds.push(musicObj);
            }
        };
        Audio.playMusic = function (type, path, loop) {
            if (type == 0) {
                Audio.addBackgroundToArray(path, type, loop);
            }
            __nativeAudio.playMusic(type, path, loop);
        };
        Audio.prototype.startMusic = function (callback) {
            if (GameStatusInfo.platform === 'ios' && GameStatusInfo.QQVer.indexOf('7.5.8') > -1) {
                __nativeAudio.playMusic(this.type, this.path, this.loopCount);
            } else {
                if (callback != null && callback != undefined) {
                    this.__nativeObj.startMusic(callback);
                } else {
                    this.__nativeObj.startMusic();
                }
                Audio.addBackgroundToArray(this.__nativeObj, this.type, this.loopCount);
            }
        };
        Audio.prototype.pauseMusic = function () {
            if (GameStatusInfo.platform === 'ios' && GameStatusInfo.QQVer.indexOf('7.5.8') > -1) {
                return;
            }
            this.__nativeObj.pauseMusic();
            if (this.type == 0) {
                Audio.removeBackgrounFromArray(this.__nativeObj);
            }
        };
        Audio.prototype.resumeMusic = function () {
            if (GameStatusInfo.platform === 'ios' && GameStatusInfo.QQVer.indexOf('7.5.8') > -1) {
                return;
            }
            this.__nativeObj.resumeMusic();
            if (this.type == 0) {
                Audio.addBackgroundToArray(this.__nativeObj, this.type, this.loopCount);
            }
        };
        Audio.prototype.stopMusic = function () {
            if (GameStatusInfo.platform === 'ios' && GameStatusInfo.QQVer.indexOf('7.5.8') > -1) {
                return;
            }
            if (this.type == 0) {
                Audio.removeBackgrounFromArray(this.__nativeObj);
            }
            this.__nativeObj.stopMusic();
        };
        return Audio;
    }();
    Object.defineProperty(Audio, 'switch', {
        get: function () {
            return __nativeAudio.switch;
        },
        set: function (value) {
            __nativeAudio.switch = value;
        },
        enumerable: true,
        configurable: true
    });
    return Audio;
}));
if (BK.MQQ && BK.MQQ.Account) {
    var headCacheDir_1 = 'GameSandBox://_head/';
    if (!BK.FileUtil.isFileExist(headCacheDir_1)) {
        BK.FileUtil.makeDir(headCacheDir_1);
    }
    if (!BK.MQQ.Account.getHeadEx) {
        BK.MQQ.Account.getHeadEx = function (openId, callback) {
            BK.MQQ.Account.getHead(openId, function (_openId, headInfo) {
                if (!headInfo || !headInfo.buffer || !headInfo.width || !headInfo.height) {
                    callback(openId, '');
                } else {
                    if (BK.Image.saveImage) {
                        BK.Image.saveImage(headInfo.buffer, headInfo.width, headInfo.height, headCacheDir_1 + _openId, 'jpg');
                        callback(_openId, headCacheDir_1 + _openId + '.jpg');
                    } else {
                        var texture_1 = new BK.Texture(headInfo.buffer, headInfo.width, headInfo.height);
                        var spriteNode = new BK.Sprite(headInfo.width, headInfo.height, texture_1, 0, 0, 1, 1);
                        var renderTexture = new BK.RenderTexture(headInfo.width, headInfo.height);
                        BK.Render.renderToTexture(spriteNode.__nativeObj ? spriteNode.__nativeObj : spriteNode, renderTexture);
                        renderTexture.saveTo(headCacheDir_1 + _openId);
                        callback(openId, headCacheDir_1 + _openId);
                    }
                }
            });
        };
    }
}
if (!BK.Misc.compQQVersion) {
    BK.Misc.compQQVersion = function (a, b) {
        var aa = a.split('.');
        var bb = b.split('.');
        var nn = Math.min(3, Math.min(aa.length, bb.length));
        for (var i = 0; i < nn; i++) {
            if (aa[i] == bb[i])
                continue;
            if (aa[i] < bb[i])
                return true;
            return false;
        }
        return true;
    };
}
(function (global, factory) {
    if (typeof global === 'object') {
        global.TouchEventDispatch = factory().TouchEventDispatch;
    }
}(BK, function () {
    var oldGetAllTouchEvent = BK.TouchEvent.getAllTouchEvent;
    var oldGetTouchEvent = BK.TouchEvent.getTouchEvent;
    var oldUpdateTouchStatus = BK.TouchEvent.updateTouchStatus;
    var TouchEventDispatch = function () {
        function TouchEventDispatch() {
        }
        TouchEventDispatch.listenAllTouch = function (obj, callback) {
            if (typeof this.listenerInfos == 'undefined') {
                this.listenerInfos = [];
            }
            var info = {
                obj: obj,
                callback: callback
            };
            this.listenerInfos.push(info);
        };
        TouchEventDispatch.remove = function (obj) {
            var removeIndex = -1;
            for (var index = 0; index < len; index++) {
                var listenerInfo = this.listenerInfos[index];
                if (listenerInfo['obj'] == obj) {
                    removeIndex = index;
                }
            }
            if (removeIndex != -1) {
                this.listenerInfos.splice(removeIndex, 1);
            }
        };
        TouchEventDispatch.dispatch = function (touches) {
            if (touches) {
                this.listenerInfos.forEach(function (element) {
                    element.callback(touches);
                });
            }
        };
        TouchEventDispatch.getTouchEvent = function () {
            var touch = oldGetTouchEvent();
            if (touch) {
                this.dispatch([touch]);
            }
            return touch;
        };
        TouchEventDispatch.getAllTouchEvent = function () {
            var touches = oldGetAllTouchEvent();
            if (touches) {
                this.dispatch(touches);
            }
            return touches;
        };
        TouchEventDispatch.updateTouchStatus = function () {
            oldUpdateTouchStatus();
        };
        return TouchEventDispatch;
    }();
    TouchEventDispatch.listenerInfos = [];
    return { TouchEventDispatch: TouchEventDispatch };
}));
(function (global, factory) {
    global.TouchEvent = factory();
}(BK, function () {
    var TouchEvent = function () {
        function TouchEvent() {
        }
        TouchEvent.getTouchEvent = function () {
            return BK.TouchEventDispatch.getTouchEvent();
        };
        TouchEvent.getAllTouchEvent = function () {
            return BK.TouchEventDispatch.getAllTouchEvent();
        };
        TouchEvent.updateTouchStatus = function () {
            BK.TouchEventDispatch.updateTouchStatus();
        };
        return TouchEvent;
    }();
    return TouchEvent;
}));
(function (global, factory) {
    BK.Notification = new BK.Emitter();
    var oldTickerCallback = global._tickerCallback_;
    function _tickerCallback_(ts, dt) {
        try {
            oldTickerCallback(ts, dt);
        } catch (e) {
        }
        BK.Notification.emitAll('frame_final', {});
    }
    global._tickerCallback_ = _tickerCallback_;
}(this, function () {
}));
(function (global, BK) {
    var __errorObserver = undefined;
    BK.Script.setErrorObserver = function (observer) {
        __errorObserver = observer;
    };
    global._globalErrorCallback_ = function (exception) {
        __errorObserver && __errorObserver(exception.message, exception.stack);
    };
}(this, BK));
(function (global, BK) {
    if (BK && BK.Image && !BK.Image.loadImageWithBase64) {
        BK.Image.loadImageWithBase64 = function (buffer) {
            if (!buffer) {
                BK.Script.log(1, 0, 'buffer is empty');
                return undefined;
            }
            var decodeString = BK.Misc.decodeBase64FromString(buffer);
            return BK.Image.loadImage(decodeString);
        };
    }
}(this, BK));
(function (global, factory) {
    if (BK.Notification) {
        var CMSHOW_CS_CMD_CLOSE_WND = 'cs.close_room.local';
        var CMSHOW_CS_CMD_SHARE_INFO = 'cs.game_shell_share_callback.local';
        var CMSHOW_SC_CMD_SHELL_PACK_UP = 'sc.game_shell_pack_up.local';
        var CMSHOW_SC_CMD_SHELL_SHARE = 'sc.game_shell_share.local';
        var CMSHOW_SC_CMD_SHELL_SHARE_COMPLETE = 'sc.share_game_to_friend_result.local';
        var CMSHOW_SC_CMD_SHELL_CLOSE = 'sc.game_shell_close.local';
        var CMD_CMSHOW_GAME_ENTER_BACKGROUND = 'sc.game_enter_background.local';
        var CMD_CMSHOW_GAME_ENTER_FORGROUND = 'sc.game_enter_foreground.local';
        var CMD_CMSHOW_GAME_MAXIMIZE = 'sc.game_maximize.local';
        var CMD_CMSHOW_GAME_MINIMIZE = 'sc.game_minimize.local';
        var CMD_CMSHOW_GAME_NETWORK_CHANGE = 'sc.network_change.local';
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_BACKGROUND, null, function () {
            BK.Notification.emitAll('game_enter_background', {});
        }.bind(this));
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_FORGROUND, null, function () {
            BK.Notification.emitAll('game_enter_foreground', {});
        }.bind(this));
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MAXIMIZE, null, function () {
            BK.Notification.emitAll('game_maximize', {});
        }.bind(this));
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MINIMIZE, null, function () {
            BK.Notification.emitAll('game_minimize', {});
        }.bind(this));
        BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_SHELL_PACK_UP, null, function () {
            BK.Notification.emitAll('game_pack_up', {});
        }.bind(this));
        BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_SHELL_CLOSE, null, function () {
            BK.Notification.emitAll('game_close', {});
        }.bind(this));
        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_NETWORK_CHANGE, null, function (errCode, cmd, data) {
            if (typeof data.type == 'undefined') {
                BK.Script.log(1, 1, 'net work change .data is worng!');
            } else {
                BK.Notification.emitAll('game_network_change', data.type);
            }
        }.bind(this));
    }
}(this, function () {
}));
(function (global, factory) {
    global.Crypt = factory();
}(BK, function () {
    function crypt() {
        this.hexcase = 0;
        this.b64pad = '';
        this.chrsz = 8;
    }
    crypt.prototype.hex_md5 = function (s) {
        return this.bin2hex(this.core_md5(this.str2bin(s), s.length * this.chrsz));
    };
    crypt.prototype.b64_md5 = function (s) {
        return this.bin2b64(this.core_md5(this.str2bin(s), s.length * this.chrsz));
    };
    crypt.prototype.str_md5 = function (s) {
        return this.bin2str(this.core_md5(this.str2bin(s), s.length * this.chrsz));
    };
    crypt.prototype.hex_hmac_md5 = function (key, data) {
        return this.bin2hex(this.core_hmac_md5(key, data));
    };
    crypt.prototype.b64_hmac_md5 = function (key, data) {
        return this.bin2b64(this.core_hmac_md5(key, data));
    };
    crypt.prototype.str_hmac_md5 = function (key, data) {
        return this.bin2str(this.core_hmac_md5(key, data));
    };
    crypt.prototype.md5_vm_test = function () {
        return this.hex_md5('abc') == '900150983cd24fb0d6963f7d28e17f72';
    };
    crypt.prototype.core_md5 = function (x, len) {
        x[len >> 5] |= 128 << len % 32;
        x[(len + 64 >>> 9 << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return Array(a, b, c, d);
    };
    crypt.prototype.md5_cmn = function (q, a, b, x, s, t) {
        return this.safe_add(this.rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    };
    crypt.prototype.md5_ff = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b & c | ~b & d, a, b, x, s, t);
    };
    crypt.prototype.md5_gg = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b & d | c & ~d, a, b, x, s, t);
    };
    crypt.prototype.md5_hh = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };
    crypt.prototype.md5_ii = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | ~d), a, b, x, s, t);
    };
    crypt.prototype.core_hmac_md5 = function (key, data) {
        var bkey = this.str2bin(key);
        if (bkey.length > 16)
            bkey = this.core_md5(bkey, key.length * this.chrsz);
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 909522486;
            opad[i] = bkey[i] ^ 1549556828;
        }
        var hash = this.core_md5(ipad.concat(this.str2bin(data)), 512 + data.length * this.chrsz);
        return this.core_md5(opad.concat(hash), 512 + 128);
    };
    crypt.prototype.hex_sha1 = function (s) {
        return this.bin2hex(this.core_sha1(this.str2bin(s), s.length * this.chrsz));
    };
    crypt.prototype.b64_sha1 = function (s) {
        return this.bin2b64(this.core_sha1(this.str2bin(s), s.length * this.chrsz));
    };
    crypt.prototype.str_sha1 = function (s) {
        return this.bin2str(this.core_sha1(this.str2bin(s), s.length * this.chrsz));
    };
    crypt.prototype.hex_hmac_sha1 = function (key, data) {
        return this.bin2hex(this.core_hmac_sha1(key, data));
    };
    crypt.prototype.b64_hmac_sha1 = function (key, data) {
        return this.bin2b64(this.core_hmac_sha1(key, data));
    };
    crypt.prototype.str_hmac_sha1 = function (key, data) {
        return this.bin2str(this.core_hmac_sha1(key, data));
    };
    crypt.prototype.sha1_vm_test = function () {
        return this.hex_sha1('abc') == 'a9993e364706816aba3e25717850c26c9cd0d89d';
    };
    crypt.prototype.core_sha1 = function (x, len) {
        x[len >> 5] |= 128 << 24 - len % 32;
        x[(len + 64 >> 9 << 4) + 15] = len;
        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;
            for (var j = 0; j < 80; j++) {
                if (j < 16)
                    w[j] = x[i + j];
                else
                    w[j] = this.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                var t = this.safe_add(this.safe_add(this.rol(a, 5), this.sha1_ft(j, b, c, d)), this.safe_add(this.safe_add(e, w[j]), this.sha1_kt(j)));
                e = d;
                d = c;
                c = this.rol(b, 30);
                b = a;
                a = t;
            }
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
            e = this.safe_add(e, olde);
        }
        return Array(a, b, c, d, e);
    };
    crypt.prototype.sha1_ft = function (t, b, c, d) {
        if (t < 20)
            return b & c | ~b & d;
        if (t < 40)
            return b ^ c ^ d;
        if (t < 60)
            return b & c | b & d | c & d;
        return b ^ c ^ d;
    };
    crypt.prototype.sha1_kt = function (t) {
        return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
    };
    crypt.prototype.core_hmac_sha1 = function (key, data) {
        var bkey = this.str2bin(key);
        if (bkey.length > 16)
            bkey = this.core_sha1(bkey, key.length * this.chrsz);
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 909522486;
            opad[i] = bkey[i] ^ 1549556828;
        }
        var hash = this.core_sha1(ipad.concat(this.str2bin(data)), 512 + data.length * this.chrsz);
        return this.core_sha1(opad.concat(hash), 512 + 160);
    };
    crypt.prototype.safe_add = function (x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 65535;
    };
    crypt.prototype.rol = function (num, cnt) {
        return num << cnt | num >>> 32 - cnt;
    };
    crypt.prototype.str2bin = function (str) {
        var bin = Array();
        var mask = (1 << this.chrsz) - 1;
        for (var i = 0; i < str.length * this.chrsz; i += this.chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << 24 - i % 32;
        return bin;
    };
    crypt.prototype.bin2str = function (bin) {
        var str = '';
        var mask = (1 << this.chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += this.chrsz)
            str += String.fromCharCode(bin[i >> 5] >>> 24 - i % 32 & mask);
        return str;
    };
    crypt.prototype.bin2hex = function (binarray) {
        var hex_tab = this.hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
        var str = '';
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 & 15);
        }
        return str;
    };
    crypt.prototype.bin2b64 = function (binarray) {
        var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var str = '';
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (binarray[i >> 2] >> 8 * (3 - i % 4) & 255) << 16 | (binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4) & 255) << 8 | binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4) & 255;
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32)
                    str += this.b64pad;
                else
                    str += tab.charAt(triplet >> 6 * (3 - j) & 63);
            }
        }
        return str;
    };
    return new crypt();
}));
(function (global, factory) {
    global.FileUtil.upload = factory();
}(BK, function () {
    function upload(buff, extInfo, callback) {
        var buffLength = buff.length > 1024 ? 1024 : buff.length;
        var uint8Array = new Uint8Array(buffLength);
        for (var i = 0; i < buffLength; i++) {
            uint8Array[i] = buff.readUint8Buffer();
        }
        buff.rewind();
        var date = new Date();
        var time = date.getFullYear() + (date.getMonth() + 1 < 10 ? 0 + (date.getMonth() + 1) : date.getMonth() + 1) + date.getDate();
        var signTime = extInfo.signTime;
        var tmpSecretId = extInfo.tmpSecretId;
        var sessionToken = extInfo.sessionToken;
        var uri = '/' + GameStatusInfo.gameId + '_' + BK.Crypt.bin2hex(BK.Crypt.core_md5(uint8Array, buffLength)) + GameStatusInfo.gameId + '_' + time + '.png';
        var uploadUrl = extInfo.upLoadPrefUrl.replace(new RegExp('http://', 'gm'), '');
        var downloadUrl = extInfo.downloadUrl;
        var signAlgorithm = 'sha1';
        var headerList = 'host;x-cos-storage-class';
        var signKey = extInfo.signature;
        var formatString = 'put' + '\n' + uri + '\n\nhost=' + uploadUrl + '&x-cos-storage-class=nearline\n';
        var stringToSign = signAlgorithm + '\n' + signTime + '\n' + BK.Crypt.hex_sha1(formatString) + '\n';
        var signature = BK.Crypt.hex_hmac_sha1(signKey, stringToSign);
        var authorization = 'q-sign-algorithm=' + signAlgorithm + '&q-ak=' + tmpSecretId + '&q-sign-time=' + signTime + '&q-key-time=' + signTime + '&q-header-list=' + headerList + '&q-url-param-list=' + '' + '&q-signature=' + signature;
        function onResponse(res, code) {
            callback(code, downloadUrl + uri);
        }
        var httpRequest = new BK.HttpUtil('https://' + uploadUrl + uri);
        httpRequest.setHttpMethod('put');
        httpRequest.setHttpHeader('host', uploadUrl);
        httpRequest.setHttpHeader('x-cos-storage-class', 'nearline');
        httpRequest.setHttpHeader('x-cos-security-token', sessionToken);
        httpRequest.setHttpHeader('authorization', authorization);
        httpRequest.setBodyCompatible(false);
        httpRequest.setHttpRawBody(buff);
        httpRequest.requestAsync(onResponse);
    }
    BK.FileUtil.uploadFromFile = function (path, callback) {
        var buff = BK.FileUtil.readFile(path);
        if (buff && buff.length > 0) {
            BK.FileUtil.uploadFromBuff(buff, callback);
        } else {
            BK.Script.log(1, 1, 'uploadFromFile failed.file is empty!');
            callback(-1, '');
        }
    };
    BK.FileUtil.uploadFromBuff = function (buff, callback) {
        BK.QQ.queryCloudSignature(function (errCode, data) {
            upload(buff, data, callback);
        });
    };
    BK.FileUtil.uploadFromNode = function (node, callback) {
        var shot = new BK.RenderTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
        BK.Render.renderToTexture(node, shot);
        shot.writeToDiskWithXY('GameSandBox://temp.png', node.position.x, node.position.y, node.contentSize.width, node.contentSize.height);
        var buff = BK.FileUtil.readFile('GameSandBox://temp.png');
        BK.QQ.queryCloudSignature(function (errCode, data) {
            upload(buff, data, callback);
        });
    };
    BK.FileUtil.uploadNode = function (node, x, y, width, height, callback) {
        var shot = new BK.RenderTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
        BK.Render.renderToTexture(node, shot);
        shot.writeToDiskWithXY('GameSandBox://temp.png', x, y, width, height);
        var buff = BK.FileUtil.readFile('GameSandBox://temp.png');
        BK.QQ.queryCloudSignature(function (errCode, data) {
            upload(buff, data, callback);
        });
    };
    return upload;
}));
BK.QQ.shareToArkFromFile = function (roomId, summary, extendInfo, path) {
    BK.FileUtil.uploadFromFile(path, function (ret, url) {
        BK.QQ.shareToArk(roomId, summary, url, true, extendInfo);
    });
};
BK.QQ.shareToArkFromBuff = function (roomId, summary, extendInfo, buff) {
    BK.FileUtil.uploadFromBuff(buff, function (ret, url) {
        if (ret == 200) {
            BK.QQ.shareToArk(roomId, summary, url, true, extendInfo);
        }
    });
};
BK.QQ.shareToArkFromNode = function (roomId, summary, extendInfo, node) {
    BK.FileUtil.uploadFromNode(node, function (ret, url) {
        if (ret == 200) {
            BK.QQ.shareToArk(roomId, summary, url, true, extendInfo);
        }
    });
};
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.UIEventHandler = factory();
    }
}(this, function () {
    var UIEventHandler = null;
    var UI_NODE_ENENT_TOUCH_DOWN = 1000;
    var UI_NODE_ENENT_TOUCH_UP = 1001;
    var UI_NODE_ENENT_TOUCH_DOWN_INSIDE = 1002;
    var UI_NODE_ENENT_TOUCH_UP_INSIDE = 1003;
    var UI_NODE_ENENT_TOUCH_BEGIN = 1;
    var UI_NODE_ENENT_TOUCH_MOVED = 2;
    var UI_NODE_ENENT_TOUCH_END = 3;
    function TouchEventHandler() {
        this.eveFuncTb = [];
        this._eventMap = {
            1: [],
            2: [],
            3: []
        };
        this.rootNode = BK.Director.root;
        this.nodeTreeHittest = function (node, pt) {
            if (node.canUserInteract == true && node.hidden == false) {
                if (node.children) {
                    var children = node.children;
                    for (var index = children.length - 1; index >= 0; index--) {
                        var child = children[index];
                        var hitNode = this.nodeTreeHittest(child, pt);
                        if (hitNode != undefined) {
                            return hitNode;
                        }
                    }
                }
                var hit = node.hittest(pt);
                if (hit == true) {
                    return node;
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        };
        this.treeHittest = function (pt) {
            return this.nodeTreeHittest(this.rootNode, pt);
        };
        this.setRootNode = function (node) {
            this.rootNode = node;
        };
        this.addNodeEvent = function (node, event, callbackFunc) {
            var eveFuncObj = {};
            eveFuncObj['obj'] = node;
            eveFuncObj['func'] = callbackFunc;
            var hasSame = false;
            for (var i = 0; i < this._eventMap[event].length; i++) {
                var eFO = this._eventMap[event][i];
                if (eFO['obj'] == node) {
                    hasSame = true;
                }
            }
            if (hasSame == false) {
                this._eventMap[event].push(eveFuncObj);
            } else {
                BK.Script.log(1, 0, 'Add Same Node Event has added Event Before.');
            }
        };
        this.removeNodeEvent = function (node, event) {
            var removeIdx = -1;
            for (var i = 0; i < this._eventMap[event].length; i++) {
                var eFO = this._eventMap[event][i];
                if (eFO['obj'] == node) {
                    removeIdx = i;
                }
            }
            if (removeIdx >= 0) {
                this._eventMap[event].splice(removeIdx, 1);
                BK.Script.log(1, 0, 'Remove Node Event Succeed!');
            }
        };
        this.triggerEvent = function (node, event, x, y) {
            for (var i = 0; i < this._eventMap[event].length; i++) {
                var eFO = this._eventMap[event][i];
                if (node && eFO['obj'] == node) {
                    var func = eFO['func'];
                    if (func) {
                        func(node, event, x, y);
                    } else {
                    }
                }
            }
        };
        this.triggerAllNodeEvent = function (event) {
            for (var i = 0; i < this._eventMap[event].length; i++) {
                var eFO = this._eventMap[event][i];
                var func = eFO['func'];
                var node = eFO['obj'];
                if (func) {
                    func(node, event);
                }
            }
        };
        this.isFirstTouchDown = -1;
        this.currentNode = undefined;
        this.touchUpdate = function (touchAllTouch) {
            if (touchAllTouch == undefined) {
                return;
            }
            for (var index_1 = 0; index_1 < touchAllTouch.length; index_1++) {
                var touchArr = touchAllTouch[index_1];
                for (var i = 0; i < touchArr.length; i++) {
                    var x = touchArr[i].x;
                    var y = touchArr[i].y;
                    if (touchArr[i].status == 2) {
                        if (this.isFirstTouchDown == -1) {
                            this.isFirstTouchDown = touchArr[i].id;
                            var node = this.treeHittest({
                                x: x,
                                y: y
                            });
                            if (node) {
                                this.currentNode = node;
                                this.triggerEvent(this.currentNode, UI_NODE_ENENT_TOUCH_BEGIN, x, y);
                            } else {
                                this.currentNode = undefined;
                            }
                        } else {
                            BK.Script.log(0, 0, 'detectGesture begin not first id:' + touchArr[i].id + ' x:' + x + ' y:' + y);
                        }
                    } else if (touchArr[i].status == 3) {
                        if (this.isFirstTouchDown != -1 && touchArr[i].id == this.isFirstTouchDown) {
                            if (this.currentNode) {
                                this.triggerEvent(this.currentNode, UI_NODE_ENENT_TOUCH_MOVED, x, y);
                            }
                        } else {
                            BK.Script.log(0, 0, 'detectGesture moved! Failed touchArr[i].id = ' + touchArr[i].id);
                        }
                    } else if (touchArr[i].status == 1) {
                        if (this.isFirstTouchDown != -1 && touchArr[i].id == this.isFirstTouchDown) {
                            this.isFirstTouchDown = -1;
                            if (this.currentNode) {
                                this.triggerEvent(this.currentNode, UI_NODE_ENENT_TOUCH_END, x, y);
                                this.currentNode = undefined;
                            }
                        } else {
                            BK.Script.log(0, 0, 'detectGesture end!!!Failed!!! touchArr[i].id= ' + touchArr[i].id + ' this.isFirstTouchDown:' + this.isFirstTouchDown);
                        }
                    }
                }
            }
        };
        this.detectGesture = function () {
            var touchAllTouch = BK.TouchEvent.getAllTouchEvent();
            this.touchUpdate(touchAllTouch);
            BK.TouchEvent.updateTouchStatus();
        };
        if (typeof BK.TouchEventDispatch == 'function') {
            BK.TouchEventDispatch.listenAllTouch(this, this.touchUpdate.bind(this));
        } else {
            BK.Director.ticker.add(function (ts, du) {
                if (this) {
                    this.detectGesture();
                }
            }.bind(this));
        }
    }
    ;
    return new TouchEventHandler();
}));
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Button = factory();
    }
}(BK, function () {
    function Button(width, height, texturePath, callback) {
        var UI_NODE_ENENT_TOUCH_BEGIN = 1;
        var UI_NODE_ENENT_TOUCH_MOVED = 2;
        var UI_NODE_ENENT_TOUCH_END = 3;
        var u = 0;
        var v = 1;
        var strechX = 1;
        var strechY = 1;
        this.touchStatus = 0;
        this.normalTexture = undefined;
        this.pressTexture = undefined;
        this.disableTexture = undefined;
        this.normalTextureOffset = {
            frame: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            },
            rotated: false
        };
        this.pressTextureOffset = {
            frame: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            },
            rotated: false
        };
        this.disableTextureOffset = {
            frame: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            },
            rotated: false
        };
        this.touchInsideCallback = undefined;
        if (texturePath) {
            this.normalTexture = new BK.Texture(texturePath);
            if (this.normalTexture) {
                this.normalTextureOffset.frame.x = 0;
                this.normalTextureOffset.frame.y = 0;
                this.normalTextureOffset.frame.w = this.normalTexture.size.width;
                this.normalTextureOffset.frame.h = this.normalTexture.size.height;
                this.normalTextureOffset.rotated = false;
            }
        } else {
            this.normalTexture = {};
        }
        if (callback) {
            this.touchInsideCallback = callback;
        }
        this.__nativeObj = new BK.SpriteNode(width, height, this.normalTexture, u, v, strechX, strechY);
        var names = Object.getOwnPropertyNames(this.__nativeObj);
        names.forEach(function (element) {
            var key = element;
            Object.defineProperty(this, key, {
                get: function () {
                    return this.__nativeObj[key];
                },
                set: function (obj) {
                    this.__nativeObj[key] = obj;
                }
            });
        }, this);
        this.enable = true;
        Object.defineProperty(this, 'disable', {
            get: function () {
                return !this.enable;
            },
            set: function (obj) {
                if (obj == true) {
                    this.updateTexture(2);
                } else {
                    this.updateTexture(0);
                }
                this.enable = !obj;
            }
        });
        this.updateTexture = function (touchStatus) {
            if (0 == touchStatus) {
                if (this.normalTexture) {
                    this.__nativeObj.setTexture(this.normalTexture);
                    var frameInfo = this.normalTextureOffset;
                    this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
                }
            } else if (1 == touchStatus) {
                if (this.pressTexture) {
                    this.__nativeObj.setTexture(this.pressTexture);
                    var frameInfo = this.pressTextureOffset;
                    this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
                }
            } else if (2 == touchStatus) {
                if (this.disableTexture) {
                    this.__nativeObj.setTexture(this.disableTexture);
                    var frameInfo = this.disableTextureOffset;
                    this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
                }
            }
        };
        this.changeStatus = function (status) {
            this.touchStatus = status;
            this.updateTexture(this.touchStatus);
        };
        this.updateStatus = function () {
            this.updateTexture(this.touchStatus);
        };
        this.changeStatus(0);
        this.isCancelClick = undefined;
        UIEventHandler.addNodeEvent(this, UI_NODE_ENENT_TOUCH_BEGIN, function (node, evt, x, y) {
            node.isCancelClick = false;
            if (node.enable) {
                node.changeStatus(1);
            } else {
                node.changeStatus(2);
            }
        });
        UIEventHandler.addNodeEvent(this, UI_NODE_ENENT_TOUCH_MOVED, function (node, evt, x, y) {
            var pt = {
                x: x,
                y: y
            };
            if (node.hittest(pt) == false) {
                node.isCancelClick = true;
            }
        });
        UIEventHandler.addNodeEvent(this, UI_NODE_ENENT_TOUCH_END, function (node, evt, x, y) {
            if (node.enable) {
                node.changeStatus(0);
            } else {
                node.changeStatus(2);
            }
            if (node.isCancelClick == false) {
                if (node.touchInsideCallback) {
                    node.touchInsideCallback(node);
                }
            }
        });
        this.canUserInteract = true;
    }
    Button.prototype.setTouchInsideCallback = function (callback) {
        this.touchInsideCallback = callback;
    };
    Button.prototype.setNormalTexturePath = function (texturPath) {
        var tex = new BK.Texture(texturPath);
        if (tex) {
            this.setNormalTexture(tex);
        }
    };
    Button.prototype.setPressTexturePath = function (texturPath) {
        var tex = new BK.Texture(texturPath);
        if (tex) {
            this.setPressTexture(tex);
        }
    };
    Button.prototype.setDisableTexturePath = function (texturPath) {
        var tex = new BK.Texture(texturPath);
        if (tex) {
            this.setDisableTexture(tex);
        }
    };
    Button.prototype.setNormalTexture = function (texture) {
        this.normalTexture = texture;
        if (this.normalTexture) {
            this.normalTextureOffset.frame.x = 0;
            this.normalTextureOffset.frame.y = 0;
            this.normalTextureOffset.frame.w = this.normalTexture.size.width;
            this.normalTextureOffset.frame.h = this.normalTexture.size.height;
            this.normalTextureOffset.rotated = false;
        }
        this.updateStatus();
    };
    Button.prototype.setPressTexture = function (texture) {
        this.pressTexture = texture;
        if (this.pressTexture) {
            this.pressTextureOffset.frame.x = 0;
            this.pressTextureOffset.frame.y = 0;
            this.pressTextureOffset.frame.w = this.pressTexture.size.width;
            this.pressTextureOffset.frame.h = this.pressTexture.size.height;
            this.pressTextureOffset.rotated = false;
        }
        this.updateStatus();
    };
    Button.prototype.setDisableTexture = function (texture) {
        this.disableTexture = texture;
        if (this.disableTexture) {
            this.disableTextureOffset.frame.x = 0;
            this.disableTextureOffset.frame.y = 0;
            this.disableTextureOffset.frame.w = this.disableTexture.size.width;
            this.disableTextureOffset.frame.h = this.disableTexture.size.height;
            this.disableTextureOffset.rotated = false;
        }
        this.updateStatus();
    };
    Button.prototype.setNormalTextureFromSheetInfo = function (textureFrameInfo) {
        if (textureFrameInfo) {
            var texture = new BK.Texture(textureFrameInfo.texturePath);
            if (texture) {
                this.normalTexture = texture;
                this.normalTextureOffset = textureFrameInfo.frameInfo;
                this.updateStatus();
            } else {
                BK.Script.log(0, 0, 'setNormalTextureFromSheetInfo error! Create texture failed.');
            }
        } else {
            BK.Script.log(0, 0, 'setNormalTextureFromSheetInfo error! textureFrameInfo is null or undefined');
        }
    };
    Button.prototype.setPressTextureFromSheetInfo = function (textureFrameInfo) {
        if (textureFrameInfo) {
            var texture = new BK.Texture(textureFrameInfo.texturePath);
            if (texture) {
                this.pressTexture = texture;
                this.pressTextureOffset = textureFrameInfo.frameInfo;
                this.updateStatus();
            } else {
                BK.Script.log(0, 0, 'setPressTextureFromSheetInfo error! Create texture failed.');
            }
        } else {
            BK.Script.log(0, 0, 'setPressTextureFromSheetInfo error! textureFrameInfo is null or undefined');
        }
    };
    Button.prototype.setDisableTextureFromSheetInfo = function (textureFrameInfo) {
        if (textureFrameInfo) {
            var texture = new BK.Texture(textureFrameInfo.texturePath);
            if (texture) {
                this.disableTexture = texture;
                this.disableTextureOffset = textureFrameInfo.frameInfo;
                this.updateStatus();
            } else {
                BK.Script.log(0, 0, 'setDisableTextureFromSheetInfo error! Create texture failed.');
            }
        } else {
            BK.Script.log(0, 0, 'setDisableTextureFromSheetInfo error! textureFrameInfo is null or undefined');
        }
    };
    Button.prototype.hittest = function (position) {
        return this.__nativeObj.hittest(position);
    };
    Button.prototype.addChild = function (child) {
        this.__nativeObj.addChild(child);
    };
    Button.prototype.attach = function (body) {
        this.__nativeObj.attach(body);
    };
    Button.prototype.dispose = function () {
        this.__nativeObj.dispose();
    };
    Button.prototype.setTexture = function (tex) {
        this.__nativeObj.setTexture(tex);
    };
    Button.prototype.removeFromParent = function () {
        this.__nativeObj.removeFromParent();
    };
    Button.prototype.setNormalTextureFromUrl = function (normalUrl, completeCB) {
        this.normalUrl = normalUrl;
        var httpget = new BK.HttpUtil(this.normalUrl);
        httpget.requestAsync(function (res, code) {
            if (code == 200) {
                var path = 'GameSandBox://btntmp/' + this.normalUrl;
                BK.FileUtil.writeBufferToFile(path, res);
                var tex = new BK.Texture(path);
                this.setNormalTexture(tex);
            } else {
                BK.Script.log(1, 1, 'Fetch advertisemSent image failed.');
            }
            if (completeCB) {
                completeCB(this, code);
            }
        }.bind(this));
    };
    Button.prototype.setPressTextureFromUrl = function (pressUrl, completeCB) {
        this.pressUrl = pressUrl;
        var httpget = new BK.HttpUtil(this.pressUrl);
        httpget.requestAsync(function (res, code) {
            if (code == 200) {
                var path = 'GameSandBox://btntmp/' + this.pressUrl;
                BK.FileUtil.writeBufferToFile(path, res);
                var tex = new BK.Texture(path);
                this.setPressTexture(tex);
            } else {
                BK.Script.log(1, 1, 'Fetch advertisement image failed.');
            }
            if (completeCB) {
                completeCB(this, code);
            }
        }.bind(this));
    };
    Button.prototype.setDisableTextureFromUrl = function (disableUrl, completeCB) {
        this.disableUrl = disableUrl;
        var httpget = new BK.HttpUtil(this.disableUrl);
        httpget.requestAsync(function (res, code) {
            if (code == 200) {
                var path = 'GameSandBox://btntmp/' + this.disableUrl;
                BK.FileUtil.writeBufferToFile(path, res);
                var tex = new BK.Texture(path);
                this.setDisableTexture(tex);
            } else {
                BK.Script.log(1, 1, 'Fetch advertisement image failed.');
            }
            if (completeCB) {
                completeCB(this, code);
            }
        }.bind(this));
    };
    return Button;
}));
(function (global, factory) {
    if (typeof global === 'object') {
        var _global = factory();
        global.JSMatrix = _global.Matrix;
    }
}(BK, function () {
    function degree2Radian(x) {
        return x * 0.01745329251994;
    }
    var Matrix = function () {
        function Matrix() {
            var param = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                param[_i] = arguments[_i];
            }
            this.data = new Float32Array(16);
            if (!arguments.length) {
                this.data[0] = 1;
                this.data[5] = 1;
                this.data[10] = 1;
                this.data[15] = 1;
            } else if (arguments.length == 1) {
                if (arguments[0] instanceof Matrix == true) {
                    for (var i_1 = 0; i_1 < 16; i_1++)
                        this.data[i_1] = arguments[0].data[i_1];
                }
            } else if (arguments.length == 16) {
                for (var i_2 = 0; i_2 < 16; i_2++)
                    this.data[i_2] = arguments[i_2];
            }
        }
        Matrix.prototype.clone = function () {
            return new Matrix(this);
        };
        Matrix.prototype.mul = function (mat) {
            var m0 = this.data[0], m1 = this.data[1], m2 = this.data[2], m3 = this.data[3];
            var m4 = this.data[4], m5 = this.data[5], m6 = this.data[6], m7 = this.data[7];
            var m8 = this.data[8], m9 = this.data[9], m10 = this.data[10], m11 = this.data[11];
            var m12 = this.data[12], m13 = this.data[13], m14 = this.data[14], m15 = this.data[15];
            var n0 = mat.data[0], n1 = mat.data[1], n2 = mat.data[2], n3 = mat.data[3];
            var n4 = mat.data[4], n5 = mat.data[5], n6 = mat.data[6], n7 = mat.data[7];
            var n8 = mat.data[8], n9 = mat.data[9], n10 = mat.data[10], n11 = mat.data[11];
            var n12 = mat.data[12], n13 = mat.data[13], n14 = mat.data[14], n15 = mat.data[15];
            this.data[0] = m0 * n0 + m4 * n1 + m8 * n2 + m12 * n3;
            this.data[1] = m1 * n0 + m5 * n1 + m9 * n2 + m13 * n3;
            this.data[2] = m2 * n0 + m6 * n1 + m10 * n2 + m14 * n3;
            this.data[3] = m3 * n0 + m7 * n1 + m11 * n2 + m15 * n3;
            this.data[4] = m0 * n4 + m4 * n5 + m8 * n6 + m12 * n7;
            this.data[5] = m1 * n4 + m5 * n5 + m9 * n6 + m13 * n7;
            this.data[6] = m2 * n4 + m6 * n5 + m10 * n6 + m14 * n7;
            this.data[7] = m3 * n4 + m7 * n5 + m11 * n6 + m15 * n7;
            this.data[8] = m0 * n8 + m4 * n9 + m8 * n10 + m12 * n11;
            this.data[9] = m1 * n8 + m5 * n9 + m9 * n10 + m13 * n11;
            this.data[10] = m2 * n8 + m6 * n9 + m10 * n10 + m14 * n11;
            this.data[11] = m3 * n8 + m7 * n9 + m11 * n10 + m15 * n11;
            this.data[12] = m0 * n12 + m4 * n13 + m8 * n14 + m12 * n15;
            this.data[13] = m1 * n12 + m5 * n13 + m9 * n14 + m13 * n15;
            this.data[14] = m2 * n12 + m6 * n13 + m10 * n14 + m14 * n15;
            this.data[15] = m3 * n12 + m7 * n13 + m11 * n14 + m15 * n15;
            return this;
        };
        Matrix.prototype.mulPoint = function (pt) {
            var m0 = this.data[0], m1 = this.data[1], m2 = this.data[2], m3 = this.data[3];
            var m4 = this.data[4], m5 = this.data[5], m6 = this.data[6], m7 = this.data[7];
            var m8 = this.data[8], m9 = this.data[9], m10 = this.data[10], m11 = this.data[11];
            var m12 = this.data[12], m13 = this.data[13], m14 = this.data[14], m15 = this.data[15];
            if (typeof pt.z == 'undefined') {
                pt.z = 0;
            }
            var newPt = {
                x: 0,
                y: 0,
                z: 0
            };
            newPt.x = m0 * pt.x + m4 * pt.y + m8 * pt.z + m12;
            newPt.y = m1 * pt.x + m5 * pt.y + m9 * pt.z + m13;
            newPt.z = m2 * pt.x + m6 * pt.y + m10 * pt.z + m14;
            var w = m3 * pt.x + m7 * pt.y + m11 * pt.z + m15;
            return newPt;
        };
        Matrix.prototype.inverse = function () {
            var d1 = this.data[10] * this.data[15] - this.data[14] * this.data[11];
            var d2 = this.data[6] * this.data[15] - this.data[14] * this.data[7];
            var d3 = this.data[6] * this.data[11] - this.data[10] * this.data[7];
            var d4 = this.data[2] * this.data[15] - this.data[14] * this.data[3];
            var d5 = this.data[2] * this.data[11] - this.data[10] * this.data[3];
            var d6 = this.data[2] * this.data[7] - this.data[6] * this.data[3];
            var d7 = this.data[9] * this.data[15] - this.data[13] * this.data[11];
            var d8 = this.data[5] * this.data[15] - this.data[13] * this.data[7];
            var d9 = this.data[5] * this.data[11] - this.data[9] * this.data[7];
            var d10 = this.data[1] * this.data[15] - this.data[13] * this.data[3];
            var d11 = this.data[1] * this.data[11] - this.data[9] * this.data[3];
            var d12 = this.data[1] * this.data[7] - this.data[5] * this.data[3];
            var d13 = this.data[9] * this.data[14] - this.data[13] * this.data[10];
            var d14 = this.data[5] * this.data[14] - this.data[13] * this.data[6];
            var d15 = this.data[5] * this.data[10] - this.data[9] * this.data[6];
            var d16 = this.data[1] * this.data[14] - this.data[13] * this.data[2];
            var d17 = this.data[1] * this.data[10] - this.data[9] * this.data[2];
            var d18 = this.data[1] * this.data[6] - this.data[5] * this.data[2];
            var c11 = this.data[5] * d1 - this.data[9] * d2 + this.data[13] * d3;
            var c12 = this.data[9] * d4 - this.data[1] * d1 - this.data[13] * d5;
            var c13 = this.data[1] * d2 - this.data[5] * d4 + this.data[13] * d6;
            var c14 = this.data[5] * d5 - this.data[1] * d3 - this.data[9] * d6;
            var c21 = this.data[8] * d2 - this.data[4] * d1 - this.data[12] * d3;
            var c22 = this.data[0] * d1 - this.data[8] * d4 + this.data[12] * d5;
            var c23 = this.data[4] * d4 - this.data[0] * d2 - this.data[12] * d6;
            var c24 = this.data[0] * d3 - this.data[4] * d5 + this.data[8] * d6;
            var c31 = this.data[4] * d7 - this.data[8] * d8 + this.data[12] * d9;
            var c32 = this.data[8] * d10 - this.data[0] * d7 - this.data[12] * d11;
            var c33 = this.data[0] * d8 - this.data[4] * d10 + this.data[12] * d12;
            var c34 = this.data[4] * d11 - this.data[0] * d9 - this.data[8] * d12;
            var c41 = this.data[8] * d14 - this.data[4] * d13 - this.data[12] * d15;
            var c42 = this.data[0] * d13 - this.data[8] * d16 + this.data[12] * d17;
            var c43 = this.data[4] * d16 - this.data[0] * d14 - this.data[12] * d18;
            var c44 = this.data[0] * d15 - this.data[4] * d17 + this.data[8] * d18;
            var determinant = this.data[0] * c11 + this.data[1] * c21 + this.data[2] * c31 + this.data[3] * c41;
            if (determinant != 0) {
                this.data[0] = c11 / determinant;
                this.data[4] = c21 / determinant;
                this.data[8] = c31 / determinant;
                this.data[12] = c41 / determinant;
                this.data[1] = c12 / determinant;
                this.data[5] = c22 / determinant;
                this.data[9] = c32 / determinant;
                this.data[13] = c42 / determinant;
                this.data[2] = c13 / determinant;
                this.data[6] = c23 / determinant;
                this.data[10] = c33 / determinant;
                this.data[14] = c43 / determinant;
                this.data[3] = c14 / determinant;
                this.data[7] = c24 / determinant;
                this.data[11] = c34 / determinant;
                this.data[15] = c44 / determinant;
            }
            return this;
        };
        Matrix.prototype.scale = function (x, y, z) {
            var mat = Matrix.fromScale(x, y, z);
            return this.mul(mat);
        };
        Matrix.prototype.rotate = function (x, y, z) {
            var mat = Matrix.fromEulerAngle(x, y, z);
            return this.mul(mat);
        };
        Matrix.prototype.translate = function (x, y, z) {
            var mat = Matrix.fromTranslate(x, y, z);
            return this.mul(mat);
        };
        Matrix.prototype.transform = function (x, y, z) {
            var w = 1;
            var _x = x * this.data[0] + y * this.data[4] + z * this.data[8] + w * this.data[12];
            var _y = x * this.data[1] + y * this.data[5] + z * this.data[9] + w * this.data[13];
            var _z = x * this.data[2] + y * this.data[6] + z * this.data[10] + w * this.data[14];
            return {
                'x': _x,
                'y': _y,
                'z': _z
            };
        };
        Matrix.prototype.toEulerAngle = function () {
            var h = 0;
            var p = 0;
            var b = 0;
            var m11 = this.data[0];
            var m12 = this.data[4];
            var m13 = this.data[8];
            var mat2 = this.data[5];
            var m31 = this.data[2];
            var m32 = this.data[6];
            var m33 = this.data[10];
            var sp = -m32;
            if (sp <= -1) {
                p = -1.570796;
            } else if (sp >= 1) {
                p = 1.570796;
            } else {
                p = Math.asin(sp);
            }
            if (Math.abs(sp) > 0.9999) {
                b = 0;
                h = Math.atan2(-m13, m11);
            } else {
                h = Math.atan2(m31, m33);
                b = Math.atan2(m12, mat2);
            }
            var vec = new Float32Array(3);
            vec[0] = p;
            vec[1] = h;
            vec[2] = b;
            return vec;
        };
        Matrix.fromScale = function (x, y, z) {
            var resultMat = new Matrix();
            resultMat.data[0] = x;
            resultMat.data[5] = y;
            resultMat.data[10] = z;
            return resultMat;
        };
        Matrix.fromTranslate = function (x, y, z) {
            var resultMat = new Matrix();
            resultMat.data[12] = x;
            resultMat.data[13] = y;
            resultMat.data[14] = z;
            return resultMat;
        };
        Matrix.fromEulerAngle = function (x, y, z) {
            var h = -degree2Radian(x);
            var p = -degree2Radian(y);
            var b = -degree2Radian(z);
            var ch = Math.cos(h);
            var sh = Math.sin(h);
            var cp = Math.cos(p);
            var sp = Math.sin(p);
            var cb = Math.cos(b);
            var sb = Math.sin(b);
            var resultMat = new Matrix(ch * cb + sh * sp * sb, -ch * sb + sh * sp * cb, sh * cp, 0, sb * cp, cb * cp, -sp, 0, -sh * cb + ch * sp * sb, sb * sh + ch * sp * cb, ch * cp, 0, 0, 0, 0, 1);
            return resultMat;
        };
        Matrix.fromViewport = function (left, right, bottom, top, ns, fs) {
            var resultMat = new Matrix();
            resultMat.data[0] = (right - left) / 2;
            resultMat.data[5] = (top - bottom) / 2;
            resultMat.data[10] = (fs - ns) / 2;
            resultMat.data[12] = (left + right) / 2;
            resultMat.data[13] = (top + bottom) / 2;
            resultMat.data[14] = (ns + fs) / 2;
            resultMat.data[15] = 1;
            return resultMat;
        };
        Matrix.fromOrthographic = function (left, right, bottom, top, near_plane, far_plane) {
            var resultMat = new Matrix();
            resultMat.data[0] = 2 / (right - left);
            resultMat.data[5] = 2 / (top - bottom);
            resultMat.data[10] = 2 / (near_plane - far_plane);
            resultMat.data[12] = (left + right) / (left - right);
            resultMat.data[13] = (top + bottom) / (bottom - top);
            resultMat.data[14] = (near_plane + far_plane) / (near_plane - far_plane);
            resultMat.data[15] = 1;
            return resultMat;
        };
        return Matrix;
    }();
    return { 'Matrix': Matrix };
}));
(function (global, factory) {
    if (typeof global === 'object') {
        global.JSTransform = factory();
    }
}(BK, function () {
    var Transform = function () {
        function Transform(transform) {
            if (undefined == transform) {
                this.transform = new Float32Array(19);
                this.transform[2] = 1;
                this.transform[3] = 1;
                this.transform[4] = 1;
                this._localAnchorOrPivot = undefined;
                this._parentAnchorOrPivot = undefined;
                this._needUpdate = true;
            } else if (transform instanceof Transform == true) {
                this.transform = new Float32Array(19);
                this._localAnchorOrPivot = transform._localAnchorOrPivot;
                this._parentAnchorOrPivot = transform._parentAnchorOrPivot;
                this._needUpdate = transform._needUpdate;
                for (var i_1 = 0; i_1 < 19; i_1++)
                    this.transform[i_1] = transform.transform[i_1];
            } else {
                throw new Error('BK.Transform.constructor!paramater error');
            }
            this.matrix = {
                'get': function () {
                    return null;
                },
                'set': function (a, b, c, d, tx, ty) {
                    this._needUpdate = true;
                    this.transform[2] = a;
                    this.transform[3] = d;
                    this.transform[4] = 1;
                    this.transform[5] = c;
                    this.transform[6] = b;
                    this.transform[7] = 0;
                    this.transform[8] = tx;
                    this.transform[9] = ty;
                    this.transform[10] = 0;
                }
            };
        }
        Object.defineProperty(Transform.prototype, 'needUpdate', {
            get: function () {
                return this._needUpdate;
            },
            set: function (needUpdate) {
                this._needUpdate = needUpdate;
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.getNeedUpdate = function () {
            return this._needUpdate;
        };
        Transform.prototype.setNeedUpdate = function (needUpdate) {
            this._needUpdate = needUpdate;
        };
        Object.defineProperty(Transform.prototype, 'scale', {
            get: function () {
                return {
                    'x': this.transform[2],
                    'y': this.transform[3],
                    'z': this.transform[4]
                };
            },
            set: function (scale) {
                if (this.transform[2] != scale.x || this.transform[3] != scale.y || this.transform[4] != scale.z) {
                    this._needUpdate = true;
                    this.transform[2] = scale.x == undefined ? 1 : scale.x;
                    this.transform[3] = scale.y == undefined ? 1 : scale.y;
                    this.transform[4] = scale.z == undefined ? 1 : scale.z;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, 'rotation', {
            get: function () {
                return {
                    'x': this.transform[5],
                    'y': this.transform[6],
                    'z': this.transform[7]
                };
            },
            set: function (rotate) {
                if (this.transform[5] != rotate.x || this.transform[6] != rotate.y || this.transform[7] != rotate.z) {
                    this._needUpdate = true;
                    this.transform[5] = rotate.x == undefined ? 0 : rotate.x;
                    this.transform[6] = rotate.y == undefined ? 0 : rotate.y;
                    this.transform[7] = rotate.z == undefined ? 0 : rotate.z;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, 'position', {
            get: function () {
                return {
                    'x': this.transform[8],
                    'y': this.transform[9],
                    'z': this.transform[10]
                };
            },
            set: function (position) {
                if (this.transform[8] != position.x || this.transform[9] != position.y || this.transform[10] != position.z) {
                    this._needUpdate = true;
                    this.transform[8] = position.x == undefined ? 0 : position.x;
                    this.transform[9] = position.y == undefined ? 0 : position.y;
                    this.transform[10] = position.z == undefined ? 0 : position.z;
                }
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.getPosition = function () {
            return {
                'x': this.transform[8],
                'y': this.transform[9],
                'z': this.transform[10]
            };
        };
        Transform.prototype.setPosition = function (x, y, z) {
            if (this.transform[8] != x || this.transform[9] != y || this.transform[10] != z) {
                this._needUpdate = true;
                this.transform[8] = x == undefined ? 0 : x;
                this.transform[9] = y == undefined ? 0 : y;
                this.transform[10] = z == undefined ? 0 : z;
            }
        };
        Object.defineProperty(Transform.prototype, 'localPivot', {
            get: function () {
                if (this._localAnchorOrPivot != undefined && this._localAnchorOrPivot != 0) {
                    throw new Error('BK.Transform.localPivot!current mode is localAnchor!!');
                }
                this._localAnchorOrPivot = 0;
                return {
                    'x': this.transform[11],
                    'y': this.transform[12]
                };
            },
            set: function (lpivot) {
                if (this._localAnchorOrPivot != 0 || this.transform[11] != lpivot.x || this.transform[12] != lpivot.y) {
                    this._needUpdate = true;
                    this._localAnchorOrPivot = 0;
                    this.transform[11] = lpivot.x == undefined ? 0 : lpivot.x;
                    this.transform[12] = lpivot.y == undefined ? 0 : lpivot.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, 'localAnchor', {
            get: function () {
                if (this._localAnchorOrPivot != undefined && this._localAnchorOrPivot != 1) {
                    throw new Error('BK.Transform.localAnchor!current mode is localPivot!!');
                }
                this._localAnchorOrPivot = 1;
                return {
                    'x': this.transform[13],
                    'y': this.transform[14]
                };
            },
            set: function (lanchor) {
                if (this._localAnchorOrPivot != 1 || this.transform[13] != lanchor.x || this.transform[14] != lanchor.y) {
                    this._needUpdate = true;
                    this._localAnchorOrPivot = 1;
                    this.transform[13] = lanchor.x == undefined ? 0 : lanchor.x;
                    this.transform[14] = lanchor.y == undefined ? 0 : lanchor.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, 'pivotParent', {
            get: function () {
                if (this._parentAnchorOrPivot != undefined && this._parentAnchorOrPivot != 0) {
                    throw new Error('BK.Transform.pivotParent!current mode is anchorParent!!');
                }
                this._parentAnchorOrPivot = 0;
                return {
                    'x': this.transform[15],
                    'y': this.transform[16]
                };
            },
            set: function (ppivot) {
                if (this._parentAnchorOrPivot != 0 || this.transform[15] != ppivot.x || this.transform[16] != ppivot.y) {
                    this._needUpdate = true;
                    this._parentAnchorOrPivot = 0;
                    this.transform[15] = ppivot.x == undefined ? 0 : ppivot.x;
                    this.transform[16] = ppivot.y == undefined ? 0 : ppivot.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, 'anchorParent', {
            get: function () {
                if (this._parentAnchorOrPivot != undefined && this._parentAnchorOrPivot != 1) {
                    throw new Error('BK.Transform.anchorParent!current mode is pivotParent!!');
                }
                this._parentAnchorOrPivot = 1;
                return {
                    'x': this.transform[17],
                    'y': this.transform[18]
                };
            },
            set: function (panchor) {
                if (this._parentAnchorOrPivot != 1 || this.transform[17] != panchor.x || this.transform[18] != panchor.y) {
                    this._needUpdate = true;
                    this._parentAnchorOrPivot = 1;
                    this.transform[17] = panchor.x == undefined ? 0 : panchor.x;
                    this.transform[18] = panchor.y == undefined ? 0 : panchor.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, 'contentSize', {
            get: function () {
                return {
                    'width': this.transform[0],
                    'height': this.transform[1]
                };
            },
            set: function (contentSize) {
                if (this.transform[0] != contentSize.width || this.transform[1] != contentSize.height) {
                    this._needUpdate = true;
                    this.transform[0] = contentSize.width == undefined ? 0 : contentSize.width;
                    this.transform[1] = contentSize.height == undefined ? 0 : contentSize.height;
                }
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.getContentSize = function () {
            return {
                'width': this.transform[0],
                'height': this.transform[1]
            };
        };
        Transform.prototype.setContentSize = function (width, height) {
            if (this.transform[0] != width || this.transform[1] != height) {
                this._needUpdate = true;
                this.transform[0] = width == undefined ? 0 : width;
                this.transform[1] = height == undefined ? 0 : height;
            }
        };
        Transform.prototype.update = function (width, height) {
            if (this._needUpdate == true) {
                if (this._localAnchorOrPivot == 1) {
                    this.transform[11] = this.transform[13] * this.transform[0];
                    this.transform[12] = this.transform[14] * this.transform[1];
                }
                if (this._parentAnchorOrPivot == 1) {
                    this.transform[15] = this.transform[17] * width;
                    this.transform[16] = this.transform[18] * height;
                }
                this._needUpdate = false;
            }
            return this.transform;
        };
        return Transform;
    }();
    return Transform;
}));
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
(function (global, factory) {
    if (typeof global === 'object') {
        var _global = factory();
        global.GLRenderNode = _global.GLRenderNode;
        global.GLRenderContext = _global.GLRenderContext;
    }
}(BK, function () {
    var GLRenderContext = function () {
        function GLRenderContext() {
            this.getTypeSize = function (type) {
                if (this._gl.BYTE == type) {
                    return 1;
                } else if (this._gl.UNSIGNED_BYTE == type) {
                    return 1;
                } else if (this._gl.SHORT == type) {
                    return 2;
                } else if (this._gl.UNSIGNED_SHORT == type) {
                    return 2;
                } else if (this._gl.INT == type) {
                    return 4;
                } else if (this._gl.UNSIGNED_INT == type) {
                    return 4;
                } else if (this._gl.FLOAT == type) {
                    return 4;
                }
            };
            this._ibo = 0;
            this._vbo = 0;
            this._program = 0;
            this._hasLoadShader = false;
            this._gl = bkWebGLGetInstance();
        }
        GLRenderContext.__hookGlCommit = function () {
            var __gl = bkWebGLGetInstance();
            BK.GLRenderContext.__updataCallback(__gl);
            __gl.oldGlCommit();
        };
        GLRenderContext.hookGLCommit = function (updateCb) {
            this.__updataCallback = updateCb;
            this.__gl = bkWebGLGetInstance();
            this.__oldGlCommit = this.__gl.glCommit;
            this.__gl.glCommit = this.__hookGlCommit;
            this.__gl.oldGlCommit = this.__oldGlCommit;
            this.__hookGlCommit.bind(this.__gl);
        };
        GLRenderContext.exit = function () {
            this.__gl = bkWebGLGetInstance();
            if (this.__oldGlCommit) {
                this.__gl.glCommit = this.__oldGlCommit;
            }
        };
        Object.defineProperty(GLRenderContext.prototype, 'gl', {
            get: function () {
                return this._gl;
            },
            enumerable: true,
            configurable: true
        });
        GLRenderContext.prototype.__loadShader = function () {
            if (this._hasLoadShader == true) {
                this._gl.useProgram(this._program);
                return;
            }
            this._hasLoadShader = true;
            var log;
            var vs = 'uniform mat4 worldMat; uniform mat4 projMat; attribute vec2 pos; attribute vec2 inUVs; varying lowp vec2 outUVs;                       void main() { gl_Position = projMat * worldMat * vec4(pos, 0, 1); outUVs = inUVs; }';
            var fs = 'varying lowp vec2 outUVs; uniform sampler2D uSampler; void main() { gl_FragColor = texture2D(uSampler, outUVs); }';
            var vsShader = this._gl.createShader(this._gl.VERTEX_SHADER);
            if (vsShader != 0) {
                this._gl.shaderSource(vsShader, vs);
                this._gl.compileShader(vsShader);
            }
            var fsShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
            if (fsShader != 0) {
                this._gl.shaderSource(fsShader, fs);
                this._gl.compileShader(fsShader);
            }
            var program = this._gl.createProgram();
            this._gl.attachShader(program, vsShader);
            this._gl.attachShader(program, fsShader);
            this._gl.linkProgram(program);
            this._gl.deleteShader(vsShader);
            this._gl.deleteShader(fsShader);
            if (this._gl.getError() == this._gl.NO_ERROR) {
                this._program = program;
                this._gl.useProgram(this._program);
            } else {
                log = this._gl.getProgramInfoLog(program);
                BK.Script.log(1, -1, 'link program fail, err = ' + log);
            }
            this.calculateProjection();
        };
        GLRenderContext.prototype.getProgram = function () {
            return this._program;
        };
        GLRenderContext.prototype.__loadArrayBuffer = function () {
            var uPos = this._gl.getAttribLocation(this._program, 'pos');
            var uUVs = this._gl.getAttribLocation(this._program, 'inUVs');
            if (this._vbo == 0) {
                this._vbo = this._gl.createBuffer();
            }
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vbo);
            this._gl.enableVertexAttribArray(uPos);
            this._gl.enableVertexAttribArray(uUVs);
            this._gl.glVertexAttribPointer(uPos, 2, this._gl.FLOAT, false, 16, 0, true);
            this._gl.glVertexAttribPointer(uUVs, 2, this._gl.FLOAT, false, 16, 8, true);
            if (this._ibo == 0) {
                this._ibo = this._gl.createBuffer();
            }
        };
        GLRenderContext.prototype.dispose = function () {
            if (this._vbo != 0) {
                this._gl.deleteBuffer(this._vbo);
            }
            if (this._ibo != 0) {
                this._gl.deleteBuffer(this._ibo);
            }
            if (this._program != 0) {
                this._gl.deleteProgram(this._program);
            }
            this._gl = null;
        };
        GLRenderContext.prototype.save = function () {
            this._prevVP = this._gl.glGetParameterInt(this._gl.VIEWPORT, 4);
            this._prevVBO = this._gl.glGetParameterInt(this._gl.ARRAY_BUFFER_BINDING, 1);
            this._prevIBO = this._gl.glGetParameterInt(this._gl.ELEMENT_ARRAY_BUFFER_BINDING, 1);
            this._prevProgram = this._gl.glGetParameterInt(this._gl.CURRENT_PROGRAM, 1);
            this._prevTextureID = this._gl.glGetParameterInt(this._gl.TEXTURE_BINDING_2D, 1);
            this._prevTextureUnit = this._gl.glGetParameterInt(this._gl.ACTIVE_TEXTURE, 1);
            this._prevFrameBuffer = this._gl.glGetParameterInt(this._gl.FRAMEBUFFER_BINDING, 1);
            this._prevRenderBuffer = this._gl.glGetParameterInt(this._gl.RENDERBUFFER_BINDING, 1);
            this._activeAttribusInfo = [];
            var numAttribs = this._gl.glGetProgramParameter(this._prevProgram, gl.ACTIVE_ATTRIBUTES);
            for (var i_1 = 0; i_1 < numAttribs; ++i_1) {
                var info = this._gl.getActiveAttrib(this._prevProgram, i_1);
                var name = info.name;
                var index = this._gl.getAttribLocation(this._prevProgram, name);
                var size = this._gl.getVertexAttrib(name, this._gl.VERTEX_ATTRIB_ARRAY_SIZE);
                var type = this._gl.getVertexAttrib(name, this._gl.VERTEX_ATTRIB_ARRAY_TYPE);
                var normalized = this._gl.getVertexAttrib(name, this._gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
                var stride = this._gl.getVertexAttrib(name, this._gl.VERTEX_ATTRIB_ARRAY_STRIDE);
                var offset = this._gl.getVertexAttribOffset(index, gl.VERTEX_ATTRIB_ARRAY_POINTER);
                info.name = name;
                info.index = index;
                info.size = size;
                info.type = type;
                info.normalized = normalized;
                info.stride = stride;
                info.offset = offset;
                if (typeof this._gl.recordVertexAttribPointer != 'undefined') {
                    for (var j_1 = 0; j_1 < this._gl.recordVertexAttribPointer.length; j_1++) {
                        var vertexAttribPointer_1 = this._gl.recordVertexAttribPointer[j_1];
                        if (info.index == vertexAttribPointer_1.index && info.type == vertexAttribPointer_1.type && info.stride == vertexAttribPointer_1.stride && info.offset == vertexAttribPointer_1.offset) {
                            info.index = vertexAttribPointer_1.index;
                            info.size = vertexAttribPointer_1.size;
                            info.type = vertexAttribPointer_1.type;
                            info.normalized = vertexAttribPointer_1.normalized;
                            info.stride = vertexAttribPointer_1.stride;
                            info.offset = vertexAttribPointer_1.offset;
                            break;
                        }
                    }
                }
                this.debugLog('save name:' + info.name + ' index:' + info.index + ' size:' + info.size + ' type:' + info.type + ' normalized:' + info.normalized + ' stride:' + info.stride + ' offset:' + info.offset);
                this._activeAttribusInfo.push(info);
            }
        };
        GLRenderContext.prototype.restore = function () {
            this._gl.viewport(this._prevVP[0], this._prevVP[1], this._prevVP[2], this._prevVP[3]);
            this._gl.useProgram(this._prevProgram);
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._prevVBO);
            if (this._activeAttribusInfo.length > 0) {
                var remainStrideBytes = this._activeAttribusInfo[0].stride;
                for (var idx = 0; idx < this._activeAttribusInfo.length; idx++) {
                    var info = this._activeAttribusInfo[idx];
                    var name = info.name;
                    var index = info.index;
                    var size = info.size;
                    var type = info.type;
                    var normalized = info.normalized;
                    var offset = info.offset;
                    var stride = info.stride;
                    var nonormalizedrB = normalized == 0 ? false : true;
                    this.debugLog('restore name:' + info.name + ' index:' + index + ' size:' + size + ' type:' + type + ' normalized:' + normalized + ' stride:' + stride + ' offset:' + offset);
                    this._gl.vertexAttribPointer(index, size, type, nonormalizedrB, stride, offset, true);
                }
            }
            this._activeAttribusInfo = [];
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._prevIBO);
            this._gl.activeTexture(this._prevTextureUnit);
            this._gl.bindTexture(this._gl.TEXTURE_2D, this._prevTextureID);
            this._gl.glBindFramebuffer(this._gl.FRAMEBUFFER, this._prevFrameBuffer);
            this._gl.glBindRenderbuffer(this._gl.RENDERBUFFER, this._prevRenderBuffer);
        };
        GLRenderContext.prototype.setViewport = function (x, y, width, height) {
            this._gl.viewport(x, y, width, height);
        };
        GLRenderContext.prototype.setProjection = function (projMatrix) {
            this._projMat = projMatrix;
        };
        GLRenderContext.prototype.calculateProjection = function () {
            var projMatrix = this._projMat;
            var data = projMatrix.data;
            this._gl.useProgram(this._program);
            var projMat = this._gl.getUniformLocation(this._program, 'projMat');
            this._gl.uniformMatrix4fv(projMat, false, data);
            var uSampler = this._gl.getUniformLocation(this._program, 'uSampler');
            this._gl.uniform1i(uSampler, 0);
            var err = this._gl.getError();
            err = 0;
        };
        GLRenderContext.prototype.debugLog = function (str) {
            return;
        };
        GLRenderContext.prototype.getProjection = function () {
            return this._projMat;
        };
        GLRenderContext.prototype.drawMesh = function (vertices, indices, worldMatrix, textureID) {
            this.__loadShader();
            this.__loadArrayBuffer();
            var worldMat = this._gl.getUniformLocation(this._program, 'worldMat');
            this._gl.uniformMatrix4fv(worldMat, false, worldMatrix.data);
            this._gl.activeTexture(this._gl.TEXTURE0);
            this._gl.bindTexture(this._gl.TEXTURE_2D, textureID);
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vbo);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._ibo);
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, indices, this._gl.STATIC_DRAW);
            this._gl.drawElements(this._gl.TRIANGLES, indices.length, this._gl.UNSIGNED_SHORT, 0);
        };
        return GLRenderContext;
    }();
    var GLRenderNode = function () {
        function GLRenderNode(context) {
            this._context = context;
            this._parent = null;
            this._childrens = new Array();
            this._textureID = 0;
            this._localMatrix = new BK.JSMatrix();
            this._worldMatrix = new BK.JSMatrix();
            this._localTransform = new BK.JSTransform();
            this._zOrder = 0;
            this._needSort = false;
            this._needUpdate = true;
            this._needUpdateWorldMatrix = true;
            this.canUserInteract = false;
            this.hidden = false;
            this._hasDispose = false;
        }
        Object.defineProperty(GLRenderNode.prototype, 'path', {
            set: function (path) {
                if (this._path != path) {
                    this._path = path;
                    if (this._textureID != 0) {
                        this._context.gl.deleteTexture(this._textureID);
                        this._textureID = 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        GLRenderNode.prototype.setUrlPath = function (url, completeCB) {
            var httpget = new BK.HttpUtil(url);
            httpget.requestAsync(function (res, code) {
                if (this._hasDispose == true) {
                    BK.Script.log(1, 1, 'node hasn been disposed.response ignore');
                    return;
                }
                if (code == 200) {
                    var path = 'GameSandBox://ad/' + url;
                    BK.FileUtil.writeBufferToFile(path, res);
                    this.path = path;
                } else {
                    BK.Script.log(1, 1, 'Fetch advertisement Sent image failed.');
                }
                if (completeCB) {
                    completeCB(this, code);
                }
            }.bind(this));
        };
        Object.defineProperty(GLRenderNode.prototype, 'parent', {
            get: function () {
                return this._parent;
            },
            set: function (node) {
                this._parent = node;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLRenderNode.prototype, 'zOrder', {
            get: function () {
                return this._zOrder;
            },
            set: function (zOrder) {
                if (this._zOrder != zOrder) {
                    this._needSort = true;
                    this._zOrder = zOrder;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLRenderNode.prototype, 'scale', {
            get: function () {
                return this._localTransform.scale;
            },
            set: function (newScale) {
                var oldScale = this._localTransform.scale;
                if (oldScale.x != newScale.x || oldScale.y != newScale.y || oldScale.z != newScale.z) {
                    this._needUpdate = true;
                    this._localTransform.scale = newScale;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLRenderNode.prototype, 'rotation', {
            get: function () {
                return this._localTransform.rotation;
            },
            set: function (newRotation) {
                var oldRotation = this._localTransform.rotation;
                if (oldRotation.x != newRotation.x || oldRotation.y != newRotation.y || oldRotation.z != newRotation.z) {
                    this._localTransform.rotation = newRotation;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLRenderNode.prototype, 'position', {
            get: function () {
                return this._localTransform.position;
            },
            set: function (newPosition) {
                var oldPosition = this._localTransform.position;
                if (oldPosition.x != newPosition.x || oldPosition.y != newPosition.y || oldPosition.z != newPosition.z) {
                    this._localTransform.position = newPosition;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLRenderNode.prototype, 'contentSize', {
            get: function () {
                return this._localTransform.getContentSize();
            },
            set: function (newSize) {
                var oldSize = this._localTransform.contentSize;
                if (oldSize.width != newSize.width || oldSize.height != newSize.height) {
                    this._needUpdate = true;
                    this._localTransform.contentSize = newSize;
                }
            },
            enumerable: true,
            configurable: true
        });
        GLRenderNode.prototype.getContentSize = function () {
            return this._localTransform.getContentSize();
        };
        GLRenderNode.prototype.setContentSize = function (width, height) {
            this._localTransform.setContentSize(width, height);
        };
        Object.defineProperty(GLRenderNode.prototype, 'localPivot', {
            get: function () {
                return this._localTransform.localPivot;
            },
            set: function (newPivot) {
                var oldPivot = this._localTransform.localPivot;
                if (oldPivot.x != newPivot.x || oldPivot.y != newPivot.y) {
                    this._localTransform.localPivot = newPivot;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLRenderNode.prototype, 'localAnchor', {
            get: function () {
                return this._localTransform.localAnchor;
            },
            set: function (newAnchor) {
                var oldAnchor = this._localTransform.localAnchor;
                if (oldAnchor.x != newAnchor.x || oldAnchor.y != newAnchor.y) {
                    this._localTransform.localAnchor = newAnchor;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLRenderNode.prototype, 'pivotParent', {
            get: function () {
                return this._localTransform.pivotParent;
            },
            set: function (newPivot) {
                var oldPivot = this._localTransform.pivotParent;
                if (oldPivot.x != newPivot.x || oldPivot.y != newPivot.y) {
                    this._localTransform.pivotParent = newPivot;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLRenderNode.prototype, 'anchorParent', {
            get: function () {
                return this._localTransform.anchorParent;
            },
            set: function (newAnchor) {
                var oldAnchor = this._localTransform.anchorParent;
                if (oldAnchor.x != newAnchor.x || oldAnchor.y != newAnchor.y) {
                    this._localTransform.anchorParent = newAnchor;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLRenderNode.prototype, 'worldMatrix', {
            get: function () {
                if (false == this.__needUpdateTransform()) {
                    return this._worldMatrix.clone();
                }
                var localMatrix = this.matrixFromLocal();
                var parentMatrix = this._parent != null ? this._parent.worldMatrix : new BK.JSMatrix();
                this.__updateWorldMatrix(parentMatrix.mul(localMatrix));
                return this._worldMatrix.clone();
            },
            enumerable: true,
            configurable: true
        });
        GLRenderNode.prototype.dispose = function () {
            if (this.children) {
                for (var index_1 = 0; index_1 < this.children.length; index_1++) {
                    var child = this.children[index_1];
                    child.dispose();
                }
            }
            this._context.gl.deleteTexture(this._textureID);
            this._hasDispose = true;
        };
        GLRenderNode.prototype.addChild = function (child) {
            for (var i_2 = 0; i_2 < this._childrens.length; i_2++) {
                if (this._childrens[i_2] == child || child.parent != null) {
                    BK.Script.log(0, 0, 'BK.Node.addChild!node has been in node tree');
                    return false;
                }
            }
            child.parent = this;
            this._needSort = true;
            this._childrens.push(child);
            return true;
        };
        Object.defineProperty(GLRenderNode.prototype, 'children', {
            get: function () {
                return this._childrens;
            },
            enumerable: true,
            configurable: true
        });
        GLRenderNode.prototype.__needUpdateTransform = function () {
            if (this._needUpdateWorldMatrix == true || this._localTransform.getNeedUpdate() == true) {
                return true;
            }
            if (this._parent != null) {
                this._needUpdateWorldMatrix = this._parent.__needUpdateTransform();
                return this._needUpdateWorldMatrix;
            }
            return false;
        };
        GLRenderNode.prototype.__updateWorldMatrix = function (matrix) {
            this._worldMatrix = matrix;
            this._needUpdateWorldMatrix = false;
            this._childrens.forEach(function (child) {
                child._needUpdateWorldMatrix = true;
            });
        };
        GLRenderNode.prototype.matrixFromLocal = function () {
            if (false == this._localTransform.getNeedUpdate()) {
                return this._localMatrix.clone();
            }
            var transforms;
            if (null != this._parent) {
                transforms = this._localTransform.update(this._parent._localTransform.transform[0], this._parent._localTransform.transform[1]);
            } else {
                transforms = this._localTransform.update(0, 0);
            }
            var localMat = new BK.JSMatrix();
            localMat.translate(transforms[8], transforms[9], transforms[10]);
            localMat.rotate(transforms[5], transforms[6], transforms[7]);
            localMat.scale(transforms[2], transforms[3], transforms[4]);
            var anchorMat = new BK.JSMatrix();
            anchorMat.data[12] = -transforms[11];
            anchorMat.data[13] = -transforms[12];
            this._localMatrix = localMat.mul(anchorMat);
            if (this._parent != null) {
                var parentMat = new BK.JSMatrix();
                parentMat.data[12] = transforms[15];
                parentMat.data[13] = transforms[16];
                this._localMatrix = parentMat.mul(localMat);
            }
            return this._localMatrix.clone();
        };
        GLRenderNode.prototype.loadTexture = function () {
            if (0 == this._textureID) {
                if (this._path) {
                    var data = BK.Image.loadImage(this._path);
                    if (data) {
                        var gl_1 = this._context.gl;
                        this._textureID = gl_1.createTexture();
                        gl_1.activeTexture(gl_1.TEXTURE0);
                        gl_1.bindTexture(gl_1.TEXTURE_2D, this._textureID);
                        gl_1.texParameteri(gl_1.TEXTURE_2D, gl_1.TEXTURE_MIN_FILTER, gl_1.LINEAR);
                        gl_1.texParameteri(gl_1.TEXTURE_2D, gl_1.TEXTURE_MAG_FILTER, gl_1.LINEAR);
                        gl_1.glTexParameteri(gl_1.TEXTURE_2D, gl_1.TEXTURE_WRAP_S, gl_1.CLAMP_TO_EDGE);
                        gl_1.glTexParameteri(gl_1.TEXTURE_2D, gl_1.TEXTURE_WRAP_T, gl_1.CLAMP_TO_EDGE);
                        gl_1.texImage2D(gl_1.TEXTURE_2D, 0, gl_1.RGBA, gl_1.RGBA, gl_1.UNSIGNED_BYTE, data);
                    } else {
                        return 0;
                    }
                }
            }
            return this._textureID;
        };
        GLRenderNode.prototype.render = function () {
            if (true == this._needSort) {
                this._needSort = false;
                this._childrens.sort(function (a, b) {
                    return a._zOrder < b._zOrder ? 1 : 0;
                });
            }
            var width = this._localTransform.transform[0];
            var height = this._localTransform.transform[1];
            var indices = new Uint16Array([
                0,
                1,
                2,
                0,
                2,
                3
            ]);
            var vertices = new Float32Array([
                0,
                0,
                0,
                1,
                width,
                0,
                1,
                1,
                width,
                height,
                1,
                0,
                0,
                height,
                0,
                0
            ]);
            var textureID = this.loadTexture();
            if (textureID != 0) {
                this._context.drawMesh(vertices, indices, this.worldMatrix, textureID);
            }
            for (var i_3 = 0; i_3 < this._childrens.length; i_3++) {
                this._childrens[i_3].render();
            }
        };
        GLRenderNode.prototype.__log = function (str) {
            BK.Script.log(1, 1, 'GLRenderNode:' + str);
        };
        GLRenderNode.prototype.hittest = function (worldPoint) {
            var projMat = this._context.getProjection();
            var worldMat = this.worldMatrix;
            var pos1 = {
                x: 0,
                y: 0
            };
            var pos2 = {
                x: pos1.x + this.contentSize.width,
                y: pos1.y + this.contentSize.height
            };
            var pt1 = worldMat.mulPoint(pos1);
            var pt2 = worldMat.mulPoint(pos2);
            if (worldPoint.x >= pt1.x && worldPoint.x <= pt2.x && worldPoint.y >= pt1.y && worldPoint.y <= pt2.y) {
                return true;
            } else {
                return false;
            }
        };
        return GLRenderNode;
    }();
    return {
        'GLRenderNode': GLRenderNode,
        'GLRenderContext': GLRenderContext
    };
}));
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.GLRenderButton = factory();
    }
}(BK, function () {
    var GLRenderButton = function (_super) {
        __extends(GLRenderButton, _super);
        function GLRenderButton(ctx, width, height) {
            var _this = _super.call(this, ctx) || this;
            _this.updateTexture = function (touchStatus) {
                if (0 == touchStatus) {
                } else if (1 == touchStatus) {
                } else if (2 == touchStatus) {
                }
            };
            _this.__nativeObj = new BK.GLRenderNode(ctx);
            _this.contentSize = {
                width: width,
                height: height
            };
            _this.isCancelClick = undefined;
            _this.touchStatus = 0;
            _this.canUserInteract = true;
            _this.enable = true;
            _this.canClick = true;
            _this.addTouchListener();
            return _this;
        }
        ;
        GLRenderButton.prototype.addTouchListener = function () {
            if (typeof UIEventHandler == 'undefined') {
                BK.Script.log(1, 1, 'UIEventHandler is undefined');
                return;
            }
            UIEventHandler.addNodeEvent(this, 1, function (node, evt, x, y) {
                node.isCancelClick = false;
                if (node.enable) {
                    node.changeStatus(1);
                } else {
                    node.changeStatus(2);
                }
            }.bind(this));
            UIEventHandler.addNodeEvent(this, 2, function (node, evt, x, y) {
                var pt = {
                    x: x,
                    y: y
                };
                if (node.hittest(pt) == false) {
                    node.isCancelClick = true;
                }
            }.bind(this));
            UIEventHandler.addNodeEvent(this, 3, function (node, evt, x, y) {
                if (node.enable) {
                    node.changeStatus(0);
                } else {
                    node.changeStatus(2);
                }
                if (node.isCancelClick == false) {
                    if (node.touchInsideCallback) {
                        if (this.canClick == true) {
                            node.touchInsideCallback(node);
                        }
                    }
                }
            }.bind(this));
        };
        GLRenderButton.prototype.dispose = function () {
            UIEventHandler.removeNodeEvent(this, 1);
            UIEventHandler.removeNodeEvent(this, 2);
            UIEventHandler.removeNodeEvent(this, 3);
            _super.prototype.dispose.call(this);
        };
        GLRenderButton.prototype.changeStatus = function (status) {
            this.touchStatus = status;
            this.updateTexture(status);
        };
        ;
        GLRenderButton.prototype.setTouchInsideCallback = function (callback) {
            this.touchInsideCallback = callback;
        };
        ;
        return GLRenderButton;
    }(BK.GLRenderNode);
    return GLRenderButton;
}));
(function (global, factory) {
    if (typeof global === 'object') {
        var avObj = factory();
        global.QAVView = avObj['QAVView'];
        global.AVCamera = avObj['QAVCamera'];
    }
}(BK, function () {
    var yuv_vs = 'attribute vec3 Position;    attribute vec2 TexCoordIn;    attribute vec4 SourceColor;    uniform mat4 ModelView;    uniform mat4 Projection;    varying vec4 DestColor;    varying vec2 TexCoordOut;    void main()    {        mat4 gWVP = Projection * ModelView;        gl_Position = gWVP * vec4(Position, 1);        DestColor = SourceColor;        TexCoordOut = TexCoordIn;    }';
    var yuv_fs = 'varying lowp vec2 TexCoordOut;    uniform int formatYUV;    uniform sampler2D samplerY;    uniform sampler2D samplerU;    uniform sampler2D samplerV;    uniform sampler2D samplerUV;    const lowp vec3 defyuv = vec3(-0.0/255.0, -128.0/255.0, -128.0/255.0);    void main(void)    {        lowp vec3 yuv = vec3(0.0);        if (formatYUV == 0) {            yuv.x = texture2D(samplerY, TexCoordOut).r;            yuv.y = texture2D(samplerU, TexCoordOut).r;            yuv.z = texture2D(samplerV, TexCoordOut).r;            yuv += defyuv;        } else if (formatYUV == 1) {            yuv.x = texture2D(samplerY, TexCoordOut).r;            yuv.y = texture2D(samplerUV, TexCoordOut).a;            yuv.z = texture2D(samplerUV, TexCoordOut).r;            yuv += defyuv;        } else if (formatYUV == 3) {            yuv.x = texture2D(samplerY, TexCoordOut).r;            yuv.y = texture2D(samplerUV, TexCoordOut).r;            yuv.z = texture2D(samplerUV, TexCoordOut).a;            yuv += defyuv;        }        lowp vec3 rgb = mat3(1.0, 1.0, 1.0,                            0.0, -.34414, 1.772,                            1.402, -.71414, 0.0) * yuv;        gl_FragColor = vec4(rgb, 1.0);    }';
    var QAVFrameDesc = function () {
        function QAVFrameDesc() {
        }
        return QAVFrameDesc;
    }();
    var QAVVideoFrame = function () {
        function QAVVideoFrame() {
        }
        return QAVVideoFrame;
    }();
    var QAVManager = function () {
        function QAVManager() {
            this.videoViews = new Array();
            if (typeof BK.Director.setQAVDelegate != 'undefined') {
                BK.Director.setQAVDelegate(this);
            }
        }
        QAVManager.prototype.addView = function (view) {
            var resViews = this.videoViews.filter(function (view_) {
                return view == view_;
            });
            if (!resViews.length) {
                this.videoViews.push(view);
            }
            return resViews.length == 0;
        };
        QAVManager.prototype.delView = function (view) {
            var length = this.videoViews.length;
            this.videoViews = this.videoViews.filter(function (view_) {
                return view != view_;
            });
            return length != this.videoViews.length;
        };
        QAVManager.prototype.onRemoveVideoPreview = function (frameData) {
            this.videoViews.forEach(function (view) {
                if (view.identifier == frameData.identifier) {
                    view.render(frameData);
                }
            });
        };
        QAVManager.prototype.onLocalVideoPreview = function (frameData) {
            this.videoViews.forEach(function (view) {
                if (view.identifier == frameData.identifier) {
                    var videoFrame = frameData;
                    var cameraMgr = view;
                    if (cameraMgr.onPrePreview) {
                        videoFrame = cameraMgr.onPrePreview.call(cameraMgr, frameData);
                    }
                    view.render(videoFrame);
                }
            });
        };
        QAVManager.prototype.onLocalVideoPreProcess = function (frameData) {
            this.videoViews.forEach(function (view) {
                if (view.identifier == frameData.identifier) {
                    var cameraMgr = view;
                    if (cameraMgr.onPreProcess) {
                        cameraMgr.onPreProcess.call(cameraMgr, frameData);
                    }
                }
            });
        };
        return QAVManager;
    }();
    QAVManager.Instance = new QAVManager();
    var QAVView = function () {
        function QAVView(identifier, width, height, autoAddMgr, parent, position, zOrder) {
            this.identifier = identifier;
            this.__nativeObj = new BK.Sprite(width, height, null, 0, 0, 1, 1);
            this._innerBindMethods4NativeObj();
            if (autoAddMgr == null || autoAddMgr == undefined) {
                autoAddMgr = true;
            }
            if (position)
                this.position = position;
            if (parent)
                parent.addChild(this);
            else
                BK.Director.root.addChild(this);
            if (zOrder)
                this.zOrder = zOrder;
            if (autoAddMgr == true)
                QAVManager.Instance.addView(this);
        }
        QAVView.prototype._innerBindMethods4NativeObj = function (skipList) {
            var _this = this;
            var props = Object.getOwnPropertyNames(this.__nativeObj);
            props.forEach(function (curElemValue, curElemIdx, array) {
                var key = curElemValue;
                if (!skipList || skipList.indexOf(key) == -1) {
                    Object.defineProperty(_this, key, {
                        get: function () {
                            return this.__nativeObj[key];
                        },
                        set: function (value) {
                            this.__nativeObj[key] = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                }
            });
        };
        QAVView.prototype.addChild = function (node) {
            if (this.__nativeObj)
                this.__nativeObj.addChild(node);
        };
        QAVView.prototype._restartRenderTimer = function () {
            if (this.__renderTimeoutCallback && this.__renderTimeoutThreshold > 0) {
                BK.Director.ticker.removeTimeout(this);
                BK.Director.ticker.setTimeout(function (ts, dt, obj) {
                    if (this.__renderTimeoutCallback) {
                        this.__renderTimeoutCallback.call(this);
                    }
                }, this.__renderTimeoutThreshold, this);
            }
        };
        QAVView.prototype._innerUseRGBA = function (width, height) {
            if (!this.__bitmap) {
                this.__bitmap = BK.Texture.createBitmapTexture(width, height);
                this.__nativeObj.setTexture(this.__bitmap);
            } else {
                var size_1 = this.__bitmap.size;
                if (size_1.width != width || size_1.height != height) {
                    BK.Script.log(0, 0, 'BK.QAVView.useRGBA!size change, ow = ' + size_1.width + ', oh = ' + size_1.height + ', nw = ' + width + ', nh = ' + height);
                    this.__bitmap = BK.Texture.createBitmapTexture(width, height);
                    this.__nativeObj.setTexture(this.__bitmap);
                }
            }
        };
        QAVView.prototype._innerUseYUVMaterial_I420 = function (width, height) {
            if (!this.__yuvMaterial) {
                this.__yuvMaterial = new BK.Render.Material(yuv_vs, yuv_fs, true);
                this.__nativeObj.attachComponent(this.__yuvMaterial);
                this.__yuvMaterial.uniforms.samplerY = 0;
                this.__yuvMaterial.uniforms.samplerU = 1;
                this.__yuvMaterial.uniforms.samplerV = 2;
                this.__yuvMaterial.uniforms.samplerUV = 3;
            }
            if (!this.__bitmapY) {
                this.__bitmapY = BK.Texture.createBitmapTexture(width, height, 7);
                this.__yuvMaterial.setTexture(0, this.__bitmapY);
            } else {
                var size_2 = this.__bitmapY.size;
                if (size_2.width != width || size_2.height != height) {
                    BK.Script.log(0, 0, 'BK.QAVView.useYUVMaterial_I420!Y size change, ow = ' + size_2.width + ', oh = ' + size_2.height + ', nw = ' + width + ', nh = ' + height);
                    this.__bitmapY = BK.Texture.createBitmapTexture(width, height, 7);
                    this.__yuvMaterial.setTexture(0, this.__bitmapY);
                }
            }
            if (!this.__bitmapU) {
                this.__bitmapU = BK.Texture.createBitmapTexture(width / 2, height / 2, 7);
                this.__yuvMaterial.setTexture(1, this.__bitmapU);
            } else {
                var size_3 = this.__bitmapU.size;
                if (size_3.width != width / 2 || size_3.height != height / 2) {
                    BK.Script.log(0, 0, 'BK.QAVView.useYUVMaterial_I420!U size change, ow = ' + size_3.width + ', oh = ' + size_3.height + ', nw = ' + width + ', nh = ' + height);
                    this.__bitmapU = BK.Texture.createBitmapTexture(width / 2, height / 2, 7);
                    this.__yuvMaterial.setTexture(1, this.__bitmapU);
                }
            }
            if (!this.__bitmapV) {
                this.__bitmapV = BK.Texture.createBitmapTexture(width / 2, height / 2, 7);
                this.__yuvMaterial.setTexture(2, this.__bitmapV);
            } else {
                var size_4 = this.__bitmapV.size;
                if (size_4.width != width / 2 || size_4.height != height / 2) {
                    BK.Script.log(0, 0, 'BK.QAVView.useYUVMaterial_I420!V size change, ow = ' + size_4.width + ', oh = ' + size_4.height + ', nw = ' + width + ', nh = ' + height);
                    this.__bitmapV = BK.Texture.createBitmapTexture(width / 2, height / 2, 7);
                    this.__yuvMaterial.setTexture(2, this.__bitmapV);
                }
            }
        };
        QAVView.prototype._innerUseYUVMaterial_NVxx = function (width, height) {
            if (!this.__yuvMaterial) {
                this.__yuvMaterial = new BK.Render.Material(yuv_vs, yuv_fs, true);
                this.__nativeObj.attachComponent(this.__yuvMaterial);
                this.__yuvMaterial.uniforms.samplerY = 0;
                this.__yuvMaterial.uniforms.samplerU = 1;
                this.__yuvMaterial.uniforms.samplerV = 2;
                this.__yuvMaterial.uniforms.samplerUV = 3;
            }
            if (!this.__bitmapY) {
                this.__bitmapY = BK.Texture.createBitmapTexture(width, height, 7);
                this.__yuvMaterial.setTexture(0, this.__bitmapY);
            } else {
                var size_5 = this.__bitmapY.size;
                if (size_5.width != width || size_5.height != height) {
                    BK.Script.log(0, 0, 'BK.QAVView.useYUVMaterial_NVxx!Y size change, ow = ' + size_5.width + ', oh = ' + size_5.height + ', nw = ' + width + ', nh = ' + height);
                    this.__bitmapY = BK.Texture.createBitmapTexture(width, height, 7);
                    this.__yuvMaterial.setTexture(0, this.__bitmapY);
                }
            }
            if (!this.__bitmapUV) {
                this.__bitmapUV = BK.Texture.createBitmapTexture(width / 2, height / 2, 2);
                this.__yuvMaterial.setTexture(3, this.__bitmapUV);
            } else {
                var size_6 = this.__bitmapUV.size;
                if (size_6.width != width / 2 || size_6.height != height / 2) {
                    BK.Script.log(0, 0, 'BK.QAVView.useYUVMaterial_NVxx!UV size change, ow = ' + size_6.width + ', oh = ' + size_6.height + ', nw = ' + width + ', nh = ' + height);
                    this.__bitmapUV = BK.Texture.createBitmapTexture(width / 2, height / 2, 2);
                    this.__yuvMaterial.setTexture(3, this.__bitmapUV);
                }
            }
        };
        QAVView.prototype.render = function (frameData) {
            var width = frameData.frameDesc.width;
            var height = frameData.frameDesc.height;
            if (this.__nativeObj) {
                this._restartRenderTimer();
                switch (frameData.frameDesc.rotate) {
                case 0: {
                        if (this.cameraPos && this.cameraPos == 1) {
                            this.__nativeObj.setUVFlip(1, 0);
                        } else {
                            this.__nativeObj.setUVFlip(1, 1);
                        }
                        break;
                    }
                case 1: {
                        if (this.cameraPos && this.cameraPos == 1) {
                            this.__nativeObj.setUVFlip(0, 1);
                            this.__nativeObj.setUVRotate(1);
                        } else {
                            this.__nativeObj.setUVFlip(0, 0);
                            this.__nativeObj.setUVRotate(1);
                        }
                        break;
                    }
                case 2: {
                        if (this.cameraPos && this.cameraPos == 1) {
                            this.__nativeObj.setUVFlip(0, 1);
                            this.__nativeObj.setUVRotate(1);
                        } else {
                            this.__nativeObj.setUVFlip(0, 0);
                            this.__nativeObj.setUVRotate(1);
                        }
                        break;
                    }
                case 3: {
                        if (this.cameraPos && this.cameraPos == 1) {
                            this.__nativeObj.setUVFlip(0, 1);
                            this.__nativeObj.setUVRotate(3);
                        } else {
                            this.__nativeObj.setUVFlip(0, 0);
                            this.__nativeObj.setUVRotate(3);
                        }
                        break;
                    }
                }
                switch (frameData.frameDesc.colorFormat) {
                case 10: {
                        this._innerUseRGBA(width, height);
                        this.__bitmap.uploadSubData(0, 0, width, height, frameData.extraData.buffer);
                        break;
                    }
                case 0: {
                        this._innerUseYUVMaterial_I420(width, height);
                        this.__yuvMaterial.uniforms.formatYUV = frameData.frameDesc.colorFormat;
                        this.__bitmapY.uploadSubData(0, 0, width, height, frameData.extraData.Y);
                        this.__bitmapU.uploadSubData(0, 0, width / 2, height / 2, frameData.extraData.U);
                        this.__bitmapV.uploadSubData(0, 0, width / 2, height / 2, frameData.extraData.V);
                        break;
                    }
                case 3:
                case 1: {
                        this._innerUseYUVMaterial_NVxx(width, height);
                        this.__yuvMaterial.uniforms.formatYUV = frameData.frameDesc.colorFormat;
                        this.__bitmapY.uploadSubData(0, 0, width, height, frameData.extraData.Y);
                        this.__bitmapUV.uploadSubData(0, 0, width / 2, height / 2, frameData.extraData.UV);
                        break;
                    }
                default: {
                        BK.Script.log(1, -1, 'BK.QAVView.render!unknown format = ' + frameData.frameDesc.colorFormat);
                    }
                }
            }
        };
        QAVView.prototype.renderAsCache = function (texW, texH, dstW, dstH, rotate, format, dstFormat, extraData) {
            switch (format) {
            case 0: {
                    this._innerUseYUVMaterial_I420(texW, texH);
                    this.__yuvMaterial.uniforms.formatYUV = format;
                    this.__bitmapY.uploadSubData(0, 0, texW, texH, extraData.Y);
                    this.__bitmapU.uploadSubData(0, 0, texW / 2, texH / 2, extraData.U);
                    this.__bitmapV.uploadSubData(0, 0, texW / 2, texH / 2, extraData.V);
                    break;
                }
            case 3:
            case 1: {
                    this._innerUseYUVMaterial_NVxx(texW, texH);
                    this.__yuvMaterial.uniforms.formatYUV = format;
                    this.__bitmapY.uploadSubData(0, 0, texW, texH, extraData.Y);
                    this.__bitmapUV.uploadSubData(0, 0, texW / 2, texH / 2, extraData.UV);
                    break;
                }
            default: {
                    BK.Script.log(1, -1, 'BK.QAVView.renderAsCache!unknown format = ' + format);
                    return null;
                }
            }
            if (!this.__graphic) {
                this.__graphic = new BK.Graphics();
            }
            if (!this.__cacheTexture) {
                this.__cacheTexture = new BK.RenderTexture(dstW, dstH, dstFormat);
            } else {
                var size_7 = this.__cacheTexture.size;
                if (size_7.width != dstW || size_7.height != dstH) {
                    BK.Script.log(0, 0, 'BK.QAVView.renderAsCache!cache tex size change, ow = ' + size_7.width + ', oh = ' + size_7.height + ', nw = ' + dstW + ', nh = ' + dstH);
                    this.__cacheTexture = new BK.RenderTexture(dstW, dstH, dstFormat);
                }
            }
            if (!this.__cacheSprite) {
                this.__cacheSprite = new BK.Sprite(dstW, dstH, null, 0, 0, 1, 1);
                this.__cacheSprite.attachComponent(this.__yuvMaterial);
            } else {
                var size_8 = this.__cacheSprite.size;
                if (size_8.width != dstW || size_8.height != dstH) {
                    this.__cacheSprite.size = {
                        'width': dstW,
                        'height': dstH
                    };
                }
            }
            switch (rotate) {
            case 0: {
                    this.__cacheSprite.setUVFlip(1, 0);
                    this.__cacheSprite.setUVRotate(0);
                    break;
                }
            case 1: {
                    this.__cacheSprite.setUVFlip(1, 0);
                    this.__cacheSprite.setUVRotate(1);
                    break;
                }
            case 2: {
                    this.__cacheSprite.setUVFlip(0, 1);
                    this.__cacheSprite.setUVRotate(0);
                    break;
                }
            case 3: {
                    this.__cacheSprite.setUVFlip(1, 0);
                    this.__cacheSprite.setUVRotate(4);
                    break;
                }
            }
            var _this = this;
            this.__graphic.drawRenderTexture(this.__cacheTexture, function () {
                this.drawSprite(_this.__cacheSprite);
            });
            var buffer = this.__cacheTexture.readPixels(0, 0, dstW, dstH, dstFormat);
            return buffer;
        };
        QAVView.prototype.renderAsTexture = function () {
            var renderTexture = new BK.RenderTexture(this.__nativeObj.size.width, this.__nativeObj.size.height, 6);
            BK.Render.renderToTexture(this.__nativeObj, renderTexture);
            return renderTexture;
        };
        QAVView.prototype.hittest = function (pt) {
            return this.__nativeObj.hittest(pt);
        };
        QAVView.prototype.removeFromParent = function () {
            if (this.__nativeObj) {
                this.__nativeObj.removeFromParent();
            }
        };
        QAVView.prototype.setRenderTimeout = function (timeout, callback) {
            this.__renderTimeoutCallback = callback;
            this.__renderTimeoutThreshold = timeout;
            if (this.__renderTimeoutThreshold > 0) {
                this._restartRenderTimer();
            }
        };
        return QAVView;
    }();
    ;
    var QAVCamera = function () {
        function QAVCamera() {
            this.skipNum = -1;
        }
        QAVCamera.prototype.start = function (options) {
            var identifier = options.identifier ? options.identifier : '';
            if (!options.width)
                return undefined;
            if (!options.height)
                return undefined;
            BK.Script.log(1, 0, 'BK.Camera!options = ' + JSON.stringify(options));
            this.options = options;
            this.identifier = identifier;
            this.view = new QAVView(identifier, options.width, options.height, false, options.parent, options.position);
            QAVManager.Instance.addView(this);
            if (this.options.needFaceTracker) {
                this.detector = new BK.AI.FaceDetector(true, true);
            }
            function switchCameraEvent(errCode, cmd, data) {
                BK.Script.log(0, 0, 'BK.Camera.switchCameraEvent222!data = ' + JSON.stringify(data));
                if (errCode == 0) {
                    BK.Script.log(0, 0, 'BK.Camera.switchCameraEvent!data = ' + JSON.stringify(data));
                    var _this_1 = this;
                    BK.Director.ticker.removeTimeout(this);
                    BK.Director.ticker.setTimeout(function (ts, dt, object) {
                        _this_1.view.cameraPos = data.cameraPos;
                        _this_1 = null;
                    }, 16 * 10, this);
                }
            }
            var cmd = 'cs.audioRoom_camera_switch.local';
            BK.MQQ.SsoRequest.addListener(cmd, this, switchCameraEvent.bind(this));
            this.isStart = false;
            return this;
        };
        QAVCamera.prototype.configCamera = function (opts) {
            if (opts) {
                BK.Script.log(0, 0, 'configCamera');
                BK.Script.log(0, 0, 'configCamera BK.Room ok1');
                if (opts.beauty) {
                    BK.Script.log(0, 0, 'configCamera BK.Room audioRoomSetBeauty1');
                    this.setBeauty(opts.beauty);
                }
                if (opts.cameraPos) {
                    BK.Script.log(0, 0, 'configCamera BK.Room cameraPos');
                    var cb = opts.onSwitchCamera ? opts.onSwitchCamera.bind(this) : undefined;
                    this.switchCamera(opts.cameraPos, function (errCode, cmd, data) {
                        BK.Script.log(0, 0, 'configCamera BK.Room cameraPos errCode:' + errCode + ' cmd:' + cmd + ' data:' + data);
                        if (this.options.onSwitchCamera) {
                            this.options.onSwitchCamera(errCode, cmd, data);
                        }
                    });
                }
            }
        };
        QAVCamera.prototype.switchCamera = function (cameraPos, callback) {
            var data = { cameraPos: cameraPos };
            var cmd = 'cs.audioRoom_cameraswitch.local';
            BK.MQQ.SsoRequest.addListener(cmd, this, callback.bind(this));
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAVCamera.prototype.setBeauty = function (beauty) {
            var data = { 'beauty': beauty };
            BK.MQQ.SsoRequest.send(data, 'cs.audioRoom_set_beauty.local');
        };
        QAVCamera.prototype.setSpeaker = function (sw) {
            var data = { 'speaker': sw };
            BK.MQQ.SsoRequest.send(data, 'cs.audioRoom_set_speaker.local');
        };
        QAVCamera.prototype.close = function () {
        };
        QAVCamera.prototype._innerConvertRGBA = function (frameData) {
            function _innerGetSize(width, height, rotate) {
                var size = {
                    'width': width,
                    'height': height
                };
                switch (rotate) {
                case 1:
                case 3: {
                        size.width = height;
                        size.height = width;
                        break;
                    }
                }
                return size;
            }
            var scale = this.options.scaleSample ? this.options.scaleSample : 1;
            var width = frameData.frameDesc.width;
            var height = frameData.frameDesc.height;
            var newSize = _innerGetSize(frameData.frameDesc.width, frameData.frameDesc.height, frameData.frameDesc.rotate);
            var videoFrame = {};
            videoFrame.frameDesc = {};
            videoFrame.extraData = {};
            videoFrame.frameDesc.width = newSize.width * scale;
            videoFrame.frameDesc.height = newSize.height * scale;
            videoFrame.frameDesc.rotate = 0;
            videoFrame.frameDesc.colorFormat = 10;
            videoFrame.frameDesc.videoSrcType = frameData.frameDesc.videoSrcType;
            videoFrame.extraData.buffer = this.view.renderAsCache(width, height, newSize.width * scale, newSize.height * scale, frameData.frameDesc.rotate, frameData.frameDesc.colorFormat, 6, frameData.extraData);
            return videoFrame;
        };
        QAVCamera.prototype.onPrePreview = function (frameData) {
            if (this.options.onPrePreview) {
                var videoFrame = frameData;
                if (this.detector) {
                    videoFrame = this._innerConvertRGBA(frameData);
                    var bitmap = this._innerExtractBitmap(videoFrame);
                    if (this.hasFace || this.skipNum == -1) {
                        this.skipNum = 0;
                        videoFrame.faceFeatures = this.detector.detectForBitmapSync(bitmap);
                    }
                    if (videoFrame.faceFeatures == undefined || videoFrame.faceFeatures.length <= 0) {
                        this.hasFace = false;
                        this.skipNum = this.skipNum + 1;
                        if (this.skipNum > this.options.skipFaceTrackerNum || this.skipNum == this.options.skipFaceTrackerNum) {
                            videoFrame.faceFeatures = this.detector.detectForBitmapSync(bitmap);
                            this.skipNum = 0;
                            if (videoFrame.faceFeatures) {
                                this.hasFace = true;
                            }
                        }
                    } else {
                        this.hasFace = true;
                    }
                }
                this.options.onPrePreview.call(this, videoFrame);
            }
            if (this.isStart == false) {
                this.configCamera(this.options);
                this.isStart = true;
            }
            return frameData;
        };
        QAVCamera.prototype.onPreProcess = function (frameData) {
            if (this.options.onPreProcess) {
                return this.options.onPreProcess.call(this, frameData);
            }
            return frameData;
        };
        QAVCamera.prototype.render = function (frameData) {
            if (this.view) {
                this.view.render(frameData);
            }
        };
        QAVCamera.prototype.renderAsTexture = function () {
            if (this.view) {
                return this.view.renderAsTexture();
            }
            return null;
        };
        QAVCamera.prototype._innerExtractBitmap = function (frameData) {
            var bmp = {};
            bmp.width = frameData.frameDesc.width;
            bmp.height = frameData.frameDesc.height;
            bmp.format = frameData.frameDesc.colorFormat;
            switch (frameData.frameDesc.colorFormat) {
            case 7: {
                    bmp.format = 3;
                    break;
                }
            case 10: {
                    bmp.buffer = frameData.extraData.buffer;
                    bmp.format = 6;
                    break;
                }
            default: {
                    BK.Script.log(1, -1, 'BK.QAVCamera.extractBitmap!unknown format = ' + frameData.frameDesc.colorFormat);
                    break;
                }
            }
            switch (frameData.frameDesc.rotate) {
            case 0: {
                    bmp.oreintation = 0;
                    break;
                }
            case 1: {
                    bmp.oreintation = 1;
                    break;
                }
            case 2: {
                    bmp.oreintation = 5;
                    break;
                }
            case 3: {
                    bmp.oreintation = 6;
                    break;
                }
            }
            return bmp;
        };
        return QAVCamera;
    }();
    QAVCamera.Instance = new QAVCamera();
    return {
        'QAVView': QAVView,
        'QAVCamera': new QAVCamera()
    };
}));
(function (global, factory) {
    if (typeof global === 'object') {
        BK.QQAVManager = factory();
    }
}(BK, function () {
    ;
    var QAV = function () {
        function QAV() {
            this._hasInitFlag = false;
            this._hasSuccEnter = false;
            this._iosHasInitFlag = false;
            this._isFrontCamera = false;
            this._hasStartQAVRoomFlag = false;
            this._callbackQueue = [];
            BK.MQQ.SsoRequest.addListener('cs.audioRoom_disconnect.local', this, this.__handleRoomDisconnect.bind(this));
            BK.MQQ.SsoRequest.addListener('cs.audioRoom_update_userinfo.local', this, this.__handleUserUpdate.bind(this));
        }
        QAV.prototype.log = function (str) {
            BK.Script.log(0, 0, 'QQAVManager:' + str);
        };
        QAV.prototype.errorLog = function (str) {
            BK.Script.log(1, 1, 'QQAVManager Error:' + str);
        };
        QAV.prototype.setQAVCfg = function (cfg) {
            this.qavCfg = cfg;
        };
        QAV.prototype.setUpdateUserInfoCallback = function (callback) {
            var cmd = 'cs.audioRoom_update_userinfo.local';
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        };
        QAV.prototype.setEventCallbackConfig = function (callbackCfg) {
            this.eventCallbackConfig = callbackCfg;
        };
        QAV.prototype.initQAV = function (cfg, callback) {
            this.setQAVCfg(cfg);
            this.__startQAVRoom(callback);
        };
        QAV.prototype.setMic = function (sw, callback) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = { 'switch': sw };
                    var cmd = 'cs.audioRoom_set_mic.local';
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
                    BK.MQQ.SsoRequest.send(data, cmd);
                } else {
                    this.errorLog('setMic failed!start qav room failed');
                }
            }.bind(this));
        };
        QAV.prototype.setSpeaker = function (sw, callback) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = { 'switch': sw };
                    var cmd = 'cs.audioRoom_set_speaker.local';
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
                    BK.MQQ.SsoRequest.send(data, cmd);
                } else {
                    this.errorLog('setSpeaker failed!start qav room failed');
                }
            }.bind(this));
        };
        QAV.prototype.switchCamera = function (cameraPos, callback) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = { 'cameraPos': cameraPos };
                    var cmd = 'cs.audioRoom_camera_switch.local';
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                    BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                        if (errCode == 0) {
                            if (cameraPos == 0) {
                                this._isFrontCamera = true;
                            } else {
                                this._isFrontCamera = false;
                            }
                        }
                        callback(errCode, cmd, data);
                    }.bind(this));
                    BK.MQQ.SsoRequest.send(data, cmd);
                } else {
                    this.errorLog('switchCamera failed!start qav room failed');
                }
            }.bind(this));
        };
        QAV.prototype.enableCamera = function (enable, callback) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = { 'switch': enable };
                    var cmd = 'cs.audioRoom_camera_enable.local';
                    this._isFrontCamera = true;
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
                    BK.MQQ.SsoRequest.send(data, cmd);
                } else {
                    this.errorLog('enableCamera failed!start qav room failed');
                }
            }.bind(this));
        };
        QAV.prototype.setBeauty = function (beauty) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = { 'beauty': beauty };
                    BK.MQQ.SsoRequest.send(data, 'cs.audioRoom_set_beauty.local');
                } else {
                    this.errorLog('setBeauty failed!start qav room failed');
                }
            }.bind(this));
        };
        QAV.prototype.setLocalVideo = function (sw) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = { 'switch': sw };
                    var cmd = 'cs.audioRoom_set_local_video.local';
                    BK.MQQ.SsoRequest.send(data, cmd);
                } else {
                    this.errorLog('setLocalVideo failed!start qav room failed');
                }
            }.bind(this));
        };
        QAV.prototype.watchRemoteVideo = function (openIdList) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    this.log('watchRemoteVideo ok1');
                    var data = { 'openIdList': openIdList };
                    var cmd = 'cs.audioRoom_watch_remote_video.local';
                    BK.MQQ.SsoRequest.send(data, cmd);
                    this.log('watchRemoteVideo ok2');
                } else {
                    this.errorLog('watchRemoteVideo failed!start qav room failed');
                }
            }.bind(this));
        };
        QAV.prototype.setRemoteVideo = function (sw) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = { 'switch': sw };
                    var cmd = 'cs.audioRoom_set_remote_video.local';
                    BK.MQQ.SsoRequest.send(data, cmd);
                } else {
                    this.errorLog('setMic failed!start qav room failed');
                }
            }.bind(this));
        };
        QAV.prototype.exitRoom = function (callbck) {
            this._hasInitFlag = false;
            this.__exitQAVRoom(function (errCode, cmd, data) {
                this.log('exit qav room errCode:' + errCode);
                callbck(errCode, cmd, data);
            }.bind(this));
        };
        QAV.prototype.getEndpointList = function (callback) {
            var data = {};
            var cmd = 'cs.audioRoom_get_endpointList.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.isFrontCamera = function () {
            return this._isFrontCamera;
        };
        QAV.prototype.getFluidCtrlCfg = function (data, callback) {
            var cmd = 'cs.audioRoom_get_fluid_ctrl_cfg.local';
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.changeAudioCategory = function (category, callback) {
            var cmd = 'cs.audioRoom_change_audio_category.local';
            var data = { category: category };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.changeQAVRole = function (role, callback) {
            var cmd = 'cs.audioRoom_change_qav_role.local';
            var data = { role: role };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.__enterQAVRoomIfNeed = function (callback) {
            if (!this._hasSuccEnter) {
                this.log('__enterQAVRoomIfNeed entering qav room.');
                this._callbackQueue.push(callback);
                if (this._hasStartQAVRoomFlag == false) {
                    this._hasStartQAVRoomFlag = true;
                    this.__startQAVRoom(function (errCode, cmd, data) {
                        for (var index_1 = 0; index_1 < this._callbackQueue.length; index_1++) {
                            var tmpCB = this._callbackQueue[index_1];
                            tmpCB(errCode);
                        }
                        this._callbackQueue.splice(0, this._callbackQueue.length);
                    }.bind(this));
                }
            } else {
                callback(0);
            }
        };
        QAV.prototype.initQAVRoom = function (cfg, callback) {
            var cmd = 'cs.audioRoom_init.local';
            if (GameStatusInfo.platform == 'ios' && this._iosHasInitFlag == true) {
                this.log('ios init once ');
                callback(0, cmd, this._initData);
                return;
            }
            if (this._hasInitFlag == true) {
                this.log('AVRoom has been init .can\'t init Room twice !!');
                return;
            }
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                this.log('cmd:' + cmd + ' errCode:' + errCode + ' data:' + JSON.stringify(data));
                if (errCode == 0) {
                    this._hasInitFlag = true;
                    this._initData = data;
                    if (GameStatusInfo.platform == 'ios') {
                        this._iosHasInitFlag = true;
                        this.log('_iosHasInitFlag');
                    }
                }
                callback(errCode, cmd, data);
            }.bind(this));
            BK.MQQ.SsoRequest.send(cfg, cmd);
        };
        QAV.prototype.enterQAVRoom = function (cfg, callback) {
            var roomId = cfg.gameRoomId;
            var avRoomId = cfg.avRoomId;
            var avRoleName = cfg.avRoleName;
            var avKey = cfg.avKey;
            var data = {
                'avRoomId': avRoomId,
                'gameRoomId': roomId,
                'avRoleName': avRoleName,
                'avKey': avKey
            };
            this.avRoomId = avRoomId;
            this.gameRoomId = roomId;
            this.avRoleName = avRoleName;
            var cmd = 'cs.audioRoom_enter.local';
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                this.log('cmd:' + cmd + ' errCode:' + errCode + ' data:' + JSON.stringify(data));
                callback(errCode, cmd, data);
            }.bind(this));
            BK.MQQ.SsoRequest.send(data, cmd);
            BK.MQQ.SsoRequest.removeListener('cs.close_room.local', this);
            BK.MQQ.SsoRequest.addListener('cs.close_room.local', this, function (errCode, cmd, data) {
                this.log('BK.QAVManager.closeGame!exitQAVRoom, avRoomId = ' + this.avRoomId);
                this.__exitQAVRoom();
            }.bind(this));
            BK.MQQ.SsoRequest.removeListener('cs.audioRoom_req_audio_session.local', this);
            BK.MQQ.SsoRequest.addListener('cs.audioRoom_req_audio_session.local', this, function (errCode, cmd, data) {
                this.log('BK.QAVManager.reqAudioSession!result = ' + JSON.stringify(data));
            }.bind(this));
        };
        QAV.prototype.__exitQAVRoom = function (callback) {
            var data = { 'avRoomId': this.avRoomId };
            var cmd = 'cs.audioRoom_exit.local';
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.__checkGameStatusInfoParam = function () {
            if (!GameStatusInfo.avAppId) {
                this.log('GameStatusInfo.avAppId is null');
                return null;
            }
            if (!GameStatusInfo.avAccountType) {
                this.log('GameStatusInfo.avAccountType is null');
                return null;
            }
            if (!GameStatusInfo.avRoomId) {
                this.log('GameStatusInfo.avRoomId is null');
                return null;
            }
            if (!GameStatusInfo.roomId) {
                this.log('GameStatusInfo.roomId is null');
                return null;
            }
            var cfg = {
                sdkAppId: GameStatusInfo.avAppId,
                accountType: GameStatusInfo.avAccountType,
                avRoomId: GameStatusInfo.avRoomId,
                gameRoomId: GameStatusInfo.roomId
            };
            return cfg;
        };
        QAV.prototype.__addQAVCfg = function (cfg) {
            if (this.qavCfg) {
                for (var key_1 in this.qavCfg) {
                    if (this.qavCfg.hasOwnProperty(key_1)) {
                        var element_1 = this.qavCfg[key_1];
                        cfg[key_1] = element_1;
                    }
                }
            }
            return cfg;
        };
        QAV.prototype.__startQAVRoom = function (callback) {
            if (!GameStatusInfo.devPlatform) {
                var cfg = this.__checkGameStatusInfoParam();
                if (cfg) {
                    cfg = this.__addQAVCfg(cfg);
                    this.initAndEnterRoom(cfg, function (errCode, cmd, data) {
                        callback(errCode, cmd, data);
                    }.bind(this));
                } else {
                    BK.QQ.addSSOJoinRoomCallBack(function (err, cmd, data) {
                        if (data.gameRoomId && data.avRoomId && data.sdkAppId && data.accountType) {
                            data = this.__addQAVCfg(data);
                            this.initAndEnterRoom(data, callback);
                        } else {
                            BK.Script.log(0, 0, 'addSSOJoinRoomCallBack data is incorrect.');
                        }
                    }.bind(this));
                }
            } else {
                var cfg = {
                    sdkAppId: 1400035750,
                    accountType: 14181,
                    avRoomId: 122333,
                    gameRoomId: 54321,
                    selfOpenId: GameStatusInfo.openId
                };
                cfg = this.__addQAVCfg(cfg);
                this.initAndEnterRoom(cfg, callback);
            }
        };
        QAV.prototype.initAndEnterRoom = function (cfg, callback) {
            if (cfg.sdkAppId == undefined) {
                this.log('initAndEnterRoom sdkAppId is null;');
                return;
            }
            if (cfg.accountType == undefined) {
                this.log('initAndEnterRoom accountType is null;');
                return;
            }
            if (cfg.avRoomId == undefined) {
                this.log('initAndEnterRoom avRoomId is null;');
                return;
            }
            if (cfg.gameRoomId == undefined) {
                this.log('initAndEnterRoom gameRoomId is null;');
                return;
            }
            this.setQAVCfg(cfg);
            this.log('initAndEnterRoom step1 initRoom cfg:' + JSON.stringify(cfg));
            this.initQAVRoom(cfg, function (initErrCode, initCmd, initData) {
                if (initErrCode == 0) {
                    this.log('initAndEnterRoom step2 enterRoom');
                    this.enterQAVRoom(cfg, function (errCode, cmd, data) {
                        if (errCode == 0) {
                            this.log('initAndEnterRoom step2 enterRoom succ!');
                            this._hasSuccEnter = true;
                        } else {
                            this._hasStartQAVRoomFlag = false;
                        }
                        callback(errCode, cmd, data);
                    }.bind(this));
                } else {
                    this.log('initAndEnterRoom failed cmd:' + initCmd + ' errCode:' + initErrCode + ' data:' + JSON.stringify(initData));
                    this._hasStartQAVRoomFlag = false;
                    callback(initErrCode, initCmd, initData);
                }
            }.bind(this));
        };
        QAV.prototype.__handleUserUpdate = function (errCode, cmd, data) {
            if (data) {
                this.log('handleUserUpdate data:' + JSON.stringify(data));
                if (data.eventId == 1) {
                    this.log('进入房间事件:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventEnterCallback) {
                        this.eventCallbackConfig.eventEnterCallback(data.eventId, data);
                    }
                } else if (data.eventId == 2) {
                    this.log('退出房间事件:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventExitCallback) {
                        this.eventCallbackConfig.eventExitCallback(data.eventId, data);
                    }
                } else if (data.eventId == 3) {
                    this.log('有发摄像头视频事件\u3002:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasCameraVideoCallback) {
                        this.eventCallbackConfig.eventHasCameraVideoCallback(data.eventId, data);
                    }
                } else if (data.eventId == 4) {
                    this.log('无发摄像头视频事件\u3002:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoCameraVideoCallback) {
                        this.eventCallbackConfig.eventNoCameraVideoCallback(data.eventId, data);
                    }
                } else if (data.eventId == 5) {
                    this.log('有发语音事件\u3002:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasAudioCallback) {
                        this.eventCallbackConfig.eventHasAudioCallback(data.eventId, data);
                    }
                } else if (data.eventId == 6) {
                    this.log('无发语音事件\u3002:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoAudioCallback) {
                        this.eventCallbackConfig.eventNoAudioCallback(data.eventId, data);
                    }
                } else if (data.eventId == 7) {
                    this.log('有发屏幕视频事件\u3002:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasScreenVideoCallback) {
                        this.eventCallbackConfig.eventHasScreenVideoCallback(data.eventId, data);
                    }
                } else if (data.eventId == 8) {
                    this.log('无发屏幕视频事件\u3002:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoScreenVideoCallback) {
                        this.eventCallbackConfig.eventNoScreenVideoCallback(data.eventId, data);
                    }
                } else if (data.eventId == 9) {
                    this.log('有发文件视频事件\u3002:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasMediaFileCallback) {
                        this.eventCallbackConfig.eventHasMediaFileCallback(data.eventId, data);
                    }
                } else if (data.eventId == 10) {
                    this.log('无发文件视频事件\u3002:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoMediaFileCallback) {
                        this.eventCallbackConfig.eventNoMediaFileCallback(data.eventId, data);
                    }
                } else if (data.eventId == 42) {
                    this.log('新成员说话:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNewSpeakCallback) {
                        this.eventCallbackConfig.eventNewSpeakCallback(data.eventId, data);
                    }
                } else if (data.eventId == 43) {
                    this.log('旧成员停止说话:' + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventOldStopSpeakCallback) {
                        this.eventCallbackConfig.eventOldStopSpeakCallback(data.eventId, data);
                    }
                }
            }
        };
        QAV.prototype.__handleRoomDisconnect = function (errCode, cmd, data) {
            if (this.eventCallbackConfig && this.eventCallbackConfig.eventRoomDisconnectCallback) {
                this.eventCallbackConfig.eventRoomDisconnectCallback(data);
            }
        };
        return QAV;
    }();
    return new QAV();
}));
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.QRCode = factory();
    }
}(BK, function () {
    function QR8bitByte(data) {
        this.mode = QRMode.MODE_8BIT_BYTE;
        this.data = data;
        this.parsedData = [];
        for (var i = 0, l = this.data.length; i < l; i++) {
            var byteArray = [];
            var code = this.data.charCodeAt(i);
            if (code > 65536) {
                byteArray[0] = 240 | (code & 1835008) >>> 18;
                byteArray[1] = 128 | (code & 258048) >>> 12;
                byteArray[2] = 128 | (code & 4032) >>> 6;
                byteArray[3] = 128 | code & 63;
            } else if (code > 2048) {
                byteArray[0] = 224 | (code & 61440) >>> 12;
                byteArray[1] = 128 | (code & 4032) >>> 6;
                byteArray[2] = 128 | code & 63;
            } else if (code > 128) {
                byteArray[0] = 192 | (code & 1984) >>> 6;
                byteArray[1] = 128 | code & 63;
            } else {
                byteArray[0] = code;
            }
            this.parsedData.push(byteArray);
        }
        this.parsedData = Array.prototype.concat.apply([], this.parsedData);
        if (this.parsedData.length != this.data.length) {
            this.parsedData.unshift(191);
            this.parsedData.unshift(187);
            this.parsedData.unshift(239);
        }
    }
    QR8bitByte.prototype = {
        getLength: function (buffer) {
            return this.parsedData.length;
        },
        write: function (buffer) {
            for (var i = 0, l = this.parsedData.length; i < l; i++) {
                buffer.put(this.parsedData[i], 8);
            }
        }
    };
    function QRCodeModel(typeNumber, errorCorrectLevel) {
        this.typeNumber = typeNumber;
        this.errorCorrectLevel = errorCorrectLevel;
        this.modules = null;
        this.moduleCount = 0;
        this.dataCache = null;
        this.dataList = [];
    }
    QRCodeModel.prototype = {
        addData: function (data) {
            var newData = new QR8bitByte(data);
            this.dataList.push(newData);
            this.dataCache = null;
        },
        isDark: function (row, col) {
            if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
                throw new Error(row + ',' + col);
            }
            return this.modules[row][col];
        },
        getModuleCount: function () {
            return this.moduleCount;
        },
        make: function () {
            this.makeImpl(false, this.getBestMaskPattern());
        },
        makeImpl: function (test, maskPattern) {
            this.moduleCount = this.typeNumber * 4 + 17;
            this.modules = new Array(this.moduleCount);
            for (var row = 0; row < this.moduleCount; row++) {
                this.modules[row] = new Array(this.moduleCount);
                for (var col = 0; col < this.moduleCount; col++) {
                    this.modules[row][col] = null;
                }
            }
            this.setupPositionProbePattern(0, 0);
            this.setupPositionProbePattern(this.moduleCount - 7, 0);
            this.setupPositionProbePattern(0, this.moduleCount - 7);
            this.setupPositionAdjustPattern();
            this.setupTimingPattern();
            this.setupTypeInfo(test, maskPattern);
            if (this.typeNumber >= 7) {
                this.setupTypeNumber(test);
            }
            if (this.dataCache == null) {
                this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
            }
            this.mapData(this.dataCache, maskPattern);
        },
        setupPositionProbePattern: function (row, col) {
            for (var r = -1; r <= 7; r++) {
                if (row + r <= -1 || this.moduleCount <= row + r)
                    continue;
                for (var c = -1; c <= 7; c++) {
                    if (col + c <= -1 || this.moduleCount <= col + c)
                        continue;
                    if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
                        this.modules[row + r][col + c] = true;
                    } else {
                        this.modules[row + r][col + c] = false;
                    }
                }
            }
        },
        getBestMaskPattern: function () {
            var minLostPoint = 0;
            var pattern = 0;
            for (var i = 0; i < 8; i++) {
                this.makeImpl(true, i);
                var lostPoint = QRUtil.getLostPoint(this);
                if (i == 0 || minLostPoint > lostPoint) {
                    minLostPoint = lostPoint;
                    pattern = i;
                }
            }
            return pattern;
        },
        createMovieClip: function (target_mc, instance_name, depth) {
            var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
            var cs = 1;
            this.make();
            for (var row = 0; row < this.modules.length; row++) {
                var y = row * cs;
                for (var col = 0; col < this.modules[row].length; col++) {
                    var x = col * cs;
                    var dark = this.modules[row][col];
                    if (dark) {
                        qr_mc.beginFill(0, 100);
                        qr_mc.moveTo(x, y);
                        qr_mc.lineTo(x + cs, y);
                        qr_mc.lineTo(x + cs, y + cs);
                        qr_mc.lineTo(x, y + cs);
                        qr_mc.endFill();
                    }
                }
            }
            return qr_mc;
        },
        setupTimingPattern: function () {
            for (var r = 8; r < this.moduleCount - 8; r++) {
                if (this.modules[r][6] != null) {
                    continue;
                }
                this.modules[r][6] = r % 2 == 0;
            }
            for (var c = 8; c < this.moduleCount - 8; c++) {
                if (this.modules[6][c] != null) {
                    continue;
                }
                this.modules[6][c] = c % 2 == 0;
            }
        },
        setupPositionAdjustPattern: function () {
            var pos = QRUtil.getPatternPosition(this.typeNumber);
            for (var i = 0; i < pos.length; i++) {
                for (var j = 0; j < pos.length; j++) {
                    var row = pos[i];
                    var col = pos[j];
                    if (this.modules[row][col] != null) {
                        continue;
                    }
                    for (var r = -2; r <= 2; r++) {
                        for (var c = -2; c <= 2; c++) {
                            if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                                this.modules[row + r][col + c] = true;
                            } else {
                                this.modules[row + r][col + c] = false;
                            }
                        }
                    }
                }
            }
        },
        setupTypeNumber: function (test) {
            var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
            for (var i = 0; i < 18; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
            }
            for (var i = 0; i < 18; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
        },
        setupTypeInfo: function (test, maskPattern) {
            var data = this.errorCorrectLevel << 3 | maskPattern;
            var bits = QRUtil.getBCHTypeInfo(data);
            for (var i = 0; i < 15; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                if (i < 6) {
                    this.modules[i][8] = mod;
                } else if (i < 8) {
                    this.modules[i + 1][8] = mod;
                } else {
                    this.modules[this.moduleCount - 15 + i][8] = mod;
                }
            }
            for (var i = 0; i < 15; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                if (i < 8) {
                    this.modules[8][this.moduleCount - i - 1] = mod;
                } else if (i < 9) {
                    this.modules[8][15 - i - 1 + 1] = mod;
                } else {
                    this.modules[8][15 - i - 1] = mod;
                }
            }
            this.modules[this.moduleCount - 8][8] = !test;
        },
        mapData: function (data, maskPattern) {
            var inc = -1;
            var row = this.moduleCount - 1;
            var bitIndex = 7;
            var byteIndex = 0;
            for (var col = this.moduleCount - 1; col > 0; col -= 2) {
                if (col == 6)
                    col--;
                while (true) {
                    for (var c = 0; c < 2; c++) {
                        if (this.modules[row][col - c] == null) {
                            var dark = false;
                            if (byteIndex < data.length) {
                                dark = (data[byteIndex] >>> bitIndex & 1) == 1;
                            }
                            var mask = QRUtil.getMask(maskPattern, row, col - c);
                            if (mask) {
                                dark = !dark;
                            }
                            this.modules[row][col - c] = dark;
                            bitIndex--;
                            if (bitIndex == -1) {
                                byteIndex++;
                                bitIndex = 7;
                            }
                        }
                    }
                    row += inc;
                    if (row < 0 || this.moduleCount <= row) {
                        row -= inc;
                        inc = -inc;
                        break;
                    }
                }
            }
        }
    };
    QRCodeModel.PAD0 = 236;
    QRCodeModel.PAD1 = 17;
    QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
        var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
        var buffer = new QRBitBuffer();
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            buffer.put(data.mode, 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
            data.write(buffer);
        }
        var totalDataCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
        }
        if (buffer.getLengthInBits() > totalDataCount * 8) {
            throw new Error('code length overflow. (' + buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')');
        }
        if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
            buffer.put(0, 4);
        }
        while (buffer.getLengthInBits() % 8 != 0) {
            buffer.putBit(false);
        }
        while (true) {
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
                break;
            }
            buffer.put(QRCodeModel.PAD0, 8);
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
                break;
            }
            buffer.put(QRCodeModel.PAD1, 8);
        }
        return QRCodeModel.createBytes(buffer, rsBlocks);
    };
    QRCodeModel.createBytes = function (buffer, rsBlocks) {
        var offset = 0;
        var maxDcCount = 0;
        var maxEcCount = 0;
        var dcdata = new Array(rsBlocks.length);
        var ecdata = new Array(rsBlocks.length);
        for (var r = 0; r < rsBlocks.length; r++) {
            var dcCount = rsBlocks[r].dataCount;
            var ecCount = rsBlocks[r].totalCount - dcCount;
            maxDcCount = Math.max(maxDcCount, dcCount);
            maxEcCount = Math.max(maxEcCount, ecCount);
            dcdata[r] = new Array(dcCount);
            for (var i = 0; i < dcdata[r].length; i++) {
                dcdata[r][i] = 255 & buffer.buffer[i + offset];
            }
            offset += dcCount;
            var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
            var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
            var modPoly = rawPoly.mod(rsPoly);
            ecdata[r] = new Array(rsPoly.getLength() - 1);
            for (var i = 0; i < ecdata[r].length; i++) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
            }
        }
        var totalCodeCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) {
            totalCodeCount += rsBlocks[i].totalCount;
        }
        var data = new Array(totalCodeCount);
        var index = 0;
        for (var i = 0; i < maxDcCount; i++) {
            for (var r = 0; r < rsBlocks.length; r++) {
                if (i < dcdata[r].length) {
                    data[index++] = dcdata[r][i];
                }
            }
        }
        for (var i = 0; i < maxEcCount; i++) {
            for (var r = 0; r < rsBlocks.length; r++) {
                if (i < ecdata[r].length) {
                    data[index++] = ecdata[r][i];
                }
            }
        }
        return data;
    };
    var QRMode = {
        MODE_NUMBER: 1 << 0,
        MODE_ALPHA_NUM: 1 << 1,
        MODE_8BIT_BYTE: 1 << 2,
        MODE_KANJI: 1 << 3
    };
    var QRErrorCorrectLevel = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
    };
    var QRMaskPattern = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    };
    var QRUtil = {
        PATTERN_POSITION_TABLE: [
            [],
            [
                6,
                18
            ],
            [
                6,
                22
            ],
            [
                6,
                26
            ],
            [
                6,
                30
            ],
            [
                6,
                34
            ],
            [
                6,
                22,
                38
            ],
            [
                6,
                24,
                42
            ],
            [
                6,
                26,
                46
            ],
            [
                6,
                28,
                50
            ],
            [
                6,
                30,
                54
            ],
            [
                6,
                32,
                58
            ],
            [
                6,
                34,
                62
            ],
            [
                6,
                26,
                46,
                66
            ],
            [
                6,
                26,
                48,
                70
            ],
            [
                6,
                26,
                50,
                74
            ],
            [
                6,
                30,
                54,
                78
            ],
            [
                6,
                30,
                56,
                82
            ],
            [
                6,
                30,
                58,
                86
            ],
            [
                6,
                34,
                62,
                90
            ],
            [
                6,
                28,
                50,
                72,
                94
            ],
            [
                6,
                26,
                50,
                74,
                98
            ],
            [
                6,
                30,
                54,
                78,
                102
            ],
            [
                6,
                28,
                54,
                80,
                106
            ],
            [
                6,
                32,
                58,
                84,
                110
            ],
            [
                6,
                30,
                58,
                86,
                114
            ],
            [
                6,
                34,
                62,
                90,
                118
            ],
            [
                6,
                26,
                50,
                74,
                98,
                122
            ],
            [
                6,
                30,
                54,
                78,
                102,
                126
            ],
            [
                6,
                26,
                52,
                78,
                104,
                130
            ],
            [
                6,
                30,
                56,
                82,
                108,
                134
            ],
            [
                6,
                34,
                60,
                86,
                112,
                138
            ],
            [
                6,
                30,
                58,
                86,
                114,
                142
            ],
            [
                6,
                34,
                62,
                90,
                118,
                146
            ],
            [
                6,
                30,
                54,
                78,
                102,
                126,
                150
            ],
            [
                6,
                24,
                50,
                76,
                102,
                128,
                154
            ],
            [
                6,
                28,
                54,
                80,
                106,
                132,
                158
            ],
            [
                6,
                32,
                58,
                84,
                110,
                136,
                162
            ],
            [
                6,
                26,
                54,
                82,
                110,
                138,
                166
            ],
            [
                6,
                30,
                58,
                86,
                114,
                142,
                170
            ]
        ],
        G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0,
        G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0,
        G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1,
        getBCHTypeInfo: function (data) {
            var d = data << 10;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
                d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
            }
            return (data << 10 | d) ^ QRUtil.G15_MASK;
        },
        getBCHTypeNumber: function (data) {
            var d = data << 12;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
                d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
            }
            return data << 12 | d;
        },
        getBCHDigit: function (data) {
            var digit = 0;
            while (data != 0) {
                digit++;
                data >>>= 1;
            }
            return digit;
        },
        getPatternPosition: function (typeNumber) {
            return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
        },
        getMask: function (maskPattern, i, j) {
            switch (maskPattern) {
            case QRMaskPattern.PATTERN000:
                return (i + j) % 2 == 0;
            case QRMaskPattern.PATTERN001:
                return i % 2 == 0;
            case QRMaskPattern.PATTERN010:
                return j % 3 == 0;
            case QRMaskPattern.PATTERN011:
                return (i + j) % 3 == 0;
            case QRMaskPattern.PATTERN100:
                return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
            case QRMaskPattern.PATTERN101:
                return i * j % 2 + i * j % 3 == 0;
            case QRMaskPattern.PATTERN110:
                return (i * j % 2 + i * j % 3) % 2 == 0;
            case QRMaskPattern.PATTERN111:
                return (i * j % 3 + (i + j) % 2) % 2 == 0;
            default:
                throw new Error('bad maskPattern:' + maskPattern);
            }
        },
        getErrorCorrectPolynomial: function (errorCorrectLength) {
            var a = new QRPolynomial([1], 0);
            for (var i = 0; i < errorCorrectLength; i++) {
                a = a.multiply(new QRPolynomial([
                    1,
                    QRMath.gexp(i)
                ], 0));
            }
            return a;
        },
        getLengthInBits: function (mode, type) {
            if (1 <= type && type < 10) {
                switch (mode) {
                case QRMode.MODE_NUMBER:
                    return 10;
                case QRMode.MODE_ALPHA_NUM:
                    return 9;
                case QRMode.MODE_8BIT_BYTE:
                    return 8;
                case QRMode.MODE_KANJI:
                    return 8;
                default:
                    throw new Error('mode:' + mode);
                }
            } else if (type < 27) {
                switch (mode) {
                case QRMode.MODE_NUMBER:
                    return 12;
                case QRMode.MODE_ALPHA_NUM:
                    return 11;
                case QRMode.MODE_8BIT_BYTE:
                    return 16;
                case QRMode.MODE_KANJI:
                    return 10;
                default:
                    throw new Error('mode:' + mode);
                }
            } else if (type < 41) {
                switch (mode) {
                case QRMode.MODE_NUMBER:
                    return 14;
                case QRMode.MODE_ALPHA_NUM:
                    return 13;
                case QRMode.MODE_8BIT_BYTE:
                    return 16;
                case QRMode.MODE_KANJI:
                    return 12;
                default:
                    throw new Error('mode:' + mode);
                }
            } else {
                throw new Error('type:' + type);
            }
        },
        getLostPoint: function (qrCode) {
            var moduleCount = qrCode.getModuleCount();
            var lostPoint = 0;
            for (var row = 0; row < moduleCount; row++) {
                for (var col = 0; col < moduleCount; col++) {
                    var sameCount = 0;
                    var dark = qrCode.isDark(row, col);
                    for (var r = -1; r <= 1; r++) {
                        if (row + r < 0 || moduleCount <= row + r) {
                            continue;
                        }
                        for (var c = -1; c <= 1; c++) {
                            if (col + c < 0 || moduleCount <= col + c) {
                                continue;
                            }
                            if (r == 0 && c == 0) {
                                continue;
                            }
                            if (dark == qrCode.isDark(row + r, col + c)) {
                                sameCount++;
                            }
                        }
                    }
                    if (sameCount > 5) {
                        lostPoint += 3 + sameCount - 5;
                    }
                }
            }
            for (var row = 0; row < moduleCount - 1; row++) {
                for (var col = 0; col < moduleCount - 1; col++) {
                    var count = 0;
                    if (qrCode.isDark(row, col))
                        count++;
                    if (qrCode.isDark(row + 1, col))
                        count++;
                    if (qrCode.isDark(row, col + 1))
                        count++;
                    if (qrCode.isDark(row + 1, col + 1))
                        count++;
                    if (count == 0 || count == 4) {
                        lostPoint += 3;
                    }
                }
            }
            for (var row = 0; row < moduleCount; row++) {
                for (var col = 0; col < moduleCount - 6; col++) {
                    if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
                        lostPoint += 40;
                    }
                }
            }
            for (var col = 0; col < moduleCount; col++) {
                for (var row = 0; row < moduleCount - 6; row++) {
                    if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
                        lostPoint += 40;
                    }
                }
            }
            var darkCount = 0;
            for (var col = 0; col < moduleCount; col++) {
                for (var row = 0; row < moduleCount; row++) {
                    if (qrCode.isDark(row, col)) {
                        darkCount++;
                    }
                }
            }
            var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
            lostPoint += ratio * 10;
            return lostPoint;
        }
    };
    var QRMath = {
        glog: function (n) {
            if (n < 1) {
                throw new Error('glog(' + n + ')');
            }
            return QRMath.LOG_TABLE[n];
        },
        gexp: function (n) {
            while (n < 0) {
                n += 255;
            }
            while (n >= 256) {
                n -= 255;
            }
            return QRMath.EXP_TABLE[n];
        },
        EXP_TABLE: new Array(256),
        LOG_TABLE: new Array(256)
    };
    for (var i = 0; i < 8; i++) {
        QRMath.EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i++) {
        QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i++) {
        QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    }
    function QRPolynomial(num, shift) {
        if (num.length == undefined) {
            throw new Error(num.length + '/' + shift);
        }
        var offset = 0;
        while (offset < num.length && num[offset] == 0) {
            offset++;
        }
        this.num = new Array(num.length - offset + shift);
        for (var i = 0; i < num.length - offset; i++) {
            this.num[i] = num[i + offset];
        }
    }
    QRPolynomial.prototype = {
        get: function (index) {
            return this.num[index];
        },
        getLength: function () {
            return this.num.length;
        },
        multiply: function (e) {
            var num = new Array(this.getLength() + e.getLength() - 1);
            for (var i = 0; i < this.getLength(); i++) {
                for (var j = 0; j < e.getLength(); j++) {
                    num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
                }
            }
            return new QRPolynomial(num, 0);
        },
        mod: function (e) {
            if (this.getLength() - e.getLength() < 0) {
                return this;
            }
            var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
            var num = new Array(this.getLength());
            for (var i = 0; i < this.getLength(); i++) {
                num[i] = this.get(i);
            }
            for (var i = 0; i < e.getLength(); i++) {
                num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
            }
            return new QRPolynomial(num, 0).mod(e);
        }
    };
    function QRRSBlock(totalCount, dataCount) {
        this.totalCount = totalCount;
        this.dataCount = dataCount;
    }
    QRRSBlock.RS_BLOCK_TABLE = [
        [
            1,
            26,
            19
        ],
        [
            1,
            26,
            16
        ],
        [
            1,
            26,
            13
        ],
        [
            1,
            26,
            9
        ],
        [
            1,
            44,
            34
        ],
        [
            1,
            44,
            28
        ],
        [
            1,
            44,
            22
        ],
        [
            1,
            44,
            16
        ],
        [
            1,
            70,
            55
        ],
        [
            1,
            70,
            44
        ],
        [
            2,
            35,
            17
        ],
        [
            2,
            35,
            13
        ],
        [
            1,
            100,
            80
        ],
        [
            2,
            50,
            32
        ],
        [
            2,
            50,
            24
        ],
        [
            4,
            25,
            9
        ],
        [
            1,
            134,
            108
        ],
        [
            2,
            67,
            43
        ],
        [
            2,
            33,
            15,
            2,
            34,
            16
        ],
        [
            2,
            33,
            11,
            2,
            34,
            12
        ],
        [
            2,
            86,
            68
        ],
        [
            4,
            43,
            27
        ],
        [
            4,
            43,
            19
        ],
        [
            4,
            43,
            15
        ],
        [
            2,
            98,
            78
        ],
        [
            4,
            49,
            31
        ],
        [
            2,
            32,
            14,
            4,
            33,
            15
        ],
        [
            4,
            39,
            13,
            1,
            40,
            14
        ],
        [
            2,
            121,
            97
        ],
        [
            2,
            60,
            38,
            2,
            61,
            39
        ],
        [
            4,
            40,
            18,
            2,
            41,
            19
        ],
        [
            4,
            40,
            14,
            2,
            41,
            15
        ],
        [
            2,
            146,
            116
        ],
        [
            3,
            58,
            36,
            2,
            59,
            37
        ],
        [
            4,
            36,
            16,
            4,
            37,
            17
        ],
        [
            4,
            36,
            12,
            4,
            37,
            13
        ],
        [
            2,
            86,
            68,
            2,
            87,
            69
        ],
        [
            4,
            69,
            43,
            1,
            70,
            44
        ],
        [
            6,
            43,
            19,
            2,
            44,
            20
        ],
        [
            6,
            43,
            15,
            2,
            44,
            16
        ],
        [
            4,
            101,
            81
        ],
        [
            1,
            80,
            50,
            4,
            81,
            51
        ],
        [
            4,
            50,
            22,
            4,
            51,
            23
        ],
        [
            3,
            36,
            12,
            8,
            37,
            13
        ],
        [
            2,
            116,
            92,
            2,
            117,
            93
        ],
        [
            6,
            58,
            36,
            2,
            59,
            37
        ],
        [
            4,
            46,
            20,
            6,
            47,
            21
        ],
        [
            7,
            42,
            14,
            4,
            43,
            15
        ],
        [
            4,
            133,
            107
        ],
        [
            8,
            59,
            37,
            1,
            60,
            38
        ],
        [
            8,
            44,
            20,
            4,
            45,
            21
        ],
        [
            12,
            33,
            11,
            4,
            34,
            12
        ],
        [
            3,
            145,
            115,
            1,
            146,
            116
        ],
        [
            4,
            64,
            40,
            5,
            65,
            41
        ],
        [
            11,
            36,
            16,
            5,
            37,
            17
        ],
        [
            11,
            36,
            12,
            5,
            37,
            13
        ],
        [
            5,
            109,
            87,
            1,
            110,
            88
        ],
        [
            5,
            65,
            41,
            5,
            66,
            42
        ],
        [
            5,
            54,
            24,
            7,
            55,
            25
        ],
        [
            11,
            36,
            12
        ],
        [
            5,
            122,
            98,
            1,
            123,
            99
        ],
        [
            7,
            73,
            45,
            3,
            74,
            46
        ],
        [
            15,
            43,
            19,
            2,
            44,
            20
        ],
        [
            3,
            45,
            15,
            13,
            46,
            16
        ],
        [
            1,
            135,
            107,
            5,
            136,
            108
        ],
        [
            10,
            74,
            46,
            1,
            75,
            47
        ],
        [
            1,
            50,
            22,
            15,
            51,
            23
        ],
        [
            2,
            42,
            14,
            17,
            43,
            15
        ],
        [
            5,
            150,
            120,
            1,
            151,
            121
        ],
        [
            9,
            69,
            43,
            4,
            70,
            44
        ],
        [
            17,
            50,
            22,
            1,
            51,
            23
        ],
        [
            2,
            42,
            14,
            19,
            43,
            15
        ],
        [
            3,
            141,
            113,
            4,
            142,
            114
        ],
        [
            3,
            70,
            44,
            11,
            71,
            45
        ],
        [
            17,
            47,
            21,
            4,
            48,
            22
        ],
        [
            9,
            39,
            13,
            16,
            40,
            14
        ],
        [
            3,
            135,
            107,
            5,
            136,
            108
        ],
        [
            3,
            67,
            41,
            13,
            68,
            42
        ],
        [
            15,
            54,
            24,
            5,
            55,
            25
        ],
        [
            15,
            43,
            15,
            10,
            44,
            16
        ],
        [
            4,
            144,
            116,
            4,
            145,
            117
        ],
        [
            17,
            68,
            42
        ],
        [
            17,
            50,
            22,
            6,
            51,
            23
        ],
        [
            19,
            46,
            16,
            6,
            47,
            17
        ],
        [
            2,
            139,
            111,
            7,
            140,
            112
        ],
        [
            17,
            74,
            46
        ],
        [
            7,
            54,
            24,
            16,
            55,
            25
        ],
        [
            34,
            37,
            13
        ],
        [
            4,
            151,
            121,
            5,
            152,
            122
        ],
        [
            4,
            75,
            47,
            14,
            76,
            48
        ],
        [
            11,
            54,
            24,
            14,
            55,
            25
        ],
        [
            16,
            45,
            15,
            14,
            46,
            16
        ],
        [
            6,
            147,
            117,
            4,
            148,
            118
        ],
        [
            6,
            73,
            45,
            14,
            74,
            46
        ],
        [
            11,
            54,
            24,
            16,
            55,
            25
        ],
        [
            30,
            46,
            16,
            2,
            47,
            17
        ],
        [
            8,
            132,
            106,
            4,
            133,
            107
        ],
        [
            8,
            75,
            47,
            13,
            76,
            48
        ],
        [
            7,
            54,
            24,
            22,
            55,
            25
        ],
        [
            22,
            45,
            15,
            13,
            46,
            16
        ],
        [
            10,
            142,
            114,
            2,
            143,
            115
        ],
        [
            19,
            74,
            46,
            4,
            75,
            47
        ],
        [
            28,
            50,
            22,
            6,
            51,
            23
        ],
        [
            33,
            46,
            16,
            4,
            47,
            17
        ],
        [
            8,
            152,
            122,
            4,
            153,
            123
        ],
        [
            22,
            73,
            45,
            3,
            74,
            46
        ],
        [
            8,
            53,
            23,
            26,
            54,
            24
        ],
        [
            12,
            45,
            15,
            28,
            46,
            16
        ],
        [
            3,
            147,
            117,
            10,
            148,
            118
        ],
        [
            3,
            73,
            45,
            23,
            74,
            46
        ],
        [
            4,
            54,
            24,
            31,
            55,
            25
        ],
        [
            11,
            45,
            15,
            31,
            46,
            16
        ],
        [
            7,
            146,
            116,
            7,
            147,
            117
        ],
        [
            21,
            73,
            45,
            7,
            74,
            46
        ],
        [
            1,
            53,
            23,
            37,
            54,
            24
        ],
        [
            19,
            45,
            15,
            26,
            46,
            16
        ],
        [
            5,
            145,
            115,
            10,
            146,
            116
        ],
        [
            19,
            75,
            47,
            10,
            76,
            48
        ],
        [
            15,
            54,
            24,
            25,
            55,
            25
        ],
        [
            23,
            45,
            15,
            25,
            46,
            16
        ],
        [
            13,
            145,
            115,
            3,
            146,
            116
        ],
        [
            2,
            74,
            46,
            29,
            75,
            47
        ],
        [
            42,
            54,
            24,
            1,
            55,
            25
        ],
        [
            23,
            45,
            15,
            28,
            46,
            16
        ],
        [
            17,
            145,
            115
        ],
        [
            10,
            74,
            46,
            23,
            75,
            47
        ],
        [
            10,
            54,
            24,
            35,
            55,
            25
        ],
        [
            19,
            45,
            15,
            35,
            46,
            16
        ],
        [
            17,
            145,
            115,
            1,
            146,
            116
        ],
        [
            14,
            74,
            46,
            21,
            75,
            47
        ],
        [
            29,
            54,
            24,
            19,
            55,
            25
        ],
        [
            11,
            45,
            15,
            46,
            46,
            16
        ],
        [
            13,
            145,
            115,
            6,
            146,
            116
        ],
        [
            14,
            74,
            46,
            23,
            75,
            47
        ],
        [
            44,
            54,
            24,
            7,
            55,
            25
        ],
        [
            59,
            46,
            16,
            1,
            47,
            17
        ],
        [
            12,
            151,
            121,
            7,
            152,
            122
        ],
        [
            12,
            75,
            47,
            26,
            76,
            48
        ],
        [
            39,
            54,
            24,
            14,
            55,
            25
        ],
        [
            22,
            45,
            15,
            41,
            46,
            16
        ],
        [
            6,
            151,
            121,
            14,
            152,
            122
        ],
        [
            6,
            75,
            47,
            34,
            76,
            48
        ],
        [
            46,
            54,
            24,
            10,
            55,
            25
        ],
        [
            2,
            45,
            15,
            64,
            46,
            16
        ],
        [
            17,
            152,
            122,
            4,
            153,
            123
        ],
        [
            29,
            74,
            46,
            14,
            75,
            47
        ],
        [
            49,
            54,
            24,
            10,
            55,
            25
        ],
        [
            24,
            45,
            15,
            46,
            46,
            16
        ],
        [
            4,
            152,
            122,
            18,
            153,
            123
        ],
        [
            13,
            74,
            46,
            32,
            75,
            47
        ],
        [
            48,
            54,
            24,
            14,
            55,
            25
        ],
        [
            42,
            45,
            15,
            32,
            46,
            16
        ],
        [
            20,
            147,
            117,
            4,
            148,
            118
        ],
        [
            40,
            75,
            47,
            7,
            76,
            48
        ],
        [
            43,
            54,
            24,
            22,
            55,
            25
        ],
        [
            10,
            45,
            15,
            67,
            46,
            16
        ],
        [
            19,
            148,
            118,
            6,
            149,
            119
        ],
        [
            18,
            75,
            47,
            31,
            76,
            48
        ],
        [
            34,
            54,
            24,
            34,
            55,
            25
        ],
        [
            20,
            45,
            15,
            61,
            46,
            16
        ]
    ];
    QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
        var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
        if (rsBlock == undefined) {
            throw new Error('bad rs block @ typeNumber:' + typeNumber + '/errorCorrectLevel:' + errorCorrectLevel);
        }
        var length = rsBlock.length / 3;
        var list = [];
        for (var i = 0; i < length; i++) {
            var count = rsBlock[i * 3 + 0];
            var totalCount = rsBlock[i * 3 + 1];
            var dataCount = rsBlock[i * 3 + 2];
            for (var j = 0; j < count; j++) {
                list.push(new QRRSBlock(totalCount, dataCount));
            }
        }
        return list;
    };
    QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
        switch (errorCorrectLevel) {
        case QRErrorCorrectLevel.L:
            return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
        case QRErrorCorrectLevel.M:
            return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
        case QRErrorCorrectLevel.Q:
            return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
        case QRErrorCorrectLevel.H:
            return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
        default:
            return undefined;
        }
    };
    function QRBitBuffer() {
        this.buffer = [];
        this.length = 0;
    }
    QRBitBuffer.prototype = {
        get: function (index) {
            var bufIndex = Math.floor(index / 8);
            return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
        },
        put: function (num, length) {
            for (var i = 0; i < length; i++) {
                this.putBit((num >>> length - i - 1 & 1) == 1);
            }
        },
        getLengthInBits: function () {
            return this.length;
        },
        putBit: function (bit) {
            var bufIndex = Math.floor(this.length / 8);
            if (this.buffer.length <= bufIndex) {
                this.buffer.push(0);
            }
            if (bit) {
                this.buffer[bufIndex] |= 128 >>> this.length % 8;
            }
            this.length++;
        }
    };
    var QRCodeLimitLength = [
        [
            17,
            14,
            11,
            7
        ],
        [
            32,
            26,
            20,
            14
        ],
        [
            53,
            42,
            32,
            24
        ],
        [
            78,
            62,
            46,
            34
        ],
        [
            106,
            84,
            60,
            44
        ],
        [
            134,
            106,
            74,
            58
        ],
        [
            154,
            122,
            86,
            64
        ],
        [
            192,
            152,
            108,
            84
        ],
        [
            230,
            180,
            130,
            98
        ],
        [
            271,
            213,
            151,
            119
        ],
        [
            321,
            251,
            177,
            137
        ],
        [
            367,
            287,
            203,
            155
        ],
        [
            425,
            331,
            241,
            177
        ],
        [
            458,
            362,
            258,
            194
        ],
        [
            520,
            412,
            292,
            220
        ],
        [
            586,
            450,
            322,
            250
        ],
        [
            644,
            504,
            364,
            280
        ],
        [
            718,
            560,
            394,
            310
        ],
        [
            792,
            624,
            442,
            338
        ],
        [
            858,
            666,
            482,
            382
        ],
        [
            929,
            711,
            509,
            403
        ],
        [
            1003,
            779,
            565,
            439
        ],
        [
            1091,
            857,
            611,
            461
        ],
        [
            1171,
            911,
            661,
            511
        ],
        [
            1273,
            997,
            715,
            535
        ],
        [
            1367,
            1059,
            751,
            593
        ],
        [
            1465,
            1125,
            805,
            625
        ],
        [
            1528,
            1190,
            868,
            658
        ],
        [
            1628,
            1264,
            908,
            698
        ],
        [
            1732,
            1370,
            982,
            742
        ],
        [
            1840,
            1452,
            1030,
            790
        ],
        [
            1952,
            1538,
            1112,
            842
        ],
        [
            2068,
            1628,
            1168,
            898
        ],
        [
            2188,
            1722,
            1228,
            958
        ],
        [
            2303,
            1809,
            1283,
            983
        ],
        [
            2431,
            1911,
            1351,
            1051
        ],
        [
            2563,
            1989,
            1423,
            1093
        ],
        [
            2699,
            2099,
            1499,
            1139
        ],
        [
            2809,
            2213,
            1579,
            1219
        ],
        [
            2953,
            2331,
            1663,
            1273
        ]
    ];
    function _getTypeNumber(sText, nCorrectLevel) {
        var nType = 1;
        var length = _getUTF8Length(sText);
        for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
            var nLimit = 0;
            switch (nCorrectLevel) {
            case QRErrorCorrectLevel.L:
                nLimit = QRCodeLimitLength[i][0];
                break;
            case QRErrorCorrectLevel.M:
                nLimit = QRCodeLimitLength[i][1];
                break;
            case QRErrorCorrectLevel.Q:
                nLimit = QRCodeLimitLength[i][2];
                break;
            case QRErrorCorrectLevel.H:
                nLimit = QRCodeLimitLength[i][3];
                break;
            }
            if (length <= nLimit) {
                break;
            } else {
                nType++;
            }
        }
        if (nType > QRCodeLimitLength.length) {
            throw new Error('Too long data');
        }
        return nType;
    }
    function _getUTF8Length(sText) {
        var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
        return replacedText.length + (replacedText.length != sText ? 3 : 0);
    }
    var QRCode = function () {
    };
    QRCode.createQRModel = function (sText, cfg) {
        var _htOption;
        if (typeof cfg == 'undefined') {
            _htOption = {
                width: 256,
                height: 256,
                colorDark: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1
                },
                colorLight: {
                    r: 1,
                    g: 1,
                    b: 1,
                    a: 1
                },
                correctLevel: 2
            };
        } else {
            _htOption = cfg;
        }
        var _oQRCode = new QRCodeModel(_getTypeNumber(sText, _htOption.correctLevel), _htOption.correctLevel);
        _oQRCode.addData(sText);
        _oQRCode.make();
        return _oQRCode;
    };
    QRCode.createQRCodeNode = function (sText, cfg) {
        var _htOption;
        if (typeof cfg == 'undefined') {
            _htOption = {
                width: 256,
                height: 256,
                colorDark: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1
                },
                colorLight: {
                    r: 1,
                    g: 1,
                    b: 1,
                    a: 1
                },
                correctLevel: 2
            };
        } else {
            _htOption = cfg;
        }
        var canvas = new BK.Canvas(_htOption.width, _htOption.height);
        var _oQRCode = QRCode.createQRModel(sText, cfg);
        var nCount = _oQRCode.getModuleCount();
        var nWidth = _htOption.width / nCount;
        var nHeight = _htOption.height / nCount;
        var nRoundedWidth = Math.round(nWidth);
        var nRoundedHeight = Math.round(nHeight);
        for (var row = 0; row < nCount; row++) {
            for (var col = 0; col < nCount; col++) {
                var bIsDark = _oQRCode.isDark(row, col);
                var nLeft = col * nWidth;
                var nTop = row * nHeight;
                canvas.lineWidth = 1;
                canvas.fillColor = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                canvas.drawStyle = 0;
                canvas.fillRect(nLeft, nTop, nWidth, nHeight);
                canvas.strokeColor = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                canvas.strokeRect(Math.ceil(nLeft) - 0.5, Math.ceil(nTop) - 0.5, nRoundedWidth, nRoundedHeight);
                canvas.strokeRect(Math.ceil(nLeft) + 0.5, Math.ceil(nTop) + 0.5, nRoundedWidth, nRoundedHeight);
            }
        }
        return canvas;
    };
    QRCode.createQRCodeToFile = function (path, content, cfg) {
        var canvas = QRCode.createQRCodeNode(content, cfg);
        canvas.saveTo(path);
        return true;
    };
    QRCode.compose = function (imgPath, qrCodePath, x, y) {
        var w = BK.Director.screenPixelSize.width;
        var h = BK.Director.screenPixelSize.height;
        var canvas = new BK.Canvas(w, h);
        canvas.drawImage(imgPath, 0, 0);
        canvas.drawImage(qrCodePath, 0, 0);
        canvas.saveTo('GameSandBox://compose.png');
        canvas.dispose();
    };
    return QRCode;
}));
}
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
(function (global, factory) {
    if (typeof global === 'object') {
        global.AdVideoHandler = factory().AdVideoHandler;
        global.AdVideoHandlerNative = factory().AdVideoHandlerNative;
    }
}(BK, function () {
    var AdVideoHandler = function () {
        function AdVideoHandler(videoType, pos_id, adInfo, gameOrientation) {
            this._onStartPlay = function (data) {
                if (this.event && this.event.onStartPlay) {
                    this.event.onStartPlay(data.code, data.msg);
                } else {
                    this.log('lack of onStartPlay callback');
                }
                this.log('_onStartPlay');
            };
            this.videoType = videoType;
            var buttonInfo_txt = '';
            if (adInfo.display_info && adInfo.display_info.button_info) {
                if (adInfo.display_info.button_info.length > 0) {
                    buttonInfo_txt = adInfo.display_info.button_info[0].txt;
                }
            }
            var corporation_name = adInfo.display_info.advertiser_info.corporation_name;
            var corporate_image_name = adInfo.display_info.advertiser_info.corporate_image_name;
            var corporate_logo = adInfo.display_info.advertiser_info.corporate_logo;
            var buttonInfoPos = 0;
            if (adInfo.display_info.button_info.length > 0) {
                var buttonArray = adInfo.display_info.button_info;
                for (var index_1 = 0; index_1 < buttonArray.length; index_1++) {
                    var buttonInfo = buttonArray[index_1];
                    if (typeof buttonInfo.pos != undefined) {
                        buttonInfoPos = buttonInfo.pos;
                        break;
                    }
                }
            }
            this.adVideoInfo = {
                pos_id: pos_id,
                tencent_video_id: adInfo.display_info.video_info.tencent_video_id,
                creative_size: adInfo.display_info.creative_size,
                dest_info: adInfo.dest_info,
                buttonInfo_txt: buttonInfo_txt,
                buttonInfo_pos: buttonInfoPos,
                corporation_name: adInfo.display_info.advertiser_info.corporation_name,
                corporate_image_name: adInfo.display_info.advertiser_info.corporate_image_name,
                corporate_logo: adInfo.display_info.advertiser_info.corporate_logo,
                base_info: adInfo.display_info.basic_info.txt,
                product_type: adInfo.product_type,
                exposure_url: adInfo.report_info.exposure_url,
                click_url: adInfo.report_info.click_url,
                video_preview_url: adInfo.display_info.basic_info.img,
                pkg_download_schema: adInfo.app_info.pkg_download_schema
            };
            this.adVideoInfo['dksjs'] = Math.random().toString();
            this.gameOrientation = gameOrientation;
        }
        AdVideoHandler.prototype._onEnterForeground = function () {
            this.log('_onEnterForeground');
            this._resumeAllMusic();
        };
        AdVideoHandler.prototype._removeListener = function () {
            BK.MQQ.SsoRequest.removeListener('sc.game_enter_foreground.local', this);
            BK.MQQ.SsoRequest.removeListener('sc.apolloGameWebMessage.local', this);
        };
        AdVideoHandler.prototype._addListener = function () {
            BK.MQQ.SsoRequest.addListener('sc.game_enter_foreground.local', this, this._onEnterForeground.bind(this));
        };
        AdVideoHandler.prototype.jump = function () {
            this._addListener();
            BK.Advertisement.videoCMReport(this.videoType, 3);
            this._pauseAllMusic();
            var gameOrientation = this.gameOrientation;
            var adInfo = this.adVideoInfo;
            var cmd = 'cs.openWebViewWithoutUrl.local';
            var url = 'https://cmshow.qq.com/apollo/html/game-platform/game-ad.html?_wv=4099&_bid=3143&_fv=0&';
            var orientation = 1;
            if (typeof gameOrientation == 'undefined') {
                orientation = 1;
            } else {
                orientation = gameOrientation;
            }
            url = url + 'gameOrientation=' + orientation + '&';
            url = url + 'gameId=' + GameStatusInfo.gameId + '&';
            url = url + 'adInfo=' + encodeURI(JSON.stringify(adInfo));
            var transparentNum = 1;
            var data = {
                'gameOrientation': gameOrientation,
                'transparent': transparentNum,
                'businessType': 2,
                'openId': GameStatusInfo.openId,
                'url': url
            };
            var cbCmd = 'sc.apolloGameWebMessage.local';
            BK.MQQ.SsoRequest.addListener(cbCmd, this, function (errCode, cmd, data) {
                if (errCode == 0) {
                    if (data.op) {
                        if (data.op == 'apolloGamePlatform.endAdVideo') {
                            BK.Script.log(1, 1, 'video ad endAdVideo');
                            if (data.data) {
                                this._onEndAdVideo(data.data);
                            } else {
                                this._onEndAdVideo(null);
                                BK.Script.log(1, 1, 'video ad end failed. data.data is null');
                            }
                        } else if (data.op == 'apolloGamePlatform.closeGame') {
                            BK.Script.log(1, 1, 'video ad closeGame');
                            if (data.data) {
                                this._onCloseGame(data.data);
                            } else {
                                this._onCloseGame(null);
                                BK.Script.log(1, 1, 'video ad close failed. data.data is null');
                            }
                        } else if (data.op == 'apolloGamePlatform.miniGame') {
                            BK.Script.log(1, 1, 'video ad miniGame');
                            if (typeof data.ggspd == 'number') {
                                BK.Advertisement.ggspd = data.ggspd;
                            }
                        } else if (data.op == 'apolloGamePlatform.closeWv') {
                            this._onCloseWebView(data.data);
                            this.log('closeWv:' + JSON.stringify(data));
                        } else if (data.op == 'apolloGamePlatform.startAdVideo') {
                            this._onStartPlay(data.data);
                            this.log('startAdVideo:' + JSON.stringify(data));
                        }
                    }
                }
            }.bind(this));
            if (BK.isBrowser) {
                BK.MQQ.SsoRequest.sendTo(data, cmd);
            } else {
                BK.MQQ.SsoRequest.send(data, cmd);
            }
        };
        AdVideoHandler.prototype._onCloseWebView = function (data) {
            var type = 0;
            if (typeof data.type != 'undefined') {
                type = data.type;
                if (type == 0) {
                    this._resumeAllMusic();
                    this._removeListener();
                } else if (type == 1) {
                    this.envType = 1;
                }
                this.log('_onCloseWebView ' + type);
            }
            if (this.event && this.event.onCloseVideo) {
                this.event.onCloseVideo(data.code, data.msg);
            } else {
                this.log('lack of onCloseWebView callback');
            }
            this.event.onCloseVideo = null;
        };
        AdVideoHandler.prototype._onMini = function () {
        };
        AdVideoHandler.prototype._onCloseGame = function (data) {
            if (data) {
                if (this.event && this.event.onCloseGame) {
                    this.event.onCloseGame(data.code, data.msg);
                } else {
                    this.log('lack of onClose callback');
                }
            } else {
                this.event.onCloseGame(-1, '_onCloseGame failed data is null');
            }
            BK.QQ.notifyCloseGame();
            this.event.onCloseGame = null;
        };
        AdVideoHandler.prototype._onEndAdVideo = function (data) {
            if (data) {
                if (this.event && this.event.onEndVideo) {
                    if (data.dksjs == this.adVideoInfo['dksjs']) {
                        this.event.onEndVideo(data.code, data.msg);
                    } else {
                        BK.Script.log(1, 1, 'data.dksjs:' + data.dksjs + ' this.adInfo[dksjs]:' + this.adVideoInfo['dksjs']);
                        this.event.onEndVideo(-1, 'end video failed! illegal end viedo');
                    }
                } else {
                    this.log('lack of onEnd callback');
                }
            } else {
                this.event.onEndVideo(-1, '_onEndAdVideo failed.data is null');
            }
            this.event.onEndVideo = undefined;
        };
        AdVideoHandler.prototype._pauseAllMusic = function () {
            if (typeof BK.isBrowser != 'undefined') {
                return;
            }
            this.formerSwitch = BK.Audio.switch;
            BK.Audio.pauseAllBackground();
            BK.Audio.switch = false;
            this.log('pauseAllMusic formerSwitch:' + this.formerSwitch);
        };
        AdVideoHandler.prototype._resumeAllMusic = function () {
            if (typeof BK.isBrowser != 'undefined') {
                return;
            }
            BK.Audio.switch = this.formerSwitch;
            BK.Audio.resumeAllBackground();
            this.log('resumeAllMusic formerSwitch:' + this.formerSwitch);
        };
        AdVideoHandler.prototype.setEventCallack = function (onClose, onEndVideo, onCloseWebView, onStartPlay) {
            if (typeof this.event == 'undefined') {
                this.event = {
                    onCloseGame: onClose,
                    onEndVideo: onEndVideo,
                    onCloseVideo: onCloseWebView,
                    onStartPlay: onStartPlay
                };
            } else {
                this.event.onCloseGame = onClose;
                this.event.onEndVideo = onEndVideo;
                this.event.onCloseVideo = onCloseWebView;
                this.event.onStartPlay = onStartPlay;
            }
        };
        AdVideoHandler.prototype.log = function (str) {
            BK.Script.log(1, 1, 'AdVideoHandler:' + str);
        };
        AdVideoHandler.prototype.errorLog = function (str) {
            BK.Script.log(1, 1, 'AdVideoHandler Error:' + str);
        };
        return AdVideoHandler;
    }();
    var AdVideoHandlerNative = function (_super) {
        __extends(AdVideoHandlerNative, _super);
        function AdVideoHandlerNative(videoType, posid, adInfo, gameOrientation) {
            var _this = _super.call(this, videoType, posid, adInfo, gameOrientation) || this;
            _this.CMSHOW_SC_CMD_AD_VIDEO_START = 'sc.game_ad_video_start.local';
            _this.CMSHOW_SC_CMD_AD_VIDEO_END = 'sc.game_ad_video_end.local';
            _this.CMSHOW_SC_CMD_AD_VIDEO_CLOSE = 'sc.game_ad_video_view_close.local';
            _this.CMSHOW_CS_CMD_AD_VIDEO_JUMP = 'cs.game_ad_video_jump.local';
            _this.CMSHOW_CS_CMD_AD_VIDEO_CLOSE = 'cs.game_ad_video_close.local';
            _this.posid = posid;
            _this.adInfo = adInfo;
            return _this;
        }
        AdVideoHandlerNative.prototype.jump = function () {
            this.addNativeListener();
            BK.Advertisement.videoCMReport(this.videoType, 3);
            this._pauseAllMusic();
            BK.MQQ.SsoRequest.send(this.adInfo, this.CMSHOW_CS_CMD_AD_VIDEO_JUMP);
        };
        AdVideoHandlerNative.prototype.close = function () {
            BK.MQQ.SsoRequest.send({}, this.CMSHOW_CS_CMD_AD_VIDEO_CLOSE);
        };
        AdVideoHandlerNative.prototype.setEventCallack = function (onCloseGame, onEndVideo, onCloseVideo, onStartPlay) {
            if (typeof this.event == 'undefined') {
                this.event = {
                    onCloseGame: onCloseGame,
                    onEndVideo: onEndVideo,
                    onCloseVideo: onCloseVideo,
                    onStartPlay: onStartPlay
                };
            } else {
                this.event.onCloseGame = onCloseGame;
                this.event.onEndVideo = onEndVideo;
                this.event.onCloseVideo = onCloseVideo;
                this.event.onStartPlay = onStartPlay;
            }
        };
        AdVideoHandlerNative.prototype._startVideo = function (errCode, cmd, data) {
            if (this.event && this.event.onStartPlay) {
                this.event.onStartPlay(errCode, '');
            } else {
                this.log('lack of onStartPlay callback');
            }
            this.log('_onStartPlay');
        };
        AdVideoHandlerNative.prototype._endVideo = function (errCode, cmd, data) {
            if (this.event && this.event.onEndVideo) {
                this.event.onEndVideo(errCode, '');
            } else {
                this.log('lack of onEnd callback');
            }
            this.log('_endVideo');
        };
        AdVideoHandlerNative.prototype._closeVideo = function (errCode, cmd, data) {
            this._resumeAllMusic();
            if (this.event && this.event.onCloseVideo) {
                this.event.onCloseVideo(errCode, '');
            } else {
                this.log('lack of onEnd callback');
            }
            this.log('_closeVideo');
            this.removeNativeListener();
        };
        AdVideoHandlerNative.prototype.removeNativeListener = function () {
            BK.MQQ.SsoRequest.removeListener(this.CMSHOW_SC_CMD_AD_VIDEO_START, this);
            BK.MQQ.SsoRequest.removeListener(this.CMSHOW_SC_CMD_AD_VIDEO_END, this);
            BK.MQQ.SsoRequest.removeListener(this.CMSHOW_SC_CMD_AD_VIDEO_CLOSE, this);
        };
        AdVideoHandlerNative.prototype.addNativeListener = function () {
            BK.MQQ.SsoRequest.addListener(this.CMSHOW_SC_CMD_AD_VIDEO_START, this, this._startVideo.bind(this));
            BK.MQQ.SsoRequest.addListener(this.CMSHOW_SC_CMD_AD_VIDEO_END, this, this._endVideo.bind(this));
            BK.MQQ.SsoRequest.addListener(this.CMSHOW_SC_CMD_AD_VIDEO_CLOSE, this, this._closeVideo.bind(this));
        };
        return AdVideoHandlerNative;
    }(AdVideoHandler);
    return {
        AdVideoHandler: AdVideoHandler,
        AdVideoHandlerNative: AdVideoHandlerNative
    };
}));
(function (global, factory) {
    if (typeof global === 'object') {
        global.Advertisement = factory().Advertisement;
        global.AdBannerHandler = factory().AdBannerHandler;
    }
}(BK, function () {
    var AdBannerHandler = function () {
        function AdBannerHandler(pos_id, adInfo) {
            this.closeUrl = 'https://i.hudongcdn.com/game_cdn/ad_close.png';
            this.adIconUrl = 'https://i.hudongcdn.com/game_cdn/ad_icon.png';
            this.pos_id = pos_id;
            this.event = {};
            this.adInfo = adInfo;
            this.sizeW = BK.Director.screenPixelSize.width * 0.78;
            var scW = BK.Director.screenPixelSize.width;
            var scH = BK.Director.screenPixelSize.height;
            if (scW > scH) {
                this.sizeW = scW * 0.44;
            }
            this.sizeH = this.sizeW * 166 / 582;
            this.closeBtnW = this.sizeW * 46 / 582;
            this.clsoeBtnH = this.sizeH * 46 / 166;
            this.btnSpace = this.sizeH * 14 / 166;
            BK.Script.log(1, 1, ' constructor: ' + this.btnSpace);
            this.adIconW = this.sizeW * 74 / 582;
            this.adIconH = this.sizeH * 46 / 166;
        }
        AdBannerHandler.prototype.isUseWebGL = function () {
            if (typeof gl == 'undefined') {
                return false;
            } else {
                return true;
            }
        };
        AdBannerHandler.prototype.onClickContent = function (callback) {
            this.event.onClickContent = callback;
        };
        AdBannerHandler.prototype.onClickClose = function (callback) {
            this.event.onClickClose = callback;
        };
        AdBannerHandler.prototype.show = function (callback) {
            if (this.isUseWebGL()) {
                this.showWebGLNode(callback);
            } else {
                this.showBKNode(callback);
            }
        };
        AdBannerHandler.prototype._onLoadBackgroundCallback = function (btn, statueCode, callback) {
            if (statueCode == 200) {
                this.exposeureReport();
                callback(0, 'OK', this);
            } else {
                callback(-1, 'load image failed!', this);
                this.close();
            }
        };
        AdBannerHandler.prototype._onClickContentBtn = function () {
            if (this.event.onClickContent) {
                this.event.onClickContent();
            }
            BK.MQQ.Webview.open(this.adInfo.report_info.click_url);
        };
        AdBannerHandler.prototype._onClickCloseBtn = function () {
            if (this.event.onClickClose) {
                this.event.onClickClose();
            }
            this.closeReport();
            this.close();
        };
        AdBannerHandler.prototype.showBKNode = function (callback) {
            this.rootNode = new BK.Node();
            this.rootNode.canUserInteract = true;
            this.backgound = new BK.Button(this.sizeW, this.sizeH);
            this.backgound.setNormalTextureFromUrl(this.adInfo.display_info.basic_info.img, function (btn, statueCode) {
                this._onLoadBackgroundCallback(btn, statueCode, callback);
            }.bind(this));
            this.rootNode.addChild(this.backgound);
            this.closeBtn = new BK.Button(this.closeBtnW, this.clsoeBtnH);
            this.closeBtn.position = {
                x: this.sizeW - this.closeBtnW - this.btnSpace,
                y: this.sizeH - this.clsoeBtnH - this.btnSpace
            };
            this.closeBtn.setNormalTextureFromUrl(this.closeUrl, function (btn, statueCode) {
                if (statueCode != 200) {
                }
            }.bind(this));
            this.rootNode.addChild(this.closeBtn);
            this.adIconBtn = new BK.Button(this.adIconW, this.adIconH);
            this.adIconBtn.position = {
                x: this.btnSpace,
                y: this.btnSpace
            };
            this.adIconBtn.setNormalTextureFromUrl(this.adIconUrl, function (btn, statueCode) {
                if (statueCode != 200) {
                    BK.Script.log(1, 1, '');
                }
            }.bind(this));
            this.rootNode.addChild(this.adIconBtn);
            this.backgound.setTouchInsideCallback(function (btn) {
                this._onClickContentBtn();
            }.bind(this));
            this.closeBtn.setTouchInsideCallback(function (btn) {
                this._onClickCloseBtn();
            }.bind(this));
            this.renderBKNode();
        };
        AdBannerHandler.prototype.renderBKNode = function () {
            var designW = BK.Director.screenPixelSize.width / BK.Director.root.scale.x;
            var adPicInDesignW = this.sizeW * (1 / BK.Director.root.scale.x);
            this.rootNode.position = {
                x: (designW - adPicInDesignW) / 2,
                y: 0
            };
            this.rootNode.scale = {
                x: 1 / BK.Director.root.scale.x,
                y: 1 / BK.Director.root.scale.y
            };
            BK.Director.root.addChild(this.rootNode);
        };
        AdBannerHandler.prototype.closeBKNode = function () {
            this.rootNode.removeFromParent();
        };
        AdBannerHandler.prototype.showWebGLNode = function (callback) {
            this.context = new BK.GLRenderContext();
            var projection = BK.JSMatrix.fromOrthographic(0, BK.Director.screenPixelSize.width, 0, BK.Director.screenPixelSize.height, -1, 1);
            this.context.setProjection(projection);
            var scW = BK.Director.screenPixelSize.width;
            var scH = BK.Director.screenPixelSize.height;
            this.glRootNode = new BK.GLRenderButton(this.context, this.sizeW, this.sizeH);
            this.glRootNode.canUserInteract = true;
            this.glRootNode.canClick = false;
            this.glRootNode.setUrlPath(this.adInfo.display_info.basic_info.img, function (btn, statueCode) {
                this.glRootNode.canClick = true;
                this._onLoadBackgroundCallback(btn, statueCode, callback);
            }.bind(this));
            this.glRootNode.position = {
                x: (scW - this.sizeW) / 2,
                y: 0
            };
            this.glCloseBtn = new BK.GLRenderButton(this.context, this.closeBtnW, this.clsoeBtnH);
            this.glCloseBtn.setUrlPath(this.closeUrl);
            this.glCloseBtn.position = {
                x: this.sizeW - this.closeBtnW - this.btnSpace,
                y: this.sizeH - this.clsoeBtnH - this.btnSpace
            };
            this.glRootNode.addChild(this.glCloseBtn);
            this.glAdIconBtn = new BK.GLRenderButton(this.context, this.adIconW, this.adIconH);
            this.glAdIconBtn.setUrlPath(this.adIconUrl);
            this.glAdIconBtn.position = {
                x: this.btnSpace,
                y: this.btnSpace
            };
            this.glRootNode.addChild(this.glAdIconBtn);
            this.glRootNode.setTouchInsideCallback(function (btn) {
                this._onClickContentBtn();
            }.bind(this));
            this.glCloseBtn.setTouchInsideCallback(function (btn) {
                this._onClickCloseBtn();
            }.bind(this));
            this.renderWebGLNode();
        };
        AdBannerHandler.prototype.renderWebGLNode = function () {
            UIEventHandler.setRootNode(this.glRootNode);
            BK.GLRenderContext.hookGLCommit(function (gl) {
                if (this.context && this.glRootNode) {
                    if (gl.methodWorking == false) {
                        return;
                    }
                    this.context.save();
                    gl.viewport(0, 0, BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
                    gl.disable(gl.DEPTH_TEST);
                    gl.useProgram(this.context.getProgram());
                    this.glRootNode.render();
                    this.context.restore();
                }
            }.bind(this));
        };
        AdBannerHandler.prototype.closeWebGLNode = function () {
            if (this.glRootNode) {
                this.glRootNode.dispose();
            }
            if (this.context) {
                this.context.dispose();
            }
            this.glRootNode = null;
            this.context = null;
            BK.GLRenderContext.exit();
        };
        AdBannerHandler.prototype.close = function () {
            if (this.isUseWebGL()) {
                this.closeWebGLNode();
            } else {
                this.closeBKNode();
            }
        };
        ;
        AdBannerHandler.prototype.exposeureReport = function () {
            if (this.adInfo.report_info && this.adInfo.report_info.exposure_url) {
                var fullReportUrl = this.adInfo.report_info.exposure_url;
                var httpget = new BK.HttpUtil(fullReportUrl);
                httpget.requestAsync(function (res, code) {
                    if (code == 200) {
                        BK.Script.log(1, 1, 'exposeureReport succ.');
                    } else {
                        BK.Script.log(1, 1, 'exposeureReport failed.statuscode:' + code);
                    }
                }.bind(this));
                this.cmshowReport(0);
            }
        };
        ;
        AdBannerHandler.prototype.closeReport = function () {
            if (this.adInfo.report_info && this.adInfo.report_info.negative_feedback_url) {
                var fullReportUrl = this.adInfo.report_info.negative_feedback_url;
                fullReportUrl = fullReportUrl.replace('__ACT_TYPE__', '2001');
                var httpget = new BK.HttpUtil(fullReportUrl);
                httpget.requestAsync(function (res, code) {
                    if (code == 200) {
                        BK.Script.log(1, 1, 'negative_feedback succ.');
                    } else {
                        BK.Script.log(1, 1, 'negative_feedback failed.statuscode:' + code);
                    }
                }.bind(this));
                this.cmshowReport(3);
            } else {
                BK.Script.log(1, 1, 'closeReport failed.can not find the negative_feedback_url');
            }
        };
        AdBannerHandler.prototype.cmshowReport = function (env) {
            var action = 'banner_SPA';
            var enter = this.pos_id;
            var result = env.toString();
            BK.QQ.uploadData(action, enter, result, '', '', '');
        };
        AdBannerHandler.prototype.reportParamToString = function () {
            var paramObj = this.adInfo.report_info.trace_info;
            var paramStr = '';
            if (typeof paramObj == 'object') {
                for (var k in paramObj) {
                    paramStr = paramStr + k + '=' + paramObj[k] + '&';
                }
                paramStr = paramStr.substring(0, paramStr.length - 1);
            }
            return paramStr;
        };
        return AdBannerHandler;
    }();
    ;
    var Advertisement = function () {
        function Advertisement() {
        }
        Advertisement.fetch = function (posid, callback) {
            if (GameStatusInfo.devPlatform) {
                var data = this.getDebugRetData();
                this.parseQQAdGetRsp(data, callback);
            } else {
                var cmd = 'apollo_router_game.game_ad_linkcmd_get_ad';
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                    if (errCode == 0) {
                        this.parseQQAdGetRsp(data, callback);
                    } else {
                        callback(errCode, 'sso respose not 0.', null);
                    }
                }.bind(this));
                var reqData = {
                    game_id: GameStatusInfo.gameId,
                    posid: posid
                };
                BK.MQQ.SsoRequest.send(reqData, cmd);
            }
        };
        Advertisement.videoCMReport = function (videoType, env) {
            var action = 'enter_SPA';
            var enter = videoType.toString();
            var result = env.toString();
            var openId = GameStatusInfo.openId;
            BK.QQ.uploadData(action, enter, result, openId, '', '');
        };
        Advertisement.parseQQAdGetRsp = function (adData, callback) {
            if (adData.ret == 0) {
                if (adData.pos_ads_info.length > 0) {
                    var posAdInfo = adData.pos_ads_info[0];
                    if (posAdInfo.ret == 0) {
                        BK.Script.log(1, 1, 'fetch ad 广告位id:' + posAdInfo.pos_id);
                        var adsInfo = posAdInfo.ads_info;
                        if (adsInfo.length > 0) {
                            var singleADs = adsInfo[0];
                            if (singleADs.display_info.pattern_type == 14) {
                                BK.Script.log(1, 1, '成功拉取Banner广告');
                            } else if (singleADs.display_info.pattern_type == 3) {
                                BK.Script.log(1, 1, '成功拉取视频广告');
                            }
                            callback(0, 'OK', singleADs);
                        }
                    } else {
                        BK.Script.log(1, 1, '广告位信息返回失败为空 ret:' + posAdInfo.ret + ' msg:' + posAdInfo.msg);
                        callback(-1, 'posAdInfo.ret not succeed 0. Detail:' + JSON.stringify(adData), null);
                    }
                } else {
                    BK.Script.log(1, 1, 'fetch ad 广告信息为空');
                    callback(-1, 'pos_ads_info.length is 0.Detail:' + JSON.stringify(adData), null);
                }
            } else {
                BK.Script.log(1, 1, 'fetch ad failed.ret:' + adData.ret + ' msg:' + adData.msg);
                callback(-1, 'fetch ad failed. Detail:' + JSON.stringify(adData), null);
            }
        };
        Advertisement.fetchBannerAd = function (callback) {
            var posid = '6030739316978191';
            this.fetch(posid, function (retCode, msg, data) {
                if (retCode == 0) {
                    var bannerHandle = new AdBannerHandler(posid, data);
                    callback(retCode, msg, bannerHandle);
                } else {
                    callback(retCode, msg, null);
                }
            }.bind(this));
        };
        Advertisement.fetchVideoAd = function (adVideoType, callback) {
            var posid;
            switch (adVideoType) {
            case 0:
                posid = '2070535377286161';
                break;
            case 1:
                posid = '7050835357984103';
                break;
            case 2:
                posid = '4010139256618321';
                break;
            case 3:
                posid = '5030538286214342';
                break;
            }
            this.videoCMReport(adVideoType, 4);
            this.fetch(posid, function (retCode, msg, data) {
                if (!data) {
                    callback(-1, 'ad data is undefined or null', null);
                    return;
                }
                var adOrientation = 1;
                if (data && data.display_info && data.display_info.creative_size) {
                    if (data.display_info.creative_size == 185) {
                        adOrientation = 3;
                    } else if (data.display_info.creative_size == 585) {
                        adOrientation = 1;
                    }
                } else {
                    BK.Script.log(1, 1, 'fetch ad has problem.lack of display_info.creative_size property.');
                }
                var deviceOrientation = 1;
                var gameConfig = this.getGameConfig();
                if (gameConfig) {
                    if (typeof gameConfig.viewMode != 'undefined') {
                        deviceOrientation = gameConfig.viewMode;
                    }
                }
                var canShowVideoAd = true;
                var cannotShowMsg = '';
                if (data.display_info && data.display_info.video_info && data.display_info.video_info.tencent_video_id && typeof data.display_info.video_info.tencent_video_id == 'string' && data.display_info.video_info.tencent_video_id.length > 0) {
                    canShowVideoAd = true;
                } else {
                    canShowVideoAd = false;
                    cannotShowMsg = 'can not find video id';
                }
                if ((deviceOrientation == 3 || deviceOrientation == 2) && adOrientation == 1) {
                    canShowVideoAd = false;
                    cannotShowMsg = 'device oriation compare failed.device :' + deviceOrientation.toString() + ' ad:' + adOrientation.toString();
                }
                if (canShowVideoAd == true) {
                    if (retCode == 0) {
                        this.videoCMReport(adVideoType, 5);
                        var videoHandle = undefined;
                        if (BK.isBrowser == true || BK.Misc.compQQVersion(GameStatusInfo.QQVer, '7.7.0')) {
                            videoHandle = new BK.AdVideoHandler(adVideoType, posid, data, deviceOrientation);
                        } else {
                            videoHandle = new BK.AdVideoHandlerNative(adVideoType, posid, data, deviceOrientation);
                        }
                        callback(retCode, msg, videoHandle);
                    } else {
                        callback(retCode, msg, null);
                    }
                } else {
                    callback(-1, 'no ads found.' + cannotShowMsg, null);
                }
            }.bind(this));
        };
        Advertisement.getGameConfig = function () {
            if (BK.isBrowser) {
                return undefined;
            } else {
                var buff = BK.FileUtil.readFile('GameRes://gameConfig.json');
                if (buff) {
                    var jsonStr = buff.readAsString();
                    var json = JSON.parse(jsonStr);
                    return json;
                } else {
                    return undefined;
                }
            }
        };
        Advertisement.getDebugRetData = function () {
            var displayInfo = {
                pattern_type: 1,
                creative_size: 1,
                animation_effect: 1,
                basic_info: {
                    img: 'http://mat1.gtimg.com/ipad/qq_time/imgs/20180505_lixia_base.jpg',
                    img_s: 'http://mat1.gtimg.com/ipad/images/time/timelogo.jpg',
                    txt: '广告素材的标题',
                    desc: '广告的详细描述'
                },
                button_info: [{
                        txt: '按钮',
                        url: 'http://www.qq.com',
                        pos: 1
                    }],
                muti_pic_text_info: {
                    txt: [
                        'txt1',
                        'txt2'
                    ],
                    image: [
                        'http://txt2.png',
                        'http://txt2.png'
                    ],
                    url: [
                        'http://txt2.png',
                        'http://txt2.png'
                    ]
                },
                advertiser_info: {
                    corporation_name: 'string',
                    corporate_image_name: 'string',
                    corporate_logo: 'string'
                },
                video_info: {
                    video_url: 'string',
                    media_duration: 30
                }
            };
            var destInfo = {
                dest_url_display_type: 1,
                landing_page: 'https://www.qq.com',
                canvas_json: 'string',
                dest_type: 1
            };
            var adInfo = {
                product_type: 1,
                display_info: displayInfo,
                report_info: undefined,
                dest_info: destInfo,
                app_info: undefined
            };
            var posAdInfo = {
                ret: 0,
                msg: 'string',
                pos_id: 'string',
                ads_info: [adInfo]
            };
            var data = {
                ret: 0,
                msg: 's',
                pos_ads_info: [posAdInfo],
                gdt_cookie: 'string',
                busi_cookie: 'string'
            };
            return data;
        };
        Advertisement.openAdVideo = function (adInfo, gameOrientation) {
            var cmd = 'cs.openWebViewWithoutUrl.local';
            var url = 'https://cmshow.qq.com/apollo/html/game-platform/game-ad.html';
            var orientation = 1;
            if (typeof gameOrientation == 'undefined') {
                orientation = 1;
            } else {
                orientation = gameOrientation;
            }
            url = url + '?gameOrientation=' + orientation + '&';
            url = url + 'gameId=' + GameStatusInfo.gameId + '&';
            url = url + 'adInfo=' + JSON.stringify(adInfo);
            var transparentNum = 1;
            var data = {
                'gameOrientation': gameOrientation,
                'transparent': transparentNum,
                'businessType': 2,
                'openId': GameStatusInfo.openId,
                'url': url
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        return Advertisement;
    }();
    return {
        Advertisement: Advertisement,
        AdBannerHandler: AdBannerHandler
    };
}));
if (isBrowser) {
    var __browserMsgHdl = {};
    BK.MQQ.SsoRequest.listenerInfos = [];
    BK.MQQ.SsoRequest.addListener = function (cmd, target, callback) {
        var listenerInfoTmp = {
            'cmd': cmd,
            'target': target,
            'callback': callback
        };
        var isExist = false;
        BK.MQQ.SsoRequest.listenerInfos.forEach(function (listenerInfo) {
            if (listenerInfo['cmd'] == cmd && listenerInfo['target'] == target) {
                listenerInfo.callback = callback;
                isExist == true;
            }
        }, this);
        if (isExist == false) {
            BK.MQQ.SsoRequest.listenerInfos.push(listenerInfoTmp);
        }
    };
    BK.MQQ.SsoRequest.removeListener = function (cmd, target) {
        var len = BK.MQQ.SsoRequest.listenerInfos.length;
        var removeIndex = -1;
        for (var index = 0; index < len; index++) {
            var listenerInfo = BK.MQQ.SsoRequest.listenerInfos[index];
            if (listenerInfo['cmd'] == cmd && listenerInfo['target'] == target) {
                removeIndex = index;
            }
        }
        if (removeIndex != -1) {
            BK.MQQ.SsoRequest.listenerInfos.splice(removeIndex, 1);
        }
    };
    __browserMsgHdl.listenerInfos = [];
    __browserMsgHdl.addListener = function (cmd, target, callback) {
        var listenerInfoTmp = {
            'cmd': cmd,
            'target': target,
            'callback': callback
        };
        var isExist = false;
        __browserMsgHdl.listenerInfos.forEach(function (listenerInfo) {
            if (listenerInfo['cmd'] == cmd && listenerInfo['target'] == target) {
                listenerInfo.callback = callback;
                isExist = true;
            }
        }, this);
        if (isExist == false) {
            __browserMsgHdl.listenerInfos.push(listenerInfoTmp);
        }
    };
    __browserMsgHdl.removeListener = function (cmd, target) {
        var len = __browserMsgHdl.listenerInfos.length;
        var removeIndex = -1;
        for (var index = 0; index < len; index++) {
            var listenerInfo = __browserMsgHdl.listenerInfos[index];
            if (listenerInfo['cmd'] == cmd && listenerInfo['target'] == target) {
                removeIndex = index;
            }
        }
        if (removeIndex != -1) {
            __browserMsgHdl.listenerInfos.splice(removeIndex, 1);
        }
    };
    function __dispatchEvent(errCode, cmd, dataStr) {
        BK.Script.log(0, 0, '__dispatchEvent err:' + errCode + ' cmd:' + cmd + ' data:' + dataStr);
        if (Array.isArray(__browserMsgHdl.listenerInfos) && __browserMsgHdl.listenerInfos.length <= 0 && cmd == 'sc.init_global_var.local') {
            GameStatusInfo = JSON.parse(dataStr);
        }
        __browserMsgHdl.listenerInfos.forEach(function (listenerInfo) {
            if (listenerInfo['cmd'] == cmd) {
                var callback = listenerInfo['callback'];
                try {
                    if ('cs.get_file_data.local' == cmd) {
                        callback(errCode, cmd, dataStr);
                    } else {
                        callback(errCode, cmd, JSON.parse(dataStr));
                    }
                } catch (error) {
                    console.log(error);
                    BK.Script.log(0, 0, 'JSON parse error:' + error + ' data: ' + dataStr);
                }
            }
        }, this);
        BK.MQQ.SsoRequest.listenerInfos.forEach(function (listenerInfo) {
            if (listenerInfo['cmd'] == cmd) {
                var callback = listenerInfo['callback'];
                callback(errCode, cmd, JSON.parse(dataStr));
            }
        }, this);
    }
}
(function (global, factory) {
    if (typeof global === 'object') {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Game = factory();
    }
}(isBrowser == true ? window : BK, function () {
    var Event;
    (function (Event) {
        Event[Event['load'] = 0] = 'load';
        Event[Event['min'] = 1] = 'min';
        Event[Event['max'] = 2] = 'max';
        Event[Event['share'] = 3] = 'share';
        Event[Event['enterBackground'] = 4] = 'enterBackground';
        Event[Event['enterForeground'] = 5] = 'enterForeground';
    }(Event || (Event = {})));
    ;
    var Platform;
    (function (Platform) {
        Platform[Platform['native'] = 0] = 'native';
        Platform[Platform['browser'] = 1] = 'browser';
    }(Platform || (Platform = {})));
    var Game = function () {
        function Game(cfg) {
            this.CMSHOW_CS_CMD_CLOSE_WND = 'cs.close_room.local';
            this.CMSHOW_CS_CMD_SHARE_INFO = 'cs.game_shell_share_callback.local';
            this.CMSHOW_SC_CMD_SHELL_PACK_UP = 'sc.game_shell_pack_up.local';
            this.CMSHOW_SC_CMD_SHELL_SHARE = 'sc.game_shell_share.local';
            this.CMSHOW_SC_CMD_SHELL_SHARE_COMPLETE = 'sc.share_game_to_friend_result.local';
            this.CMSHOW_SC_CMD_SHELL_CLOSE = 'sc.game_shell_close.local';
            this.CMD_CMSHOW_GAME_ENTER_BACKGROUND = 'sc.game_enter_background.local';
            this.CMD_CMSHOW_GAME_ENTER_FORGROUND = 'sc.game_enter_foreground.local';
            this.CMD_CMSHOW_GAME_MAXIMIZE = 'sc.game_maximize.local';
            this.CMD_CMSHOW_GAME_MINIMIZE = 'sc.game_minimize.local';
            this.CMD_CMSHOW_GAME_INIT_GLOBAL_VAR = 'sc.init_global_var.local';
            this.CMD_CMSHOW_GAME_NETWORK_CHANGE = 'sc.network_change.local';
            this.cfg = cfg;
            this.addAllListener();
            if (this.cfg.onLoad && (!isBrowser || isBrowser && typeof GameStatusInfo !== 'undefined')) {
                this.cfg.onLoad(this);
            }
        }
        Game.prototype.log = function (str) {
            BK.Script.log(0, 0, 'Game:' + str);
        };
        Game.prototype.errorMessage = function () {
            return this.err.message;
        };
        Game.prototype.errorStacktrace = function () {
            return this.err.stacktrace;
        };
        Game.prototype.__isBrowser = function () {
            return isBrowser;
        };
        Game.prototype.platform = function () {
            var _isBrowser = this.__isBrowser();
            if (_isBrowser) {
                return Platform.browser;
            } else {
                return Platform.native;
            }
        };
        Game.prototype.addAllListener = function () {
            if (this.platform() == Platform.native) {
                BK.Script.setErrorObserver(function (message, stacktrace) {
                    if (this.cfg.onException) {
                        this.err = {
                            'message': message,
                            'stacktrace': stacktrace
                        };
                        this.cfg.onException(this);
                    }
                }.bind(this));
                BK.MQQ.SsoRequest.addListener(this.CMD_CMSHOW_GAME_ENTER_BACKGROUND, this, this._onEnterBackground.bind(this));
                BK.MQQ.SsoRequest.addListener(this.CMD_CMSHOW_GAME_ENTER_FORGROUND, this, this._onEnterForeground.bind(this));
                BK.MQQ.SsoRequest.addListener(this.CMD_CMSHOW_GAME_MAXIMIZE, this, this._onMax.bind(this));
                BK.MQQ.SsoRequest.addListener(this.CMD_CMSHOW_GAME_MINIMIZE, this, this._onMin.bind(this));
                BK.MQQ.SsoRequest.addListener(this.CMSHOW_SC_CMD_SHELL_SHARE, this, this._onShare.bind(this));
                BK.MQQ.SsoRequest.addListener(this.CMSHOW_SC_CMD_SHELL_SHARE_COMPLETE, this, this._onShareComplete.bind(this));
                BK.MQQ.SsoRequest.addListener(this.CMSHOW_SC_CMD_SHELL_CLOSE, this, this._onClose.bind(this));
                BK.MQQ.SsoRequest.addListener(this.CMD_CMSHOW_GAME_NETWORK_CHANGE, this, this._onNetworkChange.bind(this));
            } else {
                __browserMsgHdl.addListener(this.CMD_CMSHOW_GAME_ENTER_BACKGROUND, this, this._onEnterBackground.bind(this));
                __browserMsgHdl.addListener(this.CMD_CMSHOW_GAME_ENTER_FORGROUND, this, this._onEnterForeground.bind(this));
                __browserMsgHdl.addListener(this.CMD_CMSHOW_GAME_MINIMIZE, this, this._onMin.bind(this));
                __browserMsgHdl.addListener(this.CMD_CMSHOW_GAME_MAXIMIZE, this, this._onMax.bind(this));
                __browserMsgHdl.addListener(this.CMSHOW_SC_CMD_SHELL_SHARE, this, this._onShare.bind(this));
                __browserMsgHdl.addListener(this.CMSHOW_SC_CMD_SHELL_SHARE_COMPLETE, this, this._onShareComplete.bind(this));
                __browserMsgHdl.addListener(this.CMSHOW_SC_CMD_SHELL_CLOSE, this, this._onClose.bind(this));
                __browserMsgHdl.addListener(this.CMD_CMSHOW_GAME_INIT_GLOBAL_VAR, this, this._onInitGlobalVar.bind(this));
                __browserMsgHdl.addListener(this.CMD_CMSHOW_GAME_NETWORK_CHANGE, this, this._onNetworkChange.bind(this));
            }
        };
        Game.prototype.removeAllListener = function () {
            if (this.platform() == Platform.native) {
                BK.Script.setErrorObserver(undefined);
                BK.MQQ.SsoRequest.removeListener(this.CMD_CMSHOW_GAME_ENTER_BACKGROUND, this);
                BK.MQQ.SsoRequest.removeListener(this.CMD_CMSHOW_GAME_ENTER_FORGROUND, this);
                BK.MQQ.SsoRequest.removeListener(this.CMD_CMSHOW_GAME_MAXIMIZE, this);
                BK.MQQ.SsoRequest.removeListener(this.CMSHOW_SC_CMD_SHELL_PACK_UP, this);
                BK.MQQ.SsoRequest.removeListener(this.CMSHOW_SC_CMD_SHELL_SHARE, this);
                BK.MQQ.SsoRequest.removeListener(this.CMSHOW_SC_CMD_SHELL_CLOSE, this);
                BK.MQQ.SsoRequest.removeListener(this.CMD_CMSHOW_GAME_NETWORK_CHANGE, this);
            } else {
                __browserMsgHdl.removeListener(this.CMD_CMSHOW_GAME_ENTER_BACKGROUND, this);
                __browserMsgHdl.removeListener(this.CMD_CMSHOW_GAME_ENTER_FORGROUND, this);
                __browserMsgHdl.removeListener(this.CMD_CMSHOW_GAME_MAXIMIZE, this);
                __browserMsgHdl.removeListener(this.CMSHOW_SC_CMD_SHELL_PACK_UP, this);
                __browserMsgHdl.removeListener(this.CMSHOW_SC_CMD_SHELL_SHARE, this);
                __browserMsgHdl.removeListener(this.CMSHOW_SC_CMD_SHELL_CLOSE, this);
                __browserMsgHdl.removeListener(this.CMD_CMSHOW_GAME_INIT_GLOBAL_VAR, this);
                __browserMsgHdl.removeListener(this.CMD_CMSHOW_GAME_NETWORK_CHANGE, this);
            }
        };
        Game.prototype._onEnterBackground = function () {
            if (this.cfg.onEnterBackground) {
                this.cfg.onEnterBackground(this);
            }
        };
        Game.prototype._onEnterForeground = function () {
            if (this.cfg.onEnterForeground) {
                this.cfg.onEnterForeground(this);
            }
        };
        Game.prototype._onMax = function () {
            if (this.cfg.onMaximize) {
                this.cfg.onMaximize(this);
            }
        };
        Game.prototype._onMin = function () {
            if (this.cfg.onMinimize) {
                this.cfg.onMinimize(this);
            }
        };
        Game.prototype._onShare = function () {
            if (this.cfg.onShare) {
                var shareInfo = this.cfg.onShare(this);
                this.confirmShare(shareInfo);
            } else {
                this.confirmShare();
            }
        };
        Game.prototype._onShareComplete = function (errCode, cmd, data) {
            if (this.cfg.onShareComplete) {
                if (data.reqCode == 0) {
                    var ret = data.ret;
                    var isFrist = data.isFirstTimeShare == 0 ? true : false;
                    var shareTo = data.shareTo;
                    this.cfg.onShareComplete(this, ret, shareTo, isFrist);
                }
            }
        };
        Game.prototype._onClose = function () {
            if (this.cfg.onClose) {
                this.cfg.onClose(this);
            }
            this._confirmClose();
        };
        Game.prototype._confirmClose = function () {
            if (this.platform() == Platform.native) {
                BK.MQQ.SsoRequest.send({}, this.CMSHOW_CS_CMD_CLOSE_WND);
            } else {
                BK.MQQ.SsoRequest.sendTo({}, this.CMSHOW_CS_CMD_CLOSE_WND);
            }
        };
        Game.prototype.confirmShare = function (shareInfo) {
            var data = shareInfo ? shareInfo : {};
            data.reqCode = 0;
            if (this.platform() == Platform.native) {
                BK.MQQ.SsoRequest.send(data, this.CMSHOW_CS_CMD_SHARE_INFO);
            } else {
                BK.MQQ.SsoRequest.sendTo(data, this.CMSHOW_CS_CMD_SHARE_INFO);
            }
        };
        Game.prototype._onInitGlobalVar = function (errCode, cmd, data) {
            if (typeof data.uin !== 'undefined') {
                delete data.uin;
            }
            GameStatusInfo = data;
            if (this.cfg.onLoad) {
                this.cfg.onLoad(this);
            }
        };
        Game.prototype._onNetworkChange = function (errCode, cmd, data) {
            if (this.cfg.onNetworkChange) {
                if (typeof data.type == 'undefined') {
                    BK.Script.log(1, 1, 'net work change .data is worng!');
                } else {
                    this.cfg.onNetworkChange(this, data.type);
                }
            }
        };
        return Game;
    }();
    return Game;
}));
