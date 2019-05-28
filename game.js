"use strict"

import {editor} from "/editor.js"

let cheatMode = false
const scale = 4
const levelWidth = 35
const levelHeight = 20
const tileSize = 8
let frame = 0

let savedMap = localStorage.getItem("github.com/mgatland/may/map") //duplicated
let roomSrc = savedMap ? JSON.parse(savedMap) : {}
if (savedMap) {
  console.log("Loading map from local storage. This is only for development use.")
} else {
  roomSrc =
  {"0x0":[0,14,11,7,0,3,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,16,11,7,0,3,1,1,0,7,1,1,0,26,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,2,1,9,0,15,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,2,1,1,0,7,1,1,0,4,1,9,0,2,1,1,0,7,1,1,0,2,1,1,0,7,1,1,11,4,1,1,9,7,1,1,11,2,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,2,1,6,0,2,1,1,0,4,1,1,9,1,0,2,9,1,12,1,9,2,1,1,0,2,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,2,1,1,0,7,1,1,0,4,1,1,9,1,0,1,9,1,0,1,9,3,1,1,0,2,1,1,0,7,1,1,0,2,1,1,0,7,1,1,0,4,1,1,9,1,0,3,9,3,1,1,0,2,1,9,0,2,1,1,0,2,1,6,0,4,1,1,9,7,1,1,0,13,1,1,0,12,1,9,0,13,1,1,0,34,1,9,0,19,13,1,0,3,1,4,0,7,1,1,0,15,1,9,0,2,1,1,0,7,1,9,0,7,1,1,0,7,1,1,0,2,1,6,0,2,1,1,9,7,1,9,0,1,1,2,0,1,1,2,0,1,1,1,0,1,1,2,0,7,1,1,9,1,10,2,9,1,10,2,9,1,1,1,0,7,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,1,1,2,0,7,1,1,9,1,10,2,9,1,10,2,9,1,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,7,1,1,0,2,1,1,0,2,1,6,9,7,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,7,1,1,0,2,1,1,0,7,1,1,9,7,1,1,0,7,1,11,9,1],"1x0":[1,1,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,10,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,9,1,2,0,7,1,1,0,25,1,2,0,7,1,1,0,25,1,2,0,33,1,2,0,27,3,1,0,5,1,2,0,23,1,9,0,1,1,2,0,18,3,1,0,1,6,1,0,2,1,1,0,7,1,1,0,1,1,10,0,7,1,9,0,7,1,1,0,1,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,7,1,1,0,1,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,7,1,1,0,1,1,2,0,7,1,1,0,7,1,1,0,7,1,1,0,7,1,1,0,1,1,36],"0x1":[0,426,1,1,0,8,1,1,0,25,1,1,0,8,1,1,0,25,1,1,0,8,1,1,0,25,1,10,0,159]}

}

const rooms = Object.assign({}, ...Object.keys(roomSrc).map(key => ({[key]: editor.rleDecode(roomSrc[key])})));

const roomDatas = {
  "0x0": {name: "Snailtown", 
  npcs: [
    {questGiver: true, text: "Good morning!\nWould you please deliver\nthese invitations?"}
  ]},
  "1x0": {name:"Uptown",
  npcs: [
    {text: "An invitation?\nThe party is finally happening!"}
  ]
},
}

//Towerland

const location = {x: 0, y: 0, toString: function () {return this.x + "x" + this.y}}

const npcPlaceholder = 13
let npcs = []

const undefinedNpc = {active: true, text: "I'm undefined"}

function getRoomData(location) {
  return roomDatas[location.toString()]
}

function changeRoom(location) {
  function getRoom(location) {
    const room = rooms[location.toString()]
    if (room != null) return room
    const newRoom = editor.rleDecode([0, levelWidth * levelHeight])
    rooms[location] = newRoom
    return newRoom
  }
  level = getRoom(location)
  editor.setLevel(level)

  //get NPCs
  let roomData = getRoomData(location) || {npcs: []}

  npcs = roomData.npcs
  npcs.forEach(npc => {npc.active = !!npc.active; npc.pos = npc.pos || {x: 32, y: 32}})
  let npcNum = 0
  level.forEach((value, i) => {
    if (value === npcPlaceholder) {
      let npc = npcs[npcNum]
      if (!npc) {
        npc = undefinedNpc
        npcs.push(npc)
      }
      npcNum++
      npc.pos = getPixelsFromIndex(i)
      npc.pos.x += tileSize / 2
      npc.pos.y += tileSize / 2
    }
  })
}

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false
ctx.font = "16px 'uni 05_64'"
ctx.fillStyle = "black"
ctx.baseLine = "bottom"
const spriteImage = new Image()
spriteImage.src = 'sprites.png'
spriteImage.addEventListener('load', function() {
  start()
}, false)

editor.startEditor(canvas, scale, rooms, levelWidth, tileSize)

let level = null
changeRoom(location)

function drawLevel() {
  for (let i = 0; i < level.length; i++) {
    const x = (i % levelWidth) + 0.5
    const y = Math.floor(i / levelWidth) + 0.5
    const sprite = level[i]
    if (i !== 3) {
      drawSprite(level[i], x * tileSize, y * tileSize)
    }
  }
  const roomData = getRoomData(location)
  ctx.textAlign = "center"
  const roomName = roomData ? roomData.name : location.toString()
  ctx.fillText(roomName, tileSize * (levelWidth / 2) * scale, 24 + 0 * tileSize * scale)

  if (player.hasQuest) {
    ctx.textAlign = "left"
    ctx.fillText(player.letters + " invitations", 38, 24)
  }
}

function drawNpcs() {
  for(const npc of npcs) {
    let spriteIndex = 5
    if (npc.active) {
      spriteIndex = (frame > 40) ? 4: 3
    }
    drawSprite(spriteIndex, npc.pos.x, npc.pos.y)
    if (npc.active) {
      ctx.textAlign = "center"
      const x = Math.floor(npc.pos.x * scale)
      const y = Math.floor(npc.pos.y * scale)
      const text = npc.text.split("\n").reverse()
      for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], x, y - 8 * scale - i * 20)
      }
    }
  }
}

const keys = {up: false, left: false, right: false, down: false}

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
    case 'ArrowDown':
    case 's':
      keys.down = state
      break
  }
  
  //hack for cheatmode
  if (state === false && key === 'End') {
    cheatMode = !cheatMode
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
  if (index == 6 && frame > 30) index++ //animated flower hack
  const flipped = (index == 2 && player.facingLeft)
  if (index == 2 && Math.abs(player.vel.x) > maxXVel * 0.99) index += 16 //animated snail hack
  const width = 8
  const height = 8
  x = Math.floor(x * scale)
  y = Math.floor(y * scale)
  ctx.translate(x, y)
  if (flipped) ctx.scale(-1, 1)

  const sX = (index % 16) * width
  const sY = Math.floor(index / 16) * height
	ctx.drawImage(spriteImage, 
		sX, sY, 
		width, height,
	  -width/2*scale, -height/2*scale,
	  width*scale, height*scale)
  if (flipped) ctx.scale(-1, 1)
  ctx.translate(-x, -y)
}

//full game state to save:
//player object
//npc active state
//location (screen)

const player = {
  pos: {x: 16, y: 44},
  vel: {x: 0, y: 0},
  facingLeft: false,
  hasQuest: false,
  letters: 100, //fixme: calculate
}

function start() {
  tick()
}

const maxXVel = 2
const xAccel = 0.1
const xDecel = 0.05

function isGrounded(ent) {
  return !!getCollidingTiles({x: ent.pos.x, y:ent.pos.y + 0.1})
}


function updatePlayer() {

  if (cheatMode) {
    const cheatSpeed = 5
    if (keys.left) player.pos.x -= cheatSpeed    
    if (keys.right) player.pos.x += cheatSpeed   
    if (keys.up) player.pos.y -= cheatSpeed    
    if (keys.down) player.pos.y += cheatSpeed     
  } else {
    if (keys.right && player.vel.x < maxXVel) player.vel.x += xAccel
    else if (keys.left && player.vel.x > -maxXVel) player.vel.x -= xAccel
    else if (!keys.left && player.vel.x < 0 && isGrounded(player)) player.vel.x += Math.min(-player.vel.x, xDecel)
    else if (!keys.right && player.vel.x > 0 && isGrounded(player)) player.vel.x -= Math.min(player.vel.x, xDecel)
  
    if (keys.left) player.facingLeft = true
    if (keys.right) player.facingLeft = false
  
    // check collisions x
    player.pos.x += player.vel.x
  
    const collidingTile = getCollidingTiles(player.pos)
    if (collidingTile !== null) {
      const clearTileIndex = getIndexFromPixels(collidingTile.x, collidingTile.y) +
        (player.vel.x < 0 ? 1 : -1) // move player one tile left or right
      const { x : clearX } = getPixelsFromIndex(clearTileIndex)
      player.pos.x = clearX + tileSize / 2
      player.vel.x = 0
    }
  
    if (keys.up && isGrounded(player)) {
      player.vel.y -= 2
      player.vel.y -= Math.abs(player.vel.x / 4)
    }
    player.vel.y += 0.1
  
    // check collisions y
    player.pos.y += player.vel.y
  
    const collidingTileY = getCollidingTiles(player.pos)
    if (collidingTileY !== null) {
      const clearTileIndex = getIndexFromPixels(collidingTileY.x, collidingTileY.y) +
        (player.vel.y < 0 ? levelWidth : -levelWidth) // move player one tile up or down
      const { y : clearY } = getPixelsFromIndex(clearTileIndex)
      player.pos.y = clearY + tileSize / 2
      player.vel.y = 0
    }
  }

  //Room transitions
  if (player.pos.x < 0) {
    location.x--
    player.pos.x += levelWidth * tileSize
    changeRoom(location)
  }
  if (player.pos.x > levelWidth * tileSize) {
    location.x++
    player.pos.x -= levelWidth * tileSize
    changeRoom(location)
  }
  if (player.pos.y < 0) {
    location.y--
    player.pos.y += levelHeight * tileSize
    changeRoom(location)
  }
  if (player.pos.y > levelHeight * tileSize) {
    location.y++
    player.pos.y -= levelHeight * tileSize
    changeRoom(location)
  }
}

function updateNpcs() {
  for(let npc of npcs) {
    if (!npc.active && (npc.questGiver || player.hasQuest) && close(npc.pos, player.pos)) {
      npc.active = true
      player.letters--
      if (npc.questGiver) {
        player.hasQuest = true
      }
    }
  }
}

function close(pos1, pos2) {
  //Fragile hack to make quest giver detect you from far away.
  const dist = player.hasQuest ? tileSize : tileSize * 3
  return Math.abs(pos1.x - pos2.x) < dist && Math.abs(pos1.y - pos2.y) < dist
}

function tick() {
  frame = (frame + 1) % 60
  updatePlayer()
  updateNpcs()
  draw()
  // ctx.fillText(`Player X pos: ${player.pos.x}`, 50, 50)
  // ctx.fillText(`Player Y pos: ${player.pos.y}`, 50, 70)
}

function getIndexFromPixels(x, y) {
  if (x < 0 || y < 0 || x >= levelWidth * tileSize || y >= levelHeight * tileSize) return -1
  return Math.floor((y / tileSize)) * levelWidth + Math.floor((x / tileSize))
}

function getPixelsFromIndex(i) {
  return { x: (i % levelWidth) * tileSize, y: Math.floor(i / levelWidth) * tileSize}
}

function getCollidingTiles(pos) {
  const { x, y } = pos
  const halfTile = tileSize / 2
  const tilesToCheck = [ 
    [ -halfTile, -halfTile, 'topLeft' ],
    [ halfTile - .001, -halfTile, 'topRight' ],
    [ -halfTile, halfTile - .001, 'bottomLeft' ],
    [ halfTile - .001, halfTile - .001, 'bottomRight' ]
  ]
  for (const [xOffset, yOffset] of tilesToCheck) {
    const tileX = Math.floor(x + xOffset)
    const tileY = Math.floor(y + yOffset)
    const tileIndex = getIndexFromPixels(tileX, tileY)
    if (level[tileIndex] === 1) {
      return { x: tileX , y: tileY }
    }
  }
  return null
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawLevel()
  drawNpcs()
  drawSprite(2, player.pos.x, player.pos.y)
  requestAnimationFrame(tick)
}
