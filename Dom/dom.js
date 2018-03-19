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
     * 思路：
     * 1.创建棋盘类
     * 2.创建黑白棋类
     * 3.棋子落点事件绑定
     * 4.下棋历史记录，悔棋撤销等
     * 5.规则类
     */

    // 全局常量
    const Length = 15; // 棋盘长宽都为15
    const Black = 1;   // 黑棋
    const White = 2;   // 白棋
    var flag = 1;      // flag用作代表黑白棋落子，1代表黑棋，2是代表白棋

    // 创建五子棋棋盘
    function GoBangBoard (){
        console.log("棋盘初始化完成！");
    }

    var gb = new GoBangBoard();

    // 绝对路径和棋子落点
    // 绝对路径代表每个棋子落点的唯一性，棋子不能落在同一点
    GoBangBoard.prototype.absoluteWay = function (black , white){
      
        // 判断两个棋子的落点与浏览器之间的距离
        if(black.style.left === white.style.left || black.style.top === white.style.top){
            return false;
        }else{
            return true;
        }

    }

    // prototype添加方法，初始化棋盘
    GoBangBoard.prototype.init = function (){
        // 获取棋盘dom对象
        var board = document.getElementById('board');

        for(let i = 0; i < Length; i++){
            // 创建15行
            var row = document.createElement('div');
            row.className += 'chess-row';
            board.appendChild(row);

            for(let j = 0; j < Length; j++){
                // 创建棋子单元格
                var cell = document.createElement('div');
                cell.className += 'cell';
                row.appendChild(cell);
            }
        }

        // 事件绑定计算坐标
        var axis = document.getElementById('board');
        axis.addEventListener('click',function(el){

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

            // 落子路径判断
            var bool = gb.absoluteWay(bChess , wChess);

            if(!bool){
                if(flag === 1){

                    // 黑棋偏移量
                    bChess.style.cssText = `left : ${left + (bChess.style.left)-(35 / 2)}px; 
                                            top :  ${top - (bChess.style.top)-(35 / 2)}px;`;
                    flag = 2;
                    console.log("黑棋" , parseInt(bChess.style.left) , parseInt(bChess.style.top));
                    board.appendChild(bChess);
                }
                else if(flag === 2){
                    // 白棋偏移量
                    wChess.style.cssText = `left : ${left + (wChess.style.left)-(35 / 2)}px; 
                                            top :  ${top - (wChess.style.top)-(35 / 2)}px;`;
                    flag = 1;
                    console.log("白棋" , parseInt(wChess.style.left) , parseInt(wChess.style.top));
                    board.appendChild(wChess);
                }
            }else{
                console.log("黑白两棋落点不能一致");
            }
            

        });
    };

    

    gb.init();