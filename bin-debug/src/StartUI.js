/**
 *
 * @author
 *
 */
var StartUI = (function (_super) {
    __extends(StartUI, _super);
    //   private startStage: egret.DisplayObjectContainer;
    function StartUI(value) {
        _super.call(this);
        this.startPicture = new egret.Bitmap;
        //       this.startStage = value;
        this.start();
        value.addChild(this);
    }
    var __egretProto__ = StartUI.prototype;
    __egretProto__.start = function () {
        //        var startPicture: egret.Bitmap = this.createBitmapByName("btnStart");
        this.startPicture.texture = RES.getRes("btnStart");
        this.startPicture.texture = RES.getRes("btnStart");
        this.startPicture.x = (egret.MainContext.instance.stage.stageWidth - this.startPicture.width) / 2;
        this.startPicture.y = (egret.MainContext.instance.stage.stageHeight - this.startPicture.height) / 2;
        this.addChild(this.startPicture);
        this.startPicture.touchEnabled = true;
        this.startPicture.addEventListener(egret.TouchEvent.TOUCH_TAP, this.initGame, this);
    };
    __egretProto__.initGame = function () {
        var evt = new GameEvent(GameEvent.START_GAME);
        this.dispatchEvent(evt);
    };
    return StartUI;
})(egret.Sprite);
StartUI.prototype.__class__ = "StartUI";
