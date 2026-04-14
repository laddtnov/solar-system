# Universe Simulation Roadmap (30 Days)

This roadmap turns the project into an interactive "book + simulation" platform while keeping the current solar system stable.

## Guiding Rules

- Keep the app playable offline first.
- Use trusted scientific sources only.
- Use local snapshots as fallback when internet sync fails.
- Add features in small slices so every week ships something visible.

## Phase 1 (Days 1-7): Data Foundation + Roadmap Lock

Goal: prepare a reliable data layer without breaking current simulation behavior.

1. Add a `DataService` module:
   - loads local snapshot data
   - reads/writes cached synced data
   - emits status events (`data:ready`, `data:sync:start`, `data:sync:done`, `data:sync:error`)
2. Keep `planetData` as default fallback.
3. Add first source adapter:
   - NASA Exoplanet Archive summary endpoint/query
4. Add metadata fields to synced payload:
   - `source`
   - `sourceUrl`
   - `syncedAt`
   - `version`
5. Add terminal-level sync trigger (next phase wiring):
   - command target: `sync data`

Deliverable:
- Data layer exists and can sync without breaking the current UI.

## Phase 2 (Days 8-14): Command Center + Interactivity

Goal: make users actively operate the simulation.

1. Add `EventBus` usage across modules (`ui`, `simulation`, `data`, `audio`).
2. Add terminal commands:
   - `help`
   - `focus <body>`
   - `speed <1|10|50|200>`
   - `pause`
   - `resume`
   - `trails <on|off>`
   - `sync data`
3. Add "Focus Mode" camera:
   - smooth center on selected body
   - smooth zoom presets
4. Save session preferences:
   - speed
   - selected body
   - sound
   - trails

Deliverable:
- User can control the universe through commands, not only clicking.

## Phase 3 (Days 15-21): Universe Book Mode (MVP)

Goal: convert the project into a narrative learning experience.

1. Add chapter engine:
   - chapter title
   - story blocks
   - interactive mission steps
2. Initial chapters:
   - Birth of the Solar System
   - Life Cycle of Stars
   - Stellar Remnants (white dwarf, neutron star, black hole)
3. Add progress persistence:
   - current chapter
   - completed missions
4. Add "mission feedback" panel in terminal style.

Deliverable:
- First playable educational chapter flow.

## Phase 4 (Days 22-30): Deep Space Expansion

Goal: introduce new object classes and multi-scene structure.

1. Add `SceneManager`:
   - Solar System scene
   - Stellar Remnants Lab scene
   - Exoplanet Systems scene (starter)
2. Add object presets:
   - white dwarf
   - neutron star
   - black hole
3. Add source adapters (read-only sync):
   - GWOSC (compact-object merger events)
   - ATNF Pulsar Catalogue metadata links
   - NED/SIMBAD references for object cards
4. Add source attribution in each data card.

Deliverable:
- Multi-scene universe with trusted source-backed metadata.

## Quality Checklist (Every Phase)

1. No feature ships without fallback behavior.
2. Every new module is ES module based.
3. No inline event handlers in HTML for new features.
4. Terminal theme remains monochrome green first.
5. Performance remains smooth on mobile.

## Immediate Next 3 Tasks

1. Implement `DataService` foundation.
2. Wire app bootstrap to expose data sync state.
3. Add first sync command entry point in terminal workflow.
