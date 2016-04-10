$(document).ready(function() {

  var c = document.getElementById("map");
  var ctx = c.getContext("2d");

  biomes = [
          {
            name: "desert",
            floorColor: "#F6CF87",
            noiseColor: "#EBB754",
            noiseAmmount: 0.05,
          },
          {
            name: "forest",
            floorColor: "#4CAF50",
            noiseColor: "#067D0A",
            noiseAmmount: 0.001,
          },
          {
            name: "ocean",
            floorColor: "#0857D6",
            noiseColor: "#458DFF",
            noiseAmmount: 0.001,
          }
        ];
//  object : (xcoord,ycoord,xsubcoord,ysubcoord, objectType)
  tileSize = 20 // zoom ammount
  minTileSize = 10 // min zoom
  maxTileSize = 40 // max zoom

  fpsCount = 0;   // debug benchmark
  fpsElapsed = new Date().getTime();

  adjustScreen(); //set full page

  dragMode = false

  //Map size

  mapHeight = 100;
  mapWidth = 100;
  mapSize = (mapWidth * 2 + 1) * (mapHeight * 2 + 1);

  mapInfo = [] // map terrain information

  camera = { // camera details
    x: Math.floor(canvasWidth / 2),
    y: Math.floor(canvasHeight / 2),
    dx: 0,
    dy: 0
  }

  mousePos = {
    x: 0,
    y: 0
  }


// World generation
  // Initialize world
  worldGenStart = new Date().getTime();

  for (j = -mapHeight; j <= mapHeight; j++){
    mapInfo[j] = []
    for (i = -mapHeight; i <= mapWidth; i++){
      mapInfo[j][i] = -1
    }
  }

  console.log("eee");
  // Create biomes

  queue = [];
  queueSize = 1;
  queue.push([0,0,0]) // enforce center being solid
  // Set first blocks

  for (j = 0; j <= Math.round(mapSize / 10000); j++){
    queue.push([rand(-mapWidth,mapHeight), rand(-mapHeight,mapHeight), rand(0,biomes.length - 1)]);
    queueSize += 1
  }

  // Process world - Biome creation
  shoots = 0
  hit = 0
  miss = 0

  while (true){
    shoots += 1
    tile = queue.shift();
    if (tile == undefined){
      break;
    }
    x = tile[0];
    y = tile[1];
    biome = tile[2];

    if (mapInfo[y][x] != -1){
      miss +=1
      continue;
    }

    hit += 1
    mapInfo[y][x] = biome;

    queueTest(x + 1, y, biome)
    queueTest(x - 1, y, biome)
    queueTest(x, y + 1, biome)
    queueTest(x, y - 1, biome)

  //  queue.push([x + 1, y, biome]);
  //  queue.push([x - 1, y, biome]);
  //  queue.push([x, y + 1, biome]);
  //  queue.push([x, y - 1, biome]);

  }

  function queueTest(x, y, biome){
    if (!(x > mapWidth || y > mapHeight || y < -mapHeight || x < -mapWidth || mapInfo[y][x] != -1)){
      queue.push([x, y, biome]);
    }
  }

  console.log("S=" + shoots + " H=" + hit + " M=" + miss);
  // Minimap render

  var minimap = document.getElementById("minimap");
  var ctxmini = minimap.getContext("2d");

  //minimap.height = (mapHeight * 2 + 1);
  //minimap.width =  (mapWidth * 2 + 1);

  for (j = -mapHeight; j <= mapHeight; j++){
    for (i = -mapWidth; i <= mapWidth; i++){
      ctxmini.fillStyle = biomes[mapInfo[j][i]].floorColor;
      ctxmini.fillRect(i + mapWidth,j + mapHeight, 1,1)
    }
  }

console.log("World generated in "+ (new Date().getTime() - worldGenStart) / 1000 +"s");

// Fps draw

  setInterval(render, 16);

    function render() {// frame update
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      adjustScreen(); // reset screen size
      adjustCamera(); // handles camera movements and boundaries
      drawTerrain(); // draw the terrain
      debug(); // run debug info
    }

    function adjustCamera() {
      camera.x += camera.dx
      camera.y += camera.dy
      if (camera.x > mapWidth * tileSize) {
        camera.x = mapWidth * tileSize;
      }
      else if (camera.x < canvasWidth - (mapWidth + 1) * tileSize) {
        camera.x = canvasWidth - (mapWidth + 1) * tileSize;
      }

      if (camera.y > mapHeight * tileSize) {
        camera.y = mapHeight * tileSize;
      }
      else if (camera.y < canvasHeight - (mapHeight + 1) * tileSize) {
        camera.y = canvasHeight - (mapHeight + 1) * tileSize;
      }
    }

    function debug() {
      $("#debug-draw").text("Draw Calls: "+ drawCalls);
      $("#debug-camera").text("Camera: x ="+ camera.x + " y=" + camera.y);
  //    canvasHeight = c.height = window.innerHeight;
      fpsCount += 1
      if (fpsCount == 62){
        fpsBenchamrk = Math.round(60000 / (new Date().getTime() - fpsElapsed));
        $("#debug-fps").text("FPS: "+ fpsBenchamrk);
        fpsElapsed = new Date().getTime();
        fpsCount = 0;
      }

      $("#debug-cursor").text("Cursor: x ="+ Math.floor(-(camera.x / tileSize) + (mousePos.x / tileSize)) + " y=" + Math.floor(-(camera.y / tileSize) + (mousePos.y / tileSize)));

    }

    function drawTerrain() {

      drawCalls = 0

      startx = -Math.floor(camera.x / tileSize) - 1;
      endx = startx + Math.floor(canvasWidth / tileSize) + 2;

      starty = -Math.floor(camera.y / tileSize) - 1;
      endy = starty + Math.floor(canvasHeight / tileSize) + 2;

      // terrain rendering
      for (j = starty; j < endy; j++){
        for (i = startx; i < endx; i++){

          if (j <= mapHeight && j >= -mapHeight && i <= mapWidth && i >= -mapWidth){
            ctx.fillStyle = biomes[mapInfo[j][i]].floorColor;
          } else {
            ctx.fillStyle = "#3876EC";
          }
          ctx.fillRect(camera.x + (i * tileSize), camera.y + (j * tileSize), tileSize, tileSize);


//          ctx.fillStyle = "#000";
//          ctx.fillText("x:" + i + ", y:" + j,camera.x + (i * tileSize) + 10,camera.y + (j * tileSize) + 20) + 10;

          drawCalls += 1
        }
      }

    }

    //Resize screen and set render size
    //$(window).resize(adjustScreen);
    function adjustScreen(){
      canvasHeight = c.height = window.innerHeight;
      canvasWidth = c.width = window.innerWidth;
      canvasSize = canvasHeight * canvasWidth;
      yTiles = Math.floor(canvasHeight / tileSize);
      xTiles = Math.floor(canvasWidth  / tileSize);
    }

    // Touch controls

    c.addEventListener('touchstart', function(evt){
      dragMode = true;
      dragX = Math.round(evt.changedTouches[0].pageX);
      dragY = Math.round(evt.changedTouches[0].pageY);
      console.log("s");
    }, false);

    c.addEventListener('touchmove', function(evt){
      var rect = c.getBoundingClientRect();
      mousePos.x = Math.round(evt.changedTouches[0].pageX - rect.left),
      mousePos.y = Math.round(evt.changedTouches[0].pageY - rect.top)
      clickDrag(mousePos)
      console.log(mousePos);
    }, false);

    // Mouse operations

    c.addEventListener('mousemove', function(evt) {
      var rect = c.getBoundingClientRect();
        mousePos.x = evt.clientX - rect.left,
        mousePos.y = evt.clientY - rect.top
      if (dragMode){
        clickDrag(mousePos)
      }
      else {
        edgePan(mousePos);
      }
    }, false);

  function clickDrag(mousePos){
      camera.x += mousePos.x - dragX;
      dragX = mousePos.x;
      camera.y += mousePos.y - dragY;
      dragY = mousePos.y;
  }

  //Middle click drag

  $(c).on('mousedown', function(e) {
     if( e.which == 2 ) {
        e.preventDefault();
        dragMode = true;
        dragX = mousePos.x;
        dragY = mousePos.y;
        c.className = "move";
     }
  });

  $(c).on('mouseup', function(e) {
     if( e.which == 2 ) {
        e.preventDefault();
        dragMode = false;
        c.className = "";
     }
  });

  // Border camera moving

  function edgePan(mousePos){

    if (mousePos.x < (canvasWidth / 20)) {
      camera.dx = 13;
    } else if (mousePos.x > (canvasWidth * 19 / 20)) {
      camera.dx = -13;
    } else {
      camera.dx = 0;
    }

    if (mousePos.y < (canvasHeight / 20) + 50) {
      camera.dy = 13;
    } else if (mousePos.y > (canvasHeight * 19 / 20)) {
      camera.dy = -13;
    } else {
      camera.dy = 0;
    }

  }

  // Camera zoom
  $(c).on('wheel', function(e) {

  	var delta = e.originalEvent.deltaY;
    tileSize -= Math.floor(delta / 10);
    if (tileSize > maxTileSize) {
      tileSize = maxTileSize
    } else if (tileSize < minTileSize) {
      tileSize = minTileSize;
    }
  });

  function createTree(x, y) { // creates a tree
    ctx.fillStyle = "#00cc00"; // leafs
    ctx.fillRect(x, y, tileSize / 4, tileSize / 4);
    ctx.fillStyle = "#83450B"; // trunk
    ctx.fillRect(x + tileSize / 12, y + tileSize / 12, tileSize / 12, tileSize / 12);
  }

  function randomSeed(seed, max) {
      var x = Math.sin(seed++) * 10000;
      var value = x - Math.floor(x);
      return Math.floor(value * (max + 1));
  }

  function randOffset(min, max, offset) {
      return rand(min + offset, max - offset);
  }

  function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

});
