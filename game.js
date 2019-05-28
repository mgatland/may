"use strict"

import {editor} from "/editor.js"

const scale = 4
const levelWidth = 35
const levelHeight = 20
const tileSize = 8
let frame = 0
const roomSrc =

{"0x0":[1,1,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,10,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,25,1,2,0,7,1,1,0,25,1,2,0,33,1,2,0,27,3,1,0,5,1,2,0,2,1,6,0,1,1,1,0,13,1,9,0,1,1,2,0,9,1,2,0,7,3,1,0,1,6,1,0,2,1,1,0,7,1,1,0,1,1,10,0,2,1,3,0,2,1,9,0,7,1,1,0,1,1,2,0,7,1,6,0,2,1,1,0,7,1,1,0,7,1,1,0,1,1,2,0,6,1,8,0,1,1,1,0,7,1,1,0,7,1,1,0,1,1,2,0,5,1,12,0,6,1,1,0,7,1,1,0,1,1,36],"1x0":[1,1,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,10,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,25,1,2,0,7,1,1,0,25,1,2,0,33,1,2,0,27,3,1,0,5,1,2,0,23,1,9,0,1,1,2,0,18,3,1,0,1,6,1,0,2,1,1,0,7,1,1,0,1,1,10,0,7,1,9,0,7,1,1,0,1,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,7,1,1,0,1,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,7,1,1,0,1,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,7,1,1,0,1,1,36]}

const rooms = Object.assign({}, ...Object.keys(roomSrc).map(key => ({[key]: editor.rleDecode(roomSrc[key])})));

const location = {x: 0, y: 0, toString: function () {return this.x + "x" + this.y}}

function getRoom(location) {
  return rooms[location.toString()]
}

let level = getRoom(location)



const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false
const spriteImage = new Image()
spriteImage.src = 'sprites.png'
spriteImage.addEventListener('load', function() {
  start()
}, false)

editor.startEditor(canvas, scale, rooms, levelWidth, tileSize)
editor.setLevel(level)

function drawLevel() {
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
    case 'd':
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
  if (index == 3 && frame > 40) index++ //animated bird hack
  if (index == 6 && frame > 30) index++ //animated flower hack
  const width = 8
  const height = 8
  x *= scale
  y *= scale
  ctx.translate(x, y)

  const sX = (index % 16) * width
  const sY = Math.floor(index / 16) * height
	ctx.drawImage(spriteImage, 
		sX, sY, 
		width, height,
	  -width/2*scale, -height/2*scale,
	  width*scale, height*scale)
  ctx.translate(-x, -y)
  
  if (index === 3 || index === 4) {
    //more animated bird hacks
    ctx.font = "16px 'uni 05_64'"
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.baseLine = "bottom"
    ctx.fillText("Hello!", x, y - 8 * scale, 300)
  }
}

const player = {
  pos: {x: 30, y: 60},
  vel: {x: 0, y: 0}
}

function start() {
  tick()
}

function tick() {
  frame = (frame + 1) % 60
  if (keys.right) player.vel.x += 0.1
  if (keys.left) player.vel.x -= 0.1
  if (keys.up) player.vel.y -= 0.1
  player.vel.y += 0.01
  player.pos.x += player.vel.x
  player.pos.y += player.vel.y

  const collidedTile = null//collidingTile(player.pos)
  if (collidedTile !== null) {
    // left / right
    const i = getIndexFromPixels(collidedTile.x, collidedTile.y) +
      (player.vel.x < 0 ? 1 : -1)
    const { x : newX, y : newY } = getPixelsFromIndex(i)
    player.pos.x = newX + tileSize / 2
    player.vel.x = 0
    player.vel.y = 0
  } else {
  }

  //Room transitions
  if (player.pos.x < 0) {
    location.x--
    player.pos.x += levelWidth * tileSize
    level = getRoom(location)
    editor.setLevel(level)
  }
  if (player.pos.x > levelWidth * tileSize) {
    location.x++
    player.pos.x -= levelWidth * tileSize
    level = getRoom(location)
    editor.setLevel(level)
  }
  if (player.pos.y < 0) {
    location.y--
    player.pos.y += levelHeight * tileSize
    level = getRoom(location)
    editor.setLevel(level)
  }
  if (player.pos.y > levelHeight * tileSize) {
    location.y++
    player.pos.y -= levelHeight * tileSize
    level = getRoom(location)
    editor.setLevel(level)
  }
  draw()
}

function getIndexFromPixels(x, y) {
  return Math.floor((y / tileSize)) * levelWidth + Math.floor((x / tileSize))
}

function getPixelsFromIndex(i) {
  return { x: (i % levelWidth) * tileSize, y: Math.floor(i / levelWidth) * tileSize}
}

function collidingTile(pos) {
  const { x, y } = pos
  const topLeftX = Math.floor(x - tileSize / 2)
  const topLeftY = Math.floor(y - tileSize / 2)
  const topLeftI = getIndexFromPixels(topLeftX, topLeftY)
  if (level[topLeftI] === 1) {
    return { x: topLeftX , y: topLeftY }
  } else {
    return null
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawLevel()
  drawSprite(2, player.pos.x, player.pos.y)
  requestAnimationFrame(tick)
}
