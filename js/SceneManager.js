import { scenes, sceneBodyConfigs, bodyConfig } from './data.js'

/**
 * SceneManager - Handles switching between different celestial scenes
 * Solar System, Stellar Remnants, Exoplanets, etc.
 */
export class SceneManager {
  constructor(options = {}) {
    this.simulation = options.simulation || null
    this.bus = options.bus || null
    this.container = options.container || document.querySelector('.space')
    this.trailCanvas = options.trailCanvas || document.getElementById('trail-canvas')
    
    this.currentScene = 'solar'
    this.bodies = new Map()
    this.domElements = new Map()
    
    this._init()
  }

  _init() {
    // Listen for scene switch events
    this.bus?.on?.('scene:switch', (sceneId) => this.switchScene(sceneId))
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return
      
      switch(e.key) {
        case '1':
          this.switchScene('solar')
          break
        case '2':
          this.switchScene('stellar')
          break
        case '3':
          this.switchScene('exoplanets')
          break
        case '4':
          this.switchScene('blackholes')
          break
        case '5':
          this.switchScene('supergiants')
          break
        case '6':
          this.switchScene('neutrons')
          break
        case '7':
          this.switchScene('galaxies')
          break
        case '8':
          this.switchScene('whitedwarfs')
          break
        case '9':
          this.switchScene('reddwarfs')
          break
        case '0':
          this.switchScene('kuiperbelt')
          break
        case 'q':
        case 'Q':
          this.switchScene('spacecraft')
          break
      }
    })
  }

  /**
   * Get all available scenes
   */
  getScenes() {
    return Object.values(scenes)
  }

  /**
   * Get current active scene
   */
  getCurrentScene() {
    return scenes[this.currentScene]
  }

  /**
   * Switch to a different scene
   */
  async switchScene(sceneId) {
    if (!scenes[sceneId]) {
      console.warn(`Scene "${sceneId}" not found`)
      return false
    }

    if (this.currentScene === sceneId) {
      return true
    }

    // Clear trails
    const ctx = this.trailCanvas?.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height)
    }

    // Clear current bodies from simulation
    if (this.simulation) {
      this.simulation.clearBodies()
    }

    // Hide all existing celestial DOM elements
    this._hideAllBodies()

    // Set new scene
    this.currentScene = sceneId
    const scene = scenes[sceneId]

    // Show/create scene-specific bodies
    this._createSceneBodies(scene)

    // Update background
    this._updateBackground(scene.backgroundType)

    // Emit event
    this.bus?.emit?.('scene:changed', { sceneId, scene })

    return true
  }

  /**
   * Hide all celestial body DOM elements
   */
  _hideAllBodies() {
    document.querySelectorAll('.space > div[data-body], .space > .satellite').forEach(el => {
      el.style.display = 'none'
    })
    document.querySelectorAll('.scene-body').forEach(el => {
      el.style.display = 'none'
    })
    // Asteroid belt is CSS-only (no data-body) — hide it here, restore in solar only
    const belt = document.querySelector('.asteroid-belt')
    if (belt) belt.style.display = 'none'
    // Kuiper belt ring — hide here, restore in kuiperbelt scene only
    const kuiper = document.querySelector('.kuiper-belt-ring')
    if (kuiper) kuiper.style.display = 'none'
  }

  /**
   * Create/show bodies for current scene
   */
  _createSceneBodies(scene) {
    const configs = []
    
    // Get body configs for this scene
    const bodyIds = scene.bodyIds
    
    bodyIds.forEach(bodyId => {
      let config
      
      // Check if it's a scene-specific body or solar system body
      if (sceneBodyConfigs[bodyId]) {
        config = sceneBodyConfigs[bodyId]
        this._ensureSceneBodyElement(config)
      } else {
        // Solar system body
        config = bodyConfig.find(b => b.id === bodyId)
        const el = document.querySelector(config?.domSelector)
        if (el) {
          el.style.display = 'block'
        }
      }
      
      if (config) {
        configs.push(config)
      }
    })
    
    // Restore asteroid belt only for the solar scene
    const belt = document.querySelector('.asteroid-belt')
    if (belt) belt.style.display = scene.id === 'solar' ? '' : 'none'
    // Restore Kuiper belt ring only for the kuiperbelt scene
    const kuiper = document.querySelector('.kuiper-belt-ring')
    if (kuiper) kuiper.style.display = scene.id === 'kuiperbelt' ? '' : 'none'

    // Build bodies using Simulation's method for proper position/velocity calculation
    if (this.simulation && configs.length > 0) {
      this.simulation.buildBodiesFromConfig(configs)
    }
  }

  /**
   * Ensure scene-specific body element exists in DOM
   */
  _ensureSceneBodyElement(config) {
    let el = document.querySelector(config.domSelector)
    
    if (!el) {
      el = document.createElement('div')
      // Use the CSS class from domSelector so styles apply correctly
      const cssClass = config.domSelector.replace(/^\./, '')
      el.className = `scene-body ${cssClass}`
      el.dataset.body = config.id

      if (config.pulseEffect) {
        el.classList.add('pulsar')
      }
      if (config.accretionDisk) {
        el.classList.add('black-hole')
        const disk = document.createElement('div')
        disk.className = 'accretion-disk'
        el.appendChild(disk)
      }
      if (config.glowEffect) {
        el.classList.add('red-dwarf')
      }

      this.container.appendChild(el)
    }
    
    el.style.display = 'block'
    this.domElements.set(config.id, el)
    
    return el
  }

  /**
   * Update background based on scene type
   */
  _updateBackground(type) {
    const canvas = document.getElementById('stars-bg')
    if (!canvas) return
    
    // Remove old background classes
    canvas.className = ''
    
    // Add new background class
    switch(type) {
      case 'nebula':
        canvas.classList.add('bg-nebula')
        break
      case 'deep':
        canvas.classList.add('bg-deep')
        break
      case 'blackhole':
        canvas.classList.add('bg-blackhole')
        break
      case 'galaxy':
        canvas.classList.add('bg-galaxy')
        break
      default:
        canvas.classList.add('bg-stars')
    }
  }

  /**
   * Reset current scene to initial state
   */
  reset() {
    this.switchScene(this.currentScene)
  }

  /**
   * Check if a body belongs to current scene
   */
  isBodyInCurrentScene(bodyId) {
    const scene = scenes[this.currentScene]
    return scene?.bodyIds?.includes(bodyId) || false
  }
}
