"use strict"

const levelWidth = 35
const level = 
//234567890123456789012345678901234<-- end
`
X       X       X       X         X
X       X       X       X         X
X       X       X       X         X
XXXXXXXXX       X       X         X
X       X       X       X         X
X       X       X       X         X
X       X       X       X         X
X       X       X       X         X
X       X       X       X         X
X       X                         X
X                                 X
X                                 X
X                                 X
X                       XXXXXXXXX X
X                       X       X X
XXXXXXXXX       XXXXXXXXX       X X
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

const keys = {up: false, left: false, right: false}

function switchKey(key, state) {
	switch (key) {
		case 'ArrowLeft':
    case 'a':
      keys.left = state
      break
    case 'ArrowRight':
    case 'a':
      keys.right = state
      break
    case 'ArrowUp':
    case 'w':
      keys.up = state
      break
	}
}

window.addEventListener("keydown", function (e) {
  switchKey(e.key, true)
})

window.addEventListener("keyup", function (e) {
  switchKey(e.key, false)
})

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

const player = {
  pos: {x: 30, y: 60},
  vel: {x: 0, y: 0}
}

function start() {
  tick()
}

function tick() {
  if (keys.right) player.vel.x += 0.1
  if (keys.left) player.vel.x -= 0.1
  if (keys.up) player.vel.y -= 0.1
  player.vel.y += 0.01
  player.pos.x += player.vel.x
  player.pos.y += player.vel.y
  draw()
}

function draw() {
  drawLevel()
  drawSprite(2, player.pos.x, player.pos.y)
  requestAnimationFrame(tick)
}