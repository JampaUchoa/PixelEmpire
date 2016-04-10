$(document).ready(function(){

  var c = document.getElementById("map");
  var ctx = c.getContext("2d");

  height = window.innerHeight;
  width = window.innerWidth;
  size = height * width;
  c.height = height;
  c.width = width;
  tileSize = 40;
  yTiles = Math.floor(height / tileSize) + 1;
  xTiles = Math.floor(width  / tileSize) + 1;

  maps = [
          {
            name: "desert",
            floorColor: "#F6CF87",
            noiseColor: "#EBB754",
            noiseAmmount: 0.05,
          },
          {
            name: "snow",
            floorColor: "#D8DBDC",
            noiseColor: "#ABC8D2",
            noiseAmmount: 0.007,
          },
          {
            name: "forest",
            floorColor: "#4CAF50",
            noiseColor: "#067D0A",
            noiseAmmount: 0.001,
          }
          ]

  currentMap = maps[0];

// Fill map
  ctx.fillStyle = currentMap.floorColor;
  ctx.fillRect(0,0,c.width,c.height);

// Add noise
  noiseAmmount = Math.floor(size * currentMap.noiseAmmount);
  ctx.fillStyle = currentMap.noiseColor;

  for(m = 0; m <= noiseAmmount; m++){
    xRand = rand(0, width);
    yRand = rand(0, height);
    ctx.fillRect(xRand,yRand,1,1);
  }

// Tiling
ctx.lineWidth = 1;
ctx.strokeStyle = currentMap.noiseColor;

  for (y = 0; y <= yTiles; y++){
    for (x = 0; x <= xTiles; x++){
//      ctx.strokeRect(x * tileSize,y * tileSize, tileSize, tileSize);
    }
  }



// Add mines
  goldMinesAmmount = Math.floor(size * 0.000005);
  for (m = 0; m <= goldMinesAmmount; m++){
    xRand = randOffset(0, width, 20);
    yRand = randOffset(0, height, 20);
    goldMineSize = 20 * rand(60, 100) / 100;

    ctx.fillStyle = "#9A9A9A";
    ctx.fillRect(xRand - 1,yRand - 1, goldMineSize + 2, goldMineSize + 2);



    ctx.fillStyle = "#FFEA20";
    ctx.fillRect(xRand,yRand, goldMineSize, goldMineSize);

  }


//Rivers
  xNow = rand(100, width - 100);
  yNow = 0
  cpx = randOffset(0, width, width / 5)
  cpy = randOffset(0, height, height / 5)
  fx = width
  fy = height

  position = rand(0,3)
  switch (position) {
    case 0: // N
      fx = randOffset(0, width, width / 10);
      fy = -20;
      break;
    case 1: // E
      fx = width + 20;
      fy = randOffset(0, height, height / 10);
      break;
    case 2: // S
      fx = randOffset(0, width, width / 10);
      fy = height + 20;
      break;
    case 3: // W
      fx = -20;
      fy = randOffset(0, height, height / 10);
      break;
  }

  ctx.beginPath();
  // Layer 1 - Sand
  ctx.strokeStyle = "#EBB754";
  ctx.moveTo(xNow, -12);
  ctx.lineWidth = 33;
  ctx.quadraticCurveTo(cpx, cpy, fx, fy);
  ctx.stroke();

  // Layer 2 - Shallow Water
  ctx.strokeStyle = "#2F74E2";
  ctx.moveTo(xNow, -12);
  ctx.lineWidth = 30;
  ctx.quadraticCurveTo(cpx, cpy, fx, fy);
  ctx.stroke();

  // Layer 3 - Water
  ctx.strokeStyle = "#0857D6";
  ctx.moveTo(xNow, -12);
  ctx.lineWidth = 25;
  ctx.quadraticCurveTo(cpx, cpy, fx, fy);
  ctx.stroke();


    function getMousePos(canvas, evt) {
      var rect = c.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    c.addEventListener('mousemove', function(evt) {
      var mousePos = getMousePos(c, evt);
      //console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
    }, false);


  function randOffset(min, max, offset) {
      return rand(min + offset, max - offset);
  }

  function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

});
