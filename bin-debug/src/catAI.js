/**
 *
 * @author
 *
 */
var catAI = (function () {
    function catAI() {
    }
    var __egretProto__ = catAI.prototype;
    //存放每一个点的前一个点
    __egretProto__.findWay = function (catPot, potFlag) {
        var qidian = catPot;
        //记录该点的前一个点
        var backPot = [];
        //判断是否该点周围点已属于前一个点
        var backPotFlag = [];
        //可走的点
        var canGo = [];
        //出口点
        var chukou;
        //用于标记点是否已经被扫描过了
        var isFlag1 = [81];
        for (var m = 0; m < 81; m++) {
            isFlag1[m] = false;
            isFlag1[catPot] = true;
        }
        for (var m = 0; m < 81; m++) {
            backPotFlag[m] = false;
        }
        for (var m = 0; m < 81; m++) {
            backPot[m] = -1;
        }
        while (true) {
            //得到猫所在的行数
            var row = Math.floor(catPot / 9);
            // 得到猫所在点的列数
            var col = Math.floor(catPot % 9);
            var rowTemp = row;
            var colTemp = col;
            if (this.isExit(catPot)) {
                chukou = catPot;
                break;
            }
            //左上角
            if (row % 2 == 0) {
                if (potFlag[(row - 1) * 9 + (col - 1)] == true || isFlag1[(row - 1) * 9 + (col - 1)] == true) {
                }
                else {
                    backPot[(row - 1) * 9 + (col - 1)] = catPot;
                    rowTemp = row - 1;
                    colTemp = col - 1;
                    canGo.push(rowTemp * 9 + colTemp);
                    isFlag1[rowTemp * 9 + colTemp] = true;
                }
            }
            else {
                if (potFlag[(row - 1) * 9 + (col)] == true || isFlag1[(row - 1) * 9 + (col)] == true) {
                }
                else {
                    backPot[(row - 1) * 9 + (col)] = catPot;
                    rowTemp = rowTemp - 1;
                    colTemp = colTemp;
                    canGo.push(rowTemp * 9 + colTemp);
                    isFlag1[rowTemp * 9 + colTemp] = true;
                }
            }
            rowTemp = row;
            colTemp = col;
            //右上角
            if (row % 2 == 0) {
                if (potFlag[(row - 1) * 9 + (col)] == true || isFlag1[(row - 1) * 9 + (col)] == true) {
                }
                else {
                    backPot[(row - 1) * 9 + (col)] = catPot;
                    rowTemp = rowTemp - 1;
                    colTemp = colTemp;
                    canGo.push(rowTemp * 9 + colTemp);
                    isFlag1[rowTemp * 9 + colTemp] = true;
                }
            }
            else {
                if (potFlag[(row - 1) * 9 + (col + 1)] == true || isFlag1[(row - 1) * 9 + (col + 1)] == true) {
                }
                else {
                    backPot[(row - 1) * 9 + (col + 1)] = catPot;
                    rowTemp = rowTemp - 1;
                    colTemp = colTemp + 1;
                    canGo.push(rowTemp * 9 + colTemp);
                    isFlag1[rowTemp * 9 + colTemp] = true;
                }
            }
            rowTemp = row;
            colTemp = col;
            //左边
            if (potFlag[(row) * 9 + (col - 1)] == true || isFlag1[(row) * 9 + (col - 1)] == true) {
            }
            else {
                backPot[(row) * 9 + (col - 1)] = catPot;
                rowTemp = rowTemp;
                colTemp = colTemp - 1;
                canGo.push(rowTemp * 9 + colTemp);
                isFlag1[rowTemp * 9 + colTemp] = true;
            }
            rowTemp = row;
            colTemp = col;
            //右边
            if (potFlag[(row) * 9 + (col + 1)] == true || isFlag1[(row) * 9 + (col + 1)] == true) {
            }
            else {
                backPot[(row) * 9 + (col + 1)] = catPot;
                rowTemp = rowTemp;
                colTemp = colTemp + 1;
                canGo.push(rowTemp * 9 + colTemp);
                isFlag1[rowTemp * 9 + colTemp] = true;
            }
            rowTemp = row;
            colTemp = col;
            //左下角
            if (row % 2 == 0) {
                if (potFlag[(row + 1) * 9 + (col - 1)] == true || isFlag1[(row + 1) * 9 + (col - 1)] == true) {
                }
                else {
                    backPot[(row + 1) * 9 + (col - 1)] = catPot;
                    rowTemp = rowTemp + 1;
                    colTemp = colTemp - 1;
                    canGo.push(rowTemp * 9 + colTemp);
                    isFlag1[rowTemp * 9 + colTemp] = true;
                }
            }
            else {
                if (potFlag[(row + 1) * 9 + (col)] == true || isFlag1[(row + 1) * 9 + (col)] == true) {
                }
                else {
                    backPot[(row + 1) * 9 + (col)] = catPot;
                    rowTemp = row + 1;
                    colTemp = col;
                    canGo.push(rowTemp * 9 + colTemp);
                    isFlag1[rowTemp * 9 + colTemp] = true;
                }
            }
            rowTemp = row;
            colTemp = col;
            //右下角
            if (row % 2 == 0) {
                if (potFlag[(row + 1) * 9 + (col)] == true || isFlag1[(row + 1) * 9 + (col)] == true) {
                }
                else {
                    backPot[(row + 1) * 9 + (col)] = catPot;
                    rowTemp = rowTemp + 1;
                    colTemp = colTemp;
                    canGo.push(rowTemp * 9 + colTemp);
                    isFlag1[rowTemp * 9 + colTemp] = true;
                }
            }
            else {
                if (potFlag[(row + 1) * 9 + (col + 1)] == true || isFlag1[(row + 1) * 9 + (col + 1)] == true) {
                }
                else {
                    backPot[(row + 1) * 9 + (col + 1)] = catPot;
                    rowTemp = row + 1;
                    colTemp = col + 1;
                    canGo.push(rowTemp * 9 + colTemp);
                    isFlag1[rowTemp * 9 + colTemp] = true;
                }
            }
            catPot = canGo.shift();
        }
        var back = -1;
        while (true) {
            back = backPot[chukou];
            if (back == qidian) {
                return chukou;
                break;
            }
            else {
                chukou = back;
            }
        }
    };
    __egretProto__.isExit = function (index) {
        if (Math.floor(index / 9) == 0 || Math.floor(index / 9) == 8 || Math.floor(index % 9) == 0 || Math.floor(index % 9) == 8) {
            return true;
        }
        else {
            return false;
        }
    };
    return catAI;
})();
catAI.prototype.__class__ = "catAI";
