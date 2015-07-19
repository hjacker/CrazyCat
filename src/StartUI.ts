/**
 *
 * @author 
 *
 */
class StartUI extends egret.Sprite{
    public  startPicture: egret.Bitmap = new egret.Bitmap;
 //   private startStage: egret.DisplayObjectContainer;
	public constructor(value:egret.DisplayObjectContainer) {
        super();
 //       this.startStage = value;

        this.start();
        value.addChild(this);
	}
    public start()
    {
        
        //        var startPicture: egret.Bitmap = this.createBitmapByName("btnStart");
        this.startPicture.texture = RES.getRes("btnStart");
        this.startPicture.texture = RES.getRes("btnStart");
        this.startPicture.x = (egret.MainContext.instance.stage.stageWidth - this.startPicture.width) / 2;
        this.startPicture.y = (egret.MainContext.instance.stage.stageHeight - this.startPicture.height) / 2;
        this.addChild(this.startPicture);
        this.startPicture.touchEnabled = true;
        this.startPicture.addEventListener(egret.TouchEvent.TOUCH_TAP,this.initGame,this);      
    }
    private initGame() { 
        var evt: GameEvent = new GameEvent(GameEvent.START_GAME);
        this.dispatchEvent(evt);
            
    }
}
