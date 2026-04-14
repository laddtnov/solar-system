import { Simulation } from './Simulation.js'
import { initUI, initStarParallax } from './ui.js'
import { EventBus } from './EventBus.js'
import { DataService } from './services/DataService.js'

const bus = new EventBus()
const dataService = new DataService({ bus })
dataService.bootstrap()

const trailCanvas = document.getElementById('trail-canvas')
const sim = new Simulation(trailCanvas)
sim.init()

initUI({ simulation: sim, bus, dataService })
initStarParallax()

// Expose simulation for mobile speed controls
window.__sim = sim
window.__bus = bus
window.__dataService = dataService
