import { describe, expect, it } from 'vitest';
import { checkAnswer, isTextCorrect } from './check';
import type { Question } from './types';

describe('isTextCorrect', () => {
  it('accepte la réponse exacte (insensible à la casse/accents)', () => {
    expect(isTextCorrect('paris', ['Paris'])).toBe(true);
    expect(isTextCorrect('PARIS', ['Paris'])).toBe(true);
    expect(isTextCorrect('mexico', ['México'])).toBe(true);
  });

  it('tolère une faute de frappe mineure sur les noms longs', () => {
    expect(isTextCorrect('washingtn', ['Washington'])).toBe(true);
    expect(isTextCorrect('bratislaba', ['Bratislava'])).toBe(true);
  });

  it('rejette une réponse trop éloignée', () => {
    expect(isTextCorrect('londres', ['Paris'])).toBe(false);
    expect(isTextCorrect('', ['Paris'])).toBe(false);
  });

  it('accepte plusieurs réponses possibles', () => {
    expect(isTextCorrect('germany', ['Allemagne', 'Germany'])).toBe(true);
  });
});

describe('checkAnswer', () => {
  it('valide un QCM', () => {
    const q: Question = {
      inputType: 'multiple-choice',
      prompt: '?',
      correctChoiceId: 'fr',
      answerLabel: 'Paris',
    };
    expect(checkAnswer(q, { kind: 'choice', choiceId: 'fr' }).correct).toBe(true);
    expect(checkAnswer(q, { kind: 'choice', choiceId: 'de' }).correct).toBe(false);
  });

  it('valide un placement carte selon la distance', () => {
    const q: Question = {
      inputType: 'map-pin',
      prompt: '?',
      target: { lat: 48.85, lng: 2.35, toleranceKm: 100, label: 'Paris' },
      answerLabel: 'Paris',
    };
    // Tout près de Paris
    const near = checkAnswer(q, { kind: 'point', lat: 48.9, lng: 2.4 });
    expect(near.correct).toBe(true);
    expect(near.distanceKm).toBeLessThan(100);
    // Londres : trop loin
    const far = checkAnswer(q, { kind: 'point', lat: 51.5, lng: -0.12 });
    expect(far.correct).toBe(false);
  });
});
