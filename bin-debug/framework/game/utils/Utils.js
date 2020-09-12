var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Utils = (function () {
    function Utils() {
    }
    /**
     * 设置锚点居中
     */
    Utils.setAnchorCenter = function (component) {
        component.anchorOffsetX = component.width / 2;
        component.anchorOffsetY = component.height / 2;
    };
    /**
     * 计算两点距离
     * @param p1
     * @param p2
     * @returns {number}
     */
    Utils.distance = function (p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };
    /**
     * 判断直线A是否与线段B相交（线面相交）
     * @param A 线段A的一个端点
     * @param B 线段A的一个端点
     * @param C 线段B的一个端点
     * @param D 线段B的一个端点
     * @returns {boolean}
     */
    Utils.lineIntersectSide = function (A, B, C, D) {
        var fC = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
        var fD = (D.y - A.y) * (A.x - B.x) - (D.x - A.x) * (A.y - B.y);
        if (fC * fD > 0) {
            return false;
        }
        return true;
    };
    /**
     * 判断直线A是否与线段B相交（面面相交）
     * @param A 线段A的一个端点
     * @param B 线段A的一个端点
     * @param C 线段B的一个端点
     * @param D 线段B的一个端点
     * @returns {boolean}
     */
    Utils.sideIntersectSide = function (A, B, C, D) {
        if (!Utils.lineIntersectSide(A, B, C, D))
            return false;
        if (!Utils.lineIntersectSide(C, D, A, B))
            return false;
        return true;
    };
    /**
     * 通过边获取角度
     * @param oppositeSideLen 对边长
     * @param adjacentSide 邻边长
     */
    Utils.getAngleBySide = function (oppositeSideLen, adjacentSideLen) {
        return Math.atan(oppositeSideLen / adjacentSideLen) * (180 / Math.PI);
    };
    /**
     * 设置富文本
     */
    Utils.setRichText = function (text, str) {
        if (!text) {
            return;
        }
        if (str) {
            var htmlParser = new egret.HtmlTextParser();
            text.textFlow = htmlParser.parse(str);
        }
        else {
            text.text = str;
        }
    };
    /**基于矩形的碰撞检测*/
    Utils.hitTest = function (obj1, obj2) {
        if (obj1.getBounds != null && obj2.getBounds != null) {
            var rect1 = obj1.getBounds();
            var rect2 = obj2.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            return rect1.intersects(rect2);
        }
    };
    /**
      * 统计字符串的字节数
      * @param str 需要统计的字符串
      * @return {number} 字节数长度
      */
    Utils.checkLength = function (str) {
        var bytes = new egret.ByteArray();
        bytes.writeUTF(str);
        return bytes.length;
    };
    /**
     * 返回以x轴右方为0开始的顺时针旋转的角度
     * centralPointX:中心点x坐标
     * centralPointY:中心点y坐标
     * distancePointX:距离点x坐标
     * distancePointY:距离点y坐标
     */
    Utils.pointAmongAngle = function (centralPointX, centralPointY, distancePointX, distancePointY) {
        var valueX = distancePointX - centralPointX;
        var valueY = distancePointY - centralPointY;
        var m_pDegrees = 0;
        if (valueX == 0 && valueY == 0) {
            return 0;
        }
        else if (valueX >= 0 && valueY >= 0) {
            m_pDegrees = Math.atan(valueY / valueX) * 180 / Math.PI;
        }
        else if (valueX <= 0 && valueY >= 0) {
            m_pDegrees = Math.atan(Math.abs(valueX) / valueY) * 180 / Math.PI + 90;
        }
        else if (valueX <= 0 && valueY <= 0) {
            m_pDegrees = Math.atan(Math.abs(valueY) / Math.abs(valueX)) * 180 / Math.PI + 180;
        }
        else if (valueX >= 0 && valueY <= 0) {
            m_pDegrees = Math.atan(valueX / Math.abs(valueY)) * 180 / Math.PI + 270;
        }
        return m_pDegrees;
    };
    /**
     * 一维数组转二维数组
     * @param arr   要转换的数组
     * @param cols  单行列数
     */
    Utils.arrToArr2 = function (arr, cols) {
        var arr2 = [];
        if (arr) {
            var rowArr = void 0;
            for (var i = 0, iLen = arr.length; i < iLen; i++) {
                if (i % cols === 0) {
                    rowArr = [];
                    arr2.push(rowArr);
                }
                rowArr.push(arr[i]);
            }
        }
        return arr2;
    };
    /**
     * 截流函数
     */
    Utils.throttle = function (fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    };
    ;
    /**
     * 获取uri参数
     */
    Utils.getQueryString = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return r[2];
        }
        return null;
    };
    /**
   * 将时间戳转换成日期格式,
   * isRide :时间戳为10位时，传true,时间戳为13位时传false
   */
    Utils.timestampToTime = function (timestamp, isRide) {
        if (isRide === void 0) { isRide = false; }
        var time = timestamp;
        if (isRide) {
            time = time * 1000;
        }
        var date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var hour0 = h;
        var hour = hour0 + ":";
        var minutes = m + ":";
        var second = s + "";
        if (hour0 / 10 < 1) {
            hour = "0" + hour;
        }
        if (m / 10 < 1) {
            minutes = "0" + minutes;
        }
        if (s / 10 < 1) {
            second = "0" + second;
        }
        return hour + minutes + second;
    };
    /**
     * 将秒（毫秒）转为00：00：00格式
     * isRide :毫秒，传true
     */
    Utils.secondToTime = function (timestamp, isRide) {
        if (isRide === void 0) { isRide = false; }
        var times = timestamp;
        if (isRide) {
            times = times / 1000;
        }
        var hour = Math.floor(times / 3600);
        var hour0 = hour + "";
        if (hour < 10) {
            hour0 = "0" + hour;
        }
        if (hour <= 0) {
            hour0 = "00";
        }
        var minute = Math.floor((times - 3600 * hour) / 60);
        var minute0 = minute + "";
        if (minute < 10) {
            minute0 = "0" + minute;
        }
        if (minute <= 0) {
            minute0 = "00";
        }
        var second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
        var second0 = second + "";
        if (second < 10) {
            second0 = "0" + second;
        }
        if (second <= 0) {
            second0 = "00";
        }
        var result = hour0 + ':' + minute0 + ':' + second0;
        if (hour == NaN || minute == NaN || second == NaN) {
            return "";
        }
        return result;
    };
    /**
     * 改变金币的现实方式：超过1w最小单位为1w（浮点数后面跟两位）；如1.12w
     * @param  {int} goldText 金币数量
     * @return {string}          显示文本
     */
    Utils.getGoldText = function (gold) {
        gold = Number(gold);
        var negative = "";
        var str = "";
        if (gold >= 100000000) {
            var text = gold / 100000000;
            if (text % 1 == 0) {
                return negative + text.toFixed(0) + "亿";
            }
            if (text < 10) {
                str = text + "";
                str = str.substring(0, str.lastIndexOf('.') + 3) + "亿"; //不四舍五入
                return negative + str;
            }
            str = text + "";
            str = str.substring(0, str.lastIndexOf('.') + 3) + "亿";
            return negative + str;
        }
        if (gold >= 10000) {
            var text = gold / 10000;
            if (text % 1 == 0) {
                return negative + text.toFixed(2) + "万";
            }
            if (text < 10) {
                str = text + "";
                str = str.substring(0, str.lastIndexOf('.') + 3) + "万"; //不四舍五入
                return negative + str;
            }
            str = text + "";
            str = str.substring(0, str.lastIndexOf('.') + 3) + "万";
            return negative + str;
        }
        if (String(gold).indexOf(".") != -1) {
            return "" + negative + gold.toFixed(2);
        }
        return "" + negative + gold;
    };
    Utils.getShortName = function (_str, label) {
        this.tf.size = label.size;
        var arr = _str.split("");
        this.tf.text = "";
        for (var i = 0; i < arr.length; i++) {
            this.tf.text += arr[i] + "";
            if (this.tf.width > label.width) {
                return _str.slice(0, i - 1) + "..";
            }
        }
        return _str;
    };
    /**
     * 设置容器子元件的透明度
     */
    Utils.setChildrenVisible = function (container, visible) {
        for (var i = 0; i < container.numChildren; i++) {
            container.getChildAt(i).visible = visible;
        }
    };
    /**
     * 获取位图数字
     */
    Utils.getBitmapVal = function (num) {
        var balanceStr = num.toString();
        if (num.indexOf("-") !== -1) {
            balanceStr = balanceStr.replace(/0/g, "a");
            balanceStr = balanceStr.replace(/1/g, "b");
            balanceStr = balanceStr.replace(/2/g, "c");
            balanceStr = balanceStr.replace(/3/g, "d");
            balanceStr = balanceStr.replace(/4/g, "e");
            balanceStr = balanceStr.replace(/5/g, "f");
            balanceStr = balanceStr.replace(/6/g, "g");
            balanceStr = balanceStr.replace(/7/g, "h");
            balanceStr = balanceStr.replace(/8/g, "i");
            balanceStr = balanceStr.replace(/9/g, "j");
            balanceStr = balanceStr.replace(/\./g, "o");
            return balanceStr;
        }
        else {
            balanceStr = balanceStr.replace(/\./g, "z");
            return "+" + balanceStr;
        }
    };
    /**
     * 获取eui组件相对中点的值
     */
    Utils.getHVCenter = function (t) {
        var target = null;
        if (!t) {
            throw new Error("组件不存在，不能取到中心点");
        }
        if (isNaN(t.horizontalCenter) && isNaN(t.left) && isNaN(t.right)) {
            if (t.parent) {
                target = t.parent;
            }
            else {
                return;
            }
        }
        else {
            target = t;
        }
        var _x = 0, _y = 0;
        var verticalCenter = 0, horizontalCenter = 0;
        if (!isNaN(target.horizontalCenter)) {
            horizontalCenter = target.horizontalCenter;
        }
        else if (!isNaN(target.left)) {
            _x = target.left;
            horizontalCenter = _x - GameConfig.curWidth() / 2 + target.width / 2;
        }
        else if (!isNaN(target.right)) {
            _x = target.right;
            horizontalCenter = GameConfig.curWidth() / 2 - _x - target.width / 2;
        }
        if (!isNaN(target.verticalCenter)) {
            verticalCenter = target.verticalCenter;
        }
        else if (!isNaN(target.top)) {
            _y = target.top;
            verticalCenter = _y - GameConfig.curHeight() / 2 + target.height / 2;
        }
        else if (!isNaN(target.bottom)) {
            _y = target.bottom;
            verticalCenter = GameConfig.curHeight() / 2 - _y - target.height / 2;
        }
        return new egret.Point(horizontalCenter, verticalCenter);
    };
    /**
     * 贝塞尔曲线缓动
     * http://www.j--d.com/bezier
     */
    Utils.bezier = function (target, a, b, c, d, e, f, g, h, duration, cb, thisObj) {
        if (duration === void 0) { duration = 15000; }
        var origin = new egret.Point(a, b);
        var control1 = new egret.Point(c, d);
        var control2 = new egret.Point(e, f);
        var destination = new egret.Point(g, h);
        var obj = {
            get factor() {
                return 0;
            },
            set factor(t) {
                target.x = Math.pow(1 - t, 3) * origin.x + 3.0 * Math.pow(1 - t, 2) * t * control1.x + 3.0 * (1 - t) * t * t * control2.x + t * t * t * destination.x;
                target.y = Math.pow(1 - t, 3) * origin.y + 3.0 * Math.pow(1 - t, 2) * t * control1.y + 3.0 * (1 - t) * t * t * control2.y + t * t * t * destination.y;
            }
        };
        //起点P0  控制点P1  终点P2
        //(1 - t)^2 P0 + 2 t (1 - t) P1 + t^2 P2
        //在1秒内，this的factor属性将会缓慢趋近1这个值，这里的factor就是曲线中的t属性，它是从0到1的闭区间。
        egret.Tween.get(obj).to({ factor: 1 }, duration).call(function () {
            cb && cb.apply(thisObj);
        });
    };
    /**
     * base64转为图片
     */
    Utils.getTexture = function (base64, callback) {
        var img = new Image();
        img["avaliable"] = true;
        img.src = base64;
        img.onload = function () {
            var texture = new egret.Texture();
            var bitmapdata = new egret.BitmapData(img);
            texture._setBitmapData(bitmapdata);
            callback(texture);
        };
    };
    Utils.gray = function (display) {
        //变灰
        var colorMatrix = [
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        display.filters = [colorFlilter];
    };
    /**
     * 高亮
     */
    Utils.highLight = function (display) {
        var colorMatrix = [
            1, 0, 0, 0, 50,
            0, 1, 0, 0, 50,
            0, 0, 1, 0, 50,
            0, 0, 0, 1, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        display.filters = [colorFlilter];
    };
    /**
     * 改变图片颜色
     * https://blog.csdn.net/honey199396/article/details/80600867
     */
    Utils.setImageColor = function (image, color) {
        // 将16进制颜色分割成rgb值
        var spliceColor = function (color) {
            var result = { r: -1, g: -1, b: -1 };
            result.b = color % 256;
            result.g = Math.floor((color / 256)) % 256;
            result.r = Math.floor((color / 256) / 256);
            return result;
        };
        var result = spliceColor(color);
        var colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        colorMatrix[0] = result.r / 255;
        colorMatrix[6] = result.g / 255;
        colorMatrix[12] = result.b / 255;
        var colorFilter = new egret.ColorMatrixFilter(colorMatrix);
        image.filters = [colorFilter];
    };
    Utils.euiPosToNormal = function (img) {
        var p = new egret.Point(0, 0);
        if (!img) {
            return;
        }
        if (img.right) {
            p.x = GameConfig.curWidth() - img.right - img.anchorOffsetX;
        }
        if (img.top) {
            p.y = img.top + img.anchorOffsetY;
        }
        if (img.left) {
            p.x = img.left + img.anchorOffsetX;
        }
        if (img.bottom) {
            p.y = GameConfig.curHeight() - img.bottom - img.anchorOffsetY;
        }
        return p;
    };
    Utils.euiPosToNormal1 = function (img) {
        var p = new egret.Point(0, 0);
        if (img.right) {
            p.x = GameConfig.curWidth() - img.right - img.anchorOffsetX;
        }
        if (img.top) {
            p.y = img.top + img.anchorOffsetY;
        }
        if (img.left) {
            p.x = img.left + img.anchorOffsetX;
        }
        if (img.bottom) {
            p.y = GameConfig.curHeight() - img.bottom - img.anchorOffsetY;
        }
        return p;
    };
    /**
     * 抖动
     */
    Utils.shake = function (target, distance) {
        if (distance === void 0) { distance = 15; }
        var tw = egret.Tween.get(target, { loop: true });
        var tempX = target.x;
        tw.to({ x: target.x += distance }, 80)
            .to({ x: target.x -= distance }, 80)
            .to({ x: target.x += distance }, 80)
            .to({ x: target.x -= distance }, 80).call(function () {
            target.x = tempX;
        });
    };
    Utils.stopShake = function (target) {
        egret.Tween.removeTweens(target);
    };
    // 时间格式处理
    Utils.dateFtt = function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds() //毫秒   
        };
        fmt || (fmt = "yyyy-MM-ddThh:mm:ss+00:00");
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    Utils.getNowDate = function () {
        return this.dateFtt(new Date(), "yyyy-MM-dd hh:mm:ss");
    };
    Utils.getWeekTime = function () {
        var now = new Date();
        var y = now.getFullYear();
        var m = now.getMonth();
        var d = now.getDate();
        var day = now.getDay();
        var weekStart = new Date(y, m, d - (day ? (day - 1) : 6));
        var weekEnd = new Date(y, m, d + (day ? (8 - day) : 1));
        Utils.dateRange = [this.dateFtt(weekStart), this.dateFtt(weekEnd)];
        return Utils.dateRange;
    };
    Utils.isInTimeRange = function (timeStr) {
        if (timeStr) {
            var recordTime = new Date(timeStr.replace(/-/g, '/')).getTime();
            return recordTime > this.dateRange[0] && recordTime < this.dateRange[1];
        }
        else {
            return false;
        }
    };
    Utils.transObj = function (kvData) {
        var res = {};
        kvData.map(function (data) {
            res[data.key] = data.value;
        });
        return res;
    };
    Object.defineProperty(Utils, "isRuntime", {
        get: function () {
            // return Boolean(egret.Capabilities.runtimeType === egret.RuntimeType.WXGAME&& window["gmbox"]);
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 截取长用户名
     */
    Utils.tf = new egret.TextField();
    Utils.dateRange = [];
    return Utils;
}());
__reflect(Utils.prototype, "Utils");
/**
 * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
 */
function createBitmapByName(name) {
    var result = new egret.Bitmap();
    var texture = RES.getRes(name);
    result.texture = texture;
    return result;
}
/**
 * 根据name关键字创建一个Bitmap对象。此name 是根据TexturePacker 组合成的一张位图
 */
function createBitmapFromSheet(name, sheetName) {
    if (sheetName === void 0) { sheetName = "gameRes"; }
    var sheet = RES.getRes(sheetName);
    var texture = sheet.getTexture(name);
    var result = new egret.Bitmap();
    result.texture = texture;
    return result;
}
function getTextureFromSheet(name, sheetName) {
    if (sheetName === void 0) { sheetName = "gameRes"; }
    var sheet = RES.getRes(sheetName);
    var result = sheet.getTexture(name);
    return result;
}
