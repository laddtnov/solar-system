# Universe Simulation — Roadmap

## Already Shipped

- Solar System scene with full physics (gravity, orbital mechanics)
- 11 scenes: Solar, Stellar Remnants, Exoplanets (TRAPPIST-1), Black Holes, Supergiants, Neutron Stars, Galaxies, White Dwarfs, Red Dwarfs, Kuiper Belt, Spacecraft Trajectories
- Date-based real planetary position calculator
- Planet/body comparison tool (key C)
- EventBus, SceneManager, DataService, Comparator modules
- Sound system (Web Audio API), typewriter UI, trail canvas

---

## Next Up

### 1. Real NASA / Hubble / JWST Textures

Replace CSS gradient bodies with actual photographs. All sources are public domain (NASA) or free for educational use (ESA/ESO/EHT).

**Solar System planets**
- Sun — SOHO/SDO solar disk
- Mercury, Venus, Mars — Mariner/MRO
- Earth — Blue Marble (Apollo/DSCOVR)
- Jupiter — Juno closeup
- Saturn — Cassini with rings visible
- Uranus, Neptune — Voyager 2
- Moon — LRO
- Pluto — New Horizons heart photo

**Deep sky scenes**
- Black holes — M87* EHT image (2019), Sgr A* (2022)
- Galaxies — Andromeda (Hubble), JWST deep field
- Neutron stars — Crab Nebula pulsar (Chandra X-ray)
- Supergiant — Betelgeuse surface (ALMA/VLTI)
- White dwarfs — Sirius B (Hubble)
- Red dwarfs — Proxima Centauri (Hubble)
- Kuiper Belt — Pluto surface detail (New Horizons)

**Implementation:** CSS `background-image` + `background-size: cover` + `border-radius: 50%` on existing planet divs. No simulation changes needed. Store images in `/assets/textures/`.

---

### 2. Kuiper Belt + Spacecraft as Solar System Layers

Move Kuiper Belt objects and Spacecraft trajectories into the main Solar System scene as **toggleable overlays** — because they are literally part of our solar system.

- Press `K` → toggle Kuiper Belt objects (Pluto, Eris, Makemake, Haumea, Sedna) at scaled positions
- Press `V` → toggle Spacecraft trajectory lines (Voyager 1/2, New Horizons, Pioneer 10/11) — animated dashed lines radiating outward
- Dedicated `kuiperbelt` and `spacecraft` scenes remain for focused deep-dive mode
- Solar scene becomes the true hub

---

### 3. Time Controls

Every serious orrery has playback control. Currently there is no way to pause or change speed without the terminal.

- `Space` → pause / resume
- Speed slider in the HUD: `0.1×` `1×` `10×` `50×` `200×`
- Current speed indicator always visible
- Time direction toggle (run backwards)

---

### 4. Responsive Canvas

The fixed `1200×1200px .space` container breaks on small screens. Scale it to `min(100vw, 100vh)` so the simulation fills any screen correctly.

---

### 5. Scale Toggle

- `S` key → switch between **Visual scale** (current — bodies enlarged to be visible) and **Realistic scale** (true proportions — shows how empty space really is)
- Dramatic effect: at realistic scale the planets nearly disappear against the Sun

---

### 6. URL Hash State

Make scenes shareable/linkable:
- `index.html#solar`, `index.html#blackholes`, `index.html#kuiperbelt`
- On load, read hash and switch to that scene automatically
- Update hash on every scene switch

---

## Priority Order

1. **Real textures** — biggest visual impact, least code change
2. **Kuiper Belt + Spacecraft layers** — makes solar scene feel complete
3. **Time controls** — the #1 missing simulation feature
4. Responsive canvas
5. Scale toggle
6. URL hash state
