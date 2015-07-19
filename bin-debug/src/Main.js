//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        //重玩的次数，用于记录是否是第一次进入页面
        this.totalPlayTimes = 0;
        //用于记录点的信息
        this.pot = [81];
        //用于标记点击过的点
        this.potFlag = [81];
        //用于记录走了多少步
        this.totalStep = 0;
        //用于存储某点周围未被标记的点
        this.whitePot = [];
        this.catPosition = 40;
        /**
         * 创建游戏场景
         * Create a game scene
         */
        //图片资源
        this.winPicture = new egret.Bitmap;
        this.mao2 = new egret.Bitmap;
        this.tx1 = new egret.TextField;
        this.tx2 = new egret.TextField;
        this.failPicture = new egret.Bitmap;
        this.callPicture = new egret.Bitmap;
        this.replay = new egret.Bitmap;
        this.startUI = new StartUI(this);
        this.leftTopNumbers = 0;
        this.rightTopNumbers = 0;
        this.leftNumbers = 0;
        this.rightNumbers = 0;
        this.leftButtomNumbers = 0;
        this.rightButtomNumbers = 0;
        this.catWay = new catAI();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = Main.prototype;
    __egretProto__.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    __egretProto__.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    __egretProto__.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    __egretProto__.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    __egretProto__.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    __egretProto__.createGameScene = function () {
        for (var i = 0; i < 81; i++) {
            this.potFlag[i] = false;
        }
        var bgPicture = new egret.Bitmap(RES.getRes("bgImage"));
        this.addChild(bgPicture);
        bgPicture.width = egret.MainContext.instance.stage.stageWidth;
        bgPicture.height = egret.MainContext.instance.stage.stageHeight;
        bgPicture.name = "bg";
        this.startUI = new StartUI(this);
        this.startUI.addEventListener(GameEvent.START_GAME, this.initGame, this);
        //        this.initGame();
    };
    //初始化地图
    __egretProto__.initGame = function () {
        //临时的pot点，用于初始化
        //var  potTemp: any[] = [81];
        // var potTemp: any[] = [81];//临时的pot点，用于初始化
        var temp = new egret.Bitmap(RES.getRes("pot1"));
        for (var i = 0; i < 81; i++) {
            this.potFlag[i] = false;
        }
        this.catPosition = 40;
        this.whitePot = [];
        var flag = 0;
        var x1, x2;
        var y1;
        x1 = (this.stage.width - (temp.width + 3) * 9) * 0.28; //初始化小圆点偶数行的x坐标
        x2 = (this.stage.width - (temp.width + 3) * 9) * 0.78; //奇数行
        y1 = this.stage.height - (temp.height * 9 + 80); //初始化小圆点的y坐标
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var potTemp;
                potTemp = new egret.Bitmap(RES.getRes("pot1"));
                if (i % 2 == 0) {
                    potTemp.x = x1 + (j) % 9 * (potTemp.width + 3);
                }
                else {
                    potTemp.x = x2 + (j) % 9 * (potTemp.width + 3);
                }
                potTemp.y = y1 + i * (potTemp.height);
                this.pot[flag] = potTemp;
                this.pot[flag].touchEnabled = true;
                //对每个点做监听
                this.pot[flag].addEventListener(egret.TouchEvent.TOUCH_TAP, this.potTouch, this);
                this.addChild(this.pot[flag]);
                flag++;
            }
        }
        //随机分布红点
        var ranNumber = 10 + Math.floor(Math.random() * 6);
        for (var i = 0; i < ranNumber; i++) {
            var ranPot = 0;
            ranPot = Math.floor(Math.random() * 81);
            if (ranPot == 40) {
                continue;
            }
            var tempX = this.pot[ranPot].x;
            var tempY = this.pot[ranPot].y;
            this.removeChild(this.pot[ranPot]);
            this.pot[ranPot] = new egret.Bitmap(RES.getRes("pot2"));
            this.pot[ranPot].x = tempX;
            this.pot[ranPot].y = tempY;
            this.pot[ranPot].touchEnabled = false;
            this.pot[ranPot].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.potTouch, this);
            this.potFlag[ranPot] = true;
            this.addChild(this.pot[ranPot]);
        }
        if (this.totalPlayTimes == 0) {
            this.removeChild(this.startUI);
        }
        this.cat = new Cat(catX, catY, true);
        //猫的初始坐标
        var catX = this.pot[40].x + this.pot[40].width / 2 - this.cat.width / 2;
        var catY = this.pot[40].y + this.pot[40].height / 2 - this.cat.height;
        this.cat = new Cat(catX, catY, true);
        this.addChild(this.cat);
        this.totalPlayTimes++;
        this.totalStep = 0;
    };
    //pot的点击事件
    __egretProto__.potTouch = function (event) {
        this.totalStep++;
        var temp;
        var i;
        temp = event.currentTarget;
        //获得点击的坐标
        var tempX = temp.x;
        var tempY = temp.y;
        for (i = 0; i < 81; i++) {
            if ((this.pot[i] == temp)) {
                break;
            }
        }
        this.potFlag[i] = true;
        this.removeChild(this.pot[i]);
        this.pot[i] = new egret.Bitmap(RES.getRes("pot2"));
        this.pot[i].x = tempX;
        this.pot[i].y = tempY;
        this.pot[i].touchEnabled = false;
        this.pot[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.potTouch, this);
        this.addChild(this.pot[i]);
        //通过点击事件让猫移动
        this.catMove(this.catPosition);
        //判断猫是否被围住，调用isWeizhu函数
        console.log(this.isWeizhu());
        var isTrapped = this.isWeizhu();
        //如果围住调用围住动画
        //将猫的深度上升到最顶层
        _super.prototype.setChildIndex.call(this, this.cat, 1000);
        console.log(this.catPosition);
        //判断游戏是否结束
        if (this.isExit(this.catPosition)) {
            this.gameOver = new GameOver(this, this.pot);
            //       var gameOver: GameOver = new GameOver(this,this.pot);
            this.gameOver.addEventListener(GameEvent.START_GAME, this.failPlayAgain, this);
        }
    };
    //赢了之后再玩一次
    __egretProto__.winPlayAgain = function () {
        this.removeChild(this.youWin);
        for (var m = 0; m < this.pot.length; m++) {
            this.removeChild(this.pot[m]);
        }
        this.removeChild(this.cat);
        this.initGame();
        // console.log(this.pot.length);
        //   this.createGameScene();
    };
    //输了之后再玩一次
    __egretProto__.failPlayAgain = function () {
        this.removeChild(this.gameOver);
        for (var m = 0; m < this.pot.length; m++) {
            this.removeChild(this.pot[m]);
        }
        this.removeChild(this.cat);
        this.initGame();
    };
    __egretProto__.catMove = function (catPot) {
        var way;
        if (this.isWeizhu()) {
            //还没有围住
            way = this.catWay.findWay(this.catPosition, this.potFlag);
            //获得猫所在的点的行数
            var row = Math.floor(catPot / 9);
            if (row % 2 == 0) {
                if ((catPot - way) == 10) {
                    way = 0;
                }
                else if ((catPot - way) == 9) {
                    way = 1;
                }
                else if ((catPot - way) == 1) {
                    way = 2;
                }
                else if ((catPot - way) == (-1)) {
                    way = 3;
                }
                else if ((catPot - way) == (-8)) {
                    way = 4;
                }
                else if ((catPot - way) == (-9)) {
                    way = 5;
                }
            }
            else {
                if (catPot - way == 9) {
                    way = 0;
                }
                else if (catPot - way == 8) {
                    way = 1;
                }
                else if ((catPot - way) == 1) {
                    way = 2;
                }
                else if ((catPot - way) == (-1)) {
                    way = 3;
                }
                else if ((catPot - way) == (-9)) {
                    way = 4;
                }
                else if ((catPot - way) == (-10)) {
                    way = 5;
                }
            }
        }
        else {
            var row = Math.floor(catPot / 9);
            if (row % 2 == 0 && this.potFlag[catPot - 10] == true && this.potFlag[catPot - 9] == true && this.potFlag[catPot - 1] == true && this.potFlag[catPot + 1] == true && this.potFlag[catPot + 8] == true && this.potFlag[catPot + 9] == true) {
                way = 6;
            }
            else if (this.potFlag[catPot - 9] == true && this.potFlag[catPot - 8] == true && this.potFlag[catPot - 1] == true && this.potFlag[catPot + 1] == true && this.potFlag[catPot + 9] == true && this.potFlag[catPot + 10] == true) {
                way = 6;
            }
            else {
                while (true) {
                    way = Math.floor(Math.random() * 6);
                    if (way == 0) {
                        if (row % 2 == 0) {
                            if (this.potFlag[catPot - 10] == true) {
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            if (this.potFlag[catPot - 9] == true) {
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (way == 1) {
                        if (row % 2 == 0) {
                            if (this.potFlag[catPot - 9] == true) {
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            if (this.potFlag[catPot - 8] == true) {
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (way == 2) {
                        if (this.potFlag[catPot - 1] == true) {
                            continue;
                        }
                        else {
                            break;
                        }
                    }
                    if (way == 3) {
                        if (this.potFlag[catPot + 1] == true) {
                            continue;
                        }
                        else {
                            break;
                        }
                    }
                    if (way == 4) {
                        if (row % 2 == 0) {
                            if (this.potFlag[catPot + 8] == true) {
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            if (this.potFlag[catPot + 9] == true) {
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (way == 5) {
                        if (row % 2 == 0) {
                            if (this.potFlag[catPot + 9] = true) {
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            if (this.potFlag[catPot + 10] == true) {
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
            }
        }
        var f = false;
        var catX;
        var catY;
        switch (way) {
            case 0:
                if (row % 2 == 0 && catPot - 10 >= 0 && this.potFlag[catPot - 10] == false) {
                    this.catPosition = catPot - 10;
                    catX = this.pot[catPot - 10].x + this.pot[catPot - 10].width / 2 - this.cat.width / 2;
                    catY = this.pot[catPot - 10].y + this.pot[catPot - 10].height / 2 - this.cat.height;
                }
                else {
                    if (catPot - 9 >= 0 && this.potFlag[catPot - 9] == false) {
                        this.catPosition = catPot - 9;
                        catX = this.pot[catPot - 9].x + this.pot[catPot - 9].width / 2 - this.cat.width / 2;
                        catY = this.pot[catPot - 9].y + this.pot[catPot - 9].height / 2 - this.cat.height;
                    }
                }
                break;
            case 1:
                if (row % 2 == 0 && catPot - 9 >= 0 && this.potFlag[catPot - 9] == false) {
                    this.catPosition = catPot - 9;
                    catX = this.pot[catPot - 9].x + this.pot[catPot - 9].width / 2 - this.cat.width / 2;
                    catY = this.pot[catPot - 9].y + this.pot[catPot - 9].height / 2 - this.cat.height;
                }
                else {
                    if (catPot - 8 >= 0 && this.potFlag[catPot - 8] == false) {
                        this.catPosition = catPot - 8;
                        catX = this.pot[catPot - 8].x + this.pot[catPot - 8].width / 2 - this.cat.width / 2;
                        catY = this.pot[catPot - 8].y + this.pot[catPot - 8].height / 2 - this.cat.height;
                    }
                }
                break;
            case 2:
                if (this.potFlag[catPot - 1] == false) {
                    this.catPosition = catPot - 1;
                    catX = this.pot[catPot - 1].x + this.pot[catPot - 1].width / 2 - this.cat.width / 2;
                    catY = this.pot[catPot - 1].y + this.pot[catPot - 1].height / 2 - this.cat.height;
                }
                break;
            case 3:
                if (this.potFlag[catPot + 1] == false) {
                    this.catPosition = catPot + 1;
                    catX = this.pot[catPot + 1].x + this.pot[catPot + 1].width / 2 - this.cat.width / 2;
                    catY = this.pot[catPot + 1].y + this.pot[catPot + 1].height / 2 - this.cat.height;
                }
                break;
            case 4:
                if (row % 2 == 0 && catPot + 8 >= 0 && this.potFlag[catPot + 8] == false) {
                    this.catPosition = catPot + 8;
                    catX = this.pot[catPot + 8].x + this.pot[catPot + 8].width / 2 - this.cat.width / 2;
                    catY = this.pot[catPot + 8].y + this.pot[catPot + 8].height / 2 - this.cat.height;
                }
                else {
                    if (catPot + 9 >= 0 && this.potFlag[catPot + 9] == false) {
                        this.catPosition = catPot + 9;
                        catX = this.pot[catPot + 9].x + this.pot[catPot + 9].width / 2 - this.cat.width / 2;
                        catY = this.pot[catPot + 9].y + this.pot[catPot + 9].height / 2 - this.cat.height;
                    }
                }
                break;
            case 5:
                if (row % 2 == 0 && catPot + 9 >= 0 && this.potFlag[catPot + 9] == false) {
                    this.catPosition = catPot + 9;
                    catX = this.pot[catPot + 9].x + this.pot[catPot + 9].width / 2 - this.cat.width / 2;
                    catY = this.pot[catPot + 9].y + this.pot[catPot + 9].height / 2 - this.cat.height;
                }
                else {
                    if (catPot + 10 >= 0 && this.potFlag[catPot + 10] == false) {
                        this.catPosition = catPot + 10;
                        catX = this.pot[catPot + 10].x + this.pot[catPot + 10].width / 2 - this.cat.width / 2;
                        catY = this.pot[catPot + 10].y + this.pot[catPot + 10].height / 2 - this.cat.height;
                    }
                }
                break;
            case 6:
                this.youWin = new winGame(this, this.pot, this.totalStep);
                this.youWin.addEventListener(GameEvent.START_GAME, this.winPlayAgain, this);
                catX = this.pot[this.catPosition].x + this.pot[catPot + 10].width / 2 - this.cat.width / 2;
                catY = this.pot[this.catPosition].y + this.pot[catPot + 10].height / 2 - this.cat.height;
                break;
        }
        //           }
        this.removeChild(this.cat);
        if (this.isWeizhu() == false) {
            this.cat = new Cat(catX, catY, false);
        }
        else {
            this.cat = new Cat(catX, catY, true);
        }
        //        this.cat = new Cat(catX,catY,true);
        this.addChild(this.cat);
    };
    //判断是否在边缘
    __egretProto__.isExit = function (index) {
        if (Math.floor(index / 9) == 0 || Math.floor(index / 9) == 8 || Math.floor(index % 9) == 0 || Math.floor(index % 9) == 8) {
            return true;
        }
        else {
            return false;
        }
    };
    //判断是否被圈住
    __egretProto__.isWeizhu = function () {
        var isFlag = [81];
        this.whitePot = [];
        this.whitePot.push(this.catPosition);
        var tempPot;
        for (var m = 0; m < 81; m++) {
            isFlag[m] = false;
        }
        while (true) {
            tempPot = this.whitePot.pop();
            if (this.isExit(tempPot)) {
                return true;
            }
            if (Math.floor(tempPot / 9) % 2 == 0) {
                //左上角
                if (tempPot - 10 >= 0 && (this.potFlag[tempPot - 10] == false)) {
                    if (isFlag[tempPot - 10] == false) {
                        this.whitePot.push(tempPot - 10);
                        isFlag[tempPot - 10] = true;
                    }
                }
                //右上角
                if (tempPot - 9 > 0 && (this.potFlag[tempPot - 9] == false)) {
                    if (isFlag[tempPot - 9] == false) {
                        this.whitePot.push(tempPot - 9);
                        isFlag[tempPot - 9] = true;
                    }
                }
                //左边
                if (tempPot % 9 != 0 && (this.potFlag[tempPot - 1] == false)) {
                    if (isFlag[tempPot - 1] == false) {
                        this.whitePot.push(tempPot - 1);
                        isFlag[tempPot - 1] = true;
                    }
                }
                //右边
                if (tempPot % 9 != 8 && (this.potFlag[tempPot + 1] == false)) {
                    if (isFlag[tempPot + 1] == false) {
                        this.whitePot.push(tempPot + 1);
                        isFlag[tempPot + 1] = true;
                    }
                }
                //左下角
                if (tempPot + 8 < 81 && (this.potFlag[tempPot + 8] == false)) {
                    if (isFlag[tempPot + 8] == false) {
                        this.whitePot.push(tempPot + 8);
                        isFlag[tempPot + 8] = true;
                    }
                }
                //右下角
                if (tempPot + 9 <= 81 && (this.potFlag[tempPot + 9] == false)) {
                    if (isFlag[tempPot + 9] == false) {
                        this.whitePot.push(tempPot + 9);
                        isFlag[tempPot + 9] = true;
                    }
                }
            }
            else {
                //左上角
                if (tempPot - 9 >= 0 && (this.potFlag[tempPot - 9] == false)) {
                    if (isFlag[tempPot - 9] == false) {
                        this.whitePot.push(tempPot - 9);
                        isFlag[tempPot - 9] = true;
                    }
                }
                //右上角
                if (tempPot - 8 > 0 && (this.potFlag[tempPot - 8] == false)) {
                    if (isFlag[tempPot - 8] == false) {
                        this.whitePot.push(tempPot - 8);
                        isFlag[tempPot - 8] = true;
                    }
                }
                //左边
                if (tempPot % 9 != 0 && (this.potFlag[tempPot - 1] == false)) {
                    if (isFlag[tempPot - 1] == false) {
                        this.whitePot.push(tempPot - 1);
                        isFlag[tempPot - 1] = true;
                    }
                }
                //右边
                if (tempPot % 9 != 8 && (this.potFlag[tempPot + 1] == false)) {
                    if (isFlag[tempPot + 1] == false) {
                        this.whitePot.push(tempPot + 1);
                        isFlag[tempPot + 1] = true;
                    }
                }
                //左下角
                if (tempPot + 9 < 81 && (this.potFlag[tempPot + 9] == false)) {
                    if (isFlag[tempPot + 9] == false) {
                        this.whitePot.push(tempPot + 9);
                        isFlag[tempPot + 9] = true;
                    }
                }
                //右下角
                if (tempPot + 10 <= 81 && (this.potFlag[tempPot + 10] == false)) {
                    if (isFlag[tempPot + 10] == false) {
                        this.whitePot.push(tempPot + 10);
                        isFlag[tempPot + 10] = true;
                    }
                }
            }
            if (this.whitePot.length == 0) {
                return false;
            }
        }
        return false;
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    __egretProto__.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    __egretProto__.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    __egretProto__.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
})(egret.DisplayObjectContainer);
Main.prototype.__class__ = "Main";
