/**
 * Comparator.js
 * Side-by-side comparison tool for any two celestial bodies.
 * Pulls data from planetData and radius from body configs.
 */

import { planetData, bodyConfig, sceneBodyConfigs } from './data.js'

// All bodies organised by category for the dropdown
const CATEGORIES = [
  {
    label: '── Solar System ──',
    ids: ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
  },
  {
    label: '── Stellar Remnants ──',
    ids: ['siriusA', 'siriusB', 'velaPulsar', 'sagittariusA'],
  },
  {
    label: '── TRAPPIST-1 System ──',
    ids: ['trappist1', 'trappist1b', 'trappist1c', 'trappist1d', 'trappist1e', 'trappist1f', 'trappist1g', 'trappist1h'],
  },
  {
    label: '── Black Holes ──',
    ids: ['ton618', 'm87bh', 'cygnusX1', 'hde226868'],
  },
  {
    label: '── Supergiant Stars ──',
    ids: ['betelgeuse', 'vyCanisMajoris', 'r136a1'],
  },
  {
    label: '── Neutron Stars ──',
    ids: ['psrJ0348', 'psrJ0348Companion', 'magnetar'],
  },
  {
    label: '── Galaxies ──',
    ids: ['milkyWayGal', 'andromedaGal', 'largeMagellanicCloud', 'm87Galaxy'],
  },
  {
    label: '── White Dwarfs ──',
    ids: ['fortyEridaniA', 'fortyEridaniB', 'procyonA', 'procyonB'],
  },
  {
    label: '── Red Dwarfs ──',
    ids: ['proximaCentauri', 'proximaB', 'proximaC', 'proximaD', 'barnardStar', 'barnardPlanet', 'wolf359'],
  },
  {
    label: '── Kuiper Belt ──',
    ids: ['eris', 'makemake', 'haumea', 'sedna'],
  },
  {
    label: '── Spacecraft ──',
    ids: ['voyager1', 'voyager2', 'newHorizons', 'pioneer10', 'pioneer11'],
  },
]

// Rows to display in the comparison panel
const COMPARE_ROWS = [
  { key: 'subtitle',    label: 'TYPE' },
  { key: 'distance',    label: 'DISTANCE' },
  { key: 'diameter',    label: 'DIAMETER' },
  { key: 'temperature', label: 'TEMPERATURE' },
  { key: 'gravity',     label: 'GRAVITY' },
  { key: 'period',      label: 'ORBITAL PERIOD' },
  { key: 'dayLength',   label: 'DAY LENGTH' },
  { key: 'moons',       label: 'MOONS' },
  { key: 'atmosphere',  label: 'ATMOSPHERE' },
]

/** Get display radius for a body (for the size orb) */
function getRadius(id) {
  const solar = bodyConfig.find(b => b.id === id)
  if (solar) return solar.radius
  const scene = sceneBodyConfigs[id]
  if (scene) return scene.radius
  return 8
}

/** Build the <optgroup>/<option> HTML for all dropdowns */
function buildOptions(selectedId = '') {
  return CATEGORIES.map(cat => {
    const validIds = cat.ids.filter(id => planetData[id])
    if (!validIds.length) return ''
    const opts = validIds.map(id => {
      const d = planetData[id]
      const sel = id === selectedId ? ' selected' : ''
      return `<option value="${id}"${sel}>${d.symbol || '◉'} ${d.name}</option>`
    }).join('')
    return `<optgroup label="${cat.label}">${opts}</optgroup>`
  }).join('')
}

/** Render one column's data card */
function renderCard(id) {
  if (!id || !planetData[id]) {
    return `<div class="compare-empty">SELECT A BODY</div>`
  }
  const d = planetData[id]
  const r = getRadius(id)
  // Clamp orb size: 20px–90px
  const orbSize = Math.max(20, Math.min(90, r * 1.8))

  const rows = COMPARE_ROWS.map(row => {
    const val = d[row.key] ?? '—'
    return `
      <div class="compare-row">
        <span class="compare-label">${row.label}</span>
        <span class="compare-value">${val}</span>
      </div>`
  }).join('')

  const factsHtml = d.facts?.slice(0, 3).map(f =>
    `<li>${f}</li>`
  ).join('') ?? ''

  return `
    <div class="compare-card">
      <div class="compare-orb-wrap">
        <div class="compare-orb" style="width:${orbSize}px;height:${orbSize}px"></div>
      </div>
      <div class="compare-name">${d.symbol || ''} ${d.name}</div>
      <div class="compare-subtitle">${d.subtitle || ''}</div>
      <div class="compare-rows">${rows}</div>
      <div class="compare-facts-title">KEY FACTS</div>
      <ul class="compare-facts">${factsHtml}</ul>
    </div>`
}

/** Initialise the comparator UI */
export function initComparator() {
  const modal   = document.getElementById('compare-modal')
  const openBtn = document.getElementById('compare-btn')
  const closeBtn = document.getElementById('compare-close')
  const selL    = document.getElementById('select-left')
  const selR    = document.getElementById('select-right')
  const cardL   = document.getElementById('compare-card-left')
  const cardR   = document.getElementById('compare-card-right')

  if (!modal) return

  // Populate dropdowns
  const blankOpt = '<option value="">── SELECT A BODY ──</option>'
  selL.innerHTML = blankOpt + buildOptions('earth')
  selR.innerHTML = blankOpt + buildOptions('mars')

  // Render initial cards
  cardL.innerHTML = renderCard('earth')
  cardR.innerHTML = renderCard('mars')

  // Open / close
  function open()  { modal.style.display = 'flex' }
  function close() { modal.style.display = 'none'  }

  openBtn?.addEventListener('click', open)
  closeBtn?.addEventListener('click', close)
  modal.addEventListener('click', (e) => { if (e.target === modal) close() })

  // Keyboard shortcut C
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return
    if (e.key === 'c' || e.key === 'C') {
      modal.style.display === 'none' ? open() : close()
    }
    if (e.key === 'Escape' && modal.style.display !== 'none') close()
  })

  // On selection change — re-render card
  selL.addEventListener('change', () => { cardL.innerHTML = renderCard(selL.value) })
  selR.addEventListener('change', () => { cardR.innerHTML = renderCard(selR.value) })
}
