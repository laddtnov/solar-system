/**
 * DateCalculator.js
 * Computes approximate heliocentric 2D positions of solar system planets
 * for any given date using Keplerian orbital elements (J2000.0 epoch).
 *
 * Source: JPL "Keplerian Elements for Approximate Positions of the Major Planets"
 * Accuracy: ~1–2° ecliptic longitude (good for visual purposes)
 *
 * All angles internally in degrees, converted to radians as needed.
 * Output positions are in pixels (Earth orbit = 150px = 1 AU).
 */

// Pixels per Astronomical Unit — matches Earth's orbitRadius in bodyConfig
export const PX_PER_AU = 150

// J2000.0 Julian Date
const J2000 = 2451545

/**
 * Orbital elements at J2000.0 epoch:
 * [a (AU), e, L0 (° mean longitude), n (°/day mean motion), omega (° longitude of perihelion)]
 */
const ELEMENTS = {
  mercury: [0.3871,   0.20563,  252.251,  4.09234,  77.457],
  venus:   [0.72333,  0.00677,  181.979,  1.60214, 131.532],
  earth:   [1,        0.01671,  100.464,  0.98565, 102.937],
  mars:    [1.52366,  0.0934,   355.433,  0.52403, 336.06 ],
  jupiter: [5.20336,  0.04839,   34.396,  0.08309,  14.728],
  saturn:  [9.53707,  0.05415,   49.954,  0.03346,  92.598],
  uranus:  [19.1913,  0.04717,  313.232,  0.01176, 170.958],
  neptune: [30.069,   0.00859,  304.88,   0.00599,  44.971],
  pluto:   [39.4821,  0.24882,  238.929,  0.00397, 224.073],
}

/** Convert degrees to radians */
function rad(deg) { return deg * Math.PI / 180 }

/** Normalize angle to [0, 360) */
function norm(deg) { return ((deg % 360) + 360) % 360 }

/**
 * Solve Kepler's equation  E - e*sin(E) = M
 * via Newton-Raphson iteration (converges in < 10 steps for e < 0.25)
 * @param {number} M  mean anomaly in radians
 * @param {number} e  orbital eccentricity
 * @returns {number}  eccentric anomaly in radians
 */
function solveKepler(M, e) {
  let E = M
  for (let i = 0; i < 12; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
    E -= dE
    if (Math.abs(dE) < 1e-9) break
  }
  return E
}

/**
 * Convert a JS Date to Julian Date number.
 */
export function dateToJulian(date) {
  // JS timestamps are milliseconds since Unix epoch (Jan 1 1970 = JD 2440587.5)
  return date.getTime() / 86400000 + 2440587.5
}

/**
 * Compute the 2D heliocentric position (ecliptic plane projection) of a planet.
 * @param {string} planetId   key matching ELEMENTS (e.g. 'earth')
 * @param {number} julianDate
 * @returns {{ x: number, y: number }} position in pixels, Sun at (0,0)
 */
export function computePosition(planetId, julianDate) {
  const el = ELEMENTS[planetId]
  if (!el) return null

  const [a, e, L0, n, omega] = el
  const dt = julianDate - J2000

  // Mean longitude at given date, then mean anomaly
  const L = norm(L0 + n * dt)
  const M = rad(norm(L - omega))

  // Eccentric anomaly
  const E = solveKepler(M, e)

  // True anomaly
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  )

  // Heliocentric distance (AU)
  const r = a * (1 - e * Math.cos(E))

  // Ecliptic longitude (radians)
  const lambda = nu + rad(omega)

  // 2D heliocentric coordinates in pixels
  // NOTE: y is negated so increasing longitude goes counter-clockwise
  // (matches CSS coordinate system where y increases downward)
  return {
    x:  r * Math.cos(lambda) * PX_PER_AU,
    y: -r * Math.sin(lambda) * PX_PER_AU,
  }
}

/**
 * Compute positions for all planets for a given date.
 * @param {Date} date  JavaScript Date object
 * @returns {Object}   { planetId: { x, y } }
 */
export function computeAllPositions(date) {
  const jd = dateToJulian(date)
  const result = {}
  for (const id of Object.keys(ELEMENTS)) {
    result[id] = computePosition(id, jd)
  }
  return result
}

/**
 * Format a date for display (e.g. "15 Apr 2030")
 */
export function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}
