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
     * 2.创建黑白棋
     * 3.棋子落点事件绑定
     * 4.下棋历史记录，悔棋撤销等
     * 5.规则类
     */

    // 全局常量
    const Length = 15;  // 棋盘长宽都为15
    const Black = 1;    // 黑棋
    const White = 2;    // 白棋

    // 标志和记录
    var flag = 1;       // flag用作代表黑白棋落子，1代表黑棋，2是代表白棋
    var bHistory = [];  // 黑棋历史记录
    var wHistory = [];  // 白棋历史记录

    // 创建五子棋棋盘
    function GoBangBoard (){
        console.log("棋盘初始化完成！");
    }

    var gb = new GoBangBoard(); // 实例化棋盘对象

    // 绝对路径和棋子落点
    // 绝对路径代表每个棋子落点的唯一性，棋子不能落在同一点
    GoBangBoard.prototype.absoluteWay = function (left , top , bChess , wChess){
      
        // 判断两个棋子的落点与浏览器之间的距离
        if(bChess.style.left === wChess.style.left || bChess.style.top === wChess.style.top){
            console.log("黑棋：", bChess);
            console.log("白棋：", wChess);
            return false;
        }else{
            return true;
        }

    };

    // prototype添加方法，初始化棋盘
    // 获取棋盘dom对象
    var board = document.getElementById('board');

    GoBangBoard.prototype.init = function (){
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
        gb.listen();
    };

    // 监听棋盘
    GoBangBoard.prototype.listen = function(){

         // 事件绑定计算坐标
         board.addEventListener('click',function(el){
 
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
 
             if(flag === 1){
 
                 var bLeft = parseInt(left - (bChess.style.left)-(35 / 2));  // 黑棋左边偏移量
                
                 var bTop = parseInt(top - (bChess.style.top)-(35 / 2));  // 黑棋顶部偏移量
                
                 bHistory.push((bLeft + "," + bTop)); // 黑棋每一步历史记录
 
                 // 黑棋偏移量，绘画棋子
                 bChess.style.cssText = `left : ${bLeft}px; 
                                         top :  ${bTop}px;`;
                 flag = 2;
                 console.log("黑棋" , parseInt(bChess.style.left) , parseInt(bChess.style.top));
                 
                 // 落子位置唯一
                 
                 board.appendChild(bChess);
                 
             }
             else if(flag === 2){
                 
                 // 白棋左边偏移量
                 var wLeft = parseInt(left - (wChess.style.left)-(35 / 2));
                 // 白棋顶部偏移量
                 var wTop = parseInt(top - (wChess.style.top)-(35 / 2));
                 // 白棋每一步历史记录
                 wHistory.push((wLeft + "," + wTop));
             
                 // 白棋偏移量，绘画棋子
                 wChess.style.cssText = `left : ${wLeft}px; 
                                         top :  ${wTop}px;`;
                 flag = 1;
                 console.log("白棋" , parseInt(wChess.style.left) , parseInt(wChess.style.top));
 
                 // 落子位置唯一
                
                 board.appendChild(wChess);     
             }
 
             // 落子路径判断,保证唯一性
             var bool = gb.absoluteWay(left , top , bChess , wChess);

             if(wHistory.length === 0){
                console.log("白棋为空数组");
             }else{
                // 根据黑白棋行棋历史进行悔棋
                console.log("可以悔棋了");
             }
            
         });
    }

    
    var bFlag = 1;   // 黑棋标志位，当bFlag=0时，即黑棋只能悔棋一次
    var wFlag = 1;   // 白棋标志位，当bFlag=0时，即白棋只能悔棋一次

    // 悔棋
    function recall (){
        
        console.log("黑棋：", bHistory);
        console.log("白棋：", wHistory);

        var len = board.childNodes.length-1;
        var currentLen = 0;  // 记录移除dom子元素后，还剩下的子元素的长度

        if(bHistory.length !== 0 && wHistory.length !== 0){
            if( bFlag !== 0 && board.childNodes[len].classList.value.indexOf('black') > 0){
                board.removeChild(board.childNodes[len]);
                bFlag = 0;
                flag = 1;  // 复位删除掉的黑棋
            }

            if( wFlag !== 0 && board.childNodes[len].classList.value.indexOf('white') > 0 ){
                board.removeChild(board.childNodes[len]);
                wFlag = 0;
                flag = 2;  // 复位删除掉的白棋
            }

            else{
                console.log("只能悔棋一次哦");
            }

        }else{
            console.log("白棋还没下");
        }
    
    }

    // 撤销悔棋
    function cancelRecall (){
        var bLen = bHistory.length-1;           // 黑棋历史行棋轨迹
        var wLen = wHistory.length-1;           // 白棋历史行棋轨迹
        var len  = board.childNodes.length-1;   // board棋盘子节点长度

        var bArr = bHistory[bLen].split(",");   // 单独获取最后黑棋一个元素的坐标，并拼接成数组，得到x,y坐标
        var wArr = wHistory[wLen].split(",");   // 单独获取最后白棋一个元素的坐标，并拼接成数组，得到x,y坐标
        console.log(bArr);

        var bChess = document.createElement('div');  // 撤销悔棋这里是重新插入dom
        bChess.classList.add('chess');
        bChess.classList.add('black');

        var wChess = document.createElement('div');  // 撤销悔棋这里是重新插入dom
        wChess.classList.add('chess');
        wChess.classList.add('white');

        // 这里的想法是如果当前board中最后的子元素是白棋的话，则恢复黑棋原来轨迹，反之亦然
        if(board.childNodes[len].classList.value.indexOf('white') > 0){
             bChess.style.cssText = `left : ${bArr[0]}px;
                                     top : ${bArr[1]}px;`;
            board.appendChild(bChess);
        }
        else{
            wChess.style.cssText = `left : ${wArr[0]}px;
                                    top : ${wArr[1]}px;`;
            board.appendChild(wChess);
        }


    }

    // 每次新增棋子dom元素时，获取它的标志位，即黑棋或白棋标志位
    function getChessFlag (flag){
        return flag;
    }

    // 重新开局
    function reboot (){
        console.log("原始记录：",bHistory,wHistory);

        // 复位所有全局变量，移除原有棋子dom
        flag = 1; 
        var bHistory = [];  // 黑棋历史记录
        var wHistory = [];  // 白棋历史记录

        console.log("重开记录：",bHistory);

        var chessData = document.getElementsByClassName('chess');
        for(var i = 0; i < chessData.length; i++){
            board.removeChild(chessData[i]);
        }
    };
    

    // 游戏规则




    gb.init();