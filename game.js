"use strict"

const levelWidth = 35
const level = 
//234567890123456789012345678901234<-- end
`
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
XXXXXXXXX       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
X       X       X       X       X X
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
`.replace(/X/g, "1").replace(/ /g, "0").replace(/\n/g, "").split("").map(x => parseInt(x))


const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false
const spriteImage = new Image()
spriteImage.src = 'sprites.png'
spriteImage.addEventListener('load', function() {
  start()
}, false)

function drawLevel() {
  const tileSize = 8
  for (let i = 0; i < level.length; i++) {
    const x = (i % levelWidth) + 0.5
    const y = Math.floor(i / levelWidth) + 0.5
    drawSprite(level[i], x * tileSize, y * tileSize)
  }
}

function drawSprite(index, x, y) {
  if (index == 0) return //empty space hack
  const width = 8
  const height = 8
  const scale = 4
  x *= scale
  y *= scale
  ctx.translate(x, y)
	ctx.drawImage(spriteImage, 
		index * width, 0, 
		width, height,
	  -width/2*scale, -height/2*scale,
	  width*scale, height*scale)
	ctx.translate(-x, -y)
}

function start() {
  drawLevel()
}