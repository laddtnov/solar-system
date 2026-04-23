# Universe Simulation — Roadmap

## Already Shipped

- Solar System scene with full physics (gravity, orbital mechanics)
- 9 scenes: Solar, Stellar Remnants, Exoplanets (TRAPPIST-1), Black Holes, Supergiants, Neutron Stars, Galaxies, White Dwarfs, Red Dwarfs
- Kuiper Belt + Spacecraft as Solar System overlays (K / V keys) — dedicated scenes removed
- Date-based real planetary position calculator
- Planet/body comparison tool (key C)
- EventBus, SceneManager, DataService, Comparator modules
- Sound system (Web Audio API), typewriter UI, trail canvas
- Command center terminal removed (keyboard shortcuts cover all actions)
- Daily space facts quiz (True/False, 10 facts/day, date-seeded, midnight countdown)
- Real NASA/ESA/EHT photo textures — all planets + deep sky bodies
- Time controls: Space=pause, R=reverse, slider 0.1×–200×
- Responsive canvas: continuous CSS scale via `--space-scale` var
- URL hash state: `#solar`, `#blackholes` etc. — shareable scene links

---

## Next Up

### 1. Cosmic Zoom

Scroll wheel (or pinch on mobile) to zoom in/out of the `.space` container.

- Mouse wheel → scale up/down around cursor point
- Zoom range: ~0.3× (whole system visible) to ~5× (inner planets fill screen)
- Combine with time controls for a full orrery feel

---

### 2. Body Info Panel on Click

Click any planet, star, or body → side drawer slides in with real data.

- Mass, diameter, distance from parent, surface temp, number of moons
- Data already exists in `data.js` / `Comparator` — just needs a click surface
- Close on Escape or click outside
- Cyberpunk card aesthetic, consistent with compare modal

---

### 3. Scale Toggle (S key)

- `S` → switch between **Visual scale** (current — bodies enlarged to be visible) and **Realistic scale** (true proportions)
- At realistic scale planets nearly vanish — dramatic and educational

---

### 4. Big Bang Timeline

A horizontal scrubber across the full history of the universe.

- 0s → Planck epoch → quark soup → first stars → galaxy formation → today
- Each era: short label + visual (expanding glow, particle rain, proto-galaxies)
- Pure canvas, no physics required

---

### 5. Gravitational Lensing (Black Holes scene)

Bend the starfield behind M87* using canvas radial distortion — Kepler/TESS style light-bending effect.

---

## Priority Order

1. Zoom — most natural missing interaction
2. Body info panel — gives every body a reason to exist
3. Scale toggle — educational gut-punch
4. Big Bang timeline — storytelling feature
5. Gravitational lensing — visual spectacle
