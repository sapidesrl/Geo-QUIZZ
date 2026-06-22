import { describe, expect, it } from 'vitest';
import { checkAnswer } from '../engine/check';
import { gameModes } from './index';

describe('gameModes', () => {
  it('chaque mode génère des questions cohérentes et auto-validables', () => {
    for (const mode of gameModes) {
      // Plusieurs tirages pour couvrir l'aléatoire.
      for (let i = 0; i < 20; i++) {
        const q = mode.generate();
        expect(q.inputType).toBe(mode.inputType);
        expect(q.answerLabel).toBeTruthy();

        if (q.inputType === 'multiple-choice') {
          const ids = q.choices?.map((c) => c.id) ?? [];
          expect(ids.length).toBeGreaterThanOrEqual(2);
          expect(new Set(ids).size).toBe(ids.length); // pas de doublons
          expect(ids).toContain(q.correctChoiceId);
          expect(
            checkAnswer(q, { kind: 'choice', choiceId: q.correctChoiceId! }).correct,
          ).toBe(true);
        } else if (q.inputType === 'free-text') {
          expect(q.acceptedAnswers?.length ?? 0).toBeGreaterThan(0);
          expect(checkAnswer(q, { kind: 'text', value: q.acceptedAnswers![0] }).correct).toBe(
            true,
          );
        } else {
          expect(q.target).toBeTruthy();
          expect(
            checkAnswer(q, { kind: 'point', lat: q.target!.lat, lng: q.target!.lng }).correct,
          ).toBe(true);
        }
      }
    }
  });
});
