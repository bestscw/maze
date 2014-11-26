/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this._preMoveX = 0;
        this._preMoveY = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    /**
     * preload资源组加载进度
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    Main.prototype.createMazeGame = function () {
        for (var x = 0; x < DataManage.M; x++) {
            for (var y = 0; y < DataManage.M; y++) {
                var mu = new mazeUnit();
                mu.x = x;
                mu.y = y;
                mu.top = 1;
                mu.right = 1;
                mu.bottom = 1;
                mu.left = 1;
                DataManage.maze.push(mu);
            }
        }
        var x = 0;
        var y = 0;
        while (DataManage.maze.length) {
            var tmpArr = [];
            for (var i = 0; i < DataManage._postArr.length; i++) {
                var nx = x + DataManage._postArr[i][0];
                var ny = y + DataManage._postArr[i][1];
                var t = DataManage.getMazeUnitByPos(nx, ny);
                if (t) {
                    var point = new egret.Point();
                    point.x = nx;
                    point.y = ny;
                    tmpArr.push(point);
                }
            }
            if (tmpArr.length > 0) {
                var index = Math.floor(Math.random() * tmpArr.length);
                var nx = tmpArr[index].x;
                var ny = tmpArr[index].y;
                DataManage.maze2.push(DataManage.getMazeUnitByPos(nx, ny));
                if (!DataManage.getMaze2UnitByPos(x, y))
                    DataManage.maze2.push(DataManage.getMazeUnitByPos(x, y));
                var pos = [(nx - x), (ny - y)];
                for (i = 0; i < DataManage._postArr.length; i++) {
                    if ((pos[0] == DataManage._postArr[i][0]) && (pos[1] == DataManage._postArr[i][1])) {
                        var _maze2 = DataManage.getMaze2UnitByPos(x, y);
                        var _maze2_1 = DataManage.getMaze2UnitByPos(nx, ny);
                        if (i == 0) {
                            _maze2.top = 0;
                            _maze2_1.bottom = 0;
                        }
                        else if (i == 1) {
                            _maze2.right = 0;
                            _maze2_1.left = 0;
                        }
                        else if (i == 2) {
                            _maze2.bottom = 0;
                            _maze2_1.top = 0;
                        }
                        else if (i == 3) {
                            _maze2.left = 0;
                            _maze2_1.right = 0;
                        }
                        break;
                    }
                }
                x = nx;
                y = ny;
                DataManage.mazeOrder.push([x, y]);
                DataManage.removeMazeUnitByPos(x, y);
            }
            else {
                DataManage.mazeOrder.pop();
                if (DataManage.mazeOrder) {
                    x = DataManage.mazeOrder[DataManage.mazeOrder.length - 1][0];
                    y = DataManage.mazeOrder[DataManage.mazeOrder.length - 1][1];
                }
            }
        }
        DataManage.maze = DataManage.maze2;
        //留出出口
        var mu = DataManage.getMazeUnitByPos(0, 0);
        mu.left = 0;
        var mu = DataManage.getMazeUnitByPos((DataManage.M - 1), (DataManage.M - 1));
        mu.right = 0;
        /**
        DataManage.pathArr = [];
        DataManage.findPath( 0, 0, []);
        for(var j:number=0;j<DataManage.pathArr.length;j++)
        {
            console.log(DataManage.pathArr[0][0]+"______________"+DataManage.pathArr[0][1]);
        }
        **/
        var maze_str = '[{"1":[0,0,1,1],"0":[1,0,1,0],"7":[0,0,0,1],"6":[0,1,0,1],"5":[0,1,0,1],"4":[1,0,0,1],"3":[0,0,1,1],"2":[1,0,0,1],"8":[0,0,1,1]},{"1":[1,0,1,0],"6":[1,0,0,1],"7":[0,1,1,0],"4":[0,1,1,0],"3":[1,0,0,0],"2":[1,1,1,0],"5":[1,0,1,1],"8":[1,0,1,0],"0":[1,0,1,0]},{"1":[1,1,0,0],"2":[0,0,1,1],"7":[0,0,1,1],"6":[1,1,0,0],"3":[1,0,1,0],"5":[0,0,1,0],"4":[1,1,0,1],"8":[1,1,1,0],"0":[1,0,1,0]},{"2":[1,0,1,0],"8":[0,0,1,1],"7":[1,1,0,0],"3":[1,1,0,0],"4":[0,0,1,1],"5":[1,0,0,0],"6":[0,0,1,1],"0":[1,0,0,0],"1":[0,1,1,1]},{"2":[0,1,1,0],"1":[1,0,0,1],"7":[1,0,0,1],"8":[0,0,1,0],"4":[0,1,1,0],"3":[1,0,0,1],"5":[1,0,1,0],"6":[1,1,1,0],"0":[1,0,1,0]},{"1":[1,0,1,0],"7":[1,0,1,0],"8":[1,1,1,0],"3":[0,1,0,0],"2":[1,1,0,1],"4":[0,0,1,1],"6":[0,0,1,1],"5":[1,1,0,0],"0":[1,0,1,0]},{"1":[1,1,0,0],"2":[0,1,0,1],"3":[0,0,1,1],"8":[0,0,1,1],"7":[1,1,0,0],"4":[1,1,0,0],"5":[0,1,0,1],"6":[0,1,1,0],"0":[1,0,1,0]},{"3":[1,0,1,0],"4":[1,0,0,1],"5":[0,1,0,1],"6":[0,1,0,1],"7":[0,1,0,1],"8":[0,0,1,0],"2":[0,0,1,1],"1":[0,1,0,1],"0":[1,0,0,0]},{"3":[0,1,0,0],"4":[0,1,1,0],"8":[0,0,1,0],"7":[0,1,0,1],"6":[0,1,0,1],"5":[1,1,0,1],"2":[1,1,0,0],"0":[1,1,0,0],"1":[0,1,1,1]}]';
        for (var i = 0; i < DataManage.maze.length; i++) {
            var unit = DataManage.maze[i];
            var _top = 1;
            var _right = 1;
            var _bottom = 1;
            var _left = 1;
            if (unit.top) {
                var shp = new egret.Shape();
                shp.graphics.lineStyle(1, DataManage.line_color);
                shp.graphics.moveTo(unit.x * DataManage.S, unit.y * DataManage.S);
                shp.graphics.lineTo(((unit.x * DataManage.S) + DataManage.S), unit.y * DataManage.S);
                shp.graphics.endFill();
                this.addChild(shp);
            }
            else {
                if (DataManage.DEBUG) {
                    var shp = new egret.Shape();
                    shp.graphics.lineStyle(1, 0xFF0000);
                    shp.graphics.moveTo(unit.x * DataManage.S, unit.y * DataManage.S);
                    shp.graphics.lineTo(((unit.x * DataManage.S) + DataManage.S), unit.y * DataManage.S);
                    shp.graphics.endFill();
                    this.addChild(shp);
                }
                _top = 0;
            }
            if (unit.right) {
                var shp = new egret.Shape();
                shp.graphics.lineStyle(1, DataManage.line_color);
                shp.graphics.moveTo(((unit.x * DataManage.S) + DataManage.S), unit.y * DataManage.S);
                shp.graphics.lineTo(((unit.x * DataManage.S) + DataManage.S), ((unit.y * DataManage.S) + DataManage.S));
                shp.graphics.endFill();
                this.addChild(shp);
            }
            else {
                if (DataManage.DEBUG) {
                    var shp = new egret.Shape();
                    shp.graphics.lineStyle(1, 0xFF0000);
                    shp.graphics.moveTo(((unit.x * DataManage.S) + DataManage.S), unit.y * DataManage.S);
                    shp.graphics.lineTo(((unit.x * DataManage.S) + DataManage.S), ((unit.y * DataManage.S) + DataManage.S));
                    shp.graphics.endFill();
                    this.addChild(shp);
                }
                _right = 0;
            }
            if (unit.bottom) {
                var shp = new egret.Shape();
                shp.graphics.lineStyle(1, DataManage.line_color);
                shp.graphics.moveTo(unit.x * DataManage.S, (unit.y * DataManage.S) + DataManage.S);
                shp.graphics.lineTo(((unit.x * DataManage.S) + DataManage.S), (unit.y * DataManage.S) + DataManage.S);
                shp.graphics.endFill();
                this.addChild(shp);
            }
            else {
                if (DataManage.DEBUG) {
                    var shp = new egret.Shape();
                    shp.graphics.lineStyle(1, 0xFF0000);
                    shp.graphics.moveTo(unit.x * DataManage.S, (unit.y * DataManage.S) + DataManage.S);
                    shp.graphics.lineTo(((unit.x * DataManage.S) + DataManage.S), (unit.y * DataManage.S) + DataManage.S);
                    shp.graphics.endFill();
                    this.addChild(shp);
                }
                _bottom = 0;
            }
            if (unit.left) {
                var shp = new egret.Shape();
                shp.graphics.lineStyle(1, DataManage.line_color);
                shp.graphics.moveTo(unit.x * DataManage.S, unit.y * DataManage.S);
                shp.graphics.lineTo(unit.x * DataManage.S, (unit.y * DataManage.S) + DataManage.S);
                shp.graphics.endFill();
                this.addChild(shp);
            }
            else {
                if (DataManage.DEBUG) {
                    var shp = new egret.Shape();
                    shp.graphics.lineStyle(1, DataManage.line_color);
                    shp.graphics.moveTo(unit.x * DataManage.S, unit.y * DataManage.S);
                    shp.graphics.lineTo(unit.x * DataManage.S, (unit.y * DataManage.S) + DataManage.S);
                    shp.graphics.endFill();
                    this.addChild(shp);
                }
                _left = 0;
            }
        }
        var moving = new egret.Bitmap();
        moving.texture = RES.getRes("dot");
        moving.x = 0;
        moving.y = 0;
        moving.width = DataManage.S - 2;
        moving.height = DataManage.S - 2;
        this.addChild(moving);
        this.moving = moving;
        moving.touchEnabled = true;
        moving.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        moving.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this, false, 1);
        moving.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        moving.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
    };
    Main.prototype.onTouchTap = function (event) {
        this._isTouching = true;
    };
    Main.prototype.onTouchBegin = function (event) {
        this._isTouching = true;
        this._preMoveX = event.stageX;
        this._preMoveY = event.stageY;
    };
    Main.prototype.onTouchEnd = function (event) {
        this._isTouching = false;
    };
    Main.prototype.onTouchMove = function (event) {
        var stx = event.target.x + DataManage.S;
        if (this._isTouching) {
            var offsetX = Math.abs(event.stageX - this._preMoveX);
            var offsetY = Math.abs(event.stageY - this._preMoveY);
            if (offsetY > offsetX) {
                if (event.stageY - this._preMoveY > 0) {
                    var mu = DataManage.getMazeUnitByPos(DataManage.pos_x, DataManage.pox_y + 1);
                    if (!mu) {
                        return;
                    }
                    if (mu.top) {
                        return;
                    }
                    DataManage.pox_y += 1;
                    this.doMove(event, 0, DataManage.S);
                    this.checkIsOver(DataManage.pos_x, DataManage.pox_y);
                }
                else {
                    var mu = DataManage.getMazeUnitByPos(DataManage.pos_x, DataManage.pox_y - 1);
                    if (!mu) {
                        return;
                    }
                    if (mu.bottom) {
                        return;
                    }
                    DataManage.pox_y -= 1;
                    this.doMove(event, 0, -DataManage.S);
                    this.checkIsOver(DataManage.pos_x, DataManage.pox_y);
                }
            }
            else {
                if (event.stageX - this._preMoveX > 0) {
                    var mu = DataManage.getMazeUnitByPos(DataManage.pos_x + 1, DataManage.pox_y);
                    if (!mu) {
                        return;
                    }
                    if (mu.left) {
                        return;
                    }
                    DataManage.pos_x += 1;
                    this.doMove(event, DataManage.S, 0);
                    this.checkIsOver(DataManage.pos_x, DataManage.pox_y);
                }
                else {
                    var mu = DataManage.getMazeUnitByPos(DataManage.pos_x - 1, DataManage.pox_y);
                    if (!mu) {
                        return;
                    }
                    if (mu.right) {
                        return;
                    }
                    DataManage.pos_x -= 1;
                    this.doMove(event, -DataManage.S, 0);
                    this.checkIsOver(DataManage.pos_x, DataManage.pox_y);
                }
            }
        }
        this._preMoveX = event.stageX;
        this._preMoveY = event.stageY;
    };
    Main.prototype.doMove = function (event, x, y) {
        DataManage.move_step += 1;
        //this.updateScrore();
        DataManage.clickSound.play();
        event.target.x += x;
        event.target.y += y;
        this._isTouching = false;
    };
    Main.prototype.checkIsOver = function (x, y) {
        var mu = DataManage.getMazeUnitByPos(x, y);
        if (mu) {
            if ((x == (DataManage.M - 1)) && (y == (DataManage.M - 1))) {
                alert('Game Over');
            }
        }
    };
    /**
     * 创建游戏场景
     */
    Main.prototype.createGameScene = function () {
        DataManage.clickSound = RES.getRes("click");
        this.createMazeGame();
        /**

        var sky:egret.Bitmap = this.createBitmapByName("bgImage");
        this.addChild(sky);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        var topMask:egret.Shape = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, stageH);
        topMask.graphics.endFill();
        topMask.width = stageW;
        topMask.height = stageH;
        this.addChild(topMask);

        var icon:egret.Bitmap = this.createBitmapByName("egretIcon");
        icon.anchorX = icon.anchorY = 0.5;
        this.addChild(icon);
        icon.x = stageW / 2;
        icon.y = stageH / 2 - 60;
        icon.scaleX = 0.55;
        icon.scaleY = 0.55;

        var colorLabel:egret.TextField = new egret.TextField();
        colorLabel.x = stageW / 2;
        colorLabel.y = stageH / 2 + 50;
        colorLabel.anchorX = colorLabel.anchorY = 0.5;
        colorLabel.textColor = 0xffffff;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 20;
        this.addChild(colorLabel);

        var textContainer:egret.Sprite = new egret.Sprite();
        textContainer.anchorX = textContainer.anchorY = 0.5;
        this.addChild(textContainer);
        textContainer.x = stageW / 2;
        textContainer.y = stageH / 2 + 100;
        textContainer.alpha = 0;

        this.textContainer = textContainer;

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        RES.getResAsync("description",this.startAnimation,this)

       **/
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     */
    Main.prototype.startAnimation = function (result) {
        var textContainer = this.textContainer;
        var count = -1;
        var self = this;
        var change = function () {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            var lineArr = result[count];
            self.changeDescription(textContainer, lineArr);
            var tw = egret.Tween.get(textContainer);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };
        change();
    };
    /**
     * 切换描述内容
     */
    Main.prototype.changeDescription = function (textContainer, lineArr) {
        textContainer.removeChildren();
        var w = 0;
        for (var i = 0; i < lineArr.length; i++) {
            var info = lineArr[i];
            var colorLabel = new egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.size = 40;
            textContainer.addChild(colorLabel);
            w += colorLabel.width;
        }
    };
    return Main;
})(egret.DisplayObjectContainer);
