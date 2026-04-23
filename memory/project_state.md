---
name: Project State
description: Current state of Universe Simulation and upcoming roadmap items
type: project
---

All 11 scenes are live and working. Architecture is solid (EventBus, SceneManager, Simulation, Body, Vector, Gravity, DataService, Comparator — all modular ES6).

**Next roadmap (in priority order):**

1. Real NASA/Hubble/JWST textures — CSS background-image swap on planet divs, images in /assets/textures/. Public domain sources. Biggest visual upgrade for least code change.
2. Kuiper Belt + Spacecraft as toggleable layers in Solar scene (K = kuiper toggle, V = spacecraft toggle). Dedicated scenes stay for deep-dive.
3. Time controls — Space to pause, speed slider (0.1×–200×), time direction toggle.
4. Responsive canvas — scale .space to min(100vw, 100vh).
5. Scale toggle (S key) — visual vs realistic scale.
6. URL hash state — #solar, #blackholes etc., shareable links.

**Why:** textures make it look like a real educational tool, not a school project. The M87* black hole photo and JWST galaxy images especially.
