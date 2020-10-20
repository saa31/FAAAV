const background = document.getElementById("background");
const ctx_b = background.getContext("2d");
const playerCanvas = document.getElementById("player");
const ctx_p = playerCanvas.getContext("2d");
const wallImage = document.querySelector(".wallImage");
const playerImage = document.querySelector(".player");

const maze1 = [
  ["tlw", "tw", "tw", "tw", "tw", "tw", "tw", "tw", "tw", "trw"],
  ["lw", "tlp", "tp", "tp", "tp", "tp", "tp", "tp", "trp", "rw"],
  ["lw", "lp", "p", "p", "p", "p", "p", "p", "rp", "rw"],
  ["lw", "lp", "p", "p", "p", "p", "p", "p", "rp", "rw"],
  ["lw", "lp", "p", "p", "p", "p", "p", "p", "rp", "rw"],
  ["lw", "lp", "p", "p", "p", "p", "p", "p", "rp", "rw"],
  ["lw", "lp", "p", "p", "p", "p", "p", "p", "rp", "rw"],
  ["lw", "lp", "p", "p", "p", "p", "p", "p", "rp", "rw"],
  ["lw", "blp", "bp", "bp", "bp", "bp", "bp", "bp", "brp", "rw"],
  ["blw", "bw", "bw", "bw", "bw", "bw", "bw", "bw", "bw", "brw"],
];

const wall = {
  img: wallImage,
  sx: 0,
  sy: 0,
  swidth: 16,
  sheight: 16,
  x: 0,
  y: 0,
  width: 80,
  height: 80,
};

const player = {
  img: playerImage,
  sx: 0,
  sy: playerTile.down,
  swidth: 64,
  sheight: 31,
  x: playerCanvas.width / 2,
  y: playerCanvas.height / 2,
  width: 120,
  height: 60,
  framex: 3,
  framey: 4,
  speed: 5
}

function drawMaze(img, sx, sy, swidth, sheight, x, y, width, height, maze) {
  maze.forEach((i, indexi) => {
    i.forEach((j, indexj) => {
      for (const [key, value] of Object.entries(mazeTile)) {
        if(key == j){
          sx = value.sx;
          sy = value.sy;
          break;
        }
      }
      x = indexj * maze[0].length*(background.width/100);
      y = indexi * maze.length*(background.height/100);
      ctx_b.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
    });
  });

  ctx_b.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
}

let cutCircle = function (x, y, radius) {
  ctx_b.globalCompositeOperation = 'destination-in'
  let innerCircle = radius-150;
  let outerCircle = radius-50;
  let grd = ctx_b.createRadialGradient(x, y, innerCircle, x, y, outerCircle);
  grd.addColorStop(0, "black");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx_b.fillStyle = grd;
  ctx_b.beginPath();
  ctx_b.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx_b.closePath();
  ctx_b.fill();
};

function drawPlayer(img, sx, sy, swidth, sheight, x, y, width, height){
  ctx_p.drawImage(img, sx, sy, swidth, sheight, x-width/2, y-height/2, width, height);
}

const draw = () => {
  drawMaze(
    wall.img,
    wall.sx,
    wall.sy,
    wall.swidth,
    wall.sheight,
    wall.x,
    wall.y,
    wall.width,
    wall.height,
    maze1
  );
  
  drawPlayer(
    player.img,
    player.sx,
    player.sy,
    player.swidth,
    player.sheight,
    player.x,
    player.y,
    player.width,
    player.height
  );
};

function collisionDetection(){
  if(player.x < wall.width+player.swidth-30){
    player.x = wall.width+player.swidth-30;
  }
  else if(player.x > playerCanvas.width-(wall.width+player.swidth-30)){
    player.x = playerCanvas.width-(wall.width+player.swidth-30);
  }
  else if(player.y < wall.height+player.sheight-30){
    player.y = wall.height+player.sheight-30;
  }
  else if(player.y > playerCanvas.height-(wall.height+player.sheight+8)){
    player.y = playerCanvas.height-(wall.height+player.sheight+8);
  }
}

let isShooting = false;
function shoot(){
  counter = 4;
  player.sx = player.swidth * counter;
  let interval = setInterval(()=>{
    if(counter == 13){
      isShooting =  false;
      clearInterval(interval);
    }
    player.sx = (player.sx + player.swidth) % (player.swidth * 12);
    counter++;
  }, 50)
}

// Code from Frank's Laboratory
let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimate(fps){
  fpsInterval = 1000/fps
  then = Date.now()
  startTime = then
  update()
}

function update(){
  requestAnimationFrame(update)
  now = Date.now()
  elapsed = now - then
  if(elapsed > fpsInterval){
    then = now - (elapsed % fpsInterval)
    ctx_b.globalCompositeOperation = 'source-over'
    ctx_p.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    collisionDetection();
    draw();
    cutCircle(player.x, player.y, 300);
  }
}

startAnimate(20)


function keyHandlerDown(e){
  const key = e.key;
  if(!isShooting){
    switch(key){
      case "ArrowUp":
        player.sy = playerTile.top;
        player.sx = (player.sx + player.swidth) % (player.swidth * player.framex);
        player.y -= player.speed;
        break;
      case "ArrowDown":
        player.sy = playerTile.down;
        player.sx = (player.sx + player.swidth) % (player.swidth * player.framex);
        player.y += player.speed;
        break;
      case "ArrowLeft":
        player.sy = playerTile.left;
        player.sx = (player.sx + player.swidth) % (player.swidth * player.framex);
        player.x -= player.speed;
        break;
      case "ArrowRight":
        player.sy = playerTile.right;
        player.sx = (player.sx + player.swidth) % (player.swidth * player.framex);
        player.x += player.speed;
        break;
      case " ":
        isShooting = true
        shoot();
    }                                 
  }
}

function keyHandlerUp(e){
  const key = e.key;
  if(key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight"){
    player.sx = 64;
  }
}

document.addEventListener('keydown', keyHandlerDown)
document.addEventListener('keyup', keyHandlerUp)