/**
 * Effets sonores synthétisés via l'API Web Audio : aucun fichier audio, donc
 * 100 % hors-ligne. L'AudioContext est créé paresseusement (au premier son,
 * après une interaction utilisateur) pour respecter les politiques des
 * navigateurs. Les appels échouent silencieusement si l'audio est indisponible.
 */
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

function tone(freq: number, durationMs: number, type: OscillatorType = 'sine', startAt = 0): void {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + startAt;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(0.07, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durationMs / 1000);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + durationMs / 1000);
}

/** Bonne réponse : deux notes ascendantes. */
export function playCorrect(): void {
  tone(660, 110, 'sine', 0);
  tone(990, 150, 'sine', 0.1);
}

/** Mauvaise réponse : note grave et brève. */
export function playWrong(): void {
  tone(196, 220, 'sawtooth', 0);
}

/** Fin de partie : petit arpège. */
export function playFinish(): void {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 160, 'triangle', i * 0.12));
}

/** Vibration tactile (API Vibration web, supportée surtout sur Android ; ignorée sinon). */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern);
  }
}
