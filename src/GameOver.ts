/**
 *
 * @author 
 *
 */
class GameOver extends egret.Sprite {
    private winPicture: egret.Bitmap = new egret.Bitmap;
    private mao2: egret.Bitmap = new egret.Bitmap;
    private tx1: egret.TextField = new egret.TextField;
    private tx2: egret.TextField = new egret.TextField;
    private failPicture: egret.Bitmap = new egret.Bitmap;
    private callPicture: egret.Bitmap = new egret.Bitmap;
    private replay: egret.Bitmap = new egret.Bitmap;
    
    public constructor(value:egret.DisplayObjectContainer,pot:any[]) {
        super();
        //失败图片
        this.failPicture = new egret.Bitmap(RES.getRes("failed_bg"));
        this.failPicture.x = (egret.MainContext.instance.stage.stageWidth - this.failPicture.width) / 2;
        this.failPicture.y = (egret.MainContext.instance.stage.stageHeight - this.failPicture.height) / 2 * 0.4;
            //围住神经猫2图片
            this.mao2 = new egret.Bitmap(RES.getRes("mao2"));
            this.mao2.x = (egret.MainContext.instance.stage.stageWidth - this.mao2.width) / 2;
            this.mao2.y = (egret.MainContext.instance.stage.stageHeight - this.mao2.height) / 2 + 20;
            this.tx1.text = "你没有抓住神！经！猫！";
            this.tx1.size = 22;
            this.tx1.textColor = 0XFF0000;
            this.tx1.x = (egret.MainContext.instance.stage.stageWidth - this.tx1.width) / 2;
            this.tx1.y = this.mao2.y - 90;
            this.tx2.text = "你又发神经病了？？？";
            this.tx2.textColor = 0x000000;
            this.tx2.size = 24;
            this.tx2.x = (egret.MainContext.instance.stage.stageWidth - this.tx2.width) / 2;
            this.tx2.y = (this.tx1.y + 40);
            this.addChild(this.failPicture);
            this.addChild(this.mao2);
            this.addChild(this.tx1);
            this.addChild(this.tx2);
            //通知好友
            this.callPicture = new egret.Bitmap(RES.getRes("share_btn"));
            this.callPicture.x = (egret.MainContext.instance.stage.stageWidth - 2 * this.callPicture.width) / 3;
                this.callPicture.y = this.mao2.y + this.callPicture.height + 5;
                this.addChild(this.callPicture);
                //再来一次
                this.replay = new egret.Bitmap(RES.getRes("replay_btn"));
                this.replay.x = (egret.MainContext.instance.stage.stageWidth - 2 * this.callPicture.width) / 3 * 2 + this.callPicture.width;
                    this.replay.y = this.callPicture.y;
                    this.addChild(this.replay);
                    for(var m = 0;m < 81;m++) {
                        pot[m].touchEnabled = false;
                    }
                    this.replay.touchEnabled = true;
                    this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.failPlayAgain,this);
                    
        value.addChild(this);
    }
    private failPlayAgain()
     {
        var evt: GameEvent = new GameEvent(GameEvent.START_GAME);
        this.dispatchEvent(evt);

    }
}
