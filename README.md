# 🌌 Universe Simulation — Gravity & Beyond

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

An interactive universe simulation with real-time gravitational physics across **7 switchable scenes** — from our Solar System to black holes, supergiant stars, neutron stars, and galaxies. No frameworks, no build step, pure HTML/CSS/JS.

[🌐 Live Demo](https://solar.laddtnov.xyz/) • [📁 Portfolio](https://laddtnov.xyz/)

</div>

---

## 🪐 Scene Overview

Switch between 7 scenes using the sidebar buttons or keyboard keys **1–7**:

| Key | Scene | Bodies |
|-----|-------|--------|
| `1` | ☉ **Solar System** | Sun, 8 planets, Pluto, 10 moons, asteroid belt |
| `2` | ✦ **Stellar Remnants** | Sirius A/B binary, Vela Pulsar, Sagittarius A* |
| `3` | ✧ **TRAPPIST-1** | Ultra-cool red dwarf + 3 rocky exoplanets |
| `4` | ◉ **Black Holes** | TON 618, M87*, Cygnus X-1 + companion star (live binary orbit) |
| `5` | ★ **Supergiant Stars** | Betelgeuse, VY Canis Majoris, R136a1 |
| `6` | ⊙ **Neutron Stars** | Vela Pulsar, PSR J0348 + white dwarf binary, SGR 1806-20 magnetar |
| `7` | ⊛ **Galaxies** | Milky Way, Andromeda, Large Magellanic Cloud, M87 galaxy |

---

## ✨ Features

### 🪐 Solar System Physics
- **9 Planets + Dwarf Planet** — Mercury through Pluto, all driven by Newtonian gravity
- **10 Natural Satellites** — Moon, Phobos, Deimos, Io, Europa, Ganymede, Titan, Titania, Triton, Charon
- **Real Physics** — Velocity-Verlet integration with adaptive sub-stepping
- **Orbit Trails** — Canvas-drawn trails with alpha fade + soft orbit guide circles
- **Time Acceleration** — 1x / 10x / 50x / 200x
- **Asteroid Belt** — CSS box-shadow technique (80+ asteroids, 1 DOM element), shown only in Solar scene
- **Planetary Rings** — Jupiter, Saturn, Uranus, Neptune

### ◉ Black Holes
- **TON 618** — 66 billion solar masses, massive rotating accretion disk
- **M87*** — First ever photographed black hole, 6.5 billion solar masses
- **Cygnus X-1** — Stellar-mass BH in live physics binary orbit with companion star HDE 226868
- Spinning accretion disks rendered in CSS conic-gradients at different speeds per object

### ★ Supergiant Stars
- **Betelgeuse** — Red supergiant, 700× Sun's radius, slow pulsing glow
- **VY Canis Majoris** — Extreme red hypergiant, one of the largest known stars
- **R136a1** — Blue Wolf-Rayet, 196× solar mass, flickering stellar-wind effect

### ⊙ Neutron Stars & Magnetars
- **Vela Pulsar** — 11 rotations/second, lighthouse beam animation
- **PSR J0348+0432** — Most massive neutron star known, in live physics binary with a white dwarf companion
- **SGR 1806-20** — Magnetar with purple magnetic field lines

### ⊛ Galaxies
- **Milky Way** — Barred spiral with slow rotating conic-gradient arms and golden core
- **Andromeda** — Large blue-white spiral with counter-rotation
- **Large Magellanic Cloud** — Irregular satellite galaxy
- **M87** — Elliptical giant with its 5,000 light-year relativistic jet rendered as a CSS line

### 💚 Fallout-Style Terminal
- **Interactive Data Cards** — Click any body for detailed scientific data
- **Typewriter Effect** — Text types out character-by-character with synthesized sound
- **Terminal Aesthetic** — Green monochrome CRT with scanlines & flicker
- Full astronomical data: distance, diameter, temperature, gravity, moons, atmosphere, classified facts

### 🎨 Visual Effects
- Per-scene backgrounds (nebula, deep space, blackhole void, galaxy cluster)
- Accretion disk animations (conic-gradient rotating)
- Pulsar beam animations synced to real rotation frequencies
- Supergiant pulsing glow and Wolf-Rayet stellar wind flicker
- Galaxy spiral rotation (different speeds and directions per galaxy)
- Hover tooltip labels on all 7 scene switcher buttons
- 220-star parallax background responding to mouse movement

---

## 🚀 Technologies

### Core Stack
- **HTML5** — Semantic markup, `<canvas>` for orbit trails and star parallax
- **CSS3** — All celestial visuals: planets, glow, accretion disks, galaxy spirals, pulsar beams
  - `conic-gradient` for accretion disks and galaxy spiral arms
  - `radial-gradient` for star surfaces
  - `box-shadow` for 80+ asteroid belt particles (1 element)
  - `will-change: transform` for GPU-composited positioning
- **JavaScript ES6 Modules** — Physics engine, scene management, UI

### Physics Engine
- **Integrator:** Velocity-Verlet (symplectic, energy-conserving)
- **Adaptive sub-stepping:** `MAX_SUB_DT = 0.012s` keeps Mercury accurate at 200×
- **N-body gravity:** Full gravitational interaction between all active bodies
- **Circular orbit initialization:** `v = √(G·M/r)` for stable initial conditions
- **Static body support:** `startX/startY` positioning for display-only objects
- **Scene isolation:** Physics cleared and rebuilt on every scene switch

### Architecture
- **ES module architecture** — 9 focused modules, no bundler needed
- **SceneManager** — Declarative scene definitions, dynamic DOM creation, scene switching
- **EventBus** — Pub/sub for decoupled UI ↔ simulation communication
- **DataService** — Centralized data layer with caching
- **Immutable vectors** — All `Vector` operations return new instances
- **Flat array trails** — `[x0,y0,x1,y1,...]` ring buffer for memory efficiency

---

## 📂 Project Structure

```
solar-system-ultimate/
├── index.html              # HTML layout + 7-button scene switcher
├── styles.css              # All visuals: planets, black holes, galaxies, scene backgrounds
├── js/
│   ├── main.js             # Entry point — wires all modules
│   ├── SceneManager.js     # Scene switching, dynamic body creation, keyboard shortcuts
│   ├── Simulation.js       # Physics loop, adaptive sub-stepping, trail canvas
│   ├── Body.js             # Celestial body: pos, vel, mass, trail[], DOM element
│   ├── Gravity.js          # N-body gravity + Velocity-Verlet integration
│   ├── Vector.js           # Immutable 2D vector math
│   ├── EventBus.js         # Pub/sub event system
│   ├── data.js             # planetData (display) + bodyConfig + sceneBodyConfigs + scenes
│   └── services/
│       └── DataService.js  # Data fetching and caching
├── README.md
└── LICENSE
```

### Module Dependency Graph
```
main.js
├── Simulation.js → Vector.js, Body.js, Gravity.js, data.js
├── SceneManager.js → data.js
├── EventBus.js
└── ui.js → data.js
```

---

## 🎯 Celestial Bodies Reference

### Solar System (Scene 1)
| Body | Diameter | Orbit Period |
|------|----------|--------------|
| ☉ Sun | 1,392,000 km | — |
| ☿ Mercury | 4,879 km | 88 days |
| ♀ Venus | 12,104 km | 225 days |
| 🜨 Earth + Moon | 12,742 km | 365 days |
| ♂ Mars + 2 moons | 6,779 km | 687 days |
| ♃ Jupiter + 3 moons | 139,820 km | 11.9 years |
| ♄ Saturn + Titan | 116,460 km | 29.5 years |
| ♅ Uranus + Titania | 50,724 km | 84 years |
| ♆ Neptune + Triton | 49,244 km | 165 years |
| ♇ Pluto + Charon | 2,377 km | 248 years |

### Black Holes (Scene 4)
| Object | Mass | Notes |
|--------|------|-------|
| TON 618 | 66 billion M☉ | Hypermassive quasar BH |
| M87* | 6.5 billion M☉ | First photographed BH (2019) |
| Cygnus X-1 | 21 M☉ | Live binary orbit with HDE 226868 |

### Supergiant Stars (Scene 5)
| Star | Size | Type |
|------|------|------|
| Betelgeuse | 700× Sun radius | Red supergiant |
| VY Canis Majoris | 1,400–2,000× Sun radius | Red hypergiant |
| R136a1 | 196× solar mass | Blue Wolf-Rayet |

### Neutron Stars (Scene 6)
| Object | Rotation | Notes |
|--------|----------|-------|
| Vela Pulsar | 11×/sec | Supernova remnant |
| PSR J0348+0432 | 25.6×/sec | Most massive neutron star |
| SGR 1806-20 | 8×/min | Magnetar — strongest magnetic field |

### Galaxies (Scene 7)
| Galaxy | Type | Distance |
|--------|------|----------|
| Milky Way | Barred spiral | Home |
| Andromeda | Spiral | 2.5 million ly |
| Large Magellanic Cloud | Irregular | 162,000 ly |
| M87 | Elliptical + jet | 53.5 million ly |

---

## 💻 Installation & Usage

### Quick Start

```bash
git clone https://github.com/laddtnov/laddtnov-hub.git
cd solar-system-ultimate

# Serve locally (ES modules require a server)
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080` — no build step, no dependencies.

### Keyboard Controls

| Key | Action |
|-----|--------|
| `1` | Solar System |
| `2` | Stellar Remnants |
| `3` | TRAPPIST-1 |
| `4` | Black Holes |
| `5` | Supergiant Stars |
| `6` | Neutron Stars |
| `7` | Galaxies |
| `]` or `=` | Speed up |
| `[` or `-` | Slow down |
| `Space` | Pause / Resume |
| `Esc` | Close modal |

---

## 📱 Responsive Design

```css
/* Desktop: Full 1200×1200 scene */
Default

/* Tablet: Scaled 70% */
@media (max-width: 1024px) { .space { transform: scale(0.7); } }

/* Mobile: Scaled 50% */
@media (max-width: 768px)  { .space { transform: scale(0.5); } }

/* Small Mobile */
@media (max-width: 480px)  { .space { transform: scale(0.35); } }
```

---

## ⚡ Performance

### Physics Budget (per frame at 60fps)
| Operation | Cost |
|-----------|------|
| N-body gravity + Verlet (adaptive steps) | ~0.5ms |
| Trail canvas rendering | ~0.5ms |
| DOM transforms (per active scene) | ~0.3ms |
| Star parallax (220 arcs) | ~0.2ms |
| **Total** | **~1.5ms** (well under 16ms budget) |

### Adaptive Sub-Stepping
| Speed | Steps/frame |
|-------|-------------|
| 1× | 4 |
| 10× | ~14 |
| 50× | ~70 |
| 200× | ~278 (capped at 150 on mobile) |

---

## 🗺️ Roadmap

### Completed ✅
- [x] Solar system — 9 planets, 10 moons, asteroid belt, rings
- [x] Gravitational physics (Velocity-Verlet, adaptive sub-stepping)
- [x] Orbit trails (canvas, alpha fade)
- [x] Time controls (1× / 10× / 50× / 200× + pause)
- [x] Fallout terminal interface with typewriter sound
- [x] Responsive design (4 breakpoints)
- [x] ES6 module architecture
- [x] Star parallax background
- [x] Scene switcher — 7 scenes (keys 1–7)
- [x] Stellar Remnants (Sirius binary, Vela Pulsar, Sagittarius A*)
- [x] TRAPPIST-1 exoplanet system
- [x] Black Holes (TON 618, M87*, Cygnus X-1 binary)
- [x] Supergiant Stars (Betelgeuse, VY CMa, R136a1)
- [x] Neutron Stars & Magnetars (PSR J0348 binary, SGR 1806-20)
- [x] Galaxies (Milky Way, Andromeda, LMC, M87)
- [x] Real scientific data for all 30+ objects

### Next Up 🔜
- [ ] White dwarf scene (Sirius B, 40 Eridani B)
- [ ] Red dwarf stars (Proxima Centauri system)
- [ ] Complete TRAPPIST-1 (all 7 planets)
- [ ] Kuiper Belt & dwarf planets
- [ ] Spacecraft trajectories (Voyager, New Horizons)
- [ ] Date-based real position calculator
- [ ] Planet comparison tool

---

## 🛠️ Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | iOS 14+ | ✅ Full |

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 📬 Contact

**Laddtnov**
- GitHub: [@laddtnov](https://github.com/laddtnov)
- Email: novytskiyvladislav@proton.me
- Portfolio: [laddtnov.xyz](https://laddtnov.xyz/)

---

<div align="center">

### 💚 Built with passion for space and retro-futurism 💚

**Pure HTML · CSS · JavaScript — no frameworks, no bundlers**

**If you like this project, give it a ⭐**

[![GitHub stars](https://img.shields.io/github/stars/laddtnov/interactive-solar-system?style=social)](https://github.com/laddtnov/interactive-solar-system/stargazers)

</div>
