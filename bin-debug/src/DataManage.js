var DataManage = (function () {
    function DataManage() {
    }
    DataManage.getMazeUnitByPos = function (x, y) {
        for (var i = 0; i < DataManage.maze.length; i++) {
            if (DataManage.maze[i].x == x && DataManage.maze[i].y == y) {
                return DataManage.maze[i];
            }
        }
        return null;
    };
    DataManage.findPath = function (x, y, fromxy) {
        if (x == (DataManage.M - 1) && y == (DataManage.M - 1)) {
            return [x, y];
        }
        for (var i = 0; i < DataManage._postArr.length; i++) {
            if (i == 0) {
                var mu = this.getMaze2UnitByPos(x, y);
                if (mu.top) {
                    continue;
                }
            }
            else if (i == 1) {
                var mu = this.getMaze2UnitByPos(x, y);
                if (mu.right) {
                    continue;
                }
            }
            else if (i == 2) {
                var mu = this.getMaze2UnitByPos(x, y);
                if (mu.bottom) {
                    continue;
                }
            }
            else if (i == 3) {
                var mu = this.getMaze2UnitByPos(x, y);
                if (mu.left) {
                    continue;
                }
            }
            var nx = x + this._postArr[i][0];
            var ny = x + this._postArr[i][1];
            if (!DataManage.getMazeUnitByPos(nx, ny) || fromxy == [nx, ny])
                continue; //边界超出或为来源点
            DataManage.pathArr.unshift([x, y]);
            this.findPath(nx, ny, [x, y]);
        }
    };
    DataManage.getMaze2UnitByPos = function (x, y) {
        for (var i = 0; i < DataManage.maze2.length; i++) {
            if (DataManage.maze2[i].x == x && DataManage.maze2[i].y == y) {
                return DataManage.maze2[i];
            }
        }
        return null;
    };
    DataManage.removeMazeUnitByPos = function (x, y) {
        for (var m = 0; m < DataManage.maze.length; m++) {
            if (DataManage.maze[m].x == x && DataManage.maze[m].y == y) {
                DataManage.maze.splice(m, 1);
            }
        }
        return true;
    };
    DataManage.maze = [];
    DataManage.maze2 = [];
    DataManage.M = 8; //宫数
    DataManage.S = 60; // 迷宫格大小
    DataManage._postArr = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    DataManage.mazeOrder = [];
    DataManage.mazeUnit2 = [1, 1, 1, 1];
    DataManage.DEBUG = 0;
    DataManage.pathArr = [];
    DataManage.pos_x = 0;
    DataManage.pox_y = 0;
    DataManage.move_step = 0; // 移动步数
    DataManage.line_color = 0x00FF00;
    return DataManage;
})();
