// 游戏变量
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 小鸟对象
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jump: -10,
    color: '#ff0'
};

// 管道对象
const pipes = [];
const pipeWidth = 60;
const pipeGap = 150;
const pipeSpeed = 2;
let pipeTimer = 0;
const pipeInterval = 1500;

// 游戏状态
let score = 0;
let gameOver = false;
let gameStarted = false;

// 控制小鸟跳跃
function handleJump() {
    if (!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(update);
    }
    if (gameOver) {
        resetGame();
        requestAnimationFrame(update);
        return;
    }
    bird.velocity = bird.jump;
}

function resetGame() {
    // 重置游戏状态
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    pipeTimer = 0;
    requestAnimationFrame(update);
}

// 生成管道
function createPipe() {
    const gapPosition = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
        x: canvas.width,
        topHeight: gapPosition,
        bottomY: gapPosition + pipeGap,
        passed: false
    });
}

// 更新游戏状态
function update() {
    if (gameOver) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新小鸟位置
    if (gameStarted) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
    }

    // 绘制小鸟
    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // 生成管道
    pipeTimer += 16;
    if (pipeTimer > pipeInterval) {
        createPipe();
        pipeTimer = 0;
    }

    // 更新和绘制管道
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.x -= pipeSpeed;

        // 绘制上管道
        ctx.fillStyle = '#0f0';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        
        // 绘制下管道
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);

        // 检测碰撞
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
        ) {
            gameOver = true;
        }

        // 计分
        if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
            pipe.passed = true;
            score++;
        }

        // 移除屏幕外的管道
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }

    // 检测边界碰撞
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    // 显示分数
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // 游戏开始提示
    if (!gameStarted) {
        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('点击屏幕开始游戏', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'left';
    }

    // 游戏结束提示
    if (gameOver) {
        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('点击屏幕重新开始', canvas.width / 2, canvas.height / 2 + 70);
        ctx.textAlign = 'left';
    }

    // 请求下一帧
    requestAnimationFrame(update);
}

// 事件监听
canvas.addEventListener('click', () => {
    if (gameOver) {
        // 重置游戏
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        pipes.length = 0;
        score = 0;
        gameOver = false;
        gameStarted = false;
    } else {
        handleJump();
    }
});

// 开始游戏
update();