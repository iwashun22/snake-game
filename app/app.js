
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
   let speed;
   snake.speed.normal - (snake.score * 10) <= snake.speed.max ?
      speed = snake.speed.max
   :
      speed = snake.speed.normal - (snake.score * 10);

   snake.moving = setInterval(startGame, speed);

   checkHits();
}

function moveSnake(){
   const head = snake.body[snake.body.length - 1];

   // check if the snake goes off the map
   if(0 <= head && head < Math.pow(widthAndHeight, 2)){
      if(snake.stack > 0 && snake.body.length < snake.maxLength){
         snake.body.push(head + snake.go)
         snake.stack--;
      }else {
         snake.body.push(head + snake.go);
         const tail = snake.body.shift();
         pixel[tail].classList.remove('snake');
      }

         if(
            pixel[snake.body[snake.body.length - 1]].classList.contains('apple')
         ){
            pixel[snake.body[snake.body.length - 1]].classList.remove('apple');
            snake.stack++;
            snake.score++;
         }

   }else {
      clearInterval(snake.moving);
      pixel[snake.body[snake.body.length - 2]].classList.add('overlap');
      setTimeout(()=>alert('game over'), 300);
   }


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

function checkHits(){
   const head = snake.body[snake.body.length - 1];
   const neck = snake.body[snake.body.length - 2];
   let copyOfSnake = [...snake.body];
   copyOfSnake.pop();
   
   const isOverlap = copyOfSnake.includes(head);

   if(isOverlap){
      pixel[head].classList.add('overlap');
      clearInterval(snake.moving);
      setTimeout(()=>alert('game over'), 400);
   }else if(
      (neck % widthAndHeight === widthAndHeight - 1 && snake.go === 1) ||
      (neck % widthAndHeight === 0 && snake.go === -1)
   ){
      pixel[head].classList.remove('snake');
      pixel[head].classList.remove('head');
      pixel[neck].classList.add('overlap');
      clearInterval(snake.moving);
      setTimeout(()=>alert('game over'), 100);
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
