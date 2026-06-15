# Geo-QUIZZ

Application de quizz géographique (PWA) jouable au navigateur et sur smartphone,
**hors-ligne**, avec données embarquées.

## Modes de jeu

- **Capitale — QCM** : choisir la capitale parmi 4 propositions.
- **Capitale — Saisie** : écrire la capitale (tolérance aux accents / fautes mineures).
- **Drapeau — QCM** : reconnaître le drapeau d'un pays parmi 4.
- **Drapeau — Saisie** : nommer le pays à partir de son drapeau.
- **Situer un pays** : placer un pays sur la carte du monde.
- **Situer une ville** : placer une ville sur la carte du monde.

D'autres modes s'ajoutent facilement (voir « Ajouter un mode »).

## Stack technique

| Domaine | Choix |
| --- | --- |
| Langage / UI | TypeScript + React 18 |
| Build / dev | Vite |
| PWA (offline, installable) | vite-plugin-pwa (Workbox) |
| Style | Tailwind CSS |
| Navigation | React Router (HashRouter) |
| État / scores | Zustand (persisté en localStorage) |
| Cartes | MapLibre GL JS |
| Données pays / drapeaux | `world-countries` + `flag-icons` (embarqués) |
| Tests | Vitest + Testing Library |

L'app web pourra être empaquetée en application native iOS/Android via **Capacitor**
sans réécriture (étape ultérieure).

## Démarrage

```bash
npm install
npm run dev        # serveur de développement
npm run build      # vérification TypeScript + build de production
npm run preview    # prévisualiser le build (test PWA / offline)
npm run test       # tests unitaires
npm run lint       # ESLint
```

## Structure

```
src/
  data/        countries.ts (depuis world-countries), cities.ts
  engine/      types.ts (GameMode, Question…), generate.ts, check.ts
  modes/       un fichier par mode + index.ts (registre)
  components/  MultipleChoice, FreeTextInput, MapPicker, FlagImage, ScoreBar
  pages/       Home, ModeSelect, Game, Results
  store/       useGameStore (Zustand)
  lib/         normalize, levenshtein, shuffle, geo (haversine)
```

## Ajouter un mode

1. Créer `src/modes/mon-mode.ts` qui exporte un objet `GameMode`
   (`id`, `label`, `description`, `icon`, `inputType`, `generate()`).
2. L'ajouter au tableau `gameModes` dans `src/modes/index.ts`.

L'écran de sélection et le moteur de partie le prennent en compte automatiquement.
La validation des réponses est générique (`engine/check.ts`) selon `inputType`
(`multiple-choice`, `free-text`, `map-pin`).

## Limites connues / pistes

- Le fond de carte utilise les tuiles raster OpenStreetMap (réseau requis pour
  l'affichage de la carte). Les **données du quiz** sont 100 % locales ; un fond
  de carte vectoriel entièrement hors-ligne est une amélioration prévue.
- Le bundle initial inclut MapLibre ; un découpage (lazy-load des modes carte)
  réduirait le poids au premier chargement.
