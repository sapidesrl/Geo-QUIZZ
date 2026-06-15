/**
 * Normalise une chaîne pour comparer des réponses libres :
 * minuscules, sans accents/diacritiques, sans ponctuation superflue,
 * espaces normalisés. "Saint-Pétersbourg" -> "saint petersbourg".
 */
export function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacritiques
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}
