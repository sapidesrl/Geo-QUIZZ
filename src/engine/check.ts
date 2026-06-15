import { haversineKm } from '../lib/geo';
import { levenshtein } from '../lib/levenshtein';
import { normalize } from '../lib/normalize';
import type { Answer, Question } from './types';

/** Tolérance de faute de frappe selon la longueur de la réponse attendue. */
function allowedTypos(length: number): number {
  if (length <= 4) return 0;
  if (length <= 8) return 1;
  return 2;
}

/** Vrai si la saisie libre correspond à l'une des réponses acceptées. */
export function isTextCorrect(value: string, accepted: string[]): boolean {
  const guess = normalize(value);
  if (!guess) return false;
  return accepted.some((answer) => {
    const target = normalize(answer);
    if (guess === target) return true;
    return levenshtein(guess, target) <= allowedTypos(target.length);
  });
}

/**
 * Évalue une réponse face à une question. Générique : fonctionne pour tous les
 * modes selon `question.inputType`. Renvoie un résultat de correction.
 */
export function checkAnswer(
  question: Question,
  answer: Answer,
): { correct: boolean; distanceKm?: number } {
  switch (question.inputType) {
    case 'multiple-choice':
      if (answer.kind !== 'choice') return { correct: false };
      return { correct: answer.choiceId === question.correctChoiceId };

    case 'free-text':
      if (answer.kind !== 'text') return { correct: false };
      return { correct: isTextCorrect(answer.value, question.acceptedAnswers ?? []) };

    case 'map-pin': {
      if (answer.kind !== 'point' || !question.target) return { correct: false };
      const distanceKm = haversineKm(answer, question.target);
      return { correct: distanceKm <= question.target.toleranceKm, distanceKm };
    }
  }
}
