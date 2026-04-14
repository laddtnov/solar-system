import { planetData } from '../data.js'

const CACHE_KEY = 'universe-data-cache-v1'
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 3

const SOURCES = {
  exoplanets: {
    id: 'nasa-exoplanet-archive',
    label: 'NASA Exoplanet Archive',
    sourceUrl: 'https://exoplanetarchive.ipac.caltech.edu/',
    queryUrl:
      'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+count(*)+as+planet_count+from+pscomppars&format=json',
  },
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export class DataService {
  constructor({ bus, storage = window.localStorage, fetchImpl = window.fetch } = {}) {
    this.bus = bus
    this.storage = storage
    this.fetchImpl = fetchImpl
    this.snapshot = null
  }

  bootstrap() {
    const cached = this._readCache()
    if (cached && this._isCacheFresh(cached)) {
      this.snapshot = cached
      this._emit('data:ready', { mode: 'cache', snapshot: cached })
      return cached
    }

    const local = this._buildLocalSnapshot()
    this.snapshot = local
    this._emit('data:ready', { mode: 'local', snapshot: local })
    return local
  }

  getSnapshot() {
    if (!this.snapshot) return this.bootstrap()
    return this.snapshot
  }

  async sync() {
    const localBase = this._buildLocalSnapshot()
    this._emit('data:sync:start', { startedAt: new Date().toISOString() })

    try {
      const exoplanetSummary = await this._fetchExoplanetSummary()
      const merged = {
        ...localBase,
        meta: {
          ...localBase.meta,
          mode: 'synced',
          syncedAt: new Date().toISOString(),
          sources: [
            ...localBase.meta.sources,
            {
              id: SOURCES.exoplanets.id,
              label: SOURCES.exoplanets.label,
              sourceUrl: SOURCES.exoplanets.sourceUrl,
              queryUrl: SOURCES.exoplanets.queryUrl,
              syncedAt: new Date().toISOString(),
            },
          ],
        },
        live: {
          exoplanetSummary,
        },
      }

      this.snapshot = merged
      this._writeCache(merged)
      this._emit('data:sync:done', { snapshot: merged })
      return merged
    } catch (error) {
      this.snapshot = localBase
      this._emit('data:sync:error', {
        message: 'Sync failed. Using local snapshot.',
        error,
      })
      return localBase
    }
  }

  _buildLocalSnapshot() {
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      meta: {
        mode: 'local',
        source: 'embedded',
        sources: [
          {
            id: 'local-planet-data',
            label: 'Embedded Solar Data',
            sourceUrl: 'local://js/data.js',
            syncedAt: null,
          },
        ],
      },
      solarSystem: clone(planetData),
      live: {},
    }
  }

  async _fetchExoplanetSummary() {
    const source = SOURCES.exoplanets
    const response = await this.fetchImpl(source.queryUrl)
    if (!response.ok) {
      throw new Error(`Exoplanet source failed: ${response.status}`)
    }

    const data = await response.json()
    const firstRow = Array.isArray(data) ? data[0] : null
    const planetCount = firstRow?.planet_count ?? null

    return {
      sourceId: source.id,
      sourceLabel: source.label,
      sourceUrl: source.sourceUrl,
      queryUrl: source.queryUrl,
      confirmedPlanetCount: planetCount,
      receivedAt: new Date().toISOString(),
    }
  }

  _isCacheFresh(payload) {
    if (!payload?.meta?.syncedAt) return false
    const age = Date.now() - new Date(payload.meta.syncedAt).getTime()
    return Number.isFinite(age) && age <= CACHE_TTL_MS
  }

  _readCache() {
    try {
      const raw = this.storage.getItem(CACHE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  _writeCache(payload) {
    try {
      this.storage.setItem(CACHE_KEY, JSON.stringify(payload))
    } catch {
      // Ignore write failures (e.g. private mode / quota)
    }
  }

  _emit(eventName, payload) {
    if (!this.bus) return
    this.bus.emit(eventName, payload)
  }
}
