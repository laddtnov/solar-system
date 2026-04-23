// ── SolarOverlay.js — Kuiper Belt zone + Spacecraft trajectory overlays ───
// Draws on a dedicated canvas sitting above the trail canvas.
// Only active when the solar scene is shown.
//
// K key → toggle Kuiper Belt overlay
// V key → toggle Spacecraft trajectory overlay

// ── Scale constants ────────────────────────────────────────────────────────
const AU_PX    = 16        // 1 AU = 16 px  (Neptune 30 AU = 480 px)
const CX       = 600       // canvas centre X
const CY       = 600       // canvas centre Y
const HALF     = 600       // half canvas size
const FONT     = '10px "Courier New", monospace'
const FONT_LG  = '11px "Courier New", monospace'

// ── Kuiper Belt dwarf planets ──────────────────────────────────────────────
// angle = direction from Sun (radians, 0 = right / +X)
const KB_OBJECTS = [
  { name: 'PLUTO',    au: 39,  angle: 0,               color: '#c4a882', radius: 5 },
  { name: 'HAUMEA',   au: 43,  angle: Math.PI * 0.42,  color: '#e8e0cc', radius: 5 },
  { name: 'MAKEMAKE', au: 45,  angle: Math.PI * 0.84,  color: '#c08060', radius: 5 },
  { name: 'ERIS',     au: 68,  angle: Math.PI * 1.35,  color: '#d8d0c8', radius: 5 },
  { name: 'SEDNA',    au: 506, angle: Math.PI * 1.75,  color: '#cc4422', radius: 4 },
]

// ── Spacecraft — angles derived from their spacecraft-scene startX/Y ────────
const SPACECRAFT = [
  { name: 'VOYAGER 1',    au: 164, angle: Math.atan2(-150,  310), color: '#88aaff' },
  { name: 'VOYAGER 2',    au: 137, angle: Math.atan2( 210, -210), color: '#ffaa44' },
  { name: 'NEW HORIZONS', au:  57, angle: Math.atan2(-265,  110), color: '#44ccaa' },
  { name: 'PIONEER 10',   au: 133, angle: Math.atan2(-110, -260), color: '#ffee55' },
  { name: 'PIONEER 11',   au: 102, angle: Math.atan2( 270,  -25), color: '#cc88ff' },
]

// ── State ──────────────────────────────────────────────────────────────────
let canvas   = null
let ctx      = null
let showKB   = false
let showSC   = false
let dashOffset = 0
let rafId    = null
let isSolar  = true   // set by caller

// ── Canvas helpers ─────────────────────────────────────────────────────────

/** Clamp a point to the canvas boundary; return {x, y, clamped} */
function clampToEdge(angle, dist) {
  const raw = { x: CX + Math.cos(angle) * dist, y: CY + Math.sin(angle) * dist }
  if (raw.x >= 0 && raw.x <= 1200 && raw.y >= 0 && raw.y <= 1200) {
    return { ...raw, clamped: false }
  }
  // Find intersection with canvas boundary
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  let t = Infinity
  if (cos > 0) t = Math.min(t, (1200 - CX) / cos)
  if (cos < 0) t = Math.min(t, -CX / cos)
  if (sin > 0) t = Math.min(t, (1200 - CY) / sin)
  if (sin < 0) t = Math.min(t, -CY / sin)
  return { x: CX + cos * t, y: CY + sin * t, clamped: true }
}

// ── Draw: Kuiper Belt ──────────────────────────────────────────────────────

function drawKuiperBelt() {
  ctx.save()

  // KB zone ring (30–50 AU)
  const innerR = 30 * AU_PX   // 480px — Neptune's orbit
  const outerR = 50 * AU_PX   // 800px

  // Faint filled annulus
  ctx.beginPath()
  ctx.arc(CX, CY, Math.min(outerR, HALF * 1.41), 0, Math.PI * 2)
  ctx.arc(CX, CY, innerR, 0, Math.PI * 2, true)
  ctx.fillStyle = 'rgba(150, 200, 255, 0.04)'
  ctx.fill()

  // Dashed inner border (Neptune's orbit edge)
  ctx.beginPath()
  ctx.arc(CX, CY, innerR, 0, Math.PI * 2)
  ctx.setLineDash([4, 8])
  ctx.strokeStyle = 'rgba(150, 200, 255, 0.15)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Dashed outer border
  ctx.beginPath()
  ctx.arc(CX, CY, Math.min(outerR, 595), 0, Math.PI * 2)
  ctx.setLineDash([3, 10])
  ctx.strokeStyle = 'rgba(150, 200, 255, 0.08)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Label
  ctx.setLineDash([])
  ctx.font = FONT
  ctx.fillStyle = 'rgba(150, 200, 255, 0.45)'
  ctx.fillText('KUIPER BELT', CX + innerR + 8, CY - 6)

  // Each dwarf planet
  for (const obj of KB_OBJECTS) {
    const dist = obj.au * AU_PX
    const pt   = clampToEdge(obj.angle, dist)

    // Line from neptune-orbit edge to object
    const inner = clampToEdge(obj.angle, innerR)
    ctx.beginPath()
    ctx.moveTo(inner.x, inner.y)
    ctx.lineTo(pt.x, pt.y)
    ctx.setLineDash([2, 5])
    ctx.strokeStyle = obj.color + '55'
    ctx.lineWidth = 0.8
    ctx.stroke()
    ctx.setLineDash([])

    // Dot
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, obj.radius, 0, Math.PI * 2)
    ctx.fillStyle = obj.color
    ctx.fill()
    ctx.strokeStyle = obj.color + 'aa'
    ctx.lineWidth = 0.5
    ctx.stroke()

    // Arrow indicator if clamped to edge
    if (pt.clamped) {
      const arrowSize = 5
      const cos = Math.cos(obj.angle)
      const sin = Math.sin(obj.angle)
      ctx.beginPath()
      ctx.moveTo(pt.x, pt.y)
      ctx.lineTo(pt.x - arrowSize * cos + arrowSize * sin * 0.5,
                 pt.y - arrowSize * sin - arrowSize * cos * 0.5)
      ctx.lineTo(pt.x - arrowSize * cos - arrowSize * sin * 0.5,
                 pt.y - arrowSize * sin + arrowSize * cos * 0.5)
      ctx.closePath()
      ctx.fillStyle = obj.color + 'cc'
      ctx.fill()
    }

    // Label
    ctx.font = FONT
    ctx.fillStyle = obj.color + 'cc'
    // Offset label to not overlap dot
    const offX = Math.cos(obj.angle + Math.PI / 2) * 9
    const offY = Math.sin(obj.angle + Math.PI / 2) * 9
    ctx.fillText(obj.name, Math.max(4, Math.min(1170, pt.x + offX + 4)), Math.max(12, Math.min(1195, pt.y + offY)))
    if (!pt.clamped) {
      ctx.fillStyle = obj.color + '77'
      ctx.fillText(`${obj.au} AU`, Math.max(4, Math.min(1170, pt.x + offX + 4)), Math.max(12, Math.min(1195, pt.y + offY + 12)))
    }
  }

  ctx.restore()
}

// ── Draw: Spacecraft Trajectories ──────────────────────────────────────────

function drawSpacecraft() {
  ctx.save()

  for (const sc of SPACECRAFT) {
    const edgePt = clampToEdge(sc.angle, 10000) // force to edge
    const cos = Math.cos(sc.angle)
    const sin = Math.sin(sc.angle)

    // Animated dashed trajectory line from Sun toward edge
    ctx.beginPath()
    ctx.moveTo(CX, CY)
    ctx.lineTo(edgePt.x, edgePt.y)
    ctx.setLineDash([6, 10])
    ctx.lineDashOffset = -dashOffset
    ctx.strokeStyle = sc.color + '55'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.setLineDash([])

    // Bright dot at edge (spacecraft marker)
    ctx.beginPath()
    ctx.arc(edgePt.x, edgePt.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = sc.color
    ctx.fill()
    ctx.strokeStyle = sc.color
    ctx.lineWidth = 1
    ctx.stroke()

    // Arrow tip
    const arrowLen = 7
    ctx.beginPath()
    ctx.moveTo(edgePt.x, edgePt.y)
    ctx.lineTo(edgePt.x - arrowLen * cos + arrowLen * 0.4 * sin,
               edgePt.y - arrowLen * sin - arrowLen * 0.4 * cos)
    ctx.lineTo(edgePt.x - arrowLen * cos - arrowLen * 0.4 * sin,
               edgePt.y - arrowLen * sin + arrowLen * 0.4 * cos)
    ctx.closePath()
    ctx.fillStyle = sc.color
    ctx.fill()

    // Label perpendicular to line, near edge
    const labelX = edgePt.x - cos * 30
    const labelY = edgePt.y - sin * 30
    const perpX  = -sin * 12
    const perpY  =  cos * 12
    ctx.font = FONT_LG
    ctx.fillStyle = sc.color + 'dd'
    ctx.fillText(sc.name, Math.max(4, Math.min(1100, labelX + perpX)), Math.max(14, Math.min(1195, labelY + perpY)))
    ctx.font = FONT
    ctx.fillStyle = sc.color + '88'
    ctx.fillText(`${sc.au} AU`, Math.max(4, Math.min(1100, labelX + perpX)), Math.max(14, Math.min(1195, labelY + perpY + 13)))
  }

  ctx.restore()
}

// ── Render loop ────────────────────────────────────────────────────────────

function render() {
  rafId = requestAnimationFrame(render)

  if (!showKB && !showSC) return
  if (!isSolar) return

  ctx.clearRect(0, 0, 1200, 1200)

  if (showKB) drawKuiperBelt()
  if (showSC) drawSpacecraft()

  dashOffset = (dashOffset + 0.3) % 32
}

// ── HUD badges ─────────────────────────────────────────────────────────────

function updateHUD() {
  const kb = document.getElementById('overlay-hud-k')
  const sc = document.getElementById('overlay-hud-v')
  if (kb) kb.classList.toggle('active', showKB)
  if (sc) sc.classList.toggle('active', showSC)
}

// ── Public API ─────────────────────────────────────────────────────────────

export function setOverlaySolar(active) {
  isSolar = active
  if (!active) ctx?.clearRect(0, 0, 1200, 1200)
  updateHUD()

  const hud = document.getElementById('overlay-hud')
  if (hud) hud.style.display = active ? 'flex' : 'none'
}

export function initSolarOverlay(bus) {
  // Create overlay canvas
  const space = document.querySelector('.space')
  canvas = document.createElement('canvas')
  canvas.id     = 'overlay-canvas'
  canvas.width  = 1200
  canvas.height = 1200
  space.insertBefore(canvas, space.querySelector('#trail-canvas').nextSibling)
  ctx = canvas.getContext('2d')

  // Create HUD toggle indicators
  const hud = document.createElement('div')
  hud.id = 'overlay-hud'
  hud.style.display = 'none'
  hud.innerHTML = `
    <button id="overlay-hud-k" class="overlay-hud-btn" title="Toggle Kuiper Belt [K]">
      ◌ KUIPER
    </button>
    <button id="overlay-hud-v" class="overlay-hud-btn" title="Toggle Spacecraft [V]">
      ▶ PROBES
    </button>
  `
  document.body.appendChild(hud)

  document.getElementById('overlay-hud-k').addEventListener('click', () => {
    showKB = !showKB
    updateHUD()
  })
  document.getElementById('overlay-hud-v').addEventListener('click', () => {
    showSC = !showSC
    updateHUD()
  })

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return
    if (!isSolar) return

    if (e.key === 'k' || e.key === 'K') {
      showKB = !showKB
      updateHUD()
    }
    if (e.key === 'v' || e.key === 'V') {
      showSC = !showSC
      updateHUD()
    }
  })

  // React to scene changes
  bus?.on?.('scene:changed', ({ sceneId }) => {
    setOverlaySolar(sceneId === 'solar')
    if (sceneId !== 'solar') {
      ctx.clearRect(0, 0, 1200, 1200)
    }
  })

  // Show HUD immediately — app always starts on solar scene
  setOverlaySolar(true)

  render()
}
