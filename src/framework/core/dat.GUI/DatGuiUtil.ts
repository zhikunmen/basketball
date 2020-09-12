/**
 * dat.gui
 */
module core {
    export class DatGuiUtil extends egret.EventDispatcher {
        private gui;

        public static DAT_GUI_CHANGE: string = 'dat.gui_change';
        public static DAT_GUI_FINISH_CHANGE: string = 'dat.gui_finish_change';

        private static s_instance: DatGuiUtil;

        public static getInstance(): DatGuiUtil {
            if (DatGuiUtil.s_instance == null) {
                DatGuiUtil.s_instance = new DatGuiUtil();
            }
            return DatGuiUtil.s_instance;
        }

        constructor() {
            super();

            this.gui = new dat.GUI();
        }

        public addItem(itemName: string,val:number): void {
            this[itemName] = Number(val);
            var controller = this.gui.add(this, itemName).min(-20).max(20).step(0.1);;

            let self = this;
            controller.onChange(function (value) {
                self.dispatchEventWith(DatGuiUtil.DAT_GUI_CHANGE, false, {name:itemName,val:value});
            });

            controller.onFinishChange(function (value) {
                self.dispatchEventWith(DatGuiUtil.DAT_GUI_FINISH_CHANGE, false, {name:itemName,val:value});
            });
        }
    }
}