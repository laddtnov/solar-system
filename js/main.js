import { Simulation } from './Simulation.js'
import { initUI, initStarParallax } from './ui.js'
import { EventBus } from './EventBus.js'
import { DataService } from './services/DataService.js'
import { SceneManager } from './SceneManager.js'
import { initComparator } from './Comparator.js'
import { initQuiz } from './Quiz.js'

const bus = new EventBus()
const dataService = new DataService({ bus })
dataService.bootstrap()

const trailCanvas = document.getElementById('trail-canvas')
const sim = new Simulation(trailCanvas)
sim.init()

// Initialize Scene Manager
const sceneManager = new SceneManager({
  simulation: sim,
  bus,
  container: document.querySelector('.space'),
  trailCanvas
})

initUI({ simulation: sim, bus, dataService, sceneManager })
initStarParallax()
initComparator()
initQuiz()

// Wire scene switcher buttons
document.querySelectorAll('#scene-switcher .scene-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const sceneId = btn.dataset.scene
    sceneManager.switchScene(sceneId)
    
    // Update active state
    document.querySelectorAll('#scene-switcher .scene-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
  })
})

// Listen for scene changes to update UI
bus?.on?.('scene:changed', ({ sceneId }) => {
  document.querySelectorAll('#scene-switcher .scene-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.scene === sceneId)
  })

  // Show date panel only in solar scene
  const datePanel = document.getElementById('date-panel')
  if (datePanel) datePanel.style.display = sceneId === 'solar' ? 'flex' : 'none'

  // Exit date mode when leaving solar scene
  if (sceneId !== 'solar' && sim.dateMode) sim.resumeLiveMode()
})

// ── Date Calculator controls ─────────────────────────────────────────────
const dateInput   = document.getElementById('date-input')
const dateGoBtn   = document.getElementById('date-go-btn')
const dateTodayBtn = document.getElementById('date-today-btn')
const dateLiveBtn  = document.getElementById('date-live-btn')

// Default date input to today
if (dateInput) {
  const today = new Date()
  dateInput.value = today.toISOString().slice(0, 10)
}

dateGoBtn?.addEventListener('click', () => {
  const date = new Date(dateInput.value + 'T12:00:00Z')
  if (!isNaN(date)) sim.goToDate(date)
})

dateTodayBtn?.addEventListener('click', () => {
  const today = new Date()
  dateInput.value = today.toISOString().slice(0, 10)
  sim.goToDate(today)
})

dateLiveBtn?.addEventListener('click', () => {
  sim.resumeLiveMode()
})

// Also trigger on Enter key in date input
dateInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const date = new Date(dateInput.value + 'T12:00:00Z')
    if (!isNaN(date)) sim.goToDate(date)
  }
})

// Expose for debugging and external controls
window.__sim = sim
window.__bus = bus
window.__dataService = dataService
window.__sceneManager = sceneManager
