// Get the canvas element and set it's resolution to it current size.
const canvas = document.getElementById('canvas')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

// Get the drawing context.
const ctx = canvas.getContext('2d')

function tween(t, b, c, d) {
  return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b
}

function tweenValue(duration = 2000) {
  let start = performance.now()
  return function(now) {
    if (now - start < duration) {
      return tween(now - start, 0, 1, duration)
    } else {
      return 1
    }
  }
}

let level = 0
let transitionTweeners = {
  "1": () => 1,
  "2": () => 1,
  "3": () => 1,
  "4": () => 1,
  "5": () => 1,
  "6": () => 1,
}
canvas.addEventListener('click', () => {
  if (level >= 6) {
    level = 0
    transitionTweeners = {
      "1": () => 1,
      "2": () => 1,
      "3": () => 1,
      "4": () => 1,
      "5": () => 1,
      "6": () => 1,
    }
  } else {
    level++
    transitionTweeners[level] = tweenValue()
  }
})

function draw(elapsed) {
  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (level >= 1) {
    ctx.translate(
      transitionTweeners["1"](performance.now()) * canvas.width/2,
      transitionTweeners["1"](performance.now()) * canvas.height/2
    )
  }

  if (level >= 2) {
    ctx.scale(1, 1 - 2 * transitionTweeners["2"](performance.now()))
  }

  if (level >= 3) {
    ctx.scale(
      1 + transitionTweeners["3"](performance.now()),
      1 + transitionTweeners["3"](performance.now())
    )
  }

  if (level >= 4) {
    ctx.rotate(transitionTweeners["4"](performance.now()) * Math.PI/8)
  }

  if (level >= 5) {
    ctx.translate(0, transitionTweeners["5"](performance.now()) * 100)
  }

  if (level >= 6) {
    ctx.translate(transitionTweeners["6"](performance.now()) * 100, 0)
  }

  let codeLines = document.getElementById('lines-of-code').children
  for (let i = 0; i < codeLines.length; i++) {
    let li = codeLines[i]
    if (i < level) {
      li.style.visibility = 'visible'
    } else {
      li.style.visibility = 'hidden'
    }
  }

  grid(10, '#444444')
  grid(100, '#888888')
  origin()
  axes()

  // Undo all context tweaks.
  ctx.restore()

  // Request a callback to draw the next frame.
  requestAnimationFrame(draw)
}

function grid(spacing, color) {
  ctx.save()

  ctx.translate(0.5, 0.5)

  ctx.beginPath()
  for (let x = -3000; x < 3000; x += spacing) {
    ctx.moveTo(x, -canvas.height)
    ctx.lineTo(x, canvas.height)
  }
  for (let y = -3000; y < 3000; y += spacing) {
    ctx.moveTo(-canvas.width, y)
    ctx.lineTo(canvas.width, y)
  }

  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.restore()
}

function origin() {
  ctx.save()

  ctx.beginPath()
  ctx.arc(0,0, 20, 0,2*Math.PI)
  ctx.fillStyle = '#ff0000'
  ctx.fill()

  ctx.restore()
}

function axes() {
  ctx.save()

  let arrows = [
    { angle: -Math.PI/2, color: '#4444ff' }, // x
    { angle: 0, color: '#44ff44' }, // y
  ]

  for (let arrow of arrows) {
    ctx.save()

    ctx.rotate(arrow.angle)

    ctx.beginPath()
    ctx.moveTo(-20, 30)
    ctx.lineTo( 20, 30)
    ctx.lineTo(0, 100)
    ctx.closePath()
    ctx.fillStyle = arrow.color
    ctx.fill()

    ctx.restore()
  }

  ctx.restore()
}

// Start animating
requestAnimationFrame(draw)
