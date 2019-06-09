/* eslint-disable no-console */
'use strict'

import { editor } from './editor.js'

let params = (new URL(document.location)).searchParams;
window.editMode = !!params.get("edit")

const scale = 4
const levelWidth = 35
const levelHeight = 20
const tileSize = 8
let frame = 0
let menu = true

let savedMap = localStorage.getItem('github.com/mgatland/may/map') // duplicated
let roomSrc = savedMap ? JSON.parse(savedMap) : {}
if (savedMap) {
  console.log('Loading map from local storage. This is only for development use.')
} else {
  roomSrc =
{"0x0":[0,14,11,7,0,3,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,16,11,7,0,3,1,1,0,7,1,1,0,26,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,2,1,9,0,15,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,2,1,1,0,7,1,1,0,4,1,9,0,2,1,1,0,7,1,1,0,2,1,1,0,7,1,1,11,4,1,1,9,7,1,1,11,2,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,2,1,6,0,2,1,1,0,4,1,1,9,1,0,2,9,1,12,1,9,2,1,1,0,2,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,2,1,1,0,7,1,1,0,4,1,1,9,1,0,1,9,1,0,1,9,3,1,1,0,2,1,1,0,7,1,1,0,2,1,1,0,2,15,5,1,1,0,4,1,1,9,1,0,3,9,3,1,1,0,2,1,9,0,2,1,1,0,2,1,6,0,4,1,1,9,7,1,1,0,13,1,1,0,12,1,9,0,13,1,1,15,8,0,26,1,9,0,15,15,1,0,3,13,1,0,3,1,4,0,7,1,1,15,8,0,7,1,9,0,2,1,1,0,7,1,9,15,7,1,1,0,7,1,1,0,2,1,6,0,2,1,1,9,7,1,9,0,1,1,2,0,1,1,2,0,1,1,1,0,1,1,2,0,7,1,1,9,1,10,2,9,1,10,2,9,1,1,1,0,7,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,1,1,2,0,7,1,1,9,1,10,2,9,1,10,2,9,1,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,7,1,1,0,2,1,1,0,2,1,6,9,7,1,1,0,1,1,2,0,1,1,2,0,1,1,1,0,7,1,1,0,2,1,1,0,7,1,1,9,7,1,1,0,7,1,11,9,1],"1x0":[0,15,11,5,0,30,11,5,0,365,1,4,0,34,1,1,0,20,1,11,0,3,1,1,0,16,13,1,0,3,1,1,9,9,1,2,0,2,1,6,0,7,1,9,9,9,1,2,0,2,1,1,9,4,1,1,0,3,13,1,0,3,1,1,9,7,1,1,9,9,1,1,0,3,1,1,9,4,1,1,0,2,1,3,0,2,1,1,9,17,1,1,0,3,1,1,9,4,1,1,0,2,1,3,0,2,1,1,9,7,1,1,9,9,1,1,0,3,1,1,9,4,1,9,9,7,1,11],"0x1":[0,426,1,1,0,8,1,1,0,25,1,1,0,8,1,1,0,25,1,1,0,8,1,1,0,25,1,10,0,159],"[object Object]":[0,371,1,1,0,328],"2x0":[0,159,13,1,0,9,13,1,0,7,1,1,0,3,1,7,0,3,1,6,0,5,1,6,0,4,1,2,0,2,1,1,0,5,1,1,11,3,1,1,9,1,0,2,9,1,1,1,11,5,1,1,9,1,0,2,9,1,1,1,11,2,0,2,1,1,0,3,1,1,0,1,1,3,0,1,1,1,0,3,1,1,0,4,1,1,0,5,1,1,0,4,1,1,0,4,1,1,0,2,1,2,0,1,1,3,0,1,1,1,0,3,1,1,9,1,0,2,9,1,1,1,0,5,1,1,9,1,0,2,9,1,1,1,0,4,1,1,0,3,1,1,0,5,1,1,0,3,1,6,0,5,1,6,0,4,1,2,0,2,1,1,0,1,1,3,0,1,1,1,0,28,1,1,0,1,1,3,0,1,1,1,0,27,1,2,0,5,1,1,0,22,1,7,0,1,1,3,0,1,1,1,0,28,1,1,0,1,1,3,0,1,1,1,0,28,1,1,0,5,1,1,0,28,1,1,0,1,1,3,0,1,1,1,0,28,1,1,0,1,1,3,0,1,1,1,0,28,1,1,0,5,1,1,0,6,13,1,0,21,1,1,0,1,1,3,0,1,1,23],"3x0":[0,178,1,6,0,26,11,3,1,1,0,4,1,1,0,2,1,1,0,7,13,1,0,18,1,1,0,2,10,1,0,1,1,1,0,2,1,2,0,4,1,4,0,2,1,12,0,3,1,1,0,1,10,1,0,2,1,1,11,2,1,1,9,1,1,1,0,5,1,2,0,3,1,1,0,13,1,1,0,2,10,1,0,1,1,1,0,2,1,1,9,2,1,1,0,5,1,2,0,2,1,1,0,13,1,1,0,4,1,1,0,2,1,1,9,3,1,1,0,4,1,1,0,3,1,1,0,13,1,6,0,2,1,6,0,3,1,1,0,2,1,3,0,29,1,1,0,3,1,1,0,29,1,3,0,2,1,1,0,30,1,1,0,3,1,1,0,24,13,1,0,5,1,1,0,2,1,3,0,20,1,10,0,3,1,1,0,21,1,1,9,7,1,3,0,2,1,1,0,15,13,1,0,5,1,1,9,8,1,1,0,3,1,1,0,10,1,21,0,2,1,3,0,9],"3x1":[0,20,1,1,0,2,1,10,0,2,1,22,0,10,1,1,0,24,1,1,0,9,1,1,0,25,1,1,0,3,13,1,0,4,1,1,0,7,10,1,0,18,1,1,0,2,1,6,0,6,10,3,0,18,1,1,0,13,10,3,0,19,1,1,0,13,10,1,0,2,1,5,0,14,1,1,0,15,10,1,0,3,1,1,0,17,1,2,0,7,9,3,0,1,10,1,0,3,1,1,0,26,9,3,0,1,1,1,0,3,1,1,0,14,1,2,0,8,1,8,0,2,1,18,0,2,1,1,0,3,1,2,0,10,1,1,0,10,1,1,0,6,1,1,0,1,1,1,0,2,1,1,0,28,1,1,0,2,1,1,0,2,1,1,0,10,1,3,0,8,1,3,0,3,1,1,0,3,1,1,0,2,1,12,0,1,1,10,0,1,1,8,0,6,9,2,0,1,9,2,0,7,9,2,0,2,9,2,0,4,9,2,0,1,9,2,0,4,1,35,0,70],"4x0":[0,7,1,8,0,5,1,8,0,13,1,1,0,21,1,1,0,11,1,1,0,23,1,1,0,9,1,1,0,25,1,1,0,7,1,1,0,27,1,1,0,73,1,5,0,25,1,5,0,4,1,1,0,5,13,1,0,6,13,1,0,6,13,1,0,5,1,1,0,8,1,27,0,354],"4x-1":[0,360,1,15,0,19,1,1,0,7,1,1,0,7,1,1,0,17,1,1,0,8,1,1,0,8,1,1,0,15,1,1,0,9,1,1,0,9,1,1,0,14,1,1,0,9,1,1,0,9,1,1,0,14,1,1,0,19,1,1,0,59,1,1,0,29,13,1,0,4,1,1,0,6,13,1,0,17,1,21,0,7],"3x-1":[0,170,11,1,0,61,11,1,0,92,11,1,0,108,11,1,0,64,11,1,0,98,11,1,0,92,1,4,0,5],"5x0":[0,245,1,2,0,35,1,1,0,35,1,1,0,9,10,1,0,5,10,1,0,5,10,1,0,12,1,1,0,9,10,1,0,5,10,1,0,5,10,1,0,10,12,1,0,2,1,1,0,7,10,3,0,3,10,3,0,3,10,3,0,13,1,2,0,5,10,3,0,3,10,3,0,3,10,3,0,8,12,1,0,6,1,1,0,3,10,5,0,1,10,5,0,1,10,5,0,15,1,1,0,4,10,1,0,5,10,1,0,5,10,1,0,12,12,1,0,4,1,1,0,4,10,1,0,5,10,1,0,5,10,1,0,5,13,1,0,10,12,1,0,1,1,26,0,1,12,1,0,2,12,1,0,8,12,1,0,42,12,1,0,4,12,1,0,15,12,1,0,10,12,1,0,12,12,1,0,3],"6x0":[0,265,10,3,0,31,10,5,0,31,10,3,0,33,10,1,0,34,10,1,0,34,10,1,0,21,1,3,0,8,1,5,0,18,1,1,0,3,1,1,0,7,1,1,0,4,1,1,0,16,1,1,0,1,12,1,0,3,1,1,14,5,1,1,0,2,12,1,0,3,1,2,0,8,1,6,0,6,1,1,0,4,1,1,0,9,1,8,0,7,12,1,0,3,12,1,1,1,0,4,1,1,0,1,12,1,0,4,12,1,0,5,12,1,0,5,12,1,0,11,1,1,0,2,1,1,0,15,12,1,0,8,12,1,0,4,12,1,0,2,1,2,0,4,12,1,0,5,12,1,0,8],"7x0":[0,82,7,1,0,3,1,6,0,24,1,5,0,6,1,5,0,17,1,2,0,16,1,5,0,13,1,2,0,2,12,1,0,4,12,1,0,4,12,1,0,7,1,3,0,12,1,3,0,35,1,3,0,3,12,1,0,11,12,1,0,19,1,1,0,3,12,1,0,6,12,1,0,24,1,1,0,34,1,1,0,5,12,1,0,3,12,1,0,24,1,1,0,1,12,1,0,19,10,3,0,9,1,1,0,14,12,1,0,6,10,5,0,8,1,1,0,22,10,3,0,9,1,1,0,23,10,1,0,9,1,1,0,6,12,1,0,3,12,1,0,6,1,3,0,4,10,1,0,9,1,1,0,2,12,1,0,17,1,3,0,1,10,1,0,9,1,1,0,23,1,4,0,7,1,1,0,15,12,1,0,11,1,7,0,6,12,1,0,11],"2x1":[0,76,1,22,0,13,1,1,0,9,1,1,0,10,1,1,0,13,1,1,0,1,1,2,0,6,1,1,0,10,1,1,0,13,1,1,0,1,1,2,0,6,1,1,0,10,1,1,0,13,1,5,0,5,1,1,0,4,13,1,0,5,1,1,0,13,1,1,0,14,1,1,0,19,1,1,0,13,1,3,0,18,1,1,0,13,1,3,0,18,1,1,0,5,1,20,0,9,1,2,0,23,1,1,0,9,1,1,0,1,1,1,0,22,1,1,0,9,1,1,0,2,1,1,0,21,1,1,0,9,1,1,0,3,1,1,0,26,1,2,0,2,1,1,0,1,1,1,0,2,1,1,0,5,1,2,0,18,1,2,0,2,1,1,0,1,1,2,0,2,1,1,0,4,1,2,0,6,13,1,0,9,1,35,0,70],"-1x-1":[0,36,1,33,0,2,1,1,0,31,1,1,0,2,1,1,0,31,1,1,0,2,1,1,0,31,1,1,0,2,1,1,0,31,1,1,0,2,1,1,0,31,1,1,0,2,1,1,0,4,2,1,0,26,1,1,0,2,1,33,0,386],"4x1":[0,70,1,35,0,34,1,1,0,1,9,3,0,3,9,1,0,1,9,1,0,24,1,1,0,3,9,1,0,3,9,1,0,1,9,1,0,16,1,4,0,4,1,1,0,1,9,3,0,1,9,1,0,1,9,3,0,24,1,1,0,3,9,1,0,5,9,1,0,4,13,1,0,19,1,1,0,1,9,3,0,5,9,1,0,1,1,6,0,7,1,8,0,2,1,1,0,34,1,1,0,1,1,9,0,10,13,1,0,13,1,1,0,19,1,9,0,6,1,1,0,34,1,1,0,34,1,1,0,10,1,9,0,15,1,1,0,34,1,1,0,27,13,1,0,6,1,36,0,70]}
}

const rooms = Object.assign({}, ...Object.keys(roomSrc).map(key => ({ [key]: editor.rleDecode(roomSrc[key]) })))

const roomDatas = {
  '-1x-1': { name: '', // menu
    npcs: []
  },
  '0x0': { name: 'Snailtown',
    npcs: [
      { questGiver: true, text: 'Good morning!\nWould you please deliver\nthese invitations?' }
    ] },
  '1x0': { name: 'Downtown',
    npcs: [
      { text: 'This is\nreally happening!' },
      { text: 'A party?\nIt\'s about time!' }
    ]
  },
  '2x0': { name: 'Uptown',
    npcs: [
      { text: 'Thank you!' },
      { text: 'My invitation?\nThanks.' },
      { text: 'Wow, you\ndeliver down here?' }
    ]
  },
  '3x0': { name: 'Junction',
    npcs: [
      { text: 'No exit - unless\non important\nparty business.' },
      { text: 'Hello! Just taking\na break.' },
      { text: 'You need a run up...' }
    ]
  },
  '4x0': { name: 'Mansion',
    npcs: [
      { text: 'Oh ANOTHER party' },
      { text: 'Hey the last\none was good' },
      { text: 'We all have\nto go anyway' }
    ]
  },
  '5x0': { name: 'Woodfield',
    npcs: [
      { text: 'I wonder if\nmy old friend\nis coming' }
    ]
  },
  '6x0': { name: 'River Crossing',
    npcs: [

    ]
  },
  '7x0': { name: 'Cliff',
    npcs: [

    ]
  },
  '3x-1': { name: 'Spectacular View',
    npcs: [

    ]
  },
  '4x-1': { name: 'Roadview Suites',
    npcs: [
      { text: 'I\'ll bring my\nfamous cheesecake' },
      { text: 'I\'m going to be\n the first to arrive!' }
    ]
  },
  '5x-1': { name: 'Breathtaking View',
    npcs: [

    ]
  },

  '2x1': { name: 'Warehouse',
  npcs: [
    { text: 'YoU sHoUlD CaLL\nyOuR cOmPaNy\nSnAiL mAiL!' },
    { text: 'A party invite?\nWow!'}
  ]
  },

  '3x1': { name: 'Arrivals',
    npcs: [
      { text: 'For me? How did you\nknow I was here?' }
    ]
  },

  '4x1': { name: 'Laser Tag',
    npcs: [
      { text: 'Thank you!\nI\'m winning btw' },
      { text: 'Sweet! Let\'s go\nafter this match.'},
      { sad: true, text: '(this person was not invited)' }
    ]
  },
}

const npcCount = Object.values(roomDatas).flatMap(r => r.npcs).filter(n => !n.sad).length
let partyGoerCount = 0 // fixme: should be saved in saved state?

// Towerland

const npcPlaceholder = 13
const partyPlaceholder = 15
let npcs = []

function locationKey (location) {
  return location.x + 'x' + location.y
}

function getRoomData (location) {
  return roomDatas[locationKey(location)]
}

function addPartygoer () {
  partyGoerCount++
  if (partyGoerCount < npcCount) {
    setTimeout(addPartygoer, 1000)
  }
}

function changeRoom (location) {
  function getRoom (location) {
    const room = rooms[locationKey(location)]
    if (room != null) return room
    const newRoom = editor.rleDecode([0, levelWidth * levelHeight])
    rooms[locationKey(location)] = newRoom
    return newRoom
  }
  level = getRoom(location)
  editor.setLevel(level)

  if (locationKey(location) === '0x0' && player.letters === 0 &&
  player.hasQuest === true && !player.endGame) {
    player.endGame = true // no spoilers
    setTimeout(addPartygoer, 1000)
  }

  // get NPCs
  let roomData = getRoomData(location) || { npcs: [] }

  npcs = roomData.npcs
  npcs.forEach(npc => { npc.active = !!npc.active; npc.pos = npc.pos || { x: 32, y: 32 } })
  let npcNum = 0
  level.forEach((value, i) => {
    if (value === npcPlaceholder) {
      let npc = npcs[npcNum]
      if (npc) {
        npcNum++
        npc.pos = getPixelsFromIndex(i)
        npc.pos.x += tileSize / 2
        npc.pos.y += tileSize / 2
        // endgame hack
        if (player.endGame && !npc.questGiver && !npc.sad) {
          npc.pos.x = -1000 // hide it
        }
      }
    }
  })
}

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
const defaultFont = "16px 'uni 05_64'"
const titleFont = "32px 'uni 05_64'"
ctx.font = defaultFont
ctx.fillStyle = 'black'
ctx.baseLine = 'bottom'
const spriteImage = new Image()
spriteImage.src = 'sprites.png'
spriteImage.addEventListener('load', function () {
  start()
}, false)

editor.startEditor(canvas, scale, rooms, levelWidth, tileSize)

let level = null

const player = {
  pos: { x: 16, y: 44 },
  vel: { x: 0, y: 0 },
  location: { x: -1, y: -1 },
  facingLeft: false,
  hasQuest: false,
  letters: 0
}
window.player = player

function loadGame() {
  const savedPlayer = localStorage.getItem('github.com/mgatland/may/player')
  if (savedPlayer) {
    Object.assign(player, JSON.parse(savedPlayer))
  }
  player.hasQuest = false
  player.letters = npcCount
  player.endGame = false
  menu = false
  changeRoom(player.location)
}

function newGame() {
  player.pos =  { x: 16, y: 44 }
  player.vel = { x: 0, y: 0 }
  player.location = { x: 0, y: 0 }
  player.facingLeft = false
  player.hasQuest = false
  player.letters = npcCount
  menu = false
  changeRoom(player.location)
}

if (window.editMode) {
  loadGame()
} else {
  changeRoom(player.location)
}

function drawLevel () {
  const partyPos = []
  for (let i = 0; i < level.length; i++) {
    const x = (i % levelWidth) + 0.5
    const y = Math.floor(i / levelWidth) + 0.5
    const sprite = level[i]
    if (sprite === partyPlaceholder && !player.cheatMode) {
      partyPos.push({ x, y })
    } else {
      drawSprite(sprite, x * tileSize, y * tileSize)
    }
  }

  if (partyGoerCount > 0 && partyPos.length > 0) {
    for (let i = 0; i < Math.min(partyGoerCount, partyPos.length); i++) {
      const { x, y } = partyPos[i]
      drawPartyGoer(x * tileSize, y * tileSize)
    }
  }

  const roomData = getRoomData(player.location)
  ctx.textAlign = 'center'
  const roomName = roomData ? roomData.name : locationKey(player.location)
  ctx.fillText(roomName, tileSize * (levelWidth / 2) * scale, 24 + 0 * tileSize * scale)

  if (player.hasQuest) {
    ctx.textAlign = 'left'
    let message = ''
    if (player.endGame) {
      message = ''
    } else if (player.letters === 0) {
      message = 'Time to go home!'
    } else {
      message = player.letters + ' invitation' + (player.letters > 1 ? 's' : '')
    }
    ctx.fillText(message, 38, 24)
  }

  //hack: note if you get up the cliff side
  const cliffPos = {x: 148, y: 92}
  if (locationKey(player.location) === '7x0' && close(player.pos, cliffPos)) {
    ctx.font = defaultFont
    ctx.fillText("I made it!", 420, 350)
  }

  if (menu) {
    const centerX = tileSize * (levelWidth / 2) * scale
    const lineHeight = 40
    let y = lineHeight * 3

    ctx.font = titleFont
    ctx.fillText("Snail and Co Courier Service", centerX, y)
    ctx.font = defaultFont
    y += lineHeight
    ctx.fillText("Arrow keys | WASD | Spacebar", centerX, y)
    y += lineHeight
    ctx.fillText("Press any key", centerX, y)
    y += lineHeight * 6
    ctx.fillText("By Matthew Gatland", centerX, y)
    y += lineHeight
    ctx.fillText("miniml font by Craig Kroege", centerX, y)
    y += lineHeight
    ctx.fillText("Additional programming by Alice Gatland", centerX, y)
  }
}

function drawPartyGoer (x, y) {
  const sprite = Math.floor(frame / 15) % 2 === 0 ? 3 : 4
  drawSprite(sprite, x, y, frame < 30)
}

function drawNpcs () {
  for (const npc of npcs) {
    let spriteIndex = 5
    let flipped = false
    if (npc.active && !npc.sad) {
      spriteIndex = (frame > 40) ? 4 : 3
      if (npc.pos.x < player.pos.x) flipped = true

    }
    drawSprite(spriteIndex, npc.pos.x, npc.pos.y, flipped)
    if (npc.active) {
      ctx.textAlign = 'center'
      const x = Math.floor(npc.pos.x * scale)
      const y = Math.floor(npc.pos.y * scale)
      let text = npc.text.split('\n').reverse()
      if (npc.questGiver && player.endGame) {
        text = 'Thank you!\nLet\'s party!'.split('\n').reverse()
      }
      if (npc.sad && player.endGame) {
        text = ['I\'m OK!']
      }
      for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], x, y - 8 * scale - i * 20)
      }
    }
  }
}

const keys = { up: false, left: false, right: false, down: false, cheat: false }

function switchKey (key, state) {

  if (menu) {
      newGame()
    return
  }

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
    case ' ':
      keys.up = state
      break
    case 'ArrowDown':
    case 's':
      keys.down = state
      break
    case 'q':
      keys.cheat = state
      break
  }

  // hack for cheatmode
  if (state === false && keys.cheat && key === 'l') {
    player.cheatMode = !player.cheatMode
  }
}

window.addEventListener('keydown', function (e) {
  switchKey(e.key, true)
})

window.addEventListener('keyup', function (e) {
  switchKey(e.key, false)
})

function drawSprite (index, x, y, flipped = false) {
  if (index === 0) return // empty space hack
  if (index === npcPlaceholder && player.endGame && !player.cheatMode) return // don't show npc placeholders in end game
  if (index === partyPlaceholder && !player.cheatMode) return
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
    -width / 2 * scale, -height / 2 * scale,
    width * scale, height * scale)
  if (flipped) ctx.scale(-1, 1)
  ctx.translate(-x, -y)
}

function start () {
  tick()
}

const maxXVel = 2
const xAccel = 0.1
const xDecel = 0.05

function isGrounded (ent) {
  return !!getCollidingTiles({ x: ent.pos.x, y: ent.pos.y + 0.1 })
}

function updatePlayer () {
  if (menu) return
  if (player.cheatMode) {
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
      const { x: clearX } = getPixelsFromIndex(clearTileIndex)
      player.pos.x = clearX + tileSize / 2
      player.vel.x = 0
    }

    // You can jump if
    // 1. you are falling
    // 2. you have ground under your feet
    // This prevents a case where you step over the edge of a platform and immediately can jump again
    if (keys.up && isGrounded(player) && player.vel.y >= 0) {
      player.vel.y = -2 // If we ever add slopes, we'd want to preserve vertical speed here sometimes.
      player.vel.y -= Math.abs(player.vel.x / 4)
    }
    player.vel.y += 0.1

    // check collisions y
    player.pos.y += player.vel.y

    const collidingTileY = getCollidingTiles(player.pos)
    if (collidingTileY !== null) {
      const clearTileIndex = getIndexFromPixels(collidingTileY.x, collidingTileY.y) +
        (player.vel.y < 0 ? levelWidth : -levelWidth) // move player one tile up or down
      const { y: clearY } = getPixelsFromIndex(clearTileIndex)
      player.pos.y = clearY + tileSize / 2
      player.vel.y = 0
    }
  }

  // Room transitions
  const location = player.location
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

function updateNpcs () {
  for (let npc of npcs) {
    if (!npc.active && (npc.questGiver || player.hasQuest) && close(npc.pos, player.pos)) {
      npc.active = true
      if (!npc.sad) player.letters--
      if (npc.questGiver) {
        player.hasQuest = true
      }
    }
  }
}

function close (pos1, pos2) {
  // Fragile hack to make quest giver detect you from far away.
  const dist = player.hasQuest ? tileSize : tileSize * 3
  return Math.abs(pos1.x - pos2.x) < dist && Math.abs(pos1.y - pos2.y) < dist
}

function tick () {
  frame = (frame + 1) % 60
  if (frame === 0 && !menu) {
    localStorage.setItem('github.com/mgatland/may/player', JSON.stringify(player))
  }
  updatePlayer()
  updateNpcs()
  draw()
  // ctx.fillText(`Player X pos: ${player.pos.x}`, 50, 50)
  // ctx.fillText(`Player Y pos: ${player.pos.y}`, 50, 70)
}

function getIndexFromPixels (x, y) {
  if (x < 0 || y < 0 || x >= levelWidth * tileSize || y >= levelHeight * tileSize) return -1
  return Math.floor((y / tileSize)) * levelWidth + Math.floor((x / tileSize))
}

function getPixelsFromIndex (i) {
  return { x: (i % levelWidth) * tileSize, y: Math.floor(i / levelWidth) * tileSize }
}

function getCollidingTiles (pos) {
  const { x, y } = pos
  const halfTile = tileSize / 2
  const tilesToCheck = [
    [ -halfTile, -halfTile, 'topLeft' ],
    [ halfTile - 0.001, -halfTile, 'topRight' ],
    [ -halfTile, halfTile - 0.001, 'bottomLeft' ],
    [ halfTile - 0.001, halfTile - 0.001, 'bottomRight' ]
  ]
  for (const [xOffset, yOffset] of tilesToCheck) {
    const tileX = Math.floor(x + xOffset)
    const tileY = Math.floor(y + yOffset)
    const tileIndex = getIndexFromPixels(tileX, tileY)
    if (level[tileIndex] === 1) {
      return { x: tileX, y: tileY }
    }
  }
  return null
}

function drawPlayer() {
  //add player head bobbing here
  let sprite = 2
  if (player.endGame && locationKey(player.location) === "0x0" && partyGoerCount > 3) {
    sprite = Math.floor(frame / 15) % 2 === 0 ? 2 : 18
  } else {
    if (Math.abs(player.vel.x) > maxXVel * 0.99) sprite = 18
  }
  
  drawSprite(sprite, player.pos.x, player.pos.y, player.facingLeft)
}

function draw () {
  const rightEdge = tileSize * levelWidth * scale
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "black"
  ctx.fillRect(rightEdge, 0, canvas.width - rightEdge, canvas.height)
  drawLevel()
  drawNpcs()
  if (!menu) drawPlayer()
  requestAnimationFrame(tick)
}
