objectData = [
        {
          name: "tree",
          drawCall: drawTree,
          sizeX: 1,
          sizeY: 1
        },
        {
          name: "hut",
          drawCall: drawHut,
          sizeX: 1,
          sizeY: 1
        },
        {
          name: "storageCenter",
          drawCall: drawStorage,
          sizeX: 2,
          sizeY: 2
        },
        {
          name: "goldMine",
          drawCall: drawGoldMine,
          sizeX: 1,
          sizeY: 1,
        }
      ];

function createObject(x, y, kind) { // creates an object
  objInfo = objectData[kind];
  mapObjects[y][x] = kind

  for (j = y + 1; j < y + objInfo.sizeY; j++){
    mapObjects[j][x] = -2;
  }

  for (i = x + 1; i < x + objInfo.sizeX; i++){
    mapObjects[y][i] = -2;
  }

}

function drawTree(x, y) { // creates a tree
  ctx.fillStyle = "#b7610b"; // trunk
  ctx.fillRect(x + tileSize / 3, y + tileSize / 3, tileSize / 3, tileSize / 3);
  ctx.fillStyle = "#3ed90f"; // leafs
  ctx.fillRect(x, y, tileSize, tileSize);
}

function drawHut(x, y) { // creates a tree

  ctx.fillStyle = "#eec27f"; // leafs
  ctx.fillRect(x, y, tileSize, tileSize);
  ctx.fillStyle = "#eea359"; // trunk
//  ctx.fillRect(x + tileSize / 3, y + tileSize / 3, tileSize / 3, tileSize / 3);

}

function drawStorage(x, y) { // creates a tree

  ctx.fillStyle = "#eec27f"; // leafs
  ctx.fillRect(x, y, tileSize * 2, tileSize * 2);
  ctx.fillStyle = "#eea359"; // trunk
  ctx.fillRect(x + tileSize / 2, y + tileSize / 2, tileSize, tileSize);

}

function drawGoldMine(x, y) { // creates a tree

  ctx.fillStyle = "#FFD700"; // leafs
  ctx.fillRect(x, y, tileSize, tileSize);

}
