/**
    * 五子棋盘是方形的，由纵横各15条线组成。15X15形成了225个交叉点。
    * 五子棋的组成元素，棋盘，黑棋113枚，白棋112枚，单色棋最先5个连成一条直线则获胜
    *
    * 需求：
    * 1.用 Web 技术实现一个五子棋（不用考虑人机对战）
    * 2.支持 DOM 版和 Canvas 版本切换
    * 3.实现一个悔棋的功能
    * 4.实现一个撤销悔棋的功能
    */

/**
 * 0.0.1版本
 * 个人思路：
 * 1.创建棋盘类
 * 2.创建黑白棋
 * 3.棋子落点事件绑定
 * 4.二维数组保存棋盘记录，0空位置，1黑棋，2白棋
 * 5.下棋历史记录，悔棋撤销等
 * 5.游戏输赢判断规则类
 */

/**
 * 思考难点：
 * 1.黑白棋子落点的唯一性（即有占位置的棋子处就不能再落子）
 * 2.黑白棋子落点问题（即玩家不点击交叉点处，点空格中某一点，这时要判断出玩家点击的点距离最近的交叉点，然后在这点落子）
 * 3.棋盘二维数组保存记录问题
 * 4.获胜的判断条件（即最先连成5个同色的棋子获胜，连线方式是米字型8个区域这么多种情况，交叉边判断逻辑等）
 * 5.canvas版本，x,y坐标确定问题，棋子是绘制还是加dom？
 */

// 全局常量
const Length = 15;  // 棋盘长宽都为15
const Black = 1;    // 黑棋
const White = 2;    // 白棋

// 标志和记录
var flag = 1;                // flag用作代表黑白棋落子，1代表黑棋，2是代表白棋
var bHistory = [];           // 黑棋历史记录（left和top的偏移量）
var wHistory = [];           // 白棋历史记录
var bAxis = [];              // 存储对应的黑棋坐标，是取整left/42       
var wAxis = [];              // 存储对应的黑棋坐标，是取整left/42
var nullHistory = [Length];  // 记录空白位置，这里存储的是棋子left和top的偏移量
var chessStatus = '';        // 当前棋子的状态，即轮到哪个颜色的棋子行动了

var bFlag = 1;               // 黑棋标志位，当bFlag=0时，即黑棋只能悔棋一次
var wFlag = 1;               // 白棋标志位，当bFlag=0时，即白棋只能悔棋一次

var winner = '';             // 获胜方

// 创建五子棋棋盘
function GoBangBoard() {
    console.log("棋盘初始化完成！");
}

var gb = new GoBangBoard(); // 实例化棋盘对象

// 获取棋盘dom对象
var board = document.getElementById('board');

// prototype添加方法，初始化棋盘，dom版本
GoBangBoard.prototype.init = function () {
    for (var i = 0; i < Length; i++) {
        // 创建15行
        var row = document.createElement('div');
        row.className += 'chess-row';
        board.appendChild(row);

        nullHistory[i] = new Array(Length);  // 创建15个二维数组

        for (var j = 0; j < Length; j++) {
            // 创建棋子单元格
            var cell = document.createElement('div');
            cell.className += 'cell';
            row.appendChild(cell);

            nullHistory[i][j] = 0;  // 255个格子的值都为0，代表空位置
        }
    }
    gb.listen(); // 对棋盘添加监听器
};

// canvas版本(未完成)
var canvas = document.createElement('canvas');
GoBangBoard.prototype.initCanvas = function () {

    var context = canvas.getContext('2d');
    canvas.setAttribute('id', 'canvas');
    canvas.style.cssText = `margin: 20px 0 20px 0; box-shadow: 8px 8px 20px #7a7a7a;`;
    canvas.width = document.body.clientWidth;
    canvas.height = 630;
    context.strokeStyle = "rgb(71, 71, 71)";

    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            context.lineWidth = 1;
            context.strokeRect(i * 42, j * 42, 42, 42);
        }
    }
    document.body.appendChild(canvas);
    gb.listenCanvas();
};

// 监听dom创建的棋盘
GoBangBoard.prototype.listen = function () {

    // 事件绑定计算坐标，dom落子
    board.onclick = function (el) {

        var left = el.target.offsetLeft;  // 棋子距离屏幕左边的距离
        var top = el.target.offsetTop;    // 棋子距离屏幕上边的距离

        // 黑棋
        var bChess = document.createElement('div');
        bChess.classList.add('chess');
        bChess.classList.add('black');

        // 白棋
        var wChess = document.createElement('div');
        wChess.classList.add('chess');
        wChess.classList.add('white');

        chessStatus = document.getElementById('chess-status');

        // 判断落子位置是否有棋子，若有则跳出
        if (el.target.className.includes('chess')) {
            console.log("不能在同一个位置重复落子");
            return false;
        }
        else {
            // 根据形成的二维棋盘中格子是否有值，若该值不等于0，则表示这个位置已有棋子占位
            // 每个格子的长宽都为42px，这里是为了求出棋盘中每个格子交叉的x,y轴坐标
            // 这里有个问题，就是为了避免出现小数下标，采取了取值取整
            if (nullHistory[Math.round(left / 42)][Math.round(top / 42)] == 0) {

                // 黑子先手落子
                if (flag === 1) {

                    chessStatus.style.cssText = `background-color : white`;

                    console.log("黑棋", Math.round(left / 42), Math.round(top / 42));

                    board.appendChild(drawChess(flag, left, top, bHistory, bAxis, bChess));

                    bFlag = 1; // 新增黑棋落子后，又可以悔棋

                    flag = 2;  // 黑棋落完子，切换flag，轮到白子落子

                    window.GameRules(1, left, top); // 每次落完棋子后判断输赢
                }
                else if (flag === 2) {

                    chessStatus.style.cssText = `background-color : black`;

                    console.log("白棋", Math.round(left / 42), Math.round(top / 42));

                    board.appendChild(drawChess(flag, left, top, wHistory, wAxis, wChess));

                    wFlag = 1; // 新增黑棋落子后，又可以悔棋

                    flag = 1;  // 白棋落完子，切换flag，轮到黑棋落子

                    window.GameRules(2, left, top); // 每次落完棋子后判断输赢
                }
                if (wHistory.length === 0) {
                    console.log("白棋还没下,还不能悔棋");
                    return;
                } else {
                    console.log("可以悔棋了"); // 根据黑白棋行棋历史进行悔棋
                }
            }
            else {
                console.log("该位置上已有棋子了~");
                return false;
            }
        }
    }
};

// 监听canvas绘画的棋子
GoBangBoard.prototype.listenCanvas = function () {

    canvas.addEventListener('click', function (el) {
        console.log(el);

    });
};

// 绘画节点棋子
function drawChess(flag, left, top, history, axis, chess) {

    // 这里的思路是：
    // left是距离浏览器左边的距离，
    // 棋子的长宽各为36px，取中值即是让棋子的中点位于board棋盘横纵轴的交叉点上
    var chessLeft = parseInt(left - (36 / 2));  // 棋子左边偏移量

    var chessTop = parseInt(top - (36 / 2));  // 棋子顶部偏移量

    history.push((chessLeft + "," + chessTop)); // 棋子每一步历史记录

    axis.push((left / 42 + "," + top / 42));

    nullHistory[Math.round(left / 42)][Math.round(top / 42)] = flag; // 添加落棋位置

    console.log("当前棋盘记录：", nullHistory);

    // 棋子偏移量，绘画棋子
    chess.style.cssText = `left : ${chessLeft}px; 
                                top :  ${chessTop}px;`;
    return chess;
}

// 悔棋
function recall(obj = null) {

    if (winner == '') {
        obj = board !== undefined ? board : canvas;

        var len = obj.childNodes.length - 1;
        var rc = this.chessHistory();  // 获取x,y坐标

        if (bHistory.length !== 0 && wHistory.length !== 0) {
            if (bFlag !== 0 && obj.childNodes[len].classList.value.indexOf('black') > 0) {
                obj.removeChild(obj.childNodes[len]);
                wFlag = 0;
                flag = 1;   // 复位删除掉的黑棋，即悔棋后保证下次落子是黑棋
                nullHistory[rc.bAxisArr[0]][rc.bAxisArr[1]] = 0; // 清除该位置的记录
            }

            if (wFlag !== 0 && obj.childNodes[len].classList.value.indexOf('white') > 0) {
                obj.removeChild(obj.childNodes[len]);
                bFlag = 0;
                flag = 2;   // 复位删除掉的白棋，即悔棋后保证下次落子是白棋
                nullHistory[rc.wAxisArr[0]][rc.wAxisArr[1]] = 0; // 清除
            }

            else {
                console.log("只能悔棋一次哦"); // bFlag或wFlag等于0时不能悔棋
            }
        } else if (wHistory.length === 0) {
            console.log("白棋还没下");
            return false;
        }
    } else {
        console.log("已经结束游戏了");
        return;
    }
}

// 撤销悔棋
function cancelRecall(obj = null) {

    if (winner === '') {
        obj = board !== undefined ? board : canvas;

        var cancel = this.chessHistory(); // 根据棋子行棋记录返回的对象

        var bChess = document.createElement('div');  // 撤销悔棋这里是重新插入dom
        bChess.classList.add('chess');
        bChess.classList.add('black');

        var wChess = document.createElement('div');  // 撤销悔棋这里是重新插入dom
        wChess.classList.add('chess');
        wChess.classList.add('white');

        // 这里的想法是如果当前board中最后的子元素是白棋的话，则恢复黑棋原来轨迹，反之亦然
        if (wFlag == 0 && obj.childNodes[cancel.len].classList.value.indexOf('white') > 0) {
            nullHistory[cancel.bAxisArr[0]][cancel.bAxisArr[1]] = cancel.bArr.join(); // 还原移除的值

            bChess.style.cssText = `left : ${cancel.bArr[0]}px;
                                        top : ${cancel.bArr[1]}px;`;
            obj.appendChild(bChess);
            flag = 2; // 保证下次是下白棋，因为恢复的是黑棋                        
        }
        else if (bFlag == 0 && obj.childNodes[cancel.len].classList.value.indexOf('black') > 0) {

            nullHistory[cancel.wAxisArr[0]][cancel.wAxisArr[1]] = cancel.wArr.join();

            wChess.style.cssText = `left : ${cancel.wArr[0]}px;
                                        top : ${cancel.wArr[1]}px;`;
            obj.appendChild(wChess);
            flag = 1; // 保证下次是下黑棋，因为恢复的是白棋  
        }
        else {
            console.log("不能重复撤销");
            return;
        }
    } else {
        console.log("已经结束游戏了");
        return;
    }
}

// 重新开局
function reboot(obj = null) {

    obj = board !== undefined ? board : canvas;

    gb.listen();
    // 复位所有全局变量，移除原有棋子dom
    flag = 1;
    bHistory = [];    // 黑棋历史记录
    wHistory = [];    // 白棋历史记录
    winner = '';

    // 同时也清空棋子在棋盘的占位历史记录，避免出现空指针异常
    for (var i = 0; i < Length; i++) {
        for (var j = 0; j < Length; j++) {
            nullHistory[i][j] = 0
        }
    }
    chessStatus.style.cssText = `background-color : black`;

    var chessData = document.getElementsByClassName('chess');
    console.log("清空后棋盘记录", nullHistory);

    for (var i = 0; i < chessData.length; i++) {
        while (obj.hasChildNodes()) {
            obj.removeChild(chessData[i]);
        }
    }
};

// 黑棋和白棋历史记录计算
function chessHistory(obj = null) {

    obj = board !== undefined ? board : canvas;

    var bLen = bHistory.length - 1;            // 黑棋历史行棋轨迹
    var wLen = wHistory.length - 1;            // 白棋历史行棋轨迹
    var len = obj.childNodes.length - 1;       // board或者canvas棋盘子节点长度
    var bAxisLen = bAxis.length - 1;           // 黑棋对应的坐标
    var wAxisLen = wAxis.length - 1;           // 白棋对应的坐标

    var bArr = bHistory[bLen].split(",");      // 单独获取最后黑棋一个元素的坐标，并拼接成数组，得到x,y坐标
    var wArr = wHistory[wLen].split(",");      // 单独获取最后白棋一个元素的坐标，并拼接成数组，得到x,y坐标

    var bAxisArr = bAxis[bAxisLen].split(","); // 得到黑棋的坐标，这里的坐标是left/42 , top/42得到的下标
    var wAxisArr = wAxis[wAxisLen].split(",");

    return chess_history = {
        len,
        bArr,
        wArr,
        bAxisArr,
        wAxisArr
    };
}

// 游戏规则
// 单色棋首先5个连线，根据坐标米字型可以划分为8个区域，(上，下，左，右，左斜上，右斜上，左斜下，右斜下)
// 判断8个区域中
// 所以这里使用了棋子的行棋记录，需要取到
function GameRules(flag, left, top) {

    // 上下方向计数
    var verCount = 1;
    // 水平方向计数
    var hozCount = 1;
    // 左交叉线计数
    var leftCount = 1;
    // 右交叉线计数
    var rightCount = 1;

    var x = Math.round(left / 42);
    var y = Math.round(top / 42);

    /********************************************************* */
    // 当棋子落在四个角落的时候，避免下标小于0
    // 分别对左顶角，右顶角，左下角，右下角
    /********************************************************* */
    // 水平方向判断 
    // 水平向右查找，x坐标++ ， y坐标不变，x+1是从右方向的下一个棋子开始判断
    for (var i = x + 1; i < Length; i++) {
        if (nullHistory[i][y] === flag) {
            hozCount++;
        } else {
            break;
        }
    }

    // 水平向左查找，x坐标-- ，y坐标不变 
    for (var i = x - 1; i >= 0; i--) {
        if (nullHistory[i][y] === flag) {
            hozCount++;
        } else {
            break;
        }
    }

    /********************************************************* */
    // 垂直方向判断
    // 垂直向上查找，x坐标不变，y坐标--，
    for (var i = y - 1; i >= 0; i--) {
        if (nullHistory[x][i] === flag) {
            verCount++;
        } else {
            break;
        }
    }

    // 垂直向下查找，x坐标不变，y坐标++
    for (var i = y + 1; i < Length; i++) {
        if (nullHistory[x][i] === flag) {
            verCount++;
        } else {
            break;
        }
    }

    /********************************************************* */
    // 交叉边方向判断
    // 左上斜边查找，x坐标--，y坐标--
    for (var i = x - 1, j = y - 1; i >= 0, j >= 0; i-- , j--) {
        if (nullHistory[i][j] === flag) {
            leftCount++;
        } else {
            break;
        }
    }

    // 右上斜边查找，x坐标++，y坐标--
    for (var i = x + 1, j = y - 1; i < Length, j >= 0; i++ , j--) {
        if (nullHistory[i][j] === flag) {
            rightCount++;
        } else {
            break;
        }
    }

    // 左下斜边查找，x坐标--，y坐标++
    for (var i = x - 1, j = y + 1; i >= 0, j < Length; i-- , j++) {
        if (nullHistory[i][j] === flag) {
            leftCount++;
        } else {
            break;
        }
    }

    // 右下斜边查找，x坐标++，y坐标++
    for (var i = x + 1, j = y + 1; i < Length, j < Length; i++ , j++) {
        if (nullHistory[i][j] === flag) {
            rightCount++;
        } else {
            break;
        }
    }
    // 当count>=5时获得胜利
    if (verCount >= 5 || hozCount >= 5 || leftCount >= 5 || rightCount >= 5) {
        if (flag === 1) {
            winner = "黑棋赢了哦~";
            board.onclick = null; // 移除board事件绑定
        } else {
            winner = "白棋赢了哦~";
            board.onclick = null;
        }
        alert(winner);
    }
}

// 版本切换
// version 版本: dom , canvas
function toggle(version) {

    var txt = document.getElementById('canvasTxt');
    txt.innerHTML = "canvas版本正在努力完工中......";

    if (version === "dom") {
        // html文件中存在board DOM对象，就不用再创建dom对象了，移除只是从页面中移除子节点，重新在根节点中添加即可
        document.body.appendChild(board);
        document.body.removeChild(canvas);
        txt.style.cssText = `visibility : hidden`;
    }
    else if (version === "canvas") {
        document.body.removeChild(board);
        gb.initCanvas();
        txt.style.cssText = `visibility : visible; color : white; margin : 0 0 0 80px;background : #e20f08`;
    }
}

gb.init(); // 初始化棋盘，默认dom版本