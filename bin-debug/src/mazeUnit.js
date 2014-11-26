var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mazeUnit = (function (_super) {
    __extends(mazeUnit, _super);
    function mazeUnit() {
        _super.call(this);
        this.x = -1;
        this.y = -1;
        this.top = 1;
        this.right = 1;
        this.bottom = 1;
        this.left = 1;
    }
    return mazeUnit;
})(egret.HashObject);
