import { Simulation } from './Simulation.js'
import { initUI, initStarParallax } from './ui.js'
import { EventBus } from './EventBus.js'
import { DataService } from './services/DataService.js'
import { SceneManager } from './SceneManager.js'

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
})

// Expose for debugging and external controls
window.__sim = sim
window.__bus = bus
window.__dataService = dataService
window.__sceneManager = sceneManager
