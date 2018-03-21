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
     * 4.下棋历史记录，悔棋撤销等
     * 5.规则类
     */

     /**
      * 思考难点：
      * 1.黑白棋子落点的唯一性（即有占位置的棋子处就不能再落子）
      * 2.黑白棋子落点问题（即玩家不点击交叉点处，点空格中某一点，这时要判断出玩家点击的点距离最近的交叉点，然后在这点落子）
      * 3.获胜的判断条件（即最先连成5个同色的棋子获胜，连线方式是米字型8个区域这么多种情况）
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
    var resetHistory = [Length]; // 复位空白位置，默认二维数组，255格子值都为0
    var chessStatus = '';        // 当前棋子的状态，即轮到哪个颜色的棋子行动了
        
    var bFlag = 1;               // 黑棋标志位，当bFlag=0时，即黑棋只能悔棋一次
    var wFlag = 1;               // 白棋标志位，当bFlag=0时，即白棋只能悔棋一次

    // 创建五子棋棋盘
    function GoBangBoard (){
        console.log("棋盘初始化完成！");
    }

    var gb = new GoBangBoard(); // 实例化棋盘对象
   
    // 获取棋盘dom对象
    var board = document.getElementById('board');
    
    // prototype添加方法，初始化棋盘
    GoBangBoard.prototype.init = function (){
        for(let i = 0; i < Length; i++){
            // 创建15行
            var row = document.createElement('div');
            row.className += 'chess-row';
            board.appendChild(row);

            nullHistory[i] = new Array(Length);  // 创建15个二维数组
            resetHistory[i] = new Array(Length); // 重置空位置数组

            for(let j = 0; j < Length; j++){
                // 创建棋子单元格
                var cell = document.createElement('div');
                cell.className += 'cell';
                row.appendChild(cell);

                nullHistory[i][j] = 0;  // 255个格子的值都为0，代表空位置
                resetHistory[i][j] = 0; // 这里初始resetHistory状态，记录位
            }
        }
        gb.listen(); // 对棋盘添加监听器
    };

    // 监听棋盘
    GoBangBoard.prototype.listen = function(){
        
         // 事件绑定计算坐标
         board.addEventListener('click' , function(el){

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
            if(el.target.className.includes('chess')){
                console.log("不能在同一个位置重复落子");
                return false;
            }
            else{
                // 根据形成的二维棋盘中格子是否有值，若该值不等于0，则表示这个位置已有棋子占位
                // 每个格子的长宽都为42px，这里是为了求出棋盘中每个格子交叉的x,y轴坐标
                // 这里有个问题，就是为了避免出现小数下标，采取了取值取整
                if(nullHistory[Math.round(left / 42)][Math.round(top / 42)] == 0){

                    // 黑子先手落子
                    if(flag === 1){
    
                        chessStatus.style.cssText = `background-color : white`;
    
                        console.log("黑棋" , left / 42 , top / 42);
                        
                        board.appendChild(drawChess(flag , left , top  , bHistory , bAxis , bChess));
   
                        bFlag = 1; // 新增黑棋落子后，又可以悔棋

                        flag = 2;  // 黑棋落完子，切换flag，轮到白子落子
                    }
                    else if(flag === 2){

                        chessStatus.style.cssText = `background-color : black`;

                        console.log("白棋" , left / 42 , top / 42);

                        board.appendChild(drawChess(flag , left , top , wHistory , wAxis , wChess));     

                        wFlag = 1; // 新增黑棋落子后，又可以悔棋

                        flag = 1;  // 白棋落完子，切换flag，轮到黑棋落子
                    }
                    if(wHistory.length === 0){
                        console.log("白棋为空数组");
                     }else{
                        console.log("可以悔棋了"); // 根据黑白棋行棋历史进行悔棋
                     }
               }
               else{
                    console.log("该位置上已有棋子了~");
                    return false;
               }
            }
            
         });
    };

    // 绘画棋子
    function drawChess (flag , left , top , history , axis , chess){

        // 这里的思路是：
        // left是距离浏览器左边的距离，
        // 棋子的长宽各为36px，取中值即是让棋子的中点位于board棋盘横纵轴的交叉点上
        var chessLeft = parseInt(left - (36 / 2));  // 棋子左边偏移量
        
        var chessTop = parseInt(top - (36 / 2));  // 棋子顶部偏移量

        history.push((chessLeft + "," + chessTop)); // 棋子每一步历史记录

        axis.push((left / 42 + "," + top / 42));

        nullHistory[left / 42][top / 42] = chessLeft + "," + chessTop; // 添加落棋位置

        console.log("当前棋盘记录：",nullHistory);

        // 棋子偏移量，绘画棋子
        chess.style.cssText = `left : ${chessLeft}px; 
                                top :  ${chessTop}px;`;

        return chess;
        
    }

    // 悔棋
    function recall (){
        console.log("黑棋：", bHistory);
        console.log("白棋：", wHistory);

        var len = board.childNodes.length-1;
        var rc = this.chessHistory();  // 获取x,y坐标

        if(bHistory.length !== 0 && wHistory.length !== 0){
            if( bFlag !== 0 && board.childNodes[len].classList.value.indexOf('black') > 0){
                board.removeChild(board.childNodes[len]);
                wFlag = 0; 
                flag = 1;   // 复位删除掉的黑棋，即悔棋后保证下次落子是黑棋
                nullHistory[rc.bAxisArr[0]][rc.bAxisArr[1]] = 0; // 清除该位置的记录
                console.log("黑棋悔棋：", nullHistory);
            }

            if( wFlag !== 0 && board.childNodes[len].classList.value.indexOf('white') > 0 ){
                board.removeChild(board.childNodes[len]);
                bFlag = 0;
                flag = 2;   // 复位删除掉的白棋，即悔棋后保证下次落子是白棋
                nullHistory[rc.wAxisArr[0]][rc.wAxisArr[1]] = 0; // 清除
                console.log("白棋悔棋：", nullHistory);
            }

            else{
                console.log("只能悔棋一次哦"); // bFlag或wFlag等于0时不能悔棋
            }

        }else if(wHistory.length === 0){
            console.log("白棋还没下");
            return false;
        }
    
    }

    // 撤销悔棋
    function cancelRecall (){

        var cancel = this.chessHistory(); // 根据棋子行棋记录返回的对象

        var bChess = document.createElement('div');  // 撤销悔棋这里是重新插入dom
        bChess.classList.add('chess');
        bChess.classList.add('black');

        var wChess = document.createElement('div');  // 撤销悔棋这里是重新插入dom
        wChess.classList.add('chess');
        wChess.classList.add('white');

        // 这里的想法是如果当前board中最后的子元素是白棋的话，则恢复黑棋原来轨迹，反之亦然
        if(wFlag == 0 && board.childNodes[cancel.len].classList.value.indexOf('white') > 0){           
            nullHistory[cancel.bAxisArr[0]][cancel.bAxisArr[1]] = cancel.bArr.join(); // 还原移除的值

            bChess.style.cssText = `left : ${cancel.bArr[0]}px;
                                        top : ${cancel.bArr[1]}px;`;
            board.appendChild(bChess);
            flag = 2; // 保证下次是下白棋，因为恢复的是黑棋                        
        }
        else if(bFlag == 0 && board.childNodes[cancel.len].classList.value.indexOf('black') > 0){

            nullHistory[cancel.wAxisArr[0]][cancel.wAxisArr[1]] = cancel.wArr.join();

            wChess.style.cssText = `left : ${cancel.wArr[0]}px;
                                    top : ${cancel.wArr[1]}px;`;
            board.appendChild(wChess);
            flag = 1; // 保证下次是下黑棋，因为恢复的是白棋  
        }
        else{
            console.log("不能重复悔棋");
            return;
        }
        console.log("撤销悔棋", nullHistory);
    }

    // 重新开局
    function reboot (){
        console.log("原始记录：",bHistory , wHistory);

        // 复位所有全局变量，移除原有棋子dom
        flag = 1; 
        bHistory = [];    // 黑棋历史记录
        wHistory = [];    // 白棋历史记录
        nullHistory = resetHistory; // 同时也清空棋子在棋盘的占位历史记录，避免出现空指针异常
        chessStatus.style.cssText = `background-color : black`;

        var chessData = document.getElementsByClassName('chess');
        console.log("清空后棋盘记录", nullHistory);

        //console.log(chessData);
        for(var i = 0; i < chessData.length; i++){
            while(board.hasChildNodes()){
                board.removeChild(chessData[i]);
            }
        }
    };

    // 黑棋和白棋历史记录计算
    function chessHistory (){
        var bLen = bHistory.length - 1;            // 黑棋历史行棋轨迹
        var wLen = wHistory.length - 1;            // 白棋历史行棋轨迹
        var len  = board.childNodes.length - 1;    // board棋盘子节点长度
        var bAxisLen = bAxis.length - 1;           // 黑棋对应的坐标
        var wAxisLen = wAxis.length - 1;           // 白棋对应的坐标

        var bArr = bHistory[bLen].split(",");      // 单独获取最后黑棋一个元素的坐标，并拼接成数组，得到x,y坐标
        var wArr = wHistory[wLen].split(",");      // 单独获取最后白棋一个元素的坐标，并拼接成数组，得到x,y坐标

        var bAxisArr = bAxis[bAxisLen].split(",");  
        var wAxisArr = wAxis[wAxisLen].split(",");  

        return chess_history = {
            len,
            bArr,
            wArr,
            bAxisArr,
            wAxisArr
        }
    }
    

    // 游戏规则
    // 单色棋首先5个连线，根据坐标米字型可以划分为8个区域，(上，下，左，右，左斜上，右斜上，左斜下，右斜下)
    // 判断8个区域中
    // 所以这里使用了棋子的行棋记录，需要取到
    function GameRules (bHistory , wHistory , bChess , wChess){
    

    }

    gb.init(); // 初始化棋盘