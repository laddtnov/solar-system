// ── Quiz.js — Daily Space Facts True/False Game ────────────────────────────

const STORAGE_KEY = 'space_quiz_v1'
const FACTS_PER_DAY = 10

// ── Full fact pool ─────────────────────────────────────────────────────────
// { statement, answer: true|false, source }
const FACT_POOL = [
  // TRUE facts
  { statement: 'The Sun contains 99.8% of the entire solar system\'s mass.', answer: true, source: 'Sun' },
  { statement: 'A day on Venus is longer than a full year on Venus.', answer: true, source: 'Venus' },
  { statement: 'Saturn\'s density is so low it would float on water.', answer: true, source: 'Saturn' },
  { statement: 'Jupiter has more than 90 known moons.', answer: true, source: 'Jupiter' },
  { statement: 'Neutron stars can rotate more than 700 times per second.', answer: true, source: 'Neutron Stars' },
  { statement: 'The Milky Way and Andromeda galaxy are on a collision course.', answer: true, source: 'Galaxies' },
  { statement: 'Light from the Sun takes about 8 minutes to reach Earth.', answer: true, source: 'Sun' },
  { statement: 'Charon, Pluto\'s moon, is almost half the size of Pluto itself.', answer: true, source: 'Pluto' },
  { statement: 'Olympus Mons on Mars is the tallest volcano in the solar system.', answer: true, source: 'Mars' },
  { statement: 'Jupiter\'s Great Red Spot is a storm that has lasted over 350 years.', answer: true, source: 'Jupiter' },
  { statement: 'Uranus rotates on its side — its axial tilt is about 98 degrees.', answer: true, source: 'Uranus' },
  { statement: 'Voyager 1 is the most distant human-made object ever launched.', answer: true, source: 'Spacecraft' },
  { statement: 'Betelgeuse is so large it would engulf the orbit of Jupiter if placed at our Sun.', answer: true, source: 'Supergiants' },
  { statement: 'A comet\'s tail always points away from the Sun, not behind its direction of travel.', answer: true, source: 'Solar System' },
  { statement: 'The asteroid belt contains over 1.3 million catalogued asteroids.', answer: true, source: 'Asteroid Belt' },
  { statement: 'Mercury has the most extreme temperature swings of any planet — over 600°C difference.', answer: true, source: 'Mercury' },
  { statement: 'Proxima Centauri, the closest star to our Sun, is a red dwarf.', answer: true, source: 'Red Dwarfs' },
  { statement: 'White dwarfs are roughly the size of Earth but contain as much mass as the Sun.', answer: true, source: 'White Dwarfs' },
  { statement: 'The Kuiper Belt extends from roughly Neptune\'s orbit to about 50 AU from the Sun.', answer: true, source: 'Kuiper Belt' },

  // FALSE facts (plausible misconceptions)
  { statement: 'Venus is the closest planet to the Sun.', answer: false, source: 'Solar System' },
  { statement: 'The Sun is powered by fire — a massive continuous combustion reaction.', answer: false, source: 'Sun' },
  { statement: 'Saturn is the only planet in the solar system with rings.', answer: false, source: 'Saturn' },
  { statement: 'The Milky Way is the largest known galaxy in the universe.', answer: false, source: 'Galaxies' },
  { statement: 'Black holes act like cosmic vacuum cleaners, pulling in everything nearby.', answer: false, source: 'Black Holes' },
  { statement: 'The asteroid belt is so densely packed that spacecraft must navigate carefully to survive.', answer: false, source: 'Asteroid Belt' },
  { statement: 'Jupiter is a failed star — it nearly had enough mass to ignite fusion.', answer: false, source: 'Jupiter' },
  { statement: 'Sound travels faster in the vacuum of space than on Earth.', answer: false, source: 'Space' },
  { statement: 'Neutron stars are roughly the same size as the Sun.', answer: false, source: 'Neutron Stars' },
  { statement: 'There are 9 planets in our solar system.', answer: false, source: 'Solar System' },
  { statement: 'New Horizons was the first spacecraft to fly through the asteroid belt.', answer: false, source: 'Spacecraft' },
  { statement: 'The Moon has no gravitational pull whatsoever.', answer: false, source: 'Moon' },
]

// ── Date seeding helpers ────────────────────────────────────────────────────

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/** Simple deterministic shuffle using a numeric seed */
function seededShuffle(arr, seed) {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function getDailyFacts() {
  const key = getTodayKey()
  // Convert date string to numeric seed
  const seed = key.split('-').reduce((acc, n) => acc * 100 + parseInt(n), 0)
  return seededShuffle(FACT_POOL, seed).slice(0, FACTS_PER_DAY)
}

// ── localStorage ───────────────────────────────────────────────────────────

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function isCompletedToday() {
  const state = loadState()
  return state.completedDate === getTodayKey()
}

function getLastScore() {
  const n = parseInt(loadState().score, 10)
  return Number.isFinite(n) ? Math.max(0, Math.min(n, FACTS_PER_DAY)) : 0
}

// ── Time until midnight (ms) ───────────────────────────────────────────────

function msUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight - now
}

function formatCountdown(ms) {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ── Quiz state ─────────────────────────────────────────────────────────────

let facts = []
let currentIndex = 0
let score = 0
let countdownInterval = null
let isOpen = false

// ── DOM helpers ────────────────────────────────────────────────────────────

function getModal()   { return document.getElementById('quiz-modal') }
function getOverlay() { return document.getElementById('quiz-overlay') }

function openModal() {
  getModal().style.display = 'flex'
  getOverlay().style.display = 'block'
  isOpen = true
}

function closeModal() {
  getModal().style.display = 'none'
  getOverlay().style.display = 'none'
  isOpen = false
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// ── Render phases ──────────────────────────────────────────────────────────

function renderQuestion() {
  const fact = facts[currentIndex]
  const modal = getModal()
  modal.innerHTML = `
    <button class="quiz-close" id="quiz-close-btn">&#10005;</button>
    <div class="quiz-label">// SPACE FACTS — TRUE OR FALSE</div>
    <div class="quiz-progress">${currentIndex + 1} / ${FACTS_PER_DAY}</div>
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width:${(currentIndex / FACTS_PER_DAY) * 100}%"></div>
    </div>
    <div class="quiz-source">${fact.source.toUpperCase()}</div>
    <div class="quiz-statement">${fact.statement}</div>
    <div class="quiz-actions">
      <button class="quiz-btn quiz-true" data-answer="true">&#10003; TRUE</button>
      <button class="quiz-btn quiz-false" data-answer="false">&#10007; FALSE</button>
    </div>
  `
  modal.querySelector('#quiz-close-btn').addEventListener('click', closeModal)
  modal.querySelector('.quiz-true').addEventListener('click',  () => handleAnswer(true))
  modal.querySelector('.quiz-false').addEventListener('click', () => handleAnswer(false))
}

function renderFeedback(userAnswer) {
  const fact = facts[currentIndex]
  const correct = userAnswer === fact.answer
  const modal = getModal()

  // Flash the answer colour on the buttons, then advance
  const btn = modal.querySelector(userAnswer ? '.quiz-true' : '.quiz-false')
  if (btn) {
    btn.classList.add(correct ? 'quiz-correct' : 'quiz-wrong')
    btn.style.pointerEvents = 'none'
    const other = modal.querySelector(userAnswer ? '.quiz-false' : '.quiz-true')
    if (other) other.style.opacity = '0.3'
  }

  // Show small feedback line
  const actions = modal.querySelector('.quiz-actions')
  const fb = document.createElement('div')
  fb.className = `quiz-feedback ${correct ? 'correct' : 'wrong'}`
  fb.textContent = correct ? '✓ Correct!' : `✗ False — the correct answer was ${fact.answer ? 'TRUE' : 'FALSE'}.`
  actions.after(fb)

  setTimeout(() => {
    if (correct) score++
    currentIndex++
    if (currentIndex >= FACTS_PER_DAY) {
      renderResults()
    } else {
      renderQuestion()
    }
  }, 1000)
}

function renderResults() {
  // Persist
  saveState({ completedDate: getTodayKey(), score })

  const pct = Math.round((score / FACTS_PER_DAY) * 100)
  let grade = ''
  if (pct === 100) grade = 'PERFECT — ASTRONOMER CLASS'
  else if (pct >= 80) grade = 'EXCELLENT — SPACE CADET'
  else if (pct >= 60) grade = 'GOOD — GROUND CONTROL'
  else grade = 'KEEP EXPLORING'

  const modal = getModal()
  modal.innerHTML = `
    <button class="quiz-close" id="quiz-close-btn">&#10005;</button>
    <div class="quiz-label">// MISSION COMPLETE</div>
    <div class="quiz-score-display">${score}<span class="quiz-score-denom">/${FACTS_PER_DAY}</span></div>
    <div class="quiz-grade">${grade}</div>
    <div class="quiz-pct">${pct}% accuracy</div>
    <div class="quiz-divider"></div>
    <div class="quiz-next-label">NEXT MISSION IN</div>
    <div class="quiz-countdown" id="quiz-countdown">${formatCountdown(msUntilMidnight())}</div>
  `
  modal.querySelector('#quiz-close-btn').addEventListener('click', closeModal)
  startCountdown()
}

function renderAlreadyDone() {
  const score = getLastScore()
  const modal = getModal()
  modal.innerHTML = `
    <button class="quiz-close" id="quiz-close-btn">&#10005;</button>
    <div class="quiz-label">// TODAY'S MISSION COMPLETE</div>
    <div class="quiz-score-display">${score}<span class="quiz-score-denom">/${FACTS_PER_DAY}</span></div>
    <div class="quiz-pct">Return tomorrow for a new set of facts.</div>
    <div class="quiz-divider"></div>
    <div class="quiz-next-label">NEXT MISSION IN</div>
    <div class="quiz-countdown" id="quiz-countdown">${formatCountdown(msUntilMidnight())}</div>
  `
  modal.querySelector('#quiz-close-btn').addEventListener('click', closeModal)
  startCountdown()
}

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    const el = document.getElementById('quiz-countdown')
    const ms = msUntilMidnight()
    if (el) el.textContent = formatCountdown(ms)
    if (ms <= 0) {
      clearInterval(countdownInterval)
      if (isOpen) {
        // New day — reset and show fresh quiz
        startQuiz()
      }
    }
  }, 1000)
}

// ── Core flow ──────────────────────────────────────────────────────────────

function handleAnswer(userAnswer) {
  renderFeedback(userAnswer)
}

function startQuiz() {
  facts = getDailyFacts()
  currentIndex = 0
  score = 0
  openModal()

  if (isCompletedToday()) {
    renderAlreadyDone()
  } else {
    renderQuestion()
  }
}

// ── Public init ────────────────────────────────────────────────────────────

export function initQuiz() {
  // Inject modal + overlay into DOM
  if (!document.getElementById('quiz-modal')) {
    const overlay = document.createElement('div')
    overlay.id = 'quiz-overlay'
    overlay.style.display = 'none'
    overlay.addEventListener('click', closeModal)
    document.body.appendChild(overlay)

    const modal = document.createElement('div')
    modal.id = 'quiz-modal'
    modal.style.display = 'none'
    document.body.appendChild(modal)
  }

  // Button
  const btn = document.getElementById('quiz-btn')
  if (btn) btn.addEventListener('click', startQuiz)

  // Keyboard shortcut G
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return
    if (e.key === 'g' || e.key === 'G') {
      if (isOpen) closeModal()
      else startQuiz()
    }
    if (e.key === 'Escape' && isOpen) closeModal()
  })
}
