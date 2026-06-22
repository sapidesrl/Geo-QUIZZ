# Geo-QUIZZ

Application de quizz géographique (PWA) jouable au navigateur et sur smartphone,
**hors-ligne**, avec données embarquées.

## Modes de jeu

- **Capitale — QCM** : choisir la capitale parmi 4 propositions.
- **Capitale — Saisie** : écrire la capitale (tolérance aux accents / fautes mineures).
- **Capitale → Pays — QCM** : retrouver le pays à partir de sa capitale.
- **Drapeau — QCM** : reconnaître le drapeau d'un pays parmi 4.
- **Drapeau — Saisie** : nommer le pays à partir de son drapeau.
- **Continent — QCM** : trouver le continent d'un pays.
- **Le plus grand — QCM** : parmi 4 pays, désigner le plus vaste.
- **Le plus peuplé — QCM** : parmi 4 pays, désigner le plus peuplé.
- **Le moins peuplé — QCM** : parmi 4 pays, désigner le moins peuplé.
- **Situer un pays** : placer un pays sur la carte du monde.
- **Situer une ville** : placer une ville sur la carte du monde.
- **Coupe du monde 2026** : situer les villes hôtes du Mondial (USA, Canada, Mexique).

Les données de population sont embarquées (`src/data/populations.ts`, généré par
`scripts/generate-populations.mjs` à partir du jeu de données ouvert `country-json`).

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
| Cartes | MapLibre GL JS (fond vectoriel hors-ligne) |
| Données pays / drapeaux / géométrie | `world-countries` + `flag-icons` + `world-atlas` (embarqués) |
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

## Hors-ligne

- Le fond de carte est **vectoriel et embarqué** (géométrie Natural Earth 110m via
  `world-atlas`, rendue par MapLibre) : aucune connexion ni serveur de tuiles requis.
- MapLibre et la géométrie monde sont **chargés à la demande** (lazy-load) : ils
  ne pèsent sur le téléchargement que lorsqu'on lance un mode carte.
- Toutes les données (pays, capitales, drapeaux, villes) sont locales et précachées
  par le service worker.

## Applications natives (Capacitor)

Les projets natifs `android/` et `ios/` sont versionnés ; le code web buildé (`dist/`)
y est injecté par Capacitor. Pré-requis : Android Studio (Android) et Xcode + CocoaPods
sur macOS (iOS).

```bash
# Après une modification du code web :
npm run cap:sync            # build web + copie dans les projets natifs

# Ouvrir le projet natif dans l'IDE pour compiler / lancer / publier :
npm run cap:android         # build + sync + ouvre Android Studio
npm run cap:ios             # build + sync + ouvre Xcode (macOS)
```

App id : `com.geoquizz.app` (voir `capacitor.config.ts`). Le routage utilise
`HashRouter`, compatible avec le service de fichiers natif de Capacitor.

### Icônes et écran de démarrage

Les images sources (logo globe) sont générées par script, puis déclinées pour
chaque plateforme par `@capacitor/assets` :

```bash
node scripts/generate-source-assets.mjs   # (re)génère assets/*.png et public/pwa-*.png
npx capacitor-assets generate --ios --android   # décline icônes + splash natifs
```

- `scripts/generate-source-assets.mjs` produit les sources (icône, avant-plan/
  arrière-plan adaptatifs Android, splash clair/sombre) et les icônes PWA.
- Le splash natif est masqué à la fin du chargement (`@capacitor/splash-screen`,
  `launchAutoHide: false` + `SplashScreen.hide()` dans `src/main.tsx`).
- Modifier le logo = éditer le script puis relancer ces deux commandes.

## Pistes

- Frontières plus détaillées (50m) pour un placement plus précis.
- Icônes / écran de démarrage natifs (`@capacitor/assets`).
