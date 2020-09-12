class TweenUtil {
    public static playTweenGroup(target: egret.tween.TweenGroup, isLoop: boolean): void {
        this.stopTweenGroup(target);
        if (isLoop) {
            for (var key in target.items) {
                target.items[key].props = { loop: true };
            }
        }
        target.play();
    }

    public static stopTweenGroup(target: egret.tween.TweenGroup): void {
        if (target.items) {
            for (var key in target.items) {
                target.items[key].props = { loop: false };
            }
        }
        target.stop();
    }
}