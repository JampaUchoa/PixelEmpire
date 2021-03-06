$(document).ready(function() {

  c = document.getElementById("map");
  ctx = c.getContext("2d");

  tileSize = 20 // zoom ammount
  minTileSize = 4 // min zoom
  maxTileSize = 40 // max zoom

  fpsCount = 0;   // debug benchmark
  fpsElapsed = new Date().getTime();

  adjustScreen(); //set full page

  dragMode = false
  placementMode = 0
  placementLegal = false
  //Map size

  mapHeight = 300;
  mapWidth = 300;
  mapSize = (mapWidth * 2 + 1) * (mapHeight * 2 + 1);

  mapTerrain = [] // map terrain information
  mapObjects = [] // map object information

  camera = { // camera details
    x: Math.floor(canvasWidth / 2),
    y: Math.floor(canvasHeight / 2),
    dx: 0,
    dy: 0
  }

  viewport = {
    x: {
      begin: 0,
      end: 0
    },
    y: {
      begin: 0,
      end: 0
    }
  }

  mousePos = {
    x: 0,
    y: 0,
    absX: 0,
    absY: 0
  }

  terrainData = [
          {
            name: "forest",
            floorColor: "#4CAF50",
            noiseColor: "#067D0A",
            noiseAmmount: 0.001,
          },
          {
            name: "desert",
            floorColor: "#F6CF87",
            noiseColor: "#EBB754",
            noiseAmmount: 0.05,
          },
          {
            name: "ocean",
            floorColor: "#0857D6",
            noiseColor: "#458DFF",
            noiseAmmount: 0.001,
          },
          {
            name: "beach",
            floorColor: "#F6DFA7",
            noiseColor: "#458DFF",
            noiseAmmount: 0.001,
          }
        ];

  biomeForest = 0;
  biomeDesert = 1;
  biomeOcean = 2;
  biomeBeach = 2;
  biomeNull = -1;

// World generation
  // Initialize world
  worldGenStart = new Date().getTime();

  for (j = -mapHeight; j <= mapHeight; j++){
    mapTerrain[j] = [];
    mapObjects[j] = [];
    for (i = -mapHeight; i <= mapWidth; i++){
      mapTerrain[j][i] = 2;
      mapObjects[j][i] = -1;
    }
  }

  falloff = 0.9975;
  seed(0,0,1);

  // Set up seed blocks
  for (j = 0; j <= Math.round(mapSize / 15000); j++){
//    seed(rand(-mapWidth,mapWidth), rand(-mapHeight,mapHeight), 1);
  }

  function seed(x, y, probability) {
    if (nearbyCount(x, y, biomeOcean) >= 1 || terrainAt(x,y) == biomeOcean){
      if (probability > Math.random()){
        mapTerrain[y][x] = biomeForest;
        seed(x, y + 1, probability * falloff);
        seed(x, y - 1, probability * falloff);
        seed(x + 1, y, probability * falloff);
        seed(x - 1, y, probability * falloff);
        seed(x - 1, y - 1, probability * falloff);
        seed(x + 1, y - 1, probability * falloff);
        seed(x + 1, y + 1, probability * falloff);
        seed(x - 1, y + 1, probability * falloff);
      } else {
        mapTerrain[y][x] = biomeForest
      }
    }
  }

  function boundaryCheck(x, y) {
    return (x < mapWidth && y < mapHeight && y > -mapHeight && x > -mapWidth);
  }

  function terrainAt(x, y) {
    if (mapTerrain[y]){
      return mapTerrain[y][x];
    } else {
      return undefined;
    }
  }

  function nearby(x, y) {
    return [terrainAt(x - 1, y - 1),
            terrainAt(x, y - 1),
            terrainAt(x + 1, y - 1),
            terrainAt(x - 1, y),
            terrainAt(x + 1, y),
            terrainAt(x - 1, y + 1),
            terrainAt(x, y + 1),
            terrainAt(x + 1, y + 1),
    ];
  }

  function nearbyCount(x, y, biome) {
    var near = nearby(x, y);
    var count = 0
    for (var i = 0; i < near.length; i++) {
      if (near[i] == biome) {
        count++;
      }
    }
    return count;
  }

  for (var y = -mapHeight; y <= mapHeight; y++){
    for (var x = -mapHeight; x <= mapWidth; x++){
      // Dry up the land
      if (terrainAt(x,y) == biomeOcean && nearbyCount(x, y, biomeOcean) <= 3) {
        mapTerrain[y][x] = biomeForest;
      }
    }
  }

  for (var y = -mapHeight; y <= mapHeight; y++){
    for (var x = -mapHeight; x <= mapWidth; x++){
      // Dry up the land
      if (terrainAt(x,y) == biomeOcean && nearbyCount(x, y, biomeOcean) <= 1) {
        mapTerrain[y][x] = biomeForest;
      }
    }
  }

  for (var y = -mapHeight; y <= mapHeight; y++){
    for (var x = -mapHeight; x <= mapWidth; x++){
      // Making beaches
      if (mapTerrain[y][x] == biomeForest && nearbyCount(x, y, biomeOcean) >= 1) {
        mapTerrain[y][x] = biomeDesert;
      }
    }
  }

/*
  // Create terrainData
  queue = [];
  queue.push([0,0,0]) // enforce spawn area being a forest



  // Spread the blocks to make biomes
  shoots = 0
  hit = 0
  miss = 0

  while (true){
    shoots += 1
    tile = queue.shift();
    if (tile == undefined){
      break;
    }
    var x = tile[0];
    var y = tile[1];
    var biome = tile[2];

    if (mapTerrain[y][x] != -1){
      miss +=1
      continue;
    }

    hit += 1
    mapTerrain[y][x] = biome;

    if (biome == 0 && Math.random() > 0.99){
      mapObjects[y][x] = 0;
    }

    if (biome != 2 && Math.random() > 0.999){
      mapObjects[y][x] = 3;
    }

    queueTest(x + 1, y, biome)
    queueTest(x - 1, y, biome)
    queueTest(x, y + 1, biome)
    queueTest(x, y - 1, biome)

  }

  function queueTest(x, y, biome){ // check if legal and untouched
    if (!(x > mapWidth || y > mapHeight || y < -mapHeight || x < -mapWidth || mapTerrain[y][x] != -1)){
      queue.push([x, y, biome]);
    }
  }

  // Debug info
  console.log("S=" + shoots + " H=" + hit + " M=" + miss);

*/


  console.log("World generated in "+ (new Date().getTime() - worldGenStart) / 1000 +"s");

  // Game Initialize

  mapObjects[5][5] = mapObjects[-5][5] = mapObjects[5][-5] = mapObjects[-5][-5] = 1;
  mapObjects[-1][-1] = 2;
  // Frame draw
  setInterval(render, 16);

  function render() {// frame update
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    adjustCamera(); // handles camera movements and boundaries
    drawTerrain(); // draw the terrain
    debug(); // run debug info
  }

  setInterval(drawMinimap, 1000);

  function adjustCamera() {
    // Move camera
    camera.x += camera.dx
    camera.y += camera.dy
    //Set boundaries
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

    // Set viewport
    viewport.x.begin = -Math.ceil(camera.x / tileSize);
    viewport.x.end = viewport.x.begin + Math.ceil(canvasWidth / tileSize);
    viewport.x.center = Math.round((viewport.x.end - viewport.x.begin) / 2 + viewport.x.begin);

    viewport.y.begin = -Math.ceil(camera.y / tileSize);
    viewport.y.end = viewport.y.begin + Math.ceil(canvasHeight / tileSize);
    viewport.y.center = Math.round((viewport.y.end - viewport.y.begin) / 2 + viewport.y.begin);

    if (placementMode){
      var objInfo = objectData[placementMode];
      var x = mousePos.absX * tileSize + camera.x;
      var y = mousePos.absY * tileSize + camera.y;
      objInfo.drawCall(x, y);
      ctx.globalAlpha= 0.5;
      ctx.globalCompositeOperation = "source-over";
      if (placementLegal) {
        ctx.fillStyle = "green";
        ctx.fillRect(x, y, objInfo.sizeX * tileSize, objInfo.sizeY * tileSize);
      } else {
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, objInfo.sizeX * tileSize, objInfo.sizeY * tileSize);
      }
      ctx.globalAlpha= 1;
    }
  }

    function debug() {
      $("#debug-draw").text("Draw Calls: "+ drawCalls);
      $("#debug-camera").text("Camera: x ="+ camera.x + " y=" + camera.y);
      fpsCount += 1
      if (fpsCount == 62){
        fpsBenchamrk = Math.round(60000 / (new Date().getTime() - fpsElapsed));
        $("#debug-fps").text("FPS: "+ fpsBenchamrk);
        fpsElapsed = new Date().getTime();
        fpsCount = 0;
      }
      $("#debug-cursor").text("Cursor: x ="+ mousePos.absX + " y=" + mousePos.absY);
    }

    function drawTerrain() {
      var previousColor;
      var colorStreak;
      var streakStart;
      drawCalls = 0
      // terrain rendering
      for (j = viewport.y.begin; j <= viewport.y.end; j++){
        for (i = viewport.x.begin; i <= viewport.x.end; i++){
          if (j <= mapHeight && j >= -mapHeight && i <= mapWidth && i >= -mapWidth){ // If legal

            // Terrain draw
            ctx.globalCompositeOperation = "destination-over";
            tileColor = terrainData[mapTerrain[j][i]].floorColor;
            if (tileColor == previousColor){ // this pixel is equal to prevous pixel
              colorStreak += 1; // Add to the streak
            } else {// this is a new pixel
              ctx.fillStyle = previousColor; // set the color
              ctx.fillRect(camera.x + (streakStart * tileSize), camera.y + (j * tileSize), colorStreak * tileSize, tileSize); // render row of prevous pixels
              colorStreak = 1; // Initialize a new streak
              streakStart = i; // start here
              previousColor = tileColor;
              drawCalls += 1 // increase drawcall (debug);
            }

            if (mapObjects[j][i] >=  0){
              //Set relative rendering positioning
  //            ctx.globalCompositeOperation = "source-over";
              var x = i * tileSize + camera.x;
              var y = j * tileSize + camera.y;
              //console.log(mapObjects[j][i]);
              objectData[mapObjects[j][i]].drawCall(x, y);
            }

          }
          if (i == (viewport.x.end)){
            // Closing terrain drawing
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = previousColor;
            ctx.fillRect(camera.x + (streakStart * tileSize), camera.y + (j * tileSize), colorStreak * tileSize, tileSize); // render row of prevous pixels
            previousColor = colorStreak = streakStart = undefined; // reset info
          }
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }

  function drawMinimap() { //LAGGY
    var cmini = document.getElementById("minimap");
    var ctxmini = cmini.getContext("2d");
    var x = 0;
    var y = 0;

    for (j = viewport.y.center - 100; j <= viewport.y.center + 100; j++){
      for (i = viewport.x.center - 100; i <= viewport.x.center + 100; i++){
        if (j <= mapHeight && j >= -mapHeight && i <= mapWidth && i >= -mapWidth){
          tileColor = terrainData[mapTerrain[j][i]].floorColor;
        } else {
          tileColor = "#3876EC";
        }
        ctxmini.fillStyle = tileColor;
        ctxmini.fillRect(x, y, 1, 1); // render row of prevous pixels
        x += 1;
      }
      x = 0;
      y += 1;
    }
  }

    //Resize screen and set render size
  $(window).resize(adjustScreen);
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
      mousePos.x = evt.clientX - rect.left;
      mousePos.y = evt.clientY - rect.top;
      mousePos.absX = Math.floor((mousePos.x - camera.x) / tileSize);
      mousePos.absY = Math.floor((mousePos.y - camera.y) / tileSize);
    if (dragMode){
      clickDrag(mousePos)
    }
    else {
      //edgePan(mousePos);
    }

    if (placementMode){
      var objInfo = objectData[placementMode]
      placementLegal = true

      for (j = mousePos.absY; j < mousePos.absY + objInfo.sizeY; j++){
        for (i = mousePos.absX; i < mousePos.absX + objInfo.sizeX; i++){
          if (mapObjects[j][i] != -1){
            placementLegal = false;
            break;
          }
        }
      }
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
    if(e.which == 1 && placementMode != 0 && placementLegal) {
      createObject(mousePos.absX,mousePos.absY, placementMode);
    }
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
