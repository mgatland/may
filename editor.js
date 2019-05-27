export function startEditor (canvas, scale, level, levelWidth, tileSize) {
  function getMouseXYFromEvent(e) {
    const x = event.offsetX * canvas.width / canvas.offsetWidth / scale
    const y = event.offsetY * canvas.height / canvas.offsetHeight / scale
    return {x, y}
  }
  
  function mouseMove(e) {
    const pos = getMouseXYFromEvent(e)
    const tile = {x: Math.floor(pos.x / 8), y: Math.floor(pos.y / 8)}
    const i = tile.x + tile.y * levelWidth
    if (e.buttons === 1) {
      level[i] = 1
    }
    if (e.buttons === 2) {
      level[i] = 0
      } 
  }

  canvas.addEventListener("mousemove", mouseMove)
  canvas.addEventListener("mousedown", mouseMove)
  canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault()
  })
}
