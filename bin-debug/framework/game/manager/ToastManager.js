/**
 * toast 提示类
 */
var ToastManager;
(function (ToastManager) {
    var group;
    var toastViewArr = [];
    function addPopUp(desc) {
        var self = this;
        this.checkNext = function () {
            group.removeChildren();
            for (var i = 0; i < toastViewArr.length; i++) {
                group.addChild(toastViewArr[i]);
            }
        };
        if (!group) {
            group = new eui.Group();
            var vLayout = new eui.VerticalLayout();
            vLayout.gap = 10;
            vLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
            group.layout = vLayout; //设置问垂直布局
            group.bottom = GameConfig.curHeight() >> 1;
            group.horizontalCenter = 0;
            group.touchThrough = true;
            group.touchEnabled = group.touchChildren = false;
        }
        if (!core.LayerCenter.getInstance().getLayer(LayerEnum.TOP).contains(group)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.TOP).addChild(group);
        }
        var toastView = new ToastPanel(desc);
        toastViewArr.push(toastView);
        egret.Tween.get(toastView).wait(2500).to({ alpha: 0 }, 500).call(function () {
            toastViewArr.splice(toastViewArr.indexOf(toastView), 1);
            self.checkNext();
        });
        this.checkNext();
    }
    ToastManager.addPopUp = addPopUp;
})(ToastManager || (ToastManager = {}));
