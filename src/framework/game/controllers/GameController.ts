class GameController extends GameControllerBase {
    constructor() {
        super(ModuleEnum.GAME);
    }

    protected show(data?: any): void {
        super.show(data);
        this.startTick();
    }

    public hide(): void {
        super.hide();
        this.release();
    }

    private startTick(): void {
        egret.startTick(this.onDragonBonesTick, egret.MainContext.instance.stage);
    }

    private onDragonBonesTick(timeStamp) {
        if (typeof (dragonBones) === "undefined")
            return false;
        dragonBones["WorldClock"]["clock"].advanceTime(-1);
        if (egret.Capabilities.engineVersion < "5.0") {
            return true;
        }
        else {
            return false;
        }
    };

}