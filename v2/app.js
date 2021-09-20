
// make 20 * 20 board games

// You can change the size here
const widthAndHeight = 25;
const pixelSize = '15px';

const snake = {
   stack: 2, // stack + 1 = the length of the snake
   body: [],
   moving: undefined,
   go: 1,
   // speed is in milliseconds per each step or move
   speed: {
      normal: 350,
      max: 80
   },
   maxLength: Math.ceil(Math.pow(widthAndHeight, 2) * 0.4),
   score: 0,
   status: 0 // 0 : not moved yet, 1 : moved 1 box or 1 pixel
}

Object.freeze(snake.speed);
Object.freeze(snake.maxLength);

   ///////  snake.status ///////
// prevent from users when they pressed multiple keys at the same time
// If not including status, it usually game over even it should not be


const container = document.getElementById('container');
const startbtn = document.getElementById('start');
const score = document.getElementById('score');
let pixel;

startbtn.onclick = newGame;


container.style.width = `${widthAndHeight * parseInt(pixelSize)}px`;
container.style.height = `${widthAndHeight * parseInt(pixelSize)}px`;

function removeAllChildren(element){
   while (element.firstChild) {
     element.removeChild(element.firstChild);
   }
}

function newBoard(){
   clearInterval(snake.moving);
   removeAllChildren(container);
   for(let i = 0; i < widthAndHeight; i++){
      for(let j = 0; j < widthAndHeight; j++){
         const pixelBox = document.createElement('div');
         pixelBox.classList.add('pixel')
         pixelBox.style.width = pixelSize;
         pixelBox.style.height = pixelSize;
         container.appendChild(pixelBox);
      }
   }
   snake.stack = 2;
   snake.body = [];
   snake.moving = undefined;
   snake.go = 1;
   snake.score = 0;
}
newBoard();


function newGame(){
   newBoard();
   pixel = document.getElementsByClassName('pixel');
   //console.log(pixel);
   createSnake();

   score.innerText = snake.score.toString();

   setTimeout(() => {
         snake.moving = setInterval(startGame, snake.speed.normal);
      }, 500
   )
}

function createSnake(){
   pixel[0].classList.add('snake');
   pixel[0].classList.add('head');
   snake.body.push(0);
}

function startGame(){

   moveSnake();
   snake.status = 0;
   
   createRandomApple();

   drawSnake();
   //console.log(snake.body);
   score.innerText = snake.score.toString();

   clearInterval(snake.moving);
   
   changeSpeed();

   checkHits();
}

function moveSnake(){

      if(snake.stack > 0 && snake.body.length < snake.maxLength){
         snake.stack--;
      }else {
         const tail = snake.body.shift();
         pixel[tail].classList.remove('snake');
      }

   movingPosition();

         if(
            pixel[snake.body[snake.body.length - 1]].classList.contains('apple')
         ){
            pixel[snake.body[snake.body.length - 1]].classList.remove('apple');
            snake.stack++;
            snake.score++;
         }

   
}

function movingPosition(){
   const head = snake.body[snake.body.length - 1];
   if(head % widthAndHeight === 0 && snake.go === -1)
      snake.body.push(head + widthAndHeight - 1);

   else if(head % widthAndHeight === widthAndHeight - 1 && snake.go === 1)
      snake.body.push(head + 1 - widthAndHeight);

   else if( widthAndHeight * (widthAndHeight - 1) <= head && 
            head < Math.pow(widthAndHeight, 2) &&
            snake.go === widthAndHeight)
      snake.body.push(head - (widthAndHeight * (widthAndHeight - 1)));

   else if(0 <= head && head < widthAndHeight && snake.go === -widthAndHeight)
      snake.body.push(head + (widthAndHeight * (widthAndHeight -1)));

   else snake.body.push(head + snake.go);
}

function createRandomApple(){
   if(!alreadyHadAnApple()){
      const random = Math.floor(Math.random() * Math.pow(widthAndHeight, 2));

         if(snake.body.includes(random)){
            createRandomApple();
         }
         else pixel[random].classList.add('apple');
   }
}

function drawSnake(){
   for(const i of snake.body){
      pixel[i].classList.add('snake');
      pixel[i].classList.remove('head');
   }
   pixel[snake.body[snake.body.length - 1]].classList.add('head');
}

function changeSpeed(){
   let speed;
   snake.speed.normal - (snake.score * 10) <= snake.speed.max ?
      speed = snake.speed.max
   :
      speed = snake.speed.normal - (snake.score * 10);

   snake.moving = setInterval(startGame, speed);
}

function checkHits(){
   const head = snake.body[snake.body.length - 1];
   let copyOfSnake = [...snake.body];
   copyOfSnake.pop();
   
   const isOverlap = copyOfSnake.includes(head);

   if(isOverlap){
      pixel[head].classList.add('overlap');
      clearInterval(snake.moving);
      setTimeout(()=>alert('game over'), 400);
   }
}

function alreadyHadAnApple(){
   for(const i of pixel){
      if(i.classList.contains('apple')){
         return true;
      }
   }
   return false;
}


document.onkeydown = (e) => {
   if(snake.status === 0){
      if(e.key === 'ArrowRight' && snake.go !== -1){
         snake.go = 1;
         snake.status++;
      }else if(e.key === 'ArrowLeft' && snake.go !== 1){
         snake.go = -1;
         snake.status++;
      }else if(e.key === 'ArrowDown' && snake.go !== -widthAndHeight){
         snake.go = widthAndHeight;
         snake.status++;
      }else if(e.key === 'ArrowUp' && snake.go !== widthAndHeight){
         snake.go = -widthAndHeight;
         snake.status++;
      }
   }
}
