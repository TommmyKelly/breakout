const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

//create ball props
const ball = {
    x: canvas.width /2,
    y: canvas.height /2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
} 

// Create paddle and props

const paddle = {
    x: canvas.width / 2 -40,
    y: canvas.height - 30,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
}

//create bricks props

const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetx: 45,
    offseyy: 60,
    visible: true
}

//create bricks
const bricks =[]
for(let i = 0; i < brickRowCount; i++){
    bricks[i] = [];
    for(let j = 0; j < brickColumnCount; j++){
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetx;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offseyy;
        bricks[i][j] = { x, y, ...brickInfo }
    }
}

// draw ball on the canvas

function drawBall (){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI *2)
    ctx.fillStyle = '#0095dd'
    ctx.fill();
    ctx.closePath();
}

// draw paddel on cavans

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x,paddle.y,paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd'
    ctx.fill();
    ctx.closePath();
}


//draw score on canvas
function drawScore() {
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${score}`,canvas.width - 100 , 30)
}
// draw bricks on canvas
function drawBricks(){
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

function draw() {

    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawBall()
    drawPaddle()
    drawScore()
    drawBricks()
    }

    //move paddle
    function movePaddel (){
        paddle.x += paddle.dx;
        // wall dectionn

        if(paddle.x  + paddle.w > canvas.width){
            paddle.x = canvas.width - paddle.w
        }
        if(paddle.x < 0){
            paddle.x = 0
        }
    }
    //move ball

    function moveBall(){
        ball.x += ball.dx;
        ball.y += ball.dy

        //wall colloisin (right to left)
        if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
            ball.dx *= -1
        }
        //wall colloisin (right to left)
        if(ball.y + ball.size > canvas.height || ball.y- ball.size < 0){
            ball.dy *= -1
        }
        //paddel collision
        if(ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w
            && ball.y + ball.size > paddle.y){
            ball.dy = -ball.speed
        }


        //bricks collision 

        
        // Brick collision
        bricks.forEach(column => {
            column.forEach(brick => {
            if (brick.visible) {
                if (
                ball.x - ball.size > brick.x && // left brick side check
                ball.x + ball.size < brick.x + brick.w && // right brick side check
                ball.y + ball.size > brick.y && // top brick side check
                ball.y - ball.size < brick.y + brick.h // bottom brick side check
                ) {
                ball.dy *= -1;
                brick.visible = false;

                increaseScore();
                }
            }
            });
        });
        //hit bottom wall
     if(ball.y  + ball.size > canvas.height){
        showAllBricks();
        score = 0;
     }   
                
}

//increse score 

function increaseScore(){
    score ++;
    if(score % (brickRowCount * brickColumnCount) === 0){
        showAllBricks();
    }
}

// make all bricks visable
function showAllBricks(){
    bricks.forEach(column =>{
        column.forEach(brick =>{
            brick.visible = true
        })
    })
}


//update canva

function update (){
    movePaddel();
    moveBall();
    //draw everything
    draw();

    requestAnimationFrame(update);
}

update()

//key events

function keyDown (e){
   
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx = paddle.speed;
    }else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }

}

function keyUp(e){
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx = 0;
    }else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }


}

// keyboard events

document.addEventListener('keydown',keyDown)
document.addEventListener('keyup',keyUp)

rulesBtn.addEventListener('click', () =>{
    rules.classList.add('show')
})

closeBtn.addEventListener('click', () =>{
    rules.classList.remove('show')
})
