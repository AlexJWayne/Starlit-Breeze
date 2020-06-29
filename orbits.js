// Get the canvas element and set it's resolution to it current size.
const canvas = document.getElementById('canvas')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

// Get the drawing context.
const ctx = canvas.getContext('2d')

// How fast planets orbit.
const SPEED = 10

// Draw the tree!
function draw(elapsed) {
  // save the current context state
  ctx.save()

  // Clear the canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Center coordinate system
  ctx.translate(canvas.width/2, canvas.height/2)

  drawCelestialBody({ r: 50, distance:   0, color: '#ffff00', elapsed })
  drawCelestialBody({ r:  5, distance:  80, color: '#888888', elapsed })
  drawCelestialBody({ r:  9, distance: 110, color: '#ffff88', elapsed })
  drawCelestialBody({ r: 10, distance: 140, color: '#8888ff', elapsed })
  drawCelestialBody({ r:  7, distance: 170, color: '#ff4433', elapsed })
  drawCelestialBody({ r: 25, distance: 210, color: '#ff8888', elapsed })
  drawCelestialBody({ r: 20, distance: 260, color: '#ffaa88', elapsed })
  drawCelestialBody({ r: 15, distance: 310, color: '#88aaff', elapsed })
  drawCelestialBody({ r: 15, distance: 360, color: '#4444ff', elapsed })

  // Undo all context tweaks.
  ctx.restore()

  // Request a callback to draw the next frame.
  requestAnimationFrame(draw)
}

function drawCelestialBody({ r, distance, color, elapsed, nested }) {
  ctx.save()

  if (distance > 0) {
    // Draw the orbital path around solar system center
    ctx.beginPath()
    ctx.arc(
      0, 0, // x, y of center point
      distance, // radius
      0, 2 * Math.PI // arc goes all the way around a circle
    )
    ctx.strokeStyle = '#444444'
    ctx.stroke()

    // Orbital velocity falls off at the inverse square of distance
    let orbitSpeed = 1 / Math.pow(distance, 2)

    // Rotate around
    ctx.rotate(elapsed * orbitSpeed * SPEED)

    // Move UP from the center (relative to rotated context)
    ctx.translate(0, distance)
  }

  // Draw and fill the circle
  ctx.beginPath()
  ctx.arc(
    0, 0, // x, y of center point
    r, // radius
    0, 2 * Math.PI // arc goes all the way around a circle
  )

  ctx.fillStyle = color
  ctx.fill()

  ctx.restore()
}

// Start animating
requestAnimationFrame(draw)
