

function drawHut(xPos, yPos) { // creates a tree

  var x = xPos * tileSize + camera.x;
  var y = yPos * tileSize + camera.y;

  ctx.fillStyle = "#00cc00"; // leafs
  ctx.fillRect(x, y, tileSize, tileSize);
  ctx.fillStyle = "#83450B"; // trunk
  ctx.fillRect(x + tileSize / 3, y + tileSize / 3, tileSize / 3, tileSize / 3);

}
