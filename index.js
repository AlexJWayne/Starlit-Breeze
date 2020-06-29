// Get the canvas element and set it's resolution to it current size.
const canvas = document.getElementById('canvas')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

// Get the drawing context.
const ctx = canvas.getContext('2d')

// Number of times the branches branch.
const DEPTH = 10

// The maximum angle the wind will push any branch. (radians)
const WIND_AMPLITUDE = 8 * Math.PI / 180

// How quickly the wind animates the branches
const WIND_FREQUENCY = 0.5

// Angle that each child branch comes off of its parent. (radians)
const BRANCH_ANGLE = 25 * Math.PI / 180

// Amount that each child branch is scaled down from it's parent.
const BRANCH_SCALE = 0.8

// [w,h] of the rectangle that makes up each branch.
const BRANCH_RECT = [canvas.height * 0.015, canvas.height * 0.15]

const STAR_COUNT = 1000
const STAR_SPEED = 3 * Math.PI / 180 // radians per second

let msLastFrame = 0
let msElapsed = performance.now()

let stars = [] // array of [{x, y, radius}, ...]
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * 2 * canvas.width  - canvas.width,
    y: Math.random() * 2 * canvas.height - canvas.height,
    r: 0.25 + Math.random() * 2,
  })
}
stars.push({ x: 0, y: 0, r: 2 }) // North Star!

// Create the sky/ground gradient.
const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0.0, '#002')
backgroundGradient.addColorStop(0.4, '#004')
backgroundGradient.addColorStop(0.5, '#226')
backgroundGradient.addColorStop(0.5, '#111')
backgroundGradient.addColorStop(1.0, '#232')

// Draw the tree!
function draw(elapsed) {
  msLastFrame = elapsed - msElapsed
  msElapsed = elapsed

  // Clear the canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawSky()
  drawStars()
  drawGround()
  drawTree()

  // Request a callback to draw the next frame.
  requestAnimationFrame(draw)
}

function drawSky() {
  ctx.save()
  ctx.fillStyle = backgroundGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height/2)
  ctx.restore()
}

function drawGround() {
  ctx.save()
  ctx.fillStyle = backgroundGradient
  ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2)
  ctx.restore()
}

function drawStars() {
  ctx.save()

  ctx.translate(canvas.width * 3/4, canvas.height/6)
  ctx.rotate(msElapsed / 1000 * STAR_SPEED)

  ctx.fillStyle = 'rgba(255,255,255, 0.8)'
  for (let star of stars) {
    ctx.beginPath()
    ctx.arc(
      star.x,
      star.y,
      star.r,
      0, 2 * Math.PI
    )
    ctx.closePath()
    ctx.fill()
  }

  ctx.rotate(msElapsed / 1000 * STAR_SPEED)
  ctx.fillStyle = '#ddf'
  ctx.beginPath()
  ctx.arc(
    -canvas.width / 2,
    canvas.width / 2,
    50,
    0, 2 * Math.PI
  )
  ctx.fill()

  ctx.fillStyle = '#eef'
  ctx.beginPath()
  ctx.arc(
    -canvas.width / 2,
    canvas.width / 2,
    45,
    0, 2 * Math.PI
  )
  ctx.fill()

  ctx.restore()
}

function drawTree() {
  // We are about change the context, so save the default state.
  ctx.save()

  // Flip the context coordinate system positive Y is upward.
  ctx.scale(1, -1)

  // Move the context coordinate system so the bottom center of
  // the frame is [0,0]
  ctx.translate(canvas.width / 2, -canvas.height)

  // Draw the root branch.
  drawBranch(0)

  // Restore the context to the default state.
  ctx.restore()
}

// Draw a single branch of the tree, and then recursively call
// itself to draw child branches.
function drawBranch(depth) {
  // Set a fillcolor for the branches that gets dark the closer
  // it gets to the branch ends.
  const lightness = Math.round(255 - 180 * depth / DEPTH)
  ctx.fillStyle = `rgb(${lightness}, ${lightness}, ${lightness})`

  // Calculate the input to a sin function
  let windInput = msElapsed / 1000 // move thorugh the sin wave based on elapsed time.
  windInput *= WIND_FREQUENCY // Compress/stretch the wave.
  windInput -= depth // making each tier out of sync by offsetting the wave based on depth.

  // Rotate the context by the effect of the wind.
  ctx.rotate(Math.sin(windInput) * WIND_AMPLITUDE * (1 + depth/DEPTH))

  // Draw the branch.
  ctx.fillRect(
    -BRANCH_RECT[0] / 2, // x coordinate of rectangle starts half the width to the left.
    0,                   // y coordinate is always zero, at x axis of the context.
    BRANCH_RECT[0],      // branch width
    BRANCH_RECT[1]       // branch height
  )

  // Move to context to the end of the branch
  ctx.translate(0, BRANCH_RECT[1])

  if (depth < DEPTH) {

    // Scale the context down to make the next branch smaller
    ctx.scale(BRANCH_SCALE, BRANCH_SCALE)

    // Setup a context for each child branch, and then draw them.
    for (let angle of [-BRANCH_ANGLE, BRANCH_ANGLE]) {
      ctx.save()

      // Rotate the context by the amount each branch comes off of it's parent.
      ctx.rotate(angle)

      // Draw the next branch!
      drawBranch(depth + 1)

      ctx.restore()
    }
  } else {
    ctx.save()

    // ctx.rotate(Math.PI / 4)
    // Draw a nice red circle at the current context origin,
    // which should now be at the end of the last branch.
    ctx.fillStyle = '#f00'
    ctx.beginPath()
    ctx.arc(
      0, 0,               // Center on the context origin.
      BRANCH_RECT[0] * 2, // Radius is twice the branch width.
      0, 2 * Math.PI      // Arc angles 0 to 2 PI, a full circle.
    )
    ctx.fill() // Fill the circle.

    // ctx.rotate(Math.PI / 4)

    // ctx.fillRect(-BRANCH_RECT[0] * 2, -BRANCH_RECT[0] * 2, BRANCH_RECT[0] * 4, BRANCH_RECT[0] * 4)
    ctx.restore()
  }
}

// Start animating
requestAnimationFrame(draw)
