/**
 *
 * @author 
 *
 */
class Cat extends egret.Sprite{
    public stayMc: egret.MovieClip;
    public weizhuMc: egret.MovieClip;
        
    public constructor(locX:number,locY:number,catMc:boolean) {
        super();
        if(catMc == true) {
            var data = RES.getRes("stay_json");
            var txtr = RES.getRes("stay_png");
            var mcFactory = new egret.MovieClipDataFactory(data,txtr);
            this.stayMc = new egret.MovieClip(mcFactory.generateMovieClipData());
            this.addChild(this.stayMc);
            this.stayMc.gotoAndPlay(0,-1);
            //        this.stayMc.anchorX = 0.5;
            //        this.stayMc.anchorY = 1;
            this.stayMc.x = locX;
            this.stayMc.y = locY;
        }
        else
        {
            var data = RES.getRes("weizhu_json");
            var txtr = RES.getRes("weizhu_png");
            var mcFactory = new egret.MovieClipDataFactory(data,txtr);
            this.stayMc = new egret.MovieClip(mcFactory.generateMovieClipData());
            this.addChild(this.stayMc);
            this.stayMc.gotoAndPlay(0,-1);
            //        this.stayMc.anchorX = 0.5;
            //        this.stayMc.anchorY = 1;
            this.stayMc.x = locX;
            this.stayMc.y = locY;
        }
       
    }
    public init()
    {
                  
    }
}
