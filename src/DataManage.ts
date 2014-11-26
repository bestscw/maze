class DataManage {

    public static maze:Array<any> = [];
    public static maze2:Array<any> = [];

    public static  M:number = 8; //宫数
    public static  S:number = 60; // 迷宫格大小
    public static  _postArr:Array<any> = [[0, -1],[1, 0],[0, 1],[-1, 0]];
    public static mazeOrder:Array<any> = [];
    public static mazeUnit2:Array<any> = [1, 1, 1, 1 ];
    public static DEBUG:number = 0;
    public static pathArr:Array<any> = [];

    public static pos_x:number = 0;
    public static pox_y:number = 0;
    public static move_step:number = 0; // 移动步数
    public static clickSound:egret.Sound;
    public static line_color:number = 0x00FF00;


    public static getMazeUnitByPos(x:number,y:number)
    {
        for(var i:number=0; i<DataManage.maze.length; i++)
        {
            if(DataManage.maze[i].x == x &&  DataManage.maze[i].y == y)
            {
                return DataManage.maze[i];
            }
        }

        return null;
    }

    public static findPath(x:number,y:number,fromxy:Array<any>)
    {

        if(x == (DataManage.M-1) && y == (DataManage.M-1))
        {
            return [x,y];
        }

        for(var i:number=0;i<DataManage._postArr.length;i++)
        {
            if(i == 0)
            {
                var mu:mazeUnit = this.getMaze2UnitByPos(x,y);
                if(mu.top)
                {
                    continue;
                }
            }
            else if(i == 1)
            {
                var mu:mazeUnit = this.getMaze2UnitByPos(x,y);
                if(mu.right)
                {
                    continue;
                }
            }
            else if(i == 2)
            {
                var mu:mazeUnit = this.getMaze2UnitByPos(x,y);
                if(mu.bottom)
                {
                    continue;
                }
            }
            else if(i == 3)
            {
                var mu:mazeUnit = this.getMaze2UnitByPos(x,y);
                if(mu.left)
                {
                    continue;
                }
            }

            var nx:number = x+ this._postArr[i][0];
            var ny:number = x+ this._postArr[i][1];

            if(!DataManage.getMazeUnitByPos(nx,ny) || fromxy == [nx,ny]) continue;//边界超出或为来源点

            DataManage.pathArr.unshift([x,y]);
            this.findPath(nx, ny, [x,y]);
        }

    }

    public static getMaze2UnitByPos(x:number,y:number)
    {
        for(var i:number=0; i<DataManage.maze2.length; i++)
        {
            if(DataManage.maze2[i].x == x &&  DataManage.maze2[i].y == y)
            {
                return DataManage.maze2[i];
            }
        }

        return null;
    }

    public static removeMazeUnitByPos(x:number,y:number)
    {

        for(var m:number=0; m<DataManage.maze.length; m++)
        {
            if(DataManage.maze[m].x == x &&  DataManage.maze[m].y == y)
            {
                DataManage.maze.splice(m,1);
            }
        }

        return true;
    }
}