
/*********************************
 * Author ： TinsonChan
 * Mail   ： tinsonchan@163.com
 * Date   ： 2018-03-03
 * Desc   ： 游戏界面视图
 ********************************/
class MatterWalls extends core.EUIComponent {
		private _matterScene:core.MatterScene;

		public bottomWall:Matter.Body;
		public constructor() {
			super();
		}

		public childrenCreated() {
			super.childrenCreated();

			this.left = 0;
			this.right = 0;
			this.top = 0;
			this.bottom = 0;
		}

		/**
		 * 显示
		 */
		protected onShow(event?: egret.Event): void {
			super.onShow();

			//加200是为了出边界的时候y值还有
			this.bottomWall = core.MatterUtil.addOneBox((GameConfig.curWidth()) /2,GameConfig.curHeight() - 100,(GameConfig.curWidth() + 1000) ,250,0);
			this.bottomWall.label = "background"
           // core.MatterUtil.addOneBox(GameConfig.curWidth() /2,0,GameConfig.curWidth(),30,0);
		}

		protected onHide(event?: egret.Event): void {
			super.onHide();
		}
		/**
		 * 添加监听
		 */
		protected addListener(): void {
		}

		/**
		 * 删除监听
		 */
		protected removeListener(): void {
		}


		public release() {
			super.release();
		}
	}